/**
 * app.js — CampusNeed Shared Utilities
 * ============================================================
 * Cart management, toast notifications, user state, navbar rendering,
 * 50+ product catalog, chat, review system, order history
 * ============================================================
 */

// ===========================================================
// CONSTANTS & THEME
// ===========================================================
const BIAYA_LAYANAN = 2500;

const Theme = {
  KEY: 'campusneed_theme',
  
  init() {
    const saved = localStorage.getItem(this.KEY) || 'dark';
    this.apply(saved);
  },
  
  toggle() {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    this.apply(next);
  },
  
  apply(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(this.KEY, theme);
    this.updateIcon(theme);
  },
  
  updateIcon(theme) {
    const icons = document.querySelectorAll('.theme-icon');
    icons.forEach(icon => {
      if (theme === 'light') {
        icon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
      } else {
        icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
      }
    });
  }
};

// Initialize theme early
Theme.init();

// ===========================================================
// USER STATE
// ===========================================================
const AppUser = {
  get() {
    const data = localStorage.getItem('campusneed_user');
    return data ? JSON.parse(data) : null;
  },
  set(userData) {
    localStorage.setItem('campusneed_user', JSON.stringify(userData));
  },
  getName() {
    const user = this.get();
    return user ? user.nama : null;
  },
  getInitials() {
    const name = this.getName();
    if (!name) return '?';
    const parts = name.split(' ');
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : parts[0].substring(0, 2).toUpperCase();
  },
  isSeller() {
    const user = this.get();
    return user ? user.isSeller === true : false;
  },
  setSeller(value) {
    const user = this.get() || {};
    user.isSeller = value;
    this.set(user);
  },
  logout() {
    localStorage.removeItem('campusneed_user');
    window.location.href = 'index.html';
  }
};

// ===========================================================
// ORDER HISTORY
// ===========================================================
const OrderHistory = {
  KEY: 'campusneed_orders',

  getAll() {
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : [];
  },

  save(orders) {
    localStorage.setItem(this.KEY, JSON.stringify(orders));
  },

  add(order) {
    const orders = this.getAll();
    orders.unshift({
      id: 'ORD-' + Date.now(),
      ...order,
      createdAt: new Date().toISOString()
    });
    this.save(orders);
  },

  updateStatus(orderId, status) {
    const orders = this.getAll();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      this.save(orders);
    }
  },

  getByStatus(status) {
    if (status === 'semua') return this.getAll();
    return this.getAll().filter(o => o.status === status);
  }
};

// ===========================================================
// CART MANAGEMENT
// ===========================================================
const Cart = {
  KEY: 'campusneed_cart',

  getItems() {
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : [];
  },

  saveItems(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
    this.updateBadge();
  },

  addItem(product) {
    const items = this.getItems();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty = (existing.qty || 1) + (product.qty || 1);
      if (product.days) existing.days = product.days;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        type: product.type,
        qty: product.qty || 1,
        days: product.days || null,
        owner: product.owner || '',
        priceUnit: product.priceUnit || '',
        cod: product.cod || false
      });
    }
    this.saveItems(items);
    showToast('Berhasil ditambahkan ke keranjang', 'success');
  },

  removeItem(id) {
    const items = this.getItems().filter(i => i.id !== id);
    this.saveItems(items);
  },

  clear() {
    localStorage.removeItem(this.KEY);
    this.updateBadge();
  },

  getCount() {
    return this.getItems().length;
  },

  getTotal() {
    return this.getItems().reduce((sum, item) => {
      if (item.type === 'sewa') {
        return sum + (item.price * (item.days || 1));
      }
      return sum + (item.price * (item.qty || 1));
    }, 0);
  },

  updateBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = this.getCount();
    badges.forEach(badge => {
      badge.textContent = count;
      badge.setAttribute('data-count', count);
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  }
};

