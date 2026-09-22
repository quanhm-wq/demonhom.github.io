/* ============================================================
   ERPPurchase — Đề nghị mua NVL (ĐNM) dùng chung nhiều trang
   ------------------------------------------------------------
   - Lưu danh sách đề nghị mua vào localStorage 'erp_dnm_nhomowin_v1'
     (fallback RAM khi mở file://).
   - openSuggestPopup(opts): popup danh mục NVL thiếu (hết hàng /
     dưới định mức) → tick chọn, sửa SL mua & NCC → tạo đề nghị,
     đề nghị hiển thị bên module Mua hàng (13-mua-hang.html).
   Nguồn tồn kho: window.ERPInv.allItems() (ưu tiên) hoặc
   window.StockStore.MATERIALS (fallback).
   API: all() get(id) create(payload) nextId() save()
        openSuggestPopup({from, ref})
   ============================================================ */
(function (global) {
  'use strict';

  var KEY = 'erp_dnm_nhomowin_v1';

  var FALLBACK_NCC = [
    'Đùn ép Nhôm Đông Anh', 'Nhôm Luxanode nhập khẩu', 'Kính Việt Nhật Hải Long',
    'Phụ kiện Kinlong VN', 'Hoá chất Xây dựng Việt', 'Bao bì Phú Mỹ',
    'Sơn tĩnh điện Á Đông', 'Cơ khí WEIKE Việt Nam'
  ];

  /* Phòng ban được phép đề xuất mua — trang 13-de-xuat-mua.html lọc theo trường `dept`.
     `source`: 'auto' = hệ thống tự phát hiện tồn dưới định mức · 'dept' = phòng ban tự đề xuất. */
  var DEPTS = ['Kho', 'Sản xuất', 'Kỹ thuật', 'Hành chính', 'Hệ thống tự động'];
  var AUTO_DEPT = 'Hệ thống tự động';
  function sourceOf(dept) { return dept === AUTO_DEPT ? 'auto' : 'dept'; }

  function supplierNames() {
    var names = [];
    try {
      if (global.NCC && typeof global.NCC === 'object') {
        Object.keys(global.NCC).forEach(function (k) {
          var ten = global.NCC[k] && global.NCC[k].ten;
          if (ten && names.indexOf(ten) < 0) names.push(ten);
        });
      }
    } catch (e) {}
    if (!names.length) names = FALLBACK_NCC.slice();
    return names;
  }

  function fmtVND(n) { n = Math.round(Number(n) || 0); return n.toLocaleString('vi-VN'); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function todayStr() {
    var d = new Date();
    var p = function (n) { return ('0' + n).slice(-2); };
    return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear();
  }
  function nowTime() {
    var d = new Date();
    var p = function (n) { return ('0' + n).slice(-2); };
    return p(d.getHours()) + ':' + p(d.getMinutes());
  }
  function round2(n) { return Math.round(n * 100) / 100; }

  // Làm tròn LÊN về "số đẹp" cho SL đề xuất mua
  function niceCeil(v) {
    v = Math.max(0, Number(v) || 0);
    if (v <= 10) return Math.ceil(v);
    if (v <= 100) return Math.ceil(v / 5) * 5;
    if (v <= 1000) return Math.ceil(v / 10) * 10;
    if (v <= 10000) return Math.ceil(v / 100) * 100;
    return Math.ceil(v / 500) * 500;
  }

  function ln(code, name, unit, stock, minStock, qty, price, supplier) {
    return {
      code: code, name: name, unit: unit, stock: stock, minStock: minStock,
      qty: qty, price: price, amount: Math.round(qty * price), supplier: supplier
    };
  }
  function withTotal(r) {
    r.total = (r.lines || []).reduce(function (s, l) { return s + (l.amount || 0); }, 0);
    return r;
  }

  function seed() {
    return [
      withTotal({
        id: 'DNM-2026-012', date: '11/08/2026', time: '09:15',
        from: 'Kỹ thuật', dept: 'Kỹ thuật', source: 'dept', nguoi: 'Phạm Minh Khôi — Kỹ sư cơ khí – nhôm hệ',
        ref: 'Kế hoạch thay dao định kỳ Q3',
        status: 'chờ duyệt',
        note: 'Lưỡi cắt máy CAT-01 đã chạy quá 400 giờ, mép cắt bắt đầu ba via — đề nghị thay lưỡi và dao phay đố CNC-21',
        lines: [
          ln('VTM-LUOI-500', 'Lưỡi cắt nhôm Ø500 máy CAT-01', 'cái', 1, 3, 4, 1850000, 'Cơ khí WEIKE Việt Nam'),
          ln('VTM-DAO-PHAY', 'Dao phay đố máy CNC-21', 'cái', 2, 4, 6, 980000, 'Cơ khí WEIKE Việt Nam')
        ]
      }),
      withTotal({
        id: 'DNM-2026-011', date: '10/08/2026', time: '14:05',
        from: 'Sản xuất', dept: 'Sản xuất', source: 'dept', nguoi: 'Nguyễn Đức Trung — Tổ trưởng ép góc – lắp ráp',
        ref: 'LSX-2211',
        status: 'chờ duyệt',
        note: 'Bù ke góc và xốp đóng kiện cho loạt cửa thuỷ lực hệ 120 giao ĐL Owin Hưng Yên',
        lines: [
          ln('BAN-FLEXO', 'Ke góc & vít inox (bộ)', 'bộ', 60, 30, 120, 185000, 'Phụ kiện Kinlong VN'),
          ln('CAN-BONG', 'Xốp + kiện gỗ đóng cửa', 'bộ', 800, 200, 400, 145000, 'Bao bì Phú Mỹ')
        ]
      }),
      withTotal({
        id: 'DNM-2026-010', date: '10/08/2026', time: '08:40',
        from: 'Kho', dept: 'Hệ thống tự động', source: 'auto', nguoi: 'Hệ thống — cảnh báo tồn Kho nhôm thanh',
        ref: 'Cảnh báo tồn dưới định mức',
        status: 'chờ duyệt',
        note: 'Hệ thống tự phát hiện — bù tồn các mã nhôm thanh & keo dưới định mức đầu tháng 8',
        lines: [
          ln('GIAY-CU150-6090', 'Thanh nhôm hệ thuỷ lực 180', 'kg', 12000, 15000, 18000, 82000, 'Nhôm Luxanode nhập khẩu'),
          ln('GIAY-FT80-79109', 'Thanh nhôm hệ chấn song + phào', 'kg', 3800, 8000, 12200, 71000, 'Đùn ép Nhôm Đông Anh'),
          ln('DECAL-PP', 'Keo silicon trung tính', 'tuýp', 180, 250, 320, 62000, 'Hoá chất Xây dựng Việt')
        ]
      }),
      withTotal({
        id: 'DNM-2026-009', date: '08/08/2026', time: '16:20',
        from: 'Hành chính', dept: 'Hành chính', source: 'dept', nguoi: 'Trần Thị Thu Hà — Hành chính nhân sự',
        ref: 'Cấp phát VPP tháng 8',
        status: 'đã duyệt',
        note: 'Văn phòng phẩm cấp cho văn phòng nhà máy Giá Ngự và showroom Tứ Hiệp',
        lines: [
          ln('VPP-GIA-001', 'Giấy A4 Double A 70gsm', 'ram', 640, 200, 120, 62000, 'Bao bì Phú Mỹ'),
          ln('VPP-BUT-001', 'Bút bi Thiên Long TL-027', 'cây', 1840, 500, 300, 2600, 'Bao bì Phú Mỹ')
        ]
      })
    ];
  }

  // ---- Persistence (localStorage · fallback RAM) ----
  var mem = null;
  function load() {
    if (mem) return mem;
    try {
      var v = JSON.parse(global.localStorage.getItem(KEY));
      if (v && v.requests) { mem = v; normalize(mem.requests); return mem; }
    } catch (e) {}
    mem = { requests: seed() };
    save();
    return mem;
  }
  /* Bổ sung dept/source cho bản ghi cũ (chưa có 2 trường này) */
  function normalize(rows) {
    (rows || []).forEach(function (r) {
      if (!r.dept) r.dept = /kho/i.test(r.from || '') ? 'Kho' : AUTO_DEPT;
      if (!r.source) r.source = sourceOf(r.dept);
    });
  }
  function save() {
    try { global.localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) {}
  }

  function all() { return load().requests; }
  function get(id) {
    return all().filter(function (r) { return r.id === id; })[0] || null;
  }
  function nextId() {
    var max = 0;
    all().forEach(function (r) {
      var m = /^DNM-2026-(\d+)$/.exec(r.id || '');
      if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return 'DNM-2026-' + ('00' + (max + 1)).slice(-3);
  }

  /* create(payload)
     payload: { from, dept?, source?, ref?, note?, lines:[{code,name,unit,stock,minStock,qty,price,supplier}] }
     dept  — phòng ban đề xuất (xem DEPTS) · source — 'auto' | 'dept' */
  function create(payload) {
    payload = payload || {};
    var lines = (payload.lines || []).map(function (l) {
      var qty = round2(Number(l.qty) || 0);
      var price = Number(l.price) || 0;
      return {
        code: l.code, name: l.name, unit: l.unit || '',
        stock: (l.stock != null) ? l.stock : null,
        minStock: (l.minStock != null) ? l.minStock : null,
        qty: qty, price: price, amount: Math.round(qty * price),
        supplier: l.supplier || ''
      };
    }).filter(function (l) { return l.code && l.qty > 0; });

    var dept = payload.dept || 'Kho';
    var req = withTotal({
      id: nextId(), date: todayStr(), time: nowTime(),
      from: payload.from || 'Kho nhôm thanh',
      dept: dept, source: payload.source || sourceOf(dept),
      ref: payload.ref || '',
      status: 'chờ duyệt',
      note: payload.note || '',
      lines: lines
    });
    all().unshift(req);
    save();
    return req;
  }

  /* ------------------------------------------------------------
     Danh mục NVL thiếu: hết hàng (onHand<=0) hoặc dưới định mức
     ------------------------------------------------------------ */
  function shortageRows() {
    var items = null;
    if (global.ERPInv && global.ERPInv.allItems) {
      items = global.ERPInv.allItems().filter(function (i) { return i.kind === 'nvl'; });
    } else if (global.StockStore && global.StockStore.MATERIALS) {
      items = global.StockStore.MATERIALS;
    }
    if (!items) return [];
    return items.filter(function (i) {
      return (Number(i.onHand) <= 0) || (Number(i.onHand) < Number(i.minStock));
    }).map(function (i) {
      var sup = i.supplier;
      if (!sup && global.StockStore && global.StockStore.getMaterial) {
        var m = global.StockStore.getMaterial(i.code);
        sup = m ? m.supplier : '';
      }
      var suggest = niceCeil(Math.max(i.minStock * 2 - i.onHand, i.minStock));
      return {
        code: i.code, name: i.name, unit: i.unit,
        onHand: Number(i.onHand) || 0, minStock: Number(i.minStock) || 0,
        price: Number(i.price) || 0, supplier: sup || '',
        out: Number(i.onHand) <= 0, suggest: suggest
      };
    }).sort(function (a, b) { return (b.out - a.out) || ((a.onHand / (a.minStock || 1)) - (b.onHand / (b.minStock || 1))); });
  }

  /* ------------------------------------------------------------
     openSuggestPopup({from, ref}) — popup dùng chung mọi trang
     ------------------------------------------------------------ */
  function openSuggestPopup(opts) {
    opts = opts || {};
    var from = opts.from || 'Kho nhôm thanh';
    var dept0 = opts.dept || AUTO_DEPT;
    if (!global.ERPInteract || !global.ERPInteract.showModal) return;

    var rows = shortageRows();
    if (!rows.length) {
      global.ERPInteract.showModal({
        title: 'Đề nghị mua NVL',
        body: '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;color:var(--moss,#3d6b35)">' +
          '<i data-lucide="check-circle" style="width:20px;height:20px"></i>' +
          '<div><b>Kho nhôm – kính đang đủ định mức</b><br/><span class="t-caption">Không có nhôm thanh, kính hay phụ kiện nào hết hàng hoặc dưới tồn tối thiểu — chưa cần tạo đề nghị mua.</span></div></div>',
        primaryText: 'Đã hiểu'
      });
      return;
    }

    var sups = supplierNames();
    var trHtml = rows.map(function (r, idx) {
      var opt = sups.slice();
      if (r.supplier && opt.indexOf(r.supplier) < 0) opt.unshift(r.supplier);
      var options = opt.map(function (s) {
        return '<option value="' + esc(s) + '"' + (s === r.supplier ? ' selected' : '') + '>' + esc(s) + '</option>';
      }).join('');
      var badge = r.out
        ? '<span class="badge badge-coral">Hết</span>'
        : '<span class="badge badge-yellow">Dưới định mức</span>';
      return '<tr data-dnm-row="' + idx + '">' +
        '<td style="text-align:center"><input type="checkbox" data-dnm-chk checked data-no-interact="true"></td>' +
        '<td><b>' + esc(r.name) + '</b><br/><span class="t-caption">' + esc(r.code) + '</span></td>' +
        '<td class="num">' + fmtVND(r.onHand) + ' ' + esc(r.unit) + '</td>' +
        '<td class="num">' + fmtVND(r.minStock) + '</td>' +
        '<td>' + badge + '</td>' +
        '<td class="num"><input type="number" min="0" step="1" value="' + r.suggest + '" data-dnm-qty data-no-interact="true" class="input" style="width:88px;padding:4px 8px;text-align:right"></td>' +
        '<td class="num">' + fmtVND(r.price) + '₫</td>' +
        '<td class="num" data-dnm-amount><b>' + fmtVND(r.suggest * r.price) + '₫</b></td>' +
        '<td><select data-dnm-sup data-no-interact="true" class="input" style="padding:4px 8px;max-width:170px">' + options + '</select></td>' +
      '</tr>';
    }).join('');

    var body =
      '<div class="dnm-pop" id="dnmPopWrap">' +
        '<div class="mb-2" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
          '<span class="t-caption" style="color:var(--ash,#8a8578)">Phòng ban đề xuất</span>' +
          '<select data-dnm-dept data-no-interact="true" class="input" style="padding:6px 10px;min-height:36px;max-width:200px">' +
            DEPTS.map(function (d) { return '<option value="' + esc(d) + '"' + (d === dept0 ? ' selected' : '') + '>' + esc(d) + '</option>'; }).join('') +
          '</select>' +
          '<span class="t-caption" style="color:var(--ash,#8a8578)">Nguồn: <b>' + esc(from) + '</b>' +
            (opts.ref ? ' · Tham chiếu: <b>' + esc(opts.ref) + '</b>' : '') + '</span>' +
        '</div>' +
        '<div class="t-caption mb-2" style="color:var(--ash,#8a8578)">Hệ thống liệt kê nhôm thanh · kính · phụ kiện <b>hết hàng</b> hoặc <b>dưới tồn tối thiểu</b>, SL đề xuất = bù về 2× định mức.</div>' +
        '<div class="table-wrap" style="max-height:46vh;overflow:auto;border:1px solid var(--rule,#e5e1d8);border-radius:10px">' +
          '<table class="tbl" style="min-width:820px">' +
            '<thead><tr><th style="width:34px"></th><th>Vật tư</th><th class="num">Tồn</th><th class="num">Tồn min</th><th>Trạng thái</th><th class="num">Đề xuất mua</th><th class="num">Đơn giá</th><th class="num">Thành tiền</th><th>Nhà cung cấp</th></tr></thead>' +
            '<tbody>' + trHtml + '</tbody>' +
          '</table>' +
        '</div>' +
        '<div class="mt-3" style="display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:13px">' +
          '<span><b data-dnm-count>' + rows.length + '</b> vật tư đã chọn</span>' +
          '<span>Tổng tiền ước tính: <b data-dnm-total style="color:var(--rust,#b4552d)">0₫</b></span>' +
        '</div>' +
      '</div>';

    global.ERPInteract.showModal({
      title: 'Đề nghị mua vật tư nhôm – kính — danh mục thiếu (' + rows.length + ' mã)',
      body: body,
      primaryText: 'Tạo đề nghị mua',
      secondaryText: 'Đóng',
      onPrimary: function () {
        var picked = collect();
        if (!picked.length) {
          global.ERPInteract.showToast('Chọn ít nhất <b>1 vật tư</b> với số lượng &gt; 0 để tạo đề nghị', 'warning');
          return false; // giữ modal mở
        }
        var dSel = wrap && wrap.querySelector('[data-dnm-dept]');
        var dept = (dSel && dSel.value) || dept0;
        var req = create({ from: from, dept: dept, source: sourceOf(dept), ref: opts.ref || '', note: opts.note || '', lines: picked });
        global.ERPInteract.showToast(
          'Đã tạo <a href="13-de-xuat-mua.html?dnm=' + req.id + '" class="lnk">' + req.id + '</a> · ' +
          req.lines.length + ' vật tư · <b>' + fmtVND(req.total) + '₫</b> · ' + esc(req.dept) + ' — bấm để mở',
          'success', 5200);
        if (typeof opts.onCreated === 'function') { try { opts.onCreated(req); } catch (e) {} }
        return true;
      }
    });

    // Nới rộng modal (mặc định của layout.js khá hẹp)
    var wrap = global.document.getElementById('dnmPopWrap');
    var modal = wrap ? wrap.closest('.erp-modal') : null;
    if (modal) { modal.style.width = 'min(960px, 94vw)'; modal.style.maxWidth = '960px'; }

    function rowState(tr) {
      var idx = parseInt(tr.getAttribute('data-dnm-row'), 10);
      var r = rows[idx];
      var chk = tr.querySelector('[data-dnm-chk]');
      var qty = Number(tr.querySelector('[data-dnm-qty]').value) || 0;
      var sup = tr.querySelector('[data-dnm-sup]').value;
      return { r: r, checked: !!(chk && chk.checked), qty: qty, supplier: sup };
    }
    function collect() {
      if (!wrap) return [];
      var out = [];
      Array.prototype.forEach.call(wrap.querySelectorAll('tr[data-dnm-row]'), function (tr) {
        var s = rowState(tr);
        if (s.checked && s.qty > 0) {
          out.push(ln(s.r.code, s.r.name, s.r.unit, s.r.onHand, s.r.minStock, s.qty, s.r.price, s.supplier));
        }
      });
      return out;
    }
    function refresh() {
      if (!wrap) return;
      var count = 0, total = 0;
      Array.prototype.forEach.call(wrap.querySelectorAll('tr[data-dnm-row]'), function (tr) {
        var s = rowState(tr);
        var amount = Math.round(s.qty * s.r.price);
        var cell = tr.querySelector('[data-dnm-amount]');
        if (cell) cell.innerHTML = '<b>' + fmtVND(amount) + '₫</b>';
        tr.style.opacity = s.checked ? '' : '.45';
        if (s.checked && s.qty > 0) { count += 1; total += amount; }
      });
      var c = wrap.querySelector('[data-dnm-count]');
      var t = wrap.querySelector('[data-dnm-total]');
      if (c) c.textContent = count;
      if (t) t.textContent = fmtVND(total) + '₫';
    }
    if (wrap) {
      wrap.addEventListener('input', refresh);
      wrap.addEventListener('change', refresh);
      refresh();
    }
    if (global.lucide) { try { global.lucide.createIcons(); } catch (e) {} }
  }

  global.ERPPurchase = {
    DEPTS: DEPTS, AUTO_DEPT: AUTO_DEPT, sourceOf: sourceOf,
    all: all, get: get, create: create, nextId: nextId, save: save,
    shortageRows: shortageRows, openSuggestPopup: openSuggestPopup,
    fmtVND: fmtVND, todayStr: todayStr
  };
})(typeof window !== 'undefined' ? window : this);
