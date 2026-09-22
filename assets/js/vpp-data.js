/* ============================================================
   VPPStore — Kho Văn phòng phẩm (hàng thương mại để bán)
   ------------------------------------------------------------
   Danh mục + tồn kho mặt hàng VPP dùng cho ĐƠN THƯƠNG MẠI (bán VPP)
   và làm ĐÍCH nhập kho thành phẩm VPP từ Lệnh sản xuất.
   Lưu localStorage (fallback RAM khi mở file://). Không phụ thuộc store khác.
   API: all() get() groups() addProduct() stockIn() stockOut() txns() summary()
   ============================================================ */
(function (global) {
  'use strict';

  var KEY = 'erp_vpp_nhomowin_v1';

  function seedProducts() {
    // g: nhóm · u: đvt · onHand · min · cost(giá vốn) · sale(giá bán) · loc · ncc
    function mk(code, name, g, u, onHand, min, cost, sale, loc, ncc) {
      return { code: code, name: name, group: g, unit: u, onHand: onHand, minStock: min,
        costPrice: cost, salePrice: sale, location: loc, supplier: ncc };
    }
    return [
      mk('VPP-BUT-001', 'Bút bi Thiên Long TL-027', 'Bút & mực viết', 'cây', 1840, 500, 2600, 4500, 'Kệ A1', 'Thiên Long'),
      mk('VPP-BUT-002', 'Bút gel Thiên Long GEL-08', 'Bút & mực viết', 'cây', 960, 300, 4200, 7000, 'Kệ A1', 'Thiên Long'),
      mk('VPP-BUT-003', 'Bút lông không xoá Artline 70 (đánh dấu nhôm)', 'Bút & mực viết', 'cây', 420, 150, 9800, 15000, 'Kệ A2', 'Artline VN'),
      mk('VPP-BUT-004', 'Bút dạ quang Stabilo (bộ 4)', 'Bút & mực viết', 'bộ', 180, 60, 38000, 62000, 'Kệ A2', 'Stabilo'),
      mk('VPP-GIA-001', 'Giấy A4 Double A 70gsm', 'Giấy văn phòng & photo', 'ram', 640, 200, 62000, 82000, 'Kệ B1', 'Double A'),
      mk('VPP-GIA-002', 'Giấy A4 IK Plus 80gsm', 'Giấy văn phòng & photo', 'ram', 380, 150, 71000, 92000, 'Kệ B1', 'IK Paper'),
      mk('VPP-GIA-003', 'Giấy A5 Excel 70gsm', 'Giấy văn phòng & photo', 'ram', 210, 80, 34000, 48000, 'Kệ B2', 'Excel'),
      mk('VPP-GIA-004', 'Giấy note 3x3" (12 tệp)', 'Giấy văn phòng & photo', 'lốc', 260, 100, 22000, 36000, 'Kệ B2', 'Pronoti'),
      mk('VPP-SO-001',  'Sổ lò xo A5 200 trang', 'Sổ & tập', 'quyển', 320, 120, 14000, 24000, 'Kệ C1', 'Klong'),
      mk('VPP-SO-002',  'Sổ da bìa cứng A5 (khắc logo OWIN)', 'Sổ & tập', 'quyển', 140, 50, 48000, 89000, 'Kệ C1', 'Gia công ngoài'),
      mk('VPP-FIL-001', 'Bìa còng A4 7cm', 'File & bìa hồ sơ', 'cái', 480, 150, 18000, 30000, 'Kệ D1', 'Thiên Long'),
      mk('VPP-FIL-002', 'Bìa lá A4 (xấp 10)', 'File & bìa hồ sơ', 'xấp', 360, 120, 12000, 21000, 'Kệ D1', 'Flexoffice'),
      mk('VPP-FIL-003', 'Bìa trình ký đôi', 'File & bìa hồ sơ', 'cái', 220, 80, 26000, 42000, 'Kệ D2', 'Flexoffice'),
      mk('VPP-DUN-001', 'Kẹp bướm 41mm (hộp 12)', 'Dụng cụ văn phòng', 'hộp', 540, 150, 15000, 26000, 'Kệ E1', 'Deli'),
      mk('VPP-DUN-002', 'Ghim bấm số 10 (hộp 20)', 'Dụng cụ văn phòng', 'hộp', 620, 200, 6000, 11000, 'Kệ E1', 'Plus'),
      mk('VPP-DUN-003', 'Máy bấm kim Plus 10', 'Dụng cụ văn phòng', 'cái', 95, 40, 42000, 68000, 'Kệ E2', 'Plus'),
      mk('VPP-BAN-001', 'Băng keo trong 48mm', 'Băng keo & keo dán', 'cuộn', 760, 250, 7500, 13000, 'Kệ F1', 'Vibafa'),
      mk('VPP-BAN-002', 'Keo dán khô UHU 21g', 'Băng keo & keo dán', 'cây', 300, 100, 16000, 27000, 'Kệ F1', 'UHU'),
      mk('VPP-MUC-001', 'Hộp mực HP 12A (tương thích)', 'Mực máy in VP & vật tư', 'hộp', 68, 25, 185000, 290000, 'Kệ G1', 'Nến Vàng'),
      mk('VPP-MUC-002', 'Mực dấu Shiny xanh 28ml', 'Mực máy in VP & vật tư', 'lọ', 120, 40, 22000, 38000, 'Kệ G1', 'Shiny'),
      mk('VPP-BAO-001', 'Bao thư A4 in logo OWIN (xấp 50)', 'Bao thư & tem nhãn', 'xấp', 240, 90, 34000, 52000, 'Kệ H1', 'Gia công ngoài'),
      mk('VPP-BAO-002', 'Tem nhãn dán bộ cửa A4 (100 tờ)', 'Bao thư & tem nhãn', 'xấp', 160, 60, 45000, 72000, 'Kệ H1', 'Tomy')
    ];
  }

  function seedTxns() {
    return [
      { date: '18/07/2026', type: 'in',  doc: 'PNK-VPP-0142', code: 'VPP-GIA-001', name: 'Giấy A4 Double A 70gsm', group: 'Giấy văn phòng & photo', qty: 300, note: 'Nhập mua · Double A' },
      { date: '17/07/2026', type: 'out', doc: 'PXK-VPP-0231', code: 'VPP-BUT-001', name: 'Bút bi Thiên Long TL-027', group: 'Bút & mực viết', qty: 200, note: 'Bán · ĐL Nhôm kính Minh Anh' },
      { date: '16/07/2026', type: 'out', doc: 'PXK-VPP-0230', code: 'VPP-FIL-001', name: 'Bìa còng A4 7cm', group: 'File & bìa hồ sơ', qty: 120, note: 'Bán · Nhôm kính Đại Phát' },
      { date: '15/07/2026', type: 'in',  doc: 'PNK-VPP-0141', code: 'VPP-SO-002', name: 'Sổ da bìa cứng A5 (khắc logo OWIN)', group: 'Sổ & tập', qty: 140, note: 'Nhập kho TP · LSX-0410 (SX nội bộ)' },
      { date: '14/07/2026', type: 'out', doc: 'PXK-VPP-0229', code: 'VPP-MUC-001', name: 'Hộp mực HP 12A (tương thích)', group: 'Mực máy in VP & vật tư', qty: 30, note: 'Bán · VINHOMES OCEAN PARK' }
    ];
  }

  // ---- Persistence (localStorage · fallback RAM) ----
  var mem = null;
  function load() {
    if (mem) return mem;
    try {
      var v = JSON.parse(global.localStorage.getItem(KEY));
      if (v && v.products) { mem = v; return mem; }
    } catch (e) {}
    mem = { products: seedProducts(), txns: seedTxns() };
    save();
    return mem;
  }
  function save() {
    try { global.localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) {}
  }

  function all() { return load().products; }
  function get(code) { return all().filter(function (p) { return p.code === code; })[0] || null; }
  function groups() {
    var seen = {}, out = [];
    all().forEach(function (p) { if (!seen[p.group]) { seen[p.group] = 1; out.push(p.group); } });
    return out;
  }
  function txns() { return load().txns; }

  function nextDoc(type) {
    var pre = type === 'in' ? 'PNK-VPP-' : 'PXK-VPP-';
    var max = 0;
    load().txns.forEach(function (t) {
      var m = new RegExp(pre + '(\\d+)').exec(t.doc || '');
      if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return pre + ('000' + (max + 1)).slice(-4);
  }

  function logTxn(type, code, qty, note, doc) {
    var p = get(code) || {};
    load().txns.unshift({
      date: note && note.__date ? note.__date : 'hôm nay',
      type: type, doc: doc || nextDoc(type),
      code: code, name: p.name || code, group: p.group || '',
      qty: qty, note: (typeof note === 'string' ? note : (note && note.text) || '')
    });
    if (load().txns.length > 200) load().txns = load().txns.slice(0, 200);
  }

  // Nhập kho: cộng tồn + ghi nhật ký. doc/note tuỳ chọn. Trả về bản ghi SP.
  function stockIn(code, qty, note, doc) {
    var p = get(code); if (!p) return null;
    qty = Math.max(0, Math.round(Number(qty) || 0));
    p.onHand += qty;
    logTxn('in', code, qty, note, doc);
    save(); return p;
  }
  // Xuất kho: trừ tồn (không âm) + ghi nhật ký.
  function stockOut(code, qty, note, doc) {
    var p = get(code); if (!p) return null;
    qty = Math.max(0, Math.round(Number(qty) || 0));
    p.onHand = Math.max(0, p.onHand - qty);
    logTxn('out', code, qty, note, doc);
    save(); return p;
  }

  // Thêm mặt hàng VPP mới (dùng khi nhập kho TP VPP từ SX cho SP chưa có mã)
  function addProduct(o) {
    o = o || {};
    var code = o.code || ('VPP-' + Date.now().toString().slice(-6));
    if (get(code)) return get(code);
    var p = {
      code: code, name: o.name || 'Mặt hàng VPP', group: o.group || 'Khác',
      unit: o.unit || 'cái', onHand: Math.max(0, Math.round(o.onHand || 0)),
      minStock: o.minStock || 0, costPrice: o.costPrice || 0, salePrice: o.salePrice || 0,
      location: o.location || '—', supplier: o.supplier || '—'
    };
    all().unshift(p);
    save(); return p;
  }

  function summary() {
    var rows = all();
    var low = rows.filter(function (p) { return p.onHand <= p.minStock; });
    var value = rows.reduce(function (s, p) { return s + p.onHand * p.costPrice; }, 0);
    return {
      skus: rows.length, groups: groups().length,
      lowCount: low.length, lowRows: low,
      stockValue: value,
      totalUnits: rows.reduce(function (s, p) { return s + p.onHand; }, 0)
    };
  }

  global.VPPStore = {
    all: all, get: get, groups: groups, txns: txns,
    stockIn: stockIn, stockOut: stockOut, addProduct: addProduct,
    nextDoc: nextDoc, summary: summary, save: save
  };
})(typeof window !== 'undefined' ? window : this);
