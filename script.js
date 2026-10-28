const groups = [
  {
    key:'que', brand:'QUẾ FOOD', theme:'que', placeholder:'assets/que-food-placeholder.svg',
    subtitle:'Thực phẩm an toàn · Nguyên liệu VietGAP · OCOP 3 sao',
    facts:[['Thương hiệu','Thực phẩm Nguyễn Quế – Quế Food'],['Địa chỉ','01A63 Dương Đình Nghệ, phường Hạc Thành, Thanh Hóa'],['Định hướng','Thực phẩm an toàn, tiện lợi và có nguồn nguyên liệu rõ ràng']],
    products:{
      nem:{title:'Nem thính Quế Food',tag:'OCOP 3 sao',points:['Đặc sản truyền thống xứ Thanh, vào chung kết Khởi nghiệp Xanh toàn quốc 2023.','Thịt nạc thái miếng lên men cùng thính gạo, ngô; nguyên liệu VietGAP, không kháng sinh và không tăng trọng.','Phù hợp bữa cơm gia đình, dịp sum họp và làm quà cho khách tỉnh ngoài.','Giá gốc 30.000₫/quả; dùng kèm thính, lá sung và đinh lăng.']},
      cha:{title:'Chả ức gà Quế Food',tag:'OCOP 3 sao',points:['Giàu đạm, ít calo và ít chất béo; phù hợp người giữ dáng hoặc luyện tập thể thao.','Dinh dưỡng trên 100g: 17,89g protein · 127 kcal · 1,58g chất béo · 9,9g carbohydrate.','8 hương vị: nấm hương, hạt củ quả, rong biển, nấm tuyết, bọc sả, bọc lá lốt, cốm và củ quả bọc trứng.','Nguyên liệu ức gà VietGAP trong tỉnh; combo 8 vị, 8 bữa có giá gốc 150.000₫.']}
    },
    deals:[
      {deal:'Deal săn',title:'Nem thính ưu đãi',limit:'10 suất đầu giờ',price:'9.000₫',old:'Giá live 48.000₫ · Giá gốc 60.000₫',image:'assets/products/que-nem-thinh.jpg',codes:['S2'],refs:['nem'],details:['10 suất săn sale đầu giờ.','Chi phí ship và đóng gói chưa bao gồm.','Hỗ trợ giao xa nhất đến TP.HCM.']},
      {deal:'Deal 1',title:'Nem thính ưu đãi',limit:'10 suất đầu giờ',price:'9.000₫',old:'Giá live 48.000₫ · Giá gốc 60.000₫',image:'assets/products/que-nem-thinh.jpg',codes:['SN'],refs:['nem'],details:['10 suất săn sale đầu giờ.','Chi phí ship và đóng gói chưa bao gồm.','Hỗ trợ giao xa nhất đến TP.HCM.']},
      {deal:'Deal 2',title:'Chả ức gà 8 vị',limit:'10 suất',price:'69.000₫',old:'Giá gốc 150.000₫',image:'assets/products/que-cha-uc-ga-8-vi.jpg',codes:['SC','CG'],refs:['cha'],details:['Mã SC: 150.000₫ còn 69.000₫.','Mã CG: 150.000₫ còn 120.000₫ — 8 vị cho 8 bữa.','Chi phí ship và đóng gói chưa bao gồm; hỗ trợ giao đến TP.HCM.']},
      {deal:'Deal 3',title:'Combo OCOP',limit:'10 suất',price:'150.000₫',old:'Quà tặng trị giá 60.000₫',image:'assets/products/que-combo-ocop.jpg',codes:['CTN','CTC'],refs:['nem','cha'],details:['Combo chả ức gà 8 vị kết hợp nem thính.','Mã CTN: tặng 2 nem thính.','Mã CTC: tặng 6 nắm cơm gạo lứt.']},
      {deal:'Deal 4',title:'Quà tặng giới hạn',limit:'2 suất',price:'QUÀ TẶNG',old:'Trị giá 50.000₫',image:'assets/products/que-qua-tang.jpg',codes:[],refs:['nem','cha'],details:['Gồm 1 nem và 1 chả gà.','Áp dụng khi đạt yêu cầu của phiên live.']},
      {deal:'Deal 5',title:'Giá chỉ có tại phiên live',limit:'Độc quyền live',price:'48.000₫',old:'Nem thính · 2 quả',image:'assets/products/que-combo-ocop.jpg',codes:['NT'],refs:['nem','cha'],details:['Nem thính: 60.000₫/2 quả còn 48.000₫/2 quả.','Chả ức gà: 120.000₫/combo 8 vị.']}
    ]
  },
  {
    key:'huong', brand:'HƯƠNG RỪNG', theme:'huong', placeholder:'assets/huong-rung-placeholder.svg',
    subtitle:'Deal hời độc quyền trên live của phường Hạc Thành',
    facts:[['Doanh nghiệp','Công ty TNHH TMDV Hồng Quyết'],['Đại diện','Bà Nguyễn Thị Hồng – Giám đốc'],['Mã số thuế','2803076634'],['Địa chỉ','10/22 Trần Thủ Độ, phường Hạc Thành, tỉnh Thanh Hóa'],['Điện thoại','0989 891 916']],
    products:{nem:{title:'Sản phẩm đăng ký livestream',tag:'Hương Rừng',points:['Nem chua.','Nem nướng.','Nem thính.','Nem cối.']}},
    deals:[
      {deal:'Combo 1',title:'30 nem chua VIP size nhỡ',limit:'Deal live',price:'139.000₫',old:'Giá gốc 180.000₫',image:'assets/products/huong-rung-combo-30.jpg',codes:['M30'],refs:['nem'],details:['30 nem chua VIP size nhỡ.']},
      {deal:'Combo 2',title:'20 nem chua VIP size lớn',limit:'Deal live',price:'159.000₫',old:'Giá gốc 200.000₫',image:'assets/products/huong-rung-combo-20.jpg',codes:['L20'],refs:['nem'],details:['20 nem chua VIP size lớn.']},
      {deal:'Combo đề xuất',title:'Combo siêu hời',limit:'Nổi bật',price:'339.000₫',old:'Giá gốc 450.000₫',image:'assets/products/huong-rung-combo-sieu-hoi.jpg',codes:['CH'],refs:['nem'],details:['20 nem chua VIP.','2 nem nướng · 2 nem thính · 2 nem cối.']},
      {deal:'Combo biếu tặng',title:'Combo quà tặng sang trọng',limit:'Quà biếu',price:'639.000₫',old:'Giá gốc 710.000₫',image:'assets/products/huong-rung-combo-bieu-tang.jpg',codes:['CB'],refs:['nem'],details:['30 nem chua VIP.','4 nem nướng · 2 nem thính · 4 nem cối.']},
      {deal:'Đặc biệt đầu live',title:'Nem cối giá 1K',limit:'Chỉ 10 deal',price:'1.000₫',old:'Số lượng giới hạn',image:'assets/products/huong-rung-nem-coi.jpg',codes:['S1'],refs:['nem'],details:['Ưu đãi chỉ áp dụng đầu phiên live.']}
    ]
  }
];

