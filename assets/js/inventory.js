/* ============================================================
   ERPInv — Sổ kho Xuất nhập kho (NVL + Thành phẩm) — nhà máy cửa nhôm Owin
   ------------------------------------------------------------
   Ghi sổ chuẩn kế toán: phiếu nhập (PNK) / phiếu xuất (PXK),
   kiểm tra đủ tồn khi xuất, và BACKFLUSH: nhập kho thành phẩm
   tự động sinh phiếu xuất NVL theo định mức BOM (ERPBOM).
   Phụ thuộc: window.StockStore (danh mục NVL), window.ERPBOM.
   Lưu localStorage (fallback RAM khi mở file://).
   API: allItems() getItem() allTxns() getTxn() nextId(kind)
        ledger(code) post(txn) save()
   ============================================================ */
(function (global) {
  'use strict';

  var KEY = 'erp_inv_nhomowin_v1';

  var TYPE_LABELS = {
    nhap_mua:  'Nhập mua NVL',
    nhap_tp:   'Nhập kho thành phẩm từ sản xuất',
    xuat_sx:   'Xuất NVL cho sản xuất',
    xuat_ban:  'Xuất bán thành phẩm',
    xuat_khac: 'Xuất khác'
  };

  /* Danh mục kho vật lý — NVL 3 kho + BTP + 2 kho thành phẩm (lưu / bán hàng) */
  var WAREHOUSES = ['Kho nhôm thanh', 'Kho kính', 'Kho phụ kiện', 'Kho bán thành phẩm', 'Kho lưu thành phẩm', 'Kho bán hàng'];
  var WH_TP = ['Kho lưu thành phẩm', 'Kho bán hàng'];   // 2 kho chứa thành phẩm
  var WH_OF = {
    'GIAY-IV300-6586': 'Kho nhôm thanh', 'GIAY-CU150-6090': 'Kho nhôm thanh',
    'GIAY-CU250-7290': 'Kho nhôm thanh', 'GIAY-DC230-65100': 'Kho nhôm thanh',
    'GIAY-FT80-79109': 'Kho nhôm thanh',
    'GIAY-BT350-7090': 'Kho kính', 'GIAY-DC400-7090': 'Kho kính',
    'KEM-CTP-525': 'Kho phụ kiện', 'MUC-CMYK': 'Kho phụ kiện',
    'DECAL-GIAY': 'Kho phụ kiện', 'DECAL-PP': 'Kho phụ kiện',
    'DECAL-TRONG': 'Kho phụ kiện', 'CAN-BONG': 'Kho phụ kiện',
    'BAN-FLEXO': 'Kho phụ kiện'
  };
  function warehouseOf(code) { return WH_OF[code] || 'Kho lưu thành phẩm'; }

  function seedItems() {
    var items = [];
    // NVL: toàn bộ danh mục StockStore
    var mats = (global.StockStore && global.StockStore.MATERIALS) || [];
    mats.forEach(function (m) {
      items.push({
        code: m.code, name: m.name, kind: 'nvl', unit: m.unit,
        onHand: m.onHand, minStock: m.minStock, price: m.price,
        warehouse: warehouseOf(m.code)
      });
    });
    // Thành phẩm — tồn tách 2 kho: wh.luu (Kho lưu thành phẩm) · wh.ban (Kho bán hàng)
    function tp(code, name, unit, luu, ban, min, price) {
      items.push({
        code: code, name: name, kind: 'tp', unit: unit,
        onHand: Math.round((luu + ban) * 100) / 100, minStock: min, price: price,
        warehouse: 'Kho lưu thành phẩm', wh: { luu: luu, ban: ban }
      });
    }
    tp('TP-TL120-2C',   'Cửa thuỷ lực hệ 120 · 2 cánh (bộ)',        'bộ', 28,  14,  10, 14500000);
    tp('TP-TQ93-4C',    'Cửa trượt quay 93 · 4 cánh (bộ)',          'bộ', 18,  10,  8,  13500000);
    tp('TP-LUX121-M2',  'Cửa sổ mở quay Luxanode 121 (m²)',         'm²', 240, 120, 80, 2100000);
    tp('TP-VOM120',     'Cửa vòm nhôm uốn hệ 120 · 2 cánh (bộ)',    'bộ', 9,   3,   4,  18900000);
    tp('TP-NHOM120-XA', 'Nhôm thanh hệ 120 (bán xá theo kg)',        'kg', 5200, 3400, 1500, 112000);
    return items;
  }

  function ln(code, name, unit, qty, price) {
    return { code: code, name: name, unit: unit, qty: qty, price: price, amount: Math.round(qty * price) };
  }
  function withTotal(t) {
    t.total = t.lines.reduce(function (s, l) { return s + (l.amount || 0); }, 0);
    return t;
  }

  function seedTxns() {
    // Lịch sử T7–T8/2026 — tồn hiện tại đã gồm các phiếu này (tồn đầu suy ngược).
    return [
      withTotal({
        id: 'PXK-2026-0002', kind: 'out', type: 'xuat_ban', typeLabel: TYPE_LABELS.xuat_ban,
        date: '05/08/2026', partner: 'ĐL Nhôm kính Minh Anh', ref: 'DH-2026-0891',
        warehouse: 'Kho bán hàng',
        note: 'Xuất bán theo đơn hàng tháng 8 (tồn đầu đã gồm)',
        lines: [
          ln('TP-TL120-2C', 'Cửa thuỷ lực hệ 120 · 2 cánh (bộ)', 'bộ', 8, 14500000),
          ln('TP-LUX121-M2', 'Cửa sổ mở quay Luxanode 121 (m²)', 'm²', 46, 2100000)
        ]
      }),
      withTotal({
        id: 'PXK-2026-0001', kind: 'out', type: 'xuat_sx', typeLabel: 'Xuất NVL cho sản xuất (backflush BOM)',
        date: '28/07/2026', partner: 'Tổ ép góc – lắp ráp — Ca 1', ref: 'LSX-2206',
        warehouse: 'Kho nhôm thanh',
        note: 'Tự động theo BOM-001 khi nhập 12 bộ Cửa thuỷ lực hệ 120 · 2 cánh (tồn đầu đã gồm)',
        autoGen: true, backflushOf: 'PNK-2026-0003',
        lines: [
          ln('GIAY-IV300-6586', 'Thanh nhôm hệ thuỷ lực 120 (6063-T5)', 'kg', 737.76, 78500),
          ln('GIAY-BT350-7090', 'Kính hộp 5-9-5 cường lực', 'm²', 39.55, 385000),
          ln('KEM-CTP-525', 'Bộ bản lề thuỷ lực sàn (Đức)', 'bộ', 12.06, 4850000),
          ln('MUC-CMYK', 'Bộ khoá & tay nắm cao cấp', 'bộ', 12.06, 3200000),
          ln('DECAL-GIAY', 'Gioăng EPDM', 'm', 293.76, 9500),
          ln('DECAL-PP', 'Keo silicon trung tính', 'tuýp', 24.48, 62000),
          ln('BAN-FLEXO', 'Ke góc & vít inox (bộ)', 'bộ', 24.24, 185000),
          ln('DECAL-TRONG', 'Màng bảo vệ bề mặt nhôm', 'm²', 85.68, 15000),
          ln('CAN-BONG', 'Xốp + kiện gỗ đóng cửa', 'bộ', 12, 145000)
        ]
      }),
      withTotal({
        id: 'PNK-2026-0003', kind: 'in', type: 'nhap_tp', typeLabel: TYPE_LABELS.nhap_tp,
        date: '28/07/2026', partner: 'Tổ hoàn thiện – đóng kiện — Ca 1', ref: 'LSX-2206',
        warehouse: 'Kho lưu thành phẩm',
        note: 'Nhập kho thành phẩm hoàn thành LSX-2206 (tồn đầu đã gồm)',
        lines: [ ln('TP-TL120-2C', 'Cửa thuỷ lực hệ 120 · 2 cánh (bộ)', 'bộ', 12, 14500000) ]
      }),
      withTotal({
        id: 'PNK-2026-0002', kind: 'in', type: 'nhap_mua', typeLabel: TYPE_LABELS.nhap_mua,
        date: '22/07/2026', partner: 'Kính Việt Nhật Hải Long', ref: 'PO-2026-0745',
        warehouse: 'Kho kính',
        note: 'Nhập kính cường lực & kính hộp theo PO (tồn đầu đã gồm)',
        lines: [
          ln('GIAY-BT350-7090', 'Kính hộp 5-9-5 cường lực', 'm²', 420, 385000),
          ln('GIAY-DC400-7090', 'Kính cường lực 8mm', 'm²', 260, 295000)
        ]
      }),
      withTotal({
        id: 'PNK-2026-0001', kind: 'in', type: 'nhap_mua', typeLabel: TYPE_LABELS.nhap_mua,
        date: '05/07/2026', partner: 'Đùn ép Nhôm Đông Anh', ref: 'PO-2026-0712',
        warehouse: 'Kho nhôm thanh',
        note: 'Nhập nhôm thanh 6063-T5 đầu tháng 7 (tồn đầu đã gồm)',
        lines: [
          ln('GIAY-IV300-6586', 'Thanh nhôm hệ thuỷ lực 120 (6063-T5)', 'kg', 18000, 78500),
          ln('GIAY-DC230-65100', 'Thanh nhôm Luxanode Anodized-ED 121', 'kg', 9000, 96000)
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
      if (v && v.items && v.txns) { mem = v; return mem; }
    } catch (e) {}
    mem = { items: seedItems(), txns: seedTxns() };
    save();
    return mem;
  }
  function save() {
    try { global.localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) {}
  }

  function allItems() { return load().items; }
  function getItem(code) {
    return allItems().filter(function (i) { return i.code === code; })[0] || null;
  }
  function allTxns() { return load().txns; }
  function getTxn(id) {
    return allTxns().filter(function (t) { return t.id === id; })[0] || null;
  }

  function nextId(kind) {
    var pre = kind === 'in' ? 'PNK-2026-' : 'PXK-2026-';
    var max = 0;
    allTxns().forEach(function (t) {
      var m = new RegExp('^' + pre + '(\\d+)$').exec(t.id || '');
      if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return pre + ('000' + (max + 1)).slice(-4);
  }

  function todayStr() {
    var d = new Date();
    var p = function (n) { return ('0' + n).slice(-2); };
    return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear();
  }

  // dd/mm/yyyy → khoá sắp xếp yyyymmdd
  function dateKey(s) {
    var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(s || '').trim());
    if (!m) return '00000000';
    return m[3] + ('0' + m[2]).slice(-2) + ('0' + m[1]).slice(-2);
  }

  function round2(n) { return Math.round(n * 100) / 100; }

  // Sổ chi tiết vật tư: tồn đầu = tồn hiện tại − Σnhập + Σxuất, chạy xuôi cộng dồn
  function ledger(code) {
    var item = getItem(code);
    if (!item) return { opening: 0, rows: [], closing: 0 };
    var moves = [];
    allTxns().forEach(function (t) {
      (t.lines || []).forEach(function (l) {
        if (l.code !== code) return;
        moves.push({
          date: t.date, id: t.id, typeLabel: t.typeLabel, partner: t.partner,
          inQty: t.kind === 'in' ? l.qty : 0,
          outQty: t.kind === 'out' ? l.qty : 0
        });
      });
    });
    // cũ → mới (cùng ngày: theo số phiếu)
    moves.sort(function (a, b) {
      var k = dateKey(a.date).localeCompare(dateKey(b.date));
      return k !== 0 ? k : String(a.id).localeCompare(String(b.id));
    });
    var totalIn = 0, totalOut = 0;
    moves.forEach(function (m) { totalIn += m.inQty; totalOut += m.outQty; });
    var opening = round2(item.onHand - totalIn + totalOut);
    var bal = opening;
    var rows = moves.map(function (m) {
      bal = round2(bal + m.inQty - m.outQty);
      return {
        date: m.date, id: m.id, typeLabel: m.typeLabel, partner: m.partner,
        inQty: m.inQty, outQty: m.outQty, balance: bal
      };
    });
    return { opening: opening, rows: rows, closing: round2(bal) };
  }

  /* ------------------------------------------------------------
     post(txn) — Ghi sổ chuẩn kế toán.
     txn: { kind:'in'|'out', type, date?, partner, ref, note, lines:[{code,qty,price?}] }
     - Validate ≥1 dòng qty>0
     - Phiếu xuất: từng dòng đủ tồn, thiếu → {ok:false, errors:[{code,name,need,have}]}
     - Nhập TP (type 'nhap_tp'): tự sinh phiếu xuất NVL backflush theo BOM;
       thiếu NVL hoặc thiếu BOM → {ok:false, errors} và KHÔNG ghi gì (all-or-nothing).
     ------------------------------------------------------------ */
  function post(txn) {
    if (!txn || (txn.kind !== 'in' && txn.kind !== 'out')) {
      return { ok: false, errors: [], message: 'Phiếu không hợp lệ' };
    }
    // Chuẩn hoá dòng
    var lines = (txn.lines || []).map(function (l) {
      var item = getItem(l.code) || {};
      var qty = round2(Number(l.qty) || 0);
      var price = (l.price != null && l.price !== '') ? Number(l.price) : (item.price || 0);
      var out = {
        code: l.code, name: l.name || item.name || l.code,
        unit: l.unit || item.unit || '', qty: qty,
        price: price, amount: Math.round(qty * price)
      };
      // Passthrough các trường mở rộng cấp nhà máy (lot, expiry, docQty, ...)
      Object.keys(l).forEach(function (k) { if (!(k in out)) out[k] = l[k]; });
      return out;
    }).filter(function (l) { return l.code && l.qty > 0; });

    if (!lines.length) {
      return { ok: false, errors: [], message: 'Phiếu phải có ít nhất 1 dòng vật tư với số lượng > 0' };
    }

    var errors = [];

    // Phiếu XUẤT: kiểm đủ tồn từng dòng
    if (txn.kind === 'out') {
      lines.forEach(function (l) {
        var item = getItem(l.code);
        if (!item) { errors.push({ code: l.code, name: l.name, need: l.qty, have: 0 }); return; }
        if (item.onHand < l.qty) errors.push({ code: l.code, name: l.name, need: l.qty, have: item.onHand });
      });
      if (errors.length) return { ok: false, errors: errors };
    }

    // Nhập TP: tính trước nhu cầu NVL backflush, kiểm đủ tồn TRƯỚC khi ghi bất cứ gì
    var bfLines = null;
    if (txn.kind === 'in' && txn.type === 'nhap_tp') {
      if (!global.ERPBOM) return { ok: false, errors: [], message: 'Thiếu ERPBOM — không thể backflush' };
      var needMap = {}, order = [];
      var noBom = [];
      lines.forEach(function (l) {
        var bom = global.ERPBOM.byProduct(l.name);
        if (!bom) { noBom.push({ code: l.code, name: l.name, need: 0, have: 0, noBom: true }); return; }
        global.ERPBOM.explode(bom, l.qty).forEach(function (e) {
          var a = needMap[e.matCode];
          if (!a) { a = needMap[e.matCode] = { matCode: e.matCode, matName: e.matName, unit: e.unit, qty: 0, price: e.price }; order.push(e.matCode); }
          a.qty = round2(a.qty + e.qty);
        });
      });
      if (noBom.length) {
        return { ok: false, errors: noBom, message: 'Thành phẩm chưa thiết lập BOM — vào Định mức BOM để khai báo' };
      }
      bfLines = order.map(function (c) {
        var a = needMap[c];
        return { code: a.matCode, name: a.matName, unit: a.unit, qty: a.qty, price: a.price, amount: Math.round(a.qty * a.price) };
      });
      bfLines.forEach(function (l) {
        var item = getItem(l.code);
        var have = item ? item.onHand : 0;
        if (have < l.qty) errors.push({ code: l.code, name: l.name, need: l.qty, have: have });
      });
      if (errors.length) return { ok: false, errors: errors }; // rollback: chưa ghi gì
    }

    // ---- Ghi sổ (đã qua mọi kiểm tra) ----
    var t = {
      id: txn.id || nextId(txn.kind),
      kind: txn.kind, type: txn.type || (txn.kind === 'in' ? 'nhap_mua' : 'xuat_khac'),
      typeLabel: txn.typeLabel || TYPE_LABELS[txn.type] || (txn.kind === 'in' ? 'Phiếu nhập kho' : 'Phiếu xuất kho'),
      date: txn.date || todayStr(),
      partner: txn.partner || '', ref: txn.ref || '', note: txn.note || '',
      lines: lines
    };
    // Passthrough các trường mở rộng của phiếu (shift, warehouse, vehicle, deliverer, receiver, time, ...)
    Object.keys(txn).forEach(function (k) { if (!(k in t) && k !== 'lines') t[k] = txn[k]; });
    withTotal(t);

    lines.forEach(function (l) {
      var item = getItem(l.code);
      if (!item) return;
      item.onHand = round2(item.onHand + (t.kind === 'in' ? l.qty : -l.qty));
    });
    allTxns().unshift(t);

    var bfTxn = null;
    if (bfLines) {
      bfTxn = {
        id: nextId('out'), kind: 'out', type: 'xuat_sx',
        typeLabel: 'Xuất NVL cho sản xuất (backflush BOM)',
        date: t.date, partner: t.partner || 'Xưởng cửa nhôm Owin', ref: t.ref,
        note: 'Tự động sinh theo định mức BOM từ phiếu ' + t.id,
        autoGen: true, backflushOf: t.id,
        lines: bfLines
      };
      withTotal(bfTxn);
      bfLines.forEach(function (l) {
        var item = getItem(l.code);
        if (item) item.onHand = round2(item.onHand - l.qty);
      });
      allTxns().unshift(bfTxn);
    }

    save();
    return { ok: true, txn: t, backflushTxn: bfTxn };
  }

  global.ERPInv = {
    TYPE_LABELS: TYPE_LABELS,
    WAREHOUSES: WAREHOUSES, WH_TP: WH_TP, warehouseOf: warehouseOf,
    allItems: allItems, getItem: getItem,
    allTxns: allTxns, getTxn: getTxn,
    nextId: nextId, ledger: ledger, post: post, save: save,
    todayStr: todayStr, dateKey: dateKey
  };
})(typeof window !== 'undefined' ? window : this);
