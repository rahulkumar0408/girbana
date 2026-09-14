const WA="919672729258", EMAIL="deep.acharya71437@gmail.com";
const state={products:[],brand:"All",cat:"All",search:"",sort:"featured",cart:JSON.parse(localStorage.getItem("girbana_cart")||"[]")};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const money=n=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const discount=q=>q>=101?40:q>=51?25:q>=1?15:0;

function openPolicy(type){
 const policies={
 privacy:{title:'Privacy Policy',body:`<p>GIRBANA respects your privacy. We collect only information needed to respond to enquiries, process orders and provide customer support, such as your name, phone number, email and delivery details.</p><h4>How information is used</h4><p>Information may be used to confirm orders, respond to WhatsApp/email enquiries, arrange delivery, issue invoices and provide support.</p><h4>Data sharing</h4><p>Information may be shared only with service providers or delivery partners where necessary to fulfil an order or comply with applicable law.</p><h4>Security</h4><p>GIRBANA takes reasonable steps to protect customer information. Customers should avoid sending passwords, payment PINs or other sensitive credentials through WhatsApp or email.</p><h4>Contact</h4><p>For privacy questions, contact deep.acharya71437@gmail.com or WhatsApp +91 9672729258.</p>`},
 terms:{title:'Terms & Conditions',body:`<p>By using the GIRBANA website, you agree to these terms. Product information, prices, stock and promotional offers may change without prior notice and the final order is subject to confirmation by GIRBANA.</p><h4>Orders</h4><p>Adding a product to the cart or sending an enquiry does not by itself constitute acceptance of an order. GIRBANA will confirm availability, final pricing, shipping and applicable taxes before fulfilment.</p><h4>Product information</h4><p>Brand and product names are displayed for catalogue identification. GIRBANA does not claim exclusivity or authorization unless separately agreed with the relevant brand.</p><h4>Bulk discounts</h4><p>The website calculator applies the configured cart-quantity tiers: 1–50 units: 15%; 51–100 units: 25%; 101–1000 units: 40%. Final commercial terms may be confirmed separately for a bulk order.</p><h4>Contact</h4><p>GIRBANA, Udaipur, Rajasthan, India · +91 9672729258 · deep.acharya71437@gmail.com.</p>`},
 returns:{title:'Return & Refund Policy',body:`<p>GIRBANA will handle returns and refunds according to the product, supplier/brand terms and the final order confirmation.</p><h4>Requesting a return</h4><p>Customers should contact GIRBANA as soon as possible after delivery if an item is damaged, incorrect, expired, missing or otherwise eligible for return under the confirmed order terms.</p><h4>Condition</h4><p>Products should generally remain unused and in their original packaging unless the issue is damage, defect, wrong item or another confirmed exception.</p><h4>Refunds</h4><p>Once a return or replacement is approved and any required inspection is completed, the refund method and timing will be communicated to the customer.</p><h4>Important</h4><p>Some products or bulk orders may have supplier-specific restrictions. The applicable terms will be confirmed before or at order acceptance.</p>`},
 shipping:{title:'Shipping Policy',body:`<p>Shipping availability, charges and delivery timelines depend on the destination, product availability, order size and logistics partner.</p><h4>Bulk orders</h4><p>Large or multi-brand orders may require separate shipping coordination and quotation.</p><h4>Delivery</h4><p>Estimated delivery dates are indicative until the order is confirmed and dispatched. Customers will be informed if an unusual delay affects fulfilment.</p>`},
 cancellation:{title:'Cancellation Policy',body:`<p>Order cancellation requests should be sent to GIRBANA as early as possible through WhatsApp or email.</p><h4>Before dispatch</h4><p>Cancellation may be possible before fulfilment or dispatch, subject to order status and supplier terms.</p><h4>After dispatch</h4><p>Once an order has been dispatched, cancellation may not be possible and the applicable return process may need to be followed.</p>`}
 };
 const x=policies[type]||policies.terms; $('#policyTitle').textContent=x.title; $('#policyBody').innerHTML=x.body; $('#policyModal').classList.add('open'); $('#policyModal').setAttribute('aria-hidden','false');
}
function closePolicy(){ $('#policyModal').classList.remove('open'); $('#policyModal').setAttribute('aria-hidden','true'); }