// ===========================================================
// TOAST NOTIFICATIONS
// ===========================================================
function showToast(message, type = 'info', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span>${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ===========================================================
// NAVBAR RENDERING
// ===========================================================
function renderAppNavbar(options = {}) {
  const user = AppUser.get();
  const userName = AppUser.getName();
  const initials = AppUser.getInitials();
  const cartCount = Cart.getCount();
  const showSearch = options.showSearch !== false;

  return `
  <nav class="app-navbar">
    <div class="app-navbar-inner">
      <a href="dashboard.html" class="app-logo">
        <img src="logo-tr.png" alt="CampusNeed" class="app-logo-img">
        <span class="app-logo-text">Campus<span>Need</span></span>
      </a>

      ${showSearch ? `
      <div class="app-search">
        <svg class="app-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="globalSearch" placeholder="Cari produk, kategori..." oninput="handleGlobalSearch(this.value)">
      </div>
      ` : ''}

      <div class="app-nav-actions">
        <button class="app-nav-btn" onclick="Theme.toggle()" title="Toggle Theme">
          <svg class="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></svg>
        </button>

        <button class="app-nav-btn" onclick="toggleCart()" title="Keranjang" id="cartBtn">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <span class="cart-badge" data-count="${cartCount}" style="${cartCount > 0 ? '' : 'display:none'}">${cartCount}</span>
        </button>

        <div class="dropdown">
          <button class="user-menu-btn" onclick="toggleUserMenu()">
            <div class="user-avatar">${user ? initials : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'}</div>
            ${userName ? `<span class="user-name">${userName}</span>` : ''}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div class="dropdown-menu" id="userDropdown">
            ${userName ? `
              <div style="padding: 10px 14px; border-bottom: 1px solid var(--slate-100); margin-bottom: 4px;">
                <div style="font-size: 14px; font-weight: 600; color: var(--slate-800);">${userName}</div>
                <div style="font-size: 12px; color: var(--slate-500);">Mahasiswa UIN Jakarta</div>
              </div>
            ` : ''}
            <a href="dashboard.html" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Dashboard
            </a>
            ${user ? `
            <a href="history.html" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              History Pemesanan
            </a>
            ` : ''}
            <a href="settings.html" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Pengaturan
            </a>
            ${AppUser.isSeller() ? `
            <a href="seller-dashboard.html" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              Dashboard Penjual
            </a>
            ` : ''}
            <div class="dropdown-divider"></div>
            ${user ? `
            <a href="#" class="dropdown-item" onclick="AppUser.logout(); return false;" style="color: var(--danger);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Keluar
            </a>
            ` : `
            <a href="login.html" class="dropdown-item" style="color: var(--orange-600);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              Masuk
            </a>
            <a href="daftar.html" class="dropdown-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              Daftar Akun Baru
            </a>
            `}
          </div>
        </div>
      </div>
    </div>
  </nav>
  `;
}

// ===========================================================
// CART SIDEBAR RENDERING
// ===========================================================
function renderCartSidebar() {
  return `
  <div class="cart-overlay" id="cartOverlay" onclick="toggleCart()"></div>
  <div class="cart-sidebar" id="cartSidebar">
    <div class="cart-sidebar-header">
      <h3>Keranjang</h3>
      <button class="modal-close" onclick="toggleCart()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="cart-sidebar-body" id="cartBody">
      <!-- Filled by JS -->
    </div>
    <div class="cart-sidebar-footer" id="cartFooter">
      <!-- Filled by JS -->
    </div>
  </div>
  `;
}

function updateCartSidebar() {
  const items = Cart.getItems();
  const body = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  if (!body || !footer) return;

  if (items.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--slate-300)" stroke-width="1.5" style="margin-bottom: 12px;"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        <p style="color: var(--slate-500); font-size: 14px;">Keranjang masih kosong</p>
      </div>
    `;
    footer.innerHTML = '';
    return;
  }

  body.innerHTML = items.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div style="font-size: 12px; color: var(--slate-500); margin-bottom: 2px;">${item.type === 'sewa' ? (item.days || 1) + ' hari' : 'x' + (item.qty || 1)}</div>
        <div class="cart-item-price">Rp${(item.type === 'sewa' ? item.price * (item.days || 1) : item.price * (item.qty || 1)).toLocaleString('id-ID')}</div>
      </div>
      <button class="cart-item-remove" onclick="Cart.removeItem('${item.id}'); updateCartSidebar();" title="Hapus">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
      </button>
    </div>
  `).join('');

  const total = Cart.getTotal();
  footer.innerHTML = `
    <div class="cart-total">
      <span>Total</span>
      <span>Rp${total.toLocaleString('id-ID')}</span>
    </div>
    <a href="pembayaran.html" class="btn btn-primary btn-block btn-lg" onclick="prepareCartCheckout()">Checkout</a>
  `;
}

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (!sidebar) return;
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
  updateCartSidebar();
}

function prepareCartCheckout() {
  const items = Cart.getItems();
  if (items.length === 0) return;
  const firstItem = items[0];
  localStorage.setItem('checkout_type', firstItem.type);
  localStorage.setItem('checkout_cod', firstItem.cod ? 'true' : 'false');
  if (firstItem.type === 'sewa') {
    localStorage.setItem('checkout_nama', firstItem.name);
    localStorage.setItem('checkout_durasi', firstItem.days || 1);
    const totalSewa = firstItem.price * (firstItem.days || 1);
    localStorage.setItem('checkout_total_sewa', totalSewa);
    const deposit = Math.round(totalSewa * 0.25);
    localStorage.setItem('checkout_deposit', deposit);
    localStorage.setItem('checkout_owner', firstItem.owner || '');
  } else {
    localStorage.setItem('preloved_nama', firstItem.name);
    localStorage.setItem('preloved_harga', firstItem.price * (firstItem.qty || 1));
    localStorage.setItem('preloved_penjual', firstItem.owner || '');
  }
}

// ===========================================================
// USER MENU TOGGLE
// ===========================================================
function toggleUserMenu() {
  const menu = document.getElementById('userDropdown');
  if (menu) menu.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const dropdown = document.querySelector('.dropdown');
  const menu = document.getElementById('userDropdown');
  if (dropdown && menu && !dropdown.contains(e.target)) {
    menu.classList.remove('show');
  }
});

// ===========================================================
// GLOBAL SEARCH
// ===========================================================
function handleGlobalSearch(query) {
  if (typeof onGlobalSearch === 'function') {
    onGlobalSearch(query);
  }
}

