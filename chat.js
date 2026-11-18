
var ILZ_CHAT_CONFIG={whatsappNumber:""};
document.addEventListener('DOMContentLoaded',function(){
 var root=document.getElementById('ilz-chat-root');if(!root)return;
 root.innerHTML='<button id="ilz-launcher" aria-label="Open chat"><img src="symbol-dark.png" alt=""></button>'
 +'<div id="ilz-panel" role="dialog" aria-label="Interlinkz chat">'
 +'<div id="ilz-head"><img src="symbol-dark.png" alt=""> Interlinkz</div>'
 +'<div id="ilz-msgs"></div><div id="ilz-chips"></div>'
 +'<form id="ilz-form"><input id="ilz-input" type="text" placeholder="Type your question" autocomplete="off"><button id="ilz-send" type="submit">Send</button></form></div>';
 var A={
 greeting:"Hello, welcome to Interlinkz. I can answer common questions about our services, our demo websites, ordering and contact. What would you like to know?",
 services:"We offer four services: Website Development, Marketing, Branding and Business Growth. Tell me which one you are interested in and I will share more about it.",
 types:"We build business websites, online stores, clinic and service websites, booking websites, education websites and landing pages. You can see live demo websites on our Portfolio page.",
 ordering:"It starts with a chat. You tell us about your business, we show you a design first, and the build starts only after you approve the design. Nothing is built before you have seen it.",
 time:"The time depends on the type of website and the number of pages. We confirm the exact time in chat before the work starts, so there are no surprises later.",
 pricing:"Every project is quoted on what it includes, so there is no fixed price list here. Share a few details about your business in chat and we will send you a clear quotation. There are no hidden charges.",
 samples:"Yes. Our Portfolio page has live demo websites for many business types, including stores, clinics, services and education. Tap any demo to see it working.",
 contact:"You can email us at contact@interlinkz.com or use our contact page and we will reply there.",
 human:"Of course. A person can help you directly. Email us at contact@interlinkz.com or send your message through our contact page: https://interlinkz.com/contact",
 fallback:"I can only answer the common questions here. For anything else, please email us at contact@interlinkz.com or use our contact page and a person will help you."};
 var panel=document.getElementById('ilz-panel'),msgs=document.getElementById('ilz-msgs'),chips=document.getElementById('ilz-chips'),opened=false;
 function add(text,who){var d=document.createElement('div');d.className='ilz-msg '+(who==='user'?'ilz-user':'ilz-bot');d.textContent=text;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;}
 function answer(q){
   var s=q.toLowerCase();
   if(s.indexOf('human')>-1||s.indexOf('person')>-1||s.indexOf('talk to')>-1)return A.human;
   if(s.indexOf('price')>-1||s.indexOf('pricing')>-1||s.indexOf('cost')>-1)return A.pricing;
   if(s.indexOf('sample')>-1||s.indexOf('demo')>-1||s.indexOf('portfolio')>-1||s.indexOf('see')>-1&&s.indexOf('work')>-1)return A.samples;
   if(s.indexOf('order')>-1||s.indexOf('ordering')>-1||s.indexOf('start')>-1)return A.ordering;
   if(s.indexOf('long')>-1||s.indexOf('time')>-1||s.indexOf('take')>-1)return A.time;
   if(s.indexOf('type')>-1||s.indexOf('kind')>-1||s.indexOf('websites do you build')>-1)return A.types;
   if(s.indexOf('contact')>-1||s.indexOf('email')>-1)return A.contact;
   if(s.indexOf('service')>-1||s.indexOf('offer')>-1)return A.services;
   return A.fallback;}
 var chipData=[['Our Services',A.services],['Website Types',A.types],['How Ordering Works',A.ordering],['Pricing',A.pricing],['See Samples',A.samples],['Talk to a Human',A.human]];
 chipData.forEach(function(c){var b=document.createElement('button');b.className='ilz-chip';b.type='button';b.textContent=c[0];b.addEventListener('click',function(){add(c[0],'user');add(c[1],'bot');});chips.appendChild(b);});
 document.getElementById('ilz-launcher').addEventListener('click',function(){
   panel.classList.toggle('open');
   if(!opened){opened=true;add(A.greeting,'bot');}});
 document.getElementById('ilz-form').addEventListener('submit',function(e){
   e.preventDefault();var inp=document.getElementById('ilz-input');var v=inp.value.trim();if(!v)return;
   add(v,'user');inp.value='';add(answer(v),'bot');});
});
