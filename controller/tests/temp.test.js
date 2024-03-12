globalThis.alert = console.log;

console.log(JSON.stringify([()=>{}], (key, value)=>{
  if (typeof value === 'function') return 'function';
  return value;
}));
