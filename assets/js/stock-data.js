/* ============================================================
   StockStore — Tồn kho NVL nhôm – kính + Đề xuất mua theo lệnh sản xuất (LSX)
   ------------------------------------------------------------
   Gộp định mức BOM (nhôm thanh, kính, phụ kiện, gioăng) của các LSX
   đang chạy → đối chiếu tồn kho → đề nghị mua phần thiếu
   (kèm giá ước & nhà cung cấp).
   Phụ thuộc: window.QuoteStore (đọc allLSX()).
   ============================================================ */
(function (global) {
  'use strict';

  // Danh mục NVL (khớp trang Kho 05 + tên BOM do PricingEngine sinh)
  // Lưu ý: mảng `match` là token so khớp tên BOM — GIỮ token cũ để không gãy đối chiếu, bổ sung token mới ngành cửa nhôm.
  var MATERIALS = [
    { code: 'GIAY-IV300-6586',  name: 'Thanh nhôm hệ thuỷ lực 120 (6063-T5)', spec: 'Cây 5,8m · dày 2,0mm', unit: 'kg',   onHand: 82500, minStock: 20000, price: 78500,   supplier: 'Đùn ép Nhôm Đông Anh',   match: ['ivory 300', 'dau co', 'dầu cọ', 'nhom 120', 'nhôm 120', 'thuy luc 120', 'thủy lực 120', 'thanh nhôm 120'] },
    { code: 'GIAY-CU150-6090',  name: 'Thanh nhôm hệ thuỷ lực 180',           spec: 'Cây 5,8m · dày 2,5mm', unit: 'kg',   onHand: 12000, minStock: 15000, price: 82000,   supplier: 'Đùn ép Nhôm Đông Anh',   match: ['couche 150', 'couché 150', 'dau nanh', 'dầu nành', 'nhom 180', 'nhôm 180', 'thủy lực 180'] },
    { code: 'GIAY-CU250-7290',  name: 'Thanh nhôm hệ trượt quay 93',          spec: 'Cây 5,8m',             unit: 'kg',   onHand: 26000, minStock: 12000, price: 76000,   supplier: 'Đùn ép Nhôm Đông Anh',   match: ['couche 250', 'couché 250', 'dau huong duong', 'dầu hướng dương', 'truot quay', 'trượt quay', 'nhôm 93'] },
    { code: 'GIAY-DC230-65100', name: 'Thanh nhôm Luxanode Anodized-ED 121',  spec: 'Cây 5,8m · anod ≥15µm', unit: 'kg',  onHand: 45200, minStock: 10000, price: 96000,   supplier: 'Nhôm Luxanode nhập khẩu', match: ['duplex 230', 'dau me', 'dầu mè', 'luxanode', 'anodized', 'nhôm 121'] },
    { code: 'GIAY-FT80-79109',  name: 'Thanh nhôm hệ chấn song + phào',       spec: 'Cây 5,8m',             unit: 'kg',   onHand: 3800,  minStock: 8000,  price: 71000,   supplier: 'Đùn ép Nhôm Đông Anh',   match: ['fort 80', 'dau gao', 'dầu gạo', 'chan song', 'chấn song', 'phao', 'phào'] },
    { code: 'GIAY-BT350-7090',  name: 'Kính hộp 5-9-5 cường lực',             spec: 'tấm 1,2×2,4m',         unit: 'm²',   onHand: 28600, minStock: 15000, price: 385000,  supplier: 'Kính Việt Nhật Hải Long', match: ['bristol 350', 'chai pet 1l', 'chai 1l', 'kinh hop', 'kính hộp', 'kinh 5-9-5'] },
    { code: 'GIAY-DC400-7090',  name: 'Kính cường lực 8mm',                   spec: 'tấm 1,2×2,4m',         unit: 'm²',   onHand: 15400, minStock: 10000, price: 295000,  supplier: 'Kính Việt Nhật Hải Long', match: ['duplex 400', 'can 5l', 'can nhua', 'can nhựa', 'kinh cuong luc', 'kính cường lực', 'kinh 8mm'] },
    { code: 'KEM-CTP-525',      name: 'Bộ bản lề thuỷ lực sàn (Đức)',         spec: 'tải 150kg/cánh',       unit: 'bộ',   onHand: 48,    minStock: 40,    price: 4850000, supplier: 'Phụ kiện Kinlong VN',    match: ['kẽm ctp', 'ban kem', 'bản kẽm', 'kem ctp', 'ctp', 'khuon chai', 'khuôn chai', 'ban le thuy luc', 'bản lề thuỷ lực', 'ban le', 'bản lề'] },
    { code: 'MUC-CMYK',         name: 'Bộ khoá & tay nắm cao cấp',            spec: 'khoá vân tay + tay gạt', unit: 'bộ', onHand: 142,   minStock: 30,    price: 3200000, supplier: 'Phụ kiện Kinlong VN',    match: ['muc in', 'mực in', 'muc', 'mực', 'phu gia', 'phụ gia', 'khoa', 'khóa', 'tay nam', 'tay nắm', 'phu kien', 'phụ kiện'] },
    { code: 'DECAL-GIAY',       name: 'Gioăng EPDM',                          spec: 'cuộn 100m',            unit: 'm',    onHand: 1200,  minStock: 300,   price: 9500,    supplier: 'Phụ kiện Kinlong VN',    match: ['decal giay', 'decal giấy', 'nhan chai', 'nhãn chai', 'gioang', 'gioăng', 'epdm'] },
    { code: 'DECAL-PP',         name: 'Keo silicon trung tính',               spec: 'tuýp 300ml',           unit: 'tuýp', onHand: 180,   minStock: 250,   price: 62000,   supplier: 'Hoá chất Xây dựng Việt', match: ['decal pp', 'pp (nhua)', 'pp (nhựa)', 'decal nhua', 'nhan pp', 'nhãn pp', 'silicon', 'keo silicon'] },
    { code: 'DECAL-TRONG',      name: 'Màng bảo vệ bề mặt nhôm',              spec: 'cuộn 1m×200m',         unit: 'm²',   onHand: 90,    minStock: 120,   price: 15000,   supplier: 'Bao bì Phú Mỹ',          match: ['decal trong', 'mang co', 'màng co', 'mang bao ve', 'màng bảo vệ', 'mang pe'] },
    { code: 'CAN-BONG',         name: 'Xốp + kiện gỗ đóng cửa',               spec: 'bộ/1 bộ cửa',          unit: 'bộ',   onHand: 800,   minStock: 200,   price: 145000,  supplier: 'Bao bì Phú Mỹ',          match: ['can bong', 'cán bóng', 'cán màng', 'can mang', 'thung carton', 'thùng carton', 'xop', 'xốp', 'kien go', 'kiện gỗ', 'dong kien', 'đóng kiện'] },
    { code: 'BAN-FLEXO',        name: 'Ke góc & vít inox (bộ)',               spec: 'bộ/1 cánh',            unit: 'bộ',   onHand: 60,    minStock: 30,    price: 185000,  supplier: 'Phụ kiện Kinlong VN',    match: ['ban in flexo', 'bản in flexo', 'flexo', 'dat tay mau', 'đất tẩy màu', 'ke goc', 'ke góc', 'vit inox', 'vít inox', 'khuon ep goc', 'khuôn ép góc', 'dao phay'] }
  ];

  // Bỏ dấu tiếng Việt + thường hoá để so khớp
  function norm(s) {
    return String(s == null ? '' : s)
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Map tên vật tư trong BOM → 1 mã trong danh mục (null nếu không khớp)
  function matchMaterial(bomName) {
    var n = norm(bomName);
    for (var i = 0; i < MATERIALS.length; i++) {
      var m = MATERIALS[i];
      for (var j = 0; j < m.match.length; j++) {
        if (n.indexOf(norm(m.match[j])) >= 0) return m;
      }
    }
    return null;
  }

  // Lấy số đầu tiên trong chuỗi định mức.
  //  "2.820 m² (chạy thử căn máy 340 + 2%)" -> 2820   (dấu . là phân tách nghìn)
  //  "0.68 kg" -> 0.68                          (dấu . là thập phân)
  //  "12,5 m²" -> 12.5
  function parseQty(str) {
    var s = String(str == null ? '' : str).trim();
    var m = s.match(/-?\d[\d.,]*/);
    if (!m) return 0;
    var tok = m[0];
    // Có dấu phẩy → phẩy là thập phân, chấm là nghìn
    if (tok.indexOf(',') >= 0) {
      return parseFloat(tok.replace(/\./g, '').replace(',', '.')) || 0;
    }
    // Chỉ có dấu chấm: nếu là nhóm 3 chữ số → phân tách nghìn; còn lại → thập phân
    if (tok.indexOf('.') >= 0) {
      if (/^\d{1,3}(\.\d{3})+$/.test(tok)) return parseInt(tok.replace(/\./g, ''), 10) || 0;
      return parseFloat(tok) || 0;
    }
    return parseInt(tok, 10) || 0;
  }

  function getMaterial(code) {
    return MATERIALS.filter(function (m) { return m.code === code; })[0] || null;
  }

  var ACTIVE = ['chờ SX', 'đang SX'];
  function activeLSX() {
    if (!global.QuoteStore || !global.QuoteStore.allLSX) return [];
    return global.QuoteStore.allLSX().filter(function (l) { return ACTIVE.indexOf(l.status) >= 0; });
  }

  // Đối chiếu BOM của 1 LSX với tồn kho
  function demandForLSX(lsx) {
    if (!lsx || !lsx.bom) return [];
    return lsx.bom.map(function (it) {
      var m = matchMaterial(it.name);
      var demand = Math.ceil(parseQty(it.qty));
      var onHand = m ? m.onHand : null;
      var shortage = m ? Math.max(0, demand - onHand) : null;
      return {
        name: it.name, spec: it.spec || (m ? m.spec : ''), qtyText: it.qty,
        matched: !!m, code: m ? m.code : '', unit: m ? m.unit : '',
        demand: demand, onHand: onHand, shortage: shortage,
        price: m ? m.price : 0, supplier: m ? m.supplier : '',
        enough: m ? demand <= onHand : null
      };
    });
  }

  // Giá trị NVL ước tính (theo đơn giá kho) cho 1 LSX — phục vụ bút toán xuất kho
  function nvlValueOfLSX(lsx) {
    return demandForLSX(lsx).reduce(function (sum, r) {
      return sum + (r.matched ? r.demand * r.price : 0);
    }, 0);
  }

  // Gộp nhu cầu NVL của TẤT CẢ LSX đang chạy → đề xuất mua phần thiếu
  function suggestFromLSX() {
    var map = {};
    activeLSX().forEach(function (L) {
      (L.bom || []).forEach(function (it) {
        var m = matchMaterial(it.name);
        if (!m) return;
        var q = Math.ceil(parseQty(it.qty));
        var a = map[m.code] || (map[m.code] = { mat: m, demand: 0, lsxIds: [] });
        a.demand += q;
        if (a.lsxIds.indexOf(L.id) < 0) a.lsxIds.push(L.id);
      });
    });
    return Object.keys(map).map(function (code) {
      var a = map[code], m = a.mat;
      var demand = a.demand;
      var shortage = Math.max(0, demand - m.onHand);
      // Đề nghị mua: bù đủ nhu cầu + khôi phục tồn tối thiểu
      var suggestQty = shortage > 0 ? (shortage + m.minStock) : 0;
      return {
        code: code, name: m.name, spec: m.spec, unit: m.unit, supplier: m.supplier, price: m.price,
        demand: demand, onHand: m.onHand, minStock: m.minStock, shortage: shortage,
        suggestQty: suggestQty, estCost: suggestQty * m.price, lsxIds: a.lsxIds
      };
    }).sort(function (x, y) { return y.shortage - x.shortage; });
  }

  // Trạng thái vật tư của 1 LSX — cho cổng "chờ vật tư" & điều độ
  function materialStatus(lsx) {
    var lines = demandForLSX(lsx);
    var matched = lines.filter(function (r) { return r.matched; });
    var shortages = matched.filter(function (r) { return !r.enough; });
    return {
      ready: shortages.length === 0,
      lines: lines,
      shortages: shortages,
      shortageCount: shortages.length,
      matchedCount: matched.length
    };
  }

  // Tải máy: gộp LSX đang chạy theo máy (machineIn || machine)
  function machineLoad() {
    var map = {};
    activeLSX().forEach(function (L) {
      var m = (L.machineIn || L.machine || '—').trim();
      var a = map[m] || (map[m] = { machine: m, count: 0, qty: 0, ids: [] });
      a.count += 1; a.qty += (L.qty || 0); a.ids.push(L.id);
    });
    return Object.keys(map).map(function (k) { return map[k]; }).sort(function (x, y) { return y.count - x.count; });
  }

  // Tổng hợp nhanh cho banner/KPI
  function summary() {
    var rows = suggestFromLSX();
    var short = rows.filter(function (r) { return r.shortage > 0; });
    return {
      materials: rows.length,
      shortageCount: short.length,
      totalEstCost: short.reduce(function (s, r) { return s + r.estCost; }, 0),
      lsxCount: activeLSX().length,
      rows: rows, shortageRows: short
    };
  }

  global.StockStore = {
    MATERIALS: MATERIALS,
    norm: norm, parseQty: parseQty, matchMaterial: matchMaterial, getMaterial: getMaterial,
    activeLSX: activeLSX, demandForLSX: demandForLSX, nvlValueOfLSX: nvlValueOfLSX,
    materialStatus: materialStatus, machineLoad: machineLoad,
    suggestFromLSX: suggestFromLSX, summary: summary
  };
})(typeof window !== 'undefined' ? window : this);