// ===========================================================
// CHAT SYSTEM
// ===========================================================
const ChatSystem = {
  KEY: 'campusneed_chats',

  getChats(sellerId) {
    const data = localStorage.getItem(this.KEY);
    const chats = data ? JSON.parse(data) : {};
    return chats[sellerId] || [];
  },

  addMessage(sellerId, message, fromUser = true) {
    const data = localStorage.getItem(this.KEY);
    const chats = data ? JSON.parse(data) : {};
    if (!chats[sellerId]) chats[sellerId] = [];
    chats[sellerId].push({
      text: message,
      fromUser,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    });
    localStorage.setItem(this.KEY, JSON.stringify(chats));
    return chats[sellerId];
  },

  getAutoReply() {
    const replies = [
      'Halo! Terima kasih sudah menghubungi. Barang masih tersedia ya 😊',
      'Boleh, silakan langsung order aja! Bisa COD di kampus.',
      'Baik, bisa ketemuan di lobi FST ya. Kapan kamu mau ambil?',
      'Masih available, kondisinya bagus. Ada yang mau ditanyakan lagi?',
      'Oke siap! Nanti aku kabari lebih lanjut ya.',
      'Baik, terima kasih! Selamat berbelanja di CampusNeed 🎉'
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }
};

function renderChatModal(sellerName) {
  const sellerId = sellerName.replace(/\s/g, '_').toLowerCase();
  return `
  <div class="chat-modal-overlay" id="chatOverlay" onclick="closeChatModal()"></div>
  <div class="chat-modal" id="chatModal">
    <div class="chat-header">
      <div class="chat-header-info">
        <div class="chat-avatar">${sellerName.substring(0, 2).toUpperCase()}</div>
        <div>
          <div class="chat-seller-name">${sellerName}</div>
          <div class="chat-status">Online</div>
        </div>
      </div>
      <button class="modal-close" onclick="closeChatModal()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="chat-body" id="chatBody">
      <div class="chat-welcome">
        <p>💬 Mulai percakapan dengan <strong>${sellerName}</strong></p>
      </div>
    </div>
    <div class="chat-footer">
      <input type="text" id="chatInput" placeholder="Tulis pesan..." onkeypress="if(event.key==='Enter')sendChatMessage('${sellerId}', '${sellerName}')">
      <button class="chat-send-btn" onclick="sendChatMessage('${sellerId}', '${sellerName}')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>
  </div>
  `;
}

function openChatModal(sellerName) {
  const sellerId = sellerName.replace(/\s/g, '_').toLowerCase();
  let mount = document.getElementById('chatMount');
  if (!mount) {
    mount = document.createElement('div');
    mount.id = 'chatMount';
    document.body.appendChild(mount);
  }
  mount.innerHTML = renderChatModal(sellerName);

  // Load existing chats
  const chats = ChatSystem.getChats(sellerId);
  if (chats.length > 0) {
    const body = document.getElementById('chatBody');
    body.innerHTML = chats.map(msg => `
      <div class="chat-bubble ${msg.fromUser ? 'chat-user' : 'chat-seller'}">
        <div class="chat-text">${msg.text}</div>
        <div class="chat-time">${msg.time}</div>
      </div>
    `).join('');
    body.scrollTop = body.scrollHeight;
  }

  setTimeout(() => {
    document.getElementById('chatModal').classList.add('open');
    document.getElementById('chatOverlay').classList.add('show');
  }, 10);
}

function closeChatModal() {
  const modal = document.getElementById('chatModal');
  const overlay = document.getElementById('chatOverlay');
  if (modal) modal.classList.remove('open');
  if (overlay) overlay.classList.remove('show');
  setTimeout(() => {
    const mount = document.getElementById('chatMount');
    if (mount) mount.innerHTML = '';
  }, 300);
}

function sendChatMessage(sellerId, sellerName) {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message) return;

  // Add user message
  ChatSystem.addMessage(sellerId, message, true);
  input.value = '';

  // Render messages
  renderChatMessages(sellerId);

  // Auto reply after delay
  setTimeout(() => {
    const reply = ChatSystem.getAutoReply();
    ChatSystem.addMessage(sellerId, reply, false);
    renderChatMessages(sellerId);
  }, 1000 + Math.random() * 1500);
}

function renderChatMessages(sellerId) {
  const body = document.getElementById('chatBody');
  const chats = ChatSystem.getChats(sellerId);
  body.innerHTML = chats.map(msg => `
    <div class="chat-bubble ${msg.fromUser ? 'chat-user' : 'chat-seller'}">
      <div class="chat-text">${msg.text}</div>
      <div class="chat-time">${msg.time}</div>
    </div>
  `).join('');
  body.scrollTop = body.scrollHeight;
}

// ===========================================================
// GEOLOCATION
// ===========================================================
const GeoLocation = {
  position: null,

  async getPosition() {
    if (this.position) return this.position;

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        this.position = { lat: -6.3200, lng: 106.7643 };
        resolve(this.position);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.position = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          resolve(this.position);
        },
        () => {
          this.position = { lat: -6.3200, lng: 106.7643 };
          resolve(this.position);
        },
        { timeout: 5000 }
      );
    });
  },

  calcDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
};

// ===========================================================
// SELLER REVIEWS DATA
// ===========================================================
const SellerReviews = {
  data: {
    'Aprillia (Teknik Informatika)': [
      { user: 'Ahmad R.', rating: 5, text: 'Penjual ramah dan barang sesuai deskripsi. Recommended!', date: '2 hari lalu' },
      { user: 'Siti N.', rating: 4, text: 'Respon cepat, COD di kampus tepat waktu.', date: '1 minggu lalu' },
      { user: 'Budi P.', rating: 5, text: 'Kamera yang disewakan kondisinya sangat bagus, terima kasih!', date: '2 minggu lalu' },
    ],
    'Revany (Teknik Informatika)': [
      { user: 'Dina F.', rating: 5, text: 'Laptop disewakan dalam kondisi prima. Sangat membantu untuk tugas akhir.', date: '3 hari lalu' },
      { user: 'Farhan A.', rating: 4, text: 'Barang oke, penjual bisa diandalkan.', date: '1 minggu lalu' },
    ],
    'Rizky (Akuntansi)': [
      { user: 'Maria L.', rating: 5, text: 'Barang preloved tapi kondisinya bagus banget. Penjual jujur.', date: '5 hari lalu' },
      { user: 'Andi S.', rating: 4, text: 'COD tepat waktu, barang sesuai foto.', date: '2 minggu lalu' },
    ],
    'Ahmad (Sistem Informasi)': [
      { user: 'Putri R.', rating: 5, text: 'Tripod yang disewakan berkualitas tinggi. Puas!', date: '1 minggu lalu' },
    ],
    'Siti (Biologi)': [
      { user: 'Hana M.', rating: 4, text: 'Jas lab bersih dan wangi. Makasih kak!', date: '3 hari lalu' },
      { user: 'Yusuf K.', rating: 5, text: 'Pelayanan bagus, respond cepat.', date: '1 minggu lalu' },
    ],
    'Budi (Hukum)': [
      { user: 'Lina S.', rating: 4, text: 'Dispenser masih berfungsi dengan baik. Worth it!', date: '4 hari lalu' },
    ],
    'default': [
      { user: 'Mahasiswa UIN', rating: 4, text: 'Penjual terpercaya, barang sesuai deskripsi.', date: '1 minggu lalu' },
      { user: 'User CampusNeed', rating: 5, text: 'Pelayanan sangat baik, recommended seller!', date: '2 minggu lalu' },
    ]
  },

  getForSeller(sellerName) {
    return this.data[sellerName] || this.data['default'];
  },

  getAverageRating(sellerName) {
    const reviews = this.getForSeller(sellerName);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }
};

