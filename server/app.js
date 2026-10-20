import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'node:url';

export async function createApp({store=null,voting=null,authenticate=null,authService=null,staticFiles=true,logger=false}={}) {
  const app=Fastify({logger,bodyLimit:4096,ajv:{customOptions:{removeAdditional:false}}});
  await app.register(helmet,{contentSecurityPolicy:{directives:{defaultSrc:["'self'"],scriptSrc:["'self'"],styleSrc:["'self'","'unsafe-inline'"],imgSrc:["'self'","data:"],connectSrc:["'self'"],objectSrc:["'none'"],frameAncestors:["'none'"]}}});
  await app.register(rateLimit,{max:60,timeWindow:'1 minute'});
  app.addHook('preHandler',async(req,reply)=>{
    const protectedWrite=req.method==='POST'&&req.url.startsWith('/api/')&&req.url!=='/api/agent-requests';
    if(!protectedWrite&&!['/api/session','/api/agents'].includes(req.url))return;
    try{if(!authenticate)throw Object.assign(Error('Sign in with attest.monster to continue.'),{statusCode:401});req.identity=await authenticate(req);}
    catch(e){return reply.code(e.statusCode??503).send({error:e.statusCode?e.message:'Sign-in verification is temporarily unavailable.'});}
  });
  app.get('/api/session',async req=>({authenticated:true,handle:req.identity.handle,kind:req.identity.kind}));
  app.get('/api/health',async (_req,reply)=>{
    try { if(store) await store.health(); return {ok:true,storage:store?'postgres':'browser-only'}; }
    catch { return reply.code(503).send({ok:false,error:'Database unavailable'}); }
  });
  app.get('/api/config',async()=>({mode:voting?'encrypted-lab':'practice',persistent:!!store,electionId:voting?.config.election.id??'practice-01',...voting?.config}));
  const hash={type:'string',pattern:'^[a-f0-9]{64}$'};
  app.post('/api/receipts',{
    config:{rateLimit:{max:10,timeWindow:'1 minute'}},
    schema:{body:{type:'object',additionalProperties:false,required:['commitment'],properties:{commitment:hash}}}
  },async(req,reply)=>{
    if(!store) return reply.code(503).send({error:'Persistent receipts are not configured. Use the browser-only practice ballot.'});
    try { const record=await store.insert(req.body.commitment);return reply.code(201).send(record); }
    catch {return reply.code(503).send({error:'Receipt storage is temporarily unavailable. Your choice has not been sent.'});}
  });
  app.get('/api/receipts/:commitment',{
    schema:{params:{type:'object',required:['commitment'],properties:{commitment:hash}}}
  },async(req,reply)=>{
    if(!store)return reply.code(503).send({error:'Persistent receipts are not configured.'});
    try { const record=await store.find(req.params.commitment);return record??reply.code(404).send({error:'Receipt not found'}); }
    catch {return reply.code(503).send({error:'Receipt storage is temporarily unavailable.'});}
  });
  const lab=handler=>async(req,reply)=>{
    if(!voting)return reply.code(503).send({error:'The voting experiment is temporarily unavailable.'});
    try{return await handler(req,reply);}catch(e){return reply.code(e.statusCode??503).send({error:e.statusCode?e.message:'The voting experiment is temporarily unavailable. Please try again.'});}
  };
  app.post('/api/vote',{config:{rateLimit:{max:10,timeWindow:'1 minute'}},schema:{body:{type:'object',additionalProperties:false,required:['ciphertext'],properties:{ciphertext:{type:'string',minLength:150,maxLength:800}}}}},lab(async(req,reply)=>reply.code(201).send(await voting.submit(req.body.ciphertext))));
  app.get('/api/board',lab(()=>voting.board()));
  app.get('/api/results',lab(()=>voting.totals()));
  app.get('/api/receipt',{schema:{querystring:{type:'object',required:['receipt'],properties:{receipt:hash}}}},lab(req=>voting.find(req.query.receipt)));
  app.get('/api/signing-key.pem',lab((_req,reply)=>reply.type('text/plain').send(voting.config.signingPublicKey)));
  app.get('/api/topics',lab(()=>voting.listTopics()));
  app.post('/api/topics',{config:{rateLimit:{max:5,timeWindow:'1 hour'}},schema:{body:{type:'object',additionalProperties:false,required:['title','question','options'],properties:{title:{type:'string',minLength:1,maxLength:120},question:{type:'string',minLength:1,maxLength:500},options:{type:'array',minItems:2,maxItems:8,items:{type:'string',minLength:1,maxLength:120}}}}}},lab(async(req,reply)=>reply.code(201).send(await voting.createTopic(req.body))));
  const topicParams={type:'object',required:['id'],properties:{id:{type:'string',minLength:1,maxLength:80,pattern:'^[a-zA-Z0-9-]+$'}}};
  app.get('/api/topics/:id/config',{schema:{params:topicParams}},lab(async req=>({mode:'encrypted-lab',persistent:true,...await voting.getConfig(req.params.id)})));
  app.post('/api/topics/:id/vote',{config:{rateLimit:{max:10,timeWindow:'1 minute'}},schema:{params:topicParams,body:{type:'object',additionalProperties:false,required:['ciphertext'],properties:{ciphertext:{type:'string',minLength:150,maxLength:800}}}}},lab(async(req,reply)=>reply.code(201).send(await voting.submit(req.body.ciphertext,req.params.id))));
  app.get('/api/topics/:id/board',{schema:{params:topicParams}},lab(req=>voting.board(req.params.id)));
  app.get('/api/topics/:id/results',{schema:{params:topicParams}},lab(req=>voting.totals(req.params.id)));
  app.get('/api/topics/:id/receipt',{schema:{params:topicParams,querystring:{type:'object',required:['receipt'],properties:{receipt:hash}}}},lab(req=>voting.find(req.query.receipt,req.params.id)));
  app.get('/api/topics/:id/signing-key.pem',{schema:{params:topicParams}},lab(async(req,reply)=>reply.type('text/plain').send((await voting.getConfig(req.params.id)).signingPublicKey)));
  const scopes={type:'array',minItems:1,maxItems:2,uniqueItems:true,items:{type:'string',enum:['topics:create','votes:submit']}};
  const grantParams={type:'object',required:['id'],properties:{id:{type:'string',pattern:'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'}}};
  const agents=handler=>async(req,reply)=>{try{if(!authService)throw Object.assign(Error('Agent authorization unavailable.'),{statusCode:503});return await handler(req,reply);}catch(e){return reply.code(e.statusCode??503).send({error:e.statusCode?e.message:'Agent authorization unavailable.'});}};
  app.post('/api/agent-requests',{config:{rateLimit:{max:5,timeWindow:'1 hour'}},schema:{body:{type:'object',additionalProperties:false,required:['name','publicKey','scopes'],properties:{name:{type:'string',minLength:1,maxLength:60},purpose:{type:'string',maxLength:300},publicKey:{type:'object',additionalProperties:false,required:['x','y'],properties:{x:{type:'string',pattern:'^[A-Za-z0-9_-]{43}$'},y:{type:'string',pattern:'^[A-Za-z0-9_-]{43}$'}}},scopes}}}},agents(async(req,reply)=>reply.code(201).send(await authService.requestAgent(req.body))));
  app.get('/api/agent-requests/:id',{schema:{params:grantParams}},agents(req=>authService.getAgent(req.params.id)));
  app.post('/api/agent-requests/:id/approve',{schema:{params:grantParams,body:{type:'object',additionalProperties:false,required:['scopes'],properties:{scopes}}}},agents(req=>authService.approveAgent(req.params.id,req.identity,req.body.scopes)));
  app.get('/api/agents',agents(req=>authService.listAgents(req.identity)));
  app.post('/api/agents/:id/revoke',{schema:{params:grantParams}},agents(req=>authService.revokeAgent(req.params.id,req.identity)));
  if(staticFiles){
    await app.register(fastifyStatic,{root:fileURLToPath(new URL('../dist/',import.meta.url))});
    app.get('/topic/:id',(_req,reply)=>reply.sendFile('index.html'));
    app.setNotFoundHandler((req,reply)=>req.url.startsWith('/api/')?reply.code(404).send({error:'Not found'}):reply.code(404).type('text/plain').send('Page not found'));
  }
  return app;
}