async function init(){
  state.products=await fetch("products.json").then(r=>r.json());
  renderBrands(); renderProducts(); renderFAQ(); renderCart(); updateCalculator(1);
  bind();
}
function renderBrands(){
 const brands=["All",...new Set(state.products.map(p=>p.brand))];
 $("#brandFilters").innerHTML=brands.map(b=>`<button class="brand-pill ${state.brand===b?"active":""}" data-brand="${esc(b)}">${esc(b)}</button>`).join("");
 $$(".brand-pill").forEach(b=>b.onclick=()=>{state.brand=b.dataset.brand;renderBrands();renderProducts();});
}
function filtered(){
 let a=state.products.filter(p=>(state.brand==="All"||p.brand===state.brand)&&(state.cat==="All"||p.category===state.cat));
 if(state.search)a=a.filter(p=>(p.name+" "+p.brand+" "+p.category+" "+p.id).toLowerCase().includes(state.search.toLowerCase()));
 if(state.sort==="low")a.sort((x,y)=>x.price-y.price);
 if(state.sort==="high")a.sort((x,y)=>y.price-x.price);
 if(state.sort==="discount")a.sort((x,y)=>(1-y.price/y.mrp)-(1-x.price/x.mrp));
 if(state.sort==="name")a.sort((x,y)=>x.name.localeCompare(y.name));
 return a;
}
function renderProducts(){
 const a=filtered(), grid=$("#productGrid");
 $("#emptyState").hidden=a.length>0;
 grid.innerHTML=a.map(p=>{
   const off=Math.round((1-p.price/p.mrp)*100);
   return `<article class="product-card">
    <div class="product-image"><img src="${p.img}" alt="${esc(p.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><div class="fallback" style="display:none"><div><strong>${esc(p.brand)}</strong><br><span>${esc(p.name)}</span></div></div><span class="badge">${off>=20?"VALUE DEAL":"FEATURED"}</span></div>
    <div class="product-info"><div class="brand-name">${esc(p.brand)}</div><div class="product-name">${esc(p.name)}</div>
    <div class="rating">${p.rating?`<b>★ ${p.rating}</b> · ${p.reviews.toLocaleString("en-IN")} reviews`:"Product details available"}</div>
    <div class="price-row"><span class="price">${money(p.price)}</span><span class="mrp">${money(p.mrp)}</span></div><div class="save">Save ${money(p.mrp-p.price)} · ${off}% base saving</div>
    <div class="product-actions"><button onclick="addToCart('${p.id}')">ADD TO CART</button><button onclick="openProduct('${p.id}')">VIEW</button></div></div></article>`
 }).join("");
}
function openProduct(id){
 const p=state.products.find(x=>x.id===id); if(!p)return;
 $("#modalContent").innerHTML=`<div class="modal-product"><img src="${p.img}" alt="${esc(p.name)}" onerror="this.style.objectFit='contain';this.style.padding='30px'"><div>
 <span class="kicker">${esc(p.brand)} · ${esc(p.category)}</span><h2>${esc(p.name)}</h2>
 <div class="rating">${p.rating?`★ ${p.rating} · ${p.reviews.toLocaleString("en-IN")} reviews`:"Current rating not populated"}</div>
 <div class="modal-price">${money(p.price)} <del style="font-size:12px;color:#aaa">${money(p.mrp)}</del></div>
 <p class="modal-desc">${esc(p.desc)}</p><div class="modal-meta"><b>Size:</b> ${esc(p.size)}<br><b>Key details:</b> ${esc(p.ingredients)}<br><b>SKU:</b> ${p.id}</div>
 <div class="qty-control"><button onclick="changeModalQty(-1)">−</button><span id="modalQty">1</span><button onclick="changeModalQty(1)">+</button></div>
 <div class="modal-actions"><button class="btn dark" onclick="addModalToCart('${p.id}')">Add to cart</button></div>
 <button class="btn outline" style="width:100%;margin-top:8px" onclick="productWhatsApp('${p.id}')">Ask on WhatsApp</button>
 </div></div>`;
 $("#modal").classList.add("open"); $("#modal").setAttribute("aria-hidden","false"); window._modalQty=1;
}
function changeModalQty(n){window._modalQty=Math.max(1,(window._modalQty||1)+n);$("#modalQty").textContent=window._modalQty}
function addModalToCart(id){addToCart(id,window._modalQty||1);closeModal()}
function productWhatsApp(id){const p=state.products.find(x=>x.id===id);const q=window._modalQty||1;const msg=`Hello GIRBANA, I am interested in ${p.name} (${p.brand}). Quantity: ${q}. Please share availability and final bulk price.`;window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,"_blank")}
function closeModal(){$("#modal").classList.remove("open");$("#modal").setAttribute("aria-hidden","true")}
function addToCart(id,q=1){const item=state.cart.find(x=>x.id===id);if(item)item.q+=q;else state.cart.push({id,q});saveCart();renderCart();toast("Product added to cart")}
function saveCart(){localStorage.setItem("girbana_cart",JSON.stringify(state.cart))}
function cartQty(){return state.cart.reduce((s,x)=>s+x.q,0)}
function renderCart(){
 $("#cartCount").textContent=cartQty();
 const box=$("#cartItems");
 if(!state.cart.length){box.innerHTML=`<div style="padding:50px 10px;text-align:center;color:#777">Your cart is empty.<br><br><a href="#shop" class="btn outline" onclick="closeCart()">Start shopping</a></div>`;$("#cartSummary").innerHTML="";return}
 box.innerHTML=state.cart.map(x=>{const p=state.products.find(y=>y.id===x.id);return `<div class="cart-item"><img src="${p.img}" alt="" onerror="this.style.visibility='hidden'"><div><h4>${esc(p.name)}</h4><small>${esc(p.brand)} · ${money(p.price)}</small><div class="cart-qty"><button onclick="cartChange('${p.id}',-1)">−</button><span>${x.q}</span><button onclick="cartChange('${p.id}',1)">+</button><button class="remove" onclick="removeCart('${p.id}')">Remove</button></div></div><b>${money(p.price*x.q)}</b></div>`}).join("");
 const qty=cartQty(),pct=discount(qty),subtotal=state.cart.reduce((s,x)=>s+state.products.find(p=>p.id===x.id).price*x.q,0),save=Math.round(subtotal*pct/100),total=subtotal-save;
 let unlock=""; if(qty<51)unlock=`Add ${51-qty} more units to unlock 25% OFF.`; else if(qty<101)unlock=`🎉 25% OFF unlocked. Add ${101-qty} more units to reach 40% OFF.`; else unlock=`🔥 40% OFF unlocked!`;
 $("#cartSummary").innerHTML=`<div class="summary"><div class="unlock">${unlock}</div><div class="summary-row"><span>Total quantity</span><b>${qty}</b></div><div class="summary-row"><span>Discount tier</span><b>${pct}%</b></div><div class="summary-row"><span>Subtotal</span><b>${money(subtotal)}</b></div><div class="summary-row"><span>Bulk savings</span><b>− ${money(save)}</b></div><div class="summary-row total"><span>Final total</span><b>${money(total)}</b></div><div class="drawer-actions"><button class="btn dark" onclick="whatsappOrder()">Order via WhatsApp →</button><button class="btn outline" onclick="emailOrder()">Order via Email →</button></div></div>`;
}
function cartChange(id,n){const x=state.cart.find(i=>i.id===id);if(!x)return;x.q+=n;if(x.q<=0)state.cart=state.cart.filter(i=>i.id!==id);saveCart();renderCart()}
function removeCart(id){state.cart=state.cart.filter(x=>x.id!==id);saveCart();renderCart()}
function openCart(){$("#cartDrawer").classList.add("open");$("#drawerBackdrop").classList.add("open")}
function closeCart(){$("#cartDrawer").classList.remove("open");$("#drawerBackdrop").classList.remove("open")}
function orderText(){
 const qty=cartQty(),pct=discount(qty),sub=state.cart.reduce((s,x)=>s+state.products.find(p=>p.id===x.id).price*x.q,0),save=Math.round(sub*pct/100),total=sub-save;
 return `Hello GIRBANA,\n\nI would like to place an order.\n\n${state.cart.map(x=>{const p=state.products.find(y=>y.id===x.id);return `• ${p.name} (${p.brand}) — Qty ${x.q} — ${money(p.price*x.q)}`}).join("\n")}\n\nTotal Products: ${qty}\nBulk Discount: ${pct}%\nSavings: ${money(save)}\nFinal Amount: ${money(total)}\n\nPlease confirm availability and final order details.`;
}
function whatsappOrder(){if(!state.cart.length)return;window.open(`https://wa.me/${WA}?text=${encodeURIComponent(orderText())}`,"_blank")}
function emailOrder(){if(!state.cart.length)return;location.href=`mailto:${EMAIL}?subject=${encodeURIComponent("GIRBANA Order Enquiry")}&body=${encodeURIComponent(orderText())}`}
function updateCalculator(q){
 $("#qtyOut").textContent=q;const pct=discount(q),base=1000*q,save=base*pct/100;$("#calcPct").textContent=pct+"%";$("#calcValue").textContent=money(base);$("#calcSave").textContent=money(save);
 $("#calcMessage").textContent=q<51?`Add ${51-q} more units to reach the 51–100 tier.`:q<101?`🎉 25% OFF unlocked. Add ${101-q} more units to reach 40%.`:`🔥 40% OFF unlocked at ${q.toLocaleString("en-IN")} units.`;
}
function renderFAQ(){const faqs=[["What is GIRBANA?","GIRBANA is a multi-brand beauty, skincare, personal-care and lifestyle product seller/dealer."],["How does the bulk discount work?","The demo uses total cart quantity: 1–50 units gets 15%, 51–100 gets 25%, and 101–1000 gets 40%."],["Can I place a bulk order?","Yes. Use the bulk quote button or contact GIRBANA through WhatsApp/email."],["Can I order through WhatsApp?","Yes. Your cart can be converted into a pre-filled WhatsApp order message."],["Are prices fixed?","No. Product prices and availability can change, so verify the final quote before commercial launch/order confirmation."],["Are all brands official partners of GIRBANA?","The catalogue does not imply authorization, exclusivity or partnership unless separately verified."]];$("#faqList").innerHTML=faqs.map((f,i)=>`<div class="faq-item"><button class="faq-q">${f[0]}<span>+</span></button><div class="faq-a">${f[1]}</div></div>`).join("");$$(".faq-q").forEach(b=>b.onclick=()=>b.parentElement.classList.toggle("open"))}
function toast(msg){let t=$("#toast");if(!t){t=document.createElement("div");t.id="toast";t.style.cssText="position:fixed;left:50%;bottom:25px;transform:translateX(-50%);background:#173b2b;color:white;padding:12px 18px;border-radius:5px;z-index:200;font-size:11px";document.body.appendChild(t)}t.textContent=msg;t.style.display="block";clearTimeout(window._toast);window._toast=setTimeout(()=>t.style.display="none",1800)}
function bind(){
 $("#searchInput").oninput=e=>{state.search=e.target.value;renderProducts()};
 $("#sortSelect").onchange=e=>{state.sort=e.target.value;renderProducts()};
 $$(".filter").forEach(b=>b.onclick=()=>{$$(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.cat=b.dataset.cat;renderProducts()});
 $("#searchOpen").onclick=()=>{$("#searchInput").focus();$("#shop").scrollIntoView({behavior:"smooth"})};
 $("#cartOpen").onclick=openCart;$("#cartClose").onclick=closeCart;$("#drawerBackdrop").onclick=closeCart;
 $(".modal-backdrop").onclick=closeModal; $("#policyBackdrop").onclick=closePolicy; $("#policyClose").onclick=closePolicy;$(".modal-close").onclick=()=>{$$(".modal.open").forEach(m=>m.classList.remove("open"))};
 $("#qtySlider").oninput=e=>updateCalculator(+e.target.value);
 $("#quoteOpen").onclick=()=>$("#quoteModal").classList.add("open");
 $("#contactForm").onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));localStorage.setItem("girbana_contact",JSON.stringify({...d,time:new Date().toISOString()}));$("#contactStatus").textContent="Enquiry saved. We’ll connect using the contact details provided.";e.target.reset()};
 $("#quoteForm").onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));const msg=`Hello GIRBANA,\n\nI want a bulk quote.\nName: ${d.name}\nBusiness: ${d.business||"-"}\nPhone: ${d.phone}\nEmail: ${d.email||"-"}\nProducts: ${d.products||"-"}\nEstimated quantity: ${d.quantity||"-"}\nMessage: ${d.message||"-"}`;window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,"_blank");e.target.reset();$("#quoteModal").classList.remove("open")};
 $("#menuBtn").onclick=()=>{$("#mobileMenu").classList.toggle("open")};
 $$("#mobileMenu a").forEach(a=>a.onclick=()=>$("#mobileMenu").classList.remove("open"));
}
init();
