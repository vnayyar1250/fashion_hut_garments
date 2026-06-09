/**
 * Fashion Hut - Remote Admin Panel
 * Connects to backend API for secure image management
 * Works on any streaming platform & device
 */

(() => {
  const STORAGE_TOKEN_KEY = 'fh_admin_token';
  const STORAGE_PHONE_KEY = 'fh_admin_phone';

  const ENDPOINTS = {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify',
    GET_IMAGES: '/images',
    UPLOAD_IMAGE: '/images',
    DELETE_IMAGE: (id) => `/images/${id}`
  };

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function getToken() {
    return localStorage.getItem(STORAGE_TOKEN_KEY);
  }

  function setToken(token) {
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
  }

  function clearToken() {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_PHONE_KEY);
  }

  async function verifyAdminSession() {
    const token = getToken();
    if (!token) return false;

    const result = await apiCall(ENDPOINTS.VERIFY, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    return result.success;
  }

  function initAuthed(root) {
    renderAdminUI(root);
  }

  function init(root) {
    renderLogin(root);
  }

  async function initApp() {
    if (!document.body) return;
    injectBaseStyles();
    const root = getAdminRoot();
    
    const isAuthed = await verifyAdminSession();
    if (isAuthed) {
      renderAdminUI(root);
    } else {
      clearToken();
      renderLogin(root);
    }
  }

  function getAdminRoot() {
    let root = document.getElementById('fh-admin-root');
    if (!root) {
      root = document.createElement('div');
      root.id = 'fh-admin-root';
      document.body.appendChild(root);
    }
    return root;
  }

  function injectBaseStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #fh-admin-root {
        max-width: 1200px;
        margin: 3rem auto;
        padding: 0 1rem;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        position: relative;
        z-index: 2;
      }
      .fh-admin-card {
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(12px);
        border-radius: 24px;
        box-shadow: 0 16px 48px rgba(0,0,0,0.1);
        border: 1px solid rgba(255,226,204,0.9);
        overflow: hidden;
      }
      .fh-admin-header {
        padding: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        background: linear-gradient(135deg, rgba(200,126,58,0.15), rgba(224,122,58,0.08));
        border-bottom: 1px solid rgba(255,226,204,0.9);
        flex-wrap: wrap;
      }
      .fh-admin-header h2 {
        margin: 0;
        font-size: 1.3rem;
        color: #2c2b26;
      }
      .fh-admin-tag {
        font-size: 0.85rem;
        padding: 0.4rem 0.9rem;
        border-radius: 999px;
        background: #f0e6dc;
        color: #6b3f1c;
        font-weight: 700;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .fh-admin-body {
        padding: 2rem;
      }
      .fh-admin-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      @media (min-width: 900px) {
        .fh-admin-grid { grid-template-columns: 1fr 1.1fr; }
      }
      .fh-form-row {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.8rem;
        margin-bottom: 1.2rem;
      }
      @media (min-width: 600px) {
        .fh-form-row.two { grid-template-columns: 1fr 1fr; }
      }
      label {
        font-weight: 700;
        color: #6b3f1c;
        font-size: 0.95rem;
        display: block;
      }
      input[type="text"], input[type="password"], input[type="file"] {
        width: 100%;
        padding: 0.9rem 1rem;
        border-radius: 14px;
        border: 2px solid rgba(200,126,58,0.2);
        outline: none;
        background: #fff;
        font-size: 1rem;
        transition: all 0.2s ease;
      }
      input:focus {
        border-color: #c87e3a;
        box-shadow: 0 0 0 4px rgba(200,126,58,0.15);
      }
      .fh-admin-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
        margin-top: 1.5rem;
      }
      .fh-btn {
        padding: 0.95rem 1.3rem;
        border-radius: 999px;
        font-weight: 800;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        font-size: 0.95rem;
      }
      .fh-btn:hover { transform: translateY(-2px); }
      .fh-btn:active { transform: translateY(0); }
      .fh-btn-primary {
        background: linear-gradient(135deg, #c87e3a, #a5602c);
        color: white;
        box-shadow: 0 8px 20px rgba(200,126,58,0.3);
      }
      .fh-btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .fh-btn-ghost {
        background: rgba(200,126,58,0.08);
        color: #6b3f1c;
        border: 2px solid rgba(200,126,58,0.3);
      }
      .fh-btn-ghost:hover {
        background: rgba(200,126,58,0.15);
      }
      .fh-error {
        color: #b42318;
        background: rgba(180,35,24,0.08);
        border: 2px solid rgba(180,35,24,0.25);
        border-radius: 14px;
        padding: 1rem;
        margin-top: 1rem;
        font-weight: 700;
      }
      .fh-success {
        color: #0f6a2f;
        background: rgba(15,106,47,0.08);
        border: 2px solid rgba(15,106,47,0.25);
        border-radius: 14px;
        padding: 1rem;
        margin-top: 1rem;
        font-weight: 700;
      }
      .fh-upload-box {
        padding: 1.5rem;
        border-radius: 18px;
        border: 2px dashed rgba(200,126,58,0.4);
        background: rgba(255,247,239,0.9);
      }
      .fh-upload-box .hint {
        color: #6f4e2e;
        font-weight: 600;
        margin-top: 0.8rem;
        font-size: 0.95rem;
      }
      .fh-gallery-admin-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1.2rem;
        margin-top: 1.5rem;
      }
      .fh-admin-thumb {
        background: white;
        border-radius: 18px;
        overflow: hidden;
        border: 2px solid rgba(255,226,204,0.9);
        box-shadow: 0 8px 16px rgba(0,0,0,0.06);
        position: relative;
        transition: all 0.2s ease;
      }
      .fh-admin-thumb:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.12);
      }
      .fh-admin-thumb img {
        width: 100%;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        display: block;
      }
      .fh-admin-thumb .meta {
        padding: 0.7rem;
      }
      .fh-admin-thumb .meta .name {
        font-size: 0.85rem;
        font-weight: 800;
        color: #6b3f1c;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .fh-admin-thumb .meta .date {
        font-size: 0.75rem;
        color: #8a6b4e;
        margin-top: 0.3rem;
      }
      .fh-admin-thumb .remove {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(0,0,0,0.7);
        color: white;
        border: none;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }
      .fh-admin-thumb .remove:hover { 
        background: rgba(0,0,0,0.9);
        transform: scale(1.1);
      }
      .fh-status-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 0.3rem 0.8rem;
        border-radius: 999px;
        font-size: 0.8rem;
        font-weight: 700;
      }
      .fh-status-online {
        background: rgba(15,106,47,0.15);
        color: #0f6a2f;
      }
    `;
    document.head.appendChild(style);
  }

  function renderLogin(root) {
    root.innerHTML = `
      <div class="fh-admin-card">
        <div class="fh-admin-header">
          <h2>🛡️ Fashion Hut Admin Panel</h2>
          <div class="fh-admin-tag"><i class="fas fa-cloud"></i> Remote Backend</div>
        </div>
        <div class="fh-admin-body">
          <div class="fh-admin-grid">
            <div>
              <div class="fh-form-row two">
                <div>
                  <label>Admin Phone</label>
                  <input id="fhAdminPhone" type="text" placeholder="Enter your phone number" />
                </div>
                <div>
                  <label>Password</label>
                  <input id="fhAdminPass" type="password" placeholder="Enter password" />
                </div>
              </div>
              <div class="fh-admin-actions">
                <button class="fh-btn fh-btn-primary" id="fhAdminLogin"><i class="fas fa-sign-in-alt"></i> Login</button>
              </div>
              <div id="fhAdminMsg" style="display:none;"></div>
              <div class="fh-upload-box" style="margin-top:1.5rem;">
                <div style="font-weight:900;color:#6b3f1c;font-size:1.05rem;"><i class="fas fa-info-circle" style="color:#c87e3a;"></i> Secure Cloud Backend</div>
                <div class="hint">✅ All images stored securely on remote server<br>✅ Accessible from any device, anywhere<br>✅ Works perfectly on streaming platforms</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const phoneEl = root.querySelector('#fhAdminPhone');
    const passEl = root.querySelector('#fhAdminPass');
    const msgEl = root.querySelector('#fhAdminMsg');
    const loginBtn = root.querySelector('#fhAdminLogin');

    loginBtn.addEventListener('click', async () => {
      const phone = phoneEl.value.trim();
      const pass = passEl.value;

      if (!phone || !pass) {
        msgEl.style.display = 'block';
        msgEl.className = 'fh-error';
        msgEl.textContent = '❌ Please enter phone and password.';
        return;
      }

      loginBtn.disabled = true;
      loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

      const result = await apiCall(ENDPOINTS.LOGIN, {
        method: 'POST',
        body: { phone, password: pass }
      });

      loginBtn.disabled = false;
      loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';

      if (result.success && result.data.token) {
        setToken(result.data.token);
        localStorage.setItem(STORAGE_PHONE_KEY, phone);
        msgEl.style.display = 'block';
        msgEl.className = 'fh-success';
        msgEl.textContent = '✅ Login successful!';
        setTimeout(() => initAuthed(root), 500);
      } else {
        msgEl.style.display = 'block';
        msgEl.className = 'fh-error';
        msgEl.textContent = '❌ ' + (result.error || 'Invalid credentials');
      }
    });

    phoneEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') loginBtn.click();
    });
    passEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') loginBtn.click();
    });
  }

  function renderAdminUI(root) {
    root.innerHTML = `
      <div class="fh-admin-card">
        <div class="fh-admin-header">
          <h2>👑 Manage Gallery</h2>
          <div style="display:flex; gap:1rem; align-items:center; flex-wrap:wrap;">
            <div class="fh-admin-tag fh-status-online"><i class="fas fa-circle" style="font-size:0.6rem;"></i> Connected to Backend</div>
            <button class="fh-btn fh-btn-ghost" id="fhAdminLogout"><i class="fas fa-sign-out-alt"></i> Logout</button>
          </div>
        </div>
        <div class="fh-admin-body">
          <div class="fh-admin-grid">
            <div>
              <div class="fh-upload-box">
                <div style="font-weight:900;color:#6b3f1c;font-size:1.05rem;"><i class="fas fa-upload" style="color:#c87e3a;"></i> Upload Images</div>
                <div class="hint">Select one or multiple images. All uploads go to remote server instantly.</div>
                <div style="margin-top:1rem;">
                  <input id="fhAdminFile" type="file" accept="image/*" multiple />
                </div>
                <div style="margin-top:0.8rem;color:#6b3f1c;font-weight:600;font-size:0.95rem;" id="fhUploadList">No files selected</div>
                <div class="fh-admin-actions">
                  <button class="fh-btn fh-btn-primary" id="fhAdminUpload"><i class="fas fa-cloud-upload-alt"></i> Upload to Server</button>
                  <button class="fh-btn fh-btn-ghost" id="fhAdminRefresh"><i class="fas fa-sync-alt"></i> Refresh</button>
                </div>
              </div>
              <div id="fhAdminMsg" style="display:none;"></div>
            </div>

            <div>
              <div style="font-weight:900;color:#6b3f1c;font-size:1.05rem;margin-bottom:1rem;"><i class="fas fa-images" style="color:#c87e3a;"></i> Uploaded Images</div>
              <div class="fh-gallery-admin-grid" id="fhAdminGrid">
                <div style="grid-column:1/-1;padding:2rem;text-align:center;color:#999;">
                  <i class="fas fa-spinner fa-spin" style="font-size:2rem;margin-bottom:1rem;display:block;"></i>
                  Loading images...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const logoutBtn = root.querySelector('#fhAdminLogout');
    logoutBtn.addEventListener('click', async () => {
      const token = getToken();
      if (token) {
        await apiCall(ENDPOINTS.LOGOUT, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      clearToken();
      init(root);
    });

    const uploadInput = root.querySelector('#fhAdminFile');
    const uploadList = root.querySelector('#fhUploadList');
    const uploadBtn = root.querySelector('#fhAdminUpload');
    const refreshBtn = root.querySelector('#fhAdminRefresh');
    const msgEl = root.querySelector('#fhAdminMsg');
    const gridEl = root.querySelector('#fhAdminGrid');

    const showMsg = (type, text) => {
      msgEl.style.display = 'block';
      msgEl.className = type === 'error' ? 'fh-error' : 'fh-success';
      msgEl.innerHTML = (type === 'error' ? '❌' : '✅') + ' ' + text;
    };

    uploadInput.addEventListener('change', () => {
      const files = Array.from(uploadInput.files || []);
      uploadList.textContent = files.length ? `📁 ${files.length} file(s) selected` : 'No files selected';
    });

    uploadBtn.addEventListener('click', async () => {
      const files = Array.from(uploadInput.files || []);
      if (!files.length) {
        showMsg('error', 'Select image(s) first.');
        return;
      }

      uploadBtn.disabled = true;
      uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

      const token = getToken();
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.UPLOAD_IMAGE}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          showMsg('success', `Uploaded ${files.length} image(s) successfully!`);
          uploadInput.value = '';
          uploadList.textContent = 'No files selected';
          loadGallery();
          window.dispatchEvent(new Event('fh-admin-gallery-changed'));
        } else {
          showMsg('error', 'Upload failed. Check file size and format.');
        }
      } catch (error) {
        showMsg('error', 'Upload error: ' + error.message);
      }

      uploadBtn.disabled = false;
      uploadBtn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Upload to Server';
    });

    refreshBtn.addEventListener('click', loadGallery);

    async function loadGallery() {
      const token = getToken();
      const result = await apiCall(ENDPOINTS.GET_IMAGES, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      gridEl.innerHTML = '';

      if (!result.success || !result.data || !result.data.images || result.data.images.length === 0) {
        gridEl.innerHTML = `
          <div style="grid-column:1/-1;background:#fafdff;border-radius:18px;padding:2rem;color:#6f8eaa;font-weight:800;text-align:center;">
            <i class="fas fa-inbox" style="font-size:2rem;margin-bottom:1rem;display:block;opacity:0.6;"></i>
            No images uploaded yet. Start uploading!
          </div>
        `;
        return;
      }

      result.data.images.forEach((img) => {
        const thumb = document.createElement('div');
        thumb.className = 'fh-admin-thumb';
        
        const name = img.name ? escapeHtml(img.name) : 'image';
        const date = img.uploadedAt ? new Date(img.uploadedAt).toLocaleString() : 'Unknown date';
        thumb.innerHTML = `
          <button class="remove" title="Delete" data-id="${img.id}">×</button>
          <img src="${img.url}" alt="${name}" loading="lazy" />
          <div class="meta">
            <div class="name" title="${name}">${name}</div>
            <div class="date">${date}</div>
          </div>
        `;

        const removeBtn = thumb.querySelector('.remove');
        removeBtn.addEventListener('click', async () => {
          if (!confirm('Delete this image?')) return;
          
          removeBtn.disabled = true;
          const imgId = removeBtn.getAttribute('data-id');
          const delResult = await apiCall(ENDPOINTS.DELETE_IMAGE(imgId), {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (delResult.success) {
            thumb.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => thumb.remove(), 300);
            window.dispatchEvent(new Event('fh-admin-gallery-changed'));
          } else {
            removeBtn.disabled = false;
            alert('❌ Delete failed: ' + delResult.error);
          }
        });

        gridEl.appendChild(thumb);
      });
    }

    loadGallery();
  }

  async function start() {
    await initApp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
