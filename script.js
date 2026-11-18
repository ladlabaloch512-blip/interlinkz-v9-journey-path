
document.addEventListener('DOMContentLoaded',function(){
 var t=document.querySelector('.nav-toggle'),n=document.querySelector('.main-nav');
 if(t&&n){t.addEventListener('click',function(){var o=n.classList.toggle('open');t.setAttribute('aria-expanded',o);});}
 var chips=document.querySelectorAll('.chip'),cards=document.querySelectorAll('.demo-card');
 chips.forEach(function(ch){ch.addEventListener('click',function(){
   chips.forEach(function(c){c.classList.remove('active')});ch.classList.add('active');
   var f=ch.getAttribute('data-filter');
   cards.forEach(function(card){card.style.display=(f==='all'||card.getAttribute('data-cat')===f)?'':'none';});
 });});
 var form=document.getElementById('contactForm');
 if(form){form.addEventListener('submit',function(e){e.preventDefault();document.getElementById('formNote').hidden=false;});}
});
