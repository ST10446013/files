/* ================================================================
   DATA
   ================================================================ */
const CATEGORIES = [
  { key:'birthday',  name:'Birthday',      icon:'ic-gift' },
  { key:'anniversary',name:'Anniversary',  icon:'ic-heart' },
  { key:'baby',      name:'New Baby',      icon:'ic-star' },
  { key:'corporate', name:'Corporate',     icon:'ic-box' },
  { key:'home',      name:'Home & Living', icon:'ic-home' },
  { key:'selfcare',  name:'Self-Care',     icon:'ic-package' },
  { key:'kids',      name:'Kids',          icon:'ic-tag' },
];

const HUES = [
  ['#C41E4A','#8E1338'], ['#E4176F','#A81254'], ['#4B152A','#2B0A17'],
  ['#D6336C','#921946'], ['#B0224A','#6E0F31'], ['#F0447B','#B21857'],
];

const PRODUCTS = [
  { id:1,  name:'Personalised Photo Mug',        cat:'corporate', price:189, was:null, tag:'Bestseller', rating:4.8, reviews:132, stock:24,
    desc:'A ceramic 350ml mug printed with a photo of your choosing. Dishwasher- and microwave-safe, arrives boxed and ready to gift.' },
  { id:2,  name:'Rose Gold Birthstone Necklace', cat:'anniversary', price:459, was:549, tag:'New in', rating:4.9, reviews:87, stock:11,
    desc:'A dainty rose-gold plated necklace set with the recipient\'s birthstone. Presented in a velvet keepsake box.' },
  { id:3,  name:'Luxury Gourmet Hamper',         cat:'birthday', price:649, was:null, tag:'Popular', rating:4.7, reviews:204, stock:8,
    desc:'A curated hamper of artisanal snacks, preserves and a bottle of sparkling grape juice, wrapped in kraft and ribbon.' },
  { id:4,  name:'Soy Candle Trio',               cat:'selfcare', price:329, was:379, tag:'Sale', rating:4.6, reviews:156, stock:30,
    desc:'Three hand-poured soy candles — Fig & Cassis, Amber Wood, and Sea Salt Linen — each with a 40-hour burn time.' },
  { id:5,  name:'Cozy Knit Throw Blanket',       cat:'home', price:399, was:null, tag:null, rating:4.8, reviews:64, stock:19,
    desc:'A chunky-knit throw in brushed acrylic, generously sized for the couch. Machine washable, available in three shades.' },
  { id:6,  name:'Engraved Wooden Keepsake Box',  cat:'anniversary', price:289, was:null, tag:'New in', rating:4.9, reviews:41, stock:15,
    desc:'A solid oak keepsake box with a custom-engraved lid, felt-lined interior — perfect for rings, letters or trinkets.' },
  { id:7,  name:'Spa Day Pamper Box',            cat:'selfcare', price:549, was:629, tag:'Sale', rating:4.7, reviews:98, stock:12,
    desc:'A full at-home spa set: bath salts, body oil, a konjac sponge and a scented candle, packed in a reusable box.' },
  { id:8,  name:'Kids Plush Bundle',             cat:'kids', price:249, was:null, tag:'Bestseller', rating:4.9, reviews:172, stock:40,
    desc:'A soft plush bundle of three collectible animal friends, hypoallergenic filling, suitable from birth.' },
  { id:9,  name:'New Baby Welcome Crate',        cat:'baby', price:599, was:null, tag:'Popular', rating:4.8, reviews:53, stock:9,
    desc:'Everything for a warm welcome: a swaddle set, plush toy, milestone cards and a handwritten note card.' },
  { id:10, name:'Corporate Gift Crate',          cat:'corporate', price:799, was:899, tag:'Sale', rating:4.6, reviews:37, stock:14,
    desc:'A branded gift crate with gourmet coffee, a notebook, desk plant and chocolates — ideal for client gifting.' },
  { id:11, name:'Succulent Trio Planter Set',    cat:'home', price:219, was:null, tag:null, rating:4.5, reviews:29, stock:22,
    desc:'Three low-maintenance succulents in matching ceramic planters, delivered ready to display.' },
  { id:12, name:'Belgian Chocolate Box',         cat:'birthday', price:159, was:null, tag:'Bestseller', rating:4.9, reviews:311, stock:60,
    desc:'A 24-piece box of hand-finished Belgian chocolates in a mix of pralines, truffles and ganache.' },
];

