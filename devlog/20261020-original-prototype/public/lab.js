const $=id=>document.getElementById(id);
let config;
const decodePem=pem=>Uint8Array.from(atob(pem.replace(/-----BEGIN [^-]+-----|-----END [^-]+-----|\s/g,'')),c=>c.charCodeAt(0));
const bytesToHex=bytes=>Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
const hexToBytes=hex=>new Uint8Array(hex.match(/.{2}/g).map(x=>parseInt(x,16)));
const sha=async bytes=>bytesToHex(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)));
const status=(id,message,error=false)=>{$(id).textContent=message;$(id).className='status'+(error?' err':'');};
async function load(){
 try{
  const r=await fetch('/api/config');if(!r.ok)throw Error('Server unavailable');config=await r.json();
  $('question').textContent=config.election.title;
  $('description').textContent=config.election.description;
  const target=$('choices');target.replaceChildren();
  for(const option of config.election.options){
    const l=document.createElement('label');l.className='choice';
    const input=document.createElement('input');input.type='radio';input.name='selection';input.value=option.id;input.required=true;
    const text=document.createElement('span');text.textContent=option.label;l.append(input,text);target.append(l);
  }
  await refreshResults();
 }catch(e){status('castStatus','Could not load experiment: '+e.message,true);}
}
$('ballot').addEventListener('submit',async e=>{
 e.preventDefault();if(!config)return;
 const choice=new FormData(e.target).get('selection');if(!choice)return;
 const button=$('submitVote');button.disabled=true;status('castStatus','Encrypting and submitting your experimental ballot…');
 try{
  const key=await crypto.subtle.importKey('spki',decodePem(config.encryptionPublicKey),{name:'RSA-OAEP',hash:'SHA-256'},false,['encrypt']);
  const plaintext=new TextEncoder().encode(JSON.stringify({electionId:config.election.id,choice,nonce:crypto.randomUUID()}));
  const cipher=new Uint8Array(await crypto.subtle.encrypt({name:'RSA-OAEP'},key,plaintext));
  const ciphertext=btoa(String.fromCharCode(...cipher));
  const calculatedReceipt=await sha(cipher);
  const result=await fetch('/api/vote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ciphertext})});
  const info=await result.json();if(!result.ok)throw Error(info.error||'Submission rejected');
  if(info.receipt!==calculatedReceipt)throw Error('Server returned an unexpected receipt!');
  const panel=$('castStatus');panel.className='status';panel.replaceChildren();
  const p=document.createElement('p');p.textContent=`Your UNOFFICIAL experimental ballot was submitted as record #${info.index}. Receipt:`;
  const code=document.createElement('div');code.className='receipt';code.textContent=info.receipt;
  const reminder=document.createElement('p');reminder.className='small';reminder.textContent='This does not cast a real ballot. Save your receipt to check ciphertext inclusion.';
  panel.append(p,code,reminder);$('receiptInput').value=info.receipt;
  await refreshResults();
 }catch(e){status('castStatus','Submission failed: '+e.message,true);}finally{button.disabled=false;}
});
async function verifyAll(){
 const resp=await fetch('/api/board');if(!resp.ok)throw Error('Could not download board');const {records}=await resp.json();
 const publicKey=await crypto.subtle.importKey('spki',decodePem(config.signingPublicKey),{name:'Ed25519'},false,['verify']);
 let prev='0'.repeat(64);
 for(let i=0;i<records.length;i++){
  const r=records[i];
  if(r.index!==i+1||r.previousHash!==prev)throw Error(`Chain broken at #${i+1}`);
  const body={index:r.index,previousHash:r.previousHash,ciphertext:r.ciphertext,receipt:r.receipt};
  const hash=await sha(new TextEncoder().encode(JSON.stringify(body)));
  if(hash!==r.hash)throw Error(`Hash mismatch at #${i+1}`);
  const sig=decodeBase64(r.signature);
  if(!(await crypto.subtle.verify({name:'Ed25519'},publicKey,sig,hexToBytes(hash))))throw Error(`Invalid signature at #${i+1}`);
  if((await sha(decodeBase64(r.ciphertext)))!==r.receipt)throw Error(`Receipt mismatch at #${i+1}`);
  prev=hash;
 }
 return {records,head:prev};
}
const decodeBase64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
$('verifyButton').addEventListener('click',async()=>{
 if(!config)return;
 status('verifyStatus','Checking signed record in your browser…');
 try{
  const receipt=$('receiptInput').value.trim().toLowerCase();if(receipt&&!/^[0-9a-f]{64}$/.test(receipt))throw Error('Enter a 64-digit hexadecimal receipt.');
  const {records}=await verifyAll();const found=records.find(x=>x.receipt===receipt);
  status('verifyStatus',`PASS: ${records.length} records have valid signatures and a consistent hash chain. ${receipt?found?`Your ciphertext receipt appears at record #${found.index}.`:'Your receipt was NOT found in this record.':'Enter a receipt to check inclusion.'} This does NOT verify the tally, intent, eligibility or the server’s honesty.` ,!!receipt&&!found);
 }catch(e){status('verifyStatus','Verification failed or unsupported in this browser: '+e.message,true);}
});
$('downloadButton').addEventListener('click',()=>{location.href='/api/board';});
$('refreshResults').addEventListener('click',refreshResults);
async function refreshResults(){
 try{
  const r=await fetch('/api/results');const info=await r.json();if(!r.ok)throw Error(info.error||'Unavailable');
  const area=$('totals');area.replaceChildren();const title=document.createElement('p');title.className='small';title.textContent=`${info.total} submissions (NOT unique voters). Server-computed results:`;area.append(title);
  for(const option of config.election.options){
    const count=info.counts[option.id]||0;const percent=info.total?Math.round(count/info.total*100):0;
    const stat=document.createElement('div');stat.className='stat';
    const name=document.createElement('span');name.textContent=option.label;const total=document.createElement('strong');total.textContent=String(count);stat.append(name,total);area.append(stat);
    const bar=document.createElement('div');bar.className='bar';const fill=document.createElement('span');fill.style.width=percent+'%';bar.append(fill);area.append(bar);
  }
 }catch(e){$('totals').textContent='Results unavailable: '+e.message;}
}
await load();
