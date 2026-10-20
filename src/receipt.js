export async function makeReceipt(choice){
  const nonce=Array.from(crypto.getRandomValues(new Uint8Array(32)),v=>v.toString(16).padStart(2,'0')).join('');
  const payload=JSON.stringify({election:'practice-01',choice,nonce});
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(payload));
  return {commitment:Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join(''),createdAt:new Date().toISOString()};
}
