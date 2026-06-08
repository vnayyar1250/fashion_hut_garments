(() => {
  // ===============================
  // Admin panel: login + add/remove gallery images
  // Local-only persistence using localStorage.
  // ===============================

  const STORAGE_IMAGES_KEY = 'fh_permanent_images';
  const STORAGE_ADMIN_OK_KEY = 'fh_admin_authed';

  // IMPORTANT: Set your admin credentials here.
  // User requested: pass + phone no.
  // Replace these defaults with your real values.
  const ADMIN_PHONE = '8437172895';
  const ADMIN_PASSWORD = 'admin123';

  const escapeHtml = (s) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');

  function getStoredImages() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_IMAGES_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function setStoredImages(arr) {
    localStorage.setItem(STORAGE_IMAGES_KEY, JSON.stringify(arr));
  }

  // Convert file to dataURL for storage
  function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('File read error'));
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }


  function initAuthed(root) {
    renderAdminUI(root);
  }

  function init(root) {
    renderLogin(root);
  }

  function initApp() {
    if (!document.body) return;
    injectBaseStyles();
    const root = getAdminRoot();
    const isAuthed = localStorage.getItem(STORAGE_ADMIN_OK_KEY) === '1';
    if (isAuthed) {
      renderAdminUI(root);
    } else {
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

  // UI helpers
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
        background: rgba(255,255,255,0.92);
        backdrop-filter: blur(10px);
        border-radius: 22px;
        box-shadow: 0 14px 40px rgba(0,0,0,0.08);
        border: 1px solid rgba(255,226,204,0.8);
        overflow: hidden;
      }
      .fh-admin-header {
        padding: 1.2rem 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        background: linear-gradient(135deg, rgba(200,126,58,0.14), rgba(224,122,58,0.06));
        border-bottom: 1px solid rgba(255,226,204,0.8);
      }
      .fh-admin-header h2 {
        margin: 0;
        font-size: 1.2rem;
      }
      .fh-admin-header .fh-admin-tag {
        font-size: 0.85rem;
        padding: 0.35rem 0.8rem;
        border-radius: 999px;
        background: #f0e6dc;
        color: #6b3f1c;
        font-weight: 700;
        white-space: nowrap;
      }
      .fh-admin-body {
        padding: 1.5rem;
      }
      .fh-admin-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.2rem;
      }
      @media (min-width: 900px) {
        .fh-admin-grid { grid-template-columns: 0.95fr 1.05fr; }
      }
      .fh-form-row {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.6rem;
        margin-bottom: 0.9rem;
      }
      @media (min-width: 600px) {
        .fh-form-row.two {
          grid-template-columns: 1fr 1fr;
        }
      }
      label {
        font-weight: 700;
        color: #6b3f1c;
        font-size: 0.95rem;
      }
      input[type="text"], input[type="password"] {
        width: 100%;
        padding: 0.85rem 0.95rem;
        border-radius: 14px;
        border: 1px solid rgba(200,126,58,0.25);
        outline: none;
        background: #fff;
        font-size: 1rem;
      }
      input:focus {
        border-color: rgba(200,126,58,0.6);
        box-shadow: 0 0 0 4px rgba(200,126,58,0.12);
      }
      .fh-admin-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
        align-items: center;
        margin-top: 1rem;
      }
      .fh-btn {
        padding: 0.9rem 1.1rem;
        border-radius: 999px;
        font-weight: 800;
        border: none;
        cursor: pointer;
        transition: transform 0.15s ease, filter 0.15s ease, background 0.15s ease;
        display: inline-flex;
        align-items: center;
        gap: 10px;
      }
      .fh-btn:active { transform: translateY(1px); }
      .fh-btn-primary {
        background: #c87e3a;
        color: white;
        box-shadow: 0 10px 18px rgba(200,126,58,0.25);
      }
      .fh-btn-primary:hover { filter: brightness(0.95); }
      .fh-btn-ghost {
        background: rgba(200,126,58,0.08);
        color: #6b3f1c;
        border: 1px solid rgba(200,126,58,0.25);
      }
      .fh-error {
        color: #b42318;
        background: rgba(180,35,24,0.08);
        border: 1px solid rgba(180,35,24,0.18);
        border-radius: 14px;
        padding: 0.75rem 0.9rem;
        margin-top: 0.9rem;
        font-weight: 700;
      }
      .fh-success {
        color: #0f6a2f;
        background: rgba(15,106,47,0.08);
        border: 1px solid rgba(15,106,47,0.18);
        border-radius: 14px;
        padding: 0.75rem 0.9rem;
        margin-top: 0.9rem;
        font-weight: 700;
      }

      .fh-upload-box {
        padding: 1rem;
        border-radius: 18px;
        border: 1px dashed rgba(200,126,58,0.45);
        background: rgba(255,247,239,0.8);
      }
      .fh-upload-box .hint {
        color: #6f4e2e;
        font-weight: 600;
        margin-top: 0.6rem;
        font-size: 0.95rem;
      }
      .fh-upload-list {
        margin-top: 0.8rem;
        font-weight: 600;
        color: #6b3f1c;
        font-size: 0.95rem;
      }
      .fh-gallery-admin-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }
      .fh-admin-thumb {
        background: white;
        border-radius: 18px;
        overflow: hidden;
        border: 1px solid rgba(255,226,204,0.8);
        box-shadow: 0 10px 20px rgba(0,0,0,0.06);
        position: relative;
      }
      .fh-admin-thumb img {
        width: 100%;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        display: block;
      }
      .fh-admin-thumb .meta {
        padding: 0.55rem 0.7rem;
      }
      .fh-admin-thumb .meta .name {
        font-size: 0.9rem;
        font-weight: 800;
        color: #6b3f1c;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .fh-admin-thumb .meta .date {
        font-size: 0.78rem;
        color: #8a6b4e;
        margin-top: 0.2rem;
      }
      .fh-admin-thumb .remove {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(0,0,0,0.65);
        color: white;
        border: none;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .fh-admin-thumb .remove:hover { background: rgba(0,0,0,0.78); }
    `;
    document.head.appendChild(style);
  }

  function renderLogin(root) {
    root.innerHTML = `
      <div class="fh-admin-card">
        <div class="fh-admin-header">
          <h2>🛡️ Fashion Hut Admin Panel</h2>
          <div class="fh-admin-tag">Phone + Password Login</div>
        </div>
        <div class="fh-admin-body">
          <div class="fh-admin-grid">
            <div>
              <div class="fh-form-row two">
                <div>
                  <label>Admin Phone</label>
                  <input id="fhAdminPhone" type="text" placeholder="Enter phone" />
                </div>
                <div>
                  <label>Admin Password</label>
                  <input id="fhAdminPass" type="password" placeholder="Enter password" />
                </div>
              </div>
              <div class="fh-admin-actions">
                <button class="fh-btn fh-btn-primary" id="fhAdminLogin"><i class="fas fa-lock"></i> Login</button>
                <button class="fh-btn fh-btn-ghost" id="fhAdminReset"><i class="fas fa-undo"></i> Clear Gallery Cache</button>
              </div>
              <div id="fhAdminMsg" style="display:none;"></div>
              <div class="hint" style="margin-top:1rem;color:#6f4e2e;font-weight:700;">Note: Images are stored in your browser (localStorage) for this demo.</div>
            </div>

            <div>
    `;

    const phoneEl = root.querySelector('#fhAdminPhone');
    const passEl = root.querySelector('#fhAdminPass');
    const msgEl = root.querySelector('#fhAdminMsg');

    const loginBtn = root.querySelector('#fhAdminLogin');
    loginBtn.addEventListener('click', () => {
      const phone = phoneEl.value.trim();
      const pass = passEl.value;

      if (phone === ADMIN_PHONE && pass === ADMIN_PASSWORD) {
        localStorage.setItem(STORAGE_ADMIN_OK_KEY, '1');
        initAuthed(root);
      } else {
        msgEl.style.display = 'block';
        msgEl.className = 'fh-error';
        msgEl.textContent = 'Invalid phone or password.';
      }
    });

    root.querySelector('#fhAdminReset').addEventListener('click', () => {
      // clears stored images and auto-remains unauthenticated
      localStorage.removeItem(STORAGE_IMAGES_KEY);
      localStorage.removeItem(STORAGE_ADMIN_OK_KEY);
      init(root);
    });
  }

  function renderAdminUI(root) {
    const images = getStoredImages();

    root.innerHTML = `
      <div class="fh-admin-card">
        <div class="fh-admin-header">
          <h2>👑 Manage Gallery</h2>
          <div style="display:flex; gap:0.6rem; align-items:center; flex-wrap:wrap; justify-content:flex-end;">
            <div class="fh-admin-tag">${images.length} image(s)</div>
            <button class="fh-btn fh-btn-ghost" id="fhAdminLogout"><i class="fas fa-sign-out-alt"></i> Logout</button>
          </div>
        </div>
        <div class="fh-admin-body">
          <div class="fh-admin-grid">
            <div>
              <div class="fh-upload-box">
                <div style="font-weight:900;color:#6b3f1c;">Add images</div>
                <div class="hint">Select one or multiple images. They will appear for users right after upload.</div>
                <div style="margin-top:0.9rem;">
                  <input id="fhAdminFile" type="file" accept="image/*" multiple />
                </div>
                <div class="fh-upload-list" id="fhUploadList">No files selected.</div>
                <div class="fh-admin-actions">
                  <button class="fh-btn fh-btn-primary" id="fhAdminUpload"><i class="fas fa-upload"></i> Upload</button>
                  <button class="fh-btn fh-btn-ghost" id="fhAdminClearAll"><i class="fas fa-trash"></i> Remove All</button>
                </div>
              </div>

              <div id="fhAdminMsg" style="display:none;"></div>
            </div>

            <div>
              <div style="font-weight:900;color:#6b3f1c;">Gallery thumbnails</div>
              <div class="fh-gallery-admin-grid" id="fhAdminGrid"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    root.querySelector('#fhAdminLogout').addEventListener('click', () => {
      localStorage.removeItem(STORAGE_ADMIN_OK_KEY);
      init(root);
    });

    const uploadInput = root.querySelector('#fhAdminFile');
    const uploadList = root.querySelector('#fhUploadList');

    uploadInput.addEventListener('change', () => {
      const files = Array.from(uploadInput.files || []);
      uploadList.textContent = files.length ? `${files.length} file(s) selected.` : 'No files selected.';
    });

    const msgEl = root.querySelector('#fhAdminMsg');
    const showMsg = (type, text) => {
      msgEl.style.display = 'block';
      msgEl.className = type === 'error' ? 'fh-error' : 'fh-success';
      msgEl.textContent = text;
    };

    // Upload logic (device gallery -> localStorage)
    const uploadBtn = root.querySelector('#fhAdminUpload');
    const clearAllBtn = root.querySelector('#fhAdminClearAll');

    const persistImages = async (files) => {
      const existing = getStoredImages();
      const startLen = existing.length;

      const toPersist = files.map(async (file) => {
        const dataUrl = await fileToDataURL(file);
        return {
          id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + '_' + Math.random().toString(16).slice(2),
          name: file.name || 'image',
          url: dataUrl,
          addedAt: new Date().toISOString()
        };
      });

      const results = await Promise.all(toPersist);
      const merged = existing.concat(results);

      // Save back to localStorage
      setStoredImages(merged);

      // Clear file selection UI
      if (uploadInput) uploadInput.value = '';

      showMsg('success', `Uploaded ${results.length} image(s).`);

      // Notify public gallery
      window.dispatchEvent(new Event('fh-admin-gallery-changed'));

      // Re-render admin grid
      renderGrid();

      return { startLen, endLen: merged.length };
    };

    uploadBtn.addEventListener('click', async () => {
      const files = Array.from(uploadInput.files || []);
      if (!files.length) {
        showMsg('error', 'Select image(s) first.');
        return;
      }
      try {
        // Keep it small enough for localStorage (simple safety)
        // If images are large, browser may throw quota error.
        // We do not block, but show friendly error.
        await persistImages(files);
      } catch (e) {
        console.error(e);
        showMsg('error', 'Upload failed (storage quota or file read error). Try smaller images.');
      }
    });

    clearAllBtn.addEventListener('click', () => {
      if (!confirm('Remove all uploaded images?')) return;
      localStorage.removeItem(STORAGE_IMAGES_KEY);
      showMsg('success', 'All images removed.');
      renderGrid();
      window.dispatchEvent(new Event('fh-admin-gallery-changed'));
    });

    const renderGrid = () => {

      const grid = root.querySelector('#fhAdminGrid');
      const arr = getStoredImages();
      if (!grid) return;
      grid.innerHTML = '';

      if (arr.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;background:#fafdff;border-radius:18px;padding:1rem;color:#6f8eaa;font-weight:800;">No images uploaded yet.</div>`;
        return;
      }

      arr.forEach((img) => {
        const thumb = document.createElement('div');
        thumb.className = 'fh-admin-thumb';

        const name = img.name ? escapeHtml(img.name) : 'image';
        const date = img.addedAt ? new Date(img.addedAt).toLocaleString() : '';
        thumb.innerHTML = `
          <button class="remove" title="Remove">×</button>
          <img src="${img.url}" alt="${name}" />
          <div class="meta">
            <div class="name" title="${name}">${name}</div>
            <div class="date">${date}</div>
          </div>
        `;

        const removeBtn = thumb.querySelector('.remove');
        removeBtn.addEventListener('click', () => {
          const current = getStoredImages();
          const filtered = current.filter(x => x.id !== img.id);
          setStoredImages(filtered);
          renderGrid();
          // also update public gallery if present
          window.dispatchEvent(new Event('fh-admin-gallery-changed'));
        });

        grid.appendChild(thumb);
      });
    };

    renderGrid();
  }

  // ============================================
  // START
  // ============================================
  // Render into #fh-admin-root when page loads.
  function start() {
    // If admin-page is embedded into other pages, still works.
    // We render login/admin immediately.
    initApp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();