// ===========================================================
// PRODUCT DATA — 50+ Products
// ===========================================================
const ProductData = {
  sewa: [
    { id: 'sewa-1', name: 'Kamera DSLR Canon EOS 700D', price: 50000, priceUnit: '/ hari', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop', category: 'Gadgets', owner: 'Aprillia (Teknik Informatika)', location: 'Kampus 1 UIN Jakarta', lat: -6.3190, lng: 106.7633, verified: true, desc: 'Kamera DSLR Canon EOS 700D dalam kondisi sangat baik. Dilengkapi dengan lensa kit 18-55mm IS STM. Cocok untuk tugas fotografi, dokumentasi acara kampus, atau proyek multimedia.' },
    { id: 'sewa-2', name: 'Laptop ASUS ROG Core i7', price: 120000, priceUnit: '/ hari', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop', category: 'Gadgets', owner: 'Revany (Teknik Informatika)', location: 'Sekitar Kost FST', lat: -6.3215, lng: 106.7658, verified: true, desc: 'Laptop gaming ASUS ROG dengan prosesor Intel Core i7, RAM 16GB, SSD 512GB, dan GPU dedicated. Sangat cocok untuk rendering, coding, atau presentasi berat.' },
    { id: 'sewa-3', name: 'Tripod Kamera Takara Heavy Duty', price: 15000, priceUnit: '/ hari', image: 'https://images.unsplash.com/photo-1635002962487-2c1d4d2f56c2?w=400&h=300&fit=crop', category: 'Gadgets', owner: 'Ahmad (Sistem Informasi)', location: 'Gedung Pascasarjana', lat: -6.3185, lng: 106.7640, verified: true, desc: 'Tripod kamera heavy duty, tinggi maks 170cm. Cocok untuk foto dan video stabil.' },
    { id: 'sewa-4', name: 'Jas Laboratorium + Goggles (Size L)', price: 10000, priceUnit: '/ hari', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop', category: 'Fashion', owner: 'Siti (Biologi)', location: 'Kost belakang Kampus 2', lat: -6.3225, lng: 106.7620, verified: true, desc: 'Jas laboratorium putih ukuran L, sudah dicuci bersih. Dilengkapi goggles safety.' },
    { id: 'sewa-5', name: 'Proyektor Mini Portable', price: 75000, priceUnit: '/ hari', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=300&fit=crop', category: 'Gadgets', owner: 'Fajar (Manajemen)', location: 'Kampus 2 UIN Jakarta', lat: -6.3205, lng: 106.7650, verified: true, desc: 'Proyektor mini portable dengan resolusi HD. Sudah termasuk kabel HDMI dan remote.' },
    { id: 'sewa-6', name: 'Microphone Condenser USB', price: 25000, priceUnit: '/ hari', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&h=300&fit=crop', category: 'Gadgets', owner: 'Dina (Komunikasi)', location: 'Fakultas Dakwah', lat: -6.3195, lng: 106.7645, verified: true, desc: 'Microphone condenser USB plug & play. Cocok untuk podcast, rekaman tugas, atau presentasi online.' },
    { id: 'sewa-7', name: 'Ring Light LED 18 Inch', price: 20000, priceUnit: '/ hari', image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop', category: 'Gadgets', owner: 'Nisa (Ilmu Komunikasi)', location: 'Kost Ciputat', lat: -6.3210, lng: 106.7638, verified: true, desc: 'Ring light LED 18 inch dengan tripod. 3 mode warna dan dimmer. Ideal untuk foto produk atau video.' },
    { id: 'sewa-8', name: 'Almamater UIN Jakarta (Size M)', price: 8000, priceUnit: '/ hari', image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop', category: 'Fashion', owner: 'Rahma (Psikologi)', location: 'Kampus 1', lat: -6.3188, lng: 106.7630, verified: true, desc: 'Almamater UIN Jakarta ukuran M, kondisi bersih dan rapi. Cocok untuk acara wisuda atau foto.' },
    { id: 'sewa-9', name: 'GoPro Hero 8 + Accessories', price: 85000, priceUnit: '/ hari', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop', category: 'Gadgets', owner: 'Aprillia (Teknik Informatika)', location: 'Kampus 1 UIN Jakarta', lat: -6.3190, lng: 106.7633, verified: true, desc: 'GoPro Hero 8 Black dengan chest mount, head mount, dan selfie stick. Waterproof. Cocok untuk fieldwork.' },
    { id: 'sewa-10', name: 'Papan Tulis Whiteboard Portable', price: 12000, priceUnit: '/ hari', image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=400&h=300&fit=crop', category: 'Elektronik', owner: 'Yusuf (Pendidikan)', location: 'Fakultas Tarbiyah', lat: -6.3192, lng: 106.7642, verified: true, desc: 'Whiteboard portable 60x90cm + spidol & penghapus. Praktis untuk presentasi kelompok atau belajar bersama.' },
    { id: 'sewa-11', name: 'Speaker Bluetooth JBL Charge 4', price: 30000, priceUnit: '/ hari', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop', category: 'Elektronik', owner: 'Reza (Ekonomi)', location: 'Kost depan kampus', lat: -6.3198, lng: 106.7655, verified: true, desc: 'Speaker bluetooth JBL Charge 4, bass kuat dan tahan air. Cocok untuk acara outdoor atau belajar bareng.' },
    { id: 'sewa-12', name: 'Drone DJI Mini 2', price: 150000, priceUnit: '/ hari', image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop', category: 'Gadgets', owner: 'Revany (Teknik Informatika)', location: 'Sekitar Kost FST', lat: -6.3215, lng: 106.7658, verified: true, desc: 'Drone DJI Mini 2 dengan kamera 4K. Termasuk 2 baterai dan memory card. Untuk dokumentasi udara.' },
    { id: 'sewa-13', name: 'External Hard Drive 2TB', price: 15000, priceUnit: '/ hari', image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400&h=300&fit=crop', category: 'Gadgets', owner: 'Irfan (Sistem Informasi)', location: 'Lab Komputer FST', lat: -6.3200, lng: 106.7643, verified: true, desc: 'External HDD Seagate 2TB USB 3.0. Untuk backup data, transfer file besar, atau menyimpan project.' },
    { id: 'sewa-14', name: 'Kebaya Wisuda Set Lengkap', price: 35000, priceUnit: '/ hari', image: 'https://images.unsplash.com/photo-1594463750939-ebb28c3f7f75?w=400&h=300&fit=crop', category: 'Fashion', owner: 'Putri (Sastra Arab)', location: 'Kost Pondok Cabe', lat: -6.3230, lng: 106.7625, verified: true, desc: 'Kebaya wisuda lengkap dengan kain, selendang, dan aksesoris. Size M-L. Warna pastel pink.' },
    { id: 'sewa-15', name: 'iPad Air + Apple Pencil', price: 100000, priceUnit: '/ hari', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop', category: 'Gadgets', owner: 'Ahmad (Sistem Informasi)', location: 'Gedung Pascasarjana', lat: -6.3185, lng: 106.7640, verified: true, desc: 'iPad Air Gen 4 + Apple Pencil Gen 2. Cocok untuk note-taking, desain, atau presentasi interaktif.' },
    { id: 'sewa-16', name: 'Kalkulator Scientific Casio fx-991', price: 5000, priceUnit: '/ hari', image: 'https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?w=400&h=300&fit=crop', category: 'Gadgets', owner: 'Hendra (Matematika)', location: 'Fakultas Sains', lat: -6.3195, lng: 106.7648, verified: true, desc: 'Kalkulator scientific Casio fx-991ID Plus. Wajib untuk UTS/UAS mata kuliah exact.' },
    { id: 'sewa-17', name: 'Printer Portable Canon SELPHY', price: 40000, priceUnit: '/ hari', image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&h=300&fit=crop', category: 'Elektronik', owner: 'Lina (Desain Grafis)', location: 'Kost Ciputat Timur', lat: -6.3220, lng: 106.7660, verified: true, desc: 'Printer foto portable Canon SELPHY. Print foto 4R langsung dari HP via WiFi. Termasuk kertas foto 20 lembar.' },
    { id: 'sewa-18', name: 'Webcam Logitech C920 HD', price: 18000, priceUnit: '/ hari', image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=300&fit=crop', category: 'Gadgets', owner: 'Fajar (Manajemen)', location: 'Kampus 2 UIN Jakarta', lat: -6.3205, lng: 106.7650, verified: true, desc: 'Webcam Logitech C920 Full HD 1080p. Autofocus dan stereo mic. Untuk kuliah online atau interview.' },
    { id: 'sewa-19', name: 'Stabilizer Gimbal HP DJI OM4', price: 30000, priceUnit: '/ hari', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop', category: 'Gadgets', owner: 'Nisa (Ilmu Komunikasi)', location: 'Kost Ciputat', lat: -6.3210, lng: 106.7638, verified: true, desc: 'Gimbal stabilizer DJI OM4 untuk smartphone. 3-axis stabilization. Cocok untuk konten video smooth.' },
    { id: 'sewa-20', name: 'Jas Sidang Formal Hitam (Size L)', price: 15000, priceUnit: '/ hari', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop', category: 'Fashion', owner: 'Rizal (Hukum)', location: 'Kost dekat Gerbang', lat: -6.3195, lng: 106.7652, verified: true, desc: 'Jas formal hitam untuk sidang skripsi/tesis. Ukuran L, kondisi rapi dan bersih.' },
  ],

  preloved: [
    { id: 'preloved-1', name: 'Kipas Angin Berdiri Cosmos', price: 80000, priceUnit: '', image: 'https://images.unsplash.com/photo-1614690703876-e2d015e29510?w=400&h=300&fit=crop', category: 'Elektronik', owner: 'Rizky (Akuntansi)', location: 'Kost dekat Gerbang Belakang', condition: 'Good', lat: -6.3195, lng: 106.7652, verified: true, cod: true, desc: 'Kipas angin berdiri merk Cosmos, 3 kecepatan angin, masih berfungsi dengan baik.' },
    { id: 'preloved-2', name: 'Kasur Lipat Lantai Single', price: 150000, priceUnit: '', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop', category: 'Furniture', owner: 'Aprillia (Teknik Informatika)', location: 'Gg. H. Jarian', condition: 'Like New', lat: -6.3210, lng: 106.7635, verified: true, cod: true, desc: 'Kasur lipat lantai ukuran single, tebal 8cm. Baru dipakai 1 semester. Kondisi seperti baru.' },
    { id: 'preloved-3', name: 'Buku Paket Coding Java & PHP (Bundling)', price: 35000, priceUnit: '', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop', category: 'Buku', owner: 'Revany (Teknik Informatika)', location: 'Perpustakaan FST', condition: 'Good', lat: -6.3200, lng: 106.7648, verified: true, cod: false, desc: 'Bundle 2 buku: "Java Programming" dan "PHP & MySQL". Ada beberapa highlight di halaman penting.' },
    { id: 'preloved-4', name: 'Dispenser Air Miyako (Hot & Normal)', price: 60000, priceUnit: '', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop', category: 'Elektronik', owner: 'Budi (Hukum)', location: 'Kost Pesona Kampus', condition: 'Fair', lat: -6.3230, lng: 106.7665, verified: true, cod: true, desc: 'Dispenser air Miyako 2 keran (hot dan normal). Fungsi pemanasan masih bagus.' },
    { id: 'preloved-5', name: 'Meja Belajar Lipat Minimalis', price: 95000, priceUnit: '', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop', category: 'Furniture', owner: 'Dewi (Psikologi)', location: 'Kost Ciputat', condition: 'Good', lat: -6.3218, lng: 106.7640, verified: true, cod: true, desc: 'Meja belajar lipat minimalis, warna putih. Mudah dilipat dan disimpan. Cocok untuk kost.' },
    { id: 'preloved-6', name: 'Setrika Uap Philips', price: 45000, priceUnit: '', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop', category: 'Elektronik', owner: 'Sari (Ekonomi)', location: 'Kost belakang kampus', condition: 'Good', lat: -6.3222, lng: 106.7628, verified: true, cod: true, desc: 'Setrika uap Philips, anti lengket. Masih berfungsi sempurna, kabel aman.' },
    { id: 'preloved-7', name: 'Rak Buku 4 Tingkat Kayu', price: 120000, priceUnit: '', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&h=300&fit=crop', category: 'Furniture', owner: 'Andi (Teknik Informatika)', location: 'Kost Pondok Cabe', condition: 'Like New', lat: -6.3228, lng: 106.7618, verified: true, cod: false, desc: 'Rak buku 4 tingkat dari kayu jati. Kokoh dan estetik. Tinggi 120cm x lebar 60cm.' },
    { id: 'preloved-8', name: 'Rice Cooker Miyako 1.2L', price: 55000, priceUnit: '', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', category: 'Elektronik', owner: 'Fadil (Agribisnis)', location: 'Kost dekat FISIP', condition: 'Good', lat: -6.3202, lng: 106.7655, verified: true, cod: true, desc: 'Rice cooker Miyako 1.2L, fungsi cook dan warm normal. Cocok untuk anak kost.' },
    { id: 'preloved-9', name: 'Kamus Besar Bahasa Indonesia Edisi 5', price: 25000, priceUnit: '', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop', category: 'Buku', owner: 'Laila (Sastra Indonesia)', location: 'Fakultas Adab', condition: 'Good', lat: -6.3193, lng: 106.7637, verified: true, cod: true, desc: 'KBBI Edisi ke-5, hardcover. Kondisi 85%, ada sedikit lipatan di beberapa halaman.' },
    { id: 'preloved-10', name: 'Kursi Gaming Murah', price: 350000, priceUnit: '', image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=300&fit=crop', category: 'Furniture', owner: 'Reza (Ekonomi)', location: 'Kost depan kampus', condition: 'Good', lat: -6.3198, lng: 106.7655, verified: true, cod: false, desc: 'Kursi gaming dengan sandaran tinggi dan bantal leher. Warna hitam-merah. Fungsi recliner masih oke.' },
    { id: 'preloved-11', name: 'Lampu Belajar LED Eye-Care', price: 35000, priceUnit: '', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=300&fit=crop', category: 'Elektronik', owner: 'Hana (Farmasi)', location: 'Kost belakang kampus 2', condition: 'Like New', lat: -6.3225, lng: 106.7622, verified: true, cod: true, desc: 'Lampu belajar LED eye-care, 3 level kecerahan. Flexible arm. Charger USB.' },
    { id: 'preloved-12', name: 'Karpet Lantai 2x3m', price: 75000, priceUnit: '', image: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&h=300&fit=crop', category: 'Furniture', owner: 'Nadia (Akuntansi)', location: 'Kost Pondok Labu', condition: 'Good', lat: -6.3232, lng: 106.7670, verified: true, cod: false, desc: 'Karpet lantai ukuran 2x3m, motif minimalis. Sudah dicuci bersih. Cocok untuk kost.' },
    { id: 'preloved-13', name: 'Buku Kalkulus Jilid 1 & 2 Purcell', price: 40000, priceUnit: '', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop', category: 'Buku', owner: 'Hendra (Matematika)', location: 'Fakultas Sains', condition: 'Good', lat: -6.3195, lng: 106.7648, verified: true, cod: true, desc: 'Buku Kalkulus Purcell Jilid 1 & 2. Edisi 9. Ada catatan pinggir yang membantu.' },
    { id: 'preloved-14', name: 'Gorden Blackout 2 Lembar', price: 65000, priceUnit: '', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&h=300&fit=crop', category: 'Furniture', owner: 'Maya (Biologi)', location: 'Kost Ciputat Timur', condition: 'Like New', lat: -6.3220, lng: 106.7660, verified: true, cod: true, desc: 'Gorden blackout warna navy, 2 lembar (kiri-kanan). Ukuran 100x200cm per lembar. Anti cahaya matahari.' },
    { id: 'preloved-15', name: 'Headphone Wireless Sony WH-CH510', price: 120000, priceUnit: '', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', category: 'Gadgets', owner: 'Irfan (Sistem Informasi)', location: 'Lab Komputer FST', condition: 'Good', lat: -6.3200, lng: 106.7643, verified: true, cod: true, desc: 'Headphone wireless Sony WH-CH510. Baterai tahan 35 jam. Suara jernih, bass mantap.' },
    { id: 'preloved-16', name: 'Power Bank Xiaomi 20000mAh', price: 85000, priceUnit: '', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=300&fit=crop', category: 'Gadgets', owner: 'Dina (Komunikasi)', location: 'Fakultas Dakwah', condition: 'Good', lat: -6.3195, lng: 106.7645, verified: true, cod: true, desc: 'Power bank Xiaomi 20000mAh, fast charging 18W. Masih awet, bisa charge HP 4-5x.' },
    { id: 'preloved-17', name: 'Ember + Gayung Set', price: 15000, priceUnit: '', image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=300&fit=crop', category: 'Elektronik', owner: 'Ayu (Pendidikan)', location: 'Kost depan gerbang', condition: 'Good', lat: -6.3188, lng: 106.7630, verified: true, cod: true, desc: 'Ember besar 20L + gayung. Warna biru. Cocok untuk kebutuhan sehari-hari di kost.' },
    { id: 'preloved-18', name: 'Kompor Induksi Portable', price: 180000, priceUnit: '', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', category: 'Elektronik', owner: 'Fadil (Agribisnis)', location: 'Kost dekat FISIP', condition: 'Like New', lat: -6.3202, lng: 106.7655, verified: true, cod: false, desc: 'Kompor induksi portable 1 tungku. Hemat listrik, aman untuk kost. Termasuk panci induksi.' },
    { id: 'preloved-19', name: 'Cermin Dinding Full Body', price: 50000, priceUnit: '', image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&h=300&fit=crop', category: 'Furniture', owner: 'Putri (Sastra Arab)', location: 'Kost Pondok Cabe', condition: 'Like New', lat: -6.3230, lng: 106.7625, verified: true, cod: false, desc: 'Cermin dinding full body ukuran 40x120cm. Frame kayu minimalis. Cocok untuk kost.' },
    { id: 'preloved-20', name: 'Tas Ransel Laptop 15.6 inch', price: 65000, priceUnit: '', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop', category: 'Fashion', owner: 'Andi (Teknik Informatika)', location: 'Kost Pondok Cabe', condition: 'Good', lat: -6.3228, lng: 106.7618, verified: true, cod: true, desc: 'Tas ransel laptop 15.6 inch, warna hitam. Banyak kompartemen, ada slot USB charging.' },
    { id: 'preloved-21', name: 'Buku Bahasa Inggris TOEFL Prep', price: 30000, priceUnit: '', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop', category: 'Buku', owner: 'Laila (Sastra Indonesia)', location: 'Fakultas Adab', condition: 'Good', lat: -6.3193, lng: 106.7637, verified: true, cod: true, desc: 'Buku persiapan TOEFL ITP + CD audio. Ada catatan tips di margin halaman.' },
    { id: 'preloved-22', name: 'Jemuran Berdiri Stainless Steel', price: 45000, priceUnit: '', image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop', category: 'Furniture', owner: 'Sari (Ekonomi)', location: 'Kost belakang kampus', condition: 'Good', lat: -6.3222, lng: 106.7628, verified: true, cod: true, desc: 'Jemuran berdiri stainless steel, bisa dilipat. 3 tingkat. Anti karat.' },
    { id: 'preloved-23', name: 'Mouse Gaming Logitech G102', price: 75000, priceUnit: '', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop', category: 'Gadgets', owner: 'Rizal (Hukum)', location: 'Kost dekat Gerbang', condition: 'Like New', lat: -6.3195, lng: 106.7652, verified: true, cod: true, desc: 'Mouse gaming Logitech G102 Lightsync RGB. Sensor 8000 DPI. Kondisi 95%.' },
    { id: 'preloved-24', name: 'Sandal Gunung EIGER', price: 55000, priceUnit: '', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=300&fit=crop', category: 'Fashion', owner: 'Yusuf (Pendidikan)', location: 'Fakultas Tarbiyah', condition: 'Good', lat: -6.3192, lng: 106.7642, verified: true, cod: true, desc: 'Sandal gunung EIGER size 42. Masih empuk, sol tebal. Cocok untuk fieldwork atau travelling.' },
    { id: 'preloved-25', name: 'Keyboard Wireless Logitech K380', price: 95000, priceUnit: '', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop', category: 'Gadgets', owner: 'Hana (Farmasi)', location: 'Kost belakang kampus 2', condition: 'Like New', lat: -6.3225, lng: 106.7622, verified: true, cod: true, desc: 'Keyboard wireless Bluetooth Logitech K380. Multi-device (bisa 3 device). Warna pink.' },
    { id: 'preloved-26', name: 'Flash Disk 64GB SanDisk', price: 25000, priceUnit: '', image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400&h=300&fit=crop', category: 'Gadgets', owner: 'Maya (Biologi)', location: 'Kost Ciputat Timur', condition: 'Good', lat: -6.3220, lng: 106.7660, verified: true, cod: true, desc: 'Flash disk SanDisk 64GB USB 3.0. Kecepatan baca 130MB/s. Masih lancar.' },
    { id: 'preloved-27', name: 'Panci Set 5 Pcs Stainless', price: 70000, priceUnit: '', image: 'https://images.unsplash.com/photo-1585442231745-f381c52abb7f?w=400&h=300&fit=crop', category: 'Elektronik', owner: 'Nadia (Akuntansi)', location: 'Kost Pondok Labu', condition: 'Good', lat: -6.3232, lng: 106.7670, verified: true, cod: false, desc: 'Set panci stainless 5 pcs (3 panci + 2 tutup). Cocok untuk masak di kost.' },
    { id: 'preloved-28', name: 'Buku Statistik Dasar + Lanjutan', price: 30000, priceUnit: '', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=300&fit=crop', category: 'Buku', owner: 'Hendra (Matematika)', location: 'Fakultas Sains', condition: 'Good', lat: -6.3195, lng: 106.7648, verified: true, cod: true, desc: 'Bundle buku Statistik Dasar dan Statistik Lanjutan. Cocok untuk semester 3-4.' },
    { id: 'preloved-29', name: 'Helm Half Face KYT', price: 85000, priceUnit: '', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop', category: 'Fashion', owner: 'Reza (Ekonomi)', location: 'Kost depan kampus', condition: 'Good', lat: -6.3198, lng: 106.7655, verified: true, cod: true, desc: 'Helm half face KYT, warna hitam doff. Size L. Visor bening + dark. Busa masih tebal.' },
    { id: 'preloved-30', name: 'Gantungan Baju Standing Rack', price: 55000, priceUnit: '', image: 'https://images.unsplash.com/photo-1558171813-01ed56a0e0d5?w=400&h=300&fit=crop', category: 'Furniture', owner: 'Ayu (Pendidikan)', location: 'Kost depan gerbang', condition: 'Like New', lat: -6.3188, lng: 106.7630, verified: true, cod: true, desc: 'Gantungan baju standing rack besi, warna hitam. Kapasitas 30+ baju. Mudah dirakit.' },
  ],

  getAll() {
    return [...this.sewa.map(p => ({ ...p, type: 'sewa' })), ...this.preloved.map(p => ({ ...p, type: 'preloved' }))];
  },

  getById(id) {
    return this.getAll().find(p => p.id === id) || null;
  },

  getByType(type) {
    return type === 'sewa'
      ? this.sewa.map(p => ({ ...p, type: 'sewa' }))
      : this.preloved.map(p => ({ ...p, type: 'preloved' }));
  }
};

// ===========================================================
// SVG ICONS
// ===========================================================
const Icons = {
  verified: '<svg width="14" height="14" viewBox="0 0 24 24" fill="var(--success)" stroke="white" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  location: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  user: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  shield: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  cod: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  star: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  starEmpty: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
};

// ===========================================================
// PRODUCT CARD RENDER HELPER
// ===========================================================
function renderProductCard(product) {
  const distText = product.distanceKm !== undefined
    ? `<div class="product-card-distance">${Icons.location} ${product.distanceKm < 1 ? (product.distanceKm * 1000).toFixed(0) + 'm' : product.distanceKm.toFixed(1) + ' km'}</div>`
    : '';

  const codBadge = (product.type === 'preloved' && product.cod)
    ? `<span class="cod-badge">COD</span>`
    : '';

  const avgRating = SellerReviews.getAverageRating(product.owner);

  return `
    <div class="product-card reveal-card" onclick="window.location.href='detail-produk.html?id=${product.id}'">
      <div class="product-card-img-wrap">
        <img src="${product.image}" alt="${product.name}" class="product-card-img" loading="lazy" onerror="this.src='https://placehold.co/400x300/e2e8f0/94a3b8?text=No+Image'">
        ${codBadge}
      </div>
      <div class="product-card-body">
        <span class="product-card-badge ${product.type === 'sewa' ? 'badge-sewa' : 'badge-preloved'}">${product.type === 'sewa' ? 'Sewa' : 'Preloved'}</span>
        <div class="product-card-title">${product.name}</div>
        <div class="product-card-price">Rp${product.price.toLocaleString('id-ID')} ${product.priceUnit || ''}</div>
        <div class="product-card-meta">
          ${Icons.user}
          <span>${product.owner}</span>
        </div>
        <div class="product-card-rating">
          <span class="rating-stars">${renderStars(parseFloat(avgRating))}</span>
          <span class="rating-value">${avgRating}</span>
        </div>
        ${distText}
      </div>
    </div>
  `;
}

function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars += '<svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    } else {
      stars += '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    }
  }
  return stars;
}

// ===========================================================
// CATEGORY DATA
// ===========================================================
const Categories = [
  { id: 'all', label: 'Semua', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
  { id: 'Gadgets', label: 'Gadgets', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>' },
  { id: 'Fashion', label: 'Fashion', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.38 3.46L16 2 12 5 8 2 3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>' },
  { id: 'Elektronik', label: 'Elektronik', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>' },
  { id: 'Furniture', label: 'Furniture', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z"/><path d="M4 18v2"/><path d="M20 18v2"/></svg>' },
  { id: 'Buku', label: 'Buku', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
];

// ===========================================================
// KURIR DATA
// ===========================================================
const KurirList = [
  { id: 'jnt', name: 'J&T Express', estimate: '1-2 hari', cost: 9000 },
  { id: 'jne', name: 'JNE Regular', estimate: '2-3 hari', cost: 8000 },
  { id: 'gosend', name: 'GoSend Instant', estimate: '1-2 jam', cost: 15000 },
  { id: 'pos', name: 'Pos Indonesia', estimate: '3-5 hari', cost: 7000 },
  { id: 'sicepat', name: 'SiCepat REG', estimate: '1-2 hari', cost: 9500 },
  { id: 'anteraja', name: 'AnterAja', estimate: '2-3 hari', cost: 8500 },
];

// Init on DOM load
document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
});
