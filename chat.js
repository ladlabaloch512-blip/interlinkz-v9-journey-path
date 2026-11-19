// Interlinkz chatbot. Rule based answers per CHATBOT-SPEC.md.
// The answer engine sits behind ONE replaceable point: getAnswer().
// To plug in AI later, set mode to "ai" and fill aiEndpoint in the config;
// the panel UI, typing indicator and delay logic do not change.
var ILZ_CHAT_CONFIG = {
  mode: "rules",
  aiEndpoint: "",
  whatsappNumber: "923249476992"
};
document.addEventListener('DOMContentLoaded', function () {
  var root = document.getElementById('ilz-chat-root');
  if (!root) return;
  root.innerHTML = '<button id="ilz-launcher" aria-label="Open chat"><img src="symbol-dark.png" alt=""></button>'
    + '<div id="ilz-panel" role="dialog" aria-label="Interlinkz chat">'
    + '<div id="ilz-head"><img src="symbol-dark.png" alt=""> Interlinkz<button id="ilz-close" type="button" aria-label="Close chat">&times;</button></div>'
    + '<div id="ilz-msgs"></div><div id="ilz-chips"></div>'
    + '<form id="ilz-form"><input id="ilz-input" type="text" placeholder="Type your question" autocomplete="off"><button id="ilz-send" type="submit">Send</button></form></div>';

  var A = {
    greeting: "Hello, welcome to Interlinkz. I can answer common questions about our services, our demo websites, ordering and contact. What would you like to know?",
    services: "We offer four services: Website Development, Marketing, Branding and Business Growth. Tell me which one you are interested in and I will share more about it.",
    types: "We build business websites, online stores, clinic and service websites, booking websites, education websites and landing pages. You can see live demo websites on our Portfolio page.",
    ordering: "It starts with a chat. You tell us about your business, we show you a design first, and the build starts only after you approve the design. Nothing is built before you have seen it.",
    time: "The time depends on the type of website and the number of pages. We confirm the exact time in chat before the work starts, so there are no surprises later.",
    pricing: "Every project is quoted on what it includes, so there is no fixed price list here. Share a few details about your business in chat and we will send you a clear quotation. There are no hidden charges.",
    samples: "Yes. Our Portfolio page has live demo websites for many business types, including stores, clinics, services and education. Tap any demo to see it working.",
    // Contact routes never print an email address or a number in the chat.
    // They render as channel buttons (see addActions). WhatsApp appears only
    // when ILZ_CHAT_CONFIG.whatsappNumber holds a number.
    contact: { actions: true, line: "You can reach us here:" },
    human: { actions: true, line: "Of course. You can reach our team here:" },
    fallback: { actions: true, line: "I can only answer the common questions here. For anything else, our team can help you here:" }
  };

  function ruleAnswer(q) {
    var s = q.toLowerCase();
    if (s.indexOf('human') > -1 || s.indexOf('person') > -1 || s.indexOf('talk to') > -1) return A.human;
    if (s.indexOf('price') > -1 || s.indexOf('pricing') > -1 || s.indexOf('cost') > -1) return A.pricing;
    if (s.indexOf('sample') > -1 || s.indexOf('demo') > -1 || s.indexOf('portfolio') > -1 || (s.indexOf('see') > -1 && s.indexOf('work') > -1)) return A.samples;
    if (s.indexOf('order') > -1 || s.indexOf('ordering') > -1 || s.indexOf('start') > -1) return A.ordering;
    if (s.indexOf('long') > -1 || s.indexOf('time') > -1 || s.indexOf('take') > -1) return A.time;
    if (s.indexOf('type') > -1 || s.indexOf('kind') > -1 || s.indexOf('websites do you build') > -1) return A.types;
    if (s.indexOf('contact') > -1 || s.indexOf('email') > -1) return A.contact;
    if (s.indexOf('service') > -1 || s.indexOf('offer') > -1) return A.services;
    return A.fallback;
  }

  // The single replaceable answer point. "rules" today; "ai" later.
  function getAnswer(text) {
    if (ILZ_CHAT_CONFIG.mode === "ai" && ILZ_CHAT_CONFIG.aiEndpoint) {
      return A.fallback; // AI endpoint plugs in here later; rules stay the fallback.
    }
    return ruleAnswer(text);
  }

  var panel = document.getElementById('ilz-panel'),
      msgs = document.getElementById('ilz-msgs'),
      chips = document.getElementById('ilz-chips'),
      launcher = document.getElementById('ilz-launcher'),
      opened = false,
      typingEl = null,
      typingTimer = null,
      queue = [];

  function add(text, who) {
    var d = document.createElement('div');
    d.className = 'ilz-msg ' + (who === 'user' ? 'ilz-user' : 'ilz-bot');
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }
  // A bot message with channel buttons. The email address lives only inside
  // the mailto link and the number only inside the wa.me link; neither is
  // ever printed as text in the chat.
  function addActions(line) {
    var d = document.createElement('div');
    d.className = 'ilz-msg ilz-bot';
    var t = document.createElement('div');
    t.textContent = line;
    d.appendChild(t);
    var box = document.createElement('div');
    box.className = 'ilz-actions';
    var email = document.createElement('a');
    email.className = 'ilz-action ilz-action-primary';
    email.href = 'mailto:contact@interlinkz.com';
    email.textContent = 'Email Us';
    box.appendChild(email);
    var form = document.createElement('a');
    form.className = 'ilz-action';
    form.href = 'contact.html';
    form.textContent = 'Contact Form';
    box.appendChild(form);
    var num = (ILZ_CHAT_CONFIG.whatsappNumber || '').replace(/[^0-9]/g, '');
    if (num) {
      var wa = document.createElement('a');
      wa.className = 'ilz-action';
      wa.href = 'https://wa.me/' + num;
      wa.target = '_blank';
      wa.rel = 'noopener';
      wa.textContent = 'WhatsApp';
      box.appendChild(wa);
    }
    d.appendChild(box);
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }
  function deliver(item) {
    if (item && typeof item === 'object' && item.actions) addActions(item.line);
    else add(item, 'bot');
  }
  function itemLength(item) {
    return (item && typeof item === 'object') ? item.line.length : String(item).length;
  }
  function showTyping() {
    hideTyping();
    typingEl = document.createElement('div');
    typingEl.className = 'ilz-msg ilz-bot ilz-typing';
    typingEl.setAttribute('aria-label', 'Interlinkz is typing');
    typingEl.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(typingEl);
    msgs.scrollTop = msgs.scrollHeight;
  }
  function hideTyping() {
    if (typingEl && typingEl.parentNode) typingEl.parentNode.removeChild(typingEl);
    typingEl = null;
  }
  function delayFor(item) {
    var d = 450 + itemLength(item) * 4;
    return Math.max(700, Math.min(1600, d));
  }
  // Bot replies always type first, then answer after a short human delay.
  // Replies are queued so a fast second question never doubles or loses one.
  function botReply(item) {
    queue.push(item);
    if (typingTimer) return;
    nextReply();
  }
  function nextReply() {
    if (!queue.length) { typingTimer = null; return; }
    var item = queue[0];
    showTyping();
    typingTimer = setTimeout(function () {
      typingTimer = null;
      queue.shift();
      hideTyping();
      deliver(item);
      nextReply();
    }, delayFor(item));
  }
  // If the panel closes mid-typing, pending answers are kept and delivered
  // instantly on reopen: nothing lost, nothing doubled.
  function flushOnReopen() {
    if (typingTimer) { clearTimeout(typingTimer); typingTimer = null; }
    hideTyping();
    while (queue.length) deliver(queue.shift());
  }
  function isOpen() { return panel.classList.contains('open'); }
  function openPanel() {
    if (isOpen()) return;
    panel.classList.add('open');
    if (!opened) {
      opened = true;
      botReply(A.greeting);
    } else {
      flushOnReopen();
    }
  }
  function closePanel() {
    if (!isOpen()) return;
    panel.classList.remove('open');
  }

  var chipData = [['Our Services', A.services], ['Website Types', A.types], ['How Ordering Works', A.ordering], ['Pricing', A.pricing], ['See Samples', A.samples], ['Talk to a Human', A.human]];
  chipData.forEach(function (c) {
    var b = document.createElement('button');
    b.className = 'ilz-chip';
    b.type = 'button';
    b.textContent = c[0];
    b.addEventListener('click', function () { add(c[0], 'user'); botReply(c[1]); });
    chips.appendChild(b);
  });

  launcher.addEventListener('click', function () {
    if (isOpen()) closePanel(); else openPanel();
  });
  document.getElementById('ilz-close').addEventListener('click', closePanel);
  document.addEventListener('click', function (e) {
    if (!isOpen()) return;
    if (panel.contains(e.target) || launcher.contains(e.target)) return;
    closePanel();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isOpen()) closePanel();
  });
  document.getElementById('ilz-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var inp = document.getElementById('ilz-input');
    var v = inp.value.trim();
    if (!v) return;
    add(v, 'user');
    inp.value = '';
    botReply(getAnswer(v));
  });
});
