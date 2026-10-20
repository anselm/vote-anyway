import { createApp } from './app.js';
import { postgresStore } from './store.js';
const store=process.env.DATABASE_URL?postgresStore(process.env.DATABASE_URL):null;
const app=await createApp({store,logger:true});
app.addHook('onClose',async()=>{await store?.close();});
await app.listen({port:Number(process.env.PORT||8080),host:'0.0.0.0'});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,async()=>{await app.close();process.exit(0);});