const currentKey = document.body.dataset.brand || 'que';
const group = groups.find(item => item.key === currentKey) || groups[0];
const grid = document.getElementById('productGrid');
const intro = document.getElementById('brandIntro');
const dialog = document.getElementById('detailDialog');
const detailContent = document.getElementById('detailContent');

intro.className = `brand-heading compact-brand-heading ${group.theme}`;
intro.innerHTML = `<div><span>DEAL SẢN PHẨM</span><h2>${group.brand}</h2></div><p>${group.subtitle}</p>`;

function cardReferencePrice(deal) {
  const originalPrice = deal.old.match(/Giá gốc\s*([\d.]+₫)/i);
  if (originalPrice) return `<span class="old-price">${originalPrice[1]}</span>`;

  const giftValue = deal.old.match(/(?:Quà tặng\s+)?[Tt]rị giá\s*([\d.]+₫)/);
  if (giftValue) return `<span class="value-note">Trị giá ${giftValue[1]}</span>`;

  return '';
}

grid.innerHTML = group.deals.map((deal,index) => `<article class="product-card deal-product-card ${group.theme}">
  <div class="product-image-wrap"><img class="product-image" src="${deal.image || group.placeholder}" alt="${deal.title}"><span class="discount">${deal.deal}</span><div class="labels">${deal.codes.map(code => `<span class="label ${group.theme === 'huong' ? 'free' : 'ocop'}">Mã ${code}</span>`).join('')}</div></div>
  <div class="product-body"><div class="product-title">${deal.title}</div><div class="price-line"><span class="price">${deal.price}</span>${cardReferencePrice(deal)}</div><div class="meta"><span class="star">★</span><b>Ưu đãi live</b><span class="meta-separator">|</span><span>${deal.limit}</span></div><div class="shipping-card-note">🚚 Chưa bao gồm phí ship COD</div><div class="card-actions"><button class="detail-btn open-detail buy-button" data-index="${index}" aria-label="Mua ${deal.title}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h2l2.3 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H6M10 20a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm9 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/></svg><span>Mua hàng</span></button></div></div>
</article>`).join('');

