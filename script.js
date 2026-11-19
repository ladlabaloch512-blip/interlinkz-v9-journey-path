
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

// FAQ accordion: answers visible without JS; with JS they collapse and open smoothly.
document.querySelectorAll('.faq-item').forEach(function (item) {
  var btn = item.querySelector('.faq-q'); var panel = item.querySelector('.faq-a');
  if (!btn || !panel) return;
  panel.style.maxHeight = '0px'; btn.setAttribute('aria-expanded', 'false');
  btn.addEventListener('click', function () {
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function (o) { o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = '0px'; o.querySelector('.faq-q').setAttribute('aria-expanded', 'false'); });
    if (!isOpen) { item.classList.add('open'); panel.style.maxHeight = panel.scrollHeight + 'px'; btn.setAttribute('aria-expanded', 'true'); }
  });
});
