// ============================================
// ADVANCED ANIMATIONS & UI ENHANCEMENTS
// ============================================

// ========== NAVBAR SHRINK ON SCROLL ==========
function initNavbarShrinkEffect() {
  const navbar = document.querySelector('.navbar');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add shrink class when scrolled down
    if (scrollTop > 50) {
      navbar.classList.add('shrink');
    } else {
      navbar.classList.remove('shrink');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });
}

// ========== SCROLL-TRIGGERED ANIMATIONS ==========
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Optional: Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add scroll-fade-in class to elements that need animation
  const elementsToObserve = document.querySelectorAll(
    '.section-title, .gallery-card, .feature-card, .contact-details div, .map-placeholder, .owner-card'
  );

  elementsToObserve.forEach(element => {
    // Add appropriate animation class based on element type
    if (element.classList.contains('gallery-card')) {
      element.classList.add('scroll-scale');
    } else if (element.classList.contains('contact-details')) {
      element.classList.add('scroll-slide-left');
    } else if (element.classList.contains('map-placeholder')) {
      element.classList.add('scroll-slide-right');
    } else {
      element.classList.add('scroll-fade-in');
    }
    
    observer.observe(element);
  });
}

// ========== SMOOTH PAGE SCROLL EFFECT ==========
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ========== ADD ANIMATION DELAYS FOR STAGGERED EFFECTS ==========
function initStaggeredAnimations() {
  // Gallery cards with staggered animation
  const galleryCards = document.querySelectorAll('.gallery-card');
  galleryCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  // Feature cards with staggered animation
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach((card, index) => {
    card.style.animationDelay = `${0.4 + index * 0.15}s`;
  });

  // Contact detail items with staggered animation
  const contactItems = document.querySelectorAll('.contact-details div');
  contactItems.forEach((item, index) => {
    item.style.animationDelay = `${0.1 + index * 0.1}s`;
  });
}

// ========== PARALLAX SCROLL EFFECT ==========
function initParallaxEffect() {
  const heroSection = document.querySelector('.hero');
  
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrollPosition = window.pageYOffset;
      const parallaxValue = scrollPosition * 0.5;
      
      heroSection.style.backgroundPosition = `0px ${parallaxValue}px`;
    });
  }
}

// ========== FADE IN ELEMENTS ON PAGE LOAD ==========
function initPageLoadAnimation() {
  const elements = document.querySelectorAll('.hero-text, .hero-img, .owner-card');
  
  elements.forEach((element, index) => {
    element.style.animation = `slideUp 0.7s cubic-bezier(0.2, 0.9, 0.4, 1.1) ${index * 0.2}s forwards`;
    element.style.opacity = '0';
  });
}

// ========== MOUSE MOVE EFFECT FOR HERO IMAGE ==========
function initMouseMoveEffect() {
  const heroImg = document.querySelector('.hero-img img');
  
  if (heroImg) {
    document.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPercent = (clientX / innerWidth - 0.5) * 20;
      const yPercent = (clientY / innerHeight - 0.5) * 20;
      
      heroImg.style.transform = `perspective(1000px) rotateX(${-yPercent}deg) rotateY(${xPercent}deg)`;
    });
    
    // Reset on mouse leave
    document.addEventListener('mouseleave', () => {
      heroImg.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  }
}

// ========== BUTTON CLICK ANIMATION ==========
function initButtonAnimations() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Create ripple effect
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// ========== TEXT GRADIENT ANIMATION ==========
function initTextGradientAnimation() {
  const h1 = document.querySelector('.hero-text h1');
  
  if (h1) {
    const text = h1.textContent;
    h1.innerHTML = text
      .split('')
      .map((char, index) => {
        return `<span style="animation: fadeInUp 0.6s ease-out ${index * 0.05}s backwards; display: inline-block;">${char}</span>`;
      })
      .join('');
  }
}