function renderProductInfo(product) {
  return `<section class="modal-product-info"><div class="highlight-title"><h4>${product.title}</h4><span>${product.tag}</span></div><ul>${product.points.map(point => `<li>${point}</li>`).join('')}</ul></section>`;
}

let qrTimer = null;

function customerInfoMarkup() {
  return `<section class="customer-block">
    <h3>Thông tin nhận hàng</h3>
    <div class="customer-fields">
      <label><span>Họ và tên <b>*</b></span><input id="customerName" name="customerName" type="text" autocomplete="name" placeholder="Nhập họ và tên" required></label>
      <label><span>Số điện thoại <b>*</b></span><input id="customerPhone" name="customerPhone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Ví dụ: 0989 123 456" pattern="[0-9+ ]{9,15}" required></label>
      <label class="address-field"><span>Địa chỉ nhận hàng <b>*</b></span><textarea id="customerAddress" name="customerAddress" autocomplete="street-address" placeholder="Số nhà, đường, phường/xã, tỉnh/thành phố" rows="3" required></textarea></label>
    </div>
    <p class="shipping-notice"><strong>Lưu ý:</strong> Giá sản phẩm chưa bao gồm phí vận chuyển. Phí ship COD sẽ được cửa hàng xác nhận theo địa chỉ nhận hàng.</p>
  </section>`;
}

function numericAmount(price) {
  const digits = price.replace(/\D/g,'');
  return digits ? Number(digits) : 0;
}

function paymentMarkup(deal) {
  const qrAvailable = numericAmount(deal.price) > 0;
  return `<section class="payment-block">
    <h3>Phương thức thanh toán</h3>
    <div class="payment-options">
      <label class="payment-option active"><input type="radio" name="paymentMethod" value="cod" checked><span class="payment-icon">🚚</span><span><b>Thanh toán COD</b><small>Thanh toán khi nhận hàng</small></span></label>
      <label class="payment-option ${qrAvailable ? '' : 'disabled'}"><input type="radio" name="paymentMethod" value="qr" ${qrAvailable ? '' : 'disabled'}><span class="payment-icon">▦</span><span><b>Quét mã QR</b><small>${qrAvailable ? 'Mã có hiệu lực trong 5 phút' : 'Không áp dụng cho quà tặng'}</small></span></label>
    </div>
    <div class="payment-panel cod-panel"><b>Thanh toán khi nhận hàng</b><p>Bạn thanh toán tiền hàng và phí vận chuyển COD cho đơn vị giao hàng. Phí ship chưa được cộng vào giá sản phẩm.</p></div>
    <div class="payment-panel qr-panel hidden"><button class="generate-qr" id="generateQr" type="button">Tạo mã QR trong 5 phút</button><div class="qr-result hidden" id="qrResult"><div class="qr-code" id="qrCode"></div><div class="qr-meta"><b id="qrOrder"></b><span id="qrCountdown">05:00</span></div><p>Mã QR thử nghiệm cho đơn hàng này. Cần bổ sung tài khoản ngân hàng để tạo VietQR chuyển khoản thật.</p></div></div>
    <button class="confirm-order" type="submit">Xác nhận đặt hàng</button>
    <p class="order-feedback hidden" id="orderFeedback" role="status"></p>
  </section>`;
}

