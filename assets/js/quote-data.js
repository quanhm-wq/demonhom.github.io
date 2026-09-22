/* ============================================================
   QuoteStore — dữ liệu mẫu cho 2 module:
     • PTG (Phiếu tính giá)  — giá vốn, do KTV lập
     • BG  (Báo giá)         — giá bán + version, do Sale lập từ PTG

   "Lưu lại" trong mockup = seed sẵn + localStorage trong phiên.
   (Mở file:// có thể chặn localStorage → tự fallback về bộ nhớ RAM.)
   ============================================================ */
(function (global) {
  'use strict';

  var KEY = 'erp_quote_data_nhomowin_v2';

  // Helper dựng state từ defaultState + override (theo loại sản phẩm)
  function mkState(over, type) {
    var s = global.PricingEngine.defaultState(type || 'offset');
    over = over || {};
    Object.keys(over).forEach(function (k) {
      if (k === 'finishes') {
        Object.keys(over.finishes).forEach(function (fk) {
          if (s.finishes[fk]) s.finishes[fk].on = over.finishes[fk];
        });
      } else { s[k] = over[k]; }
    });
    return s;
  }

  // Gói biên lợi nhuận nhà máy hay dùng (chỉnh tên/% tự do)
  var MARGIN_PRESETS = [
    { name: 'Tiêu chuẩn', pct: 25, hint: 'Đơn thường' },
    { name: 'Khách quen', pct: 18, hint: 'KH thân thiết / quen' },
    { name: 'Đơn gấp/khó', pct: 35, hint: 'Gấp, kỹ thuật khó' },
    { name: 'Cạnh tranh', pct: 12, hint: 'Giữ khách, đấu giá' }
  ];

  // Đội ngũ Kinh doanh — người phụ trách báo giá (dùng để gán & thống kê công việc)
  var SALES_TEAM = [
    { name: 'Nguyễn Văn A', role: 'Trưởng phòng KD dự án' },
    { name: 'Trần Thị B',   role: 'NV Kinh doanh' },
    { name: 'Lê Văn C',     role: 'NV Kinh doanh' },
    { name: 'Phạm Văn D',   role: 'NV Kinh doanh' },
    { name: 'Nga',          role: 'NV Kinh doanh' },
    { name: 'Oanh',         role: 'NV Kinh doanh' },
    { name: 'Nhung',        role: 'NV Kinh doanh' }
  ];

  // ---------------- SEED ----------------
  var CUSTOMERS = [
    { name: 'Nhôm kính Đại Phát',       abbr: 'AB', mst: '0123456789', tier: 'VIP',   contact: 'Anh Tuấn · 0909-xxx',   email: 'tuan@nhomkinhdaiphat.vn' },
    { name: 'ĐL Nhôm kính Minh Anh',    abbr: 'MA', mst: '0301122334', tier: 'Thân thiết', contact: 'Chị Hoa · 0912-xxx', email: 'hoa@minhanh.vn' },
    { name: 'ĐL Owin Hoàng Long',     abbr: 'HL', mst: '0309988776', tier: 'Mới',   contact: 'Anh Phúc · 0938-xxx',   email: 'phuc@owinhoanglong.vn' },
    { name: 'VINHOMES OCEAN PARK',              abbr: 'MD', mst: '0312456789', tier: 'VIP',   contact: 'Mr. Lý · 0901-xxx',     email: 'muahang@vhoceanpark.vn' },
    { name: 'ECOPARK',           abbr: 'TS', mst: '0314567890', tier: 'Thân thiết', contact: 'Ms. Vân · 0902-xxx', email: 'po@ecopark.vn' },
    { name: 'NHÔM KÍNH MINH AN',           abbr: 'CT', mst: '0315678901', tier: 'Thân thiết', contact: 'Mr. Đạt · 0903-xxx', email: 'buy@nhomkinhminhan.vn' },
    { name: 'NT XÂY DỰNG HOÀNG GIA',         abbr: 'TX', mst: '0316789012', tier: 'Mới',   contact: 'Chị Lan · 0904-xxx',    email: 'lan@xaydunghoanggia.vn' }
  ];

  function seedPTG() {
    return [
      {
        id: 'PTG-2026-0204', customer: 'Nhôm kính Đại Phát', product: 'Cửa thuỷ lực hệ 120 · 2 cánh vân gỗ trắc',
        status: 'đã duyệt', createdBy: 'Lê Văn C (KTV)', date: '15/05/2026', note: 'Khoá định mức nhôm hệ 120 tháng 5.',
        state: mkState({ quantity: 12, finishedW: 160, finishedH: 240, finishedD: 0, paperName: 'Nhôm hệ 120 (6063-T5)', paperRate: 78500 })
      },
      {
        id: 'PTG-2026-0206', customer: 'Nhôm kính Đại Phát', product: 'Cửa sổ mở quay Luxanode 121 · 2 cánh',
        status: 'đã duyệt', createdBy: 'Lê Văn C (KTV)', date: '14/05/2026', note: '',
        state: mkState({ quantity: 60, finishedW: 120, finishedH: 140, finishedD: 0, spreadW: 120, spreadH: 140, ke: 4, colors: 2, plates: 4, paperName: 'Nhôm Luxanode 121 (anod ≥15µm)', paperRate: 96000,
          finishes: { canMang: true, beKhuon: false, danHop: false } })
      },
      {
        id: 'PTG-2026-0203', customer: 'ĐL Nhôm kính Minh Anh', product: 'Cửa thuỷ lực hệ 180 · 4 cánh vân gỗ hương',
        status: 'đã duyệt', createdBy: 'Phạm Văn D (KTV)', date: '12/05/2026', note: 'Kiện 1 bộ/kiện gỗ.',
        state: mkState({ quantity: 25, finishedW: 320, finishedH: 240, finishedD: 0, spreadW: 320, spreadH: 240, ke: 4, colors: 4, plates: 8, paperName: 'Nhôm hệ 180 (6063-T5)', paperRate: 82000,
          finishes: { canMang: true, beKhuon: false, danHop: false } })
      },
      {
        id: 'PTG-2026-0205', customer: 'ĐL Owin Hoàng Long', product: 'Cửa trượt quay 93 · 4 cánh ghi xám',
        status: 'nháp', createdBy: 'Lê Văn C (KTV)', date: '17/05/2026', note: 'Trượt quay · đơn đại lý số lượng lớn.',
        state: mkState({ quantity: 40, colors: 4, labelL: 1600, labelW: 2400, nL: 1, nW: 4,
          decalName: 'Nhôm hệ trượt quay 93', decalRate: 95000, coatName: 'Sơn tĩnh điện vân gỗ', coatRate: 28000,
          newDie: true, dieQty: 1, newPlate: true, plateQty: 4,
          machineName: 'CNC-03 · Máy phay khoá CNC', machineSpeed: 20, machineRate: 5000,
          finishes: { be: true, epNhu: false } }, 'flexo')
      },
      {
        id: 'PTG-2026-0208', customer: 'Nhôm kính Đại Phát', product: 'Cửa sổ mở lùa 76 Luxanode · 2 cánh',
        status: 'đã duyệt', createdBy: 'Lê Văn C (KTV)', date: '16/05/2026', note: 'Đơn lẻ · số lượng ít, không cần dao phay mới.',
        state: mkState({ quantity: 8, colors: 2, labelL: 1200, labelW: 1400, nL: 1, nW: 4,
          decalName: 'Nhôm Luxanode 121', decalRate: 135000, coatName: 'Anod ED ≥15µm', coatRate: 32000,
          newDie: false,
          machineName: 'CNC-22 · Máy phay đố', machineSpeed: 25, clickRate: 38000,
          finishes: { be: true, epNhu: false } }, 'digital')
      },
      {
        id: 'PTG-2026-0202', customer: 'ĐL Nhôm kính Minh Anh', product: 'Cửa thuỷ lực hệ 120 · 2 cánh vân gỗ hương',
        status: 'nháp', createdBy: 'Phạm Văn D (KTV)', date: '11/05/2026', note: '',
        state: mkState({ quantity: 30, ke: 6, finishedW: 160, finishedH: 240, finishedD: 0, paperName: 'Nhôm hệ 120 (6063-T5)', paperRate: 78500 })
      },
      {
        id: 'PTG-2026-0209', customer: 'ĐL Owin Hoàng Long', product: 'Cửa trượt quay 93 · 6 cánh vân gỗ trắc',
        status: 'chờ thiết kế', phuTrach: 'thiet-ke',
        yeuCau: 'Cửa trượt quay hệ 93, 6 cánh, số lượng 48 bộ cho ĐL. Kính cường lực 8mm, sơn tĩnh điện vân gỗ trắc. Cần khoá vân tay. Deadline 20/06/2026.',
        createdBy: 'Sales', date: '13/06/2026',
        note: 'Sales gửi yêu cầu — chờ thiết kế tính giá.',
        state: mkState({ quantity: 48, colors: 6, labelL: 2400, labelW: 2400, nL: 1, nW: 4,
          decalName: 'Nhôm hệ trượt quay 93', decalRate: 95000, coatName: 'Sơn tĩnh điện vân gỗ', coatRate: 28000,
          newDie: true, dieQty: 1, newPlate: true, plateQty: 4,
          machineName: 'CNC-03 · Máy phay khoá CNC', machineSpeed: 20, machineRate: 5000,
          finishes: { be: true, epNhu: false } }, 'flexo'),
        activity: [{ type: 'create', text: 'Sales tạo yêu cầu, giao thiết kế tính giá', date: '13/06/2026', by: 'Sales' }]
      },
      {
        id: 'PTG-2026-0210', customer: 'Nhôm kính Đại Phát', product: 'Cửa thuỷ lực hệ 120 · 2 cánh vân gỗ trắc',
        status: 'đã tính giá', phuTrach: 'sales',
        yeuCau: 'Cửa thuỷ lực hệ 120 cao cấp, 12 bộ (≈43 m²). Nhôm 6063-T5 dày 2,0mm, kính hộp 5-9-5, bản lề thuỷ lực sàn Đức, vân gỗ trắc.',
        createdBy: 'Sales', date: '10/06/2026',
        note: 'Thiết kế đã tính giá xong, trả Sales.',
        state: mkState({ quantity: 12, finishedW: 160, finishedH: 240, finishedD: 0,
          spreadW: 160, spreadH: 240, ke: 4, colors: 4, plates: 4,
          paperName: 'Nhôm hệ 120 (6063-T5)', paperRate: 78500,
          finishes: { canMang: true, beKhuon: true, danHop: true } }),
        activity: [
          { type: 'create', text: 'Sales tạo yêu cầu, giao thiết kế tính giá', date: '10/06/2026', by: 'Sales' },
          { type: 'handoff', text: 'Thiết kế tính giá xong, trả Sales', date: '12/06/2026', by: 'Thiết kế' }
        ]
      }
    ];
  }

  function seedContracts() {
    return [
      // HĐ NGUYÊN TẮC (khung) — neo NHIỀU đơn trong kỳ, giữ trần giá trị + lũy kế đã dùng
      { id: 'HD-2026-001', contractType: 'nguyen_tac', customer: 'Nhôm kính Đại Phát',
        orderIds: ['DH-0319'], releasedValue: 194400000, targetValue: 2000000000, targetQty: 0,
        priceTerms: 'Áp bảng giá khung theo m²; chiết khấu 5% cho đơn ≥ 200tr. Công nợ 30 ngày.',
        signDate: '05/06/2026', effectiveDate: '06/06/2026', expiryDate: '31/12/2026',
        status: 'đã ký', file: 'HD-NT-DaiPhat-2026.pdf' },
      // HĐ MUA BÁN cụ thể — đã ký
      { id: 'HD-2026-002', contractType: 'mua_ban', customer: 'ĐL Nhôm kính Minh Anh',
        orderId: '', value: 337500000, product: 'Cửa thuỷ lực hệ 180 · 4 cánh (bộ)', qty: 25,
        signDate: '12/05/2026', effectiveDate: '13/05/2026', expiryDate: '',
        status: 'đã ký', file: 'HD-MB-MinhAnh-0516.pdf' },
      // HĐ MUA BÁN nháp
      { id: 'HD-2026-003', contractType: 'mua_ban', customer: 'ĐL Owin Hoàng Long',
        orderId: '', value: 0, product: '', qty: 0,
        signDate: '', effectiveDate: '', expiryDate: '', status: 'nháp', file: '' }
    ];
  }

  function seedOrders() {
    return [{
      id: 'DH-0319', createdDate: '12/05/2026', customer: 'Nhôm kính Đại Phát', tier: 'VIP', mst: '', contact: 'Anh Tuấn · 0909-xxx',
      product: 'Cửa thuỷ lực hệ 120 · 2 cánh vân gỗ trắc', productNote: 'Tạo từ báo giá BG-2026-0515 · 12 bộ × 16.200.000 ₫', qty: 12, value: 194400000,
      salesRep: 'Nguyễn Văn A', dueDate: '', daysLeft: 99, currentStage: 'Mới tạo', stageType: 'new', progress: [1, 0, 0, 0, 0],
      bgId: 'BG-2026-0515', ptgId: 'PTG-2026-0210', lsxId: 'LSX-0319', lsx: null,
      payment: { total: 194400000, deposit: 0, paid: 0, remaining: 194400000, paymentTerm: 'Cọc 50%, 50% sau lắp đặt', dueDate: '—' },
      timeline: [
        { stage: 'Báo giá', status: 'done', date: '12/05/2026', by: 'Sales' },
        { stage: 'Đặt cọc', status: 'pending', date: '—', by: '—' },
        { stage: 'Sản xuất', status: 'pending', date: '—', by: '—' },
        { stage: 'QC', status: 'pending', date: '—', by: '—' },
        { stage: 'Giao hàng', status: 'pending', date: '—', by: '—' }
      ],
      activity: [{ time: '12/05/2026', by: 'Sales', action: 'Tạo đơn từ báo giá <b>BG-2026-0515</b>' }]
    }, {
      // Đơn NHIỀU SP đã lên lệnh 1 phần (1/2 SP có LSX) — demo trạng thái "lên 1 phần"
      id: 'DH-0371', createdDate: '13/06/2026', customer: 'VINHOMES OCEAN PARK', tier: '', mst: '', contact: 'P. Mua hàng · 028-3xxx',
      product: 'Cửa trượt quay 93 · 4 cánh ghi xám', productNote: 'Tạo từ báo giá BG-2026-0542 · 2 SP', qty: 68, value: 234000000,
      salesRep: 'Nga', dueDate: '02/07/2026', daysLeft: 11, currentStage: 'Lên kế hoạch SX', stageType: 'planning', progress: [1, 1, 0, 0, 0],
      bgId: 'BG-2026-0542', ptgId: '', lsxId: '', lsxIds: ['LSX-0322'], lsx: null,
      products: [
        { code: 'S2OS00275', name: 'Cửa trượt quay 93 · 4 cánh ghi xám', qty: 8, lsxId: 'LSX-0322' },
        { code: 'S2FX01104', name: 'Cửa sổ mở quay Luxanode 121 · 2 cánh (m²)', qty: 60, lsxId: '' }
      ],
      payment: { total: 234000000, deposit: 70200000, paid: 70200000, remaining: 163800000, paymentTerm: 'Cọc 30%, 70% sau giao', dueDate: '—' },
      timeline: [
        { stage: 'Báo giá', status: 'done', date: '13/06/2026', by: 'Sales' },
        { stage: 'Đặt cọc', status: 'done', date: '14/06/2026', by: 'Kế toán' },
        { stage: 'Sản xuất', status: 'active', date: '—', by: '—' },
        { stage: 'QC', status: 'pending', date: '—', by: '—' },
        { stage: 'Giao hàng', status: 'pending', date: '—', by: '—' }
      ],
      activity: [{ time: '13/06/2026', by: 'Sales', action: 'Tạo đơn từ báo giá <b>BG-2026-0542</b>' }]
    }, {
      // Đơn nguồn của LSX-0370 (LSX đang ở DỰ THẢO — sản xuất CHƯA bắt đầu)
      id: 'DH-0370', createdDate: '11/06/2026', customer: 'VINHOMES OCEAN PARK', tier: '', mst: '', contact: 'P. Mua hàng · 028-3xxx',
      product: 'Cửa vòm nhôm uốn hệ 120 · 2 cánh', productNote: 'Tạo từ báo giá BG-2026-0541 · 24 bộ × 19.700.000 ₫', qty: 24, value: 472800000,
      salesRep: 'Nga', dueDate: '30/06/2026', daysLeft: 9, currentStage: 'Lên kế hoạch SX', stageType: 'planning', progress: [1, 1, 0, 0, 0],
      bgId: 'BG-2026-0541', ptgId: '', lsxId: 'LSX-0370', lsx: null,
      payment: { total: 472800000, deposit: 141840000, paid: 141840000, remaining: 330960000, paymentTerm: 'Cọc 30%, 70% sau giao', dueDate: '—' },
      timeline: [
        { stage: 'Báo giá', status: 'done', date: '09/06/2026', by: 'Sales' },
        { stage: 'Đặt cọc', status: 'done', date: '11/06/2026', by: 'Kế toán' },
        { stage: 'Sản xuất', status: 'pending', date: '—', by: '—' },
        { stage: 'QC', status: 'pending', date: '—', by: '—' },
        { stage: 'Giao hàng', status: 'pending', date: '—', by: '—' }
      ],
      activity: [
        { time: '11/06/2026', by: 'Nga', action: 'Tạo lệnh sản xuất <b>LSX-0370</b> (dự thảo) — chờ phát hành' },
        { time: '11/06/2026', by: 'Sales', action: 'Tạo đơn từ báo giá <b>BG-2026-0541</b>' }
      ]
    }];
  }
  // ---- Công đoạn sản xuất theo công nghệ (key · tên · người phụ trách) ----
  // type:'date' = ô ghi ngày (Nhôm về), không phải công đoạn có trạng thái thường.
  var STAGE_TEMPLATES = {
    flexo: [
      { key: 'thu-mua',   name: 'Thu mua',        owner: 'Nguyệt' },
      { key: 'giay-ve',   name: 'Nhôm thanh về (dự kiến)', owner: '', type: 'date' },
      { key: 'xu-ly-file',name: 'Duyệt bản vẽ',        owner: 'Thiết kế' },
      { key: 'che-ban',   name: 'Lập trình CNC',    owner: 'An' },
      { key: 'in-lenh',   name: 'In lệnh',        owner: 'Vi' },
      { key: 'kho-cap',   name: 'Kho cấp',        owner: 'Hơi' },
      { key: 'in-phu',    name: 'Cắt & phay đố (trượt quay)', owner: 'Vi', group: 'sx' },
      { key: 'be',        name: 'Lắp kính',              owner: 'Vi', group: 'sx' },
      { key: 'dong-goi',  name: 'Đóng kiện',      owner: 'Vi', group: 'sx' },
      { key: 'nhap-kho',  name: 'Nhập kho',       owner: 'Diệu' }
    ],
    offset: [
      { key: 'xu-ly-file',name: 'Duyệt bản vẽ',        owner: 'Thiết kế' },
      { key: 'thu-mua',   name: 'Thu mua',        owner: 'Nguyệt' },
      { key: 'giay-ve',   name: 'Nhôm thanh về (dự kiến)', owner: '', type: 'date' },
      { key: 'kho-cap',   name: 'Kho cấp',        owner: 'Hơi' },
      { key: 'in-lenh',   name: 'In lệnh',        owner: 'Kiều' },
      { key: 'cb-kem',    name: 'C.bị dao phay',    owner: 'An' },
      { key: 'in',        name: 'Cắt & phay đố (CNC)',    owner: 'Kiều', group: 'sx' },
      { key: 'sau-in',    name: 'Ép góc & lắp khung',    owner: 'Kiều', group: 'sx' },
      { key: 'dong-goi',  name: 'Đóng kiện',      owner: 'Kiều', group: 'sx' },
      { key: 'nhap-kho',  name: 'Nhập kho',       owner: 'Diệu' }
    ],
    digital: [
      { key: 'xu-ly-file',name: 'Duyệt bản vẽ',        owner: 'Thiết kế' },
      { key: 'in-kts',    name: 'Gia công cửa mở quay', owner: 'Vi', group: 'sx' },
      { key: 'gia-cong',  name: 'Lắp kính & hoàn thiện', owner: 'An', group: 'sx' },
      { key: 'dong-goi',  name: 'Đóng kiện',      owner: 'Vi', group: 'sx' },
      { key: 'nhap-kho',  name: 'Nhập kho',       owner: 'Diệu' }
    ],
    digitalSheet: [
      { key: 'xu-ly-file',name: 'Duyệt bản vẽ',        owner: 'Thiết kế' },
      { key: 'in-kts',    name: 'Uốn vòm nhôm (đơn lẻ)', owner: 'Vi', group: 'sx' },
      { key: 'gia-cong',  name: 'Lắp kính + hoàn thiện',   owner: 'An', group: 'sx' },
      { key: 'dong-goi',  name: 'Đóng kiện',      owner: 'Vi', group: 'sx' },
      { key: 'nhap-kho',  name: 'Nhập kho',       owner: 'Diệu' }
    ],
    wideFormat: [
      { key: 'xu-ly-file',name: 'Duyệt bản vẽ',        owner: 'Thiết kế' },
      { key: 'in-kho-lon',name: 'Xuất nhôm thanh (xá)', owner: 'Vi', group: 'sx' },
      { key: 'gia-cong',  name: 'Bó kiện / cắt theo yêu cầu', owner: 'An', group: 'sx' },
      { key: 'dong-goi',  name: 'Đóng kiện',      owner: 'Vi', group: 'sx' },
      { key: 'nhap-kho',  name: 'Nhập kho',       owner: 'Diệu' }
    ]
  };
  // Người duyệt sản xuất theo công nghệ
  var APPROVER = { flexo: 'Quý', offset: 'Thành', digital: 'Quý', digitalSheet: 'Quý', wideFormat: 'Quý' };

  // Viết tắt khách hàng cho mã lệnh (ưu tiên field abbr, không thì lấy chữ cái đầu các từ)
  function custAbbr(name) {
    var c = customerByName(name);
    if (c && c.abbr) return c.abbr;
    var words = String(name || '').replace(/^Cty\s+(TNHH|CP)?\s*/i, '').trim().split(/\s+/);
    var a = words.map(function (w) { return (w[0] || '').toUpperCase(); }).join('');
    return (a || 'XX').slice(0, 2);
  }
  // Mã lệnh SX tự động: {TECH}-{YY}{CUST}{n4}-{DDMMYYYY}-{seq}
  function buildAutoCode(tech, customer, productCode, dateReceived, seq) {
    var t = TECH_CODE[tech] || 'OS';
    var yy = (String(dateReceived || '').match(/(\d{4})$/) || [])[1];
    yy = yy ? yy.slice(-2) : '26';
    var ddmmyyyy = String(dateReceived || '').replace(/\//g, '') || '01012026';
    // n4: hash ổn định từ mã SP (cho cảm giác mã tham chiếu)
    var h = 0, s = String(productCode || customer || 'X');
    for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) % 9000; }
    var n4 = 1000 + h;
    return t + '-' + yy + custAbbr(customer) + n4 + '-' + ddmmyyyy + '-' + (seq || 1);
  }
  // Dựng danh sách công đoạn cho 1 lệnh, gán trạng thái theo map {key:status|dateString}
  function buildStages(tech, statusMap) {
    statusMap = statusMap || {};
    return (STAGE_TEMPLATES[tech] || STAGE_TEMPLATES.offset).map(function (s) {
      var v = statusMap[s.key];
      return {
        key: s.key, name: s.name, owner: s.owner, type: s.type || 'work', group: s.group || '',
        status: s.type === 'date' ? '' : (v || ''),
        dateText: s.type === 'date' ? (v || '') : ''
      };
    });
  }

  // Dựng stages cho LSX mới: ưu tiên ROUTE CHUẨN của sản phẩm (tái bản dùng lại)
  // → nếu sản phẩm chưa có route thì đổ template gợi ý theo công nghệ.
  function stagesForLSX(productCode, tech) {
    var prods = data.products || (data.products = seedProducts());
    var p = productCode ? prods.filter(function (x) { return x.code === productCode; })[0] : null;
    if (p && p.route && p.route.length) return p.route.map(stageFromDef);
    return buildStages(tech, {});
  }

  function seedLSX() {
    // mk: dựng nhanh 1 lệnh SX bám mô hình bảng kế hoạch
    function mk(o) {
      var tech = o.tech || 'offset';
      var stages = o.stageList
        ? o.stageList.map(function (s) { var st = stageFromDef({ key: s.key, name: s.name, owner: s.owner || '', role: s.role, col: s.col, wdept: s.wdept }); st.status = s.status || ''; return st; })
        : buildStages(tech, o.stages);
      if (o.grids) Object.keys(o.grids).forEach(function (k) { var st = stages.filter(function (s) { return s.key === k; })[0]; if (st) st.grid = freshGrid(o.grids[k]); });
      return {
        id: o.id, orderId: o.orderId || '', bgId: o.bgId || '', ptgId: o.ptgId || '',
        customer: o.customer, product: o.product,
        productCode: o.productCode, type: tech, tech: tech,
        size: o.size || '', priority: o.priority || 'normal',
        machine: o.machine || '', machineIn: o.machineIn || o.machine || '',
        qty: o.qty || 0, qtyStock: o.qtyStock || 0,
        dateReceived: o.dateReceived || '', dateWarehouse: o.dateWarehouse || '', dateDelivery: o.dateDelivery || '',
        autoCode: o.autoCode || buildAutoCode(tech, o.customer, o.productCode, o.dateReceived, o.seq || 1),
        approval: { status: o.approved ? 'duyet' : 'cho', by: o.approved ? APPROVER[tech] : '' },
        stages: stages,
        bom: o.bom || [], routing: o.routing || [], floor: o.floor || null,
        lifecycle: o.lifecycle || (o.status === 'hoàn thành' ? 'da-dong' : ''), transitions: o.transitions || [],
        timeMin: o.timeMin || 0, timeText: o.timeText || '',
        packaging: o.packaging || { mode: 'carton', perCarton: 2, cartons: Math.ceil((o.qty || 0) / 2), perRoll: 0, rolls: 0, coreMM: 0 },
        // Trường riêng đơn lẻ / gia công uốn vòm
        material: o.material || '', lamination: o.lamination || '', paperSize: o.paperSize || '',
        printSides: o.printSides || '', postPress: o.postPress || '', sheets: o.sheets || 0,
        paperSource: o.paperSource || '',
        lot: 'LOT-' + (o.id || '').replace(/\D/g, ''), status: o.status || 'chờ SX',
        issuedBy: o.issuedBy || '', issuedAt: o.issuedAt || '', note: o.note || '',
        matEta: o.matEta || '',   // ngày NCC hẹn giao NVL (điền khi lệnh thiếu vật tư → đi mua)
        // SL lũy kế từng công đoạn + log lô chuyển (SFDC) + cờ gộp lô / chốt định mức
        prod: o.prod || {}, transfers: o.transfers || [], gangId: o.gangId || '', bomLocked: o.bomLocked || false,
        activity: o.activity || [{ type: 'create', text: 'Tự sinh LSX từ kế hoạch', date: o.dateReceived || 'hôm nay', by: 'Hệ thống' }]
      };
    }
    var DONE = 'done', WAIT = 'wait', DOING = 'doing';
    return [
      // ===== OFFSET =====
      mk({
        id: 'LSX-0319', orderId: 'DH-0319', bgId: 'BG-2026-0515', ptgId: 'PTG-2026-0210',
        manager: 'Oanh', customer: 'Nhôm kính Đại Phát', product: 'Cửa thuỷ lực hệ 120 · 2 cánh vân gỗ trắc', productCode: 'S1OS00140',
        tech: 'offset', size: '1.600×2.400mm · 3,6 m²/bộ', qty: 12, machine: 'CAT-01 · WEIKE 2 đầu', machineIn: 'Chuyền cắt 1',
        dateReceived: '14/06/2026', dateWarehouse: '25/06/2026', dateDelivery: '27/06/2026', seq: 11, approved: true,
        bom: [
          { name: 'Thanh nhôm hệ thuỷ lực 120 (6063-T5)', spec: 'Cây 5,8m · dày 2,0mm', qty: '738 kg (hao cắt đầu mẩu 6%)' },
          { name: 'Kính hộp 5-9-5 cường lực', spec: 'tấm 1,2×2,4m', qty: '39,6 m²' },
          { name: 'Bộ bản lề thuỷ lực sàn (Đức)', spec: 'tải 150kg/cánh · 2 cánh', qty: '12 bộ' },
          { name: 'Ke góc & vít inox (bộ)', spec: 'bộ/1 cánh', qty: '24 bộ' }
        ],
        timeMin: 138, timeText: '2.3 giờ máy',
        stages: { 'xu-ly-file': DONE, 'thu-mua': DONE, 'giay-ve': '15/05/2026', 'kho-cap': DONE, 'in-lenh': DONE, 'cb-kem': DONE, 'in': DOING, 'sau-in': DOING, 'dong-goi': WAIT },
        grids: { 'in': seedGridBPIn(), 'sau-in': seedGridQC() },
        status: 'đang SX', note: 'Vân gỗ trắc · khách duyệt màu 12/06',
        // demo CHỒNG LẤN: Cắt-phay 10 bộ + Ép góc 5 bộ cùng chạy, có log lô chuyển
        prod: { 'in': 10, 'sau-in': 5 },
        transfers: [
          { from: 'Cắt & phay đố (CNC)', to: 'Ép góc & lắp khung', qty: 3, at: 'Hôm nay 13:10', by: 'CN Kiều', shift: 'Ca 1' },
          { from: 'Cắt & phay đố (CNC)', to: 'Ép góc & lắp khung', qty: 2, at: 'Hôm nay 10:40', by: 'CN Kiều', shift: 'Ca 1' }
        ],
        floor: { stageCol: 'print', progress: 85, done: 10, worker: 'Trần Văn Tú', dueDate: '25/05', daysLeft: 5, urgency: 'warning', status: 'running', vip: true,
          specs: { khoThanhPham: '1.600×2.400 mm', khoTrai: 'kiện gỗ 1,7×2,5 m', giay: 'Nhôm hệ 120 (6063-T5)', soMau: '2 cánh', soBanKem: 4, giaCong: 'Phay đố · Ép góc · Lắp kính hộp' },
          materials: [ { n: 'Thanh nhôm hệ thuỷ lực 120 (6063-T5)', s: '738 kg · đã cấp', st: 'ok' }, { n: 'Kính hộp 5-9-5 cường lực', s: '39,6 m² · về kho 20/06', st: 'ok' }, { n: 'Bộ bản lề thuỷ lực sàn (Đức)', s: '12 bộ · đủ', st: 'ok' }, { n: 'Bộ dao phay hệ 120', s: 'Có sẵn (đơn trước)', st: 'ok' } ],
          qrLog: [ { t: 'Hôm nay 14:30', a: 'Cập nhật cắt & phay đố <b>10/12 bộ</b>', by: 'CN Trần Văn Tú' }, { t: 'Hôm nay 08:00', a: 'Bắt đầu cắt nhôm · quét QR LSX-0319', by: 'CN Trần Văn Tú' } ] }
      }),
      mk({
        id: 'LSX-0322', manager: 'Nga', customer: 'VINHOMES OCEAN PARK', product: 'Cửa trượt quay 93 · 4 cánh ghi xám', productCode: 'S2OS00275', matEta: '28/06/2026',
        tech: 'offset', size: '2.400×2.400mm · 5,4 m²/bộ', qty: 8, machine: 'CAT-02', machineIn: 'Chuyền cắt 2', priority: 'normal',
        dateReceived: '12/06/2026', dateWarehouse: '27/06/2026', dateDelivery: '30/06/2026', seq: 6, approved: false,
        bom: [
          { name: 'Thanh nhôm hệ trượt quay 93', spec: 'Cây 5,8m · khung + cánh', qty: '620 kg (gồm hao 6%)' },
          { name: 'Kính cường lực 8mm', spec: 'tấm 1,2×2,4m', qty: '40 m²' },
          { name: 'Bộ khoá & tay nắm cao cấp', spec: 'khoá vân tay + tay gạt', qty: '8 bộ' }
        ],
        routing: [
          { stage: 'Công chuẩn chuyền', detail: 'Gá dao phay + căn cữ cắt 45°' },
          { stage: 'Công cắt & phay đố (CAT-02)', detail: '8 bộ · 2 lô chạy' },
          { stage: 'Công ép góc – lắp kính – đóng kiện', detail: 'Cánh 600×2.400mm' }
        ],
        timeMin: 300, timeText: '5.0 giờ máy',
        stages: { 'xu-ly-file': DONE, 'thu-mua': DONE, 'giay-ve': '20/04/2026', 'kho-cap': DONE, 'in-lenh': WAIT },
        grids: { 'in': seedGridBPIn(), 'dong-goi': seedGridPack() },
        note: 'Khách đổi màu sang ghi xám · chờ kính hộp về'
      }),
      // ===== LSX CỬA VÒM ĐẦY ĐỦ 8 BP (mẫu tờ lệnh thật SX-25MD2921 · VINHOMES OCEAN PARK) — dự thảo để cấu hình =====
      mk({
        id: 'LSX-0370', orderId: 'DH-0370', bgId: 'BG-2026-0541', manager: 'Nga', customer: 'VINHOMES OCEAN PARK',
        product: 'Cửa vòm nhôm uốn hệ 120 · 2 cánh', productCode: 'S2OS02101', matEta: '24/06/2026',
        tech: 'offset', size: '1.600×2.400mm · vòm R1200', qty: 24, qtyStock: 2, machine: 'CAT-02', machineIn: 'Chuyền cắt CAT-02', priority: 'normal',
        dateReceived: '11/06/2026', dateWarehouse: '25/06/2026', dateDelivery: '30/06/2026', seq: 4, approved: false,
        lifecycle: 'du-thao',
        note: 'Cửa vòm R1200 · nhôm hệ 120 · 2 đợt 14+8 bộ — phiếu bảng theo tờ lệnh thật',
        stageList: [
          { key: 'don-hang',  name: 'Đơn hàng',      owner: 'Nga',   col: 'ctp', role: '', wdept: 'ke-hoach' },
          { key: 'kho-cap',   name: 'Cấp & xuất nhôm thanh', owner: 'Hơi' },
          { key: 'in',        name: 'Cắt & phay đố (CNC)',   owner: 'Kiều' },
          { key: 'cat',       name: 'Uốn vòm / định hình',   owner: 'Vi' },
          { key: 'gap',       name: 'Ép góc & lắp khung',    owner: 'Vi' },
          { key: 'dong-cuon', name: 'Lắp kính & phụ kiện',   owner: 'Vi' },
          { key: 'kcs',       name: 'QC',            owner: 'An' },
          { key: 'dong-goi',  name: 'Bọc màng & đóng kiện', owner: 'Vi' }
        ],
        grids: {
          'don-hang': seedGridDonHang(), 'kho-cap': seedGridCapGiay(), 'in': seedGridBPIn(),
          'cat': seedGridCat(), 'gap': seedGridGap(), 'dong-cuon': seedGridDongCuon(),
          'kcs': seedGridQC(), 'dong-goi': seedGridPack()
        }
      }),
      mk({
        id: 'LSX-0324', manager: 'Oanh', customer: 'NHÔM KÍNH MINH AN', product: 'Cửa mẫu xuất khẩu (mẫu duyệt)', productCode: 'S1OS02031',
        tech: 'offset', size: '900×2.200mm · mẫu', qty: 2, machine: 'CAT-02', machineIn: 'C.Hoàng (gia công ngoài)',
        dateReceived: '19/01/2026', dateWarehouse: '21/01/2026', dateDelivery: '22/01/2026', seq: 2, approved: true,
        stages: { 'xu-ly-file': DONE, 'thu-mua': DONE, 'kho-cap': DONE, 'in-lenh': DONE, 'cb-kem': DONE, 'in': DONE, 'sau-in': DONE, 'dong-goi': DONE, 'nhap-kho': DONE },
        status: 'hoàn thành', note: 'Mẫu cánh (đã gửi) · khách duyệt màu xong mới SX đại trà'
      }),
      // ===== FLEXO =====
      mk({
        id: 'LSX-0331', manager: 'Nga', customer: 'VINHOMES OCEAN PARK', product: 'Cửa trượt quay 93 · 6 cánh vân gỗ trắc', productCode: 'S2FX01807',
        tech: 'flexo', size: '3.600×2.400mm · 8,6 m²/bộ', qty: 40, machine: 'CNC-03 · Máy phay khoá CNC', machineIn: 'Chuyền uốn vòm',
        dateReceived: '14/06/2026', dateWarehouse: '23/06/2026', dateDelivery: '25/06/2026', seq: 9, approved: false,
        stages: { 'thu-mua': DONE, 'giay-ve': '14/04/2026', 'xu-ly-file': DONE, 'che-ban': DONE, 'in-lenh': DONE, 'kho-cap': DONE, 'in-phu': WAIT },
        note: ''
      }),
      mk({
        id: 'LSX-0332', manager: 'Oanh', customer: 'NT XÂY DỰNG HOÀNG GIA', product: 'Cửa sổ mở quay Luxanode 121 (mẫu)', productCode: 'S1FX00607',
        tech: 'flexo', size: '1.200×1.400mm', qty: 3, machine: 'CNC-03 · Máy phay khoá CNC', machineIn: 'Chuyền trượt quay', priority: 'normal',
        dateReceived: '15/06/2026', dateWarehouse: '22/06/2026', dateDelivery: '24/06/2026', seq: 15, approved: false,
        stages: { 'thu-mua': DONE, 'giay-ve': '20/04/2026', 'xu-ly-file': DONE, 'che-ban': DONE, 'in-lenh': DONE, 'kho-cap': DONE, 'in-phu': DONE, 'be': DONE, 'dong-goi': DOING },
        status: 'đang SX', note: '',
        floor: { stageCol: 'glue', progress: 80, worker: 'Vi', status: 'running', urgency: 'safe', dueDate: '22/04', daysLeft: 2,
          qrLog: [ { t: 'Hôm nay 09:40', a: 'Bắt đầu bọc màng & đóng kiện 3 bộ', by: 'CN Vi' }, { t: 'Hôm qua 15:00', a: 'Lắp kính hộp xong · chuyển hoàn thiện', by: 'CN Vi' } ] }
      }),
      mk({
        id: 'LSX-0333', manager: 'Nga', customer: 'ECOPARK', product: 'Cửa trượt quay 93 · 4 cánh vân gỗ trắc', productCode: 'S3FX00006', matEta: '26/06/2026',
        tech: 'flexo', size: '2.400×2.400mm · 5,4 m²/bộ', qty: 25, machine: 'CNC-03 · Máy phay khoá CNC', machineIn: 'Chuyền trượt quay',
        dateReceived: '16/06/2026', dateWarehouse: '27/06/2026', dateDelivery: '29/06/2026', seq: 2, approved: true,
        bom: [
          { name: 'Thanh nhôm hệ trượt quay 93', spec: 'Cây 5,8m · 25 bộ', qty: '1.860 kg' },
          { name: 'Ke góc & vít inox (bộ)', spec: 'bộ/1 cánh', qty: '100 bộ' },
          { name: 'Gioăng EPDM', spec: 'cuộn 100m', qty: '850 m' }
        ],
        routing: [
          { stage: 'Công chuẩn chuyền', detail: 'Gá dao phay + căn cữ 45°' },
          { stage: 'Công phay khoá (CNC-03)', detail: '' },
          { stage: 'Công ép góc & lắp kính', detail: '' }
        ],
        timeMin: 95, timeText: '95 phút chạy',
        packaging: { mode: 'roll', perRoll: 4, rolls: 7, coreMM: 76, perCarton: 0, cartons: 0 },
        stages: { 'thu-mua': DONE, 'giay-ve': '18/05/2026', 'xu-ly-file': DONE, 'che-ban': WAIT, 'in-lenh': 'doing', 'kho-cap': DONE, 'in-phu': DONE, 'be': DONE },
        note: ''
      }),
      mk({
        id: 'LSX-0335', manager: 'Nga', customer: 'VINHOMES OCEAN PARK', product: 'Cửa sổ mở quay Luxanode 121 · 2 cánh (m²)', productCode: 'S2FX01104',
        tech: 'flexo', size: '1.200×1.400mm · tính theo m²', qty: 60, machine: 'EP-02 · Máy ép góc', machineIn: 'Chuyền ép góc',
        dateReceived: '15/06/2026', dateWarehouse: '28/06/2026', dateDelivery: '01/07/2026', seq: 12, approved: true,
        bom: [
          { name: 'Thanh nhôm Luxanode Anodized-ED 121', spec: 'Cây 5,8m · anod ≥15µm', qty: '610 kg' },
          { name: 'Kính hộp 5-9-5 cường lực', spec: 'tấm 1,2×2,4m', qty: '53 m²' }
        ],
        routing: [
          { stage: 'Công chuẩn chuyền', detail: 'Gá dao phay + căn cữ 45°' },
          { stage: 'Công cắt + phay đố', detail: '' },
          { stage: 'Công ép góc & lắp kính', detail: '' }
        ],
        timeMin: 140, timeText: '140 phút chạy',
        packaging: { mode: 'roll', perRoll: 4, rolls: 15, coreMM: 76, perCarton: 0, cartons: 0 },
        stages: { 'thu-mua': DONE, 'giay-ve': '22/05/2026', 'xu-ly-file': DONE, 'che-ban': DONE, 'in-lenh': DONE, 'kho-cap': DONE, 'in-phu': WAIT, 'be': WAIT },
        note: ''
      }),
      // ===== ĐƠN LẺ / GIA CÔNG NHANH =====
      mk({
        id: 'LSX-0340', manager: 'Oanh', customer: 'ECOPARK', product: 'Vách kính khung nhôm Luxanode (mẫu GP 12-4.5)', productCode: 'S1DG00301',
        tech: 'digital', size: '3.000×600mm', qty: 4, machine: 'CNC-22 · Máy phay đố', machineIn: 'Chuyền uốn vòm',
        dateReceived: '17/06/2026', dateWarehouse: '19/06/2026', dateDelivery: '20/06/2026', seq: 1, approved: true,
        material: 'Nhôm Luxanode 121', lamination: 'Anod ED bóng', paperSize: 'cây 5,8m', printSides: '01 ca', postPress: 'Lắp kính demi', sheets: 3, paperSource: 'NCC Luxanode',
        stages: { 'xu-ly-file': DONE, 'in-kts': DONE, 'gia-cong': DOING, 'dong-goi': WAIT },
        status: 'đang SX', note: 'Đơn lẻ · thuê đóng kiện ngoài',
        floor: { stageCol: 'lam', progress: 60, worker: 'An', urgency: 'safe', dueDate: '03/04', daysLeft: 3, status: 'running' }
      }),
      mk({
        id: 'LSX-0341', manager: 'Oanh', customer: 'NHÔM KÍNH MINH AN', product: 'Cửa sổ mở lùa 76 Luxanode · 2 cánh (đủ bộ)', productCode: 'S1DG00302',
        tech: 'digital', size: '950×2.130mm', qty: 18, machine: 'CNC-22 · Máy phay đố', machineIn: 'Chuyền uốn vòm',
        dateReceived: '15/06/2026', dateWarehouse: '21/06/2026', dateDelivery: '23/06/2026', seq: 1, approved: true,
        material: 'Nhôm hệ 76 Luxanode', lamination: 'Không', paperSize: 'cây 5,8m', printSides: '01 ca', postPress: 'Chỉ cắt & phay', sheets: 270, paperSource: 'ERP NHÔM OWIN',
        stages: { 'xu-ly-file': DONE, 'in-kts': DOING, 'gia-cong': WAIT, 'dong-goi': WAIT },
        note: ''
      }),
      // ===== Bổ sung phủ cột kanban: Lắp kính & KCS =====
      mk({
        id: 'LSX-0350', orderId: 'DH-0321', customer: 'Cty Xây dựng ABC', product: 'Cửa thuỷ lực hệ 180 · 4 cánh vân gỗ hương', productCode: 'S2OS00451',
        tech: 'offset', size: '3.200×2.400mm · 7,7 m²/bộ', qty: 45, machine: 'CAT-02', machineIn: 'Chuyền cắt 3',
        dateReceived: '10/06/2026', dateWarehouse: '20/06/2026', dateDelivery: '22/06/2026', seq: 21, approved: true,
        bom: [
          { name: 'Thanh nhôm hệ thuỷ lực 180', spec: 'Cây 5,8m · dày 2,5mm', qty: '3.420 kg (gồm hao)' },
          { name: 'Bộ bản lề thuỷ lực sàn (Đức)', spec: 'tải 150kg/cánh · 4 cánh', qty: '45 bộ' },
          { name: 'Keo silicon trung tính', spec: 'tuýp 300ml', qty: '140 tuýp' }
        ],
        timeMin: 180, timeText: '3.0 giờ máy',
        stages: { 'xu-ly-file': DONE, 'thu-mua': DONE, 'giay-ve': '14/06/2026', 'kho-cap': DONE, 'in-lenh': DONE, 'cb-kem': DONE, 'in': DONE, 'sau-in': DOING, 'dong-goi': WAIT },
        status: 'đang SX', note: 'Lắp kính hộp · bơm silicon · dán tem QR',
        floor: { stageCol: 'die', progress: 72, done: 32, worker: 'Nguyễn Văn Hải', dueDate: '22/06', daysLeft: 3, urgency: 'safe', status: 'running', vip: true,
          specs: { khoThanhPham: '3.200×2.400 mm', khoTrai: 'kiện gỗ 3,3×2,5 m', giay: 'Nhôm hệ 180 (6063-T5)', soMau: '4 cánh', soBanKem: 6, giaCong: 'Phay đố · Ép góc · Lắp kính hộp' },
          materials: [ { n: 'Thanh nhôm hệ thuỷ lực 180', s: 'Đã cấp 3.420 kg', st: 'ok' }, { n: 'Bộ bản lề thuỷ lực sàn (Đức)', s: '45 bộ · ✓', st: 'ok' }, { n: 'Bộ dao phay hệ 180', s: 'Có sẵn', st: 'ok' }, { n: 'Keo silicon trung tính', s: 'Đủ 140 tuýp', st: 'ok' } ],
          qrLog: [ { t: 'Hôm nay 10:15', a: 'Lắp kính đạt 32/45 bộ', by: 'CN Nguyễn Văn Hải' }, { t: 'Hôm qua 16:00', a: 'Hoàn thành ép góc 45 khung', by: 'CN Kiều' } ] }
      }),
      mk({
        id: 'LSX-0351', orderId: 'DH-0302', customer: 'ĐL Nhôm kính Minh Anh', product: 'Cửa sổ mở quay Luxanode 121 · 2 cánh', productCode: 'S2OS00452',
        tech: 'offset', size: '1.450×2.050mm', qty: 26, machine: 'Quầy KCS-2', machineIn: 'KCS Quầy 2',
        dateReceived: '08/06/2026', dateWarehouse: '17/06/2026', dateDelivery: '18/06/2026', seq: 22, approved: true,
        bom: [
          { name: 'Thanh nhôm Luxanode Anodized-ED 121', spec: 'Cây 5,8m', qty: '260 kg (gồm hao)' },
          { name: 'Kính hộp 5-9-5 cường lực', spec: 'tấm 1,2×2,4m', qty: '24 m²' }
        ],
        timeMin: 60, timeText: '1.0 giờ máy',
        stages: { 'xu-ly-file': DONE, 'thu-mua': DONE, 'kho-cap': DONE, 'in-lenh': DONE, 'cb-kem': DONE, 'in': DONE, 'sau-in': DONE, 'dong-goi': DOING, 'nhap-kho': WAIT },
        status: 'đang SX', note: 'KCS phát hiện lệch góc 45° ở 2 cánh',
        floor: { stageCol: 'kcs', progress: 97, done: 25, worker: 'Nguyễn Thị Hoa', dueDate: '18/06', daysLeft: -1, urgency: 'overdue', status: 'warn', vip: true,
          alert: 'QUÁ HẠN 1 NGÀY · KCS phát hiện 2 cánh lệch góc 45° (CAT-LECH-GOC)',
          kcs: { checked: 52, passed: 50, failed: 2, deltaE: 1.8 },
          specs: { khoThanhPham: '1.450×2.050 mm', khoTrai: 'kiện gỗ 1,6×2,2 m', giay: 'Nhôm Luxanode 121', soMau: '2 cánh', soBanKem: 4, giaCong: 'Anod ED · Lắp kính hộp' },
          materials: [ { n: 'Tất cả vật tư', s: 'Đã sử dụng', st: 'ok' } ],
          qrLog: [ { t: 'Hôm nay 16:30', a: '<b>Phát hiện 2 cánh lệch góc 45°</b> · trả ép góc lại', by: 'KCS Hoa' }, { t: 'Hôm nay 14:00', a: 'Bắt đầu kiểm KCS lô #042 (dung sai ≤2mm)', by: 'KCS Hoa' } ] }
      }),
      // ===== Đơn mới · Dự thảo — chờ Kế hoạch SX phát hành =====
      mk({
        id: 'LSX-0360', orderId: 'DH-0322', customer: 'Nhôm kính Đại Phát', product: 'Cửa thuỷ lực hệ 120 · 2 cánh vân gỗ trắc (dự án)', productCode: 'S1OS00501',
        tech: 'offset', size: '1.800×2.400mm · 4,3 m²/bộ', qty: 30, machine: 'CAT-01 · WEIKE 2 đầu', machineIn: 'Chuyền cắt 1',
        dateReceived: '18/06/2026', dateWarehouse: '26/06/2026', dateDelivery: '28/06/2026', seq: 30, approved: false,
        lifecycle: 'du-thao',
        bom: [
          { name: 'Thanh nhôm hệ thuỷ lực 120 (6063-T5)', spec: 'Cây 5,8m', qty: '1.860 kg (gồm hao)' },
          { name: 'Bộ khoá & tay nắm cao cấp', spec: 'khoá vân tay', qty: '30 bộ' },
          { name: 'Màng bảo vệ bề mặt nhôm', spec: 'cuộn 1m×200m', qty: '215 m²' }
        ],
        timeMin: 120, timeText: '2.0 giờ máy',
        floor: { specs: { khoThanhPham: '1.800×2.400 mm', giay: 'Nhôm hệ 120 (6063-T5)', soMau: '2 cánh', soBanKem: 4, giaCong: 'Phay đố · Ép góc · Lắp kính' } },
        note: 'Đơn mới — KD CHƯA ghi quy cách đóng kiện, chờ soát'
      }),
      mk({
        id: 'LSX-0361', orderId: 'DH-0323', customer: 'ĐL Owin Hoàng Long', product: 'Cửa sổ mở lùa 76 Luxanode · 2 cánh', productCode: 'S3FX00501',
        tech: 'flexo', size: '1.000×1.600mm · tính theo m²', qty: 48, machine: 'CNC-03 · Máy phay khoá CNC', machineIn: 'Chuyền trượt quay',
        dateReceived: '19/06/2026', dateWarehouse: '29/06/2026', dateDelivery: '30/06/2026', seq: 31, approved: false,
        lifecycle: 'du-thao',
        bom: [
          { name: 'Thanh nhôm Luxanode Anodized-ED 121', spec: 'Cây 5,8m', qty: '470 kg' },
          { name: 'Gioăng EPDM', spec: 'cuộn 100m', qty: '300 m' }
        ],
        timeMin: 90, timeText: '90 phút chạy',
        packaging: { mode: 'roll', perRoll: 4, rolls: 12, coreMM: 76, perCarton: 0, cartons: 0 },
        floor: { specs: { khoThanhPham: '1.000×1.600 mm', khoTrai: 'kiện 4 cánh', giay: 'Nhôm Luxanode 121', soMau: '2 cánh', soBanKem: 4, giaCong: 'Lắp kính · kiện 4 cánh' } },
        note: 'Đơn mới — thiếu nhôm Luxanode 121, chờ mua + phát hành'
      }),
      // ===== Bài lô rời cùng hệ nhôm/số cánh — ứng viên GỘP LÔ (ganging) =====
      mk({
        id: 'LSX-0362', orderId: 'DH-0324', customer: 'Nhôm kính Đại Phát', product: 'Cửa thuỷ lực hệ 120 · 2 cánh (đợt KM)', productCode: 'S1OS00502',
        tech: 'offset', size: '1.480×2.100mm', qty: 16, machine: 'CAT-01 · WEIKE 2 đầu', machineIn: 'Chuyền cắt 1',
        dateReceived: '19/06/2026', dateWarehouse: '23/06/2026', dateDelivery: '24/06/2026', seq: 32, approved: false,
        lifecycle: 'du-thao',
        bom: [
          { name: 'Thanh nhôm hệ thuỷ lực 120 (6063-T5)', spec: 'Cây 5,8m', qty: '1.000 kg (gồm hao)' },
          { name: 'Ke góc & vít inox (bộ)', spec: 'bộ/1 cánh', qty: '32 bộ' },
          { name: 'Keo silicon trung tính', spec: 'tuýp 300ml', qty: '34 tuýp' }
        ],
        timeMin: 70, timeText: '70 phút máy',
        floor: { specs: { khoThanhPham: '1.480×2.100 mm', khoTrai: '1.480×2.100 mm', giay: 'Nhôm hệ 120 (6063-T5)', soMau: '2 cánh', soBanKem: 4, giaCong: 'Phay đố · Ép góc' } },
        note: 'Đơn mới — có thể gộp lô với các bài nhôm hệ 120 khác'
      }),
      mk({
        id: 'LSX-0363', orderId: 'DH-0325', customer: 'ĐL Nhôm kính Minh Anh', product: 'Cửa thuỷ lực hệ 120 · 2 cánh (quà khai trương)', productCode: 'S2OS00461',
        tech: 'offset', size: '900×2.200mm', qty: 9, machine: 'CAT-01 · WEIKE 2 đầu', machineIn: 'Chuyền cắt 1',
        dateReceived: '19/06/2026', dateWarehouse: '28/06/2026', dateDelivery: '30/06/2026', seq: 33, approved: false,
        lifecycle: 'du-thao',
        bom: [
          { name: 'Thanh nhôm hệ thuỷ lực 120 (6063-T5)', spec: 'Cây 5,8m', qty: '560 kg (gồm hao)' },
          { name: 'Ke góc & vít inox (bộ)', spec: 'bộ/1 cánh', qty: '18 bộ' },
          { name: 'Keo silicon trung tính', spec: 'tuýp 300ml', qty: '20 tuýp' }
        ],
        timeMin: 35, timeText: '35 phút máy',
        floor: { specs: { khoThanhPham: '900×2.200 mm', khoTrai: '900×2.200 mm', giay: 'Nhôm hệ 120 (6063-T5)', soMau: '2 cánh', soBanKem: 4, giaCong: 'Phay đố · Bọc màng' } },
        note: 'Đơn mới — SL nhỏ, nên gộp lô để giảm thời gian gá dao phay'
      }),
      mk({
        id: 'LSX-0364', orderId: 'DH-0326', customer: 'ĐL Owin Hoàng Long', product: 'Cửa thuỷ lực hệ 120 · 2 cánh (đợt lẻ)', productCode: 'S3OS00012',
        tech: 'offset', size: '2.100×2.400mm', qty: 12, machine: 'CAT-01 · WEIKE 2 đầu', machineIn: 'Chuyền cắt 1',
        dateReceived: '19/06/2026', dateWarehouse: '28/06/2026', dateDelivery: '30/06/2026', seq: 34, approved: false,
        lifecycle: 'du-thao',
        bom: [
          { name: 'Thanh nhôm hệ thuỷ lực 120 (6063-T5)', spec: 'Cây 5,8m', qty: '740 kg (gồm hao)' },
          { name: 'Ke góc & vít inox (bộ)', spec: 'bộ/1 cánh', qty: '24 bộ' },
          { name: 'Keo silicon trung tính', spec: 'tuýp 300ml', qty: '26 tuýp' }
        ],
        timeMin: 45, timeText: '45 phút máy',
        floor: { specs: { khoThanhPham: '2.100×2.400 mm', khoTrai: '2.100×2.400 mm', giay: 'Nhôm hệ 120 (6063-T5)', soMau: '2 cánh', soBanKem: 4, giaCong: 'Phay đố · Lắp kính' } },
        note: 'Đơn mới — gộp lô cùng nhôm hệ 120, 2 cánh'
      })
    ];
  }

  // Mã công nghệ nhúng trong mã SP & mã lệnh SX (tiền tố mã SP mới)
  var TECH_CODE = { offset: 'OS', flexo: 'FX', digital: 'DG', digitalSheet: 'DG', wideFormat: 'DG' };

  // Suy kích thước hiển thị từ state (cánh: mm, cửa thuỷ lực/uốn vòm: cm, nhôm thanh xá: m)
  function dimText(state) {
    var s = state || {};
    if (global.PricingEngine.typeOf(s) === 'wideFormat') return (s.pieceW || 0) + 'x' + (s.pieceH || 0) + 'm';
    if (global.PricingEngine.isRoll(s)) return (s.labelL || 0) + 'x' + (s.labelW || 0) + 'mm';
    return (s.finishedW || 0) + 'x' + (s.finishedH || 0) + (s.finishedD ? 'x' + s.finishedD : '') + 'cm';
  }

  function seedProducts() {
    // o: { code, name, customer, type, size, colors, file(bool→TRONG KHO), die, note, sample(bool→CHỜ), sampleDate, over }
    function mk(o) {
      var type = o.type || 'flexo';
      var over = o.over || {};
      if (o.colors != null) over.colors = o.colors;
      // gán kích thước cánh từ size (mm) cho hệ trượt quay/mở quay — uốn vòm & nhôm thanh xá dùng over riêng
      if ((type === 'flexo' || type === 'digital') && o.size) {
        var d = String(o.size).replace(/mm|cm/gi, '').split(/x/i).map(parseFloat);
        if (d[0]) over.labelL = d[0];
        if (d[1]) over.labelW = d[1];
      }
      var st = mkState(over, type);
      return {
        code: o.code, name: o.name, customer: o.customer,
        type: global.PricingEngine.typeOf(st),
        typeLabel: global.PricingEngine.typeLabel(st),
        specText: global.PricingEngine.specText(st),
        state: st,
        size: o.size || dimText(st),
        colors: (o.colors != null ? o.colors : st.colors) || '',
        fileStatus: o.file ? 'trong-kho' : '',
        dieCode: o.die || '',
        sampleStatus: o.sample ? 'cho' : '',
        sampleDate: o.sampleDate || '',
        note: o.note || '', createdFrom: 'seed',
        prod: o.prod || {}, infoComplete: (o.infoComplete !== false)
      };
    }
    return [
      // ===== QLĐH OANH (S1) =====
      mk({ code: 'S1FX00001', name: 'Cửa trượt quay 93 · 4 cánh ghi xám', customer: 'SUN GROUP HẠ LONG', type: 'flexo', size: '1400x2400mm', colors: 4, file: true, die: 'F01258', note: 'dao phay 917', sample: true }),
      mk({ code: 'S1FX00002', name: 'Cửa trượt quay 93 · 6 cánh vân gỗ trắc', customer: 'ĐL Owin Mai Thư', type: 'flexo', size: '2100x2400mm' }),
      mk({ code: 'S1FX00003', name: 'Cửa sổ mở lùa 76 Luxanode · 2 cánh (7 mẫu)', customer: 'NHÔM KÍNH NAM TIẾN', type: 'flexo', size: '1200x1400mm', colors: 7 }),
      mk({ code: 'S1FX00004', name: 'Cửa sổ mở quay Luxanode 121 · 2 cánh', customer: 'NT XÂY DỰNG HOÀNG GIA', type: 'flexo', size: '1200x1400mm', colors: 5, file: true, die: 'F01370', note: 'Dao phay 604' }),
      mk({ code: 'S1FX00005', name: 'Vách kính khung nhôm Luxanode', customer: 'SUN GROUP HẠ LONG', type: 'flexo', size: '1800x2600mm' }),
      mk({ code: 'S1FX00008', name: 'Cửa đi mở lùa 121 Luxanode · 4 cánh', customer: 'ĐL OWIN NGHỆ AN', type: 'flexo', size: '2400x2400mm' }),
      mk({ code: 'S1FX00010', name: 'Hệ chấn song kết hợp phào Owin', customer: 'KÍNH VIỆT NHẬT HẢI LONG', type: 'flexo', size: '900x1400mm', file: true, die: 'F00662' }),
      mk({ code: 'S1OS00014', name: 'Cửa nhôm tấm tổ ong 2 cánh', customer: 'ĐL Owin Đức Nhân', type: 'offset', size: '900x2200mm', over: { finishedW: 90, finishedH: 220, quantity: 25 } }),
      mk({ code: 'S1OS00140', name: 'Cửa thuỷ lực hệ 120 · 2 cánh vân gỗ trắc', customer: 'Nhôm kính Đại Phát', type: 'offset', size: '160x240cm', over: { quantity: 12, finishedW: 160, finishedH: 240, finishedD: 0 }, note: 'Vân gỗ trắc · bản lề thuỷ lực Đức' }),

      // ===== QLĐH NGA (S2) =====
      mk({ code: 'S2FX01943', name: 'OW-TQ93-4C_Cửa trượt quay 93 4 cánh', customer: 'VINHOMES OCEAN PARK', type: 'flexo', size: '1600x2400mm' }),
      mk({ code: 'S2FX02000', name: 'OW-LUX76-2C_Cửa sổ mở lùa 76 Luxanode', customer: 'VINHOMES OCEAN PARK', type: 'flexo', size: '1400x1500mm' }),
      mk({ code: 'S2OS02001', name: 'Cửa thuỷ lực hệ 180 · 4 cánh vân gỗ hương', customer: 'ĐL OWIN THÁI BÌNH', type: 'offset', size: '320x240cm', over: { finishedW: 320, finishedH: 240 } }),
      mk({ code: 'S2FX02002', name: 'OW-LUX121-4C_Cửa đi mở lùa 121 Luxanode', customer: 'ĐL OWIN HẢI DƯƠNG', type: 'flexo', size: '2400x2400mm', file: true, die: 'F01585' }),
      mk({ code: 'S2OS02003', name: 'OW-VOM120-2C_Cửa vòm nhôm uốn hệ 120', customer: 'VINHOMES OCEAN PARK', type: 'offset', size: '160x240cm', over: { finishedW: 160, finishedH: 240 } }),
      mk({ code: 'S2FX02004', name: 'OW-TL120-2C_Cửa thuỷ lực 120 2 cánh', customer: 'VINHOMES OCEAN PARK', type: 'flexo', size: '1600x2400mm', file: true, die: 'F01230', note: 'Dao phay 784, ke góc 1905' }),
      mk({ code: 'S2OS02011', name: 'Tủ bếp nhôm nội thất Omega (bộ 4,5m)', customer: 'ĐL OWIN HƯNG YÊN', type: 'offset', size: '450x220cm', over: { finishedW: 450, finishedH: 220 } }),
      mk({ code: 'S2FX02012', name: 'Nhôm thanh hệ 120 (bán xá theo kg)', customer: 'NHÔM KÍNH PHƯƠNG TRANG', type: 'flexo', size: 'cây 5,8m · 6063-T5' }),

      // ===== QLĐH NHUNG (S3) =====
      mk({ code: 'S3OS00001', name: 'Cửa thuỷ lực hệ 120 · 2 cánh (dự án Đại Phúc)', customer: 'NHÔM KÍNH ĐẠI PHÚC', type: 'offset', size: '180x240cm', over: { finishedW: 180, finishedH: 240, finishedD: 0 } }),
      mk({ code: 'S3OS00002', name: 'Cửa vòm nhôm uốn hệ 120 · 2 cánh (dự án Đại Phúc)', customer: 'NHÔM KÍNH ĐẠI PHÚC', type: 'offset', size: '150x230cm', over: { finishedW: 150, finishedH: 230, finishedD: 0 } }),
      mk({ code: 'S3FX00003', name: 'OW-CS76-2C_Cửa sổ mở quay 76 · 2 cánh', customer: 'NHÔM KÍNH HGP', type: 'flexo', size: '1200x2200mm' }),
      mk({ code: 'S3FX00004', name: 'Vách kính khung nhôm Luxanode (J0202-009439)', customer: 'NHÔM KÍNH HGP', type: 'flexo', size: '1200x2200mm' }),
      mk({ code: 'S3FX00008', name: 'Cửa sổ mở lùa 76 Luxanode (J0202-008859)', customer: 'NHÔM KÍNH HGP', type: 'flexo', size: '1000x1600mm' }),
      mk({ code: 'S3FX00012', name: 'Hệ chấn song + phào Owin (J0202-008517)', customer: 'NHÔM KÍNH HGP', type: 'flexo', size: '1000x1600mm' }),

      // ===== UỐN VÒM / ĐƠN LẺ (DG) — gia công vòm theo mét / cửa vòm lẻ =====
      mk({ code: 'DG00310', name: 'Dịch vụ uốn vòm nhôm (gia công theo mét)', customer: 'Nhôm kính Đại Phát', type: 'digitalSheet', size: 'md · R800–R3000', colors: 2,
        over: { finishedW: 90, finishedH: 55, spreadW: 90, spreadH: 55, quantity: 120, ke: 24, sides: 2 } }),
      mk({ code: 'DG00311', name: 'Cửa vòm nhôm uốn hệ 120 · đơn lẻ', customer: 'ĐL Owin Hoàng Long', type: 'digitalSheet', size: '160x240cm', colors: 2,
        over: { finishedW: 160, finishedH: 240, spreadW: 160, spreadH: 240, quantity: 6, ke: 4, sides: 2, paperName: 'Nhôm hệ 120 (6063-T5)', paperRate: 78500 } }),

      // ===== NHÔM THANH BÁN XÁ (DG) — profile theo kg / gói dàn máy =====
      mk({ code: 'DG00312', name: 'Nhôm thanh Luxanode 121 (bán xá theo kg)', customer: 'ĐL Owin Hoàng Long', type: 'wideFormat', size: 'cây 5,8m · lô 2 tấn',
        over: { pieceW: 0.8, pieceH: 2.0, quantity: 2, materialName: 'Nhôm thanh Luxanode 121', grommets: 0, frameName: 'Gói chuyển giao dàn máy WEIKE', frameRate: 180000 } }),
      mk({ code: 'DG00313', name: 'Dàn máy làm cửa nhôm WEIKE (gói chuyển giao)', customer: 'VINHOMES OCEAN PARK', type: 'wideFormat', size: 'gói dàn máy 5 cụm',
        over: { pieceW: 3.0, pieceH: 1.0, quantity: 5, materialName: 'Dàn máy WEIKE (5 cụm)', grommets: 8 } })
    ];
  }

  // Mã SP kế tiếp: tiền tố theo CÔNG NGHỆ + số chạy, tiếp nối số lớn nhất của cùng công nghệ
  // (khớp cả mã cũ S1OS00140 lẫn mã mới OS00141). VD offset đang max …OS00140 → kế tiếp OS00141.
  function nextProductId(type) {
    var tc = TECH_CODE[type] || 'OS';
    var seq = 0;
    var re = new RegExp(tc + '(\\d+)$');
    (data.products || []).forEach(function (p) {
      var m = re.exec(p.code || ''); if (m) seq = Math.max(seq, parseInt(m[1], 10));
    });
    return tc + ('00000' + (seq + 1)).slice(-5);
  }

  function productByCode(code) { return (data.products || []).filter(function (p) { return p.code === code; })[0] || null; }

  // id LSX DUY NHẤT (1 đơn có thể đẻ nhiều LSX → không dùng nextLSXId cố định theo số đơn)
  function nextLSXIdUnique() {
    var max = 0;
    (data.lsx || []).forEach(function (l) { var m = /LSX-0*(\d+)/.exec(l.id || ''); if (m) max = Math.max(max, parseInt(m[1], 10)); });
    return 'LSX-0' + (max + 1);
  }

  // ---- Bộ trường spec sản xuất — ĐIỀN ĐỦ Ở BƯỚC TÍNH GIÁ (PTG), tách theo bộ phận ----
  var PROD_SPEC_DEPTS = [
    { id: 'ky-thuat', l: 'Kỹ thuật' }, { id: 'kho', l: 'Kho' }, { id: 'che-ban', l: 'Lập trình CNC' }
  ];
  var PROD_SPEC = {
    roll: [   // cửa trượt quay & cửa sổ mở quay — theo dữ liệu nhập thực tế
      { k: 'soMau', l: 'Số cánh', dept: 'ky-thuat', req: true },
      { k: 'soBan', l: 'Số bộ dao phay', dept: 'ky-thuat', req: true },
      { k: 'cnIn', l: 'Hệ nhôm sử dụng', dept: 'ky-thuat', req: true },
      { k: 'cnBe', l: 'Kiểu mở (trượt/quay)', dept: 'ky-thuat', req: true },
      { k: 'buocNhay', l: 'Bước ray trượt (mm)', dept: 'ky-thuat', req: true },
      { k: 'soKhuonKho', l: 'Số ray / bánh xe', dept: 'ky-thuat', req: true },
      { k: 'soKhuonBuoc', l: 'Số ke góc / cánh', dept: 'ky-thuat', req: true },
      { k: 'kcKhuon', l: 'K/C giữa các đố (mm)', dept: 'ky-thuat' },
      { k: 'pcsKho', l: 'Số cánh / khung', dept: 'ky-thuat' },
      { k: 'nvl', l: 'Nguyên vật liệu', dept: 'kho', req: true },
      { k: 'phu', l: 'Xử lý bề mặt (anod / sơn tĩnh điện)', dept: 'kho', req: true },
      { k: 'fsc', l: 'CO/CQ nhôm 6063-T5', dept: 'kho' },
      { k: 'quyCach', l: 'Quy cách', dept: 'kho', req: true },
      { k: 'loi', l: 'Kích thước kính', dept: 'kho', req: true },
      { k: 'khoGiay', l: 'Khổ phủ bì (mm)', dept: 'kho', req: true },
      { k: 'bienGiay', l: 'Dung sai lắp (mm)', dept: 'kho' },
      { k: 'pcsCuon', l: 'Số cánh / kiện', dept: 'kho' },
      { k: 'metCuon', l: 'Số kg nhôm / bộ', dept: 'kho' },
      { k: 'maKhuon', l: 'Mã bộ dao phay', dept: 'che-ban', req: true },
      { k: 'linkFile', l: 'Link bản vẽ đã duyệt', dept: 'che-ban', req: true },
      { k: 'ngayXuatBan', l: 'Ngày ban hành', dept: 'che-ban', req: true },
      { k: 'mucIn', l: 'Thông số phụ kiện', dept: 'che-ban' }
    ],
    sheet: [  // cửa thuỷ lực / uốn vòm / nhôm thanh bán xá
      { k: 'khoTP', l: 'Quy cách thành phẩm', dept: 'ky-thuat', req: true },
      { k: 'khoTrai', l: 'Quy cách đóng kiện', dept: 'ky-thuat', req: true },
      { k: 'soMau', l: 'Số cánh', dept: 'ky-thuat', req: true },
      { k: 'soKem', l: 'Số bộ dao phay', dept: 'ky-thuat', req: true },
      { k: 'tayKe', l: 'Quy cách (m²/bộ)', dept: 'ky-thuat' },
      { k: 'giaCong', l: 'Gia công', dept: 'ky-thuat', req: true },
      { k: 'giay', l: 'Hệ nhôm + độ dày', dept: 'kho', req: true },
      { k: 'khoGiay', l: 'Khổ nhôm (cây 5,8m)', dept: 'kho', req: true },
      { k: 'linkFile', l: 'Bản vẽ (đã duyệt)', dept: 'che-ban', req: true }
    ]
  };
  function prodSpecFields(tech) { return (tech === 'flexo' || tech === 'digital') ? PROD_SPEC.roll : PROD_SPEC.sheet; }
  // hoàn thiện theo 1 bộ thông tin (prod) + công nghệ
  function specCompleteBy(prod, tech) {
    prod = prod || {};
    return prodSpecFields(tech).filter(function (f) { return f.req; })
      .every(function (f) { return String(prod[f.k] != null ? prod[f.k] : '').trim() !== ''; });
  }
  function ptgTech(ptg) { return (ptg && ptg.state) ? global.PricingEngine.typeOf(ptg.state) : 'offset'; }
  function ptgSpecComplete(ptg) { return !!ptg && specCompleteBy(ptg.prod, ptgTech(ptg)); }
  function ptgById(id) { return (data.ptg || []).filter(function (p) { return p.id === id; })[0] || null; }
  // hoàn thiện của 1 sản phẩm master (giữ cho hiển thị LSX/seed) — đọc cờ hoặc prod
  function isProdComplete(p) {
    if (!p) return false;
    if (p.infoComplete === true) return true;
    return specCompleteBy(p.prod, p.type);
  }

  // BG tham chiếu PTG; giá vốn KHÓA theo PTG. version chỉ khác lớp thương mại.
  function seedBG() {
    return [
      {
        id: 'BG-2026-0519', ptgId: 'PTG-2026-0203', customer: 'ĐL Nhôm kính Minh Anh',
        product: 'Cửa thuỷ lực hệ 180 · 4 cánh vân gỗ hương', status: 'đã gửi', currentVersion: 1,
        sendInfo: { channel: 'email', sentDate: '09/05/2026', validityDays: 30, lastContact: '' },
        versions: [
          { v: 1, markup: 30, status: 'đã gửi', date: '09/05/2026', createdBy: 'Trần Thị B', validityDays: 30,
            note: 'Đã gửi khách, đang chờ phản hồi.', terms: 'Giao & lắp tại công trình. Thanh toán 100% sau nghiệm thu. Hiệu lực 30 ngày.' }
        ]
      },
      {
        id: 'BG-2026-0513', ptgId: 'PTG-2026-0205', customer: 'ĐL Owin Hoàng Long',
        product: 'Cửa trượt quay 93 · 4 cánh ghi xám', status: 'đã gửi', currentVersion: 1,
        sendInfo: { channel: 'zalo', sentDate: '16/05/2026', validityDays: 15, lastContact: '' },
        versions: [
          { v: 1, markup: 28, status: 'đã gửi', date: '16/05/2026', createdBy: 'Lê Văn C', validityDays: 15,
            note: 'Vừa gửi khách.', terms: 'Cọc 50%. Hiệu lực 15 ngày.' }
        ]
      },
      {
        id: 'BG-2026-0518', ptgId: 'PTG-2026-0204', customer: 'Nhôm kính Đại Phát',
        product: 'Cửa thuỷ lực hệ 120 · 2 cánh vân gỗ trắc', status: 'nháp', currentVersion: 1,
        versions: [
          { v: 1, markup: 25, status: 'nháp', date: 'hôm nay', createdBy: 'Nguyễn Văn A',
            note: 'Sales đang áp biên. KH VIP nên cần cấp trên duyệt trước khi gửi.', terms: 'Giao tại kho Q7. Cọc 50%, 50% sau giao. Hiệu lực 15 ngày.' }
        ],
        activity: [
          { type: 'create', text: 'Tạo báo giá v1 từ PTG-2026-0204', date: 'hôm nay', by: 'Nguyễn Văn A' }
        ]
      },
      {
        id: 'BG-2026-0517', ptgId: 'PTG-2026-0204', customer: 'Nhôm kính Đại Phát',
        product: 'Cửa thuỷ lực hệ 120 · 2 cánh vân gỗ trắc', status: 'nháp', appr: 'chờ', currentVersion: 3,
        versions: [
          { v: 1, markup: 30, status: 'đã gửi', date: '10/05/2026', createdBy: 'Nguyễn Văn A',
            note: 'Bản chào giá gốc.', terms: 'Giao tại công trình Q7. Cọc 50%. Hiệu lực 15 ngày.' },
          { v: 2, markup: 27, status: 'đã gửi', date: '13/05/2026', createdBy: 'Nguyễn Văn A',
            note: 'Khách xin giảm giá đợt 1 (so bảng giá m²).', terms: 'Giao tại công trình Q7. Cọc 50%. Hiệu lực 15 ngày.' },
          { v: 3, markup: 25, status: 'nháp', date: '17/05/2026', createdBy: 'Nguyễn Văn A',
            note: 'Đổi sang nhôm hệ 120 dày 2,0mm theo yêu cầu KH, chốt markup 25%. Gửi cấp trên duyệt.', terms: 'Giao tại công trình Q7. Cọc 50%, 50% sau lắp đặt. Hiệu lực 15 ngày.' }
        ],
        activity: [
          { type: 'create', text: 'Tạo phiên bản v1 · Bản chào giá gốc.', date: '10/05/2026', by: 'Nguyễn Văn A' },
          { type: 'send',   text: 'Gửi khách v1', date: '10/05/2026', by: 'Nguyễn Văn A' },
          { type: 'create', text: 'Tạo phiên bản v2 · Khách xin giảm giá đợt 1.', date: '13/05/2026', by: 'Nguyễn Văn A' },
          { type: 'send',   text: 'Gửi khách v2', date: '13/05/2026', by: 'Nguyễn Văn A' },
          { type: 'create', text: 'Tạo phiên bản v3 · Đổi sang nhôm hệ 120 dày 2,0mm theo yêu cầu KH, chốt markup 25%.', date: '17/05/2026', by: 'Nguyễn Văn A' },
          { type: 'send',   text: 'Sales gửi cấp trên duyệt báo giá', date: '17/05/2026', by: 'Sales' }
        ]
      },
      {
        id: 'BG-2026-0516', ptgId: 'PTG-2026-0203', customer: 'ĐL Nhôm kính Minh Anh',
        product: 'Cửa thuỷ lực hệ 180 · 4 cánh vân gỗ hương', status: 'duyệt', currentVersion: 1,
        deal: { confirmedDate: '12/05/2026', channel: 'email', channelOther: '', deliveryDate: '28/05/2026', contractMode: 'mua_ban', contractId: 'HD-2026-002', depositPct: 50 },
        versions: [
          { v: 1, markup: 28, status: 'duyệt', date: '12/05/2026', createdBy: 'Trần Thị B', validityDays: 30,
            note: 'Khách duyệt màu vân gỗ trắc, chốt ngay bản đầu.', terms: 'Giao & lắp tại công trình. Thanh toán 100% sau nghiệm thu. Hiệu lực 30 ngày.' }
        ]
      },
      {
        id: 'BG-2026-0515', ptgId: 'PTG-2026-0206', customer: 'Nhôm kính Đại Phát',
        product: 'Cửa sổ mở quay Luxanode 121 · 2 cánh', status: 'chuyển đơn', currentVersion: 2, orderId: 'DH-0301',
        deal: { confirmedDate: '14/05/2026', channel: 'email', deliveryDate: '22/05/2026', contractMode: 'nguyen_tac', contractId: 'HD-2026-001', depositPct: 50 },
        versions: [
          { v: 1, markup: 35, status: 'đã gửi', date: '08/05/2026', createdBy: 'Nguyễn Văn A',
            note: 'Bản gốc.', terms: 'Cọc 50%. Hiệu lực 15 ngày.' },
          { v: 2, markup: 32, status: 'chuyển đơn', date: '14/05/2026', createdBy: 'Nguyễn Văn A',
            note: 'Chốt giá theo m², đã chuyển thành DH-0301.', terms: 'Cọc 50%, 50% sau giao. Hiệu lực 15 ngày.' }
        ]
      },
      {
        id: 'BG-2026-0514', ptgId: 'PTG-2026-0205', customer: 'ĐL Owin Hoàng Long',
        product: 'Cửa trượt quay 93 · 4 cánh ghi xám', status: 'nháp', currentVersion: 1,
        versions: [
          { v: 1, markup: 30, status: 'nháp', date: '17/05/2026', createdBy: 'Lê Văn C',
            note: 'Đang soạn, chờ duyệt PTG.', terms: 'Cọc 50%. Hiệu lực 15 ngày.' }
        ]
      },
      {
        id: 'BG-2026-0511', ptgId: 'PTG-2026-0202', customer: 'ĐL Nhôm kính Minh Anh',
        product: 'Cửa thuỷ lực hệ 120 · 2 cánh vân gỗ hương', status: 'từ chối', currentVersion: 2,
        lossInfo: { reasonCat: 'Chọn NCC khác', competitor: 'Nhôm kính Thành Công', note: 'Giá thấp hơn ~8%, hứa lắp nhanh hơn.' },
        versions: [
          { v: 1, markup: 33, status: 'đã gửi', date: '02/05/2026', createdBy: 'Trần Thị B',
            note: 'Bản gốc.', terms: 'Cọc 50%. Hiệu lực 15 ngày.' },
          { v: 2, markup: 29, status: 'từ chối', date: '06/05/2026', createdBy: 'Trần Thị B',
            note: 'Khách chọn xưởng nhôm kính khác, từ chối.', terms: 'Cọc 50%. Hiệu lực 15 ngày.' }
        ]
      },
      {
        id: 'BG-2026-0541', ptgId: 'PTG-2026-0203', customer: 'VINHOMES OCEAN PARK',
        product: 'Cửa vòm nhôm uốn hệ 120 · 2 cánh', status: 'chốt đơn', currentVersion: 2,
        sendInfo: { channel: 'email', sentDate: '05/06/2026', validityDays: 20, lastContact: '09/06/2026' },
        versions: [
          { v: 1, markup: 34, status: 'đã gửi', date: '05/06/2026', createdBy: 'Nga',
            note: 'Báo giá 24 bộ cửa vòm uốn hệ 120 cho khu biệt thự đảo.',
            terms: 'Giao & lắp tại công trình. Cọc 30%, 70% sau giao. Hiệu lực 20 ngày.' },
          { v: 2, markup: 31, status: 'chốt đơn', date: '09/06/2026', createdBy: 'Nga',
            note: 'Khách duyệt màu vân gỗ trắc, chốt 24 bộ × 19.700.000 ₫ → chuyển đơn DH-0370.',
            terms: 'Giao & lắp tại công trình. Cọc 30%, 70% sau giao. Hiệu lực 20 ngày.' }
        ]
      },
      {
        id: 'BG-2026-0542', ptgId: 'PTG-2026-0202', customer: 'ĐL OWIN HƯNG YÊN',
        product: 'Cửa thuỷ lực hệ 120 · 2 cánh vân gỗ trắc + Cửa sổ mở quay Luxanode 121',
        status: 'chốt đơn', currentVersion: 1,
        sendInfo: { channel: 'zalo', sentDate: '08/06/2026', validityDays: 15, lastContact: '12/06/2026' },
        versions: [
          { v: 1, markup: 28, status: 'chốt đơn', date: '08/06/2026', createdBy: 'Nga',
            note: 'Đại lý gộp 8 bộ cửa thuỷ lực + 60 m² cửa sổ Luxanode → chuyển đơn DH-0371.',
            terms: 'Giao tại kho đại lý. Cọc 30%, 70% trước khi xuất hàng. Hiệu lực 15 ngày.' }
        ]
      }
    ];
  }

  // ---------------- PERSIST ----------------
  var mem = null; // fallback RAM khi localStorage bị chặn

  function load() {
    var raw = null;
    try { raw = global.localStorage.getItem(KEY); } catch (e) { raw = null; }
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (!parsed.contracts) parsed.contracts = seedContracts();
        if (parsed.bg) parsed.bg = parsed.bg.filter(function (b) { return !b.quick; });   // gỡ báo giá nhanh cũ
        return parsed;
      } catch (e) { /* fall through */ }
    }
    if (mem) {
      if (!mem.contracts) mem.contracts = seedContracts();
      if (mem.bg) mem.bg = mem.bg.filter(function (b) { return !b.quick; });
      return mem;
    }
    return { ptg: seedPTG(), bg: seedBG(), contracts: seedContracts() };
  }

  function persist(data) {
    mem = data;
    try { global.localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* RAM only */ }
  }

  // Vá số liệu seed đã chốt vào localStorage cũ (không phá state phiên hiện có).
  // Idempotent: chỉ chạm bản ghi còn ở giá trị cũ.
  function migrate(d) {
    if (d && d.lsx) d.lsx.forEach(function (l) {
      if (l.id === 'LSX-0370' && l.qty === 22 && l.qtyStock == null) { l.qty = 24; l.qtyStock = 2; }
      if (l.id === 'LSX-0370' && l.qtyStock == null) l.qtyStock = 91;
    });
    // Đơn DH-0370 (nguồn của LSX-0370 dự thảo) — chèn nếu localStorage cũ chưa có
    if (d && d.orders && !d.orders.some(function (o) { return o.id === 'DH-0370'; })) {
      var o370 = seedOrders().filter(function (o) { return o.id === 'DH-0370'; })[0];
      if (o370) d.orders.push(o370);
    }
    return d;
  }

  var data = migrate(load());
  persist(data); // chuẩn hóa ngay

  // ---------------- API ----------------
  function fmtCurrencyShort(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(2).replace('.', ',') + ' tỷ';
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace('.', ',') + 'tr';
    if (n >= 1e3) return Math.round(n / 1e3) + 'K';
    return Math.round(n).toString();
  }

  var ACTIVITY_META = {
    create:  { icon: 'git-branch', cls: 'steel' },
    send:    { icon: 'send',       cls: 'steel' },
    approve: { icon: 'check',      cls: 'moss'  },
    reject:  { icon: 'x',          cls: 'signal'},
    convert: { icon: 'arrow-right',cls: 'rust'  },
    edit:    { icon: 'pencil',     cls: 'ash'   },
    handoff: { icon: 'arrow-left-right', cls: 'steel'  },
    order:   { icon: 'package',          cls: 'rust'   }
  };

  var STATUS_META = {
    // PTG
    'nháp':         { cls: 'badge-orange', label: 'Nháp' },
    'chờ thiết kế': { cls: 'badge-orange', label: 'Chờ thiết kế' },
    'đã tính giá':  { cls: 'badge-steel',  label: 'Đã tính giá – chờ Sales' },
    'đã duyệt':     { cls: 'badge-moss',   label: 'Đã duyệt' },
    // BG (pipeline — 5 trạng thái; cổng duyệt nội bộ là nhãn phụ, xem APPR_META)
    'đã gửi':       { cls: 'badge-steel',  label: 'Đã gửi khách' },
    'duyệt':        { cls: 'badge-moss',   label: 'Khách chốt' },
    'chuyển đơn':   { cls: 'badge-rust',   label: 'Đã lên đơn' },
    'từ chối':      { cls: 'badge',        label: 'Khách từ chối' },
    // HD (Hợp đồng)
    'chờ ký':       { cls: 'badge-orange', label: 'Chờ ký' },
    'đã ký':        { cls: 'badge-moss',   label: 'Đã ký' },
    'hết hạn':      { cls: 'badge',        label: 'Hết hạn' },
    'thanh lý':     { cls: 'badge-steel',  label: 'Đã thanh lý' }
    ,
    // LSX (Lệnh sản xuất)
    'chờ SX':  { cls: 'badge-orange', label: 'Chờ sản xuất' },
    'đang SX': { cls: 'badge-steel',  label: 'Đang sản xuất' },
    'hoàn tất':{ cls: 'badge-moss',   label: 'Hoàn tất' },
    'hoàn thành':{ cls: 'badge-moss', label: 'Hoàn thành' }
  };

  // Cổng duyệt nội bộ — nhãn phụ gắn trên BG đang ở trạng thái 'nháp' (Soạn).
  // Chỉ có ý nghĩa khi bg.status === 'nháp'. '' = chưa gửi/không cần duyệt.
  var APPR_META = {
    'chờ':   { label: 'Chờ sếp duyệt',  cls: 'appr-wait', icon: 'clock' },
    'duyệt': { label: 'Sếp đã duyệt',   cls: 'appr-ok',   icon: 'shield-check' },
    'trả':   { label: 'Sếp trả lại',    cls: 'appr-back', icon: 'corner-up-left' }
  };

  function nextBGId() {
    var seq = 0;
    data.bg.forEach(function (b) { var m = /BG-2026-(\d+)/.exec(b.id); if (m) seq = Math.max(seq, parseInt(m[1], 10)); });
    return 'BG-2026-0' + (seq + 1);
  }

  var APPROVAL_THRESHOLD = { value: 200000000, qty: 50 };
  function customerByName(name) {
    return CUSTOMERS.filter(function (c) { return c.name === name; })[0] || null;
  }

  // ---- Mã đơn theo quy ước POM + mã KH(2 số) + ngày(YYMMDD) + STT(3 số) ----
  // VD: KH VINHOMES OCEAN PARK(#04) · 12/05/2026 · đơn 320 → POM04 260512 320
  function custCode2(name) {
    for (var i = 0; i < CUSTOMERS.length; i++) if (CUSTOMERS[i].name === name) return ('0' + (i + 1)).slice(-2);
    var h = 0, s = String(name || '');
    for (var j = 0; j < s.length; j++) h = (h * 31 + s.charCodeAt(j)) % 100;
    return ('0' + h).slice(-2);
  }
  function dmyDate(str) {
    var m = /(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(String(str || ''));
    if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
    return new Date(); // "hôm nay" / rỗng
  }
  function poCodeOf(order) {
    if (!order) return '';
    function p(n) { return (n < 10 ? '0' : '') + n; }
    var d = dmyDate(order.createdDate);
    var yymmdd = String(d.getFullYear()).slice(-2) + p(d.getMonth() + 1) + p(d.getDate());
    var num = (String(order.id || '').match(/\d+/) || ['0'])[0];
    return 'POM' + custCode2(order.customer || '') + yymmdd + ('00' + num).slice(-3);
  }

  function nextOrderIdStore() {
    var seq = 319;
    (data.orders || []).forEach(function (o) { var m = /DH-0*(\d+)/.exec(o.id || ''); if (m) seq = Math.max(seq, parseInt(m[1], 10)); });
    data.bg.forEach(function (b) { var m = /DH-0*(\d+)/.exec(b.orderId || ''); if (m) seq = Math.max(seq, parseInt(m[1], 10)); });
    return 'DH-0' + (seq + 1);
  }
  function nextLSXId(orderId) {
    var on = (/DH-0*(\d+)/.exec(orderId || '') || [])[1] || '000';
    return 'LSX-0' + on;
  }
  function buildLSX(bg, ptg, orderId, lsxId) {
    var plan = global.PricingEngine.productionPlan(ptg.state);
    var roll = global.PricingEngine.isRoll(ptg.state);
    var qty = (ptg.state && ptg.state.quantity) ? ptg.state.quantity : 0;
    var on = (/DH-0*(\d+)/.exec(orderId || '') || [])[1] || '000';
    var packaging;
    if (roll) {
      var perRoll = 4;
      packaging = { mode: 'roll', perRoll: perRoll, rolls: Math.ceil(qty / perRoll), coreMM: 76, perCarton: 0, cartons: 0 };
    } else {
      var perCarton = 2;
      packaging = { mode: 'carton', perCarton: perCarton, cartons: Math.ceil(qty / perCarton), perRoll: 0, rolls: 0, coreMM: 0 };
    }
    var tech = plan.type;
    var productCode = (ptg && ptg.productCode) || nextProductId(tech);
    return {
      id: lsxId, orderId: orderId, bgId: bg.id, ptgId: bg.ptgId,
      customer: bg.customer, product: bg.product, productCode: productCode,
      type: tech, tech: tech, size: global.PricingEngine.specText(ptg.state), priority: 'normal',
      machine: plan.machine, machineIn: plan.machine,
      qty: qty, bom: plan.materials, routing: plan.steps, timeMin: plan.timeMin, timeText: plan.timeText,
      dateReceived: 'hôm nay', dateWarehouse: '', dateDelivery: '',
      autoCode: buildAutoCode(tech, bg.customer, productCode, '', parseInt(on, 10) || 1),
      approval: { status: 'cho', by: '' },
      stages: stagesForLSX(productCode, tech),
      material: '', lamination: '', paperSize: '', printSides: '', postPress: '', sheets: 0, paperSource: '',
      packaging: packaging, lot: 'LOT-' + on, status: 'chờ SX', issuedBy: '', issuedAt: '', note: '',
      lifecycle: 'du-thao',
      transitions: [{ at: 'hôm nay', by: 'Hệ thống', machine: '', label: 'Tạo lệnh (dự thảo) từ ' + bg.id, type: 'gate', lifecycle: 'du-thao' }],
      activity: [{ type: 'create', text: 'Tự sinh LSX từ ' + bg.id, date: 'hôm nay', by: 'Hệ thống' }]
    };
  }

  // LSX NHIỀU SẢN PHẨM — tạo từ subset sản phẩm (đã đủ thông tin) của 1 đơn.
  // Routing/định mức lấy theo sản phẩm đầu (primary); products[] giữ đủ danh sách.
  function buildLSXFromProducts(order, prods) {
    var first = prods[0];
    var master = productByCode(first.code) || {};
    var state = master.state || global.PricingEngine.defaultState('offset');
    var plan = global.PricingEngine.productionPlan(state);
    var tech = global.PricingEngine.typeOf(state);
    var lsxId = nextLSXIdUnique();
    var totalQty = prods.reduce(function (s, p) { return s + (p.qty || 0); }, 0);
    var on = (/DH-0*(\d+)/.exec(order.id || '') || [])[1] || '000';
    var roll = global.PricingEngine.isRoll(state);
    var packaging = roll
      ? { mode: 'roll', perRoll: 4, rolls: Math.ceil(totalQty / 4), coreMM: 76, perCarton: 0, cartons: 0 }
      : { mode: 'carton', perCarton: 2, cartons: Math.ceil(totalQty / 2), perRoll: 0, rolls: 0, coreMM: 0 };
    return {
      id: lsxId, orderId: order.id, bgId: order.bgId || '', ptgId: first.ptgId || '',
      customer: order.customer,
      products: prods.map(function (p) {
        var m = productByCode(p.code) || {};
        var pt = ptgById(p.ptgId);
        return { code: p.code, name: p.name || m.name || '', qty: p.qty || 0, size: m.size || '', specText: m.specText || '', prod: (pt && pt.prod) ? pt.prod : (m.prod || {}) };
      }),
      product: first.name || master.name || '', productCode: first.code,
      type: tech, tech: tech, size: master.size || global.PricingEngine.specText(state), priority: 'normal',
      machine: plan.machine, machineIn: plan.machine,
      qty: totalQty, bom: plan.materials, routing: plan.steps, timeMin: plan.timeMin, timeText: plan.timeText,
      dateReceived: 'hôm nay', dateWarehouse: '', dateDelivery: order.deliveryDate || '',
      autoCode: buildAutoCode(tech, order.customer, first.code, '', parseInt(on, 10) || 1),
      approval: { status: 'cho', by: '' },
      stages: stagesForLSX(first.code, tech),
      material: '', lamination: '', paperSize: '', printSides: '', postPress: '', sheets: 0, paperSource: '',
      packaging: packaging, lot: 'LOT-' + on, status: 'chờ SX', issuedBy: '', issuedAt: '', note: '',
      lifecycle: 'du-thao',
      transitions: [{ at: 'hôm nay', by: 'Hệ thống', machine: '', label: 'Tạo lệnh (dự thảo) từ ' + order.id, type: 'gate', lifecycle: 'du-thao' }],
      activity: [{ type: 'create', text: 'Tạo LSX từ ' + prods.length + ' sản phẩm của ' + order.id, date: 'hôm nay', by: 'Hệ thống' }]
    };
  }

  // ============================================================
  //  LỚP SHOP-FLOOR — suy ra view Kanban / List từ LSX chuẩn (1 nguồn)
  //  Cho phép trang 04 (Theo dõi SX) & 06 (Lệnh sản xuất) dùng CHUNG dữ liệu
  //  với trang 19 (chi tiết) thay vì mỗi trang một mảng seed riêng.
  //  Mỗi LSX có thể gắn `floor:{...}` để override hiển thị (progress, cột,
  //  cảnh báo, KCS…); không có thì suy ra từ stages/bom/activity.
  // ============================================================
  var KANBAN_COLUMNS = [
    { id: 'ctp',  name: 'Chuẩn bị · Lập trình CNC', icon: 'printer',   machine: 'Bản vẽ · Dao phay · Lập trình CNC' },
    { id: 'print',name: 'Cắt & phay CNC',           icon: 'zap',          machine: 'Cắt nhôm 2 đầu · Phay đố · Phay khoá' },
    { id: 'lam',  name: 'Uốn vòm / Ép góc',     icon: 'layers',       machine: 'UON-01,02 · Máy ép góc EP-02' },
    { id: 'die',  name: 'Lắp khung / Lắp kính',      icon: 'scissors',     machine: 'Bàn lắp kính LAP-01' },
    { id: 'glue', name: 'Phụ kiện / Bọc màng / Đóng kiện', icon: 'package-2', machine: 'Tổ hoàn thiện – đóng kiện' },
    { id: 'kcs',  name: 'KCS',              icon: 'shield-check', machine: 'Phòng KCS nhôm kính 1,2' }
  ];
  // ánh xạ key công đoạn (STAGE_TEMPLATES) → cột kanban
  var STAGE_COL_MAP = {
    'xu-ly-file': 'ctp', 'thu-mua': 'ctp', 'kho-cap': 'ctp', 'in-lenh': 'ctp', 'cb-kem': 'ctp', 'che-ban': 'ctp', 'giay-ve': 'ctp',
    'in': 'print', 'in-phu': 'print', 'in-kts': 'print', 'in-kho-lon': 'print',
    'sau-in': 'lam', 'gia-cong': 'lam',
    'be': 'die', 'dong-goi': 'glue', 'nhap-kho': 'kcs'
  };

  // ============================================================
  //  ĐỊNH TUYẾN (ROUTE) — danh mục máy/work-center + roster thợ dùng chung.
  //  Số hoá từ danh mục máy trang 17 (rate/setup/khổ/số cánh) + bổ sung máy
  //  uốn vòm & ép góc. Mục 5 (điều độ công suất hữu hạn) sẽ tái dùng catalog này
  //  (đã có sẵn ratePerHour / setupMin / shiftHours).
  // ============================================================
  var WORKCENTERS = [
    { id: 'CNC-21', name: 'CNC-21 · Máy phay đố kẹp bàn WEIKE', dept: 'ctp', tech: ['*'],                        colors: 0, maxFormat: 'đố 30–120 mm', ratePerHour: 12,    rateUnit: 'lô', setupMin: 0,  shiftHours: 8 },
    { id: 'CAT-01',  name: 'CAT-01 · Máy cắt nhôm 2 đầu WEIKE', dept: 'print', tech: ['offset'],                  colors: 4, maxFormat: 'cây 5,8 m',   ratePerHour: 6,     rateUnit: 'bộ',   setupMin: 25, shiftHours: 8 },
    { id: 'CAT-02',  name: 'CAT-02 · Máy cắt nhôm 2 đầu WEIKE', dept: 'print', tech: ['offset'],                  colors: 5, maxFormat: 'cây 5,8 m',   ratePerHour: 6,     rateUnit: 'bộ',   setupMin: 35, shiftHours: 8 },
    { id: 'CNC-03', name: 'CNC-03 · Máy phay khoá CNC WEIKE', dept: 'print', tech: ['flexo'],                     colors: 6, maxFormat: 'khoá 30–50 mm',   ratePerHour: 8,     rateUnit: 'cánh', setupMin: 30, shiftHours: 8 },
    { id: 'CNC-22',   name: 'CNC-22 · Máy phay đố kẹp bàn WEIKE', dept: 'print', tech: ['digital', 'digitalSheet', 'wideFormat'], colors: 4, maxFormat: 'đố 30–120 mm', ratePerHour: 5, rateUnit: 'bộ', setupMin: 5, shiftHours: 8 },
    { id: 'UON-01',    name: 'UON-01 · Máy uốn vòm nhôm CNC 3 trục', dept: 'laminate', tech: ['*'],                 colors: 0, maxFormat: 'R800–R3000',  ratePerHour: 5,     rateUnit: 'md',  setupMin: 8,  shiftHours: 8 },
    { id: 'UON-02',    name: 'UON-02 · Máy uốn vòm nhôm thuỷ lực', dept: 'laminate', tech: ['*'],                   colors: 0, maxFormat: 'R600–R2500',  ratePerHour: 4,     rateUnit: 'md',  setupMin: 6,  shiftHours: 8 },
    { id: 'EP-02',   name: 'EP-02 · Máy ép góc cơ WEIKE',   dept: 'die',     tech: ['*'],                             colors: 0, maxFormat: 'khung 3,0×2,6 m', ratePerHour: 8,  rateUnit: 'cánh', setupMin: 20, shiftHours: 8 },
    { id: 'LAP-01',    name: 'LAP-01 · Bàn lắp kính & đóng kiện', dept: 'pack', tech: ['*'],                              colors: 0, maxFormat: '—',          ratePerHour: 0,     rateUnit: '',    setupMin: 0,  shiftHours: 8 }
  ];
  // Roster thợ — tên KHỚP owner trong STAGE_TEMPLATES để dropdown tự chọn đúng người mặc định.
  var WORKERS = [
    { name: 'Thiết kế',        dept: 'design' },
    { name: 'Nguyệt',          dept: 'thu-mua' },
    { name: 'Hơi',             dept: 'kho' },
    { name: 'Diệu',            dept: 'kho' },
    { name: 'An',              dept: 'ctp' },
    { name: 'Kiều',            dept: 'in' },
    { name: 'Trần Văn Tú',     dept: 'in' },
    { name: 'Nguyễn Văn Hải',  dept: 'in' },
    { name: 'Vi',              dept: 'gia-cong' },
    { name: 'Quý',             dept: 'ke-hoach' }
  ];
  // Công đoạn → nhóm MÁY hợp lệ ('' = công đoạn không cần máy, chỉ gán thợ)
  var STAGE_ROLE = {
    'cb-kem': 'ctp', 'che-ban': 'ctp',
    'in': 'print', 'in-phu': 'print', 'in-kts': 'print', 'in-kho-lon': 'print',
    'sau-in': 'laminate', 'gia-cong': 'laminate',
    'be': 'die', 'dong-goi': 'pack'
  };
  // Công đoạn → phòng/ban THỢ (để lọc dropdown thợ)
  var STAGE_WDEPT = {
    'xu-ly-file': 'design', 'thu-mua': 'thu-mua', 'kho-cap': 'kho', 'nhap-kho': 'kho', 'in-lenh': 'ke-hoach',
    'cb-kem': 'ctp', 'che-ban': 'ctp',
    'in': 'in', 'in-phu': 'in', 'in-kts': 'in', 'in-kho-lon': 'in',
    'sau-in': 'gia-cong', 'gia-cong': 'gia-cong', 'be': 'gia-cong', 'dong-goi': 'gia-cong'
  };

  // ============================================================
  //  DANH MỤC CÔNG ĐOẠN dùng chung — cho TRÌNH DỰNG ROUTE MỞ (người lập KH
  //  tự chọn/thêm/đổi thứ tự). Công đoạn KHÔNG cố định theo công nghệ; template
  //  chỉ là GỢI Ý ban đầu. role='' = không cần máy (chỉ gán thợ).
  // ============================================================
  var STAGE_CATALOG = [
    { key: 'xu-ly-file', name: 'Duyệt bản vẽ', role: '',         col: 'ctp',   wdept: 'design',   waste: 0 },
    { key: 'thu-mua',    name: 'Thu mua',     role: '',         col: 'ctp',   wdept: 'thu-mua',  waste: 0 },
    { key: 'kho-cap',    name: 'Kho cấp',     role: '',         col: 'ctp',   wdept: 'kho',      waste: 0 },
    { key: 'in-lenh',    name: 'In lệnh',     role: '',         col: 'ctp',   wdept: 'ke-hoach', waste: 0 },
    { key: 'che-ban',    name: 'Lập trình CNC', role: 'ctp',      col: 'ctp',   wdept: 'ctp',      waste: 0.01 },
    { key: 'cb-kem',     name: 'C.bị dao phay', role: 'ctp',      col: 'ctp',   wdept: 'ctp',      waste: 0.01 },
    { key: 'in',         name: 'Cắt & phay đố (CNC)', role: 'print',    col: 'print', wdept: 'in',       waste: 0 },
    { key: 'in-phu',     name: 'Cắt & phay đố (trượt quay)', role: 'print',    col: 'print', wdept: 'in',       waste: 0 },
    { key: 'in-kts',     name: 'Gia công cửa mở quay', role: 'print',    col: 'print', wdept: 'in',       waste: 0 },
    { key: 'in-kho-lon', name: 'Xuất nhôm thanh (xá)', role: 'print',    col: 'print', wdept: 'in',       waste: 0 },
    { key: 'sau-in',     name: 'Ép góc & lắp khung', role: 'laminate', col: 'lam',   wdept: 'gia-cong', waste: 0.03 },
    { key: 'can',        name: 'Uốn vòm nhôm', role: 'laminate', col: 'lam',   wdept: 'gia-cong', waste: 0.03 },
    { key: 'gia-cong',   name: 'Hoàn thiện',    role: 'laminate', col: 'lam',   wdept: 'gia-cong', waste: 0.03 },
    { key: 'be',         name: 'Lắp kính',     role: 'die',      col: 'die',   wdept: 'gia-cong', waste: 0.03 },
    { key: 'cat',        name: 'Lắp khung cánh', role: '',         col: 'die',   wdept: 'gia-cong', waste: 0.01 },
    { key: 'gap',        name: 'Lắp phụ kiện',  role: '',         col: 'glue',  wdept: 'gia-cong', waste: 0.01 },
    { key: 'dong-cuon',  name: 'Bọc màng bảo vệ', role: '',         col: 'glue',  wdept: 'gia-cong', waste: 0.01 },
    { key: 'dan',        name: 'Dán tem & QR',  role: 'pack',     col: 'glue',  wdept: 'gia-cong', waste: 0.01 },
    { key: 'dong-goi',   name: 'Đóng kiện',   role: 'pack',     col: 'glue',  wdept: 'gia-cong', waste: 0.01 },
    { key: 'kcs',        name: 'KCS',         role: '',         col: 'kcs',   wdept: '',         waste: 0 },
    { key: 'nhap-kho',   name: 'Nhập kho',    role: '',         col: 'kcs',   wdept: 'kho',      waste: 0 }
  ];
  // Bổ sung công đoạn mới vào các map tra cứu (giữ map cũ, chỉ thêm khoá còn thiếu)
  STAGE_CATALOG.forEach(function (c) {
    if (STAGE_COL_MAP[c.key] == null) STAGE_COL_MAP[c.key] = c.col;
    if (c.role && STAGE_ROLE[c.key] == null) STAGE_ROLE[c.key] = c.role;
    if (STAGE_WDEPT[c.key] == null) STAGE_WDEPT[c.key] = c.wdept;
  });
  function catalogOf(key) { for (var i = 0; i < STAGE_CATALOG.length; i++) if (STAGE_CATALOG[i].key === key) return STAGE_CATALOG[i]; return null; }
  // Cột kanban của 1 công đoạn — ưu tiên field trên stage (cho công đoạn custom), fallback map, mặc định 'lam'
  function stageColOf(s) { return (s && s.col) || (s && STAGE_COL_MAP[s.key]) || 'lam'; }
  function stageRoleOf(s) { return (s && s.role != null) ? s.role : (STAGE_ROLE[s && s.key] || ''); }

  // Nhóm máy (role) → cột kanban / ban thợ / nhãn — cho công đoạn TỰ KHAI BÁO chọn nhóm máy
  var ROLE_COL = { ctp: 'ctp', print: 'print', laminate: 'lam', die: 'die', pack: 'glue' };
  var ROLE_WDEPT = { ctp: 'ctp', print: 'in', laminate: 'gia-cong', die: 'gia-cong', pack: 'gia-cong' };
  var ROLE_LABEL = { '': 'Không cần máy', ctp: 'Chuẩn bị · CNC', print: 'Cắt · Phay', laminate: 'Uốn vòm · Ép góc', die: 'Lắp khung · Lắp kính', pack: 'Phụ kiện · Đóng kiện' };
  var ROLE_OPTS = ['', 'ctp', 'print', 'laminate', 'die', 'pack'];

  // ===== PHIẾU CÔNG ĐOẠN (form động per-stage) =====
  var FIELD_TYPES = [
    { type: 'info',   label: 'Chữ cố định', icon: 'lock' },
    { type: 'text',   label: 'Ô nhập',      icon: 'pen-line' },
    { type: 'number', label: 'Ô số (ĐM↔TT)', icon: 'hash' },
    { type: 'check',  label: 'Tích ✓',      icon: 'check-square' },
    { type: 'file',   label: 'Đính tệp',    icon: 'paperclip' }
  ];
  function nextFieldId(form) { var m = 0; (form || []).forEach(function (f) { var n = parseInt(String(f.id).replace(/\D/g, ''), 10) || 0; if (n > m) m = n; }); return 'f' + (m + 1); }
  // template "sạch" của 1 field (bỏ mọi giá trị thợ điền run*) — để lưu vào sản phẩm
  function stripRunField(f) {
    return {
      id: f.id, type: f.type, label: f.label || '', open: !!f.open, required: !!f.required,
      value: f.value || '', plan: f.plan || '',
      files: (f.files || []).map(function (x) { return { name: x.name, by: x.by || '' }; })
    };
  }
  // dựng field tươi từ template + khởi tạo ô run rỗng
  function freshField(f) {
    var t = stripRunField(f);
    t.runValue = ''; t.runChecked = false; t.runFiles = []; t.runBy = ''; t.runAt = '';
    return t;
  }
  function fieldFilled(f) {
    if (f.type === 'check') return !!f.runChecked;
    if (f.type === 'file') return !!(f.runFiles && f.runFiles.length);
    return String(f.runValue || '').trim() !== '';
  }
  function formStatOf(stage) {
    var form = (stage && stage.form) || [];
    var openF = form.filter(function (f) { return f.open && f.type !== 'info'; });
    var req = openF.filter(function (f) { return f.required; });
    return {
      count: form.length, openCount: openF.length,
      filled: openF.filter(fieldFilled).length,
      required: req.length, requiredFilled: req.filter(fieldFilled).length,
      fileCount: form.reduce(function (a, f) { return a + (f.files || []).length + (f.runFiles || []).length; }, 0)
    };
  }

  // ===== PHIẾU CÔNG ĐOẠN — BẢNG LƯỚI (Excel hóa) =====
  // grid = { cols:N, rows:[ [cell × cols] × R ] }
  // cell = { t:'label'|'text'|'number'|'check', v, plan, open, req, bg, al, rs, cs, rv, rc }
  //   t: label = ô khóa/tiêu đề · text/number/check = thợ điền (nếu open)
  //   bg: '' | 'head'(vàng tiêu đề) | 'red'(định mức) | 'gray'(BP SX) | 'blue'(thiết kế)
  //   al: '' (trái) | 'c' (giữa) | 'r' (phải) · rs/cs: gộp ô (chỉ ô neo) · rv/rc: giá trị thợ điền (run)
  var CELL_BG = ['', 'head', 'red', 'gray', 'blue'];
  function freshCell(c) {
    c = c || {};
    return {
      t: c.t || 'label', v: c.v || '', plan: c.plan || '', url: c.url || '',
      open: !!c.open, req: !!c.req, bg: c.bg || '', al: c.al || '',
      rs: c.rs || 1, cs: c.cs || 1, rv: '', rc: false
    };
  }
  function stripCell(c) {
    c = c || {};
    return { t: c.t || 'label', v: c.v || '', plan: c.plan || '', url: c.url || '', open: !!c.open, req: !!c.req, bg: c.bg || '', al: c.al || '', rs: c.rs || 1, cs: c.cs || 1 };
  }
  function defaultGrid() {
    var cols = 3, rows = [];
    for (var r = 0; r < 3; r++) {
      var row = [];
      for (var c = 0; c < cols; c++) row.push(freshCell({ t: r === 0 ? 'label' : 'text', bg: r === 0 ? 'head' : '', open: r !== 0, al: r === 0 ? 'c' : '' }));
      rows.push(row);
    }
    return { cols: cols, rows: rows };
  }
  function freshGrid(g) { if (!g) return undefined; return { cols: g.cols, rows: (g.rows || []).map(function (row) { return row.map(freshCell); }) }; }
  function stripGrid(g) { if (!g) return undefined; return { cols: g.cols, rows: (g.rows || []).map(function (row) { return row.map(stripCell); }) }; }
  // tập ô bị ô neo (rs/cs>1) phủ → bỏ qua khi render
  function gridCovered(g) {
    var cov = {}; if (!g || !g.rows) return cov;
    for (var r = 0; r < g.rows.length; r++) for (var c = 0; c < g.cols; c++) {
      if (cov[r + ',' + c]) continue;
      var cell = g.rows[r][c]; var rs = cell.rs || 1, cs = cell.cs || 1;
      if (rs > 1 || cs > 1) for (var dr = 0; dr < rs; dr++) for (var dc = 0; dc < cs; dc++) if (dr || dc) cov[(r + dr) + ',' + (c + dc)] = true;
    }
    return cov;
  }
  function cellFillable(c) { return !!(c && c.open && c.t !== 'label' && c.t !== 'link'); }
  function cellFilled(c) { if (!c) return false; if (c.t === 'check') return !!c.rc; return String(c.rv || '').trim() !== ''; }
  function gridStatOf(stage) {
    var g = stage && stage.grid; if (!g) return { cells: 0, openCount: 0, filled: 0, required: 0, requiredFilled: 0, count: 0 };
    var cov = gridCovered(g), open = 0, filled = 0, req = 0, reqF = 0, cells = 0;
    for (var r = 0; r < g.rows.length; r++) for (var c = 0; c < g.cols; c++) {
      if (cov[r + ',' + c]) continue; cells++;
      var cell = g.rows[r][c];
      if (cellFillable(cell)) { open++; if (cellFilled(cell)) filled++; if (cell.req) { req++; if (cellFilled(cell)) reqF++; } }
    }
    return { cells: cells, count: cells, openCount: open, filled: filled, required: req, requiredFilled: reqF };
  }
  // builder ngắn cho template seed
  function _c(t, v, o) { o = o || {}; return { t: t, v: v || '', plan: o.plan || '', url: o.url || '', open: !!o.open, req: !!o.req, bg: o.bg || '', al: o.al || (t === 'label' ? 'c' : ''), rs: o.rs || 1, cs: o.cs || 1, rv: '', rc: false }; }
  function _cov() { return { t: 'label', v: '', plan: '', open: false, req: false, bg: '', al: '', rs: 1, cs: 1, rv: '', rc: false }; }
  // ----- mẫu bảng theo TỜ LỆNH THẬT (OS-25MD2921 · VINHOMES OCEAN PARK · cửa vòm hệ 120) -----
  // đuôi 9 cột dùng chung: SL NHẬN(ĐM|TT) · SL NG(BÙ HAO|TT) · SL TP ĐẠT(TP|TT) · THỜI GIAN(ĐM|TT) · GHI CHÚ & KÝ TÊN
  function _tailH0() { return [ _c('label', 'SL NHẬN', { bg: 'head', cs: 2 }), _cov(), _c('label', 'SL NG', { bg: 'head', cs: 2 }), _cov(), _c('label', 'SL TP ĐẠT', { bg: 'head', cs: 2 }), _cov(), _c('label', 'THỜI GIAN', { bg: 'head', cs: 2 }), _cov(), _c('label', 'GHI CHÚ & KÝ TÊN', { bg: 'head', rs: 2 }) ]; }
  function _tailH1() { return [ _c('label', 'ĐỊNH MỨC', { bg: 'head' }), _c('label', 'THỰC TẾ', { bg: 'head' }), _c('label', 'BÙ HAO', { bg: 'head' }), _c('label', 'THỰC TẾ', { bg: 'head' }), _c('label', 'THÀNH PHẨM', { bg: 'head' }), _c('label', 'THỰC TẾ', { bg: 'head' }), _c('label', 'ĐỊNH MỨC', { bg: 'head' }), _c('label', 'THỰC TẾ', { bg: 'head' }), _cov() ]; }
  function _tail(dm, ng, tp) { return [ _c('label', dm, { bg: 'red', al: 'r' }), _c('number', '', { open: true, al: 'r', plan: dm }), _c('label', ng, { bg: 'red', al: 'r' }), _c('number', '', { open: true, al: 'r' }), _c('label', tp, { bg: 'red', al: 'r' }), _c('number', '', { open: true, al: 'r', plan: tp }), _c('text', '', { open: true }), _c('text', '', { open: true }), _c('text', '', { open: true }) ]; }
  function _tailRS(dm, ng, tp) { var t = _tail(dm, ng, tp); t.forEach(function (c) { c.rs = 2; }); return t; }   // đuôi gộp 2 hàng (mặt A/B)
  // dòng tích: chia đều labels ra đúng `cols` ô (mỗi ô check kèm nhãn)
  function _tickRow(labels, cols) {
    var per = Math.floor(cols / labels.length), rem = cols - per * labels.length, row = [];
    labels.forEach(function (lb, i) {
      var span = per + (i < rem ? 1 : 0);
      row.push(_c('check', lb, { open: true, bg: 'head', cs: span }));
      for (var k = 1; k < span; k++) row.push(_cov());
    });
    return row;
  }
  function _covs(n) { var a = []; for (var i = 0; i < n; i++) a.push(_cov()); return a; }
  // 1) BP ĐƠN HÀNG — đầy đủ: dòng tích · dải đơn · dải spec · bảng kế hoạch đợt sản xuất (12 cột)
  function seedGridDonHang() {
    return { cols: 12, rows: [
      // dòng tích nhận thông tin
      [ _c('label', 'Tích V khi nhận đủ thông tin kèm LSX', { bg: 'head', cs: 6 }), _cov(), _cov(), _cov(), _cov(), _cov(), _c('label', 'Bản vẽ', { bg: 'head' }), _c('check', '', { open: true }), _c('label', 'Mẫu màu', { bg: 'head' }), _c('check', '', { open: true }), _c('label', 'Khác', { bg: 'head' }), _c('check', '', { open: true }) ],
      // banner
      [ _c('label', '1) BP. ĐƠN HÀNG', { bg: 'head', cs: 12 }), _cov(), _cov(), _cov(), _cov(), _cov(), _cov(), _cov(), _cov(), _cov(), _cov(), _cov() ],
      // dải 1 — header
      [ _c('label', 'SỐ PO', { bg: 'head' }), _c('label', 'NGÀY LẬP', { bg: 'head' }), _c('label', 'NGÀY NHẬP KHO', { bg: 'head' }), _c('label', 'SLĐH (bộ)', { bg: 'head' }), _c('label', 'SLSX (bộ)', { bg: 'head' }), _c('label', 'SL TỒN TRONG KHO', { bg: 'head' }), _c('label', 'SL NHẬP KHO', { bg: 'head' }), _c('label', 'XƯỞNG', { bg: 'head' }), _c('label', 'GHI CHÚ SẢN PHẨM', { bg: 'head', cs: 4 }), _cov(), _cov(), _cov() ],
      // dải 1 — giá trị
      [ _c('text', '', { open: true }), _c('label', '11/06/2026', { al: 'c' }), _c('label', '25/06/2026', { al: 'c' }), _c('label', '24', { al: 'r' }), _c('label', '22', { bg: 'red', al: 'r' }), _c('label', '2', { al: 'r' }), _c('number', '', { open: true, al: 'r' }), _c('text', '', { open: true }), _c('label', 'Cửa vòm R1200 · vân gỗ trắc', { al: 'c', cs: 4 }), _cov(), _cov(), _cov() ],
      // dải 2 — header
      [ _c('label', 'SỐ CÁNH/BỘ', { bg: 'head' }), _c('label', 'MÃ NVL', { bg: 'head' }), _c('label', 'QUY CÁCH SP', { bg: 'head' }), _c('label', 'QUY CÁCH SX', { bg: 'head' }), _c('label', 'CHUYỀN CẮT', { bg: 'head' }), _c('label', 'TỔNG ĐỢT SX', { bg: 'head', cs: 2 }), _cov(), _c('label', 'TỔNG PHỤ KIỆN', { bg: 'head' }), _c('label', 'UỐN VÒM', { bg: 'head' }), _c('label', 'BẢN VẼ', { bg: 'head' }), _c('label', 'DAO PHAY', { bg: 'head', cs: 2 }), _cov() ],
      // dải 2 — giá trị
      [ _c('label', '2', { al: 'c' }), _c('label', 'Nhôm hệ 120 (6063-T5)', { al: 'c' }), _c('label', '1.600×2.400mm', { al: 'c' }), _c('label', '1.598×2.398mm', { bg: 'red', al: 'c' }), _c('label', 'CAT-02', { al: 'c' }), _c('label', '2 đợt · 14+8 bộ', { al: 'c', cs: 2 }), _cov(), _c('label', '4', { al: 'c' }), _c('label', 'CÓ · R1200', { al: 'c' }), _c('link', 'BanVe-CuaVom.pdf', { al: 'c', url: 'https://drive.google.com/file/d/1a6yD60137rkrDKQ/view' }), _c('link', 'Dao phay 4 bộ', { al: 'c', cs: 2, url: 'https://drive.google.com/file/d/1mnCkPFDoByV/view' }), _cov() ],
      // bảng kế hoạch đợt sản xuất — header (SL NG gộp 4)
      [ _c('label', 'ĐỢT SX', { bg: 'head', rs: 2 }), _c('label', 'KIỂU ĐỢT', { bg: 'head', rs: 2 }), _c('label', 'SỐ CÁNH/BỘ', { bg: 'head', rs: 2 }), _c('label', 'ĐỊNH MỨC NHÔM (KG)', { bg: 'head', rs: 2 }), _c('label', 'SL NHÔM CHẠY THỬ', { bg: 'head', rs: 2 }), _c('label', 'SỐ PHỤ KIỆN', { bg: 'head', rs: 2 }), _c('label', 'QUY CÁCH ĐỢT', { bg: 'head', rs: 2 }), _c('label', 'SL NG', { bg: 'head', cs: 4 }), _cov(), _cov(), _cov(), _c('label', 'TỔNG SL NHÔM MỖI ĐỢT (KG)', { bg: 'head', rs: 2 }) ],
      [ _cov(), _cov(), _cov(), _cov(), _cov(), _cov(), _cov(), _c('label', 'CẮT & PHAY', { bg: 'head' }), _c('label', 'UỐN VÒM', { bg: 'head' }), _c('label', 'ÉP GÓC', { bg: 'head' }), _c('label', 'LẮP KÍNH', { bg: 'head' }), _cov() ],
      [ _c('label', 'Đợt 1'), _c('label', 'Liên tục'), _c('label', '2', { al: 'c' }), _c('label', '966', { al: 'r' }), _c('label', '35', { al: 'r' }), _c('label', '4', { al: 'c' }), _c('label', '1.600×2.400mm', { al: 'c' }), _c('label', '8', { al: 'r' }), _c('label', '6', { al: 'r' }), _c('label', '4', { al: 'r' }), _c('label', '2', { al: 'r' }), _c('label', '1.001', { bg: 'red', al: 'r' }) ],
      [ _c('label', 'Đợt 2'), _c('label', 'Luân phiên'), _c('label', '2', { al: 'c' }), _c('label', '552', { al: 'r' }), _c('label', '20', { al: 'r' }), _c('label', '4', { al: 'c' }), _c('label', '1.600×2.400mm', { al: 'c' }), _c('label', '4', { al: 'r' }), _c('label', '4', { al: 'r' }), _c('label', '3', { al: 'r' }), _c('label', '1', { al: 'r' }), _c('label', '572', { bg: 'red', al: 'r' }) ],
      [ _c('label', 'Đợt 3'), _c('label', ''), _c('label', ''), _c('label', ''), _c('label', ''), _c('label', ''), _c('label', ''), _c('label', '0', { al: 'r' }), _c('label', '0', { al: 'r' }), _c('label', '0', { al: 'r' }), _c('label', '0', { al: 'r' }), _c('label', '0', { bg: 'red', al: 'r' }) ]
    ] };
  }
  // 2) BP CẤP & XUẤT NHÔM THANH — dòng tích + 2 quy cách giá nhôm (1|2) + ghi chú & ký tên
  function seedGridCapGiay() {
    return { cols: 5, rows: [
      _tickRow(['Hệ nhôm', 'SL nhôm cấp', 'Mã lô nhôm', 'Số cây nhận'], 5),
      [ _c('label', 'GIÁ NHÔM', { bg: 'head' }), _c('label', '1', { bg: 'head' }), _c('label', 'GHI CHÚ & KÝ TÊN', { bg: 'head' }), _c('label', '2', { bg: 'head' }), _c('label', 'GHI CHÚ & KÝ TÊN', { bg: 'head' }) ],
      [ _c('label', 'NVL', { bg: 'gray' }), _c('label', 'Nhôm hệ 120 (6063-T5)'), _c('text', '', { open: true }), _c('label', ''), _c('text', '', { open: true }) ],
      [ _c('label', 'QUY CÁCH CÂY', { bg: 'gray' }), _c('label', 'Cây 5,8m · dày 2,0mm'), _c('text', '', { open: true }), _c('label', ''), _c('text', '', { open: true }) ],
      [ _c('label', 'TỔNG SL NHÔM CẤP (KG)', { bg: 'gray' }), _c('number', '', { open: true, al: 'r', plan: '1.573' }), _c('text', '', { open: true }), _c('label', ''), _c('text', '', { open: true }) ],
      [ _c('label', 'QUY CÁCH ĐỢT', { bg: 'red' }), _c('label', '1.600×2.400mm', { bg: 'red' }), _c('text', '', { open: true }), _c('label', ''), _c('text', '', { open: true }) ],
      [ _c('label', 'TỔNG SL NHÔM ĐƯA CẮT (KG)', { bg: 'red' }), _c('label', '1.518', { bg: 'red', al: 'r' }), _c('text', '', { open: true }), _c('label', '0', { al: 'r' }), _c('text', '', { open: true }) ]
    ] };
  }
  // 3) BP CẮT & PHAY ĐỐ — 2 dòng tích + đợt sản xuất × CA 1/2 + phụ kiện/NVL/khổ/máy + ĐM↔TT + thời gian + ký tên (16 cột)
  function seedGridBPIn() {
    return { cols: 16, rows: [
      _tickRow(['Hệ nhôm', 'Quy cách cánh', 'Số cây nhận', 'Dao phay', 'Bản vẽ đối chiếu'], 16),
      _tickRow(['Chương trình CNC', 'Kiểu mở', 'Màu sơn / vân gỗ', 'Tốc độ cắt', 'Dung sai cắt ≤2mm'], 16),
      [ _c('label', 'ĐỢT SX', { bg: 'head', rs: 2 }), _c('label', 'KIỂU ĐỢT', { bg: 'head', rs: 2 }), _c('label', 'CA SX', { bg: 'head', rs: 2 }), _c('label', 'PHỤ KIỆN', { bg: 'head', rs: 2 }), _c('label', 'NVL', { bg: 'head', rs: 2 }), _c('label', 'QUY CÁCH ĐỢT', { bg: 'head', rs: 2 }), _c('label', 'CHUYỀN CẮT', { bg: 'head', rs: 2 }) ].concat(_tailH0()),
      _covs(7).concat(_tailH1()),
      [ _c('label', 'Đợt 1', { rs: 2 }), _c('label', 'Chạy liên tục', { rs: 2 }), _c('label', 'CA 1', { al: 'c' }), _c('label', 'Đủ bộ', { al: 'c' }), _c('label', 'Nhôm hệ 120 (6063-T5)', { rs: 2 }), _c('label', '1.600×2.400mm', { rs: 2, al: 'c' }), _c('label', 'CAT-02', { rs: 2, al: 'c' }) ].concat(_tailRS('260', '8', '252')),
      _covs(2).concat([ _c('label', 'CA 2', { al: 'c' }), _c('label', 'K', { al: 'c' }) ]).concat(_covs(3)).concat(_covs(9)),
      [ _c('label', 'Đợt 2', { rs: 2 }), _c('label', 'Chạy luân phiên', { rs: 2 }), _c('label', 'CA 1', { al: 'c' }), _c('label', 'Đủ bộ', { al: 'c' }), _c('label', 'Nhôm hệ 120 (6063-T5)', { rs: 2 }), _c('label', '1.600×2.400mm', { rs: 2, al: 'c' }), _c('label', 'CAT-02', { rs: 2, al: 'c' }) ].concat(_tailRS('148', '4', '144')),
      _covs(2).concat([ _c('label', 'CA 2', { al: 'c' }), _c('label', 'Đủ bộ', { al: 'c' }) ]).concat(_covs(3)).concat(_covs(9))
    ] };
  }
  // 4) BP UỐN VÒM / ĐỊNH HÌNH — dòng tích + kiểu khung (KHUNG VÒM gộp) + bán kính uốn + ĐM↔TT + thời gian + ký tên (13 cột)
  function seedGridCat() {
    return { cols: 13, rows: [
      _tickRow(['Chương trình CNC', 'Hệ nhôm', 'Màu sơn', 'Bán kính vòm R ổn định', 'SL nhận'], 13),
      [ _c('label', 'ĐỢT SX', { bg: 'head', rs: 2 }), _c('label', 'KIỂU ĐỢT', { bg: 'head', rs: 2 }), _c('label', 'KIỂU KHUNG', { bg: 'head', rs: 2 }), _c('label', 'BÁN KÍNH UỐN (R)', { bg: 'head', rs: 2 }) ].concat(_tailH0()),
      _covs(4).concat(_tailH1()),
      [ _c('label', 'Đợt 1'), _c('label', 'Chạy liên tục'), _c('label', 'KHUNG VÒM 2 CÁNH', { rs: 2, al: 'c' }), _c('label', 'Uốn theo bán kính R1200 ghi trên lệnh', { rs: 2 }) ].concat(_tail('252', '6', '246')),
      [ _c('label', 'Đợt 2'), _c('label', 'Chạy luân phiên'), _cov(), _cov() ].concat(_tail('144', '4', '140'))
    ] };
  }
  // 5) BP ÉP GÓC & LẮP KHUNG — dòng tích + kiểu ép góc + ĐM↔TT + thời gian + ký tên (12 cột)
  function seedGridGap() {
    return { cols: 12, rows: [
      _tickRow(['Chương trình CNC', 'Hệ nhôm', 'Màu sơn', 'SL nhận'], 12),
      [ _c('label', 'ĐỢT SX', { bg: 'head', rs: 2 }), _c('label', 'KIỂU ĐỢT', { bg: 'head', rs: 2 }), _c('label', 'KIỂU ÉP GÓC', { bg: 'head', rs: 2 }) ].concat(_tailH0()),
      _covs(3).concat(_tailH1()),
      [ _c('label', 'Đợt 1'), _c('label', 'Chạy liên tục'), _c('label', 'Ép góc 45° · ke 2 lỗ') ].concat(_tail('246', '4', '242')),
      [ _c('label', 'Đợt 2'), _c('label', 'Chạy luân phiên'), _c('label', 'Ép góc 90° · ke chữ T') ].concat(_tail('140', '3', '137'))
    ] };
  }
  // 6) BP LẮP KÍNH & PHỤ KIỆN — KT thành phẩm + ĐM↔TT + thời gian + ký tên (10 cột)
  function seedGridDongCuon() {
    return { cols: 10, rows: [
      [ _c('label', 'KT THÀNH PHẨM', { bg: 'head', rs: 2 }) ].concat(_tailH0()),
      _covs(1).concat(_tailH1()),
      [ _c('label', '1.598×2.398mm', { bg: 'red' }) ].concat(_tail('379', '5', '374'))
    ] };
  }
  // 7) BP KCS — kích thước/dung sai + NGOẠI QUAN (tích) + hàng ghi số NG + ghi chú & ký tên (9 cột)
  function seedGridQC() {
    return { cols: 9, rows: [
      [ _c('label', 'KÍCH THƯỚC (≤2mm)', { bg: 'head', rs: 2 }), _c('label', 'VUÔNG GÓC 90°±0.5°', { bg: 'head', rs: 2 }), _c('label', 'NGOẠI QUAN', { bg: 'head', cs: 6 }), _cov(), _cov(), _cov(), _cov(), _cov(), _c('label', 'GHI CHÚ & KÝ TÊN', { bg: 'head', rs: 2 }) ],
      [ _cov(), _cov(), _c('label', 'Xước sơn', { bg: 'gray' }), _c('label', 'Hở gioăng', { bg: 'gray' }), _c('label', 'Lệch góc 45°', { bg: 'gray' }), _c('label', 'Mối ép góc hở', { bg: 'gray' }), _c('label', 'Nứt kính', { bg: 'gray' }), _c('label', 'Anod < 15µm', { bg: 'gray' }), _cov() ],
      [ _c('check', '', { open: true }), _c('check', '', { open: true }), _c('check', '', { open: true }), _c('check', '', { open: true }), _c('check', '', { open: true }), _c('check', '', { open: true }), _c('check', '', { open: true }), _c('check', '', { open: true }), _c('text', '', { open: true }) ],
      [ _c('number', '', { open: true, al: 'r' }), _c('number', '', { open: true, al: 'r' }), _c('number', '', { open: true, al: 'r' }), _c('number', '', { open: true, al: 'r' }), _c('number', '', { open: true, al: 'r' }), _c('number', '', { open: true, al: 'r' }), _c('number', '', { open: true, al: 'r' }), _c('number', '', { open: true, al: 'r' }), _c('text', '', { open: true }) ]
    ] };
  }
  // 8) BP BỌC MÀNG & ĐÓNG KIỆN — SL nhận/đơn hàng/tồn/nhập kho + ghi chú đóng kiện + ký tên (8 cột)
  function seedGridPack() {
    return { cols: 8, rows: [
      [ _c('label', 'SL NHẬN', { bg: 'head', cs: 2 }), _cov(), _c('label', 'SL ĐƠN HÀNG', { bg: 'head', rs: 2 }), _c('label', 'SL TỒN KHO', { bg: 'head', rs: 2 }), _c('label', 'SL NHẬP KHO', { bg: 'head', cs: 2 }), _cov(), _c('label', 'GHI CHÚ ĐÓNG KIỆN', { bg: 'head', rs: 2 }), _c('label', 'GHI CHÚ & KÝ TÊN', { bg: 'head', rs: 2 }) ],
      [ _c('label', 'ĐỊNH MỨC', { bg: 'head' }), _c('label', 'THỰC TẾ', { bg: 'head' }), _cov(), _cov(), _c('label', 'ĐỊNH MỨC', { bg: 'head' }), _c('label', 'THỰC TẾ', { bg: 'head' }), _cov(), _cov() ],
      [ _c('label', '22', { bg: 'red', al: 'r' }), _c('number', '', { open: true, req: true, al: 'r', plan: '22' }), _c('label', '24', { al: 'r' }), _c('label', '2', { al: 'r' }), _c('label', '0', { bg: 'red', al: 'r' }), _c('number', '', { open: true, al: 'r' }), _c('text', '', { open: true }), _c('text', '', { open: true }) ]
    ] };
  }

  // Helper ngày dùng cho thông số lệnh / phát hành (Phần C)
  function parseAnyDate(s) {
    s = String(s || ''); var m = /(\d{4})-(\d{2})-(\d{2})/.exec(s); if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
    m = /(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(s); if (m) return new Date(+m[3], +m[2] - 1, +m[1]); return null;
  }
  function fmtDMY(d) { return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear(); }
  function fmtAny(s) { var d = parseAnyDate(s); return d ? fmtDMY(d) : String(s || ''); }
  function nowLabelG() { var d = new Date(); function p(n) { return (n < 10 ? '0' : '') + n; } return 'Hôm nay ' + p(d.getHours()) + ':' + p(d.getMinutes()); }

  // Dựng 1 stage chuẩn từ định nghĩa route (catalog hoặc custom)
  function stageFromDef(d) {
    return {
      key: d.key, name: d.name, owner: d.owner || '', machine: d.machine || '',
      role: (d.role != null ? d.role : (STAGE_ROLE[d.key] || '')),
      col: d.col || STAGE_COL_MAP[d.key] || 'lam',
      wdept: d.wdept || STAGE_WDEPT[d.key] || 'gia-cong',
      wastePct: (d.wastePct != null ? d.wastePct : undefined),
      form: (d.form || []).map(freshField),
      grid: d.grid ? freshGrid(d.grid) : undefined,
      type: 'work', group: '', status: '', dateText: ''
    };
  }
  // Trích "công thức" route (bỏ trạng thái chạy + giá trị thợ điền) từ 1 stage — để lưu vào sản phẩm
  function routeDefFromStage(s) {
    return {
      key: s.key, name: s.name, owner: s.owner || '', machine: s.machine || '',
      role: stageRoleOf(s), col: stageColOf(s), wdept: s.wdept || STAGE_WDEPT[s.key] || 'gia-cong',
      wastePct: (s.wastePct != null ? s.wastePct : undefined),
      form: (s.form && s.form.length) ? s.form.map(stripRunField) : undefined,
      grid: s.grid ? stripGrid(s.grid) : undefined
    };
  }

  function eligibleMachinesFor(lsx, stageKey) {
    var st = (lsx && lsx.stages || []).filter(function (s) { return s.key === stageKey; })[0];
    var role = st ? stageRoleOf(st) : (STAGE_ROLE[stageKey] || '');
    if (!role) return [];
    var tech = (lsx && (lsx.tech || lsx.type)) || 'offset';
    var list = WORKCENTERS.filter(function (w) {
      return w.dept === role && (w.tech.indexOf('*') >= 0 || w.tech.indexOf(tech) >= 0);
    });
    // role lạ (custom) không khớp dept nào → cho chọn mọi máy hợp công nghệ
    if (!list.length) list = WORKCENTERS.filter(function (w) { return w.tech.indexOf('*') >= 0 || w.tech.indexOf(tech) >= 0; });
    return list;
  }
  function eligibleWorkersFor(lsx, stageKey) {
    var st = (lsx && lsx.stages || []).filter(function (s) { return s.key === stageKey; })[0];
    var dept = (st && st.wdept) || STAGE_WDEPT[stageKey] || '';
    var list = dept ? WORKERS.filter(function (w) { return w.dept === dept; }) : [];
    return list.length ? list : WORKERS.slice();
  }

  // ============================================================
  //  ĐỊNH MỨC + BÙ HAO CỘNG DỒN + ĐIỀU ĐỘ CHỒNG LẤN (mục 2 & 5)
  //  Nguyên tắc 2 + §5.2 (reconciliation) + §5.3 (SFDC) + §6.2 doc
  //  quy-trinh-san-xuat-in.md. Mọi % bù hao là tham số cấu hình.
  // ============================================================
  // % bù hao mặc định theo NHÓM công đoạn (khâu IN tính động bên dưới)
  var STAGE_WASTE = { ctp: 0.01, laminate: 0.03, die: 0.03, pack: 0.01, '': 0.0 };
  function colorsOf(lsx) {
    var sp = (lsx.floor || {}).specs || {};
    var m = (/(\d+)/.exec(String(sp.soMau || '')) || [])[1]; if (m) return +m;
    var ink = (lsx.bom || []).filter(function (b) { return /phụ kiện|bản lề|khoá|tay nắm/i.test(b.name || ''); })[0];
    if (ink) { var im = /(\d+)\s*(?:cánh|loại|phụ kiện)/.exec((ink.name || '') + ' ' + (ink.spec || '')); if (im) return +im[1]; }
    return 4;
  }
  // Bù hao 1 công đoạn của 1 LSX (khâu IN: fixed-overs + % chạy theo PricingEngine)
  function wastePctFor(lsx, stageKey, colors, qty) {
    var st = (lsx.stages || []).filter(function (s) { return s.key === stageKey; })[0];
    if (st && st.wastePct != null) return st.wastePct;   // người lập KH set tay (phân số)
    var role = st ? stageRoleOf(st) : (STAGE_ROLE[stageKey] || '');
    if (role === 'print') {
      var PE = global.PricingEngine, tech = lsx.tech || 'offset';
      if (PE && tech === 'offset' && PE.OFFSET) {
        var R = PE.OFFSET.RATES; var fixed = R.makereadyBase + R.makereadyPerColor * (colors || 4);
        return Math.min(0.5, R.runningWaste + (qty ? fixed / qty : 0));
      }
      if (PE && tech === 'flexo' && PE.LABEL) { var f = PE.LABEL.FLEXO; return Math.min(0.5, f.running + (qty ? f.setupWasteM / qty : 0)); }
      if (PE && PE.LABEL) { var d = PE.LABEL.DIGITAL; return Math.min(0.5, d.running + (qty ? d.setupWasteM / qty : 0)); }
      return 0.03;
    }
    return STAGE_WASTE[role] != null ? STAGE_WASTE[role] : 0;
  }
  // Kế hoạch công đoạn: bù hao cộng dồn (cascade ngược) + giờ máy mỗi công đoạn
  function stagePlanFor(lsx) {
    var Q = lsx.qty || 0, cols = colorsOf(lsx);
    var rows = (lsx.stages || []).filter(function (s) { return s.type !== 'date'; }).map(function (s) {
      var machine = s.machine || (eligibleMachinesFor(lsx, s.key)[0] || {}).id || '';
      return { key: s.key, name: s.name, role: stageRoleOf(s), machine: machine, owner: s.owner || '', wastePct: wastePctFor(lsx, s.key, cols, Q) };
    });
    for (var i = rows.length - 1; i >= 0; i--) {
      var out = (i === rows.length - 1) ? Q : rows[i + 1].inQty;
      var inq = rows[i].wastePct < 1 ? Math.ceil(out / (1 - rows[i].wastePct)) : out;
      rows[i].outQty = out; rows[i].inQty = inq; rows[i].lossQty = inq - out;
    }
    rows.forEach(function (r) {
      var wc = r.machine ? WORKCENTERS.filter(function (w) { return w.id === r.machine; })[0] : null;
      var setup = wc ? wc.setupMin : 0;
      // Lập trình CNC tính theo LÔ (không theo SL bộ) → thời lượng cố định; pack/không-máy cũng cố định
      if (wc && wc.ratePerHour && wc.rateUnit !== 'lô') r.durMin = Math.round(setup + r.inQty / wc.ratePerHour * 60);
      else if (r.role === 'ctp') r.durMin = setup + 60;
      else r.durMin = r.role ? 30 : 20;
      r.setupMin = setup;
    });
    return { qty: Q, colors: cols, grossInput: rows.length ? rows[0].inQty : Q, stages: rows };
  }
  // BOM + bù hao: bảng reconciliation + map vật tư → công đoạn (mục 2)
  function bomStageOf(name) {
    if (/dao phay|khuôn|ke góc/i.test(name)) return 'cb-kem';
    if (/màng|gioăng|silicon|keo/i.test(name)) return 'sau-in';
    if (/kính|bản lề|khoá|tay nắm/i.test(name)) return 'be';
    return 'in';
  }
  function bomBreakdownFor(lsx) {
    var sp = stagePlanFor(lsx);
    var byKey = {}; sp.stages.forEach(function (r) { byKey[r.key] = r; });
    var bomLines = (lsx.bom || []).map(function (b) {
      var sk = bomStageOf(b.name || ''); var st = byKey[sk] || byKey['in'] || sp.stages[0] || {};
      return { name: b.name, spec: b.spec || '', qtyText: b.qty || '', stageName: st.name || '—', grossAtStage: st.inQty || 0 };
    });
    return { plan: sp, qty: sp.qty, grossInput: sp.grossInput, totalLoss: sp.stages.reduce(function (a, r) { return a + r.lossQty; }, 0), bomLines: bomLines, bomLocked: !!lsx.bomLocked };
  }
  // SL lũy kế từng công đoạn (SFDC §5.3) — doneQty từ l.prod, fallback suy từ status cũ
  function stageProgressFor(lsx) {
    var sp = stagePlanFor(lsx), prod = lsx.prod || {};
    return sp.stages.map(function (r) {
      var st = (lsx.stages || []).filter(function (s) { return s.key === r.key; })[0] || {};
      var done = (prod[r.key] != null) ? prod[r.key] : (st.status === 'done' ? r.outQty : st.status === 'doing' ? Math.round(r.outQty * 0.5) : 0);
      done = Math.min(done, r.outQty);
      return { key: r.key, name: r.name, machine: r.machine, owner: r.owner, planQty: r.outQty, doneQty: done, pct: r.outQty ? Math.round(done / r.outQty * 100) : 0 };
    });
  }
  // Điều độ máy công suất hữu hạn + CHỒNG LẤN theo lô chuyển (mục 5A)
  var SHIFT_MIN = 480, BATCH_PCT = 0.25, WASHUP_MIN = 20;
  function parseDQ(s) { var m = /(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(String(s || '')); return m ? new Date(+m[3], +m[2] - 1, +m[1]) : null; }
  function scheduleMachinesFor(list, strategy) {
    strategy = strategy || 'forward';
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var jobs = (list || []).map(function (l) {
      return { l: l, sp: stagePlanFor(l), rd: parseDQ(l.dateReceived), dd: parseDQ(l.dateDelivery), paper: ((l.bom || []).filter(function (b) { return /nhôm|thanh|profile|kính/i.test(b.name || ''); })[0] || {}).name || '', colors: colorsOf(l) };
    });
    // thứ tự job theo chiến lược
    if (strategy === 'backward') jobs.sort(function (a, b) { return (a.dd || 0) - (b.dd || 0); });
    else if (strategy === 'bottleneck') jobs.sort(function (a, b) { return (a.dd || 0) - (b.dd || 0) || b.sp.grossInput - a.sp.grossInput; });
    else jobs.sort(function (a, b) { return (a.rd || 0) - (b.rd || 0) || (a.dd || 0) - (b.dd || 0); });
    var free = {}, lastJob = {}, machines = {};
    function mc(id) { return machines[id] || (machines[id] = { id: id, name: (WORKCENTERS.filter(function (w) { return w.id === id; })[0] || { name: id }).name, bars: [], loadMin: 0 }); }
    jobs.forEach(function (job) {
      var prevStart = 0, prevTransfer = 0;
      job.sp.stages.forEach(function (r, idx) {
        var m = r.machine || '—';
        var earliest = idx === 0 ? (free[m] || 0) : Math.max(free[m] || 0, prevStart + prevTransfer);
        var wash = 0;
        if (lastJob[m] && (lastJob[m].paper !== job.paper || lastJob[m].colors !== job.colors)) wash = WASHUP_MIN;
        var start = earliest + wash, end = start + r.durMin;
        // chồng lấn: lô chuyển đầu sẵn sau ~setup + 1 batch (≈ BATCH_PCT thời lượng công đoạn)
        var transferOff = r.setupMin + Math.round((r.durMin - r.setupMin) * BATCH_PCT);
        var M = mc(m);
        M.bars.push({ lsxId: job.l.id, stageKey: r.key, stageName: r.name, startMin: start, endMin: end, durMin: r.durMin, washup: wash });
        M.loadMin += r.durMin + wash;
        free[m] = end; lastJob[m] = { paper: job.paper, colors: job.colors };
        prevStart = start; prevTransfer = transferOff;
      });
    });
    var arr = Object.keys(machines).map(function (k) { return machines[k]; });
    var horizon = 0; arr.forEach(function (M) { M.bars.forEach(function (b) { if (b.endMin > horizon) horizon = b.endMin; }); });
    // cờ trễ: ngày xong (ca 8h/ngày) vs hạn giao
    arr.forEach(function (M) {
      M.overloaded = M.loadMin > SHIFT_MIN;
      M.bars.forEach(function (b) {
        var job = jobs.filter(function (j) { return j.l.id === b.lsxId; })[0];
        var finishDays = b.endMin / SHIFT_MIN;
        var dueDays = job && job.dd ? (job.dd - today) / 86400000 : 999;
        b.late = finishDays > dueDays;
      });
    });
    return { strategy: strategy, horizonMin: horizon || SHIFT_MIN, machines: arr.sort(function (a, b) { return b.loadMin - a.loadMin; }) };
  }

  function fmtInt(n) { return (Number(n) || 0).toLocaleString('vi-VN'); }
  function lsxWorkStages(l) { return (l.stages || []).filter(function (s) { return s.type !== 'date'; }); }
  function lsxProgressOf(l) { var w = lsxWorkStages(l); if (!w.length) return 0; var d = w.filter(function (s) { return s.status === 'done'; }).length; return Math.round(d / w.length * 100); }
  function lsxCurStage(l) {
    var w = lsxWorkStages(l); if (!w.length) return null;
    var doing = w.filter(function (s) { return s.status === 'doing'; })[0]; if (doing) return doing;
    var nd = w.filter(function (s) { return s.status !== 'done'; })[0]; return nd || w[w.length - 1];
  }
  function shortD(s) { var p = String(s || '').split('/'); return p.length >= 2 ? (p[0] + '/' + p[1]) : (s || ''); }
  // Trả về view-model đầy đủ (superset cho cả kanban & list) từ 1 LSX chuẩn
  function lsxDerive(l) {
    var f = l.floor || {};
    var cur = lsxCurStage(l);
    var prog = (f.progress != null) ? f.progress : lsxProgressOf(l);
    var col = f.stageCol || (cur ? stageColOf(cur) : 'ctp');
    var isDone = (l.status === 'hoàn thành' || l.status === 'hoàn tất' || prog >= 100);
    var qtyUnit = f.qtyUnit || (l.packaging && l.packaging.mode === 'roll' ? 'cánh' : 'bộ');
    var tier = (customerByName(l.customer) || {}).tier || '';
    var urgency = f.urgency || 'safe';
    var status = f.status || (isDone ? 'done' : (prog > 0 ? 'running' : 'pending'));
    var routing = lsxWorkStages(l).map(function (s) {
      return { key: s.key, col: stageColOf(s), stage: s.name, status: (s.status === 'done' ? 'done' : s.status === 'doing' ? 'active' : 'pending'), time: s.dateText || '', sub: s.owner || '' };
    });
    var materials = f.materials || (l.bom || []).map(function (b) { return { n: b.name, s: b.qty || b.spec || '', st: 'ok' }; });
    if (!materials.length) materials = [{ n: 'Định mức NVL', s: 'Theo ' + (l.ptgId || 'PTG'), st: 'ok' }];
    var qrLog = f.qrLog || (l.activity || []).map(function (a) { return { t: a.date, a: a.text, by: a.by }; });
    var specs = f.specs || { khoThanhPham: l.size || '—', khoTrai: '—', giay: (l.bom && l.bom[0] ? l.bom[0].name : '—'), soMau: '—', soBanKem: '—', giaCong: '—' };
    var colName = (KANBAN_COLUMNS.filter(function (c) { return c.id === col; })[0] || {}).name || col;
    var delay = !!(f.delay || urgency === 'overdue');
    var stageType = isDone ? 'done' : (delay ? 'delay' : (col === 'kcs' ? 'kcs' : 'prod'));
    var status06 = isDone ? 'done' : (delay ? 'delay' : (col === 'kcs' ? 'kcs' : 'producing'));
    return {
      id: l.id, orderId: l.orderId || '', from: l.orderId || '—', bgId: l.bgId || '', ptgId: l.ptgId || '',
      customer: l.customer, kh: l.customer, khTier: tier, vip: (f.vip != null ? f.vip : (tier === 'VIP')),
      product: l.product, sub: f.sub || (fmtInt(l.qty) + ' ' + qtyUnit + ' · ' + (specs.giay || l.size || '')),
      qty: l.qty || 0, qtyUnit: qtyUnit, done: (f.done != null ? f.done : Math.round((l.qty || 0) * prog / 100)),
      stage: col, stageName: colName, stageType: stageType, lifecycle: lsxLc(l),
      progress: prog, status: status, status06: status06, delay: delay,
      urgency: urgency, daysLeft: (f.daysLeft != null ? f.daysLeft : 5), dueDate: f.dueDate || shortD(l.dateDelivery) || '—',
      machine: l.machineIn || l.machine || '—', worker: f.worker || (cur && cur.owner) || '—', eta: f.eta || l.timeText || '—',
      salesRep: f.salesRep || 'Sales', alert: f.alert || '',
      specs: specs, materials: materials, routing: routing, qrLog: qrLog, kcs: f.kcs || null,
      nProducts: (l.products && l.products.length) ? l.products.length : 1
    };
  }

  // ============================================================
  //  TÍNH PHÔI / QUY CÁCH + GỘP LÔ (ganging) — việc 3 của Kế hoạch SX.
  //  Tái dùng lõi PricingEngine.maxUpsPerSheet + renderProofSheet.
  //  CHỈ áp cho lô cửa thuỷ lực (trượt quay / mở quay không gộp lô).
  // ============================================================
  var SHEET_SIZES = [[79, 109], [65, 86], [60, 90], [54, 79], [43, 65]]; // khổ phôi quy đổi chuẩn
  function parseDimCm(str) {
    var s = String(str || ''); if (!s) return null;
    var unit = /mm/i.test(s) ? 0.1 : 1;            // có "mm" → đổi sang cm; mặc định cm
    var nums = (s.match(/[\d.]+/g) || []).map(Number).filter(function (n) { return n > 0; });
    if (nums.length < 2) return null;
    return { w: nums[0] * unit, h: nums[1] * unit, d: (nums[2] || 0) * unit };
  }
  // Suy ra state cân định lượng từ 1 LSX (ưu tiên specs khai báo, rồi parse từ size)
  function impStateForLSX(l) {
    var PE = global.PricingEngine;
    var st = PE.defaultState('offset');
    var sp = (l.floor || {}).specs || {};
    var parts = String(l.size || '').split('·').map(function (x) { return x.trim(); });
    st.quantity = l.qty || st.quantity;
    var bom = l.bom || [];
    // NHÔM: specs khai báo → dòng "Thanh nhôm ..." trong BOM → parse từ size → mặc định
    if (sp.giay) st.paperName = sp.giay;
    else {
      var gb = bom.filter(function (b) { return /^(thanh nhôm|nhôm)/i.test(b.name || ''); })[0];
      if (gb) st.paperName = gb.name.replace(/^(thanh nhôm|nhôm)\s*/i, '').trim();
      else if (parts.length >= 2 && /nhôm|thanh|profile|kính|6063/i.test(parts[1])) st.paperName = parts[1];
    }
    // SỐ CÁNH: specs (lấy số ĐẦU, vd "4 (2 cánh mở + 2 cố định)"→4) → dòng "Phụ kiện N cánh" BOM → size → mặc định
    var soMau = (/(\d+)/.exec(String(sp.soMau || '')) || [])[1]; soMau = soMau ? +soMau : 0;
    if (!soMau) { var ink = bom.filter(function (b) { return /phụ kiện|bản lề|khoá/i.test(b.name || ''); })[0]; if (ink) { var im = /(\d+)\s*(?:cánh|loại|phụ kiện)/.exec((ink.name || '') + ' ' + (ink.spec || '')); if (im) soMau = +im[1]; } }
    if (!soMau) { var mc = /(\d+)\s*(?:cánh|loại|phụ kiện)/.exec(l.size || ''); if (mc) soMau = +mc[1]; }
    if (soMau) st.colors = soMau;
    // SỐ BỘ DAO PHAY: specs (số đầu) → dòng "Dao phay ... N bộ" BOM → (mặc định = cánh×mặt×lô tính sau)
    var sk = (/(\d+)/.exec(String(sp.soBanKem || '')) || [])[1]; sk = sk ? +sk : 0;
    if (!sk) { var kb = bom.filter(function (b) { return /dao phay|khuôn|ke góc/i.test(b.name || ''); })[0]; if (kb) { var kq = /(\d+)\s*(?:bản|bộ)/.exec((kb.qty || '') + ' ' + (kb.spec || '')); if (kq) sk = +kq[1]; } }
    if (sk) st.plates = sk;
    var dim = parseDimCm(sp.khoThanhPham) || parseDimCm(l.size);
    if (dim) { st.finishedW = dim.w; st.finishedH = dim.h; st.finishedD = dim.d || 0; }
    var spread = parseDimCm(sp.khoTrai);
    if (spread) { st.spreadW = spread.w; st.spreadH = spread.h; }
    else { st.spreadW = st.finishedW; st.spreadH = st.finishedH; }
    st.ke = PE.maxUpsPerSheet(st) || st.ke || 1;
    return st;
  }
  // Tính phôi 1 bài: cánh/bộ, hiệu suất, số kg nhôm, số bộ dao phay + so sánh quy cách cây tối ưu
  function imposition(l) {
    var PE = global.PricingEngine;
    var st = impStateForLSX(l);
    var pw = st.spreadW || st.finishedW, ph = st.spreadH || st.finishedH;
    var ke = st.ke || PE.maxUpsPerSheet(st) || 1;
    var qty = st.quantity || l.qty || 0;
    var colors = st.colors || 4;
    var plates = st.plates || (colors * (st.sides || 1) * (st.signatures || 1));
    // SỐ MẶT: state → đọc "(4+4)" hoặc "N mặt" trong dòng dao phay BOM → mặc định 1
    var sides = st.sides || 1;
    var kb = (l.bom || []).filter(function (b) { return /dao phay|khuôn|ke góc/i.test(b.name || ''); })[0];
    if (kb) {
      var ms = /(\d+)\s*(?:mặt|ca)/.exec((kb.spec || '') + ' ' + (kb.name || ''));
      if (ms) sides = +ms[1];
      else { var grp = /\(([\d+\s]+)\)/.exec(kb.spec || ''); if (grp) { var ps = grp[1].split('+').filter(function (x) { return x.trim(); }); if (ps.length > 1) sides = ps.length; } }
    }
    // SỐ LÔ: state → suy từ số bộ dao phay = số cánh × số mặt × số lô
    var sigs = st.signatures || 1;
    if (plates && plates % (colors * sides) === 0 && plates / (colors * sides) > 1) sigs = plates / (colors * sides);
    if (!st.plates) plates = colors * sides * sigs;
    var area = st.sheetW * st.sheetH;
    var eff = area ? Math.round(ke * pw * ph / area * 100) : 0;
    var opts = SHEET_SIZES.map(function (d) {
      var t = { sheetW: d[0], sheetH: d[1], spreadW: pw, spreadH: ph, finishedW: pw, finishedH: ph };
      var k = PE.maxUpsPerSheet(t);
      return { w: d[0], h: d[1], ke: k, eff: (d[0] * d[1]) ? Math.round(k * pw * ph / (d[0] * d[1]) * 100) : 0, sheets: k ? Math.ceil(qty / k) : 0 };
    }).filter(function (o) { return o.ke > 0; }).sort(function (a, b) { return b.eff - a.eff || a.sheets - b.sheets; });
    return {
      state: st, sheetW: st.sheetW, sheetH: st.sheetH, paperName: st.paperName,
      colors: colors, sides: sides, signatures: sigs, ke: ke,
      spreadW: pw, spreadH: ph, qty: qty, sheetsNeeded: ke ? Math.ceil(qty / ke) : 0,
      plates: plates, efficiency: eff, sheetOptions: opts, bestSheet: opts[0] || null
    };
  }
  // Gộp lô chỉ hợp lệ TRƯỚC khi lập trình CNC (chưa gá dao phay): dự thảo / vừa phát hành.
  function gangEligible(l) {
    if ((l.tech || 'offset') !== 'offset') return false;
    if (l.gangId) return false;   // đã gộp rồi → loại khỏi ứng viên
    if (['du-thao', 'da-phat-hanh'].indexOf(lsxLc(l)) < 0) return false;
    var cb = (l.stages || []).filter(function (s) { return s.key === 'cb-kem' || s.key === 'che-ban'; })[0];
    return !cb || cb.status !== 'done';
  }
  // Gộp lô: gom các LSX (đủ điều kiện) cùng (hệ nhôm + số cánh) → nhóm ≥2 bài, tính lợi ích gộp
  function gangCandidates(list) {
    var groups = {};
    (list || []).filter(gangEligible).forEach(function (l) {
      var imp = imposition(l);
      var key = (imp.paperName || '?') + ' · ' + (imp.colors || 0) + ' cánh';
      (groups[key] = groups[key] || { key: key, paper: imp.paperName, colors: imp.colors, items: [] }).items.push({ lsx: l, imp: imp });
    });
    return Object.keys(groups).map(function (k) { return groups[k]; })
      .filter(function (g) { return g.items.length >= 2; })
      .map(function (g) {
        var n = g.items.length;
        var sumPlates = g.items.reduce(function (a, x) { return a + x.imp.plates; }, 0);
        var maxSides = Math.max.apply(null, g.items.map(function (x) { return x.imp.sides || 1; }));
        var gangPlates = (g.colors || 4) * maxSides;
        var qtys = g.items.map(function (x) { return x.lsx.qty || 0; });
        var maxQ = Math.max.apply(null, qtys), minQ = Math.min.apply(null, qtys);
        return {
          key: g.key, paper: g.paper, colors: g.colors, items: g.items, count: n,
          sumPlates: sumPlates, gangPlates: gangPlates, platesSaved: Math.max(0, sumPlates - gangPlates),
          setupsSaved: n - 1, maxQ: maxQ, minQ: minQ,
          mismatch: maxQ > 0 && (maxQ - minQ) / maxQ > 0.4
        };
      }).sort(function (a, b) { return b.platesSaved - a.platesSaved; });
  }

  // ============================================================
  //  STATE MACHINE vòng đời LSX (mục 6.2 docs/quy-trinh-san-xuat-in.md)
  //  13 trạng thái chính + nhánh (KCS lỗi/Rework/Loại/Tạm dừng/Hủy).
  //  Mỗi chuyển trạng thái ghi nhật ký {at, by, machine} để truy xuất.
  // ============================================================
  var LSX_LIFECYCLE = [
    { key: 'du-thao',         label: 'Dự thảo',         cls: 'badge' },
    { key: 'da-phat-hanh',    label: 'Đã phát hành',    cls: 'badge-steel' },
    { key: 'cho-vat-tu',      label: 'Chờ vật tư',      cls: 'badge-orange' },
    { key: 'dang-che-ban',    label: 'Đang lập trình CNC',    cls: 'badge-steel' },
    { key: 'cho-duyet-proof', label: 'Chờ duyệt mẫu', cls: 'badge-orange' },
    { key: 'da-duyet-proof',  label: 'Đã duyệt mẫu',  cls: 'badge-steel' },
    { key: 'dang-in',         label: 'Đang cắt & phay',         cls: 'badge-steel' },
    { key: 'dang-gia-cong',   label: 'Đang ép góc / hoàn thiện',   cls: 'badge-steel' },
    { key: 'cho-kcs',         label: 'Chờ KCS',         cls: 'badge-orange' },
    { key: 'kcs-dat',         label: 'KCS đạt',         cls: 'badge-moss' },
    { key: 'da-nhap-kho',     label: 'Đã nhập kho',     cls: 'badge-moss' },
    { key: 'da-giao',         label: 'Đã giao',         cls: 'badge-moss' },
    { key: 'da-dong',         label: 'Đã đóng',         cls: 'badge-moss' }
  ];
  var LSX_BRANCH = {
    'kcs-loi':  { label: 'KCS lỗi',  cls: 'badge-rust' },
    'rework':   { label: 'Rework',   cls: 'badge-orange' },
    'scrap':    { label: 'Loại bỏ',  cls: 'badge-rust' },
    'tam-dung': { label: 'Tạm dừng', cls: 'badge-orange' },
    'da-huy':   { label: 'Đã hủy',   cls: 'badge' }
  };
  function lifecycleMeta(key) {
    for (var i = 0; i < LSX_LIFECYCLE.length; i++) if (LSX_LIFECYCLE[i].key === key) return { key: key, label: LSX_LIFECYCLE[i].label, cls: LSX_LIFECYCLE[i].cls, index: i, branch: false };
    if (LSX_BRANCH[key]) return { key: key, label: LSX_BRANCH[key].label, cls: LSX_BRANCH[key].cls, index: -1, branch: true };
    return { key: key, label: key, cls: 'badge', index: -1, branch: false };
  }
  function deriveLifecycle(l) {
    var prog = lsxProgressOf(l);
    if (prog >= 100) return 'cho-kcs';   // xong hết công đoạn → chờ KCS (đóng lệnh qua cổng 'close')
    if (prog === 0) return 'da-phat-hanh';
    var cur = lsxCurStage(l); var col = cur ? stageColOf(cur) : 'ctp';
    if (col === 'ctp') return 'dang-che-ban';
    if (col === 'print') return 'dang-in';
    if (col === 'lam' || col === 'die' || col === 'glue') return 'dang-gia-cong';
    if (col === 'kcs') return 'cho-kcs';
    return 'da-phat-hanh';
  }
  function lsxLc(l) { return l.lifecycle || deriveLifecycle(l); }
  // Bảng hành động chuyển trạng thái (gated). from:'*' = áp dụng mọi trạng thái.
  var GATE_ACTIONS = {
    'release':        { to: 'da-phat-hanh',    label: 'Phát hành lệnh',     type: 'gate',   from: ['du-thao'] },
    'cho-vat-tu':     { to: 'cho-vat-tu',      label: 'Chuyển chờ vật tư',  type: 'branch', from: ['da-phat-hanh'] },
    'material-ready': { to: 'dang-che-ban',    label: 'Báo đủ vật tư',      type: 'gate',   from: ['cho-vat-tu'] },
    'proof-need':     { to: 'cho-duyet-proof', label: 'Gửi mẫu cho khách', type: 'gate',  from: ['dang-che-ban'] },
    'proof-approve':  { to: 'da-duyet-proof',  label: 'Duyệt mẫu',        type: 'gate',   from: ['cho-duyet-proof'] },
    'kcs-pass':       { to: 'kcs-dat',         label: 'KCS đạt',            type: 'gate',   from: ['cho-kcs', 'kcs-loi'] },
    'kcs-fail':       { to: 'kcs-loi',         label: 'KCS lỗi',            type: 'branch', from: ['cho-kcs'] },
    'rework':         { to: 'dang-in',         label: 'Cho làm lại (sản xuất lại)', type: 'branch', from: ['kcs-loi'] },
    'scrap':          { to: 'scrap',           label: 'Loại bỏ lô',         type: 'branch', from: ['kcs-loi'] },
    'warehouse':      { to: 'da-nhap-kho',     label: 'Nhập kho TP',        type: 'gate',   from: ['kcs-dat'] },
    'deliver':        { to: 'da-giao',         label: 'Giao hàng',          type: 'gate',   from: ['da-nhap-kho'] },
    'close':          { to: 'da-dong',         label: 'Đóng lệnh',          type: 'gate',   from: ['da-giao'] },
    'pause':          { to: 'tam-dung',        label: 'Tạm dừng',           type: 'branch', from: '*' },
    'resume':         { to: '__prev__',        label: 'Tiếp tục',           type: 'branch', from: ['tam-dung'] },
    'cancel':         { to: 'da-huy',          label: 'Hủy lệnh',           type: 'branch', from: '*' }
  };
  function lsxNextActions(l) {
    var lc = lsxLc(l), acts = [];
    if (['da-dong', 'da-huy', 'scrap'].indexOf(lc) >= 0) return acts;
    if (lc === 'du-thao') return ['release', 'cancel'];
    if (lc === 'tam-dung') return ['resume', 'cancel'];
    Object.keys(GATE_ACTIONS).forEach(function (k) {
      var g = GATE_ACTIONS[k];
      if (g.from !== '*' && g.from.indexOf(lc) >= 0) acts.push(k);
    });
    acts.push('pause'); acts.push('cancel');
    return acts;
  }

  var Store = {
    CUSTOMERS: CUSTOMERS,
    STATUS_META: STATUS_META,
    APPR_META: APPR_META,
    ACTIVITY_META: ACTIVITY_META,
    MARGIN_PRESETS: MARGIN_PRESETS,
    STAGE_TEMPLATES: STAGE_TEMPLATES,
    APPROVER: APPROVER,
    custAbbr: custAbbr,
    fmtCurrencyShort: fmtCurrencyShort,

    allPTG: function () { return data.ptg; },
    allBG: function () { return data.bg; },

    getPTG: function (id) { return data.ptg.filter(function (p) { return p.id === id; })[0] || null; },
    getBG:  function (id) { return data.bg.filter(function (b) { return b.id === id; })[0] || null; },

    // ---- Người phụ trách báo giá + thống kê công việc ----
    salesTeam: function () { return SALES_TEAM; },
    roleOfUser: function (name) { var u = SALES_TEAM.filter(function (s) { return s.name === name; })[0]; return u ? u.role : ''; },
    // Người phụ trách 1 BG: ưu tiên assignedTo, mặc định = người tạo bản v1
    bgAssignee: function (b) {
      if (!b) return '';
      if (b.assignedTo) return b.assignedTo;
      var v0 = (b.versions && b.versions[0]) || null;
      return (v0 && v0.createdBy) || '';
    },
    // Gán / đổi người phụ trách 1 BG (ghi nhật ký hoạt động)
    assignBG: function (bgId, user) {
      var b = this.getBG(bgId); if (!b) return null;
      var prev = this.bgAssignee(b);
      b.assignedTo = user || '';
      (b.activity = b.activity || []).unshift({ type: 'assign',
        text: (prev && prev !== user) ? ('Chuyển phụ trách: ' + prev + ' → <b>' + (user || '—') + '</b>')
                                       : ('Gán phụ trách: <b>' + (user || '—') + '</b>'),
        date: 'hôm nay', by: 'Bạn' });
      this.save();
      return b;
    },
    // Thống kê công việc theo người phụ trách (gộp toàn bộ báo giá)
    bgWorkStats: function () {
      var self = this, map = {};
      function bucket(name) {
        return map[name] || (map[name] = { name: name, role: self.roleOfUser(name), total: 0, value: 0,
          draft: 0, sent: 0, won: 0, lost: 0, ordered: 0, wonValue: 0 });
      }
      SALES_TEAM.forEach(function (s) { bucket(s.name); });   // NV chưa có BG vẫn hiện (0)
      data.bg.forEach(function (b) {
        var a = bucket(self.bgAssignee(b) || 'Chưa gán');
        var val = self.grandOfVersion(b, self.currentVersion(b)) || 0;
        a.total += 1; a.value += val;
        if (b.status === 'nháp') a.draft += 1;
        else if (b.status === 'đã gửi') a.sent += 1;
        else if (b.status === 'duyệt') { a.won += 1; a.wonValue += val; }
        else if (b.status === 'chuyển đơn') { a.won += 1; a.ordered += 1; a.wonValue += val; }
        else if (b.status === 'từ chối') a.lost += 1;
      });
      return Object.keys(map).map(function (k) {
        var a = map[k], closed = a.won + a.lost;
        a.winRate = closed ? Math.round(a.won / closed * 100) : 0;
        return a;
      }).sort(function (x, y) { return y.value - x.value; });
    },

    // Danh sách PTG của 1 BG — tương thích BG cũ chỉ có bg.ptgId (1 dòng)
    bgPtgIds: function (bg) {
      if (bg && bg.ptgIds && bg.ptgIds.length) return bg.ptgIds.slice();
      return (bg && bg.ptgId) ? [bg.ptgId] : [];
    },
    // Các dòng (ptgId + markup riêng) của 1 version — version cũ chỉ có markup đơn → suy ra 1 dòng/PTG
    linesOfVersion: function (bg, ver) {
      var self = this;
      if (ver && ver.lines && ver.lines.length) return ver.lines;
      var mk = (ver && ver.markup != null) ? ver.markup : 25;
      return self.bgPtgIds(bg).map(function (id) { return { ptgId: id, markup: mk }; });
    },
    // Giá vốn 1 PTG
    lineCost: function (ptgId) {
      var p = this.getPTG(ptgId);
      if (!p) return 0;
      return global.PricingEngine.calcCost(p.state).costTotal;
    },

    // Giá vốn khóa của 1 BG = tổng giá vốn các PTG tham chiếu
    costOfBG: function (bg) {
      var self = this;
      return self.bgPtgIds(bg).reduce(function (s, id) { return s + self.lineCost(id); }, 0);
    },

    currentVersion: function (bg) {
      return bg.versions.filter(function (v) { return v.v === bg.currentVersion; })[0] || bg.versions[bg.versions.length - 1];
    },

    // Giá bán (đã VAT) của 1 version = tổng (giá vốn dòng × markup dòng + VAT)
    grandOfVersion: function (bg, ver) {
      var self = this;
      return self.linesOfVersion(bg, ver).reduce(function (s, ln) {
        return s + global.PricingEngine.applyMarkup(self.lineCost(ln.ptgId), ln.markup).grandTotal;
      }, 0);
    },

    APPROVAL_THRESHOLD: APPROVAL_THRESHOLD,
    // Lý do BG cần cấp trên duyệt (mảng rỗng = không cần)
    approvalReasons: function (bg) {
      var self = this, reasons = [];
      // (Đã bỏ điều kiện "Khách VIP" — không còn auto bắt buộc duyệt theo hạng khách)
      var grand = this.grandOfVersion(bg, this.currentVersion(bg));
      if (grand >= APPROVAL_THRESHOLD.value) reasons.push('Giá trị ≥ ' + fmtCurrencyShort(APPROVAL_THRESHOLD.value));
      var qty = self.bgPtgIds(bg).reduce(function (s, id) { var p = self.getPTG(id); return s + (p && p.state ? (p.state.quantity || 0) : 0); }, 0);
      if (qty >= APPROVAL_THRESHOLD.qty) reasons.push('SL ≥ ' + APPROVAL_THRESHOLD.qty.toLocaleString('vi-VN'));
      return reasons;
    },
    needsApproval: function (bg) {
      return bg.canDuyetManual === true || this.approvalReasons(bg).length > 0;
    },

    save: function () { persist(data); },

    // Lập phiếu tính giá mới (KTV) — state mặc định, KTV nhập thông số sau
    createPTG: function (opts) {
      opts = opts || {};
      var seq = 0;
      data.ptg.forEach(function (p) {
        var m = /PTG-2026-(\d+)/.exec(p.id); if (m) seq = Math.max(seq, parseInt(m[1], 10));
      });
      var id = 'PTG-2026-0' + (seq + 1);
      var st = global.PricingEngine.defaultState(opts.productType || 'offset');
      if (opts.quantity) st.quantity = opts.quantity;
      var isRoll = opts.productType === 'flexo' || opts.productType === 'digital';
      var ptg = {
        id: id,
        customer: opts.customer || CUSTOMERS[0].name,
        product: opts.product || (isRoll ? 'Cửa trượt quay 93 · 4 cánh' : 'Cửa thuỷ lực hệ 120 · 2 cánh'),
        status: opts.status || 'chờ thiết kế',
        phuTrach: opts.phuTrach || 'thiet-ke',
        yeuCau: opts.yeuCau || '',
        createdBy: opts.createdBy || 'Sales', date: 'hôm nay',
        note: opts.note || 'Sales gửi yêu cầu — chờ thiết kế tính giá.',
        state: st,
        activity: [{ type: 'create', text: 'Sales tạo yêu cầu, giao thiết kế tính giá', date: 'hôm nay', by: 'Sales' }]
      };
      data.ptg.unshift(ptg);
      this.save();
      return ptg;
    },

    // Danh sách PTG đã tính giá / đã duyệt (nguồn để tạo báo giá)
    approvedPTG: function () {
      return data.ptg.filter(function (p) { return p.status === 'đã tính giá' || p.status === 'đã duyệt'; });
    },

    // Tạo BG mới từ PTG (bước "→ Tạo báo giá")
    createBGfromPTG: function (ptgId) {
      var ptg = this.getPTG(ptgId);
      if (!ptg) return null;
      var id = nextBGId();
      var bg = {
        id: id, ptgId: ptgId, customer: ptg.customer, product: ptg.product,
        status: 'nháp', currentVersion: 1,
        versions: [{ v: 1, markup: 25, status: 'nháp', date: 'hôm nay', createdBy: 'Bạn',
          note: 'Tạo từ ' + ptgId + '.', terms: 'Cọc 50%, 50% sau giao. Hiệu lực 15 ngày.' }],
        activity: [{ type: 'create', text: 'Tạo báo giá v1 từ ' + ptgId, date: 'hôm nay', by: 'Bạn' }]
      };
      data.bg.unshift(bg);
      this.save();
      return bg;
    },

    // Tạo BG từ NHIỀU PTG (báo giá nhiều dòng, markup riêng từng dòng).
    // 1 PTG → uỷ thác createBGfromPTG (giữ nguyên shape cũ, không rủi ro).
    createBGfromPTGs: function (ptgIds) {
      ptgIds = (ptgIds || []).filter(Boolean);
      if (!ptgIds.length) return null;
      if (ptgIds.length === 1) return this.createBGfromPTG(ptgIds[0]);
      var first = this.getPTG(ptgIds[0]);
      if (!first) return null;
      var id = nextBGId();
      var lines = ptgIds.map(function (pid) { return { ptgId: pid, markup: 25 }; });
      var bg = {
        id: id, ptgId: ptgIds[0], ptgIds: ptgIds.slice(), customer: first.customer,
        product: first.product + ' +' + (ptgIds.length - 1) + ' SP',
        status: 'nháp', currentVersion: 1,
        versions: [{ v: 1, markup: 25, lines: lines, status: 'nháp', date: 'hôm nay', createdBy: 'Bạn',
          note: 'Tạo từ ' + ptgIds.length + ' phiếu tính giá.', terms: 'Cọc 50%, 50% sau giao. Hiệu lực 15 ngày.' }],
        activity: [{ type: 'create', text: 'Tạo báo giá v1 từ ' + ptgIds.join(', '), date: 'hôm nay', by: 'Bạn' }]
      };
      data.bg.unshift(bg);
      this.save();
      return bg;
    },

    // Nhân bản báo giá → BG mới, v1 nháp, giữ tham chiếu PTG
    duplicateBG: function (bgId) {
      var src = this.getBG(bgId);
      if (!src) return null;
      var cur = this.currentVersion(src);
      var id = nextBGId();
      var bg = {
        id: id, ptgId: src.ptgId, customer: src.customer, product: src.product,
        status: 'nháp', currentVersion: 1,
        versions: [{ v: 1, markup: cur.markup, status: 'nháp', date: 'hôm nay', createdBy: 'Bạn',
          note: 'Nhân bản từ ' + src.id + ' (v' + cur.v + ').', terms: cur.terms }],
        activity: [{ type: 'create', text: 'Nhân bản từ ' + src.id, date: 'hôm nay', by: 'Bạn' }]
      };
      if (src.ptgIds && src.ptgIds.length > 1) {
        bg.ptgIds = src.ptgIds.slice();
        bg.versions[0].lines = this.linesOfVersion(src, cur).map(function (l) { return { ptgId: l.ptgId, markup: l.markup }; });
      }
      data.bg.unshift(bg);
      this.save();
      return bg;
    },

    // ---- Activity log ----
    buildActivityFromVersions: function (bg) {
      var acts = [];
      bg.versions.forEach(function (v) {
        acts.push({ type: 'create', text: 'Tạo phiên bản v' + v.v + (v.note ? ' · ' + v.note : ''), date: v.date, by: v.createdBy });
        if (v.status === 'đã gửi' || v.status === 'duyệt' || v.status === 'chuyển đơn' || v.status === 'từ chối')
          acts.push({ type: 'send', text: 'Gửi khách v' + v.v, date: v.date, by: v.createdBy });
        if (v.status === 'duyệt') acts.push({ type: 'approve', text: 'Khách hàng duyệt v' + v.v, date: v.date, by: 'Khách hàng' });
        if (v.status === 'từ chối') acts.push({ type: 'reject', text: 'Khách hàng từ chối v' + v.v, date: v.date, by: 'Khách hàng' });
        if (v.status === 'chuyển đơn') acts.push({ type: 'convert', text: 'Chuyển v' + v.v + ' thành đơn hàng', date: v.date, by: v.createdBy });
      });
      return acts;
    },
    ensureActivity: function (bg) {
      if (!bg.activity) { bg.activity = this.buildActivityFromVersions(bg); this.save(); }
      return bg.activity;
    },
    addActivity: function (bgId, type, text, by) {
      var bg = this.getBG(bgId);
      if (!bg) return;
      this.ensureActivity(bg);
      bg.activity.push({ type: type, text: text, date: 'hôm nay', by: by || 'Bạn' });
      this.save();
    },

    // ---- BG vòng đời (lifecycle helpers) ----
    _setBGStatus: function (bg, status) {
      bg.status = status;
      var cur = this.currentVersion(bg); if (cur) cur.status = status;
    },
    // Sales đẩy lên cấp trên duyệt — vẫn ở 'nháp', chỉ bật nhãn phụ 'chờ'
    submitForApproval: function (bgId) {
      var bg = this.getBG(bgId); if (!bg) return null;
      this._setBGStatus(bg, 'nháp'); bg.appr = 'chờ'; this.ensureActivity(bg);
      bg.activity.push({ type: 'send', text: 'Sales gửi cấp trên duyệt báo giá', date: 'hôm nay', by: 'Sales' });
      this.save(); return bg;
    },
    // Cấp trên duyệt nội bộ — nhãn phụ 'duyệt' (sẵn sàng gửi khách)
    approveInternal: function (bgId, note) {
      var bg = this.getBG(bgId); if (!bg) return null;
      this._setBGStatus(bg, 'nháp'); bg.appr = 'duyệt'; this.ensureActivity(bg);
      bg.activity.push({ type: 'approve', text: 'Cấp trên duyệt' + (note ? ' · ' + note : ''), date: 'hôm nay', by: 'Cấp trên' });
      this.save(); return bg;
    },
    // Cấp trên trả lại — nhãn phụ 'trả' (Sales sửa lại)
    rejectInternal: function (bgId, note) {
      var bg = this.getBG(bgId); if (!bg) return null;
      this._setBGStatus(bg, 'nháp'); bg.appr = 'trả'; this.ensureActivity(bg);
      bg.activity.push({ type: 'reject', text: 'Cấp trên trả lại' + (note ? ' · ' + note : ''), date: 'hôm nay', by: 'Cấp trên' });
      this.save(); return bg;
    },
    CHANNEL_LABEL: { email: 'Email', zalo: 'Zalo', goi: 'Gọi điện', tay: 'Gửi tay' },
    CONTRACT_MODE_LABEL: { nguyen_tac: 'HĐ nguyên tắc', mua_ban: 'HĐ mua bán', none: 'Không cần HĐ' },
    LOSS_REASONS: ['Giá cao', 'Chọn NCC khác', 'Hoãn/huỷ dự án', 'Sai yêu cầu', 'Khác'],

    // Sales gửi khách — qua giai đoạn soạn, xóa nhãn duyệt; lưu kênh + thông tin theo dõi
    sendToCustomer: function (bgId, opts) {
      var bg = this.getBG(bgId); if (!bg) return null;
      opts = opts || {};
      this._setBGStatus(bg, 'đã gửi'); bg.appr = '';
      var ver = this.currentVersion(bg);
      var days = (ver && ver.validityDays) ? ver.validityDays : 15;
      bg.sendInfo = { channel: opts.channel || 'email', sentDate: 'hôm nay', validityDays: days, lastContact: '' };
      this.ensureActivity(bg);
      bg.activity.push({ type: 'send', text: 'Gửi báo giá cho khách qua ' + (this.CHANNEL_LABEL[bg.sendInfo.channel] || bg.sendInfo.channel), date: 'hôm nay', by: 'Sales' });
      this.save(); return bg;
    },
    // Sales ghi nhận đã liên hệ KH theo dõi (đẩy lại đồng hồ follow-up)
    recordContact: function (bgId, note) {
      var bg = this.getBG(bgId); if (!bg || bg.status !== 'đã gửi') return null;
      bg.sendInfo = bg.sendInfo || { channel: 'email', sentDate: 'hôm nay', validityDays: 15, lastContact: '' };
      bg.sendInfo.lastContact = 'hôm nay';
      this.ensureActivity(bg);
      bg.activity.push({ type: 'edit', text: 'Liên hệ KH theo dõi báo giá' + (note ? ' · ' + note : ''), date: 'hôm nay', by: 'Sales' });
      this.save(); return bg;
    },
    // Bỏ 1 HĐ khỏi danh sách (dùng để dọn HĐ mua bán nháp chưa neo đơn)
    _removeContract: function (id) {
      if (!id || !data.contracts) return;
      data.contracts = data.contracts.filter(function (c) { return c.id !== id; });
    },
    // HĐ nháp do hệ thống tự tạo lúc chốt mà CHƯA được dùng (chưa neo đơn) → an toàn để dọn
    _isUnusedAutoDraft: function (c) {
      if (!c || !c.auto) return false;
      return (c.contractType === 'mua_ban') ? !c.orderId : !(c.orderIds && c.orderIds.length);
    },
    // Khách chốt — kèm thông tin chốt đơn (ngày giao, hợp đồng, cọc).
    // Hợp đồng: chọn HĐ có sẵn HOẶC tạo mới (mua bán / nguyên tắc) rồi đính kèm ngay.
    //   deal.contractId  = HĐ có sẵn được chọn
    //   deal.newContract = true → tạo HĐ mới theo contractMode (+ targetValue/expiry cho nguyên tắc)
    confirmDeal: function (bgId, deal) {
      var bg = this.getBG(bgId); if (!bg) return null;
      deal = deal || {};
      var prev = bg.deal || {};
      var mode = deal.contractMode || 'none';
      var contractId = deal.newContract ? '' : (deal.contractId || '');
      // chỉ giữ contractId nếu đúng loại HĐ (tránh gắn nhầm khi đổi lựa chọn)
      if (contractId) {
        var cc = this.getContract(contractId);
        if (!cc || (mode === 'mua_ban' && cc.contractType !== 'mua_ban') || (mode === 'nguyen_tac' && cc.contractType !== 'nguyen_tac')) contractId = '';
      }

      // Dọn HĐ nháp tự-tạo cũ nếu lần này không còn dùng nó (tránh HĐ mồ côi)
      if (prev.contractId && prev.contractId !== contractId) {
        if (this._isUnusedAutoDraft(this.getContract(prev.contractId))) this._removeContract(prev.contractId);
      }

      // Tạo HĐ mới + đính kèm nếu cần
      var ptg = this.getPTG(bg.ptgId);
      var qty = (ptg && ptg.state && ptg.state.quantity) ? ptg.state.quantity : 0;
      var value = this.grandOfVersion(bg, this.currentVersion(bg));
      if (mode === 'mua_ban' && !contractId) {
        var hdm = this.createContract({ contractType: 'mua_ban', customer: bg.customer, product: bg.product, qty: qty, value: value, status: 'chờ ký' });
        hdm.auto = true; contractId = hdm.id;
      } else if (mode === 'nguyen_tac' && !contractId) {
        var hdn = this.createContract({ contractType: 'nguyen_tac', customer: bg.customer, targetValue: deal.targetValue || 0, targetQty: 0, expiryDate: deal.expiry || '', status: 'chờ ký', priceTerms: 'Theo thoả thuận khung.' });
        hdn.auto = true; contractId = hdn.id;
      }

      bg.deal = {
        confirmedDate: 'hôm nay',
        channel: deal.channel || 'email',
        channelOther: deal.channelOther || '',
        deliveryDate: deal.deliveryDate || '',
        contractMode: mode,   // 'nguyen_tac' | 'mua_ban' | 'none'
        contractId: contractId,
        depositPct: (deal.depositPct != null) ? deal.depositPct : 50
      };
      this._setBGStatus(bg, 'duyệt');
      this.ensureActivity(bg);
      bg.activity.push({ type: 'approve', text: 'Khách chốt báo giá · giao ' + (bg.deal.deliveryDate || '—') + (contractId ? ' · HĐ ' + contractId : ''), date: 'hôm nay', by: 'Khách hàng' });
      this.save(); return bg;
    },
    dealComplete: function (bg) { return !!(bg && bg.deal && bg.deal.deliveryDate && bg.deal.contractMode); },
    // Khách từ chối — kèm lý do phân loại
    recordLoss: function (bgId, info) {
      var bg = this.getBG(bgId); if (!bg) return null;
      info = info || {};
      bg.lossInfo = { reasonCat: info.reasonCat || 'Khác', competitor: info.competitor || '', note: info.note || '' };
      this._setBGStatus(bg, 'từ chối');
      this.ensureActivity(bg);
      bg.activity.push({ type: 'reject', text: 'Khách từ chối · ' + bg.lossInfo.reasonCat + (bg.lossInfo.competitor ? ' (' + bg.lossInfo.competitor + ')' : ''), date: 'hôm nay', by: 'Khách hàng' });
      this.save(); return bg;
    },
    // (giữ tương thích) Khách chốt không kèm thông tin
    markCustomerConfirmed: function (bgId) {
      var bg = this.getBG(bgId); if (!bg) return null;
      this._setBGStatus(bg, 'duyệt'); this.ensureActivity(bg);
      bg.activity.push({ type: 'approve', text: 'Khách hàng chốt báo giá', date: 'hôm nay', by: 'Khách hàng' });
      this.save(); return bg;
    },
    // Đã lên đơn
    markOrdered: function (bgId, orderId) {
      var bg = this.getBG(bgId); if (!bg) return null;
      this._setBGStatus(bg, 'chuyển đơn'); bg.orderId = orderId || bg.orderId; this.ensureActivity(bg);
      bg.activity.push({ type: 'order', text: 'Tạo đơn hàng ' + (orderId || ''), date: 'hôm nay', by: 'Sales' });
      this.save(); return bg;
    },

    // ---- PTG Activity log ----
    ensurePTGActivity: function (ptg) {
      if (!ptg.activity) { ptg.activity = [{ type: 'create', text: 'Tạo phiếu', date: ptg.date || 'hôm nay', by: ptg.createdBy || 'KTV' }]; this.save(); }
      return ptg.activity;
    },
    addPTGActivity: function (ptgId, type, text, by) {
      var ptg = this.getPTG(ptgId); if (!ptg) return;
      this.ensurePTGActivity(ptg);
      ptg.activity.push({ type: type, text: text, date: 'hôm nay', by: by || 'Bạn' });
      this.save();
    },
    // Thiết kế tính giá xong → trả Sales
    markPTGCosted: function (ptgId) {
      var ptg = this.getPTG(ptgId); if (!ptg) return null;
      ptg.status = 'đã tính giá'; ptg.phuTrach = 'sales';
      this.ensurePTGActivity(ptg);
      ptg.activity.push({ type: 'handoff', text: 'Thiết kế tính giá xong, trả Sales', date: 'hôm nay', by: 'Thiết kế' });
      this.save(); return ptg;
    },

    // Tạo version mới (clone version hiện tại) — khi BG đã gửi mà cần sửa
    addVersion: function (bgId) {
      var bg = this.getBG(bgId);
      if (!bg) return null;
      var cur = this.currentVersion(bg);
      var nv = {
        v: bg.versions.length + 1, markup: cur.markup, status: 'nháp',
        date: 'hôm nay', createdBy: 'Bạn',
        note: 'Phiên bản mới (sao từ v' + cur.v + ').', terms: cur.terms
      };
      if (cur.lines && cur.lines.length) nv.lines = cur.lines.map(function (l) { return { ptgId: l.ptgId, markup: l.markup }; });
      bg.versions.push(nv);
      bg.currentVersion = nv.v;
      bg.status = 'nháp'; bg.appr = ''; bg.sendInfo = null; bg.deal = null; bg.lossInfo = null;
      this.ensureActivity(bg);
      bg.activity.push({ type: 'create', text: 'Tạo phiên bản v' + nv.v + ' (sao từ v' + cur.v + ')', date: 'hôm nay', by: 'Bạn' });
      this.save();
      return nv;
    },

    // Clone từ một version cụ thể (nút trên dòng version)
    addVersionFrom: function (bgId, fromV) {
      var bg = this.getBG(bgId);
      if (!bg) return null;
      var src = bg.versions.filter(function (x) { return x.v === fromV; })[0];
      if (!src) return null;
      var nv = {
        v: bg.versions.length + 1, markup: src.markup, status: 'nháp',
        date: 'hôm nay', createdBy: 'Bạn',
        note: 'Sao từ v' + src.v + '.', terms: src.terms
      };
      if (src.lines && src.lines.length) nv.lines = src.lines.map(function (l) { return { ptgId: l.ptgId, markup: l.markup }; });
      bg.versions.push(nv);
      bg.currentVersion = nv.v;
      bg.status = 'nháp'; bg.appr = ''; bg.sendInfo = null; bg.deal = null; bg.lossInfo = null;
      this.ensureActivity(bg);
      bg.activity.push({ type: 'create', text: 'Tạo phiên bản v' + nv.v + ' (sao từ v' + src.v + ')', date: 'hôm nay', by: 'Bạn' });
      this.save();
      return nv;
    },

    // ---- Hợp đồng (Contracts) ----
    allContracts: function () { return data.contracts || (data.contracts = seedContracts()); },
    getContract: function (id) { return this.allContracts().filter(function (c) { return c.id === id; })[0] || null; },
    // Tìm HĐ theo đơn: HĐ mua bán (orderId) hoặc HĐ nguyên tắc neo đơn (orderIds[])
    getContractByOrder: function (orderId) {
      return this.allContracts().filter(function (c) {
        return c.orderId === orderId || (c.orderIds && c.orderIds.indexOf(orderId) >= 0);
      })[0] || null;
    },
    getContractsByCustomer: function (name) {
      return this.allContracts().filter(function (c) { return c.customer === name; });
    },
    // Giá trị hiển thị: HĐ nguyên tắc = trần giá trị; HĐ mua bán = giá trị đơn
    contractValue: function (c) { return c.contractType === 'nguyen_tac' ? (c.targetValue || 0) : (c.value || 0); },
    createContract: function (opts) {
      opts = opts || {};
      var seq = 0;
      this.allContracts().forEach(function (c) { var m = /HD-2026-(\d+)/.exec(c.id); if (m) seq = Math.max(seq, parseInt(m[1], 10)); });
      var id = 'HD-2026-' + ('00' + (seq + 1)).slice(-3);
      var type = opts.contractType || 'mua_ban';
      var hd = { id: id, contractType: type, customer: opts.customer || '',
        signDate: opts.signDate || '', effectiveDate: opts.effectiveDate || '', expiryDate: opts.expiryDate || '',
        status: opts.status || 'nháp', file: opts.file || '' };
      if (type === 'nguyen_tac') {
        hd.orderIds = opts.orderIds || [];
        hd.releasedValue = opts.releasedValue || 0;
        hd.targetValue = opts.targetValue || 0;
        hd.targetQty = opts.targetQty || 0;
        hd.priceTerms = opts.priceTerms || '';
      } else {
        hd.orderId = opts.orderId || '';
        hd.value = opts.value || 0;
        hd.product = opts.product || '';
        hd.qty = opts.qty || 0;
      }
      data.contracts.unshift(hd); this.save(); return hd;
    },
    saveContract: function (id, patch) {
      var hd = this.getContract(id); if (!hd) return null;
      Object.keys(patch || {}).forEach(function (k) { hd[k] = patch[k]; });
      this.save(); return hd;
    },
    // Neo 1 đơn vào HĐ nguyên tắc → cộng dồn lũy kế đã dùng
    linkOrderToContract: function (id, orderId, value) {
      var c = this.getContract(id); if (!c || c.contractType !== 'nguyen_tac') return null;
      c.orderIds = c.orderIds || [];
      if (orderId && c.orderIds.indexOf(orderId) < 0) {
        c.orderIds.push(orderId);
        c.releasedValue = (c.releasedValue || 0) + (Number(value) || 0);
        this.save();
      }
      return c;
    },

    // ---- Đơn hàng sinh từ BG ----
    allOrders: function () { return data.orders || (data.orders = seedOrders()); },
    getOrder: function (id) { return this.allOrders().filter(function (o) { return o.id === id; })[0] || null; },
    // Mã đơn quy ước POM (mã KH + ngày + STT) — dùng để hiển thị & dropdown đơn liên kết
    poCode: function (order) { return poCodeOf(typeof order === 'string' ? this.getOrder(order) : order); },
    ordersByCustomer: function (name) { return this.allOrders().filter(function (o) { return o.customer === name; }); },

    // ---- Khách hàng (danh mục dùng chung cho form lên đơn) ----
    allCustomers: function () { return CUSTOMERS; },
    addCustomer: function (o) {
      o = o || {};
      var name = String(o.name || '').trim();
      if (!name) return null;
      var ex = customerByName(name);
      if (ex) return ex;
      var c = { name: name, abbr: o.abbr || custAbbr(name), mst: o.mst || '', tier: o.tier || 'Mới',
        contact: o.contact || '', email: o.email || '' };
      CUSTOMERS.push(c);
      return c;
    },

    // ---- Nguồn SP cho form lên đơn (đơn sản xuất): PTG đã tính giá / đã duyệt ----
    readyPTGForOrder: function () {
      return this.approvedPTG().map(function (p) {
        var c = global.PricingEngine.calcCost(p.state);
        return { id: p.id, customer: p.customer, product: p.product,
          qty: (p.state && p.state.quantity) || 0, unit: 'bộ',
          costPerUnit: c.costPerUnit, costTotal: c.costTotal,
          tech: global.PricingEngine.typeOf(p.state) };
      });
    },

    // ---- Lập đơn hàng THỦ CÔNG từ màn hình lên đơn chuyên nghiệp ----
    //  payload: { orderType:'sx'|'vpp', customer, mst, contact, salesRep, createdDate,
    //             deliveryDate, paymentTerm, note, copyFrom,
    //             lines:[{code,name,qty,unit,price,discountPct,vatPct,ptgId,lineTotal,source}],
    //             financials:{ subtotal, orderDiscountPct, orderDiscount, vat, incentive,
    //                          commissionPct, commission, shippingFee, grandTotal, depositPct, deposit } }
    createOrderManual: function (payload) {
      payload = payload || {};
      var orderId = nextOrderIdStore();
      var lines = payload.lines || [];
      var products = lines.map(function (ln) {
        return { code: ln.code || '', name: ln.name || '', qty: ln.qty || 0, unit: ln.unit || '',
          price: ln.price || 0, discountPct: ln.discountPct || 0, vatPct: ln.vatPct || 0,
          ptgId: ln.ptgId || '', source: ln.source || '', lineTotal: ln.lineTotal || 0, lsxId: '' };
      });
      var qty = products.reduce(function (s, p) { return s + (p.qty || 0); }, 0);
      var fin = payload.financials || {};
      var value = fin.grandTotal || 0;
      var cust = customerByName(payload.customer) || {};
      var deposit = fin.deposit || 0;
      var isVPP = payload.orderType === 'vpp';
      var order = {
        id: orderId, createdDate: payload.createdDate || 'hôm nay',
        customer: payload.customer || (CUSTOMERS[0] && CUSTOMERS[0].name) || '',
        tier: cust.tier || '', mst: payload.mst || cust.mst || '', contact: payload.contact || cust.contact || '—',
        orderType: payload.orderType || 'sx',
        product: products.length ? (products[0].name + (products.length > 1 ? ' + ' + (products.length - 1) + ' SP' : '')) : 'Đơn hàng',
        productNote: isVPP ? 'Đơn thương mại VPP · lập tay' : 'Đơn sản xuất · lập tay',
        qty: qty, value: value, salesRep: payload.salesRep || 'Sales',
        dueDate: payload.deliveryDate || '', deliveryDate: payload.deliveryDate || '', daysLeft: 99,
        currentStage: 'Mới tạo', stageType: 'new', progress: [1, 0, 0, 0, 0],
        bgId: '', ptgId: '', lsxId: '', lsxIds: [], lsx: null, contractId: '',
        products: products, financials: fin,
        payment: { total: value, deposit: deposit, depositPct: fin.depositPct || 0, paid: 0,
          remaining: value - deposit, paymentTerm: payload.paymentTerm || '—', dueDate: '—' },
        timeline: [
          { stage: 'Tạo đơn', status: 'done', date: 'hôm nay', by: payload.salesRep || 'Sales' },
          { stage: 'Đặt cọc', status: 'pending', date: '—', by: '—' },
          { stage: isVPP ? 'Soạn hàng' : 'Sản xuất', status: 'pending', date: '—', by: '—' },
          { stage: 'QC', status: 'pending', date: '—', by: '—' },
          { stage: 'Giao hàng', status: 'pending', date: payload.deliveryDate || '—', by: '—' }
        ],
        activity: [{ time: 'hôm nay', by: payload.salesRep || 'Sales',
          action: 'Lập đơn ' + (isVPP ? 'thương mại VPP' : 'sản xuất') + ' thủ công' +
            (payload.copyFrom ? ' (sao chép từ <b>' + payload.copyFrom + '</b>)' : '') }]
      };
      this.allOrders().unshift(order);
      this.save();
      return order;
    },

    // ---- Nhập kho thành phẩm từ Lệnh sản xuất (đích: kho TP SX hoặc kho VPP) ----
    receiveFinishedGoods: function (lsxId, opts) {
      opts = opts || {};
      var l = this.getLSX(lsxId); if (!l) return null;
      var qty = opts.qty || l.qty || 0;
      var toVPP = opts.warehouse === 'vpp';
      if (lsxLc(l) === 'kcs-dat') {
        this.lsxAdvance(lsxId, 'warehouse', { by: opts.by || 'Kho', at: opts.at || 'vừa xong' });
      } else {
        l.lifecycle = 'da-nhap-kho';
        (l.transitions = l.transitions || []).unshift({ at: opts.at || 'vừa xong', by: opts.by || 'Kho',
          machine: '', label: 'Nhập kho TP', type: 'gate', lifecycle: 'da-nhap-kho' });
      }
      var st = (l.stages || []).filter(function (s) { return s.key === 'nhap-kho'; })[0];
      if (st) st.status = 'done';
      l.warehouseReceipt = { warehouse: toVPP ? 'vpp' : 'sx', qty: qty, at: opts.at || 'hôm nay', doc: '' };
      (l.activity = l.activity || []).unshift({ type: 'warehouse',
        text: 'Nhập kho ' + (toVPP ? 'Văn phòng phẩm' : 'thành phẩm SX') + ' · ' + Number(qty).toLocaleString('vi-VN') + ' ' + (opts.unit || 'bộ'),
        date: opts.at || 'hôm nay', by: opts.by || 'Kho' });
      if (toVPP && global.VPPStore) {
        var code = opts.vppCode, doc = 'Nhập kho TP · ' + lsxId + ' (SX nội bộ)', rec;
        if (code && global.VPPStore.get(code)) rec = global.VPPStore.stockIn(code, qty, doc);
        else { var np = global.VPPStore.addProduct({ name: l.product, group: 'Thành phẩm cửa nhôm', unit: opts.unit || 'bộ', onHand: 0 }); rec = global.VPPStore.stockIn(np.code, qty, doc); }
        if (rec) l.warehouseReceipt.vppCode = rec.code;
      }
      this.save();
      return l;
    },
    // ---- LSX ----
    allLSX: function () { return data.lsx || (data.lsx = seedLSX()); },
    getLSX: function (id) { return this.allLSX().filter(function (l) { return l.id === id; })[0] || null; },
    getLSXByOrder: function (orderId) { return this.allLSX().filter(function (l) { return l.orderId === orderId; })[0] || null; },
    // Cập nhật 1 LSX: ngày giao/nhận + bổ sung specs (soát đơn). Trả về LSX đã sửa.
    patchLSX: function (id, patch) {
      var l = this.getLSX(id); if (!l || !patch) return null;
      ['dateDelivery', 'dateWarehouse', 'dateReceived', 'note'].forEach(function (k) { if (patch[k] != null) l[k] = patch[k]; });
      if (patch.specs) {
        l.floor = l.floor || {}; l.floor.specs = l.floor.specs || {};
        for (var k in patch.specs) { if (patch.specs.hasOwnProperty(k)) l.floor.specs[k] = patch.specs[k]; }
      }
      this.save(); return l;
    },
    lsxByTech: function (tech) { return this.allLSX().filter(function (l) { return (l.tech || l.type) === tech; }); },
    stageTemplate: function (tech) { return STAGE_TEMPLATES[tech] || STAGE_TEMPLATES.offset; },

    // Gom công nghệ thành 4 nhóm hiển thị: offset · flexo · kts (cuộn+tờ) · wide
    techBucket: function (l) {
      var t = (l && (l.tech || l.type)) || '';
      if (t === 'digital' || t === 'digitalSheet') return 'kts';
      if (t === 'wideFormat') return 'wide';
      return t; // 'offset' | 'flexo'
    },
    // Gom vòng đời thành nhóm trạng thái cho pill: draft · running · done · cancel
    statusBucket: function (l) {
      var lc = this.lsxLifecycle(l);
      if (lc === 'du-thao') return 'draft';
      if (lc === 'da-huy' || lc === 'scrap') return 'cancel';
      if (lc === 'da-giao' || lc === 'da-dong') return 'done';
      return 'running'; // đã phát hành + đang chạy (gồm chờ vật tư, lập trình CNC, cắt phay, ép góc, KCS, nhập kho)
    },
    // SỔ LỆNH: lọc toàn bộ bản ghi (gồm lệnh đã xong/huỷ) theo search + tech + status
    //   search: khớp mã LSX · mã đơn (orderId) · autoCode · khách hàng · sản phẩm
    //   tech:   '' | 'offset' | 'flexo' | 'kts' | 'wide'
    //   status: '' | 'draft' | 'running' | 'done' | 'cancel' | 'needmc'
    queryLSX: function (opt) {
      opt = opt || {};
      var q = String(opt.search || '').trim().toLowerCase();
      var tech = opt.tech || '', status = opt.status || '', self = this;
      var TERM = ['da-dong', 'da-huy', 'scrap'];
      return this.allLSX().filter(function (l) {
        if (tech && self.techBucket(l) !== tech) return false;
        if (status === 'needmc') {
          if (TERM.indexOf(self.lsxLifecycle(l)) >= 0) return false;
          if (!self.routeOf(l.id).some(function (r) { return r.role && !r.machine; })) return false;
        } else if (status && self.statusBucket(l) !== status) return false;
        if (q) {
          var hay = [l.id, l.autoCode, l.orderId, l.bgId, l.customer, l.product].map(function (x) { return x || ''; }).join(' ').toLowerCase();
          if (hay.indexOf(q) < 0) return false;
        }
        return true;
      });
    },
    // Nhân bản (tái bản): copy TOÀN BỘ cấu hình → bản nháp mới, reset tiến độ SX
    duplicateLSX: function (srcId) {
      var src = this.getLSX(srcId); if (!src) return null;
      var all = this.allLSX();
      var cm = /^(.*-\d+)-(\d+)$/.exec(String(srcId));             // nếu nguồn vốn đã là bản nhân bản (LSX-0319-2) thì lấy gốc LSX-0319
      var base = cm ? cm[1] : String(srcId);
      var n = 2; while (all.some(function (l) { return l.id === base + '-' + n; })) n++;
      var newId = base + '-' + n;
      var c = JSON.parse(JSON.stringify(src));                      // copy tất cả cấu hình (route, phiếu, BOM, máy/thợ, spec, đóng gói)
      c.id = newId; c.clonedFrom = srcId;
      c.lifecycle = 'du-thao'; c.status = 'chờ SX';
      c.approval = { status: 'cho', by: '' };
      c.bomLocked = false; c.issuedBy = ''; c.issuedAt = '';
      c.floor = null; c.prod = {}; c.transfers = [];               // reset tiến độ (nháp chưa chạy)
      (c.stages || []).forEach(function (s) { if (s.type !== 'date') s.status = ''; });
      c.autoCode = buildAutoCode(c.tech, c.customer, c.productCode, c.dateReceived, n);
      c.lot = 'LOT-' + newId.replace(/\D/g, '');
      c.transitions = [{ at: 'hôm nay', by: 'Hệ thống', machine: '', label: 'Nhân bản từ ' + srcId, type: 'gate', lifecycle: 'du-thao' }];
      c.activity = [{ type: 'create', text: 'Nhân bản (tái bản) từ <b>' + srcId + '</b>', date: 'hôm nay', by: 'Kế hoạch SX' }];
      all.unshift(c);
      this.save();
      return c;
    },

    // ---- Định tuyến (route) công đoạn: gán máy + thợ từng công đoạn ----
    WORKCENTERS: WORKCENTERS,
    WORKERS: WORKERS,
    stageRole: function (stageKey) { return STAGE_ROLE[stageKey] || ''; },
    eligibleMachines: function (lsx, stageKey) { var l = (typeof lsx === 'string') ? this.getLSX(lsx) : lsx; return eligibleMachinesFor(l, stageKey); },
    eligibleWorkers: function (lsx, stageKey) { var l = (typeof lsx === 'string') ? this.getLSX(lsx) : lsx; return eligibleWorkersFor(l, stageKey); },
    // Gán máy/thợ cho 1 công đoạn — ghi vào l.stages[i].machine / .owner (persist)
    assignStage: function (id, stageKey, patch) {
      var l = this.getLSX(id); if (!l || !patch) return null;
      var st = (l.stages || []).filter(function (s) { return s.key === stageKey; })[0]; if (!st) return null;
      if (patch.machine != null) st.machine = patch.machine;
      if (patch.owner != null) st.owner = patch.owner;
      this.save(); return l;
    },
    // View-model route cho UI: bỏ ô ngày, kèm danh sách máy/thợ hợp lệ + giá trị đang gán
    routeOf: function (id) {
      var l = this.getLSX(id); if (!l) return [];
      var cols = colorsOf(l), q = l.qty || 0;
      return (l.stages || []).filter(function (s) { return s.type !== 'date'; }).map(function (s) {
        return {
          key: s.key, name: s.name, role: stageRoleOf(s), col: stageColOf(s), custom: !catalogOf(s.key),
          owner: s.owner || '', machine: s.machine || '',
          wastePct: wastePctFor(l, s.key, cols, q),
          form: s.form || [], formStat: formStatOf(s),
          grid: s.grid || null, gridStat: gridStatOf(s),
          eligM: eligibleMachinesFor(l, s.key), eligW: eligibleWorkersFor(l, s.key)
        };
      });
    },

    // ---- TRÌNH DỰNG ROUTE MỞ (người lập KH tự cấu hình công đoạn) ----
    STAGE_CATALOG: STAGE_CATALOG,
    // Thêm 1 công đoạn vào route (def.key từ danh mục, hoặc chỉ def.name = custom gõ tay)
    addStage: function (id, def, atIndex) {
      var l = this.getLSX(id); if (!l || !def) return null;
      l.stages = l.stages || [];
      var cat = def.key ? catalogOf(def.key) : null;
      var name = def.name || (cat && cat.name) || 'Công đoạn';
      var base = def.key || ('c-' + (String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 16) || 'cong-doan'));
      var key = base, n = 1;
      while (l.stages.some(function (s) { return s.key === key; })) { n++; key = base + '-' + n; }
      var dyn = cat && cat.role === 'print';   // khâu IN: bù hao tính động → để undefined
      var rl = def.role != null ? def.role : (cat ? cat.role : '');
      var st = stageFromDef({
        key: key, name: name, role: rl,
        col: def.col || (cat ? cat.col : (rl ? ROLE_COL[rl] : '')),
        wdept: def.wdept || (cat ? cat.wdept : (rl ? ROLE_WDEPT[rl] : '')),
        wastePct: def.wastePct != null ? def.wastePct : (dyn ? undefined : (cat ? cat.waste : 0.02))
      });
      var insAt;
      if (typeof atIndex === 'number' && atIndex >= 0) {
        insAt = Math.min(atIndex, l.stages.length);   // chèn đúng vị trí người dùng chọn
      } else {
        // mặc định: chèn trước cụm "Nhập kho/KCS" cuối route nếu có
        insAt = l.stages.length;
        for (var i = l.stages.length - 1; i >= 0; i--) {
          if (['nhap-kho', 'kcs'].indexOf(l.stages[i].key.replace(/-\d+$/, '')) >= 0) insAt = i; else break;
        }
      }
      l.stages.splice(insAt, 0, st);
      this.save(); return l;
    },
    removeStage: function (id, stageKey) {
      var l = this.getLSX(id); if (!l) return null;
      l.stages = (l.stages || []).filter(function (s) { return s.key !== stageKey; });
      this.save(); return l;
    },
    moveStage: function (id, stageKey, dir) {   // dir: -1 lên, +1 xuống
      var l = this.getLSX(id); if (!l) return null;
      var ss = l.stages || [], i = -1; ss.forEach(function (s, k) { if (s.key === stageKey) i = k; });
      var j = i + dir; if (i < 0 || j < 0 || j >= ss.length) return l;
      var tmp = ss[i]; ss[i] = ss[j]; ss[j] = tmp;
      this.save(); return l;
    },
    setStageWaste: function (id, stageKey, pct) {  // pct: % (0..50) → lưu phân số
      var l = this.getLSX(id); if (!l) return null;
      var st = (l.stages || []).filter(function (s) { return s.key === stageKey; })[0]; if (!st) return null;
      st.wastePct = Math.max(0, Math.min(50, parseFloat(pct) || 0)) / 100;
      this.save(); return l;
    },
    renameStage: function (id, stageKey, name) {
      var l = this.getLSX(id); if (!l || !name) return null;
      var st = (l.stages || []).filter(function (s) { return s.key === stageKey; })[0]; if (!st) return null;
      st.name = name; this.save(); return l;
    },
    // Phần A — đổi NHÓM MÁY của 1 công đoạn (người dùng tự chọn, không đoán)
    ROLE_LABEL: ROLE_LABEL, ROLE_OPTS: ROLE_OPTS,
    setStageRole: function (id, stageKey, role) {
      var l = this.getLSX(id); if (!l) return null;
      var st = (l.stages || []).filter(function (s) { return s.key === stageKey; })[0]; if (!st) return null;
      role = role || '';
      st.role = role;
      st.col = role ? (ROLE_COL[role] || 'lam') : (st.col || 'lam');
      st.wdept = role ? (ROLE_WDEPT[role] || 'gia-cong') : (st.wdept || 'gia-cong');
      // máy đang gán không còn hợp nhóm mới → bỏ gán
      if (st.machine && !eligibleMachinesFor(l, stageKey).some(function (m) { return m.id === st.machine; })) st.machine = '';
      this.save(); return l;
    },

    // ===== PHẦN B — PHIẾU CÔNG ĐOẠN (form động) =====
    FIELD_TYPES: FIELD_TYPES,
    stageForm: function (id, stageKey) { var l = this.getLSX(id); if (!l) return []; var st = (l.stages || []).filter(function (s) { return s.key === stageKey; })[0]; return (st && st.form) || []; },
    formStat: function (id, stageKey) { var l = this.getLSX(id); if (!l) return null; var st = (l.stages || []).filter(function (s) { return s.key === stageKey; })[0]; return st ? formStatOf(st) : null; },
    _stageOf: function (id, stageKey) { var l = this.getLSX(id); if (!l) return null; return (l.stages || []).filter(function (s) { return s.key === stageKey; })[0] || null; },
    addFormField: function (id, stageKey, type) {
      var st = this._stageOf(id, stageKey); if (!st) return null;
      st.form = st.form || [];
      var f = freshField({ id: nextFieldId(st.form), type: type || 'text', label: '', open: type !== 'info', required: false, value: '', plan: '', files: [] });
      st.form.push(f); this.save(); return f;
    },
    updateFormField: function (id, stageKey, fid, patch) {
      var st = this._stageOf(id, stageKey); if (!st) return null;
      var f = (st.form || []).filter(function (x) { return x.id === fid; })[0]; if (!f) return null;
      ['label', 'value', 'plan'].forEach(function (k) { if (patch[k] != null) f[k] = patch[k]; });
      if (patch.required != null) f.required = !!patch.required;
      if (patch.open != null) f.open = (f.type === 'info') ? false : !!patch.open;  // info luôn khóa
      this.save(); return f;
    },
    removeFormField: function (id, stageKey, fid) {
      var st = this._stageOf(id, stageKey); if (!st) return null;
      st.form = (st.form || []).filter(function (x) { return x.id !== fid; }); this.save(); return st;
    },
    moveFormField: function (id, stageKey, fid, dir) {
      var st = this._stageOf(id, stageKey); if (!st || !st.form) return null;
      var arr = st.form, i = -1; arr.forEach(function (x, k) { if (x.id === fid) i = k; });
      var j = i + dir; if (i < 0 || j < 0 || j >= arr.length) return st;
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t; this.save(); return st;
    },
    addFormFile: function (id, stageKey, fid, name, by) {   // planner đính tệp template
      var st = this._stageOf(id, stageKey); if (!st) return null;
      var f = (st.form || []).filter(function (x) { return x.id === fid; })[0]; if (!f || !name) return null;
      f.files = f.files || []; f.files.push({ name: name, by: by || 'Thiết kế' }); this.save(); return f;
    },
    fillFormField: function (id, stageKey, fid, patch) {   // thợ điền — CHẶN nếu field không mở
      var st = this._stageOf(id, stageKey); if (!st) return null;
      var f = (st.form || []).filter(function (x) { return x.id === fid; })[0]; if (!f || !f.open || f.type === 'info') return null;
      if (patch.runValue != null) f.runValue = patch.runValue;
      if (patch.runChecked != null) f.runChecked = !!patch.runChecked;
      if (patch.runFile) { f.runFiles = f.runFiles || []; f.runFiles.push({ name: patch.runFile, by: patch.by || 'Thợ' }); }
      f.runBy = patch.by || f.runBy || ''; f.runAt = patch.at || f.runAt || '';
      this.save(); return f;
    },

    // ===== PHẦN B2 — PHIẾU BẢNG LƯỚI (Excel hóa) =====
    CELL_BG: CELL_BG,
    gridCovered: function (g) { return gridCovered(g); },
    stageGrid: function (id, stageKey) { var st = this._stageOf(id, stageKey); return (st && st.grid) || null; },
    gridStat: function (id, stageKey) { var st = this._stageOf(id, stageKey); return st ? gridStatOf(st) : null; },
    ensureGrid: function (id, stageKey) { var st = this._stageOf(id, stageKey); if (!st) return null; if (!st.grid) { st.grid = defaultGrid(); this.save(); } return st.grid; },
    clearGrid: function (id, stageKey) { var st = this._stageOf(id, stageKey); if (st) { st.grid = null; this.save(); } return st; },
    gridAddRow: function (id, stageKey) { var g = this.stageGrid(id, stageKey); if (!g) return null; var row = []; for (var c = 0; c < g.cols; c++) row.push(freshCell()); g.rows.push(row); this.save(); return g; },
    gridAddCol: function (id, stageKey) { var g = this.stageGrid(id, stageKey); if (!g) return null; g.rows.forEach(function (row) { row.push(freshCell()); }); g.cols++; this.save(); return g; },
    gridDelRow: function (id, stageKey, r) {
      var g = this.stageGrid(id, stageKey); if (!g || g.rows.length <= 1 || r < 0 || r >= g.rows.length) return g;
      for (var rr = 0; rr < r; rr++) for (var c = 0; c < g.cols; c++) { var cell = g.rows[rr][c]; if ((cell.rs || 1) > 1 && rr + cell.rs - 1 >= r) cell.rs--; }
      g.rows.splice(r, 1); this.save(); return g;
    },
    gridDelCol: function (id, stageKey, c) {
      var g = this.stageGrid(id, stageKey); if (!g || g.cols <= 1 || c < 0 || c >= g.cols) return g;
      g.rows.forEach(function (row) { for (var cc = 0; cc < c; cc++) { var cell = row[cc]; if ((cell.cs || 1) > 1 && cc + cell.cs - 1 >= c) cell.cs--; } row.splice(c, 1); });
      g.cols--; this.save(); return g;
    },
    gridSetCell: function (id, stageKey, r, c, patch) {
      var g = this.stageGrid(id, stageKey); if (!g || !g.rows[r] || !g.rows[r][c]) return null;
      var cell = g.rows[r][c];
      ['v', 'plan', 'bg', 'al', 'url'].forEach(function (k) { if (patch[k] != null) cell[k] = patch[k]; });
      if (patch.t != null) { cell.t = patch.t; if (cell.t === 'label' || cell.t === 'link') cell.open = false; }
      if (patch.open != null) cell.open = (cell.t === 'label') ? false : !!patch.open;
      if (patch.req != null) cell.req = !!patch.req;
      this.save(); return cell;
    },
    gridMerge: function (id, stageKey, r1, c1, r2, c2) {
      var g = this.stageGrid(id, stageKey); if (!g) return null;
      var ra = Math.min(r1, r2), rb = Math.max(r1, r2), ca = Math.min(c1, c2), cb = Math.max(c1, c2);
      if (ra === rb && ca === cb) return g;
      rb = Math.min(rb, g.rows.length - 1); cb = Math.min(cb, g.cols - 1);
      for (var r = ra; r <= rb; r++) for (var c = ca; c <= cb; c++) { g.rows[r][c].rs = 1; g.rows[r][c].cs = 1; }
      g.rows[ra][ca].rs = rb - ra + 1; g.rows[ra][ca].cs = cb - ca + 1;
      this.save(); return g;
    },
    gridUnmerge: function (id, stageKey, r, c) { var g = this.stageGrid(id, stageKey); if (!g || !g.rows[r] || !g.rows[r][c]) return null; g.rows[r][c].rs = 1; g.rows[r][c].cs = 1; this.save(); return g; },
    gridFillCell: function (id, stageKey, r, c, patch) {
      var g = this.stageGrid(id, stageKey); if (!g || !g.rows[r] || !g.rows[r][c]) return null;
      var cell = g.rows[r][c]; if (!cellFillable(cell)) return null;
      if (patch.rv != null) cell.rv = patch.rv;
      if (patch.rc != null) cell.rc = !!patch.rc;
      this.save(); return cell;
    },

    // ---- Route theo SẢN PHẨM (tái bản dùng lại, lưu THỦ CÔNG) ----
    productRoute: function (code) { var p = this.getProduct(code); return (p && p.route) || null; },
    hasProductRoute: function (code) { var r = this.productRoute(code); return !!(r && r.length); },
    saveRouteToProduct: function (id) {
      var l = this.getLSX(id); if (!l || !l.productCode) return null;
      var p = this.getProduct(l.productCode); if (!p) return null;
      p.route = (l.stages || []).filter(function (s) { return s.type !== 'date'; }).map(routeDefFromStage);
      this.save(); return p;
    },
    applyProductRoute: function (id) {
      var l = this.getLSX(id); if (!l) return null;
      var r = this.productRoute(l.productCode); if (!r || !r.length) return null;
      l.stages = r.map(stageFromDef); this.save(); return l;
    },

    // ===== PHẦN C — THÔNG SỐ LỆNH + PHÁT HÀNH / THU HỒI =====
    setLsxParams: function (id, patch) {
      var l = this.getLSX(id); if (!l || !patch) return null;
      ['startAt', 'shift', 'priority', 'incharge', 'note', 'dateDelivery'].forEach(function (k) { if (patch[k] != null) l[k] = patch[k]; });
      if (patch.qtyStock != null) l.qtyStock = Math.max(0, parseInt(patch.qtyStock, 10) || 0);
      if (patch.qtyProd != null) l.qtyProd = Math.max(0, parseInt(patch.qtyProd, 10) || 0);
      this.save(); return l;
    },
    lsxQtyProd: function (l) { return (l.qtyProd != null) ? l.qtyProd : Math.max(0, (l.qty || 0) - (l.qtyStock || 0)); },
    // Bảng soát "Sẵn sàng phát hành": chặn cứng (hard) + cảnh báo mềm (soft)
    releaseCheck: function (id) {
      var l = this.getLSX(id); if (!l) return null;
      var work = (l.stages || []).filter(function (s) { return s.type !== 'date'; });
      var needMc = work.filter(function (s) { return stageRoleOf(s); });
      var noMc = needMc.filter(function (s) { return !s.machine; });
      var noWk = needMc.filter(function (s) { return !s.owner; });
      var qp = this.lsxQtyProd(l);
      var hard = [
        { ok: work.length > 0, label: work.length > 0 ? ('Có ' + work.length + ' công đoạn') : 'CHƯA có công đoạn nào' },
        { ok: noMc.length === 0, label: noMc.length === 0 ? 'Công đoạn cần máy đã gán máy' : (noMc.length + ' công đoạn cần máy CHƯA gán máy') },
        { ok: qp > 0, label: 'SL sản xuất ' + fmtInt(qp) + (qp > 0 ? '' : ' (≤ 0)') }
      ];
      var soft = [];
      if (noWk.length) soft.push({ ok: false, label: noWk.length + ' công đoạn chưa gán thợ' });
      var sp = (l.floor || {}).specs || {}, imp = imposition(l) || {}, miss = [];
      if (!(sp.giay || imp.paperName)) miss.push('hệ nhôm');
      if (!(imp.colors > 0 || sp.soMau)) miss.push('số cánh');
      if (!(sp.khoThanhPham || l.size)) miss.push('khổ');
      if (miss.length) soft.push({ ok: false, label: 'Thiếu spec: ' + miss.join(', ') });
      var sd = parseAnyDate(l.startAt), today = new Date(); today.setHours(0, 0, 0, 0);
      if (sd && sd < today) soft.push({ ok: false, label: 'Thời gian bắt đầu trong quá khứ' });
      if (sd) {
        var totMin = stagePlanFor(l).stages.reduce(function (a, r) { return a + (r.durMin || 0); }, 0);
        var fin = new Date(sd.getTime() + Math.ceil(totMin / 480) * 86400000), dd = parseAnyDate(l.dateDelivery);
        if (dd && fin > dd) soft.push({ ok: false, label: 'Dự kiến xong ' + fmtDMY(fin) + ' — VƯỢT hạn giao ' + fmtDMY(dd) });
      }
      return { hard: hard, soft: soft, canRelease: hard.every(function (h) { return h.ok; }) && lsxLc(l) === 'du-thao' };
    },
    releaseLSX: function (id) {
      var chk = this.releaseCheck(id); if (!chk || !chk.canRelease) return null;
      var l = this.getLSX(id); l.issuedBy = 'Kế hoạch SX'; l.issuedAt = 'hôm nay'; l.status = 'đang SX';
      return this.lsxAdvance(id, 'release', { by: 'Kế hoạch SX', at: nowLabelG() });
    },
    recallLSX: function (id) {   // thu hồi về dự thảo — chỉ khi chưa chạy công đoạn nào
      var l = this.getLSX(id); if (!l || lsxLc(l) !== 'da-phat-hanh') return null;
      if ((l.stages || []).some(function (s) { return s.status === 'doing' || s.status === 'done'; })) return null;
      l.lifecycle = 'du-thao'; l.status = 'chờ SX'; l.issuedBy = ''; l.issuedAt = '';
      (l.transitions = l.transitions || []).unshift({ at: nowLabelG(), by: 'Kế hoạch SX', machine: '', label: 'Thu hồi về dự thảo', type: 'gate', lifecycle: 'du-thao' });
      this.save(); return l;
    },

    // ---- Định mức + bù hao cộng dồn (mục 2) ----
    stagePlan: function (id) { var l = (typeof id === 'string') ? this.getLSX(id) : id; return l ? stagePlanFor(l) : null; },
    bomBreakdown: function (id) { var l = (typeof id === 'string') ? this.getLSX(id) : id; return l ? bomBreakdownFor(l) : null; },
    lockBOM: function (id) { var l = this.getLSX(id); if (!l) return null; l.bomLocked = true; (l.activity = l.activity || []).push({ type: 'lock', text: 'Chốt định mức BOM', date: 'hôm nay', by: 'Kế hoạch SX' }); this.save(); return l; },

    // ---- Gộp lô thật (mục 3) ----
    makeGang: function (ids) {
      ids = ids || []; if (!ids.length) return null;
      var seq = 0; this.allLSX().forEach(function (l) { var m = /GANG-(\d+)/.exec(l.gangId || ''); if (m) seq = Math.max(seq, +m[1]); });
      var gid = 'GANG-' + ('00' + (seq + 1)).slice(-3);
      var self = this;
      ids.forEach(function (id) { var l = self.getLSX(id); if (l) { l.gangId = gid; (l.activity = l.activity || []).push({ type: 'gang', text: 'Gộp lô → ' + gid, date: 'hôm nay', by: 'Kế hoạch SX' }); } });
      this.save(); return gid;
    },

    // ---- Điều độ chồng lấn + lô chuyển (mục 5) ----
    scheduleMachines: function (strategy) {
      var active = this.allLSX().filter(function (l) { return ['da-dong', 'da-huy', 'scrap', 'du-thao'].indexOf(l.lifecycle || deriveLifecycle(l)) < 0; });
      return scheduleMachinesFor(active, strategy);
    },
    stageProgress: function (id) { var l = (typeof id === 'string') ? this.getLSX(id) : id; return l ? stageProgressFor(l) : null; },
    // Mô phỏng chuyển lô: tăng SL lũy kế công đoạn `fromKey` + ghi log lô chuyển sang công đoạn kế
    transferBatch: function (id, fromKey, qty, opts) {
      opts = opts || {}; var l = this.getLSX(id); if (!l) return null;
      var sp = stagePlanFor(l); var idx = -1;
      sp.stages.forEach(function (r, i) { if (r.key === fromKey) idx = i; });
      if (idx < 0) return null;
      var planOut = sp.stages[idx].outQty;
      l.prod = l.prod || {};
      var cur = l.prod[fromKey] || 0; qty = Math.min(qty || Math.ceil(planOut * 0.25), planOut - cur);
      if (qty <= 0) return l;
      l.prod[fromKey] = cur + qty;
      var to = sp.stages[idx + 1];
      (l.transfers = l.transfers || []).unshift({ from: sp.stages[idx].name, to: to ? to.name : 'Nhập kho', qty: qty, at: opts.at || 'vừa xong', by: opts.by || 'Công nhân', shift: opts.shift || 'Ca 1' });
      this.save(); return l;
    },
    // ---- View shop-floor (1 nguồn cho trang 04 Kanban & 06 Lệnh SX) ----
    KANBAN_COLUMNS: KANBAN_COLUMNS,
    // Tính phôi + Gộp lô (việc 3 — Kế hoạch SX)
    imposition: function (l) { var x = (typeof l === 'string') ? this.getLSX(l) : l; return x ? imposition(x) : null; },
    impStateForLSX: function (l) { var x = (typeof l === 'string') ? this.getLSX(l) : l; return x ? impStateForLSX(x) : null; },
    gangCandidates: function () { return gangCandidates(this.allLSX()); },
    lsxKanbanView: function () { return this.allLSX().map(lsxDerive); },
    lsxListView: function () {
      var self = this;
      return this.allLSX().map(function (l) {
        var v = lsxDerive(l);
        return { id: v.id, from: v.from, product: v.product, sub: v.sub, kh: v.kh, khTier: v.khTier,
          machine: v.machine, worker: v.worker, stage: v.stageName, stageType: v.stageType,
          progress: v.progress, dueDate: v.dueDate, daysLeft: v.daysLeft, status: v.status06, delay: v.delay,
          tech: self.techBucket(l), nProducts: v.nProducts };
      });
    },
    // Duyệt sản xuất (cổng trước khi chạy công đoạn)
    approveLSX: function (id, by) {
      var l = this.getLSX(id); if (!l) return null;
      l.approval = { status: 'duyet', by: by || APPROVER[l.tech] || 'Quý' };
      (l.activity = l.activity || []).push({ type: 'approve', text: 'Duyệt sản xuất', date: 'hôm nay', by: l.approval.by });
      this.save(); return l;
    },
    // Cập nhật trạng thái 1 công đoạn ('' | wait | doing | done)
    setStageStatus: function (id, key, status) {
      var l = this.getLSX(id); if (!l) return null;
      var st = (l.stages || []).filter(function (s) { return s.key === key; })[0];
      if (!st) return null;
      st.status = status;
      // tự cập nhật trạng thái lệnh theo tiến độ công đoạn
      var work = l.stages.filter(function (s) { return s.type !== 'date'; });
      var doneN = work.filter(function (s) { return s.status === 'done'; }).length;
      if (doneN === 0) l.status = 'chờ SX';
      else if (doneN === work.length) l.status = 'hoàn thành';
      else l.status = 'đang SX';
      this.save(); return l;
    },
    // % hoàn thành công đoạn (bỏ ô ngày)
    lsxProgress: function (l) {
      var work = (l.stages || []).filter(function (s) { return s.type !== 'date'; });
      if (!work.length) return 0;
      var doneN = work.filter(function (s) { return s.status === 'done'; }).length;
      return Math.round(doneN / work.length * 100);
    },

    // ---- State machine vòng đời LSX ----
    LSX_LIFECYCLE: LSX_LIFECYCLE,
    LSX_BRANCH: LSX_BRANCH,
    lifecycleMeta: function (key) { return lifecycleMeta(key); },
    lsxLifecycle: function (l) { return lsxLc(l); },
    nextActions: function (l) { return lsxNextActions(l); },
    actionMeta: function (k) { return GATE_ACTIONS[k] || null; },
    lsxTransitions: function (id) { var l = this.getLSX(id); return (l && l.transitions) || []; },
    // Quét QR 1 công đoạn: action 'start' | 'finish' — cập nhật stage + suy lại vòng đời + ghi log
    scanStage: function (id, key, action, opts) {
      opts = opts || {};
      var l = this.getLSX(id); if (!l) return null;
      var st = (l.stages || []).filter(function (s) { return s.key === key; })[0]; if (!st) return null;
      st.status = (action === 'finish') ? 'done' : 'doing';
      var work = l.stages.filter(function (s) { return s.type !== 'date'; });
      var doneN = work.filter(function (s) { return s.status === 'done'; }).length;
      l.status = doneN === 0 ? 'chờ SX' : (doneN === work.length ? 'hoàn thành' : 'đang SX');
      // chỉ tự suy vòng đời khi đang ở các trạng thái do công đoạn lái (không đè trạng thái cổng/nhánh)
      var locked = ['du-thao', 'tam-dung', 'da-huy', 'scrap', 'cho-vat-tu', 'cho-duyet-proof', 'kcs-loi', 'kcs-dat', 'da-nhap-kho', 'da-giao', 'da-dong'];
      if (locked.indexOf(lsxLc(l)) === -1) l.lifecycle = deriveLifecycle(l);
      (l.transitions = l.transitions || []).unshift({
        at: opts.at || 'vừa xong', by: opts.by || 'Công nhân', machine: opts.machine || l.machineIn || l.machine || '',
        label: (action === 'finish' ? 'Hoàn thành' : 'Bắt đầu') + ' · ' + st.name, type: 'scan', lifecycle: l.lifecycle
      });
      this.save(); return l;
    },
    // Chuyển trạng thái vòng đời qua nút bấm (có kiểm tra hợp lệ)
    lsxAdvance: function (id, actionKey, opts) {
      opts = opts || {};
      var l = this.getLSX(id); if (!l) return null;
      var g = GATE_ACTIONS[actionKey]; if (!g) return null;
      var lc = lsxLc(l);
      if (g.from !== '*' && g.from.indexOf(lc) < 0) return null;
      var to = g.to;
      if (actionKey === 'pause') l.prevLifecycle = lc;
      if (to === '__prev__') { to = l.prevLifecycle || 'dang-in'; l.prevLifecycle = ''; }
      l.lifecycle = to;
      (l.transitions = l.transitions || []).unshift({
        at: opts.at || 'vừa xong', by: opts.by || 'Điều độ', machine: opts.machine || '',
        label: g.label, type: g.type, lifecycle: to
      });
      this.save(); return l;
    },
    createOrderFromBG: function (bgId) {
      var bg = this.getBG(bgId); if (!bg) return null;
      var existed = this.allOrders().filter(function (o) { return o.bgId === bg.id; })[0];
      if (existed) { return { order: existed, lsx: this.getLSXByOrder(existed.id) }; }
      var ptg = this.getPTG(bg.ptgId);
      var ver = this.currentVersion(bg);
      var value = this.grandOfVersion(bg, ver);
      var orderId = nextOrderIdStore();
      var self = this;
      // Mỗi dòng báo giá → 1 sản phẩm master (tạo mới nếu PTG chưa gắn SP), CHƯA đủ thông tin SX
      function ensureProd(ptgId) {
        var pt = self.getPTG(ptgId) || {};
        var prod = pt.prod || {}, ok = ptgSpecComplete(pt);
        if (pt.fromProduct && productByCode(pt.fromProduct)) {
          var ex = productByCode(pt.fromProduct);
          ex.prod = Object.assign({}, prod); ex.infoComplete = ok;
          return pt.fromProduct;
        }
        var np = self.createProduct({ name: pt.product || bg.product, customer: bg.customer, state: pt.state, createdFrom: 'don', prod: prod, infoComplete: ok });
        if (pt.id) pt.fromProduct = np.code;
        return np.code;
      }
      var products = self.linesOfVersion(bg, ver).map(function (ln) {
        var pt = self.getPTG(ln.ptgId) || {};
        var lineQty = (pt.state && pt.state.quantity) ? pt.state.quantity : 0;
        return { code: ensureProd(ln.ptgId), name: pt.product || bg.product, qty: lineQty, ptgId: ln.ptgId,
          lineTotal: global.PricingEngine.applyMarkup(self.lineCost(ln.ptgId), ln.markup).grandTotal, lsxId: '' };
      });
      var qty = products.reduce(function (s, p) { return s + (p.qty || 0); }, 0);
      // Thông tin chốt đơn → chảy sang đơn hàng + hợp đồng
      var deal = bg.deal || {};
      var depositPct = (deal.depositPct != null) ? deal.depositPct : 0;
      var deposit = Math.round(value * depositPct / 100);
      var deliveryDate = deal.deliveryDate || '';
      var contractId = '';
      if (deal.contractMode === 'mua_ban') {
        if (deal.contractId && this.getContract(deal.contractId)) {
          // hoàn tất HĐ mua bán (nháp/có sẵn) đã đính kèm khi chốt → neo đơn + ký
          this.saveContract(deal.contractId, { orderId: orderId, value: value, qty: qty, product: bg.product, status: 'đã ký', signDate: 'hôm nay', auto: false });
          contractId = deal.contractId;
        } else {
          var hd = this.createContract({ contractType: 'mua_ban', customer: bg.customer, orderId: orderId, value: value, product: bg.product, qty: qty, status: 'đã ký', signDate: 'hôm nay' });
          contractId = hd.id;
        }
      } else if (deal.contractMode === 'nguyen_tac' && deal.contractId) {
        this.linkOrderToContract(deal.contractId, orderId, value);
        var ntc = this.getContract(deal.contractId);
        if (ntc && ntc.status === 'chờ ký') { this.saveContract(deal.contractId, { status: 'đã ký', signDate: 'hôm nay', auto: false }); }
        contractId = deal.contractId;
      }
      if (bg.deal) bg.deal.contractId = contractId;
      var order = {
        id: orderId, createdDate: 'hôm nay', customer: bg.customer, tier: (customerByName(bg.customer) || {}).tier || '',
        mst: '', contact: '—', product: bg.product, productNote: 'Tạo từ báo giá ' + bg.id,
        qty: qty, value: value, salesRep: 'Sales', dueDate: deliveryDate || '', deliveryDate: deliveryDate || '', daysLeft: 99,
        currentStage: 'Mới tạo', stageType: 'new', progress: [1, 0, 0, 0, 0],
        bgId: bg.id, ptgId: bg.ptgId, lsxId: '', lsxIds: [], lsx: null, contractId: contractId, products: products,
        payment: { total: value, deposit: deposit, depositPct: depositPct, paid: 0, remaining: value - deposit, paymentTerm: (ver && ver.terms) ? ver.terms : '—', dueDate: '—' },
        timeline: [
          { stage: 'Báo giá', status: 'done', date: 'hôm nay', by: 'Sales' },
          { stage: 'Đặt cọc', status: 'pending', date: '—', by: '—' },
          { stage: 'Sản xuất', status: 'pending', date: '—', by: '—' },
          { stage: 'QC', status: 'pending', date: '—', by: '—' },
          { stage: 'Giao hàng', status: 'pending', date: deliveryDate || '—', by: '—' }
        ],
        activity: [{ time: 'hôm nay', by: 'Sales', action: 'Tạo đơn từ báo giá <b>' + bg.id + '</b>' + (contractId ? ' · HĐ ' + contractId : '') }]
      };
      this.allOrders().unshift(order);
      this.markOrdered(bg.id, orderId);
      this.save();
      return { order: order, lsx: null };
    },

    // Sản phẩm của 1 đơn (tương thích đơn cũ chỉ có product/qty đơn)
    orderProducts: function (o) {
      if (o && o.products && o.products.length) return o.products;
      return (o && o.product) ? [{ code: o.productCode || '', name: o.product, qty: o.qty || 0, ptgId: o.ptgId || '', lsxId: o.lsxId || '' }] : [];
    },
    // Sản phẩm của 1 LSX (tương thích LSX cũ 1 sản phẩm)
    lsxProducts: function (l) {
      if (l && l.products && l.products.length) return l.products;
      return (l && l.product) ? [{ code: l.productCode || '', name: l.product, qty: l.qty || 0, size: l.size || '' }] : [];
    },
    // Trạng thái lên LỆNH SX của 1 đơn: 'none' chưa lên · 'part' lên 1 phần · 'full' lên đủ
    orderLsxStatus: function (o) {
      var prods = this.orderProducts(o), n = prods.length;
      if (!n) return { state: 'none', made: 0, total: 0 };
      var self = this, covered = {};
      this.allLSX().filter(function (l) { return l.orderId === o.id; })
        .forEach(function (l) { self.lsxProducts(l).forEach(function (p) { if (p.code) covered[p.code] = 1; }); });
      var made = prods.filter(function (p) { return p.lsxId || (p.code && covered[p.code]); }).length;
      // đơn cũ 1 SP / chưa map theo mã: suy từ lsxIds / lsxId / lsx(object)
      if (!made && ((o.lsxIds && o.lsxIds.length) || o.lsxId || o.lsx)) made = Math.min(n, (o.lsxIds && o.lsxIds.length) || 1);
      return { state: made === 0 ? 'none' : (made >= n ? 'full' : 'part'), made: made, total: n };
    },
    prodSpecFields: function (tech) { return prodSpecFields(tech); },
    prodSpecDepts: function () { return PROD_SPEC_DEPTS; },
    isProductComplete: function (p) { return isProdComplete(p); },
    // spec sản xuất điền ở Tính giá (PTG là nguồn sự thật)
    ptgTech: function (ptg) { return ptgTech(ptg); },
    ptgSpecComplete: function (ptg) { return ptgSpecComplete(ptg); },
    savePtgSpec: function (ptgId, patch) {
      var ptg = this.getPTG(ptgId); if (!ptg) return null;
      ptg.prod = Object.assign({}, ptg.prod || {}, patch || {});
      this.save();
      return ptg;
    },
    // Lưu spec sản xuất cho 1 sản phẩm master (bước hoàn thiện thông tin) → tự cập nhật cờ đủ/chưa đủ
    saveProductSpec: function (code, prodPatch) {
      var p = this.getProduct(code); if (!p) return null;
      p.prod = Object.assign({}, p.prod || {}, prodPatch || {});
      var prod = p.prod;
      p.infoComplete = prodSpecFields(p.type).filter(function (f) { return f.req; })
        .every(function (f) { return String(prod[f.k] != null ? prod[f.k] : '').trim() !== ''; });
      this.save();
      return p;
    },
    // Pick subset sản phẩm (chưa gắn LSX) của 1 đơn → tạo 1 LSX dự thảo nhiều sản phẩm
    // Gộp NHIỀU sản phẩm (kể cả từ nhiều đơn) vào ĐÚNG 1 lệnh sản xuất
    createLSXCombined: function (rows) {
      if (!rows || !rows.length) return null;
      var self = this;
      var primary = this.getOrder(rows[0].orderId) || rows[0].order || { id: rows[0].orderId, customer: rows[0].customer || '' };
      var prods = [], realRefs = [], orderIds = {};
      rows.forEach(function (r) {
        orderIds[r.orderId] = true;
        var o = self.getOrder(r.orderId);
        var p = o && (o.products || []).filter(function (x) { return x.code === r.code && !x.lsxId; })[0];
        if (p) { prods.push(p); realRefs.push(p); }
        else prods.push({ code: r.code || '', name: r.name, qty: r.qty || 0, ptgId: r.ptgId || '' });
      });
      if (!prods.length) return null;
      var lsx = buildLSXFromProducts(primary, prods);
      var nOrders = Object.keys(orderIds).length;
      if (prods.length > 1) lsx.product = prods[0].name + ' +' + (prods.length - 1) + ' SP' + (nOrders > 1 ? ' · gộp ' + nOrders + ' đơn' : '');
      lsx.orderIds = Object.keys(orderIds);
      this.allLSX().unshift(lsx);
      realRefs.forEach(function (p) { p.lsxId = lsx.id; });
      Object.keys(orderIds).forEach(function (oid) {
        var o = self.getOrder(oid); if (!o) return;
        o.lsxIds = o.lsxIds || []; if (o.lsxIds.indexOf(lsx.id) < 0) o.lsxIds.push(lsx.id);
        if (!o.lsxId) o.lsxId = lsx.id;
        o.activity = o.activity || [];
        o.activity.unshift({ time: 'hôm nay', by: 'Kế hoạch', action: 'Tạo lệnh SX gộp <b>' + lsx.id + '</b> (' + prods.length + ' SP)' });
      });
      this.save();
      return lsx;
    },
    createLSXfromProducts: function (orderId, codes) {
      var order = this.getOrder(orderId); if (!order || !codes || !codes.length) return null;
      var prods = (order.products || []).filter(function (p) { return codes.indexOf(p.code) >= 0 && !p.lsxId; });
      if (!prods.length) return null;
      // đồng bộ spec master từ PTG (nguồn sự thật điền ở Tính giá) trước khi chụp vào LSX
      prods.forEach(function (p) {
        var pt = ptgById(p.ptgId), m = productByCode(p.code);
        if (pt && m && pt.prod) { m.prod = Object.assign({}, pt.prod); m.infoComplete = ptgSpecComplete(pt); }
      });
      var lsx = buildLSXFromProducts(order, prods);
      this.allLSX().unshift(lsx);
      prods.forEach(function (p) { p.lsxId = lsx.id; });
      order.lsxIds = (order.lsxIds || []); order.lsxIds.push(lsx.id);
      if (!order.lsxId) order.lsxId = lsx.id;
      order.activity = order.activity || [];
      order.activity.unshift({ time: 'hôm nay', by: 'Kế hoạch', action: 'Tạo lệnh SX <b>' + lsx.id + '</b> từ ' + prods.length + ' sản phẩm' });
      this.save();
      return lsx;
    },
    // Đẩy 1 đơn hàng (hoặc 1 SP con của đơn nhiều SP) từ màn Đơn hàng sang Lệnh sản xuất.
    // opts: { product, productCode, qty, dueDate, order }
    //  - opts.product / opts.qty: override tên SP / số lượng khi đẩy từng SP
    //  - opts.productCode: chỉ định SP con (đơn có mảng products) — bỏ qua nếu SP đó đã có LSX
    //  - opts.order: object đơn (fallback khi đơn không nằm trong store, vd đơn seed tĩnh của trang)
    // LSX mới: id 'LSX-' + số tăng dần từ max hiện có (nextLSXIdUnique), shape đồng bộ seedLSX
    // (stages/bom/routing/packaging/lifecycle 'du-thao', status 'chờ SX' → trang 11/19 render được).
    createLSXFromOrder: function (orderId, opts) {
      opts = opts || {};
      var order = this.getOrder(orderId) || opts.order || null;
      if (!order) return null;
      var prods = null;
      // đơn nhiều SP + chỉ định mã SP con → đẩy đúng SP đó
      if (opts.productCode && order.products && order.products.length) {
        prods = order.products.filter(function (p) { return p.code === opts.productCode; });
        if (!prods.length || prods[0].lsxId) return null; // SP không tồn tại / đã có LSX
      }
      if (!prods) {
        // đơn 1 SP (hoặc không chỉ định SP con) → tổng hợp 1 dòng SP từ chính đơn
        prods = [{
          code: opts.productCode || order.productCode || '',
          name: opts.product || order.product || '',
          qty: (opts.qty != null) ? opts.qty : (order.qty || 0),
          ptgId: order.ptgId || ''
        }];
      }
      var lsx = buildLSXFromProducts(order, prods);
      if (opts.product) lsx.product = opts.product;
      if (opts.qty != null) { lsx.qty = opts.qty; }
      if (!lsx.dateDelivery) lsx.dateDelivery = opts.dueDate || order.dueDate || '';
      this.allLSX().unshift(lsx);
      // liên kết ngược: SP con + đơn trỏ về LSX mới
      prods.forEach(function (p) { p.lsxId = lsx.id; });
      order.lsxIds = order.lsxIds || [];
      if (order.lsxIds.indexOf(lsx.id) < 0) order.lsxIds.push(lsx.id);
      if (!order.lsxId) order.lsxId = lsx.id;
      order.activity = order.activity || [];
      order.activity.unshift({ time: 'hôm nay', by: 'Kế hoạch', action: 'Đẩy sang lệnh sản xuất <b>' + lsx.id + '</b> (dự thảo)' });
      this.save();
      return lsx;
    },
    issueLSX: function (id) {
      var lsx = this.getLSX(id); if (!lsx) return null;
      lsx.status = 'đang SX'; lsx.issuedBy = 'Kế hoạch SX'; lsx.issuedAt = 'hôm nay';
      lsx.activity = lsx.activity || [];
      lsx.activity.push({ type: 'order', text: 'Phát lệnh sản xuất', date: 'hôm nay', by: 'Kế hoạch SX' });
      this.save(); return lsx;
    },
    setPackaging: function (id, val) {
      var lsx = this.getLSX(id); if (!lsx) return null;
      var p = lsx.packaging; val = Math.max(1, parseInt(val, 10) || 1);
      if (p.mode === 'roll') { p.perRoll = val; p.rolls = Math.ceil(lsx.qty / val); }
      else { p.perCarton = val; p.cartons = Math.ceil(lsx.qty / val); }
      this.save(); return lsx;
    },
    // Cập nhật sản lượng TỪNG SẢN PHẨM cho 1 công đoạn (trang 19 — modal báo công đoạn).
    // rows = [{code, total, good, defect}] → ghi p.progress[stageKey] = {total, good, defect}.
    // Tổng hợp p.doneGood / p.doneDefect = số liệu của CÔNG ĐOẠN CUỐI CÙNG có dữ liệu
    // theo thứ tự routing (lsx.stages, bỏ ô ngày) — nhập lùi công đoạn trước không đè kết quả công đoạn sau.
    updateLSXProductProgress: function (lsxId, stageKey, rows) {
      var lsx = this.getLSX(lsxId); if (!lsx) return null;
      // LSX cũ 1 sản phẩm (không có mảng products) → vật hoá 1 dòng từ product/qty
      if (!lsx.products || !lsx.products.length) {
        lsx.products = [{ code: lsx.productCode || 'SP-1', name: lsx.product || 'Sản phẩm', qty: lsx.qty || 0, size: lsx.size || '' }];
      }
      var st = (lsx.stages || []).filter(function (s) { return s.key === stageKey; })[0] || {};
      var stageName = st.name || stageKey;
      var sumG = 0, sumD = 0;
      (rows || []).forEach(function (r) {
        if (!r) return;
        var p = lsx.products.filter(function (x) { return x.code === r.code; })[0];
        if (!p) return;
        var total = Math.max(0, Number(r.total) || 0);
        var good = Math.max(0, Number(r.good) || 0);
        var defect = Math.max(0, Number(r.defect) || 0);
        p.progress = p.progress || {};
        p.progress[stageKey] = { total: total, good: good, defect: defect };
        sumG += good; sumD += defect;
      });
      // tổng hợp theo công đoạn CUỐI CÙNG có dữ liệu (thứ tự routing)
      var orderKeys = (lsx.stages || []).filter(function (s) { return s.type !== 'date'; }).map(function (s) { return s.key; });
      lsx.products.forEach(function (p) {
        if (!p.progress) return;
        var lastKey = null;
        orderKeys.forEach(function (k) { if (p.progress[k]) lastKey = k; });
        if (!lastKey) { var ks = Object.keys(p.progress); lastKey = ks[ks.length - 1]; }
        if (lastKey) { p.doneGood = p.progress[lastKey].good; p.doneDefect = p.progress[lastKey].defect; }
      });
      // nhật ký hoạt động của lệnh
      lsx.activity = lsx.activity || [];
      lsx.activity.unshift({ time: 'hôm nay', date: 'hôm nay', by: 'Xưởng', type: 'update', action: 'Cập nhật ' + stageName + ': ' + sumG + ' đạt / ' + sumD + ' lỗi', text: 'Cập nhật ' + stageName + ': ' + sumG + ' đạt / ' + sumD + ' lỗi' });
      // + dòng transitions để khối "Nhật ký & báo công đoạn" (trang 19) hiển thị ngay
      (lsx.transitions = lsx.transitions || []).unshift({
        at: 'vừa xong', by: 'Xưởng', machine: lsx.machineIn || lsx.machine || '',
        label: 'Cập nhật ' + stageName + ' · ' + sumG + ' đạt / ' + sumD + ' lỗi', type: 'scan', lifecycle: lsx.lifecycle || ''
      });
      this.save(); return lsx;
    },

    // ---- Sản phẩm (danh mục) ----
    allProducts: function () { return data.products || (data.products = seedProducts()); },
    // Xem trước mã SP kế tiếp theo công nghệ (KHÔNG tạo SP)
    previewProductCode: function (type) { return nextProductId(type || 'offset'); },
    getProduct: function (code) { return this.allProducts().filter(function (p) { return p.code === code; })[0] || null; },
    createProduct: function (opts) {
      opts = opts || {};
      var state = opts.state ? JSON.parse(JSON.stringify(opts.state)) : global.PricingEngine.defaultState(opts.type || 'offset');
      if (!opts.state && opts.colors != null) state.colors = opts.colors;
      var prod = {
        code: opts.code || nextProductId(global.PricingEngine.typeOf(state)),
        name: opts.name || 'Sản phẩm mới',
        customer: opts.customer || '',
        type: global.PricingEngine.typeOf(state),
        typeLabel: global.PricingEngine.typeLabel(state),
        specText: global.PricingEngine.specText(state),
        state: state,
        size: opts.size || dimText(state),
        colors: (opts.colors != null ? opts.colors : state.colors) || '',
        fileStatus: opts.fileStatus || '',
        dieCode: opts.dieCode || '',
        sampleStatus: opts.sampleStatus || '',
        sampleDate: opts.sampleDate || '',
        note: opts.note || '', createdFrom: opts.createdFrom || 'tay',
        prod: opts.prod || {}, infoComplete: opts.infoComplete === true
      };
      this.allProducts().unshift(prod);
      this.save();
      return prod;
    },
    updateProduct: function (code, patch) {
      var p = this.getProduct(code); if (!p) return null;
      patch = patch || {};
      if (patch.name != null) p.name = patch.name;
      if (patch.customer != null) p.customer = patch.customer;
      if (patch.note != null) p.note = patch.note;
      if (patch.size != null) p.size = patch.size;
      if (patch.colors != null) p.colors = patch.colors;
      if (patch.dieCode != null) p.dieCode = patch.dieCode;
      if (patch.fileStatus != null) p.fileStatus = patch.fileStatus;
      if (patch.sampleStatus != null) p.sampleStatus = patch.sampleStatus;
      if (patch.sampleDate != null) p.sampleDate = patch.sampleDate;
      if (patch.state) {
        p.state = JSON.parse(JSON.stringify(patch.state));
        p.size = dimText(p.state);
        if (p.state.colors != null) p.colors = p.state.colors;
      }
      if (patch.type && patch.type !== p.type) {
        p.state = global.PricingEngine.defaultState(patch.type);
        p.type = patch.type;
        p.size = dimText(p.state);
      }
      p.typeLabel = global.PricingEngine.typeLabel(p.state);
      p.specText = global.PricingEngine.specText(p.state);
      this.save(); return p;
    },
    deleteProduct: function (code) {
      data.products = this.allProducts().filter(function (p) { return p.code !== code; });
      this.save();
    },
    // Tạo phiếu tính giá từ một sản phẩm (dùng cho deep-link ?sp= và Báo giá "từ sản phẩm")
    createPTGfromProduct: function (code, opts) {
      opts = opts || {};
      var p = this.getProduct(code); if (!p) return null;
      var seq = 0;
      data.ptg.forEach(function (x) { var m = /PTG-2026-(\d+)/.exec(x.id); if (m) seq = Math.max(seq, parseInt(m[1], 10)); });
      var ptg = {
        id: 'PTG-2026-0' + (seq + 1),
        customer: opts.customer || p.customer || CUSTOMERS[0].name,
        product: p.name,
        status: opts.status || 'đã duyệt',
        phuTrach: 'sales',
        yeuCau: opts.yeuCau || '',
        createdBy: opts.createdBy || 'Sales', date: 'hôm nay',
        note: 'Tạo từ sản phẩm ' + p.code,
        state: JSON.parse(JSON.stringify(p.state)),
        fromProduct: p.code,
        productCode: p.code,
        activity: [{ type: 'create', text: 'Tạo phiếu từ sản phẩm ' + p.code, date: 'hôm nay', by: opts.createdBy || 'Sales' }]
      };
      data.ptg.unshift(ptg);
      this.save();
      return ptg;
    },
    resetDemo: function () { data = { ptg: seedPTG(), bg: seedBG(), contracts: seedContracts(), orders: seedOrders(), lsx: seedLSX(), products: seedProducts() }; persist(data); }
  };

  global.QuoteStore = Store;
})(window);