// ========== CARD HOVER LIFT EFFECT ==========
function initCardHoverEffect() {
  const cards = document.querySelectorAll('.gallery-card, .feature-card, .owner-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });
}

// ========== COUNT UP ANIMATION FOR STATS (if needed) ==========
function initCountUpAnimation(element, target, duration = 2000) {
  let current = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// ========== NOTIFICATION/TOAST ANIMATION ==========
function showNotification(message, type = 'success', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : '#ff9800'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    z-index: 10000;
    animation: slideInRight 0.4s ease-out;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideInLeft 0.4s ease-in reverse';
    setTimeout(() => notification.remove(), 400);
  }, duration);
}

// ========== FORM FOCUS ANIMATIONS ==========
function initFormAnimations() {
  const inputs = document.querySelectorAll('input, textarea, select');
  
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.style.boxShadow = '0 0 0 3px rgba(200, 126, 58, 0.1)';
      this.style.borderColor = '#c87e3a';
    });
    
    input.addEventListener('blur', function() {
      this.style.boxShadow = 'none';
      this.style.borderColor = '#ddd';
    });
  });
}

// ========== LAZY LOAD IMAGES ==========
function initLazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// ========== SCROLL PROGRESS BAR ==========
function initScrollProgressBar() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #c87e3a, #e09d5e);
    z-index: 999;
    transition: width 0.2s ease;
  `;
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

// ========== INITIALIZE ALL EFFECTS ON PAGE LOAD ==========
function initializeAllAnimations() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initNavbarShrinkEffect();
      initScrollAnimations();
      initSmoothScroll();
      initStaggeredAnimations();
      initPageLoadAnimation();
      initMouseMoveEffect();
      initButtonAnimations();
      initTextGradientAnimation();
      initCardHoverEffect();
      initScrollProgressBar();
      initFormAnimations();
      initLazyLoadImages();
    });
  } else {
    initNavbarShrinkEffect();
    initScrollAnimations();
    initSmoothScroll();
    initStaggeredAnimations();
    initPageLoadAnimation();
    initMouseMoveEffect();
    initButtonAnimations();
    initTextGradientAnimation();
    initCardHoverEffect();
    initScrollProgressBar();
    initFormAnimations();
    initLazyLoadImages();
  }
}

// Call initialization
initializeAllAnimations();

// ============================================
// AI CHATBOT FOR FASHION HUT GARMENTS
// ============================================

const chatbotConfig = {
  name: "Fashion Assistant",
  avatar: "👗",
  welcomeMessage: "Hello! I'm your Fashion Assistant. Ask me anything about Fashion Hut Garments!",
  primaryColor: "#c87e3a",
  position: "bottom-right"
};

const chatbotKnowledge = {
  storeName: "Fashion Hut Garments",
  owner: "Raman Nayyar",
  location: "Main Bazar street 1 near elementary school , Garhshankar, Punjab - 144527",
  whatsapp: "+91 84371 72895",
  instagram: "@fash_ionvision",
  instagramUrl: "https://www.instagram.com/fash_ionvision",
  whatsappUrl: "https://wa.me/918437172895",
  
  products: [
    "Men's ethnic wear (Kurtas, Sherwanis)",
    "Women's traditional wear (Sarees, Kurtis, Suits)",
    "Western wear for all ages",
    "Wedding collection",
    "Festive special outfits",
    "Cotton summer collection",
    "Winter layering clothes",
    "Premium garment collection"
  ],
  
  businessHours: "Monday to Saturday: 10:00 AM - 8:00 PM | Sunday: Closed",
  
  faqs: {
    "what products do you sell": "We offer Men's ethnic wear, Women's traditional wear (Sarees, Kurtis, Suits), Western wear, Wedding collection, Festive outfits, Cotton summer collection, and Winter wear.",
    "where is your store located": "Our store is located at Main Bazar street 1 near elementary school , Garhshankar, Punjab - 144527.",
    "what are your business hours": "We are open Monday to Saturday from 10:00 AM to 8:00 PM. We remain closed on Sundays.",
    "who is the owner": "The owner and founder of Fashion Hut Garments is Mr. Raman Nayyar.",
    "how to contact": "You can contact us via WhatsApp at +91 84371 72895 or Instagram at @fash_ionvision.",
    "do you have wedding collection": "Yes! We have an exclusive wedding collection including bridal wear, groom wear, and family outfits.",
    "do you have cotton clothes": "Yes, we have a special cotton summer collection perfect for hot weather.",
    "what is your instagram": "Our Instagram handle is @fash_ionvision. You can follow us for latest updates and offers.",
    "do you offer online shopping": "You can browse our collection on Instagram @fash_ionvision and contact us via WhatsApp for orders.",
    "customization available": "Yes, we offer customization for special occasions. Contact us on WhatsApp for details.",
    "return policy": "Please contact us directly on WhatsApp for return and exchange policy information.",
    "new arrivals": "We regularly update our collection. Follow @fash_ionvision on Instagram for new arrival announcements!"
  },
  
  keywords: {
    "product": "what products do you sell",
    "products": "what products do you sell",
    "sell": "what products do you sell",
    "location": "where is your store located",
    "address": "where is your store located",
    "store": "where is your store located",
    "timing": "what are your business hours",
    "time": "what are your business hours",
    "hours": "what are your business hours",
    "open": "what are your business hours",
    "owner": "who is the owner",
    "founder": "who is the owner",
    "contact": "how to contact",
    "phone": "how to contact",
    "whatsapp": "how to contact",
    "wedding": "do you have wedding collection",
    "cotton": "do you have cotton clothes",
    "summer": "do you have cotton clothes",
    "instagram": "what is your instagram",
    "online": "do you offer online shopping",
    "shop": "do you offer online shopping",
    "custom": "customization available",
    "customize": "customization available",
    "return": "return policy",
    "exchange": "return policy",
    "new": "new arrivals",
    "arrival": "new arrivals",
    "latest": "new arrivals"
  }
};

function createChatbot() {
  const chatbotHTML = `
    <div id="chatbot-container" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000; font-family: 'Inter', sans-serif;">
      <div id="chatbot-toggle" style="
        width: 60px;
        height: 60px;
        background: ${chatbotConfig.primaryColor};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        animation: pulse 2s infinite;
      ">
        <span style="font-size: 30px;">${chatbotConfig.avatar}</span>
      </div>
      
      <div id="chatbot-window" style="
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 350px;
        height: 500px;
        background: white;
        border-radius: 20px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        display: none;
        flex-direction: column;
        overflow: hidden;
        animation: slideUp 0.3s ease;
      ">
        <div style="
          background: ${chatbotConfig.primaryColor};
          color: white;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
        ">
          <span style="font-size: 28px;">${chatbotConfig.avatar}</span>
          <div style="flex: 1;">
            <strong style="font-size: 16px;">${chatbotConfig.name}</strong>
            <p style="font-size: 11px; margin: 0; opacity: 0.9;">Online • Ready to help</p>
          </div>
          <button id="chatbot-close" style="
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
          ">&times;</button>
        </div>
        
        <div id="chatbot-messages" style="
          flex: 1;
          overflow-y: auto;
          padding: 15px;
          background: #f9f5f0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        "></div>
        
        <div id="quick-replies" style="
          padding: 10px;
          background: white;
          border-top: 1px solid #eee;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        ">
          <button class="quick-reply-btn" data-question="What products do you sell?">🛍️ Products</button>
          <button class="quick-reply-btn" data-question="Where is your store located?">📍 Location</button>
          <button class="quick-reply-btn" data-question="What are your business hours?">⏰ Hours</button>
          <button class="quick-reply-btn" data-question="How to contact?">📞 Contact</button>
        </div>
        
        <div style="
          padding: 10px;
          background: white;
          border-top: 1px solid #eee;
          display: flex;
          gap: 10px;
        ">
          <input type="text" id="chatbot-input" placeholder="Ask me anything..." style="
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 25px;
            outline: none;
            font-size: 14px;
          ">
          <button id="chatbot-send" style="
            background: ${chatbotConfig.primaryColor};
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 18px;
          ">➤</button>
        </div>
      </div>
    </div>
    
    <style>
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateX(-10px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      .message-bubble {
        max-width: 80%;
        padding: 10px 14px;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.4;
        animation: fadeIn 0.3s ease;
      }
      
      .user-message {
        background: ${chatbotConfig.primaryColor};
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
      }
      
      .bot-message {
        background: white;
        color: #333;
        align-self: flex-start;
        border-bottom-left-radius: 4px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      }
      
      .quick-reply-btn {
        background: #f0e6dc;
        border: none;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
        color: #6b3f1c;
      }
      
      .quick-reply-btn:hover {
        background: ${chatbotConfig.primaryColor};
        color: white;
      }
      
      #chatbot-messages::-webkit-scrollbar {
        width: 5px;
      }
      
      #chatbot-messages::-webkit-scrollbar-track {
        background: #f0e6dc;
      }
      
      #chatbot-messages::-webkit-scrollbar-thumb {
        background: ${chatbotConfig.primaryColor};
        border-radius: 5px;
      }
    </style>
  `;
  
  document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  
  const toggleBtn = document.getElementById('chatbot-toggle');
  const chatbotWindow = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close');
  const sendBtn = document.getElementById('chatbot-send');
  const inputField = document.getElementById('chatbot-input');
  const messagesContainer = document.getElementById('chatbot-messages');
  
  function addBotMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-bubble bot-message';
    messageDiv.innerHTML = message;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  function addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-bubble user-message';
    messageDiv.textContent = message;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  function getBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.match(/hello|hi|hey|namaste|good morning|good evening/)) {
      return "👋 Hello! Welcome to Fashion Hut Garments! How can I help you today?";
    }
    
    if (lowerMessage.match(/thank|thanks|thx/)) {
      return "😊 You're welcome! Feel free to ask if you need anything else. Happy shopping!";
    }
    
    if (lowerMessage.match(/bye|goodbye|see you|exit/)) {
      return "👋 Goodbye! Visit us again at Fashion Hut Garments. Have a great day!";
    }
    
    for (const [keyword, question] of Object.entries(chatbotKnowledge.keywords)) {
      if (lowerMessage.includes(keyword)) {
        return chatbotKnowledge.faqs[question] || "I'll help you with that! Please contact us directly on WhatsApp for more details.";
      }
    }
    
    for (const [question, answer] of Object.entries(chatbotKnowledge.faqs)) {
      if (lowerMessage.includes(question)) {
        return answer;
      }
    }
    
    return `📌 I'm not sure about that. Here's what I can help with:\n\n📍 Store Location: ${chatbotKnowledge.location}\n📞 WhatsApp: ${chatbotKnowledge.whatsapp}\n📷 Instagram: ${chatbotKnowledge.instagram}`;
  }
  
  addBotMessage(chatbotConfig.welcomeMessage);
  
  toggleBtn.addEventListener('click', () => {
    if (chatbotWindow.style.display === 'none' || chatbotWindow.style.display === '') {
      chatbotWindow.style.display = 'flex';
      toggleBtn.style.animation = 'none';
      inputField.focus();
    } else {
      chatbotWindow.style.display = 'none';
    }
  });
  
  closeBtn.addEventListener('click', () => {
    chatbotWindow.style.display = 'none';
  });
  
  function sendMessage() {
    const message = inputField.value.trim();
    if (message === '') return;
    
    addUserMessage(message);
    inputField.value = '';
    
    setTimeout(() => {
      const response = getBotResponse(message);
      addBotMessage(response);
    }, 500);
  }
  
  sendBtn.addEventListener('click', sendMessage);
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
  
  document.querySelectorAll('.quick-reply-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.getAttribute('data-question');
      addUserMessage(question);
      setTimeout(() => {
        const response = getBotResponse(question);
        addBotMessage(response);
      }, 300);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createChatbot);
} else {
  createChatbot();
}

console.log("✨ Fashion Hut Garments - All animations and features loaded!");