function hueFor(id){ return HUES[id % HUES.length]; }
function catName(key){ const c = CATEGORIES.find(c=>c.key===key); return c ? c.name : key; }
function catIcon(key){ const c = CATEGORIES.find(c=>c.key===key); return c ? c.icon : 'ic-gift'; }
function money(n){ return 'R' + n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

/* ================================================================
   STATE
   ================================================================ */
let state = {
  user: { name:'Lindiwe Zulu', email:'lindiwe@example.com' },
  cart: {},        // productId -> qty
  wishlist: new Set([2, 7]),
  shopCategory: 'all',
  homeCategory: 'all',
  currentProductId: 1,
  history: [],
  current: 'login',
  promoApplied: false,
  trackStep: 1,
};

const TABS = [
  { key:'home', label:'Home', icon:'ic-home' },
  { key:'shop', label:'Shop', icon:'ic-grid' },
  { key:'wishlist', label:'Wishlist', icon:'ic-heart' },
  { key:'cart', label:'Cart', icon:'ic-cart' },
  { key:'profile', label:'Profile', icon:'ic-user' },
];

/* ================================================================
   NAVIGATION
   ================================================================ */
function goTo(screen, opts={}){
  if(opts.push !== false){ state.history.push(state.current); }
  state.current = screen;
  renderCurrentScreen();
  document.querySelectorAll('.screen').forEach(s=>{
    s.classList.toggle('is-active', s.dataset.screen === screen);
  });
}
function goBack(){
  const prev = state.history.pop();
  goTo(prev || 'home', { push:false });
}
function openProduct(id){
  state.currentProductId = id;
  goTo('product');
}

function buildTabbars(){
  const el = document.getElementById('siteNav');
  if(!el) return;
  el.innerHTML = TABS.map(t=>{
    const badge = t.key==='cart' ? cartCount() : (t.key==='wishlist' ? state.wishlist.size : 0);
    return `<button class="tab ${t.key===state.current?'is-active':''}" onclick="goTo('${t.key}',{push:false})">
      <svg><use href="#${t.icon}"/></svg>
      <span>${t.label}</span>
      ${badge>0? `<span class="badge">${badge}</span>`:''}
    </button>`;
  }).join('');
}

/* ================================================================
   ICON SWATCH HELPER (product "image" placeholder)
   ================================================================ */
function swatchStyle(id){
  const [a,b] = hueFor(id);
  return `background:linear-gradient(150deg, ${a}, ${b});`;
}
function swatchHtml(product, size='md'){
  return `<div class="swatch" style="${swatchStyle(product.id)}">
    <svg style="color:rgba(255,255,255,.92)"><use href="#${catIcon(product.cat)}"/></svg>
  </div>`;
}

/* ================================================================
   PRODUCT CARD TEMPLATE
   ================================================================ */
function productCardFixed(p){
  const isWished = state.wishlist.has(p.id);
  return `
  <div class="pcard" onclick="openProduct(${p.id})">
    <div class="swatch" style="${swatchStyle(p.id)}">
      <svg style="color:rgba(255,255,255,.92)"><use href="#${catIcon(p.cat)}"/></svg>
      ${p.tag ? `<div class="tag">${p.tag}</div>`:''}
      <div class="heart" onclick="event.stopPropagation(); toggleWishlist(${p.id});">
        <svg style="${isWished?'color:var(--berry)':''}"><use href="#${isWished?'ic-heart-fill':'ic-heart'}"/></svg>
      </div>
    </div>
    <div class="body">
      <p class="pname">${p.name}</p>
      <p class="pcat">${catName(p.cat)}</p>
      <div class="prow">
        <span class="price">${money(p.price)}</span>
        <button class="add-btn" onclick="event.stopPropagation(); addToCart(${p.id});"><svg><use href="#ic-plus"/></svg></button>
      </div>
    </div>
  </div>`;
}

/* ================================================================
   RENDER: HOME
   ================================================================ */
function renderHome(){
  document.getElementById('homeGreetName').textContent = 'Hi, ' + state.user.name.split(' ')[0];
  document.getElementById('homeCategoryChips').innerHTML = CATEGORIES.map(c=>`
    <div class="chip" onclick="goToShopWithCategory('${c.key}')">${c.name}</div>`).join('');
  const trending = PRODUCTS.slice(0,6);
  document.getElementById('homeTrending').innerHTML = trending.map(productCardFixed).join('');
  document.getElementById('homeOccasionGrid').innerHTML = CATEGORIES.slice(0,8).map((c,i)=>{
    const [a,b] = hueFor(i);
    return `<div class="occasion-tile" style="background:linear-gradient(150deg, ${a}22, ${b}11); border-color:${a}33" onclick="goToShopWithCategory('${c.key}')">
      <svg style="color:${a}"><use href="#${c.icon}"/></svg>
      <span>${c.name}</span>
    </div>`;
  }).join('');
}
function goToShopWithCategory(cat){
  state.shopCategory = cat;
  goTo('shop');
}

/* ================================================================
   RENDER: SHOP
   ================================================================ */
function renderShop(){
  const chipsEl = document.getElementById('shopCategoryChips');
  const all = [{key:'all', name:'All gifts'}, ...CATEGORIES];
  chipsEl.innerHTML = all.map(c=>`
    <div class="chip ${state.shopCategory===c.key?'is-active':''}" onclick="setShopCategory('${c.key}')">${c.name}</div>`).join('');

  const q = (document.getElementById('shopSearchInput').value || '').toLowerCase().trim();
  let list = PRODUCTS.filter(p => state.shopCategory==='all' || p.cat===state.shopCategory);
  if(q) list = list.filter(p => p.name.toLowerCase().includes(q) || catName(p.cat).toLowerCase().includes(q));

  document.getElementById('shopCount').textContent = `${list.length} gift${list.length!==1?'s':''}`;
  const gridEl = document.getElementById('shopGrid');
  if(list.length === 0){
    gridEl.innerHTML = `<div style="grid-column:1/-1;">
      <div class="empty-state">
        <svg><use href="#ic-search"/></svg>
        <h4>No gifts found</h4>
        <p>Try a different search term or browse all categories instead.</p>
        <button class="btn btn-outline btn-small" onclick="setShopCategory('all')">Clear filters</button>
      </div>
    </div>`;
  } else {
    gridEl.innerHTML = list.map(productCardFixed).join('');
  }
  buildTabbars();
}
function setShopCategory(key){
  state.shopCategory = key;
  renderShop();
}

/* ================================================================
   RENDER: PRODUCT VIEW
   ================================================================ */
let openAccordion = 'desc';
function renderProduct(){
  const p = PRODUCTS.find(pr=>pr.id===state.currentProductId) || PRODUCTS[0];
  const isWished = state.wishlist.has(p.id);
  const heartBtn = document.getElementById('pvHeartBtn');
  heartBtn.classList.toggle('on', isWished);
  heartBtn.innerHTML = `<svg><use href="#${isWished?'ic-heart-fill':'ic-heart'}"/></svg>`;
  document.getElementById('pvCtaPrice').textContent = money(p.price);

  const related = PRODUCTS.filter(pr=>pr.cat===p.cat && pr.id!==p.id).slice(0,4);
  const relatedList = related.length ? related : PRODUCTS.filter(pr=>pr.id!==p.id).slice(0,4);

  document.getElementById('productScroll').innerHTML = `
    <div class="pv-media" style="${swatchStyle(p.id)}">
      <svg style="color:rgba(255,255,255,.92)"><use href="#${catIcon(p.cat)}"/></svg>
      <div class="pv-dots"><span></span><span></span><span></span></div>
    </div>
    <div class="pv-body">
      <div class="pv-cat">${catName(p.cat)}</div>
      <h1 class="pv-title h-display">${p.name}</h1>
      <div class="pv-rating">
        <svg><use href="#ic-star"/></svg><svg><use href="#ic-star"/></svg><svg><use href="#ic-star"/></svg><svg><use href="#ic-star"/></svg><svg><use href="#ic-star"/></svg>
        <span>${p.rating} · ${p.reviews} reviews</span>
      </div>
      <div class="pv-price-row">
        <span class="price">${money(p.price)}</span>
        ${p.was ? `<span class="was">${money(p.was)}</span>`:''}
      </div>
      <p class="pv-desc">${p.desc}</p>
      <div class="pv-meta">
        <div><svg><use href="#ic-truck"/></svg> 1–2 day delivery</div>
        <div><svg><use href="#ic-package"/></svg> ${p.stock} in stock</div>
        <div><svg><use href="#ic-gift"/></svg> Free gift wrap</div>
      </div>

      <div class="reserve-link" onclick="reserveCurrent()">
        <svg><use href="#ic-clock"/></svg> Reserve in-store for up to 14 days instead
      </div>

      <div class="qty-row">
        <div class="qty-stepper">
          <button onclick="stepQty(-1)">−</button>
          <span class="qty-val" id="pvQtyVal">1</span>
          <button onclick="stepQty(1)">+</button>
        </div>
        <span class="stock">Only ${p.stock} left — order soon</span>
      </div>

      <div class="accordion">
        <div class="acc-item ${openAccordion==='desc'?'open':''}" onclick="toggleAcc('desc')">
          <div class="acc-head"><h5>Product details</h5><svg><use href="#ic-chev" style="transform:rotate(90deg)"/></svg></div>
          <div class="acc-body">Handpicked and quality-checked before dispatch. Ethically sourced where possible, and every item is inspected before it leaves our Durban warehouse.</div>
        </div>
        <div class="acc-item ${openAccordion==='delivery'?'open':''}" onclick="toggleAcc('delivery')">
          <div class="acc-head"><h5>Delivery &amp; returns</h5><svg><use href="#ic-chev" style="transform:rotate(90deg)"/></svg></div>
          <div class="acc-body">Delivered within 1–2 working days across Durban, 3–5 days nationwide. Not quite right? Return within 14 days for a full refund.</div>
        </div>
        <div class="acc-item ${openAccordion==='reviews'?'open':''}" onclick="toggleAcc('reviews')">
          <div class="acc-head"><h5>Reviews (${p.reviews})</h5><svg><use href="#ic-chev" style="transform:rotate(90deg)"/></svg></div>
          <div class="acc-body">"Beautifully packaged and arrived right on time — the recipient was thrilled." — a recent Gift4Joy customer.</div>
        </div>
      </div>

      <div class="related-wrap">
        <div class="section-head" style="margin-left:0;margin-right:0;"><h4>You may also like</h4></div>
      </div>
    </div>
    <div class="hscroll">${relatedList.map(productCardFixed).join('')}</div>
  `;
}
function toggleAcc(key){ openAccordion = (openAccordion===key) ? null : key; renderProduct(); }
function stepQty(delta){
  const el = document.getElementById('pvQtyVal');
  let v = parseInt(el.textContent,10) + delta;
  if(v < 1) v = 1;
  el.textContent = v;
}
function reserveCurrent(){
  const p = PRODUCTS.find(pr=>pr.id===state.currentProductId);
  toast(`"${p.name}" reserved for 14 days`);
}

/* ================================================================
   WISHLIST LOGIC
   ================================================================ */
function toggleWishlist(id){
  if(state.wishlist.has(id)) state.wishlist.delete(id);
  else { state.wishlist.add(id); toast('Added to wishlist'); }
  renderCurrentScreen();
  buildTabbars();
}
function toggleWishlistCurrent(){ toggleWishlist(state.currentProductId); renderProduct(); }

function renderWishlist(){
  const items = PRODUCTS.filter(p=>state.wishlist.has(p.id));
  const listEl = document.getElementById('wishlistList');
  if(items.length===0){
    listEl.innerHTML = `<div class="empty-state">
      <svg><use href="#ic-heart"/></svg>
      <h4>Your wishlist is empty</h4>
      <p>Tap the heart on any gift to save it here for later.</p>
      <button class="btn btn-outline btn-small" onclick="goTo('shop')">Browse gifts</button>
    </div>`;
  } else {
    listEl.innerHTML = items.map(p=>`
      <div class="wl-item">
        <div class="swatch" style="${swatchStyle(p.id)}"><svg style="color:rgba(255,255,255,.9)"><use href="#${catIcon(p.cat)}"/></svg></div>
        <div class="info">
          <h5>${p.name}</h5>
          <div class="cat">${catName(p.cat)} · ${money(p.price)}</div>
          <div class="row">
            <button class="move-btn" onclick="addToCart(${p.id}); toggleWishlist(${p.id});">Move to cart</button>
            <button class="remove" onclick="toggleWishlist(${p.id})"><svg><use href="#ic-heart-fill"/></svg></button>
          </div>
        </div>
      </div>`).join('');
  }
  const rec = PRODUCTS.filter(p=>!state.wishlist.has(p.id)).slice(0,5);
  document.getElementById('wlRecHead').style.display = 'flex';
  document.getElementById('wlRecommend').innerHTML = rec.map(productCardFixed).join('');
  buildTabbars();
}

/* ================================================================
   CART LOGIC
   ================================================================ */
function cartCount(){ return Object.values(state.cart).reduce((a,b)=>a+b,0); }
function addToCart(id){
  state.cart[id] = (state.cart[id]||0) + 1;
  toast('Added to cart');
  buildTabbars();
  if(document.querySelector('.screen[data-screen="cart"]').classList.contains('is-active')) renderCart();
}
function addCurrentToCart(){
  const qty = parseInt(document.getElementById('pvQtyVal').textContent,10) || 1;
  state.cart[state.currentProductId] = (state.cart[state.currentProductId]||0) + qty;
  toast('Added to cart');
  buildTabbars();
}
function changeCartQty(id, delta){
  const next = (state.cart[id]||0) + delta;
  if(next <= 0) delete state.cart[id];
  else state.cart[id] = next;
  renderCart();
  buildTabbars();
}
function removeFromCart(id){
  delete state.cart[id];
  renderCart();
  buildTabbars();
}
function cartTotals(){
  let subtotal = 0;
  Object.entries(state.cart).forEach(([id,qty])=>{
    const p = PRODUCTS.find(pr=>pr.id===parseInt(id,10));
    if(p) subtotal += p.price * qty;
  });
  const delivery = subtotal > 0 ? (subtotal >= 500 ? 0 : 65) : 0;
  const discount = state.promoApplied ? Math.round(subtotal*0.1) : 0;
  const total = subtotal + delivery - discount;
  return { subtotal, delivery, discount, total };
}
function renderCart(){
  const ids = Object.keys(state.cart);
  const listEl = document.getElementById('cartList');
  document.getElementById('cartCountTrail').innerHTML = `<span style="font-size:12px;color:var(--muted);font-weight:700;">${cartCount()} item${cartCount()!==1?'s':''}</span>`;

  if(ids.length===0){
    listEl.innerHTML = `<div class="empty-state">
      <svg><use href="#ic-cart"/></svg>
      <h4>Your cart is empty</h4>
      <p>Add a gift to get started — same-day delivery available across Durban.</p>
      <button class="btn btn-outline btn-small" onclick="goTo('shop')">Browse gifts</button>
    </div>`;
  } else {
    listEl.innerHTML = ids.map(idStr=>{
      const id = parseInt(idStr,10);
      const p = PRODUCTS.find(pr=>pr.id===id);
      const qty = state.cart[id];
      return `<div class="cart-item">
        <div class="swatch" style="${swatchStyle(p.id)}"><svg style="color:rgba(255,255,255,.9)"><use href="#${catIcon(p.cat)}"/></svg></div>
        <div class="info">
          <h5>${p.name}</h5>
          <div class="cat">${catName(p.cat)}</div>
          <div class="row">
            <div class="qty-stepper">
              <button onclick="changeCartQty(${id},-1)">−</button>
              <span class="qty-val">${qty}</span>
              <button onclick="changeCartQty(${id},1)">+</button>
            </div>
            <span class="price" style="font-size:13px">${money(p.price*qty)}</span>
          </div>
        </div>
        <button class="remove" onclick="removeFromCart(${id})" aria-label="Remove item">✕</button>
      </div>`;
    }).join('');
  }

  const t = cartTotals();
  document.getElementById('cartSummary').innerHTML = `
    <div class="summary-row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
    <div class="summary-row"><span>Delivery</span><span>${t.subtotal===0 ? '—' : (t.delivery===0 ? 'Free' : money(t.delivery))}</span></div>
    ${state.promoApplied ? `<div class="summary-row"><span>Promo (JOY10)</span><span>−${money(t.discount)}</span></div>`:''}
    <div class="summary-row total"><span>Total</span><span>${money(t.total)}</span></div>
  `;
  document.getElementById('checkoutBtn').disabled = ids.length===0;
  document.getElementById('checkoutBtn').style.opacity = ids.length===0 ? .5 : 1;
  buildTabbars();
}
function applyPromo(){
  const val = document.getElementById('promoInput').value.trim().toUpperCase();
  if(val === 'JOY10'){ state.promoApplied = true; toast('Promo code applied — 10% off'); }
  else if(val==='') toast('Enter a promo code first');
  else toast('Invalid code — try JOY10');
  renderCart();
}

/* ================================================================
   RENDER: CHECKOUT
   ================================================================ */
function renderCheckout(){
  const slots = [
    {d:'Today', m:'4–6pm'}, {d:'Tomorrow', m:'9–11am'}, {d:'Tomorrow', m:'2–4pm'},
  ];
  const slotGrid = document.getElementById('slotGrid');
  slotGrid.innerHTML = slots.map((s,i)=>`
    <div class="slot ${i===0?'is-active':''}" onclick="selectSlot(this)">
      <div class="d">${s.d}</div><div class="m">${s.m}</div>
    </div>`).join('');

  const ids = Object.keys(state.cart);
  const stackEl = document.getElementById('checkoutStack');
  stackEl.innerHTML = ids.slice(0,3).map(idStr=>{
    const p = PRODUCTS.find(pr=>pr.id===parseInt(idStr,10));
    return `<div class="mini-swatch" style="${swatchStyle(p.id)}"><svg style="color:#fff"><use href="#${catIcon(p.cat)}"/></svg></div>`;
  }).join('');
  const t = cartTotals();
  document.getElementById('checkoutSummaryTxt').textContent = `${cartCount()} item${cartCount()!==1?'s':''} · ${money(t.total)}`;
  document.getElementById('checkoutTotal').textContent = money(t.total);
}
function selectSlot(el){
  document.querySelectorAll('.slot').forEach(s=>s.classList.remove('is-active'));
  el.classList.add('is-active');
}
function selectPay(el){
  document.querySelectorAll('.pay-option').forEach(s=>s.classList.remove('is-active'));
  el.classList.add('is-active');
}

/* ================================================================
   PLACE ORDER + TRACKING
   ================================================================ */
function placeOrder(){
  if(cartCount()===0){ toast('Your cart is empty'); return; }
  document.getElementById('confirmOverlay').classList.add('show');
}
function closeConfirmAndTrack(){
  document.getElementById('confirmOverlay').classList.remove('show');
  state.cart = {};
  state.promoApplied = false;
  state.trackStep = 1;
  state.history = [];
  goTo('tracking', { push:false });
  animateTracking();
  buildTabbars();
}
const TRACK_STEPS = [
  { key:'placed',   label:'Order placed',        sub:'We\'ve received your order', icon:'ic-check' },
  { key:'packed',   label:'Packed & wrapped',     sub:'Gift-wrapped with care', icon:'ic-box' },
  { key:'transit',  label:'Out for delivery',     sub:'Your driver is on the way', icon:'ic-truck' },
  { key:'delivered',label:'Delivered',            sub:'Estimated by 4:30 PM', icon:'ic-mapmarker' },
];
function renderTracking(){
  document.getElementById('trackTimeline').innerHTML = TRACK_STEPS.map((s,i)=>{
    const stepNum = i+1;
    const done = stepNum < state.trackStep;
    const current = stepNum === state.trackStep;
    return `<div class="tstep ${done?'done':''} ${current?'current':''}">
      <div class="tdot"><svg><use href="#${done? 'ic-check':s.icon}"/></svg></div>
      <div class="tinfo"><b>${s.label}</b><span>${current? 'In progress · ' + s.sub : (done ? 'Completed' : s.sub)}</span></div>
    </div>`;
  }).join('');

  const sampleItems = PRODUCTS.slice(0,3);
  document.getElementById('trackItemsList').innerHTML = sampleItems.map(p=>`
    <div class="ti-row"><span>${p.name}</span><b>${money(p.price)}</b></div>`).join('');

  const van = document.getElementById('vanDot');
  const positions = [ {l:30,t:100}, {l:110,t:55}, {l:210,t:95}, {l:290,t:45} ];
  const pos = positions[Math.min(state.trackStep-1, positions.length-1)];
  van.style.left = pos.l+'px'; van.style.top = pos.t+'px';
}
let trackTimer = null;
function animateTracking(){
  if(trackTimer) clearInterval(trackTimer);
  renderTracking();
  trackTimer = setInterval(()=>{
    if(state.trackStep < TRACK_STEPS.length){
      state.trackStep++;
      renderTracking();
    } else {
      clearInterval(trackTimer);
    }
  }, 3200);
}

/* ================================================================
   AUTH
   ================================================================ */
function handleLogin(){
  const email = document.getElementById('loginEmail').value.trim();
  if(!email){ toast('Enter your email to continue'); return; }
  state.user.email = email;
  state.history = [];
  goTo('home', { push:false });
  toast('Welcome back, ' + state.user.name.split(' ')[0] + '!');
}
function handleRegister(){
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  if(!name || !email){ toast('Please fill in your name and email'); return; }
  if(!document.getElementById('regTerms').checked){ toast('Please accept the terms to continue'); return; }
  state.user.name = name;
  state.user.email = email;
  toast('Account created — welcome to Gift4Joy!');
  state.history = [];
  goTo('home', { push:false });
}
function handleLogout(){
  state.history = [];
  goTo('login', { push:false });
  toast('Logged out');
}

/* ================================================================
   TOAST
   ================================================================ */
let toastTimer = null;
function toast(msg){
  const el = document.getElementById('toast');
  el.innerHTML = `<svg><use href="#ic-gift"/></svg>${msg}`;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> el.classList.remove('show'), 2200);
}

/* ================================================================
   MASTER RENDER DISPATCH
   ================================================================ */
function renderCurrentScreen(){
  switch(state.current){
    case 'home': renderHome(); break;
    case 'shop': renderShop(); break;
    case 'product': renderProduct(); break;
    case 'wishlist': renderWishlist(); break;
    case 'cart': renderCart(); break;
    case 'checkout': renderCheckout(); break;
    case 'tracking': renderTracking(); break;
    default: break;
  }
  buildTabbars();
}

/* ================================================================
   INIT
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  buildTabbars();
  goTo('login', { push:false });
});
