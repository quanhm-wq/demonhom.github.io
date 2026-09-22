/* ============================================================
   OrderComposer — Màn hình LÊN ĐƠN chuyên nghiệp (kiểu MISA)
   Dùng chung cho trang Đơn hàng (03) và Tính giá (17).
   OrderComposer.open({
     orderType:'sx'|'vpp', customer, prefillPtgIds:[...], copyFromOrderId,
     onCreated: function(order){...}
   })
   Phụ thuộc: window.QuoteStore, window.VPPStore, window.PricingEngine, ERPInteract(toast).
   ============================================================ */
window.OrderComposer = (function () {
  'use strict';
  var Store, V, PE, S, host, onCreated;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(n) { return (Math.round(Number(n) || 0)).toLocaleString('vi-VN'); }
  function today() { var d = new Date(); function p(n) { return (n < 10 ? '0' : '') + n; } return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear(); }

  var REPS = ['Bùi Thị Lan', 'Nguyễn Thị Nga', 'Trần Thu Oanh', 'Lê Hồng Nhung', 'Phạm Văn Dũng'];

  /* Đơn vị tính ngành cửa nhôm (glossary §12) */
  var UNITS = ['bộ', 'cánh', 'm²', 'md', 'cây', 'kg', 'kiện', 'bộ máy'];
  /* Gợi ý tên sản phẩm bán (glossary §6) — dùng cho dòng nhập tay */
  var PRODUCTS = [
    'Cửa thuỷ lực hệ 120 · 2 cánh vân gỗ trắc',
    'Cửa thuỷ lực hệ 180 · 4 cánh vân gỗ hương',
    'Cửa trượt quay 93 · 4 cánh ghi xám',
    'Cửa trượt quay 93 · 6 cánh vân gỗ trắc',
    'Cửa sổ mở quay Luxanode 121 · 2 cánh',
    'Cửa sổ mở lùa 76 Luxanode · 2 cánh',
    'Cửa đi mở lùa 121 Luxanode · 4 cánh',
    'Cửa vòm nhôm uốn hệ 120 · 2 cánh',
    'Vách kính khung nhôm Luxanode',
    'Hệ chấn song kết hợp phào Owin',
    'Cửa nhôm tấm tổ ong 2 cánh',
    'Tủ bếp nhôm nội thất Owin Luxury (bộ 3,2m)',
    'Tủ bếp nhôm nội thất Omega (bộ 4,5m)',
    'Nhôm thanh hệ 120 (bán xá theo kg)',
    'Nhôm thanh Luxanode 121 (bán xá theo kg)',
    'Dịch vụ uốn vòm nhôm (gia công theo mét)',
    'Dàn máy làm cửa nhôm WEIKE (gói chuyển giao)'
  ];

  // ---- CSS (inject once) ----
  function ensureCSS() {
    if (document.getElementById('oc-css')) return;
    var st = document.createElement('style');
    st.id = 'oc-css';
    st.textContent = `
    .oc-overlay{position:fixed;inset:0;z-index:890;background:rgba(20,19,15,.5);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .18s ease;padding:24px}
    .oc-overlay.on{opacity:1}
    .oc-modal{width:min(1120px,97vw);height:min(94vh,920px);background:var(--canvas);border-radius:16px;box-shadow:0 24px 70px rgba(20,19,15,.34);display:flex;flex-direction:column;overflow:hidden;transform:translateY(10px) scale(.99);transition:transform .2s cubic-bezier(.2,.8,.2,1)}
    .oc-overlay.on .oc-modal{transform:none}
    .oc-head{display:flex;align-items:center;gap:16px;padding:16px 20px;border-bottom:1px solid var(--rule);background:var(--paper)}
    .oc-head h2{font-size:17px;font-weight:700;margin:0;display:flex;align-items:center;gap:9px}
    .oc-seg{display:inline-flex;background:var(--paper-2);border:1px solid var(--rule);border-radius:9999px;padding:3px}
    .oc-seg button{border:none;background:transparent;padding:6px 14px;border-radius:9999px;font-size:12.5px;font-weight:600;color:var(--ash);cursor:pointer;display:inline-flex;align-items:center;gap:6px;font-family:inherit}
    .oc-seg button.on{background:var(--ink);color:var(--paper)}
    .oc-seg.vpp button.on{background:var(--steel)}
    .oc-x{margin-left:auto;border:none;background:var(--paper-2);width:34px;height:34px;border-radius:9px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;color:var(--ash)}
    .oc-x:hover{background:var(--rule);color:var(--ink)}
    .oc-body{flex:1;display:grid;grid-template-columns:1fr 340px;gap:0;min-height:0}
    .oc-main{overflow-y:auto;padding:20px 22px;display:flex;flex-direction:column;gap:18px}
    .oc-side{border-left:1px solid var(--rule);background:var(--paper);overflow-y:auto;padding:20px 20px 24px;display:flex;flex-direction:column;gap:12px}
    .oc-sec-t{font-family:var(--ff-mono,monospace);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ash);margin-bottom:9px;display:flex;align-items:center;gap:7px}
    .oc-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px 14px}
    .oc-f{display:flex;flex-direction:column;gap:5px}
    .oc-f label{font-size:11px;color:var(--ash);font-weight:500}
    .oc-in{padding:8px 10px;border:1px solid var(--rule);border-radius:8px;font-size:13px;font-family:inherit;background:var(--canvas);color:var(--ink);width:100%}
    .oc-in:focus{outline:none;border-color:var(--rust)}
    .oc-tbl{width:100%;border-collapse:collapse;font-size:12.5px}
    .oc-tbl th{text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:var(--ash);font-weight:600;padding:7px 8px;border-bottom:1px solid var(--rule)}
    .oc-tbl td{padding:6px 8px;border-bottom:1px solid var(--rule-hair,var(--rule))}
    .oc-tbl .num{text-align:right}
    .oc-tbl input{width:100%;border:1px solid transparent;background:var(--paper-2);border-radius:6px;padding:6px 7px;font-size:12.5px;font-family:inherit;text-align:right;color:var(--ink)}
    .oc-tbl input:focus{outline:none;border-color:var(--rust);background:var(--canvas)}
    .oc-tbl input.oc-qty,.oc-tbl input.oc-price{font-weight:600}
    .oc-del{border:none;background:transparent;color:var(--ash);cursor:pointer;padding:4px;border-radius:6px}
    .oc-del:hover{background:var(--coral-soft,#f6dcd2);color:var(--coral-dark,#a33)}
    .oc-add{border:1px dashed var(--rule);background:var(--paper-2);color:var(--ink);padding:9px 12px;border-radius:9px;font-size:12.5px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:7px;font-family:inherit}
    .oc-add:hover{border-color:var(--rust);color:var(--rust)}
    .oc-empty{padding:22px;text-align:center;color:var(--ash);font-size:13px;border:1px dashed var(--rule);border-radius:10px}
    .oc-sum-row{display:flex;justify-content:space-between;align-items:center;font-size:13px;padding:3px 0}
    .oc-sum-row .k{color:var(--ash)}
    .oc-sum-row .v{font-weight:600;font-variant-numeric:tabular-nums}
    .oc-sum-row.neg .v{color:var(--moss-deep,#2f5d3a)}
    .oc-sum-hr{height:1px;background:var(--rule);margin:8px 0}
    .oc-grand{display:flex;justify-content:space-between;align-items:baseline;padding:10px 12px;background:var(--ink);color:var(--paper);border-radius:10px;margin-top:4px}
    .oc-grand .k{font-size:12px;opacity:.8}
    .oc-grand .v{font-size:22px;font-weight:800;font-variant-numeric:tabular-nums}
    .oc-mini{display:flex;justify-content:space-between;font-size:12px;color:var(--ash);padding:2px 0}
    .oc-mini b{color:var(--ink)}
    .oc-save{margin-top:auto;width:100%;padding:12px;border:none;border-radius:10px;background:var(--rust);color:#fff;font-size:14px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;font-family:inherit}
    .oc-save:hover{background:var(--rust-deep,#a3330a)}
    .oc-inrow{display:flex;align-items:center;gap:6px}
    .oc-inrow .oc-in{width:82px;text-align:right}
    .oc-badge{display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:600;padding:2px 8px;border-radius:9999px;background:var(--paper-2);color:var(--ash)}
    .oc-src-sx{background:var(--moss-soft,#dfe9e0);color:var(--moss-deep,#2f5d3a)}
    .oc-src-vpp{background:var(--steel-soft,#dde6ec);color:var(--steel,#3f6f8c)}
    /* sub picker */
    .ocp-overlay{position:fixed;inset:0;z-index:910;background:rgba(20,19,15,.42);display:flex;align-items:center;justify-content:center;padding:24px}
    .ocp-modal{width:min(760px,96vw);max-height:86vh;background:var(--canvas);border-radius:14px;box-shadow:0 20px 60px rgba(20,19,15,.32);display:flex;flex-direction:column;overflow:hidden}
    .ocp-head{display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid var(--rule)}
    .ocp-head h3{margin:0;font-size:15px;font-weight:700}
    .ocp-body{overflow-y:auto;padding:14px 18px}
    .ocp-foot{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 18px;border-top:1px solid var(--rule);background:var(--paper)}
    .ocp-row{display:flex;align-items:center;gap:11px;padding:9px 10px;border:1px solid var(--rule);border-radius:9px;margin-bottom:7px;cursor:pointer}
    .ocp-row:hover{border-color:var(--rust)}
    .ocp-row.on{border-color:var(--rust);background:var(--rust-soft,#f7e6dd)}
    .ocp-row .nm{font-weight:600;font-size:13px}
    .ocp-row .mt{font-size:11.5px;color:var(--ash)}
    .ocp-row .pr{margin-left:auto;text-align:right;font-size:12.5px;font-weight:600;white-space:nowrap}
    @media(max-width:860px){.oc-body{grid-template-columns:1fr}.oc-side{border-left:none;border-top:1px solid var(--rule)}}
    `;
    document.head.appendChild(st);
  }

  // ---- financial calc ----
  function calc() {
    var subtotal = 0, lineDiscTotal = 0, netSum = 0;
    S.lines.forEach(function (l) {
      var gross = (Number(l.qty) || 0) * (Number(l.price) || 0);
      var disc = gross * (Number(l.discountPct) || 0) / 100;
      var net = gross - disc;
      l._gross = gross; l._net = net;
      subtotal += gross; lineDiscTotal += disc; netSum += net;
    });
    var odp = Number(S.orderDiscountPct) || 0;
    var orderDisc = netSum * odp / 100;
    var afterOrderDisc = netSum - orderDisc;
    var vat = 0;
    S.lines.forEach(function (l) {
      var taxed = l._net * (1 - odp / 100);
      vat += taxed * (Number(l.vatPct) || 0) / 100;
      l._lineTotal = taxed * (1 + (Number(l.vatPct) || 0) / 100);
    });
    var incentive = Number(S.incentive) || 0, shipping = Number(S.shippingFee) || 0;
    var grandTotal = Math.round(afterOrderDisc + vat - incentive + shipping);
    var commission = Math.round(netSum * (Number(S.commissionPct) || 0) / 100);
    var deposit = Math.round(grandTotal * (Number(S.depositPct) || 0) / 100);
    return { subtotal: subtotal, lineDiscTotal: lineDiscTotal, netSum: netSum, orderDisc: orderDisc,
      afterOrderDisc: afterOrderDisc, vat: vat, incentive: incentive, shipping: shipping,
      grandTotal: grandTotal, commission: commission, deposit: deposit, remaining: grandTotal - deposit };
  }

  // ============================================================
  //  OPEN + STATE
  // ============================================================
  function open(opts) {
    Store = window.QuoteStore; V = window.VPPStore; PE = window.PricingEngine;
    if (!Store) { alert('Thiếu dữ liệu (QuoteStore).'); return; }
    opts = opts || {};
    onCreated = opts.onCreated || null;
    ensureCSS();
    S = {
      mode: opts.copyFromOrderId ? 'copy' : (opts.prefillPtgIds ? 'fromptg' : 'create'),
      orderType: opts.orderType || 'sx',
      customer: opts.customer || '', mst: '', contact: '', salesRep: REPS[0],
      createdDate: today(), deliveryDate: '',
      paymentTerm: 'Cọc 30% · 70% sau khi giao', depositPct: 30,
      orderDiscountPct: 0, incentive: 0, commissionPct: 0, shippingFee: 0,
      lines: [], note: '', copyFrom: ''
    };
    if (opts.copyFromOrderId) prefillFromOrder(opts.copyFromOrderId);
    if (opts.prefillPtgIds && opts.prefillPtgIds.length) prefillFromPTGs(opts.prefillPtgIds);
    if (S.customer) syncCustomerInfo();
    mount();
  }

  function prefillFromOrder(id) {
    var o = Store.getOrder(id); if (!o) return;
    S.copyFrom = id;
    S.orderType = o.orderType || 'sx';
    S.customer = o.customer || '';
    S.salesRep = o.salesRep || REPS[0];
    S.deliveryDate = o.deliveryDate || o.dueDate || '';
    if (o.financials) {
      S.orderDiscountPct = o.financials.orderDiscountPct || 0;
      S.incentive = o.financials.incentive || 0;
      S.commissionPct = o.financials.commissionPct || 0;
      S.shippingFee = o.financials.shippingFee || 0;
      S.depositPct = o.financials.depositPct || 30;
    }
    if (o.payment && o.payment.paymentTerm) S.paymentTerm = o.payment.paymentTerm;
    var prods = (o.products && o.products.length) ? o.products
      : [{ code: o.productCode || '', name: o.product, qty: o.qty || 0, lineTotal: o.value || 0 }];
    S.lines = prods.map(function (p) {
      var qty = p.qty || 0;
      var price = p.price != null ? p.price : (qty ? Math.round((p.lineTotal || 0) / qty) : 0);
      return { code: p.code || '', name: p.name || '', qty: qty, unit: p.unit || (S.orderType === 'vpp' ? 'cái' : 'bộ'),
        price: price, discountPct: p.discountPct || 0, vatPct: p.vatPct != null ? p.vatPct : 8,
        ptgId: p.ptgId || '', source: p.source || (S.orderType === 'vpp' ? 'vpp' : 'sx') };
    });
  }

  function prefillFromPTGs(ids) {
    var ready = Store.readyPTGForOrder();
    var map = {}; ready.forEach(function (r) { map[r.id] = r; });
    ids.forEach(function (id) {
      var r = map[id]; if (!r) return;
      if (!S.customer) S.customer = r.customer;
      S.lines.push(ptgToLine(r));
    });
    S.orderType = 'sx';
  }

  function ptgToLine(r) {
    var price = Math.round((r.costPerUnit || 0) * 1.25 / 100) * 100; // gợi ý +25% giá vốn
    return { code: r.id, name: r.product, qty: r.qty || 0, unit: r.unit || 'bộ',
      price: price, discountPct: 0, vatPct: 8, ptgId: r.id, source: 'sx' };
  }

  function syncCustomerInfo() {
    var c = (Store.allCustomers() || []).filter(function (x) { return x.name === S.customer; })[0];
    if (c) { S.mst = c.mst || ''; S.contact = c.contact || ''; }
  }

  // ============================================================
  //  RENDER
  // ============================================================
  function mount() {
    host = document.createElement('div');
    host.className = 'oc-overlay';
    host.innerHTML = renderModal();
    document.body.appendChild(host);
    requestAnimationFrame(function () { host.classList.add('on'); });
    if (window.lucide) lucide.createIcons();
    bind();
  }
  function close() {
    if (!host) return;
    host.classList.remove('on');
    setTimeout(function () { if (host && host.parentNode) host.parentNode.removeChild(host); host = null; }, 180);
  }

  function custOptions() {
    var list = Store.allCustomers() || [];
    var opts = '<option value="">— Chọn khách hàng —</option>' + list.map(function (c) {
      return '<option value="' + esc(c.name) + '"' + (c.name === S.customer ? ' selected' : '') + '>' + esc(c.name) + (c.tier ? ' · ' + esc(c.tier) : '') + '</option>';
    }).join('');
    return opts;
  }
  function repOptions() {
    return REPS.map(function (r) { return '<option' + (r === S.salesRep ? ' selected' : '') + '>' + esc(r) + '</option>'; }).join('');
  }

  function renderModal() {
    calc(); // populate line._lineTotal trước khi dựng bảng dòng (tránh cột thành tiền = 0)
    var title = S.mode === 'copy' ? 'Sao chép đơn hàng' : (S.mode === 'fromptg' ? 'Lập đơn từ phiếu tính giá' : 'Lập đơn hàng mới');
    return '' +
      '<div class="oc-modal" role="dialog" aria-modal="true">' +
        '<div class="oc-head">' +
          '<h2><i data-lucide="file-plus-2" style="width:19px;height:19px"></i> ' + title + (S.copyFrom ? ' <span class="oc-badge">từ ' + esc(S.copyFrom) + '</span>' : '') + '</h2>' +
          '<div class="oc-seg' + (S.orderType === 'vpp' ? ' vpp' : '') + '" id="ocSeg">' +
            '<button data-type="sx" class="' + (S.orderType === 'sx' ? 'on' : '') + '"><i data-lucide="factory" style="width:13px;height:13px"></i> Đơn sản xuất</button>' +
            '<button data-type="vpp" class="' + (S.orderType === 'vpp' ? 'on' : '') + '"><i data-lucide="briefcase" style="width:13px;height:13px"></i> Thương mại VPP</button>' +
          '</div>' +
          '<button class="oc-x" id="ocClose"><i data-lucide="x" style="width:18px;height:18px"></i></button>' +
        '</div>' +
        '<div class="oc-body">' +
          '<datalist id="ocProdList">' + PRODUCTS.map(function (n) { return '<option value="' + esc(n) + '"></option>'; }).join('') + '</datalist>' +
          '<div class="oc-main">' + custSection() + metaSection() + linesSection() + noteSection() + '</div>' +
          '<div class="oc-side" id="ocSide">' + summarySection() + '</div>' +
        '</div>' +
      '</div>';
  }

  function custSection() {
    return '<div>' +
      '<div class="oc-sec-t"><i data-lucide="user" style="width:13px;height:13px"></i> Khách hàng</div>' +
      '<div class="oc-grid">' +
        '<div class="oc-f" style="grid-column:1 / -1"><label>Tên công ty / khách hàng</label>' +
          '<div style="display:flex;gap:8px"><select class="oc-in" id="ocCust" style="flex:1">' + custOptions() + '</select>' +
          '<button class="oc-add" id="ocAddCust" style="white-space:nowrap"><i data-lucide="user-plus" style="width:14px;height:14px"></i> Khách mới</button></div></div>' +
        '<div class="oc-f"><label>Mã số thuế</label><input class="oc-in" id="ocMst" value="' + esc(S.mst) + '" placeholder="MST"/></div>' +
        '<div class="oc-f"><label>Liên hệ</label><input class="oc-in" id="ocContact" value="' + esc(S.contact) + '" placeholder="Người liên hệ · SĐT"/></div>' +
      '</div></div>';
  }

  function metaSection() {
    return '<div>' +
      '<div class="oc-sec-t"><i data-lucide="clipboard-list" style="width:13px;height:13px"></i> Thông tin đơn</div>' +
      '<div class="oc-grid">' +
        '<div class="oc-f"><label>Ngày đặt</label><input class="oc-in" id="ocCreated" value="' + esc(S.createdDate) + '"/></div>' +
        '<div class="oc-f"><label>Hạn giao</label><input class="oc-in" id="ocDelivery" value="' + esc(S.deliveryDate) + '" placeholder="dd/mm/yyyy"/></div>' +
        '<div class="oc-f"><label>NV kinh doanh dự án</label><select class="oc-in" id="ocRep">' + repOptions() + '</select></div>' +
        '<div class="oc-f"><label>Điều khoản thanh toán</label><input class="oc-in" id="ocTerm" value="' + esc(S.paymentTerm) + '"/></div>' +
      '</div></div>';
  }

  function srcBadge(src) {
    return src === 'vpp' ? '<span class="oc-badge oc-src-vpp">VPP</span>' : '<span class="oc-badge oc-src-sx">Tính giá</span>';
  }
  function linesSection() {
    var addBtn = S.orderType === 'vpp'
      ? '<button class="oc-add" id="ocAddLine"><i data-lucide="briefcase" style="width:14px;height:14px"></i> Thêm từ kho Văn phòng phẩm</button>'
      : '<button class="oc-add" id="ocAddLine"><i data-lucide="calculator" style="width:14px;height:14px"></i> Thêm từ phiếu tính giá</button>';
    var rows = S.lines.length ? S.lines.map(lineRow).join('') : '';
    var table = S.lines.length ? (
      '<table class="oc-tbl"><thead><tr>' +
        '<th style="width:34%">Sản phẩm</th><th class="num" style="width:11%">SL</th><th class="num" style="width:16%">Đơn giá</th>' +
        '<th class="num" style="width:9%">CK%</th><th class="num" style="width:9%">VAT%</th><th class="num" style="width:16%">Thành tiền</th><th style="width:5%"></th>' +
      '</tr></thead><tbody id="ocLines">' + rows + '</tbody></table>'
    ) : '<div class="oc-empty" id="ocEmpty">Chưa có sản phẩm. Bấm nút bên dưới để thêm ' + (S.orderType === 'vpp' ? 'hàng từ kho Văn phòng phẩm.' : 'từ phiếu tính giá.') + '</div>';
    return '<div>' +
      '<div class="oc-sec-t"><i data-lucide="package" style="width:13px;height:13px"></i> Sản phẩm / hàng hoá</div>' +
      table +
      '<div style="margin-top:10px;display:flex;gap:8px">' + addBtn +
        '<button class="oc-add" id="ocAddBlank" title="Thêm dòng trống"><i data-lucide="plus" style="width:14px;height:14px"></i> Dòng trống</button>' +
      '</div></div>';
  }
  function lineRow(l, i) {
    return '<tr data-i="' + i + '">' +
      '<td><div style="font-weight:600;display:flex;align-items:center;gap:6px">' + srcBadge(l.source) +
          (l.code
            ? '<span class="oc-lname" contenteditable="false">' + esc(l.name) + '</span>'
            : '<input class="oc-in" data-txt="name" list="ocProdList" value="' + esc(l.name) + '" style="flex:1;min-width:0;font-weight:600" placeholder="Tên sản phẩm cửa nhôm…"/>') +
        '</div>' +
        '<div style="font-size:11px;color:var(--ash);margin-top:2px;display:flex;align-items:center;gap:6px">' + esc(l.code || '—') + ' · ' +
          '<select data-u="' + i + '" class="oc-in" style="width:86px;padding:2px 6px;font-size:11px">' +
            UNITS.concat(UNITS.indexOf(l.unit) < 0 && l.unit ? [l.unit] : []).map(function (u) {
              return '<option value="' + esc(u) + '"' + (u === l.unit ? ' selected' : '') + '>' + esc(u) + '</option>';
            }).join('') +
          '</select></div></td>' +
      '<td class="num"><input class="oc-qty" data-f="qty" type="number" min="0" value="' + (l.qty || 0) + '"/></td>' +
      '<td class="num"><input class="oc-price" data-f="price" type="number" min="0" value="' + (l.price || 0) + '"/></td>' +
      '<td class="num"><input data-f="discountPct" type="number" min="0" max="100" value="' + (l.discountPct || 0) + '"/></td>' +
      '<td class="num"><input data-f="vatPct" type="number" min="0" max="100" value="' + (l.vatPct || 0) + '"/></td>' +
      '<td class="num oc-linetotal"><b>' + fmt(l._lineTotal || 0) + '₫</b></td>' +
      '<td class="num"><button class="oc-del" data-del="' + i + '" title="Xoá"><i data-lucide="trash-2" style="width:14px;height:14px"></i></button></td>' +
    '</tr>';
  }

  function noteSection() {
    return '<div><div class="oc-sec-t"><i data-lucide="sticky-note" style="width:13px;height:13px"></i> Ghi chú</div>' +
      '<textarea class="oc-in" id="ocNote" rows="2" placeholder="Ghi chú nội bộ cho đơn hàng...">' + esc(S.note) + '</textarea></div>';
  }

  function summarySection() {
    var c = calc();
    function row(k, v, cls) { return '<div class="oc-sum-row ' + (cls || '') + '"><span class="k">' + k + '</span><span class="v">' + v + '</span></div>'; }
    return '<div class="oc-sec-t"><i data-lucide="receipt" style="width:13px;height:13px"></i> Tổng hợp thanh toán</div>' +
      row('Tổng tiền hàng', fmt(c.subtotal) + '₫') +
      row('Chiết khấu dòng', '− ' + fmt(c.lineDiscTotal) + '₫', 'neg') +
      '<div class="oc-sum-row"><span class="k">Chiết khấu tổng đơn</span><span class="oc-inrow"><input class="oc-in" id="ocOrderDisc" type="number" min="0" max="100" value="' + (S.orderDiscountPct || 0) + '" style="width:64px"/><span style="font-size:12px;color:var(--ash)">%</span></span></div>' +
      (c.orderDisc ? row('', '− ' + fmt(c.orderDisc) + '₫', 'neg') : '') +
      row('Thuế GTGT (VAT)', '+ ' + fmt(c.vat) + '₫') +
      '<div class="oc-sum-row"><span class="k">Ưu đãi / khuyến mãi</span><span class="oc-inrow"><input class="oc-in" id="ocIncentive" type="number" min="0" value="' + (S.incentive || 0) + '" style="width:104px"/></span></div>' +
      '<div class="oc-sum-row"><span class="k">Phụ phí giao hàng</span><span class="oc-inrow"><input class="oc-in" id="ocShip" type="number" min="0" value="' + (S.shippingFee || 0) + '" style="width:104px"/></span></div>' +
      '<div class="oc-sum-hr"></div>' +
      '<div class="oc-grand"><span class="k">TỔNG THANH TOÁN</span><span class="v" id="ocGrand">' + fmt(c.grandTotal) + '₫</span></div>' +
      '<div style="margin-top:8px">' +
        '<div class="oc-sum-row"><span class="k">Đặt cọc</span><span class="oc-inrow"><input class="oc-in" id="ocDeposit" type="number" min="0" max="100" value="' + (S.depositPct || 0) + '" style="width:64px"/><span style="font-size:12px;color:var(--ash)">%</span></span></div>' +
        '<div class="oc-mini">Tiền cọc: <b id="ocDepositVal">' + fmt(c.deposit) + '₫</b></div>' +
        '<div class="oc-mini">Còn lại: <b id="ocRemain">' + fmt(c.remaining) + '₫</b></div>' +
      '</div>' +
      '<div class="oc-sum-hr"></div>' +
      '<div class="oc-sum-row"><span class="k">Hoa hồng người mua</span><span class="oc-inrow"><input class="oc-in" id="ocComm" type="number" min="0" max="100" value="' + (S.commissionPct || 0) + '" style="width:64px"/><span style="font-size:12px;color:var(--ash)">%</span></span></div>' +
      '<div class="oc-mini" style="color:var(--rust)">Chi hoa hồng: <b id="ocCommVal">' + fmt(c.commission) + '₫</b></div>' +
      '<button class="oc-save" id="ocSave"><i data-lucide="check" style="width:16px;height:16px"></i> ' + (S.mode === 'copy' ? 'Tạo đơn sao chép' : 'Lưu &amp; tạo đơn') + '</button>';
  }

  // update just summary + line totals in place (keep input focus)
  function refreshSummary() {
    var c = calc();
    var side = document.getElementById('ocSide'); if (!side) return;
    var g = document.getElementById('ocGrand'); if (g) g.textContent = fmt(c.grandTotal) + '₫';
    var dv = document.getElementById('ocDepositVal'); if (dv) dv.textContent = fmt(c.deposit) + '₫';
    var rm = document.getElementById('ocRemain'); if (rm) rm.textContent = fmt(c.remaining) + '₫';
    var cv = document.getElementById('ocCommVal'); if (cv) cv.textContent = fmt(c.commission) + '₫';
    // line totals
    var trs = document.querySelectorAll('#ocLines tr');
    trs.forEach(function (tr) {
      var i = +tr.getAttribute('data-i');
      var cell = tr.querySelector('.oc-linetotal b');
      if (cell && S.lines[i]) cell.textContent = fmt(S.lines[i]._lineTotal || 0) + '₫';
    });
  }

  // ============================================================
  //  BIND
  // ============================================================
  function rerender() { host.querySelector('.oc-modal').outerHTML = renderModal(); if (window.lucide) lucide.createIcons(); }
  function fullRerender() {
    var modal = host.querySelector('.oc-modal');
    var tmp = document.createElement('div'); tmp.innerHTML = renderModal();
    modal.replaceWith(tmp.firstChild);
    if (window.lucide) lucide.createIcons();
  }

  function bind() {
    host.addEventListener('click', function (e) {
      if (e.target === host) return; // click ngoài không đóng (tránh mất dữ liệu)
      var seg = e.target.closest('#ocSeg button');
      if (seg) {
        var t = seg.getAttribute('data-type');
        if (t !== S.orderType) {
          if (S.lines.length && !confirm('Đổi loại đơn sẽ xoá các dòng sản phẩm đang có. Tiếp tục?')) return;
          S.orderType = t; S.lines = []; fullRerender();
        }
        return;
      }
      if (e.target.closest('#ocClose')) { close(); return; }
      if (e.target.closest('#ocAddCust')) { addCustomerFlow(); return; }
      if (e.target.closest('#ocAddLine')) { S.orderType === 'vpp' ? pickVPP() : pickPTG(); return; }
      if (e.target.closest('#ocAddBlank')) { addBlankLine(); return; }
      var del = e.target.closest('[data-del]');
      if (del) { S.lines.splice(+del.getAttribute('data-del'), 1); fullRerender(); return; }
      if (e.target.closest('#ocSave')) { save(); return; }
    });

    // input (state sync + live totals)
    host.addEventListener('input', function (e) {
      var el = e.target;
      if (el.id === 'ocMst') S.mst = el.value;
      else if (el.id === 'ocContact') S.contact = el.value;
      else if (el.id === 'ocCreated') S.createdDate = el.value;
      else if (el.id === 'ocDelivery') S.deliveryDate = el.value;
      else if (el.id === 'ocTerm') S.paymentTerm = el.value;
      else if (el.id === 'ocNote') S.note = el.value;
      else if (el.id === 'ocOrderDisc') { S.orderDiscountPct = clampNum(el.value, 0, 100); refreshSummary(); }
      else if (el.id === 'ocIncentive') { S.incentive = Math.max(0, +el.value || 0); refreshSummary(); }
      else if (el.id === 'ocShip') { S.shippingFee = Math.max(0, +el.value || 0); refreshSummary(); }
      else if (el.id === 'ocDeposit') { S.depositPct = clampNum(el.value, 0, 100); refreshSummary(); }
      else if (el.id === 'ocComm') { S.commissionPct = clampNum(el.value, 0, 100); refreshSummary(); }
      else if (el.hasAttribute('data-txt')) {
        var trT = el.closest('tr[data-i]'); if (!trT) return;
        S.lines[+trT.getAttribute('data-i')][el.getAttribute('data-txt')] = el.value;
      }
      else if (el.hasAttribute('data-f')) {
        var tr = el.closest('tr[data-i]'); if (!tr) return;
        var i = +tr.getAttribute('data-i'), f = el.getAttribute('data-f');
        S.lines[i][f] = f === 'qty' || f === 'price' ? Math.max(0, +el.value || 0) : clampNum(el.value, 0, 100);
        refreshSummary();
      }
    });
    host.addEventListener('change', function (e) {
      if (e.target.id === 'ocCust') { S.customer = e.target.value; syncCustomerInfo(); fullRerender(); }
      else if (e.target.id === 'ocRep') S.salesRep = e.target.value;
      else if (e.target.hasAttribute && e.target.hasAttribute('data-u')) {
        var ui = +e.target.getAttribute('data-u');
        if (S.lines[ui]) S.lines[ui].unit = e.target.value;
      }
    });
    document.addEventListener('keydown', escClose);
  }
  function escClose(e) { if (e.key === 'Escape' && host) { close(); document.removeEventListener('keydown', escClose); } }
  function clampNum(v, lo, hi) { v = +v || 0; return Math.max(lo, Math.min(hi, v)); }

  function addBlankLine() {
    S.lines.push({ code: '', name: S.orderType === 'vpp' ? 'Hàng VPP' : PRODUCTS[0], qty: 1,
      unit: S.orderType === 'vpp' ? 'cái' : 'bộ',
      price: 0, discountPct: 0, vatPct: 8, ptgId: '', source: S.orderType === 'vpp' ? 'vpp' : 'sx' });
    fullRerender();
  }

  // ---- Add customer ----
  function addCustomerFlow() {
    subModal({
      title: 'Thêm khách hàng mới',
      bodyHTML: '<div class="oc-grid" style="grid-template-columns:1fr 1fr">' +
        '<div class="oc-f" style="grid-column:1/-1"><label>Tên công ty / khách hàng *</label><input class="oc-in" id="ncName" placeholder="VD: Nhôm kính Nam Tiến"/></div>' +
        '<div class="oc-f"><label>Mã số thuế</label><input class="oc-in" id="ncMst" placeholder="03xxxxxxxx"/></div>' +
        '<div class="oc-f"><label>Phân loại</label><select class="oc-in" id="ncTier"><option>Mới</option><option>Thân thiết</option><option>VIP</option></select></div>' +
        '<div class="oc-f" style="grid-column:1/-1"><label>Liên hệ (người · SĐT)</label><input class="oc-in" id="ncContact" placeholder="Anh/Chị ... · 09xx"/></div>' +
        '</div>',
      okText: 'Thêm khách hàng',
      onOk: function (root) {
        var name = (root.querySelector('#ncName').value || '').trim();
        if (!name) { toast('Nhập tên khách hàng', 'error'); return false; }
        var c = Store.addCustomer({ name: name, mst: root.querySelector('#ncMst').value,
          tier: root.querySelector('#ncTier').value, contact: root.querySelector('#ncContact').value });
        S.customer = c.name; syncCustomerInfo(); fullRerender();
        toast('Đã thêm khách <b>' + esc(name) + '</b>', 'success');
      }
    });
  }

  // ---- PTG picker (đơn SX) ----
  function pickPTG() {
    var all = Store.readyPTGForOrder();
    var sel = {};
    var listHTML = function (q) {
      var rows = all.filter(function (r) { return !q || (r.id + ' ' + r.customer + ' ' + r.product).toLowerCase().indexOf(q) >= 0; });
      if (!rows.length) return '<div class="oc-empty">Không có phiếu tính giá đã duyệt phù hợp.</div>';
      return rows.map(function (r) {
        var price = Math.round((r.costPerUnit || 0) * 1.25);
        return '<div class="ocp-row' + (sel[r.id] ? ' on' : '') + '" data-id="' + r.id + '">' +
          '<input type="checkbox" ' + (sel[r.id] ? 'checked' : '') + ' style="pointer-events:none"/>' +
          '<div style="min-width:0"><div class="nm">' + esc(r.product) + '</div><div class="mt">' + esc(r.id) + ' · ' + esc(r.customer) + ' · SL ' + fmt(r.qty) + '</div></div>' +
          '<div class="pr">Giá vốn ' + fmt(r.costPerUnit) + '₫<br><span style="color:var(--rust)">gợi ý bán ' + fmt(price) + '₫</span></div>' +
        '</div>';
      }).join('');
    };
    subPicker({
      title: 'Chọn phiếu tính giá', searchPlaceholder: 'Tìm mã PTG / khách / sản phẩm…',
      renderList: listHTML,
      onRowClick: function (id, root) { sel[id] = !sel[id]; root.querySelector('.ocp-body').innerHTML = listHTML(currentQ(root)); },
      onOk: function () {
        var chosen = all.filter(function (r) { return sel[r.id]; });
        if (!chosen.length) { toast('Chưa chọn phiếu nào', 'warning'); return false; }
        chosen.forEach(function (r) { S.lines.push(ptgToLine(r)); });
        if (!S.customer && chosen[0]) { S.customer = chosen[0].customer; syncCustomerInfo(); }
        fullRerender();
        toast('Đã thêm <b>' + chosen.length + '</b> sản phẩm từ tính giá', 'success');
      }
    });
  }

  // ---- VPP picker (đơn thương mại) ----
  function pickVPP() {
    if (!V) { toast('Chưa nạp dữ liệu kho VPP', 'error'); return; }
    var all = V.all();
    var sel = {};
    var listHTML = function (q) {
      var rows = all.filter(function (p) { return !q || (p.code + ' ' + p.name + ' ' + p.group).toLowerCase().indexOf(q) >= 0; });
      if (!rows.length) return '<div class="oc-empty">Không có mặt hàng VPP phù hợp.</div>';
      return rows.map(function (p) {
        return '<div class="ocp-row' + (sel[p.code] ? ' on' : '') + '" data-id="' + p.code + '">' +
          '<input type="checkbox" ' + (sel[p.code] ? 'checked' : '') + ' style="pointer-events:none"/>' +
          '<div style="min-width:0"><div class="nm">' + esc(p.name) + '</div><div class="mt">' + esc(p.code) + ' · ' + esc(p.group) + ' · tồn ' + fmt(p.onHand) + ' ' + esc(p.unit) + '</div></div>' +
          '<div class="pr" style="color:var(--moss-deep)">' + fmt(p.salePrice) + '₫<br><span style="color:var(--ash);font-weight:400">/' + esc(p.unit) + '</span></div>' +
        '</div>';
      }).join('');
    };
    subPicker({
      title: 'Chọn hàng từ kho Văn phòng phẩm', searchPlaceholder: 'Tìm mã / tên / nhóm hàng…',
      renderList: listHTML,
      onRowClick: function (id, root) { sel[id] = !sel[id]; root.querySelector('.ocp-body').innerHTML = listHTML(currentQ(root)); },
      onOk: function () {
        var chosen = all.filter(function (p) { return sel[p.code]; });
        if (!chosen.length) { toast('Chưa chọn hàng nào', 'warning'); return false; }
        chosen.forEach(function (p) {
          S.lines.push({ code: p.code, name: p.name, qty: 1, unit: p.unit, price: p.salePrice,
            discountPct: 0, vatPct: 8, ptgId: '', source: 'vpp' });
        });
        fullRerender();
        toast('Đã thêm <b>' + chosen.length + '</b> mặt hàng VPP', 'success');
      }
    });
  }

  function currentQ(root) { var s = root.querySelector('.ocp-search'); return (s && s.value || '').toLowerCase().trim(); }

  // generic picker overlay
  function subPicker(cfg) {
    var ov = document.createElement('div');
    ov.className = 'ocp-overlay';
    ov.innerHTML = '<div class="ocp-modal">' +
      '<div class="ocp-head"><h3>' + esc(cfg.title) + '</h3><button class="oc-x" data-cancel><i data-lucide="x" style="width:16px;height:16px"></i></button></div>' +
      '<div style="padding:12px 18px 0"><input class="oc-in ocp-search" placeholder="' + esc(cfg.searchPlaceholder || 'Tìm…') + '"/></div>' +
      '<div class="ocp-body" style="margin-top:10px">' + cfg.renderList('') + '</div>' +
      '<div class="ocp-foot"><span style="font-size:12px;color:var(--ash)">Click để chọn nhiều mục</span><button class="oc-save" data-ok style="width:auto;padding:9px 18px;margin:0">Thêm vào đơn</button></div>' +
    '</div>';
    document.body.appendChild(ov);
    if (window.lucide) lucide.createIcons();
    ov.addEventListener('click', function (e) {
      if (e.target === ov || e.target.closest('[data-cancel]')) { ov.remove(); return; }
      var row = e.target.closest('.ocp-row');
      if (row) { cfg.onRowClick(row.getAttribute('data-id'), ov); if (window.lucide) lucide.createIcons(); return; }
      if (e.target.closest('[data-ok]')) { if (cfg.onOk() !== false) ov.remove(); return; }
    });
    ov.addEventListener('input', function (e) {
      if (e.target.classList.contains('ocp-search')) { ov.querySelector('.ocp-body').innerHTML = cfg.renderList(e.target.value.toLowerCase().trim()); if (window.lucide) lucide.createIcons(); }
    });
    setTimeout(function () { var s = ov.querySelector('.ocp-search'); if (s) s.focus(); }, 40);
  }

  // generic form sub-modal
  function subModal(cfg) {
    var ov = document.createElement('div');
    ov.className = 'ocp-overlay';
    ov.innerHTML = '<div class="ocp-modal" style="width:min(520px,96vw)">' +
      '<div class="ocp-head"><h3>' + esc(cfg.title) + '</h3><button class="oc-x" data-cancel><i data-lucide="x" style="width:16px;height:16px"></i></button></div>' +
      '<div class="ocp-body">' + cfg.bodyHTML + '</div>' +
      '<div class="ocp-foot"><button class="oc-add" data-cancel>Huỷ</button><button class="oc-save" data-ok style="width:auto;padding:9px 18px;margin:0">' + esc(cfg.okText || 'Đồng ý') + '</button></div>' +
    '</div>';
    document.body.appendChild(ov);
    if (window.lucide) lucide.createIcons();
    ov.addEventListener('click', function (e) {
      if (e.target === ov || e.target.closest('[data-cancel]')) { ov.remove(); return; }
      if (e.target.closest('[data-ok]')) { if (cfg.onOk(ov) !== false) ov.remove(); return; }
    });
    setTimeout(function () { var f = ov.querySelector('input'); if (f) f.focus(); }, 40);
  }

  function toast(msg, type) { if (window.ERPInteract) ERPInteract.showToast(msg, type || 'info'); }

  // ============================================================
  //  SAVE
  // ============================================================
  function save() {
    if (!S.customer) { toast('Chọn khách hàng trước khi lưu', 'error'); return; }
    if (!S.lines.length) { toast('Đơn chưa có sản phẩm nào', 'error'); return; }
    var c = calc();
    var payload = {
      orderType: S.orderType, customer: S.customer, mst: S.mst, contact: S.contact,
      salesRep: S.salesRep, createdDate: S.createdDate, deliveryDate: S.deliveryDate,
      paymentTerm: S.paymentTerm, note: S.note, copyFrom: S.copyFrom,
      lines: S.lines.map(function (l) {
        return { code: l.code, name: l.name, qty: l.qty, unit: l.unit, price: l.price,
          discountPct: l.discountPct, vatPct: l.vatPct, ptgId: l.ptgId, source: l.source,
          lineTotal: Math.round(l._lineTotal || 0) };
      }),
      financials: {
        subtotal: Math.round(c.subtotal), lineDiscount: Math.round(c.lineDiscTotal),
        orderDiscountPct: S.orderDiscountPct, orderDiscount: Math.round(c.orderDisc),
        vat: Math.round(c.vat), incentive: Math.round(c.incentive), shippingFee: Math.round(c.shipping),
        commissionPct: S.commissionPct, commission: c.commission,
        grandTotal: c.grandTotal, depositPct: S.depositPct, deposit: c.deposit, remaining: c.remaining
      }
    };
    var order = Store.createOrderManual(payload);
    close();
    toast('Đã tạo đơn <b>' + order.id + '</b> · ' + fmt(order.value) + '₫', 'success', 2600);
    if (onCreated) onCreated(order);
  }

  return { open: open };
})();
