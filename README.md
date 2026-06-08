# 👗 Fashion Hut Garments

A modern, fully responsive fashion e-commerce website for a local garment store in Garhshankar, Punjab.

## ✨ Features

### 🎨 Frontend
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Modern UI** - Beautiful gradient designs and smooth animations
- **Image Gallery** - Interactive gallery with lightbox functionality
- **Navigation** - Sticky navbar with smooth scrolling
- **Contact Info** - Easy access to location, hours, and social media

### 🤖 AI Chatbot
- Intelligent customer service bot
- Quick replies for common questions
- Product information assistance
- Contact details and business hours
- Natural language processing

### 👨‍💼 Admin Panel
- Secure login (phone + password)
- Image upload functionality
- Gallery management
- Real-time gallery updates
- LocalStorage-based persistence

## 📁 File Structure

```
fashion_hut_garments/
├── index.html              # Main HTML file
├── style.css               # Main stylesheet
├── admin-panel.js          # Admin panel functionality
├── fashionhut-complete.js  # Public gallery + chatbot
├── custom-3d.js            # 3D effects (optional)
├── style-3d.css            # 3D styling (optional)
├── admin.html              # Admin page (optional)
├── README.md               # Documentation
└── TODO.md                 # Development tasks
```

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vnayyar1250/fashion_hut_garments.git
   ```

2. **Open in browser:**
   - Open `index.html` in any modern web browser
   - No build process or server required!

3. **Admin Access:**
   - Look for the "Admin" button (bottom right of page)
   - Login with:
     - Phone: `8437172895`
     - Password: `admin123`

## 🎯 Main Sections

### Hero Section
- Eye-catching introduction
- Call-to-action buttons
- Beautiful hero image

### Gallery
- Image collection display
- Lightbox modal on image click
- Dynamic image counter
- Admin-controlled content

### Features
- Quality assurance
- Diverse collections
- Customer-first approach

### Contact Section
- Store location and map
- Business hours
- WhatsApp and Instagram links
- Direct contact information

## 🤖 Chatbot Features

The AI assistant can help with:
- Product inquiries
- Store location
- Business hours
- Contact information
- Wedding collections
- Customization options
- And more!

Quick reply buttons for common questions:
- 🛍️ Products
- 📍 Location
- ⏰ Hours
- 📞 Contact

## 👨‍💼 Admin Features

**Gallery Management:**
- Upload multiple images
- View all images with thumbnails
- Remove individual images
- Clear entire gallery
- Real-time preview

**Image Storage:**
- Browser-based (localStorage)
- Automatic synchronization
- Persistent across sessions

## 📱 Responsive Breakpoints

- **Desktop:** 1024px and up
- **Tablet:** 768px to 1024px
- **Mobile:** Below 768px

## 🎨 Color Scheme

- **Primary:** `#c87e3a` (Warm brown/orange)
- **Secondary:** `#6b3f1c` (Dark brown)
- **Background:** `#fefaf5` (Cream white)
- **Text:** `#2c2b26` (Very dark brown)

## 📞 Contact Information

- **Owner:** Raman Nayyar
- **Location:** Main Bazar Street 1, near Elementary School, Garhshankar, Punjab - 144527
- **WhatsApp:** +91 84371 72895
- **Instagram:** @fash_ionvision
- **Hours:** Monday-Saturday: 10:00 AM - 8:00 PM | Sunday: Closed

## 🔐 Admin Credentials

Default login credentials (change in production):
```
Phone: 8437172895
Password: admin123
```

## 💾 Data Persistence

All images are stored in browser's localStorage:
- Key: `fh_permanent_images`
- Format: JSON array of image objects
- Persists across browser sessions
- Clear with "Clear Gallery Cache" button

## 🔧 Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Responsive design, animations
- **JavaScript (Vanilla)** - No frameworks required
- **FontAwesome Icons** - Beautiful icon library
- **LocalStorage API** - Client-side data storage

## 📈 Future Enhancements

- [ ] Backend integration (Node.js/Python)
- [ ] Database storage (MongoDB/PostgreSQL)
- [ ] Payment gateway integration
- [ ] Order management system
- [ ] User authentication
- [ ] Email notifications
- [ ] SMS alerts via WhatsApp API

## 📄 License

This project is open source and available under the MIT License.

## 🎓 Development Notes

### Admin Panel Login Flow
1. User clicks "Admin" button
2. Admin panel initializes
3. User enters phone and password
4. Credentials validated against stored values
5. On success: admin UI is rendered
6. On failure: error message displayed

### Gallery Update Flow
1. Admin uploads images
2. Images converted to base64 (data URL)
3. Stored in localStorage
4. `fh-admin-gallery-changed` event triggered
5. Public gallery listens and refreshes
6. Users see new images immediately

### Chatbot Intelligence
- Keyword-based matching system
- Multiple query variations recognized
- Natural language processing for greetings
- Contextual responses
- Quick reply suggestions

## 🐛 Troubleshooting

**Images not persisting?**
- Check browser's localStorage is enabled
- Ensure sufficient storage space (usually 5-10MB)
- Try clearing cache and reloading

**Admin panel not appearing?**
- Verify credentials are correct
- Check browser console for errors
- Ensure JavaScript is enabled

**Gallery not loading?**
- Check internet connection for external images
- Verify image URLs are valid
- Check browser developer tools console

## 👨‍💻 Author

**Vnayyar1250** - Fashion Hut Garments

---

**Last Updated:** June 8, 2026
**Status:** ✅ Active & Fully Functional