function createQr(deal) {
  clearInterval(qrTimer);
  const amount = numericAmount(deal.price);
  const orderId = `HC-${Date.now().toString(36).slice(-7).toUpperCase()}`;
  const expiresAt = Date.now() + 5 * 60 * 1000;
  const qrBox = document.getElementById('qrCode');
  const result = document.getElementById('qrResult');
  const countdown = document.getElementById('qrCountdown');
  qrBox.innerHTML = '';
  result.classList.remove('hidden');
  document.getElementById('qrOrder').textContent = `Mã đơn: ${orderId} · ${deal.price}`;
  const payload = `HCDEMO|${orderId}|${group.key.toUpperCase()}|${deal.codes[0] || 'LIVE'}|${amount}|${Math.floor(expiresAt / 1000)}`;
  new QRCode(qrBox,{text:payload,width:210,height:210,colorDark:'#16231c',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});
  const update = () => {
    const left = Math.max(0,expiresAt - Date.now());
    const totalSeconds = Math.ceil(left / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2,'0');
    const seconds = String(totalSeconds % 60).padStart(2,'0');
    countdown.textContent = `${minutes}:${seconds}`;
    if (!left) {
      clearInterval(qrTimer);
      qrBox.innerHTML = '<div class="qr-expired">Mã QR đã hết hạn</div>';
      countdown.textContent = '00:00';
      document.getElementById('generateQr').textContent = 'Tạo mã QR mới';
    }
  };
  update();
  qrTimer = setInterval(update,1000);
  document.getElementById('generateQr').textContent = 'Tạo lại mã QR 5 phút';
}

function setupPayment(deal) {
  const form = document.getElementById('purchaseForm');
  const options = document.querySelectorAll('input[name="paymentMethod"]');
  const codPanel = document.querySelector('.cod-panel');
  const qrPanel = document.querySelector('.qr-panel');
  const feedback = document.getElementById('orderFeedback');
  const validateCustomer = () => {
    if (form.reportValidity()) return true;
    feedback.textContent = 'Vui lòng nhập đầy đủ họ tên, số điện thoại và địa chỉ nhận hàng.';
    feedback.classList.remove('hidden','success');
    return false;
  };
  options.forEach(input => input.addEventListener('change',() => {
    document.querySelectorAll('.payment-option').forEach(option => option.classList.toggle('active',option.contains(input)));
    const useQr = input.value === 'qr';
    codPanel.classList.toggle('hidden',useQr);
    qrPanel.classList.toggle('hidden',!useQr);
    if (useQr && document.getElementById('qrResult').classList.contains('hidden') && validateCustomer()) createQr(deal);
  }));
  document.getElementById('generateQr').addEventListener('click',() => { if (validateCustomer()) createQr(deal); });
  form.addEventListener('submit',event => {
    event.preventDefault();
    if (!validateCustomer()) return;
    const paymentMethod = new FormData(form).get('paymentMethod');
    if (paymentMethod === 'qr' && document.getElementById('qrResult').classList.contains('hidden')) createQr(deal);
    feedback.textContent = paymentMethod === 'cod'
      ? 'Đã tiếp nhận thông tin. Cửa hàng sẽ liên hệ xác nhận đơn và phí ship COD.'
      : 'Thông tin hợp lệ. Vui lòng quét mã QR trong thời gian còn hiệu lực.';
    feedback.classList.add('success');
    feedback.classList.remove('hidden');
  });
}

function openDetail(index) {
  const deal = group.deals[index];
  detailContent.innerHTML = `<form id="purchaseForm"><img class="modal-product-image" src="${deal.image || group.placeholder}" alt="${deal.title}"><div class="modal-brand ${group.theme}">${group.brand}</div><h2>${deal.title}</h2><div class="modal-price">${deal.price}</div><p class="modal-old">${deal.old}</p><div class="deal-codes">${deal.codes.map(code => `<span>Mã ${code}</span>`).join('')}</div>${customerInfoMarkup()}${paymentMarkup(deal)}<h3>Thông tin ưu đãi</h3><ul class="modal-list">${deal.details.map(item => `<li>${item}</li>`).join('')}</ul>${deal.refs.map(ref => renderProductInfo(group.products[ref])).join('')}<h3>Thông tin thương hiệu</h3><div class="modal-facts">${group.facts.map(([label,value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join('')}</div></form>`;
  dialog.showModal();
  setupPayment(deal);
}

document.querySelectorAll('.open-detail').forEach(button => button.addEventListener('click', () => openDetail(Number(button.dataset.index))));
function closeDialog(){clearInterval(qrTimer);dialog.close()}
document.getElementById('closeDetail').addEventListener('click',closeDialog);
dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
