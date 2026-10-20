import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import { fileURLToPath } from 'node:url';

export async function createApp({store=null,staticFiles=true,logger=false}={}) {
  const app=Fastify({logger,bodyLimit:4096,ajv:{customOptions:{removeAdditional:false}}});
  await app.register(helmet,{contentSecurityPolicy:{directives:{defaultSrc:["'self'"],scriptSrc:["'self'"],styleSrc:["'self'","'unsafe-inline'"],imgSrc:["'self'","data:"],connectSrc:["'self'"],objectSrc:["'none'"],frameAncestors:["'none'"]}}});
  await app.register(rateLimit,{max:60,timeWindow:'1 minute'});
  app.get('/api/health',async (_req,reply)=>{
    try { if(store) await store.health(); return {ok:true,storage:store?'postgres':'browser-only'}; }
    catch { return reply.code(503).send({ok:false,error:'Database unavailable'}); }
  });
  app.get('/api/config',async()=>({mode:'practice',persistent:!!store,electionId:'practice-01'}));
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
  if(staticFiles){
    await app.register(fastifyStatic,{root:fileURLToPath(new URL('../dist/',import.meta.url))});
    app.setNotFoundHandler((req,reply)=>req.url.startsWith('/api/')?reply.code(404).send({error:'Not found'}):reply.code(404).type('text/plain').send('Page not found'));
  }
  return app;
}
