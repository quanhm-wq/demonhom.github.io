/* ============================================================
   ERPBOM — Định mức nguyên vật liệu (BOM) ngành cửa nhôm
   ------------------------------------------------------------
   Định mức cho 1 ĐƠN VỊ đầu ra (bộ cửa / m² / cánh...) theo
   khối lượng nhôm hệ ~13–16 kg/m², hao hụt cắt nhôm (đầu mẩu) 6–11%.
   Là căn cứ XUẤT NVL TỰ ĐỘNG (backflush) khi nhập kho thành phẩm.
   Phụ thuộc: window.StockStore (đơn giá NVL — getMaterial).
   Lưu localStorage (fallback RAM khi mở file://).
   API: list() get(id) byProduct(name) save(bom) remove(id)
        unitCost(bom) explode(bomIdHoặcTênTP, outQty)
   ============================================================ */
(function (global) {
  'use strict';

  var KEY = 'erp_bom_nhomowin_v1';

  // Bỏ dấu + thường hoá để so khớp tên sản phẩm
  function norm(s) {
    return String(s == null ? '' : s)
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function line(matCode, matName, group, qty, unit, waste, note) {
    var l = { matCode: matCode, matName: matName, group: group, qty: qty, unit: unit, waste: waste };
    if (note) l.note = note;
    return l;
  }

  function seedBOMs() {
    return [
      {
        id: 'BOM-001', productCode: 'TP-TL120-2C', productName: 'Cửa thuỷ lực hệ 120 · 2 cánh (bộ)',
        outUnit: 'bộ', version: 'v1', status: 'áp dụng', updated: '02/07/2026',
        note: '3,6 m² × 16 kg/m² nhôm hệ 120 = 58 kg/bộ · hao cắt đầu mẩu 6%',
        lines: [
          line('GIAY-IV300-6586', 'Thanh nhôm hệ thuỷ lực 120 (6063-T5)', 'Nguyên liệu chính', 58,   'kg',   6),
          line('KEM-CTP-525',     'Bộ bản lề thuỷ lực sàn (Đức)',         'Phụ kiện',          1,    'bộ',   0.5),
          line('MUC-CMYK',        'Bộ khoá & tay nắm cao cấp',            'Phụ kiện',          1,    'bộ',   0.5),
          line('BAN-FLEXO',       'Ke góc & vít inox (bộ)',               'Phụ kiện',          2,    'bộ',   1),
          line('GIAY-BT350-7090', 'Kính hộp 5-9-5 cường lực',             'Kính & gioăng',     3.2,  'm²',   3),
          line('DECAL-GIAY',      'Gioăng EPDM',                          'Kính & gioăng',     24,   'm',    2),
          line('DECAL-PP',        'Keo silicon trung tính',               'Kính & gioăng',     2,    'tuýp', 2),
          line('DECAL-TRONG',     'Màng bảo vệ bề mặt nhôm',              'Đóng gói',          7,    'm²',   2),
          line('CAN-BONG',        'Xốp + kiện gỗ đóng cửa',               'Đóng gói',          1,    'bộ',   0)
        ]
      },
      {
        id: 'BOM-002', productCode: 'TP-TQ93-4C', productName: 'Cửa trượt quay 93 · 4 cánh (bộ)',
        outUnit: 'bộ', version: 'v2', status: 'áp dụng', updated: '15/07/2026',
        note: '5,4 m² × ~13,3 kg/m² nhôm hệ trượt quay 93 = 72 kg/bộ · hao cắt đầu mẩu 6%',
        lines: [
          line('GIAY-CU250-7290', 'Thanh nhôm hệ trượt quay 93',          'Nguyên liệu chính', 72,   'kg',   6),
          line('MUC-CMYK',        'Bộ khoá & tay nắm cao cấp',            'Phụ kiện',          1,    'bộ',   0.5),
          line('BAN-FLEXO',       'Ke góc & vít inox (bộ)',               'Phụ kiện',          4,    'bộ',   1),
          line('GIAY-DC400-7090', 'Kính cường lực 8mm',                   'Kính & gioăng',     5.0,  'm²',   3),
          line('DECAL-GIAY',      'Gioăng EPDM',                          'Kính & gioăng',     34,   'm',    2),
          line('DECAL-PP',        'Keo silicon trung tính',               'Kính & gioăng',     3,    'tuýp', 2),
          line('DECAL-TRONG',     'Màng bảo vệ bề mặt nhôm',              'Đóng gói',          10,   'm²',   2),
          line('CAN-BONG',        'Xốp + kiện gỗ đóng cửa',               'Đóng gói',          1,    'bộ',   0)
        ]
      },
      {
        id: 'BOM-003', productCode: 'TP-LUX121-M2', productName: 'Cửa sổ mở quay Luxanode 121 (m²)',
        outUnit: 'm²', version: 'v1', status: 'áp dụng', updated: '20/07/2026',
        note: 'Định mức cho 1 m² cửa sổ mở quay · nhôm Luxanode 9,6 kg/m², hao cắt đầu mẩu 7%',
        lines: [
          line('GIAY-DC230-65100', 'Thanh nhôm Luxanode Anodized-ED 121', 'Nguyên liệu chính', 9.6,  'kg',   7),
          line('BAN-FLEXO',       'Ke góc & vít inox (bộ)',               'Phụ kiện',          0.6,  'bộ',   1),
          line('GIAY-BT350-7090', 'Kính hộp 5-9-5 cường lực',             'Kính & gioăng',     0.88, 'm²',   3),
          line('DECAL-GIAY',      'Gioăng EPDM',                          'Kính & gioăng',     6.2,  'm',    2),
          line('DECAL-PP',        'Keo silicon trung tính',               'Kính & gioăng',     0.6,  'tuýp', 2),
          line('DECAL-TRONG',     'Màng bảo vệ bề mặt nhôm',              'Đóng gói',          2,    'm²',   2)
        ]
      },
      {
        id: 'BOM-004', productCode: 'TP-VOM120', productName: 'Cửa vòm nhôm uốn hệ 120 · 2 cánh (bộ)',
        outUnit: 'bộ', version: 'v1', status: 'áp dụng', updated: '01/08/2026',
        note: '4,1 m² cửa vòm · 69 kg nhôm hệ 120 / bộ (hao uốn vòm cao hơn cửa phẳng)',
        lines: [
          line('GIAY-IV300-6586', 'Thanh nhôm hệ thuỷ lực 120 (6063-T5)', 'Nguyên liệu chính', 69,   'kg',   11, 'hao uốn vòm cao, phôi hỏng khi bán kính nhỏ'),
          line('KEM-CTP-525',     'Bộ bản lề thuỷ lực sàn (Đức)',         'Phụ kiện',          1,    'bộ',   0.5),
          line('MUC-CMYK',        'Bộ khoá & tay nắm cao cấp',            'Phụ kiện',          1,    'bộ',   0.5),
          line('BAN-FLEXO',       'Ke góc & vít inox (bộ)',               'Phụ kiện',          2,    'bộ',   1),
          line('GIAY-BT350-7090', 'Kính hộp 5-9-5 cường lực',             'Kính & gioăng',     3.6,  'm²',   8,  'kính hộp uốn cong theo vòm'),
          line('DECAL-GIAY',      'Gioăng EPDM',                          'Kính & gioăng',     28,   'm',    3),
          line('DECAL-PP',        'Keo silicon trung tính',               'Kính & gioăng',     3,    'tuýp', 2),
          line('DECAL-TRONG',     'Màng bảo vệ bề mặt nhôm',              'Đóng gói',          8,    'm²',   2),
          line('CAN-BONG',        'Xốp + kiện gỗ đóng cửa',               'Đóng gói',          1,    'bộ',   0)
        ]
      }
    ];
  }

  // ---- Persistence (localStorage · fallback RAM) ----
  var mem = null;
  function load() {
    if (mem) return mem;
    try {
      var v = JSON.parse(global.localStorage.getItem(KEY));
      if (v && v.boms) { mem = v; return mem; }
    } catch (e) {}
    mem = { boms: seedBOMs() };
    save();
    return mem;
  }
  function save() {
    try { global.localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) {}
  }

  function list() { return load().boms; }
  function get(id) {
    return list().filter(function (b) { return b.id === id; })[0] || null;
  }

  // So khớp gần đúng theo tên sản phẩm (bỏ dấu, includes 2 chiều)
  function byProduct(name) {
    var n = norm(name);
    if (!n) return null;
    var boms = list();
    // Ưu tiên khớp chính xác
    for (var i = 0; i < boms.length; i++) {
      if (norm(boms[i].productName) === n) return boms[i];
    }
    for (var j = 0; j < boms.length; j++) {
      var pn = norm(boms[j].productName);
      if (pn.indexOf(n) >= 0 || n.indexOf(pn) >= 0) return boms[j];
    }
    return null;
  }

  function nextId() {
    var max = 0;
    list().forEach(function (b) {
      var m = /BOM-(\d+)/.exec(b.id || '');
      if (m) max = Math.max(max, parseInt(m[1], 10));
    });
    return 'BOM-' + ('00' + (max + 1)).slice(-3);
  }

  function todayStr() {
    var d = new Date();
    var p = function (n) { return ('0' + n).slice(-2); };
    return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear();
  }

  function saveBOM(bom) {
    if (!bom) return null;
    bom.updated = todayStr();
    if (!bom.id) bom.id = nextId();
    var boms = list();
    var found = false;
    for (var i = 0; i < boms.length; i++) {
      if (boms[i].id === bom.id) { boms[i] = bom; found = true; break; }
    }
    if (!found) boms.unshift(bom);
    save();
    return bom;
  }

  function remove(id) {
    var boms = list();
    load().boms = boms.filter(function (b) { return b.id !== id; });
    save();
  }

  function matPrice(code) {
    if (!global.StockStore || !global.StockStore.getMaterial) return 0;
    var m = global.StockStore.getMaterial(code);
    return m ? (m.price || 0) : 0;
  }

  // Chi phí NVL cho 1 đơn vị đầu ra = Σ qty × (1 + waste/100) × giá kho
  function unitCost(bom) {
    if (!bom || !bom.lines) return 0;
    return bom.lines.reduce(function (sum, l) {
      var p = matPrice(l.matCode);
      return sum + (Number(l.qty) || 0) * (1 + (Number(l.waste) || 0) / 100) * p;
    }, 0);
  }

  // Bung định mức cho outQty đơn vị đầu ra → nhu cầu NVL (phục vụ backflush)
  function explode(bomOrName, outQty) {
    var bom = null;
    if (bomOrName && typeof bomOrName === 'object') bom = bomOrName;
    else bom = get(bomOrName) || byProduct(bomOrName);
    if (!bom || !bom.lines) return [];
    var q = Number(outQty) || 0;
    return bom.lines.map(function (l) {
      var need = Math.round((Number(l.qty) || 0) * q * (1 + (Number(l.waste) || 0) / 100) * 100) / 100;
      var price = matPrice(l.matCode);
      return {
        matCode: l.matCode, matName: l.matName, unit: l.unit,
        qty: need, price: price, amount: Math.round(need * price)
      };
    });
  }

  global.ERPBOM = {
    list: list, get: get, byProduct: byProduct,
    save: saveBOM, remove: remove,
    unitCost: unitCost, explode: explode,
    norm: norm, nextId: nextId
  };
})(typeof window !== 'undefined' ? window : this);
