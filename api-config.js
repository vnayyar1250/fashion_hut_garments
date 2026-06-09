/**
 * API Configuration - Remote Backend Connection
 * Compatible with any cloud platform (Firebase, AWS, Azure, Heroku, etc.)
 */

const API_CONFIG = {
  // ============================================
  // ⚙️ CONFIGURE YOUR API ENDPOINT HERE
  // ============================================
  // Replace with your actual backend API URL
  BASE_URL: 'https://your-api-backend.com/api',
  
  // API authentication key (if needed)
  API_KEY: 'your-api-key-here',
  
  // Request timeout in milliseconds
  TIMEOUT: 15000,
  
  // Enable console debugging
  DEBUG: true
};

/**
 * Universal API Call Wrapper
 * Handles all HTTP requests with error handling and timeout
 */
async function apiCall(endpoint, options = {}) {
  const { method = 'GET', body = null, headers = {} } = options;
  
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers
    }
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    if (API_CONFIG.DEBUG) {
      console.log(`[API ${method}] ${endpoint}`, body || '');
    }

    // Race between fetch and timeout
    const response = await Promise.race([
      fetch(url, config),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('⏱️ API timeout - server not responding')), API_CONFIG.TIMEOUT)
      )
    ]);

    if (!response.ok) {
      throw new Error(`❌ API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (API_CONFIG.DEBUG) {
      console.log(`[API Response] ✅`, data);
    }

    return { success: true, data };
  } catch (error) {
    if (API_CONFIG.DEBUG) {
      console.error(`[API Error]`, error.message);
    }
    return { success: false, error: error.message };
  }
}

// ============================================
// API ENDPOINTS REFERENCE
// ============================================
/*
Gallery Endpoints:
  GET    /images              → Get all gallery images
  POST   /images              → Upload image(s) [Admin]
  DELETE /images/:id          → Delete image by ID [Admin]
  
Admin Auth:
  POST   /auth/login          → Admin login (phone, password)
  POST   /auth/logout         → Admin logout [Admin]
  GET    /auth/verify         → Verify admin session token [Admin]
  
Utility:
  POST   /contact/submit      → Contact form submission
  GET    /config              → Get public config/metadata

Example Backend Implementation (Node.js):
  
  // Admin Login
  app.post('/api/auth/login', async (req, res) => {
    const { phone, password } = req.body;
    // Verify credentials against database
    if (validCredentials(phone, password)) {
      const token = generateJWT({ phone, role: 'admin' });
      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
  });

  // Get Images
  app.get('/api/images', async (req, res) => {
    const images = await Image.find().select('id url name uploadedAt');
    res.json({ success: true, images });
  });

  // Upload Image (Protected)
  app.post('/api/images', authenticate, async (req, res) => {
    const file = req.files.image;
    const image = new Image({
      name: file.name,
      url: `https://cdn.example.com/${file.filename}`,
      uploadedAt: new Date()
    });
    await image.save();
    res.json({ success: true, image });
  });
*/
