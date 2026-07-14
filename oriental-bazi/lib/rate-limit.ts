const store = new Map<string,{count:number;reset:number}>();
export function checkRateLimit(key:string, limit=5, windowMs=60_000){const now=Date.now();const current=store.get(key);if(!current||current.reset<now){store.set(key,{count:1,reset:now+windowMs});return true}if(current.count>=limit)return false;current.count+=1;return true}

