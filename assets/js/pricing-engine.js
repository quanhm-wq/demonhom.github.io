/* ============================================================
   PricingEngine — nguồn sự thật DUY NHẤT cho GIÁ VỐN sản xuất cửa nhôm.
   Hỗ trợ NHIỀU LOẠI SẢN PHẨM qua registry PricingEngine.types:
     • offsetBox  — cửa thuỷ lực theo bộ: định mức nhôm, quy cách bộ cửa, khuôn ép góc, công gia công/lượt
     • labelRoll  — cửa trượt quay / cửa sổ hệ: m² cửa, khuôn ép góc / dao phay, máy m/phút, công đoạn

   Nguyên tắc rạch ròi:
   - Engine CHỈ tính giá vốn + sản lượng. KHÔNG markup/VAT (đó là lớp thương mại của Báo giá).
   - Mọi loại đều trả về cùng cấu trúc { items[], costTotal, costPerUnit, ... } để Báo giá tiêu thụ.
   ============================================================ */
(function (global) {
  'use strict';

  var VAT_RATE = 0.08;

  function fmt(n) { return Math.round(n).toLocaleString('vi-VN'); }
  function parseSize(s) {
    if (typeof s !== 'string') return [];
    return s.split(/[×x*]/i).map(function (x) { return parseFloat(x.trim()) || 0; });
  }

  // LỚP THƯƠNG MẠI (thuộc Báo giá) — tách riêng khỏi giá vốn.
  function applyMarkup(costTotal, markupPct, vatRate) {
    var rate = (typeof vatRate === 'number') ? vatRate : VAT_RATE;
    var profit = costTotal * (markupPct / 100);
    var netTotal = costTotal + profit;
    var vat = netTotal * rate;
    return { profit: profit, netTotal: netTotal, vat: vat, vatRate: rate, grandTotal: netTotal + vat };
  }

  /* ---- Đơn giá nhân công & công đoạn dùng chung (THAM SỐ cấu hình, không hardcode cứng) ---- */
  var LABOR_PER_MIN   = 1667;     // đ/phút thợ vận hành máy nhôm (~100.000đ/giờ)
  var DIECUT_SETUP    = 300000;   // đ/lần cài đặt máy ép góc (cố định)
  var DIECUT_PER_MIN  = 1333;     // đ/phút thợ ép góc (~80.000đ/giờ)
  var DIECUT_SPEED    = 80;       // đơn vị/phút khi ép góc (ước công ép góc)
  var AUX_MAT_PCT     = 0.02;     // vật tư phụ (gioăng, keo silicon, vít) ~2% NVL chính
  var INK_ROLL_M2COLOR = 200;     // đ/m²/cánh — phụ kiện (cửa trượt quay)

  // 1 dòng nhân công theo phút máy
  function laborLine(key, name, meta, minutes, perMin) {
    var min = Math.max(0, minutes || 0), rate = perMin || LABOR_PER_MIN;
    return { key: key, group: 'Công', name: name, meta: meta || '', norm: min.toFixed(1) + ' phút', unitLbl: fmt(rate) + '₫/phút', total: Math.round(min * rate) };
  }
  // 2 dòng cho công đoạn ép góc (cài đặt máy + nhân công) — dùng chung mọi công nghệ
  function dieCutLines(qty) {
    var min = Math.max(1, qty || 0) / DIECUT_SPEED;
    return [
      { key: 'be-setup', group: 'Gia công', name: 'Công ép góc', meta: 'Cài đặt máy, căn khuôn ép góc (cố định)', norm: '1 lần', unitLbl: fmt(DIECUT_SETUP) + '₫', total: DIECUT_SETUP },
      { key: 'be-nc', group: 'Gia công', name: 'Công ép góc', meta: 'Nhân công vận hành máy ép góc WEIKE', norm: min.toFixed(1) + ' phút', unitLbl: fmt(DIECUT_PER_MIN) + '₫/phút', total: Math.round(min * DIECUT_PER_MIN) }
    ];
  }

  /* ============================================================
     LOẠI 1 — OFFSET (cửa thuỷ lực theo bộ)
     ============================================================ */
  var OFFSET = {
    RATES: {
      plate: 85000,              // đ/bộ khuôn ép góc · dao phay
      inkPerKg: 320000,          // đ/bộ phụ kiện (bản lề/khoá)
      inkPerColorImp: 0.00006,   // bộ phụ kiện / lượt-cánh (mỗi cánh lắp 1 lượt)
      iph: 5000,                 // lượt-m² / giờ máy
      makereadyBase: 100,        // m² chạy thử căn máy cố định (nền)
      makereadyPerColor: 60,     // + m² chạy thử căn máy mỗi cánh (hiệu chỉnh dao/khuôn)
      runningWaste: 0.02,        // hao hụt cắt nhôm (đầu mẩu) khi chạy (2%)
      setupPerColor: 120000      // công cài đặt máy CỐ ĐỊNH/cánh (lắp khuôn ép góc + lập trình CNC)
    },
    PAPER: { 'Nhôm hệ thuỷ lực 120': 4500, 'Nhôm hệ thuỷ lực 180': 3800, 'Nhôm hệ trượt quay 93': 2900, 'Nhôm Luxanode 121': 5200 },
    // units = số đầu dao của máy → quyết định số mẻ chạy
    MACHINE: { 'CAT-01 · 4 đầu dao': { rate: 450, units: 4 }, 'CAT-02 · 5 đầu dao': { rate: 520, units: 5 }, 'CNC-03 · phay khoá': { rate: 380, units: 4 } },
    FINISH_DEFS: {
      canMang: { rate: 3500,   name: 'Công cắt-phay CNC', unit: 'm²',        mode: 'area'  },
      beKhuon: { rate: 500000, name: 'Công ép góc',       unit: 'lần khuôn', mode: 'fixed' },
      danHop:  { rate: 200,    name: 'Công lắp kính',     unit: 'cánh',      mode: 'unit'  },
      epKim:   { rate: 800,    name: 'Công hoàn thiện',   unit: 'cánh',      mode: 'unit'  },
      uvCucBo: { rate: 600,    name: 'Công uốn vòm',      unit: 'm²',        mode: 'area'  },
      dapNoi:  { rate: 450,    name: 'Đóng kiện',         unit: 'cánh',      mode: 'unit'  }
    }
  };

  function offsetDefaultState() {
    return {
      productType: 'offset',
      quantity: 10000,
      finishedW: 20, finishedH: 30, finishedD: 5,
      spreadW: 42, spreadH: 58,
      sheetW: 65, sheetH: 86,
      ke: 8,
      paperName: 'Nhôm hệ thuỷ lực 120', paperRate: 4500,
      colors: 4, plates: 4, sides: 1, signatures: 1,
      machineName: 'CAT-01 · 4 đầu dao', machineRate: 450, pressUnits: 4,
      finishes: {
        canMang: { on: true,  rate: 3500,   name: 'Công cắt-phay CNC', unit: 'm²',        mode: 'area'  },
        beKhuon: { on: true,  rate: 500000, name: 'Công ép góc',       unit: 'lần khuôn', mode: 'fixed' },
        danHop:  { on: true,  rate: 200,    name: 'Công lắp kính',     unit: 'cánh',      mode: 'unit'  },
        epKim:   { on: false, rate: 800,    name: 'Công hoàn thiện',   unit: 'cánh',      mode: 'unit'  },
        uvCucBo: { on: false, rate: 600,    name: 'Công uốn vòm',      unit: 'm²',        mode: 'area'  },
        dapNoi:  { on: false, rate: 450,    name: 'Đóng kiện',         unit: 'cánh',      mode: 'unit'  }
      }
    };
  }

  function offsetCalcCost(state) {
    var s = state, R = OFFSET.RATES;
    var sheets = Math.ceil(s.quantity / Math.max(1, s.ke));      // m² thành phẩm cần
    var pressUnits = s.pressUnits || 4;
    var passes = Math.max(1, Math.ceil(s.colors / pressUnits));   // mẻ chạy: máy 4 đầu dao / 4 cánh = 1 lượt
    // Số khuôn ép góc = số cánh × số mặt × số bộ (s.plates nhập tay sẽ đè — sẽ bỏ ô nhập tay ở bước smart-input)
    var plates = (s.plates != null) ? s.plates : s.colors * (s.sides || 1) * (s.signatures || 1);

    // hao = chạy thử căn máy cố định (theo cánh) + % hao cắt nhôm (đầu mẩu)
    var makeready = R.makereadyBase + R.makereadyPerColor * s.colors;
    var running = Math.round(sheets * R.runningWaste);
    var waste = makeready + running;
    var totalSheets = sheets + waste;

    var pressImp = totalSheets * passes;                          // lượt-m² qua máy (cho thời gian & công gia công)
    var colorImp = totalSheets * s.colors;                       // lượt-cánh (cho phụ kiện — mỗi cánh lắp 1 bộ)
    var inkKg = +(colorImp * R.inkPerColorImp).toFixed(2);
    var finishArea = +((s.quantity * s.spreadW * s.spreadH) / 10000).toFixed(1);
    var printHours = (pressImp / R.iph).toFixed(1);
    var setupCost = s.colors * R.setupPerColor;
    var printMin = pressImp / R.iph * 60;                          // phút chạy máy
    var auxCost = Math.round((totalSheets * s.paperRate) * AUX_MAT_PCT);

    var items = [
      { key: 'giay', group: 'Vật tư', name: 'Nhôm thanh · ' + s.paperName, meta: s.sheetW + '×' + s.sheetH + 'cm', norm: fmt(totalSheets) + ' m² (chạy thử căn máy ' + makeready + ' + hao cắt 2%)', unitLbl: fmt(s.paperRate) + '₫/m²', total: totalSheets * s.paperRate },
      { key: 'muc', group: 'Vật tư', name: 'Phụ kiện (bản lề/khoá) · ' + s.colors + ' cánh', meta: 'Theo định mức bộ cửa', norm: inkKg + ' bộ', unitLbl: fmt(R.inkPerKg) + '₫/bộ', total: inkKg * R.inkPerKg },
      { key: 'vtphu', group: 'Vật tư', name: 'Gioăng & silicon', meta: 'Gioăng EPDM, keo silicon, vít inox (~' + Math.round(AUX_MAT_PCT * 100) + '%)', norm: 'khoán', unitLbl: Math.round(AUX_MAT_PCT * 100) + '% NVL chính', total: auxCost },
      { key: 'kem', group: 'Vật tư khác', name: 'Khuôn ép góc / dao phay', meta: s.colors + ' cánh × ' + (s.sides || 1) + ' mặt' + ((s.signatures || 1) > 1 ? ' × ' + s.signatures + ' bộ' : ''), norm: plates + ' bộ', unitLbl: fmt(R.plate) + '₫/bộ', total: plates * R.plate },
      { key: 'lenmayin', group: 'Công', name: 'Chi phí cài đặt máy, lập trình CNC', meta: 'Lắp khuôn ép góc + lập trình CNC (cố định) · ' + makeready + ' m² chạy thử căn máy', norm: s.colors + ' cánh', unitLbl: fmt(R.setupPerColor) + '₫/cánh', total: setupCost },
      { key: 'chaymayin', group: 'Công', name: 'Chi phí vận hành máy (' + s.machineName + ')', meta: passes + ' mẻ chạy · ~' + printHours + 'h máy', norm: fmt(pressImp) + ' lượt-m²', unitLbl: fmt(s.machineRate) + '₫/lượt', total: pressImp * s.machineRate },
      laborLine('nc-in', 'Nhân công vận hành', 'Vận hành máy cắt – phay CNC', printMin)
    ];

    Object.keys(s.finishes).forEach(function (key) {
      var f = s.finishes[key]; if (!f.on) return;
      var mode = f.mode || 'unit', norm, total, unitLbl;
      if (mode === 'fixed') { norm = '1 lần làm khuôn'; unitLbl = fmt(f.rate) + '₫/' + (f.unit || 'lần'); total = f.rate; }
      else if (mode === 'area') { norm = finishArea + ' m²'; unitLbl = fmt(f.rate) + '₫/m²'; total = finishArea * f.rate; }
      else { norm = fmt(s.quantity) + ' ' + (f.unit || 'cánh'); unitLbl = fmt(f.rate) + '₫/' + (f.unit || 'cánh'); total = s.quantity * f.rate; }
      var isDie = (key === 'beKhuon');
      items.push({ key: key, group: isDie ? 'Vật tư khác' : 'Gia công', name: isDie ? 'Khuôn ép góc / dao phay' : f.name, meta: '', norm: norm, unitLbl: unitLbl, total: total });
      if (isDie) dieCutLines(s.quantity).forEach(function (x) { items.push(x); });
    });

    var costTotal = items.reduce(function (a, it) { return a + it.total; }, 0);
    return {
      items: items, costTotal: costTotal, costPerUnit: costTotal / Math.max(1, s.quantity),
      sheets: sheets, waste: waste, totalSheets: totalSheets, impressions: pressImp, passes: passes,
      makeready: makeready, setupCost: setupCost, inkKg: inkKg, finishArea: finishArea, printHours: printHours
    };
  }

  /* ============================================================
     CỬA TRƯỢT QUAY / CỬA SỔ HỆ — dùng chung cho cửa trượt quay (flexo) & cửa sổ mở quay (digital)
     Khác nhau: cửa sổ mở quay bỏ khuôn ép góc, công tính theo m²/mét dài, hao thấp hơn.
     Đơn giá mock hợp lý — chỉnh trong block LABEL.
     ============================================================ */
  var LABEL = {
    DECAL: { 'Kính cường lực 8mm': 7000, 'Kính hộp 5-9-5': 12000, 'Kính dán an toàn 6.38': 15000, 'Kính Low-E hộp': 18000 }, // đ/m²
    COAT:  { 'Không bổ sung': 0, 'Gioăng EPDM': 2000, 'Keo silicon trung tính': 2500, 'Phim cách nhiệt': 3500 },      // đ/m²
    FLEXO_MACHINE:  { 'Máy cắt nhôm 2 đầu CAT-01': { speed: 20, rate: 5000 }, 'Máy cắt nhôm 2 đầu CAT-02': { speed: 40, rate: 7000 } }, // rate đ/phút
    DIGITAL_PRESS:  { 'Máy phay khoá CNC-03': { speed: 25, click: 38000 }, 'Máy phay đố CNC-21': { speed: 30, click: 44000 }, 'Máy phay đố CNC-22': { speed: 20, click: 34000 } }, // click đ/m² (gia công CNC)
    GAP: 3,                 // mm khe hở lắp ghép giữa các cánh
    DIE_RATE: 350000,       // đ/khuôn ép góc · dao phay (một lần)
    // FLEXO: setup cao — lắp khuôn ép góc, lập trình CNC, hao nhôm đầu mẻ
    FLEXO:   { setupWasteM: 80, running: 0.03, plateRate: 500000, setupBase: 200000, setupPerColor: 60000 },
    // Cửa sổ mở quay: gần như không setup — chỉ phí lập trình CNC nhỏ, hao rất thấp
    DIGITAL: { setupWasteM: 5,  running: 0.02, ripFee: 150000 },
    FINISH_DEFS: {
      be:     { rate: 1200, name: 'Công ép góc',      unit: 'm²',         mode: 'area' },
      epNhu:  { rate: 2800, name: 'Công lắp kính',    unit: 'm²',         mode: 'area' },
      canCuon:{ rate: 2000, name: 'Công hoàn thiện',  unit: 'm²',         mode: 'area' },
      rangCua:{ rate: 700,  name: 'Đóng kiện',        unit: '1000 cánh',  mode: 'kilo' }
    }
  };
  function rollCfg(s) { return s.productType === 'digital' ? LABEL.DIGITAL : LABEL.FLEXO; }

  function rollFinishes(allOn) {
    return {
      be:      { on: true,  rate: 1200, name: 'Công ép góc',     unit: 'm²',        mode: 'area' },
      epNhu:   { on: false, rate: 2800, name: 'Công lắp kính',   unit: 'm²',        mode: 'area' },
      canCuon: { on: false, rate: 2000, name: 'Công hoàn thiện', unit: 'm²',        mode: 'area' },
      rangCua: { on: false, rate: 700,  name: 'Đóng kiện',       unit: '1000 cánh', mode: 'kilo' }
    };
  }

  function flexoDefaultState() {
    return {
      productType: 'flexo',
      quantity: 10000, colors: 4,
      labelL: 40, labelW: 30, nL: 1, nW: 1, repeatMM: 0,
      decalName: 'Kính cường lực 8mm', decalRate: 7000,
      coatName: 'Không bổ sung', coatRate: 0,
      newDie: true, dieQty: 1,
      newPlate: true, plateQty: 4,
      machineName: 'Máy cắt nhôm 2 đầu CAT-01', machineSpeed: 20, machineRate: 5000,
      finishes: rollFinishes()
    };
  }

  function digitalDefaultState() {
    return {
      productType: 'digital',
      quantity: 3000, colors: 4,
      labelL: 40, labelW: 30, nL: 1, nW: 1, repeatMM: 0, printSides: 1,
      decalName: 'Kính cường lực 8mm', decalRate: 7000,
      coatName: 'Không bổ sung', coatRate: 0,
      newDie: false, dieQty: 1,        // Cửa sổ mở quay: khuôn ép góc tuỳ chọn, mặc định không
      newPlate: false, plateQty: 0,    // Cửa sổ mở quay: KHÔNG cần dao phay riêng
      machineName: 'Máy phay khoá CNC-03', machineSpeed: 25, clickRate: 38000,
      finishes: rollFinishes()
    };
  }

  // Sản lượng cửa: dàn theo số cánh ngang (across = nW), chạy dài theo cây nhôm.
  // Hao = mét cài đặt CỐ ĐỊNH (đầu cây, căn máy) + % hao cắt nhôm (đầu mẩu).
  function rollMetrics(s) {
    var gap = LABEL.GAP, cfg = rollCfg(s);
    var across = Math.max(1, s.nW);
    // bước lặp theo chiều chạy: ưu tiên repeatMM (bước đố) nếu khai báo, không thì = khổ cánh + khe hở
    var effL = (s.repeatMM && s.repeatMM > 0) ? s.repeatMM : (s.labelL + gap);
    var effW = s.labelW + gap;          // mm
    var prodRunM = (Math.ceil(s.quantity / across) * effL) / 1000;        // mét dài cánh thành phẩm
    var runM = +((prodRunM + cfg.setupWasteM) * (1 + cfg.running)).toFixed(1); // tổng mét chạy (gồm hao)
    var webM = (across * effW) / 1000;                           // bề rộng cánh dùng (m)
    var area = +(webM * runM).toFixed(1);                        // m² cửa tiêu hao
    var timeMin = +(runM / Math.max(1, s.machineSpeed)).toFixed(1);
    var frames = Math.ceil(s.quantity / Math.max(1, s.nL * s.nW));
    return { across: across, runM: runM, prodRunM: +prodRunM.toFixed(1), webMM: across * effW, area: area, timeMin: timeMin, frames: frames, setupWasteM: cfg.setupWasteM, running: cfg.running };
  }

  // Các hạng mục chung (kính, gioăng/keo, khuôn, công đoạn) — gia công khác nhau giữa flexo/digital
  function rollCommonItems(s, m) {
    var items = [];
    items.push({ key: 'decal', group: 'Vật tư', name: 'Kính ' + s.decalName.replace(/^(Decal|Nhãn|Kính)\s*/i, ''), meta: 'Bề rộng cánh ~' + Math.round(m.webMM) + 'mm · hao cắt nhôm (đầu mẩu) ' + m.setupWasteM + 'm + ' + Math.round(m.running * 100) + '%', norm: m.area + ' m²', unitLbl: fmt(s.decalRate) + '₫/m²', total: m.area * s.decalRate });
    if (s.coatRate > 0)
      items.push({ key: 'coat', group: 'Vật tư', name: 'Gioăng & silicon · ' + s.coatName, meta: 'Gioăng/keo theo m² cửa', norm: m.area + ' m²', unitLbl: fmt(s.coatRate) + '₫/m²', total: m.area * s.coatRate });
    if (s.newDie)
      items.push({ key: 'die', group: 'Vật tư khác', name: 'Khuôn ép góc / dao phay (mới)', meta: '', norm: s.dieQty + ' khuôn', unitLbl: fmt(LABEL.DIE_RATE) + '₫/khuôn', total: s.dieQty * LABEL.DIE_RATE });
    return items;
  }
  function rollFinishItems(s, m) {
    var items = [];
    Object.keys(s.finishes).forEach(function (key) {
      var f = s.finishes[key]; if (!f.on) return;
      var mode = f.mode || 'area', norm, total, unitLbl;
      if (mode === 'kilo') { norm = (s.quantity / 1000).toFixed(1) + ' ×1000 cánh'; unitLbl = fmt(f.rate) + '₫/1000'; total = (s.quantity / 1000) * f.rate; }
      else { norm = m.area + ' m²'; unitLbl = fmt(f.rate) + '₫/m²'; total = m.area * f.rate; }
      items.push({ key: key, group: 'Gia công', name: f.name, meta: '', norm: norm, unitLbl: unitLbl, total: total });
      if (key === 'be') dieCutLines(s.quantity).forEach(function (x) { items.push(x); });
    });
    return items;
  }
  function rollResult(s, m, items) {
    var costTotal = items.reduce(function (a, it) { return a + it.total; }, 0);
    return { items: items, costTotal: costTotal, costPerUnit: costTotal / Math.max(1, s.quantity), area: m.area, runM: m.runM, timeMin: m.timeMin, across: m.across, frames: m.frames, webMM: m.webMM };
  }

  function flexoCalcCost(state) {
    var s = state, m = rollMetrics(s), F = LABEL.FLEXO;
    var items = rollCommonItems(s, m);
    // Phụ kiện cửa trượt quay — theo m² × số cánh
    items.push({ key: 'muc', group: 'Vật tư', name: 'Phụ kiện (bản lề/khoá) · ' + s.colors + ' cánh', meta: 'Theo m² × số cánh', norm: m.area + ' m² × ' + s.colors + ' cánh', unitLbl: fmt(INK_ROLL_M2COLOR) + '₫/m²/cánh', total: Math.round(m.area * s.colors * INK_ROLL_M2COLOR) });
    if (s.newPlate)
      items.push({ key: 'plate', group: 'Vật tư khác', name: 'Khuôn ép góc / dao phay', meta: s.colors + ' cánh', norm: s.plateQty + ' bộ', unitLbl: fmt(F.plateRate) + '₫/bộ', total: s.plateQty * F.plateRate });
    // Cài đặt máy CỐ ĐỊNH — lắp khuôn ép góc + lập trình CNC (đây là lý do trượt quay đắt khi SL ít)
    var setup = F.setupBase + F.setupPerColor * s.colors;
    items.push({ key: 'lenmayin', group: 'Công', name: 'Chi phí cài đặt máy, lập trình CNC', meta: 'Lắp khuôn ép góc + lập trình CNC (cố định) · ~' + m.setupWasteM + 'm hao cắt nhôm (đầu mẩu)', norm: s.colors + ' cánh', unitLbl: fmt(F.setupPerColor) + '₫/cánh', total: setup });
    items.push({ key: 'chaymayin', group: 'Công', name: 'Chi phí vận hành máy (' + s.machineName + ')', meta: Math.round(m.runM) + ' m · ' + s.machineSpeed + ' m/phút', norm: '~' + m.timeMin + ' phút', unitLbl: fmt(s.machineRate) + '₫/phút', total: m.timeMin * s.machineRate });
    items.push(laborLine('nc-in', 'Nhân công vận hành', 'Vận hành máy cắt – phay CNC', m.timeMin));
    items = items.concat(rollFinishItems(s, m));
    return rollResult(s, m, items);
  }

  function digitalCalcCost(state) {
    var s = state, m = rollMetrics(s), D = LABEL.DIGITAL;
    var items = rollCommonItems(s, m);
    var dSides = s.printSides || 1;
    // Cửa sổ mở quay gần như KHÔNG setup — chỉ phí lập trình CNC nhỏ (đây là lý do rẻ khi SL ít)
    items.push({ key: 'lenmayin', group: 'Công', name: 'Chi phí cài đặt máy, lập trình CNC', meta: 'Không cần khuôn ép góc · setup gần như 0', norm: '1 lần', unitLbl: fmt(D.ripFee) + '₫', total: D.ripFee });
    // Chạy máy phay CNC theo m²/mét dài (gồm phụ kiện + máy); nhân số mặt gia công
    items.push({ key: 'chaymayin', group: 'Công', name: 'Chi phí vận hành máy (' + s.machineName + ')', meta: 'Tính theo m²/mét dài (gồm phụ kiện)' + (dSides > 1 ? ' · ' + dSides + ' mặt' : ''), norm: m.area + ' m²' + (dSides > 1 ? ' × ' + dSides : ''), unitLbl: fmt(s.clickRate) + '₫/m²', total: m.area * s.clickRate * dSides });
    items.push(laborLine('nc-in', 'Nhân công vận hành', 'Vận hành máy phay CNC', m.timeMin));
    items = items.concat(rollFinishItems(s, m));
    return rollResult(s, m, items);
  }

  // ---- Viz cửa: dải nhôm với lưới cánh cửa (across = nW) ----
  function renderRollViz(state, svg) {
    if (!svg) return { grid: [state.nW, state.nL], efficiency: 100 };
    var s = state, m = rollMetrics(s);
    var across = Math.min(m.across, 8);     // giới hạn vẽ
    var rows = 5;                            // số hàng minh hoạ
    var pad = 16, labelGap = 4;
    var vbW = 360, vbH = 300;
    var areaW = vbW - pad * 2, areaH = vbH - pad * 2 - 24;
    var cw = areaW / across, ch = areaH / rows;
    var html = '';
    // mép cây nhôm (web edges)
    html += '<rect x="' + pad + '" y="' + (pad + 24) + '" width="' + areaW + '" height="' + areaH + '" fill="#fbfaf5" stroke="#14130f" stroke-width="0.8"/>';
    // lỗ khoan định vị 2 mép
    for (var yy = pad + 24 + 6; yy < pad + 24 + areaH; yy += 12) {
      html += '<circle cx="' + (pad - 4) + '" cy="' + yy + '" r="2" fill="#cfc9ba"/>';
      html += '<circle cx="' + (pad + areaW + 4) + '" cy="' + yy + '" r="2" fill="#cfc9ba"/>';
    }
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < across; c++) {
        var x = pad + c * cw + labelGap, y = pad + 24 + r * ch + labelGap;
        var w = cw - labelGap * 2, h = ch - labelGap * 2;
        var rx = Math.min(10, w / 4);
        html += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + rx + '" fill="#c5400a" fill-opacity="0.14" stroke="#c5400a" stroke-width="1"/>';
        if (r === 0 && c === 0)
          html += '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 4) + '" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10" fill="#8a2d07" font-weight="700">' + s.labelL + '×' + s.labelW + '</text>';
      }
    }
    // chú thích bề rộng cánh + chiều chạy
    html += '<text x="' + pad + '" y="' + (pad + 12) + '" font-family="JetBrains Mono, monospace" font-size="10" fill="#6b665b" letter-spacing="0.6" font-weight="500">BỀ RỘNG ~' + Math.round(m.webMM) + 'MM · ' + m.across + ' CÁNH NGANG</text>';
    html += '<text x="' + (vbW - pad) + '" y="' + (pad + 12) + '" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="10" fill="#6b665b" letter-spacing="0.6" font-weight="500">↓ ' + Math.round(m.runM) + 'M CHẠY</text>';
    svg.innerHTML = '<svg viewBox="0 0 ' + vbW + ' ' + vbH + '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">' + html + '</svg>';
    return { grid: [s.nW, s.nL], efficiency: 100 };
  }

  /* ============================================================
     Sơ đồ dàn cắt cây nhôm (proof-sheet) — key offset — dùng cho renderViz loại offset
     ============================================================ */
  function renderProofSheet(state, svg) {
    if (!svg) return { grid: [1, 1], efficiency: 100 };
    var s = state;
    var sw = s.sheetW * 10, sh = s.sheetH * 10;
    var outerPad = 26, topAnn = 22, botAnn = 22;
    var vbW = sw + outerPad * 2, vbH = sh + outerPad * 2 + topAnn + botAnn;
    var sx = outerPad, sy = outerPad + topAnn;
    var marginTop = 30, marginLR = 24, gripperH = 80;
    var paX = sx + marginLR, paY = sy + marginTop;
    var paW = sw - marginLR * 2, paH = sh - marginTop - gripperH;

    var prodW = s.finishedW || 20, prodH = s.finishedH || 30;
    var prodAspect = prodW / prodH;
    var bestCols = 1, bestRows = s.ke, bestDiff = Infinity;
    for (var c = 1; c <= s.ke; c++) {
      var rr = Math.ceil(s.ke / c); if (c * rr < s.ke) continue;
      var aspect = (paW / c) / (paH / rr);
      var diff = Math.abs(Math.log(aspect / prodAspect));
      if (diff < bestDiff) { bestDiff = diff; bestCols = c; bestRows = rr; }
    }
    var cellW = paW / bestCols, cellH = paH / bestRows, cellPad = 4, bleed = 4;
    var unitsHtml = '', n = 0;
    for (var r = 0; r < bestRows; r++) {
      for (var cc = 0; cc < bestCols; cc++) {
        if (n >= s.ke) break;
        var x = paX + cc * cellW + cellPad, y = paY + r * cellH + cellPad;
        var w = cellW - cellPad * 2, h = cellH - cellPad * 2;
        unitsHtml += '<rect x="' + (x - bleed) + '" y="' + (y - bleed) + '" width="' + (w + bleed * 2) + '" height="' + (h + bleed * 2) + '" fill="none" stroke="#c5400a" stroke-width="0.6" stroke-dasharray="3,2" opacity="0.55"/>';
        unitsHtml += '<rect class="imp-unit" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#c5400a" fill-opacity="0.16" stroke="#c5400a" stroke-width="1"><title>Đơn vị ' + (n + 1) + '</title></rect>';
        var numSize = Math.min(w, h) > 80 ? 22 : (Math.min(w, h) > 50 ? 16 : 12);
        unitsHtml += '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + numSize / 3) + '" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="' + numSize + '" fill="#8a2d07" font-weight="700" pointer-events="none">' + (n + 1) + '</text>';
        n++;
      }
    }
    var cml = 14, cmg = 5;
    var crops = '<g stroke="#14130f" stroke-width="0.6">' +
      '<line x1="' + sx + '" y1="' + (sy - cmg) + '" x2="' + sx + '" y2="' + (sy - cmg - cml) + '"/>' +
      '<line x1="' + (sx - cmg) + '" y1="' + sy + '" x2="' + (sx - cmg - cml) + '" y2="' + sy + '"/>' +
      '<line x1="' + (sx + sw) + '" y1="' + (sy - cmg) + '" x2="' + (sx + sw) + '" y2="' + (sy - cmg - cml) + '"/>' +
      '<line x1="' + (sx + sw + cmg) + '" y1="' + sy + '" x2="' + (sx + sw + cmg + cml) + '" y2="' + sy + '"/>' +
      '<line x1="' + sx + '" y1="' + (sy + sh + cmg) + '" x2="' + sx + '" y2="' + (sy + sh + cmg + cml) + '"/>' +
      '<line x1="' + (sx - cmg) + '" y1="' + (sy + sh) + '" x2="' + (sx - cmg - cml) + '" y2="' + (sy + sh) + '"/>' +
      '<line x1="' + (sx + sw) + '" y1="' + (sy + sh + cmg) + '" x2="' + (sx + sw) + '" y2="' + (sy + sh + cmg + cml) + '"/>' +
      '<line x1="' + (sx + sw + cmg) + '" y1="' + (sy + sh) + '" x2="' + (sx + sw + cmg + cml) + '" y2="' + (sy + sh) + '"/></g>';
    var cmyk = ['#00B6E9', '#E83E8C', '#FFD000', '#1A1A1A'], spots = ['#c5400a', '#2f5d3a', '#4a5560'];
    var cbSize = 10, cbY = sy + 5, cbCount = s.colors, cbStartX = sx + sw - cbCount * (cbSize + 1) - 5, colorBar = '';
    for (var i = 0; i < cbCount; i++) { var cbX = cbStartX + i * (cbSize + 1); colorBar += '<rect x="' + cbX + '" y="' + cbY + '" width="' + cbSize + '" height="' + cbSize + '" fill="' + (i < 4 ? cmyk[i] : spots[i - 4]) + '" stroke="#14130f" stroke-width="0.3"/>'; }
    var grip = '<rect x="' + sx + '" y="' + (sy + sh - gripperH) + '" width="' + sw + '" height="' + gripperH + '" fill="url(#hatch)"/>' +
      '<text x="' + (sx + sw - 8) + '" y="' + (sy + sh - 7) + '" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="8" fill="rgba(245,241,232,0.75)" letter-spacing="1.5" font-weight="500">VÙNG KẸP · ' + (gripperH / 10) + ' CM</text>';
    var realEff = Math.round((s.ke / (bestCols * bestRows)) * 100);
    var annTL = '<text x="' + sx + '" y="' + (sy - 14) + '" font-family="JetBrains Mono, monospace" font-size="9" fill="#6b665b" letter-spacing="0.8" font-weight="500">' + s.sheetW + ' × ' + s.sheetH + ' CM · ' + s.paperName.toUpperCase() + '</text>';
    var annBR = '<text x="' + (sx + sw) + '" y="' + (sy + sh + 18) + '" text-anchor="end" font-family="JetBrains Mono, monospace" font-size="9" fill="#6b665b" letter-spacing="0.8" font-weight="500">HIỆU SUẤT ' + realEff + '%</text>';
    svg.innerHTML = '<svg viewBox="0 0 ' + vbW + ' ' + vbH + '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">' +
      '<defs><pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)"><rect width="6" height="6" fill="#1f1d18"/><line x1="0" y1="0" x2="0" y2="6" stroke="#2b2820" stroke-width="0.8"/></pattern></defs>' +
      annTL +
      '<rect x="' + sx + '" y="' + sy + '" width="' + sw + '" height="' + sh + '" fill="#fbfaf5" stroke="#14130f" stroke-width="0.7"/>' +
      crops + colorBar +
      '<rect x="' + paX + '" y="' + paY + '" width="' + paW + '" height="' + paH + '" fill="none" stroke="#14130f" stroke-width="0.4" stroke-dasharray="4,3" opacity="0.35"/>' +
      unitsHtml + grip + annBR + '</svg>';
    return { grid: [bestCols, bestRows], efficiency: realEff };
  }

  /* ============================================================
     LOẠI 4 — UỐN VÒM NHÔM (digitalSheet): cửa vòm, ô văng lẻ
     Tính theo lượt uốn × số mặt (1 mặt = 1 lượt) + nhôm + lập trình CNC.
     Không khuôn ép góc → rẻ & nhanh cho số lượng ít.
     ============================================================ */
  var DIGITAL_SHEET = {
    clickRate: 3500,   // đ/lượt uốn (1 mẻ nhỏ, 1 mặt)
    ripFee: 100000,    // đ/lần cài đặt máy, lập trình CNC
    iph: 2400,         // lượt uốn / giờ
    PAPER: { 'Nhôm hệ thuỷ lực 180': 3800, 'Nhôm hệ trượt quay 93': 2900, 'Nhôm Luxanode 121': 5200, 'Nhôm hệ chấn song + phào': 1600 },
    FINISH_DEFS: {
      canMang: { rate: 3500, name: 'Công cắt-phay CNC', unit: 'm²',   mode: 'area' },
      boGoc:   { rate: 120,  name: 'Công hoàn thiện',   unit: 'cánh', mode: 'unit' }
    }
  };
  function digitalSheetDefaultState() {
    return {
      productType: 'digitalSheet', quantity: 200,
      finishedW: 9, finishedH: 5.5, finishedD: 0, spreadW: 9, spreadH: 5.5,
      sheetW: 33, sheetH: 48, ke: 24,
      paperName: 'Nhôm hệ thuỷ lực 180', paperRate: 3800,
      colors: 4, sides: 2, clickRate: 3500,
      finishes: {
        canMang: { on: true,  rate: 3500, name: 'Công cắt-phay CNC', unit: 'm²',   mode: 'area' },
        boGoc:   { on: false, rate: 120,  name: 'Công hoàn thiện',   unit: 'cánh', mode: 'unit' }
      }
    };
  }
  function digitalSheetCalcCost(state) {
    var s = state, D = DIGITAL_SHEET;
    var sheets = Math.ceil(s.quantity / Math.max(1, s.ke));
    var sides = s.sides || 1;
    var clicks = sheets * sides;
    var printMin = clicks / D.iph * 60;                            // phút máy uốn vòm CNC
    var auxCost = Math.round((sheets * s.paperRate) * AUX_MAT_PCT);
    var finishArea = +((s.quantity * s.spreadW * s.spreadH) / 10000).toFixed(1);
    var items = [
      { key: 'giay', group: 'Vật tư', name: 'Nhôm thanh · ' + s.paperName, meta: s.sheetW + '×' + s.sheetH + 'cm · ' + s.ke + ' cánh/cây', norm: fmt(sheets) + ' m²', unitLbl: fmt(s.paperRate) + '₫/m²', total: sheets * s.paperRate },
      { key: 'vtphu', group: 'Vật tư', name: 'Gioăng & silicon', meta: 'Gioăng, keo silicon, vít inox (~' + Math.round(AUX_MAT_PCT * 100) + '%)', norm: 'khoán', unitLbl: Math.round(AUX_MAT_PCT * 100) + '% NVL chính', total: auxCost },
      { key: 'lenmayin', group: 'Công', name: 'Chi phí cài đặt máy, lập trình CNC', meta: 'Uốn vòm mẻ lẻ · không cần khuôn ép góc', norm: '1 lần', unitLbl: fmt(D.ripFee) + '₫', total: D.ripFee },
      { key: 'chaymayin', group: 'Công', name: 'Công uốn vòm', meta: sides + ' mặt × ' + fmt(sheets) + ' lượt (gồm phụ kiện)', norm: fmt(clicks) + ' lượt', unitLbl: fmt(s.clickRate) + '₫/lượt', total: clicks * s.clickRate },
      laborLine('nc-in', 'Nhân công vận hành', 'Vận hành máy uốn vòm CNC', printMin)
    ];
    Object.keys(s.finishes || {}).forEach(function (key) {
      var f = s.finishes[key]; if (!f.on) return;
      var mode = f.mode || 'unit', norm, total, unitLbl;
      if (mode === 'area') { norm = finishArea + ' m²'; unitLbl = fmt(f.rate) + '₫/m²'; total = finishArea * f.rate; }
      else { norm = fmt(s.quantity) + ' ' + (f.unit || 'cánh'); unitLbl = fmt(f.rate) + '₫/' + (f.unit || 'cánh'); total = s.quantity * f.rate; }
      items.push({ key: key, group: 'Gia công', name: f.name, meta: '', norm: norm, unitLbl: unitLbl, total: total });
    });
    var costTotal = items.reduce(function (a, it) { return a + it.total; }, 0);
    var printHours = (clicks / D.iph).toFixed(1);
    return { items: items, costTotal: costTotal, costPerUnit: costTotal / Math.max(1, s.quantity), sheets: sheets, impressions: clicks, printHours: printHours, finishArea: finishArea };
  }

  /* ============================================================
     LOẠI 5 — BÁN NHÔM THANH (XÁ) (wideFormat): nhôm thanh bán cây/kg cho đại lý
     Tính theo m²/mét dài (đơn giá theo BẬC tổng m²) + lắp đặt + vật tư rời (phụ kiện).
     ============================================================ */
  var WIDE = {
    MATERIAL: {
      'Nhôm thanh hệ thuỷ lực 120': [{ min: 0, rate: 70000 }, { min: 5, rate: 60000 }, { min: 10, rate: 50000 }, { min: 30, rate: 40000 }, { min: 60, rate: 39000 }],
      'Nhôm thanh Luxanode 121':    [{ min: 0, rate: 100000 }, { min: 5, rate: 90000 }, { min: 10, rate: 85000 }, { min: 30, rate: 80000 }],
      'Nhôm thanh hệ trượt quay 93': [{ min: 0, rate: 110000 }, { min: 5, rate: 95000 }, { min: 10, rate: 85000 }, { min: 30, rate: 78000 }]
    },
    speedM2H: 25,   // m² / giờ
    grommet: 4000,  // đ/điểm lắp đặt công trình
    setup: 80000    // đ/lần lên máy (căn chỉnh + lập trình CNC)
  };
  function wideTierRate(mat, areaM2) {
    var tiers = WIDE.MATERIAL[mat] || WIDE.MATERIAL['Nhôm thanh hệ thuỷ lực 120'];
    var rate = tiers[0].rate;
    tiers.forEach(function (t) { if (areaM2 >= t.min) rate = t.rate; });
    return rate;
  }
  function wideFormatDefaultState() {
    return {
      productType: 'wideFormat', quantity: 2,
      pieceW: 0.8, pieceH: 2.0, materialName: 'Nhôm thanh hệ thuỷ lực 120',
      grommets: 0, frameName: '', frameRate: 0
    };
  }
  function wideFormatCalcCost(state) {
    var s = state;
    var areaM2 = +(Math.max(0.01, (s.pieceW || 0) * (s.pieceH || 0)) * Math.max(1, s.quantity || 1)).toFixed(2);
    var rate = wideTierRate(s.materialName, areaM2);
    var printHours = areaM2 / WIDE.speedM2H;
    var items = [
      { key: 'vatlieu', group: 'Vật tư', name: 'Nhôm thanh · ' + s.materialName + ' (cây)', meta: 'Theo m²/mét dài · bậc số lượng', norm: areaM2 + ' m²', unitLbl: fmt(rate) + '₫/m²', total: areaM2 * rate },
      { key: 'lenmayin', group: 'Công', name: 'Chi phí cài đặt máy, lập trình CNC', meta: 'Căn chỉnh máy cắt + lập trình CNC', norm: '1 lần', unitLbl: fmt(WIDE.setup) + '₫', total: WIDE.setup },
      laborLine('nc-in', 'Nhân công vận hành', 'Cắt & bó nhôm thanh theo mét dài', printHours * 60)
    ];
    if (s.grommets > 0)
      items.push({ key: 'khoen', group: 'Gia công', name: 'Vận chuyển & lắp đặt công trình', meta: '', norm: s.grommets + ' điểm', unitLbl: fmt(WIDE.grommet) + '₫/điểm', total: s.grommets * WIDE.grommet });
    if (s.frameRate > 0)
      items.push({ key: 'khung', group: 'Vật tư khác', name: s.frameName || 'Phụ kiện (bản lề/khoá)', meta: '', norm: (s.quantity || 1) + ' bộ', unitLbl: fmt(s.frameRate) + '₫/bộ', total: (s.quantity || 1) * s.frameRate });
    var costTotal = items.reduce(function (a, it) { return a + it.total; }, 0);
    return { items: items, costTotal: costTotal, costPerUnit: costTotal / Math.max(1, s.quantity || 1), areaM2: areaM2, printHours: printHours.toFixed(1) };
  }
  function renderWideViz(state, svg) {
    if (!svg) return { grid: [1, 1], efficiency: 100 };
    var s = state;
    var pw = Math.max(0.1, s.pieceW || 0.8), ph = Math.max(0.1, s.pieceH || 2.0);
    var vbW = 360, vbH = 300, pad = 30;
    var maxW = vbW - pad * 2, maxH = vbH - pad * 2 - 24;
    var sc = Math.min(maxW / pw, maxH / ph);
    var w = pw * sc, h = ph * sc;
    var x = (vbW - w) / 2, y = pad + 24 + (maxH - h) / 2;
    var html = '';
    html += '<text x="' + pad + '" y="' + (pad + 12) + '" font-family="JetBrains Mono, monospace" font-size="10" fill="#6b665b" letter-spacing="0.6" font-weight="500">' + String(s.materialName || '').toUpperCase() + ' · ' + (s.quantity || 1) + ' CÂY</text>';
    html += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" fill="#c5400a" fill-opacity="0.12" stroke="#c5400a" stroke-width="1.2"/>';
    html += '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 4) + '" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="12" fill="#8a2d07" font-weight="700">' + pw + '×' + ph + ' m</text>';
    svg.innerHTML = '<svg viewBox="0 0 ' + vbW + ' ' + vbH + '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">' + html + '</svg>';
    return { grid: [1, 1], efficiency: 100 };
  }

  /* ============================================================
     Registry + API dispatch theo productType
     ============================================================ */
  var types = {
    offset:  { key: 'offset',  label: 'Cửa thuỷ lực',      short: 'Thủy lực',    isRoll: false, defaultState: offsetDefaultState,  calcCost: offsetCalcCost,  renderViz: renderProofSheet },
    flexo:   { key: 'flexo',   label: 'Cửa trượt quay',    short: 'Trượt quay',  isRoll: true,  defaultState: flexoDefaultState,   calcCost: flexoCalcCost,   renderViz: renderRollViz },
    digital: { key: 'digital', label: 'Cửa sổ mở quay', short: 'Mở quay',     isRoll: true,  defaultState: digitalDefaultState, calcCost: digitalCalcCost, renderViz: renderRollViz },
    digitalSheet: { key: 'digitalSheet', label: 'Uốn vòm nhôm',      short: 'Uốn vòm',        isRoll: false, defaultState: digitalSheetDefaultState, calcCost: digitalSheetCalcCost, renderViz: renderProofSheet },
    wideFormat:   { key: 'wideFormat',   label: 'Bán nhôm thanh (xá)', short: 'Nhôm thanh', isRoll: false, defaultState: wideFormatDefaultState,   calcCost: wideFormatCalcCost,   renderViz: renderWideViz }
  };
  var LEGACY = { offsetBox: 'offset', labelRoll: 'flexo' }; // map giá trị cũ
  function typeOf(state) {
    var t = state && state.productType;
    if (t && LEGACY[t]) t = LEGACY[t];
    return (t && types[t]) ? t : 'offset';
  }

  // Bề mặt sản xuất: đọc lại calcCost, tách BOM (vật tư) và công đoạn (công/gia công) + thời gian.
  function productionPlan(state) {
    var t = typeOf(state), def = types[t];
    var res = def.calcCost(state);
    var roll = def.isRoll;
    var materials = [], steps = [];
    res.items.forEach(function (it) {
      if (it.group === 'Vật tư' || it.group === 'Vật tư khác') {
        materials.push({ name: it.name, spec: it.meta || '', qty: it.norm });
      } else {
        steps.push({ stage: it.name, detail: it.meta || it.norm || '' });
      }
    });
    var timeMin, timeText;
    if (roll) {
      timeMin = Math.round(res.timeMin || 0);
      timeText = (res.timeMin || 0) + ' phút chạy';
    } else {
      var h = parseFloat(res.printHours || '0');
      timeMin = Math.round(h * 60);
      timeText = (res.printHours || '0') + ' giờ máy';
    }
    var machine = state.machineName || def.label;
    return {
      type: t, machine: machine, unitsTotal: state.quantity || 0,
      materials: materials, steps: steps, timeMin: timeMin, timeText: timeText
    };
  }

  // Tóm tắt quy cách sản phẩm thành 1 dòng (cho danh mục SP)
  function specText(state) {
    var s = state || {}, t = typeOf(s);
    if (t === 'wideFormat') {
      return (s.pieceW || 0) + '×' + (s.pieceH || 0) + ' m · ' + (s.materialName || '') + ' · ' + (s.quantity || 1) + ' cây';
    }
    if (types[t].isRoll) {
      return (s.labelL || 0) + '×' + (s.labelW || 0) + 'mm · ' + (s.decalName || '') + ' · ' + (s.colors || 0) + ' cánh';
    }
    var dims = (s.finishedW || 0) + '×' + (s.finishedH || 0) + (s.finishedD ? '×' + s.finishedD : '');
    return dims + ' cm · ' + (s.paperName || '') + ' · ' + (s.colors || 0) + ' cánh';
  }

  // Số cánh TỐI ĐA cắt được từ 1 cây nhôm = quy cách cây / quy cách cánh (xét cả 2 chiều xoay, chừa khe 0.4cm)
  function maxUpsPerSheet(s) {
    if (!s) return 0;
    var sw = s.sheetW, sh = s.sheetH;
    var pw = s.spreadW || s.finishedW, ph = s.spreadH || s.finishedH;
    if (!sw || !sh || !pw || !ph) return 0;
    var gap = 0.4; // cm — khe cắt (mạch cưa) + dư gia công
    function fit(a, b) { return Math.max(0, Math.floor(sw / (a + gap))) * Math.max(0, Math.floor(sh / (b + gap))); }
    return Math.max(fit(pw, ph), fit(ph, pw));
  }

  global.PricingEngine = {
    VAT_RATE: VAT_RATE, types: types, OFFSET: OFFSET, LABEL: LABEL, DIGITAL_SHEET: DIGITAL_SHEET, WIDE: WIDE,
    maxUpsPerSheet: maxUpsPerSheet,
    // alias cũ để tương thích
    RATES: OFFSET.RATES, PAPER: OFFSET.PAPER, MACHINE: OFFSET.MACHINE, FINISH_DEFS: OFFSET.FINISH_DEFS,
    fmt: fmt, parseSize: parseSize, applyMarkup: applyMarkup,
    defaultState: function (type) { return (types[type] || types.offset).defaultState(); },
    calcCost: function (state) { return types[typeOf(state)].calcCost(state); },
    renderViz: function (state, el) { return types[typeOf(state)].renderViz(state, el); },
    renderProofSheet: renderProofSheet,
    typeOf: function (state) { return typeOf(state); },
    typeLabel: function (state) { return types[typeOf(state)].label; },
    isRoll: function (state) { return types[typeOf(state)].isRoll; },
    productionPlan: productionPlan,
    specText: specText
  };
})(window);
