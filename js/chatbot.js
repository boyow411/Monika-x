/**
 * Monika Restaurant Chatbot
 * A knowledge-based chatbot trained on restaurant content.
 * No external API required — uses keyword matching + fuzzy search.
 */
(function () {
  'use strict';

  // ─── KNOWLEDGE BASE ───────────────────────────────────────────────
  const KB = {
    restaurant: {
      name: 'Monika Restaurant',
      tagline: 'West African Seafood & Charcoal Grill',
      address: '14 Deptford Broadway, London SE8 4PA',
      phone: '020 8691 0263',
      email: 'info@monikarestaurant.co.uk',
      website: 'https://www.monikarestaurant.co.uk',
      bookingUrl: 'https://web.dojo.app/create_booking/vendor/4w3KsIvZJOhkRjvfcYFI9-mNbTqGcKHCCwTTtEr_NhM_restaurant'
    },
    hours: {
      monday: 'Closed',
      tuesday: '4 PM – 11 PM',
      wednesday: '4 PM – 11 PM',
      thursday: '4 PM – 11 PM',
      friday: '4 PM – 12 AM',
      saturday: '12 PM – 12 AM',
      sunday: '12 PM – 10 PM'
    },
    menu: {
      description: 'West African Seafood and Charcoal Grill. Bold flavours, vibrant spices, and fresh ingredients.',
      highlights: [
        'The Iconic Monika Fish — our signature whole grilled fish',
        'Spiced Charcoal Prawns',
        'Suya (West African spiced grilled meat)',
        'Jollof Rice',
        'Grilled Lobster',
        'Pepper Soup',
        'Plantain (fried ripe plantain)',
        'Pounded Yam & Egusi Soup'
      ],
      menuUrl: 'images/menu.pdf',
      dietary: 'We cater to various dietary needs. Please ask your server about gluten-free, vegetarian, or allergen options.'
    },
    venue: {
      description: 'A warm, vibrant space reflecting West African culture — bold patterns, earthy tones, and modern elegance.',
      capacity: 'We can accommodate private events and celebrations. Contact us for group bookings.',
      features: ['Indoor dining', 'Private event space', 'Bar area', 'Charcoal grill station'],
      atmosphere: 'Welcoming, fun, and friendly — perfect for unwinding, date nights, and celebrations.'
    },
    parking: {
      info: 'Free on-street parking available on Deptford Broadway and surrounding streets after 6:30 PM and on weekends. Pay & display before 6:30 PM.',
      waze: 'https://waze.com/ul?ll=51.4749535,-0.024757&navigate=yes&zoom=17',
      googleMaps: 'https://www.google.com/maps/dir/?api=1&destination=14+Deptford+Broadway,+London+SE8+4PA'
    },
    story: {
      summary: 'Monika Restaurant brings the authentic flavours of West Africa to Deptford, London. Our décor reflects West African culture with bold patterns, earthy tones, and modern elegance. We serve charcoal-grilled seafood and traditional dishes in a warm, welcoming atmosphere.'
    },
    promotion: {
      current: 'Check our Promotion page for the latest offers including exclusive recipes and limited-time deals.'
    }
  };

  // ─── INTENT PATTERNS ──────────────────────────────────────────────
  const intents = [
    {
      patterns: ['book', 'reserve', 'reservation', 'table', 'booking'],
      response: () =>
        `You can book a table online here:\n<a href="${KB.restaurant.bookingUrl}" target="_blank" style="color:#C9A96E;text-decoration:underline;">Book Now →</a>\n\nOr call us at <strong>${KB.restaurant.phone}</strong>.`
    },
    {
      patterns: ['hour', 'open', 'close', 'time', 'when', 'schedule'],
      response: () => {
        let r = '<strong>Opening Hours:</strong><br>';
        for (const [day, time] of Object.entries(KB.hours)) {
          r += `${day.charAt(0).toUpperCase() + day.slice(1)}: ${time}<br>`;
        }
        return r;
      }
    },
    {
      patterns: ['menu', 'food', 'dish', 'eat', 'cuisine', 'serve', 'offer'],
      response: () => {
        let r = `<strong>${KB.menu.description}</strong><br><br>Popular dishes:<br>`;
        KB.menu.highlights.forEach(d => { r += `• ${d}<br>`; });
        r += `<br><a href="${KB.menu.menuUrl}" target="_blank" style="color:#C9A96E;text-decoration:underline;">View Full Menu (PDF) →</a>`;
        return r;
      }
    },
    {
      patterns: ['fish', 'monika fish', 'signature'],
      response: () =>
        'Our signature <strong>Monika Fish</strong> is a whole grilled fish, seasoned with West African spices and charcoal-grilled to perfection. It\'s the dish that put us on the map!'
    },
    {
      patterns: ['prawn', 'shrimp'],
      response: () =>
        'Our <strong>Spiced Charcoal Prawns</strong> are king prawns marinated in a blend of garlic, ginger, Scotch bonnet, and smoked paprika — then charcoal-grilled. Absolutely delicious!'
    },
    {
      patterns: ['suya', 'kebab', 'skewer'],
      response: () =>
        '<strong>Suya</strong> is a popular West African street food — spiced grilled meat skewers coated in a peanut-based spice mix (yaji). Smoky, nutty, and full of flavour.'
    },
    {
      patterns: ['jollof', 'rice'],
      response: () =>
        'Our <strong>Jollof Rice</strong> is a classic West African one-pot rice dish cooked in a rich, spiced tomato sauce. It\'s the perfect side to any of our grilled dishes.'
    },
    {
      patterns: ['location', 'address', 'where', 'find', 'direction', 'map'],
      response: () =>
        `We're at <strong>${KB.restaurant.address}</strong>.\n\n` +
        `<a href="${KB.parking.googleMaps}" target="_blank" style="color:#C9A96E;text-decoration:underline;">📍 Get Google Directions →</a><br>` +
        `<a href="${KB.parking.waze}" target="_blank" style="color:#C9A96E;text-decoration:underline;">📍 Open in Waze →</a>`
    },
    {
      patterns: ['park', 'car', 'drive', 'parking'],
      response: () =>
        `<strong>Parking Info:</strong><br>${KB.parking.info}<br><br>` +
        `<a href="${KB.parking.waze}" target="_blank" style="color:#C9A96E;text-decoration:underline;">📍 Open in Waze →</a><br>` +
        `<a href="${KB.parking.googleMaps}" target="_blank" style="color:#C9A96E;text-decoration:underline;">🗺️ Google Directions →</a>`
    },
    {
      patterns: ['contact', 'phone', 'call', 'email', 'reach'],
      response: () =>
        `<strong>Contact Us:</strong><br>` +
        `📞 Phone: <a href="tel:${KB.restaurant.phone}" style="color:#C9A96E;">${KB.restaurant.phone}</a><br>` +
        `✉️ Email: <a href="mailto:${KB.restaurant.email}" style="color:#C9A96E;">${KB.restaurant.email}</a><br>` +
        `📍 Address: ${KB.restaurant.address}`
    },
    {
      patterns: ['private', 'event', 'party', 'celebration', 'birthday', 'group'],
      response: () =>
        `We'd love to host your event! ${KB.venue.capacity}\n\nCall us at <strong>${KB.restaurant.phone}</strong> or email <a href="mailto:${KB.restaurant.email}" style="color:#C9A96E;">${KB.restaurant.email}</a> to discuss your requirements.`
    },
    {
      patterns: ['venue', 'space', 'interior', 'decor', 'ambiance', 'atmosphere'],
      response: () =>
        `${KB.venue.description}<br><br>${KB.venue.atmosphere}<br><br>Features: ${KB.venue.features.join(', ')}.`
    },
    {
      patterns: ['vegan', 'vegetarian', 'gluten', 'allerg', 'dietary', 'halal'],
      response: () =>
        `${KB.menu.dietary}<br><br>Our charcoal-grilled dishes are naturally gluten-free. Contact us ahead of your visit if you have specific dietary requirements.`
    },
    {
      patterns: ['promo', 'offer', 'deal', 'discount', 'special'],
      response: () =>
        `${KB.promotion.current}<br><br><a href="promotion.html" style="color:#C9A96E;text-decoration:underline;">🎁 View Promotions →</a>`
    },
    {
      patterns: ['story', 'about', 'history', 'who'],
      response: () =>
        `${KB.story.summary}<br><br><a href="story.html" style="color:#C9A96E;text-decoration:underline;">Read Our Story →</a>`
    },
    {
      patterns: ['gallery', 'photo', 'picture', 'image'],
      response: () =>
        `Check out our gallery to see the atmosphere, dishes, and events at Monika Restaurant.<br><br><a href="gallery.html" style="color:#C9A96E;text-decoration:underline;">View Gallery →</a>`
    },
    {
      patterns: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon'],
      response: () =>
        `Welcome to Monika Restaurant! 🎉 How can I help you today? I can assist with:\n\n• <strong>Booking</strong> a table\n• <strong>Menu</strong> information\n• <strong>Opening hours</strong>\n• <strong>Location & parking</strong>\n• <strong>Events & private dining</strong>`
    },
    {
      patterns: ['thank', 'thanks', 'cheers', 'appreciate'],
      response: () =>
        'You\'re welcome! If you need anything else, just ask. We look forward to seeing you at Monika Restaurant! 🍽️'
    },
    {
      patterns: ['bye', 'goodbye', 'see you', 'later'],
      response: () =>
        'Goodbye! We hope to see you at Monika soon. Don\'t forget to <a href="' + KB.restaurant.bookingUrl + '" target="_blank" style="color:#C9A96E;text-decoration:underline;">book your table</a>! 👋'
    },
    {
      patterns: ['price', 'cost', 'expensive', 'cheap', 'afford', 'budget'],
      response: () =>
        `For detailed pricing, please check our menu:\n<a href="${KB.menu.menuUrl}" target="_blank" style="color:#C9A96E;text-decoration:underline;">View Full Menu (PDF) →</a>\n\nWe offer a range of dishes at various price points. For group dining or event pricing, please contact us directly.`
    },
    {
      patterns: ['delivery', 'takeaway', 'take away', 'collect', 'pickup'],
      response: () =>
        'For the best experience, we recommend dining with us. Please call <strong>' + KB.restaurant.phone + '</strong> to ask about current takeaway availability.'
    },
    {
      patterns: ['wifi', 'wi-fi', 'internet'],
      response: () =>
        'Please ask your server about Wi-Fi availability when you visit. We\'ll be happy to help!'
    }
  ];

  // ─── MATCH FUNCTION ────────────────────────────────────────────────
  function findResponse(input) {
    const lower = input.toLowerCase().trim();
    if (!lower) return null;

    // Score each intent
    let bestMatch = null;
    let bestScore = 0;

    for (const intent of intents) {
      let score = 0;
      for (const pattern of intent.patterns) {
        if (lower.includes(pattern)) {
          // Longer pattern matches are weighted higher
          score += pattern.length;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = intent;
      }
    }

    if (bestMatch && bestScore > 0) {
      return bestMatch.response();
    }

    // Fallback
    return `I'm not sure about that, but I'd be happy to help with:\n\n` +
      `• <strong>Booking</strong> – reserve a table\n` +
      `• <strong>Menu</strong> – what we serve\n` +
      `• <strong>Hours</strong> – when we're open\n` +
      `• <strong>Location</strong> – how to find us\n` +
      `• <strong>Parking</strong> – where to park\n` +
      `• <strong>Contact</strong> – get in touch\n\n` +
      `Or call us at <strong>${KB.restaurant.phone}</strong> for anything else!`;
  }

  // ─── CREATE CHATBOT UI ────────────────────────────────────────────
  function createChatbot() {
    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
      #monika-chatbot-toggle {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #C9A96E, #8B6914);
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(201, 169, 110, 0.4);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      #monika-chatbot-toggle:hover {
        transform: scale(1.08);
        box-shadow: 0 6px 28px rgba(201, 169, 110, 0.55);
      }
      #monika-chatbot-toggle svg {
        width: 28px;
        height: 28px;
        fill: #fff;
      }

      #monika-chatbot-panel {
        position: fixed;
        bottom: 96px;
        right: 24px;
        width: 370px;
        max-height: 520px;
        background: #1a1a1a;
        border-radius: 16px;
        box-shadow: 0 12px 48px rgba(0,0,0,0.5);
        z-index: 99999;
        display: none;
        flex-direction: column;
        overflow: hidden;
        font-family: 'Inter', 'Segoe UI', sans-serif;
        border: 1px solid rgba(201, 169, 110, 0.2);
      }
      #monika-chatbot-panel.open { display: flex; }

      #monika-chat-header {
        background: linear-gradient(135deg, #2c1810, #4a2c1a);
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(201, 169, 110, 0.15);
      }
      #monika-chat-header .chat-title {
        color: #C9A96E;
        font-size: 15px;
        font-weight: 600;
        letter-spacing: 0.3px;
      }
      #monika-chat-header .chat-subtitle {
        color: rgba(255,255,255,0.5);
        font-size: 11px;
        margin-top: 2px;
      }
      #monika-chat-header button {
        background: none;
        border: none;
        color: rgba(255,255,255,0.5);
        font-size: 20px;
        cursor: pointer;
        padding: 4px;
        line-height: 1;
        transition: color 0.15s;
      }
      #monika-chat-header button:hover { color: #fff; }

      #monika-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        max-height: 340px;
        scroll-behavior: smooth;
      }
      #monika-chat-messages::-webkit-scrollbar { width: 4px; }
      #monika-chat-messages::-webkit-scrollbar-track { background: transparent; }
      #monika-chat-messages::-webkit-scrollbar-thumb { background: rgba(201,169,110,0.3); border-radius: 4px; }

      .monika-msg {
        margin-bottom: 12px;
        display: flex;
      }
      .monika-msg.bot { justify-content: flex-start; }
      .monika-msg.user { justify-content: flex-end; }

      .monika-msg .bubble {
        max-width: 82%;
        padding: 10px 14px;
        border-radius: 12px;
        font-size: 13px;
        line-height: 1.5;
        word-wrap: break-word;
        white-space: pre-line;
      }
      .monika-msg.bot .bubble {
        background: #2a2a2a;
        color: #e0e0e0;
        border-bottom-left-radius: 4px;
      }
      .monika-msg.user .bubble {
        background: linear-gradient(135deg, #C9A96E, #8B6914);
        color: #fff;
        border-bottom-right-radius: 4px;
      }
      .monika-msg .bubble a {
        color: #C9A96E !important;
        text-decoration: underline;
      }
      .monika-msg.user .bubble a {
        color: #fff !important;
      }

      #monika-chat-input-area {
        padding: 12px 16px;
        border-top: 1px solid rgba(201, 169, 110, 0.15);
        display: flex;
        gap: 8px;
        background: #222;
      }
      #monika-chat-input {
        flex: 1;
        background: #333;
        border: 1px solid rgba(201, 169, 110, 0.2);
        border-radius: 8px;
        padding: 10px 14px;
        color: #e0e0e0;
        font-size: 13px;
        font-family: inherit;
        outline: none;
        transition: border-color 0.15s;
      }
      #monika-chat-input:focus {
        border-color: #C9A96E;
      }
      #monika-chat-input::placeholder { color: #777; }

      #monika-chat-send {
        background: linear-gradient(135deg, #C9A96E, #8B6914);
        border: none;
        border-radius: 8px;
        width: 40px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.15s;
      }
      #monika-chat-send:hover { opacity: 0.85; }
      #monika-chat-send svg { width: 18px; height: 18px; fill: #fff; }

      @media (max-width: 480px) {
        #monika-chatbot-panel {
          width: calc(100vw - 32px);
          right: 16px;
          bottom: 88px;
          max-height: 70vh;
        }
        #monika-chatbot-toggle {
          bottom: 16px;
          right: 16px;
          width: 52px;
          height: 52px;
        }
      }
    `;
    document.head.appendChild(style);

    // Toggle button
    const toggle = document.createElement('button');
    toggle.id = 'monika-chatbot-toggle';
    toggle.setAttribute('aria-label', 'Open chat');
    toggle.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/><path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/></svg>';
    document.body.appendChild(toggle);

    // Panel
    const panel = document.createElement('div');
    panel.id = 'monika-chatbot-panel';
    panel.innerHTML = `
      <div id="monika-chat-header">
        <div>
          <div class="chat-title">🍽️ Monika Assistant</div>
          <div class="chat-subtitle">Ask me anything about the restaurant</div>
        </div>
        <button id="monika-chat-close" aria-label="Close chat">&times;</button>
      </div>
      <div id="monika-chat-messages"></div>
      <div id="monika-chat-input-area">
        <input id="monika-chat-input" type="text" placeholder="Type your question..." autocomplete="off" />
        <button id="monika-chat-send" aria-label="Send message">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    `;
    document.body.appendChild(panel);

    // Elements
    const messages = document.getElementById('monika-chat-messages');
    const input = document.getElementById('monika-chat-input');
    const sendBtn = document.getElementById('monika-chat-send');
    const closeBtn = document.getElementById('monika-chat-close');

    // Add message to chat
    function addMessage(text, isBot) {
      const div = document.createElement('div');
      div.className = 'monika-msg ' + (isBot ? 'bot' : 'user');
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      bubble.innerHTML = isBot ? text : text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      div.appendChild(bubble);
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    // Welcome message
    addMessage(
      'Welcome to <strong>Monika Restaurant</strong>! 🎉<br><br>' +
      'I can help you with:<br>' +
      '• Booking a table<br>' +
      '• Menu & dishes<br>' +
      '• Opening hours<br>' +
      '• Location & parking<br>' +
      '• Events & private dining<br><br>' +
      'What would you like to know?',
      true
    );

    // Send handler
    function handleSend() {
      const text = input.value.trim();
      if (!text) return;
      addMessage(text, false);
      input.value = '';

      // Simulate slight thinking delay
      setTimeout(() => {
        const response = findResponse(text);
        addMessage(response, true);
      }, 400);
    }

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });

    // Toggle panel
    let isOpen = false;
    toggle.addEventListener('click', () => {
      isOpen = !isOpen;
      panel.classList.toggle('open', isOpen);
      if (isOpen) input.focus();
    });

    closeBtn.addEventListener('click', () => {
      isOpen = false;
      panel.classList.remove('open');
    });
  }

  // ─── INIT ─────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatbot);
  } else {
    createChatbot();
  }
})();
