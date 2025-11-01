const JSON_URL = 'https://storage.googleapis.com/acciojob-open-file-collections/appsmith-uploads/bb3807e9b0bc49958d39563eb1759406.json';
const byId = (id)=>document.getElementById(id);
const log=(msg)=>{const el=byId('log');const d=document.createElement('div');d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;el.appendChild(d);el.scrollTop=el.scrollHeight;};
const setStep=(n)=>byId('step'+n).classList.add('done');
const resetSteps=()=>[1,2,3,4].forEach(n=>byId('step'+n).classList.remove('done'));

let MENU_ITEMS=[];

async function getMenu(){
  try{
    const r=await fetch(JSON_URL);
    MENU_ITEMS=await r.json();
    renderMenu(MENU_ITEMS);
  }catch{
    MENU_ITEMS=[{"id":1,"name":"Burger","price":5.99,"imgSrc":"https://storage.googleapis.com/acciojob-open-file-collections/appsmith-uploads/4f93a7b449c944a9a6ee721ff7f1dc18.png"}];
    renderMenu(MENU_ITEMS);
  }
}

function TakeOrder(item){
  return new Promise(res=>setTimeout(()=>res({items:[item]}),2500));
}
function orderPrep(){
  return new Promise(res=>setTimeout(()=>res({order_status:true,paid:false}),1500));
}
function payOrder(){
  return new Promise(res=>setTimeout(()=>res({order_status:true,paid:true}),1000));
}
function thankyouFnc(){
  alert('Thank you for eating with us today!');
}

async function startFlow(item){
  byId('progress').hidden=false;
  resetSteps();
  log('---');
  log('Taking order for '+item.name);
  const o=await TakeOrder(item);
  setStep(1);
  log('Cooking...');
  const prep=await orderPrep();
  setStep(2);
  const pay=await payOrder();
  setStep(3);
  if(pay.paid){setStep(4);thankyouFnc();}
}

function renderMenu(list){
  const g=byId('menuGrid');
  g.innerHTML='';
  list.forEach(i=>{
    const c=document.createElement('div');
    c.className='card';
    c.innerHTML=`<img class="thumb" src="${i.imgSrc}" alt="${i.name}"/><div class="body"><h4 class="name">${i.name}</h4><div class="price">$${Number(i.price).toFixed(2)}/-</div></div><button class="plus" aria-label="Order ${i.name}">+</button>`;
    c.querySelector('.plus').onclick=()=>startFlow(i);
    g.appendChild(c);
  });
}

byId('btn-random').onclick=()=>{const i=MENU_ITEMS[Math.floor(Math.random()*MENU_ITEMS.length)];startFlow(i);};
byId('btn-clear').onclick=()=>{byId('log').innerHTML='';resetSteps();byId('progress').hidden=true;};
window.onload=getMenu;
