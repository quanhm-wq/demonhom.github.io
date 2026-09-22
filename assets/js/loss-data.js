/* ============================================================
   LossStore — SỔ CÁI THẤT THOÁT & LÃNG PHÍ (Loss & Waste Ledger)
   ------------------------------------------------------------
   Một nguồn dữ liệu duy nhất cho TOÀN BỘ module:
     · Lỗi hỏng / phế / tái chế theo từng CÔNG ĐOẠN và từng BÁN THÀNH PHẨM
     · Lãng phí THỜI GIAN (dừng máy, chờ vật tư, setup vượt định mức…)
     · Thất thoát VẬT CHẤT (hao vượt định mức, chênh kiểm kê, hết hạn, tồn chết)
     · Thất thoát TÀI CHÍNH (mua gấp, phạt giao trễ, sửa chữa đột xuất, tăng ca)
   Mỗi bản ghi đều có: NGUYÊN NHÂN (mã + nhóm 4M1E) · GHI CHÚ · BỘ PHẬN CHỊU
   TRÁCH NHIỆM · CHI PHÍ QUY ĐỔI → dùng cho Dashboard, Báo cáo thiệt hại và
   drill-down từ bất kỳ điểm kém hiệu quả nào về đúng bản ghi gốc.

   Phụ thuộc: window.QuoteStore (tùy chọn — nếu có sẽ bám LSX thật).
   ============================================================ */
(function (global) {
  'use strict';

  /* ---------- PRNG tất định để demo luôn ra cùng số ---------- */
  var _s = 20260912;
  function rnd() { _s = (_s * 1103515245 + 12345) & 0x7fffffff; return _s / 0x7fffffff; }
  function ri(a, b) { return a + Math.floor(rnd() * (b - a + 1)); }
  function pick(arr) { return arr[Math.floor(rnd() * arr.length)]; }
  function chance(p) { return rnd() < p; }
  function reseed(n) { _s = n; }

  /* ══════════════════════════════════════════════════════════════════════════
     HỒ SƠ NGÀNH (INDUSTRY PROFILE) — CHUYỂN NGÀNH CHỈ CẦN SỬA TỪ ĐÂY TỚI
     DÒNG "HẾT HỒ SƠ NGÀNH". Toàn bộ phần dưới là bộ máy chung, giữ nguyên.

     Đang cấu hình cho: CỬA NHÔM HỆ (Công ty CP Thương mại OWIN).
     Sáu thứ phải thay khi sang ngành khác — tất cả đều nằm TRONG khối này:
       (1) CAUSES        — mã lỗi đặc thù ngành + nhóm 4M1E + BP chịu TN + biện pháp
       (2) BTP_MAP       — tên bán thành phẩm ra ở mỗi công đoạn
       (3) STEP_CAUSES   — công đoạn nào hay sinh lỗi nào
       (4) RATE          — đơn giá quy đổi thiệt hại
       (5) P_MATERIALS · P_MACHINES · P_SUPPLIERS · P_CUSTOMERS · P_WORKERS · P_WAREHOUSES
       (6) P_NG_RATE · P_THROUGHPUT · P_SETUP_MIN · P_INCIDENTS

     Bộ mã lỗi gợi ý sẵn cho 7 ngành (cơ khí, dệt may, bia, bánh kẹo, gỗ, in ấn, nhựa):
     xem references/that-thoat-lang-phi.md §5 của skill san-xuat-chuan.
     KHÔNG đổi: TYPES, CAUSE_GROUPS, MODULES, DEPTS — đó là khung quản trị
     dùng chung cho mọi ngành sản xuất.
     ══════════════════════════════════════════════════════════════════════════ */

  /* ── (1) MÃ LỖI ĐẶC THÙ NGÀNH ────────────────────────────────────────────
     group ∈ may | vat-lieu | con-nguoi | phuong-phap | moi-truong | quan-ly
     dept  ∈ khoá trong DEPTS · fix = biện pháp, hiện thẳng ở panel & khuyến nghị.
     Nhóm TG-/VT-/TC- dùng chung mọi ngành — chủ yếu chỉ phải viết lại nhóm LOI-. */
  var CAUSES = [
    /* --- Lỗi đặc thù ngành cửa nhôm hệ --- */
    { code: 'LOI-CAT-KT',  label: 'Cắt sai kích thước ngoài dung sai ±2mm',            group: 'may',        dept: 'ky-thuat', fix: 'Hiệu chuẩn cữ chặn máy cắt · đo mẫu đầu ca' },
    { code: 'LOI-CAT-GOC', label: 'Lệch góc cắt 45°/90° — mối ghép không khít',        group: 'may',        dept: 'bao-tri',  fix: 'Rà lại bàn xoay · kiểm độ đảo lưỡi Ø500' },
    { code: 'LOI-UON-NUT', label: 'Nứt / gãy thanh nhôm khi uốn vòm bán kính nhỏ',     group: 'phuong-phap', dept: 'ky-thuat', fix: 'Tăng số lượt uốn · gia nhiệt sơ bộ · chặn R < R600' },
    { code: 'LOI-UON-MEO', label: 'Méo tiết diện thanh sau khi uốn vòm',               group: 'may',        dept: 'ky-thuat', fix: 'Dùng lõi đỡ trong thanh · chỉnh lực con lăn' },
    { code: 'LOI-EP-HO',   label: 'Mối ép góc hở, lộ khe ở mặt ngoài',                 group: 'may',        dept: 'bao-tri',  fix: 'Thay dao ép mòn · chỉnh áp máy ép góc' },
    { code: 'LOI-SON-XUOC',label: 'Xước sơn tĩnh điện / bong màng vân gỗ',             group: 'con-nguoi',  dept: 'san-xuat', fix: 'Bọc màng bảo vệ ngay sau cắt · lót đệm bàn thao tác' },
    { code: 'LOI-ANOD',    label: 'Lớp anod mỏng dưới 15µm — không đạt chuẩn',         group: 'vat-lieu',   dept: 'kho',      fix: 'Kiểm CO/CQ từng lô · đo lớp phủ khi nhập' },
    { code: 'LOI-KINH-NUT',label: 'Nứt / vỡ kính khi cắt và lắp vào khung',            group: 'con-nguoi',  dept: 'san-xuat', fix: 'Dùng giác hút đủ tải · kê đệm cao su · đào tạo thao tác' },
    { code: 'LOI-GIOANG',  label: 'Hở gioăng EPDM — thử nước bị thấm',                 group: 'phuong-phap', dept: 'qc',      fix: 'Chuẩn hoá lực ấn gioăng · thử nước 100% cửa mặt tiền' },
    { code: 'LOI-BANLE',   label: 'Bản lề thuỷ lực không tự hồi / hồi lệch tốc',       group: 'vat-lieu',   dept: 'kho',      fix: 'Test bản lề trước lắp · đổi lô phụ kiện lỗi' },
    { code: 'LOI-VENH',    label: 'Cánh cong vênh vượt 1,5mm/m',                       group: 'phuong-phap', dept: 'ky-thuat', fix: 'Kê phẳng khi ép góc · kiểm độ phẳng bàn gá' },
    { code: 'LOI-KHOA',    label: 'Khoá kẹt / lệch ổ, tay nắm không trùng tâm',        group: 'may',        dept: 'ky-thuat', fix: 'Kiểm chương trình phay khoá CNC · làm dưỡng định vị' },
    { code: 'LOI-MAU',     label: 'Lệch màu vân gỗ giữa các cây nhôm cùng bộ cửa',     group: 'vat-lieu',   dept: 'kho',      fix: 'Cấp phát cùng lô phủ film · ghi mã lô lên từng cây' },
    /* --- Nguyên nhân lãng phí thời gian --- */
    { code: 'TG-CHOVT',   label: 'Chờ nhôm thanh / kính chưa về kho',                  group: 'quan-ly',    dept: 'thu-mua',  fix: 'Chốt lịch giao NCC · nâng tồn an toàn nhôm hệ chạy nhiều' },
    { code: 'TG-CHOKHUON',label: 'Chờ dao phay / dưỡng ép đang dùng ở lệnh khác',      group: 'quan-ly',    dept: 'ke-hoach', fix: 'Điều độ dụng cụ theo công suất hữu hạn' },
    { code: 'TG-SETUP',   label: 'Cài máy & lập trình CNC vượt định mức',              group: 'con-nguoi',  dept: 'san-xuat', fix: 'Lưu bộ thông số theo hệ nhôm · áp dụng SMED' },
    { code: 'TG-SUCO',    label: 'Sự cố máy dừng đột xuất',                            group: 'may',        dept: 'bao-tri',  fix: 'Siết bảo trì phòng ngừa theo giờ chạy máy' },
    { code: 'TG-CHOQC',   label: 'Chờ KCS duyệt mẫu đầu / kết quả thử nước',           group: 'quan-ly',    dept: 'qc',       fix: 'Bố trí KCS trực ca · rút ngắn SLA duyệt mẫu' },
    { code: 'TG-VESINH',  label: 'Đổi hệ nhôm / đổi màu ngoài kế hoạch',               group: 'phuong-phap',dept: 'san-xuat', fix: 'Gom lệnh cùng hệ, cùng màu vào một ca' },
    { code: 'TG-THIEUNG', label: 'Thiếu thợ đứng máy (nghỉ đột xuất)',                 group: 'con-nguoi',  dept: 'nhan-su',  fix: 'Đa kỹ năng hoá thợ cắt – ép góc · bố trí người dự phòng' },
    { code: 'TG-DIEN',    label: 'Mất điện / sự cố khí nén cấp cho máy đột dập',       group: 'moi-truong', dept: 'bao-tri',  fix: 'Bảo dưỡng máy nén khí & lọc khí định kỳ' },
    { code: 'TG-KEHOACH', label: 'Khách đổi kích thước / màu sau khi đã cắt',          group: 'quan-ly',    dept: 'kinh-doanh',fix: 'Khoá bản vẽ trước 24h · tính phí đổi sau chốt' },
    /* --- Nguyên nhân thất thoát vật tư / tài chính --- */
    { code: 'VT-HAO',     label: 'Hao hụt đầu mẩu nhôm vượt định mức cắt',             group: 'con-nguoi',  dept: 'kho',      fix: 'Tối ưu sơ đồ cắt (nesting) · gom đơn cùng hệ' },
    { code: 'VT-BAOQUAN', label: 'Bảo quản sai — nhôm xước, ố bề mặt, kính mốc',       group: 'moi-truong', dept: 'kho',      fix: 'Giá để nhôm có đệm · kho khô · dựng kính đúng góc' },
    { code: 'VT-KIEMKE',  label: 'Chênh lệch sổ sách và thực tế (số cây nhôm)',        group: 'quan-ly',    dept: 'kho',      fix: 'Kiểm kê chu kỳ · quét QR mọi lần xuất nhập' },
    { code: 'VT-TONCHET', label: 'Tồn nhôm hệ lạ do đơn huỷ / khách đổi thiết kế',     group: 'quan-ly',    dept: 'kinh-doanh',fix: 'Cọc vật tư hệ đặc chủng · điều khoản huỷ đơn' },
    { code: 'TC-MUAGAP',  label: 'Đặt gấp nhôm/kính do thiếu hụt kế hoạch vật tư',     group: 'quan-ly',    dept: 'thu-mua',  fix: 'Chạy kế hoạch nguyên liệu theo tuần · cảnh báo tồn tối thiểu' },
    { code: 'TC-PHATTRE', label: 'Giao trễ hợp đồng — chịu phạt / chiết khấu',         group: 'quan-ly',    dept: 'ke-hoach', fix: 'Đệm tiến độ lắp đặt · cảnh báo trễ sớm 3 ngày' },
    { code: 'TC-SUACHUA', label: 'Hỏng đột xuất do bỏ lịch bảo trì',                   group: 'may',        dept: 'bao-tri',  fix: 'Bảo trì theo giờ chạy máy, không theo lịch cứng' },
    { code: 'TC-NOXAU',   label: 'Đại lý / chủ đầu tư chậm thanh toán quá hạn',        group: 'quan-ly',    dept: 'ke-toan',  fix: 'Siết hạn mức công nợ đại lý · cảnh báo trước hạn' }
  ];

  /* ============================================================
     (2)(3) BÁN THÀNH PHẨM theo công đoạn + nguyên nhân lỗi theo công đoạn
     GIỮ NGUYÊN KEY công đoạn (khớp STAGE_TEMPLATES) — chỉ đổi code/name/unit.
     ============================================================ */
  var BTP_MAP = {
    'kho-cap':    { code: 'BTP-NHOM', name: 'Nhôm thanh đã cấp theo lô',          unit: 'kg' },
    'che-ban':    { code: 'BTP-KIEM', name: 'Nhôm thanh đã kiểm & phân loại',     unit: 'cây' },
    'cb-kem':     { code: 'BTP-DAO',  name: 'Dao phay & dưỡng ép đã lắp',         unit: 'bộ' },
    'in':         { code: 'BTP-CATPHAY', name: 'Bộ thanh đã cắt & phay CNC',      unit: 'bộ' },
    'in-phu':     { code: 'BTP-VOM',  name: 'Thanh vòm đã uốn định hình',         unit: 'thanh' },
    'in-kts':     { code: 'BTP-LE',   name: 'Bộ thanh cắt lẻ theo đơn nhỏ',       unit: 'bộ' },
    'in-kho-lon': { code: 'BTP-LON',  name: 'Bộ thanh cửa khổ lớn 4–6 cánh',      unit: 'bộ' },
    'sau-in':     { code: 'BTP-KHUNG',name: 'Khung cánh đã ép góc',               unit: 'cánh' },
    'cat':        { code: 'BTP-TINH', name: 'Thanh đã cắt tinh & làm sạch ba via',unit: 'thanh' },
    'can':        { code: 'BTP-VUONG',name: 'Cánh đã kiểm vuông góc',             unit: 'cánh' },
    'gia-cong':   { code: 'BTP-BEMAT',name: 'Cánh đã xử lý bề mặt',               unit: 'cánh' },
    'gap':        { code: 'BTP-KINH', name: 'Cánh đã lắp kính & gioăng',          unit: 'cánh' },
    'be':         { code: 'BTP-PK',   name: 'Bộ cửa đã lắp phụ kiện & bản lề',    unit: 'bộ' },
    'dong-cuon':  { code: 'BTP-MANG', name: 'Bộ cửa đã bọc màng bảo vệ',          unit: 'bộ' },
    'kcs':        { code: 'BTP-QC',   name: 'Bộ cửa đã qua KCS & thử nước',       unit: 'bộ' },
    'dong-goi':   { code: 'TP-KIEN',  name: 'Bộ cửa đã đóng kiện',                unit: 'bộ' },
    'nhap-kho':   { code: 'TP-KHO',   name: 'Thành phẩm nhập kho',                unit: 'bộ' }
  };
  /* Công đoạn KHÔNG sinh sản lượng vật lý (giấy tờ / chuẩn bị) */
  var NON_OUTPUT = ['xu-ly-file', 'thu-mua', 'giay-ve', 'in-lenh', 'don-hang', 'kho-cap'];

  /* Nguyên nhân lỗi khả dĩ theo công đoạn */
  var STEP_CAUSES = {
    'che-ban':  ['LOI-ANOD', 'LOI-MAU', 'VT-BAOQUAN'],
    'cb-kem':   ['TG-SETUP', 'LOI-CAT-KT', 'LOI-EP-HO'],
    'in':       ['LOI-CAT-KT', 'LOI-CAT-GOC', 'LOI-KHOA', 'LOI-SON-XUOC', 'LOI-MAU'],
    'in-phu':   ['LOI-UON-NUT', 'LOI-UON-MEO', 'LOI-SON-XUOC', 'LOI-CAT-KT'],
    'in-kts':   ['LOI-CAT-KT', 'LOI-CAT-GOC', 'LOI-MAU'],
    'in-kho-lon':['LOI-VENH', 'LOI-CAT-KT', 'LOI-CAT-GOC'],
    'sau-in':   ['LOI-EP-HO', 'LOI-VENH', 'LOI-SON-XUOC'],
    'cat':      ['LOI-CAT-KT', 'LOI-SON-XUOC'],
    'can':      ['LOI-VENH', 'LOI-CAT-GOC'],
    'gia-cong': ['LOI-SON-XUOC', 'LOI-ANOD'],
    'gap':      ['LOI-KINH-NUT', 'LOI-GIOANG', 'LOI-SON-XUOC'],
    'be':       ['LOI-BANLE', 'LOI-KHOA', 'LOI-SON-XUOC'],
    'dong-cuon':['LOI-SON-XUOC', 'LOI-MAU'],
    'kcs':      ['LOI-GIOANG', 'LOI-VENH', 'LOI-BANLE', 'LOI-CAT-KT'],
    'dong-goi': ['LOI-SON-XUOC', 'LOI-KINH-NUT'],
    'nhap-kho': ['VT-KIEMKE']
  };
  var TIME_WASTE_REASONS = ['TG-CHOVT', 'TG-CHOKHUON', 'TG-SETUP', 'TG-SUCO', 'TG-CHOQC', 'TG-VESINH', 'TG-THIEUNG', 'TG-DIEN', 'TG-KEHOACH'];

  /* ============================================================
     (4) ĐƠN GIÁ QUY ĐỔI THIỆT HẠI — mặt bằng chi phí ngành cửa nhôm hệ
     ============================================================ */
  var RATE = {
    machineHour: 185000,   // ₫/giờ máy (khấu hao máy cắt/CNC/uốn + điện + nhân công đứng máy)
    labourHour:  62000,    // ₫/giờ công thợ nhôm kính
    overheadHour: 74000,   // ₫/giờ chi phí chung phân bổ
    resinKg:     78500,    // ₫/kg nhôm thanh 6063-T5 bình quân (giữ tên khoá cũ)
    recycleLoss: 0.55      // nhôm phế bán lại chỉ thu hồi ~55% giá trị → mất 45%
  };

  /* ── (5)(6) Vật tư · máy · đối tác · nhân sự · tỷ lệ lỗi · năng suất ─────── */
  var P_MATERIALS = [
    { n: 'Thanh nhôm hệ thuỷ lực 120 (6063-T5)', c: 'GIAY-IV300-6586',  p: 78500,   u: 'kg' },
    { n: 'Thanh nhôm hệ thuỷ lực 180',           c: 'GIAY-CU150-6090',  p: 82000,   u: 'kg' },
    { n: 'Thanh nhôm hệ trượt quay 93',          c: 'GIAY-CU250-7290',  p: 76000,   u: 'kg' },
    { n: 'Thanh nhôm Luxanode Anodized-ED 121',  c: 'GIAY-DC230-65100', p: 96000,   u: 'kg' },
    { n: 'Thanh nhôm hệ chấn song + phào',       c: 'GIAY-FT80-79109',  p: 71000,   u: 'kg' },
    { n: 'Kính hộp 5-9-5 cường lực',             c: 'GIAY-BT350-7090',  p: 385000,  u: 'm²' },
    { n: 'Kính cường lực 8mm',                   c: 'GIAY-DC400-7090',  p: 295000,  u: 'm²' },
    { n: 'Bộ bản lề thuỷ lực sàn (Đức)',         c: 'KEM-CTP-525',      p: 4850000, u: 'bộ' },
    { n: 'Bộ khoá & tay nắm cao cấp',            c: 'MUC-CMYK',         p: 3200000, u: 'bộ' },
    { n: 'Gioăng EPDM',                          c: 'DECAL-GIAY',       p: 9500,    u: 'm' },
    { n: 'Keo silicon trung tính',               c: 'DECAL-PP',         p: 62000,   u: 'tuýp' },
    { n: 'Ke góc & vít inox (bộ)',               c: 'BAN-FLEXO',        p: 185000,  u: 'bộ' }
  ];
  var P_MACHINES = ['CAT-01 · Máy cắt nhôm 2 đầu lưỡi 500 WEIKE', 'CAT-02 · Máy cắt nhôm 2 đầu lưỡi 500 WEIKE', 'CNC-03 · Máy phay khoá CNC WEIKE', 'CNC-21 · Máy phay đố kẹp bàn WEIKE', 'EP-02 · Máy ép góc cơ WEIKE', 'UON-01 · Máy uốn vòm nhôm CNC 3 trục', 'UON-02 · Máy uốn vòm nhôm thuỷ lực', 'LAP-01 · Bàn lắp kính & bơm keo', 'DOT-01 · Máy đột dập hơi 34 dao'];
  var P_SUPPLIERS = ['Đùn ép Nhôm Đông Anh', 'Nhôm Luxanode nhập khẩu', 'Kính Việt Nhật Hải Long', 'Phụ kiện Kinlong VN', 'Hoá chất Xây dựng Việt', 'Bao bì Phú Mỹ', 'Sơn tĩnh điện Á Đông'];
  var P_CUSTOMERS = ['VINHOMES OCEAN PARK', 'SUN GROUP HẠ LONG', 'ECOPARK', 'NHÔM KÍNH NAM TIẾN', 'NHÔM KÍNH MINH AN', 'ĐL OWIN HƯNG YÊN', 'ĐL OWIN HẢI DƯƠNG', 'NT XÂY DỰNG HOÀNG GIA'];
  var P_WORKERS = ['Trần Văn Diễn', 'Nguyễn Văn Hải', 'Lê Thị Thu', 'Phạm Văn Nam', 'Đỗ Minh Quân', 'Ngô Thị Lan', 'Vũ Văn Hiển', 'Hoàng Văn Tuấn'];
  var P_WAREHOUSES = ['Kho nhôm thanh', 'Kho kính', 'Kho phụ kiện', 'Kho bán thành phẩm', 'Kho lưu thành phẩm', 'Kho bán hàng'];

  /* Tỷ lệ lỗi mặc định theo KEY công đoạn — uốn vòm cao nhất (đặc thù Owin) */
  var P_NG_RATE = {
    'in': 0.024, 'in-phu': 0.058, 'in-kts': 0.021, 'in-kho-lon': 0.033,
    'sau-in': 0.022, 'cat': 0.014, 'gap': 0.019, 'be': 0.011,
    'kcs': 0.007, 'dong-goi': 0.003, 'che-ban': 0.005, 'cb-kem': 0.004,
    _default: 0.008
  };
  /* Năng suất (đơn vị/giờ) theo công đoạn — dùng tính thời gian kế hoạch */
  var P_THROUGHPUT = {
    'in': 42, 'in-phu': 14, 'in-kts': 26, 'in-kho-lon': 18,
    'sau-in': 26, 'cat': 55, 'gap': 12, 'be': 16,
    'kcs': 30, 'dong-goi': 20, 'che-ban': 90, 'cb-kem': 40,
    _default: 24
  };
  /* Thời gian chuẩn bị/gá đặt cộng thêm (phút) */
  var P_SETUP_MIN = { 'in': 25, 'in-phu': 45, 'cb-kem': 30, _default: 10 };

  /* Mô tả sự cố thiết bị — viết theo đúng máy móc ngành nhôm để nghe thật */
  var P_INCIDENTS = [
    'Lưỡi cắt Ø500 mẻ răng, mặt cắt xơ ba via — phải dừng thay lưỡi và căn lại cữ chặn.',
    'Rò dầu thuỷ lực xy-lanh kẹp máy uốn vòm, phải thay gioăng và xả khí hệ thống.',
    'Bàn xoay máy cắt 2 đầu bị lệch 0,4°, mối ghép 45° hở — đã rà lại và hiệu chuẩn.',
    'Trục chính máy phay khoá CNC rơ, lỗ khoá lệch tâm 1,2mm — thay vòng bi trục chính.',
    'Máy nén khí tụt áp xuống 4,2 bar, máy đột dập 34 dao không đủ lực — thay lọc khí và van.',
    'Đầu ép góc mòn, mối ép hở khe 0,5mm ở cửa mặt tiền — thay bộ dao ép và chỉnh áp.'
  ];

  /* ══════════════════ HẾT HỒ SƠ NGÀNH ══════════════════ */

  /* ============================================================
     1. DANH MỤC LOẠI THẤT THOÁT
     group: 'vat-chat' (mất vật liệu) · 'thoi-gian' (mất giờ) · 'tai-chinh' (mất tiền)
     ============================================================ */
  var TYPES = [
    { id: 'phe',           label: 'Phế / hỏng không cứu được', short: 'Phế hỏng',    group: 'vat-chat',  icon: 'trash-2',        module: 'san-xuat' },
    { id: 'tai-che',       label: 'Hàng lỗi phải tái chế',     short: 'Tái chế',     group: 'vat-chat',  icon: 'refresh-ccw',    module: 'san-xuat' },
    { id: 'hao-vuot-dm',   label: 'Hao vật tư vượt định mức',  short: 'Hao vượt ĐM', group: 'vat-chat',  icon: 'trending-down',  module: 'kho' },
    { id: 'chenh-kiem-ke', label: 'Chênh lệch kiểm kê kho',    short: 'Lệch kiểm kê',group: 'vat-chat',  icon: 'scale',          module: 'kho' },
    { id: 'het-han',       label: 'Vật tư hết hạn / biến chất',short: 'Hết hạn',     group: 'vat-chat',  icon: 'calendar-x',     module: 'kho' },
    { id: 'ton-chet',      label: 'Tồn chết / chậm luân chuyển',short:'Tồn chết',    group: 'vat-chat',  icon: 'package-x',      module: 'kho' },
    { id: 'tra-hang',      label: 'Khách trả hàng / khiếu nại',short: 'Trả hàng',    group: 'vat-chat',  icon: 'undo-2',         module: 'kinh-doanh' },
    { id: 'dung-may',      label: 'Dừng máy ngoài kế hoạch',   short: 'Dừng máy',    group: 'thoi-gian', icon: 'power-off',      module: 'may-moc' },
    { id: 'cho-viec',      label: 'Chờ việc / thiếu đầu vào',  short: 'Chờ việc',    group: 'thoi-gian', icon: 'hourglass',      module: 'san-xuat' },
    { id: 'setup-vuot',    label: 'Setup / chạy thử vượt ĐM',  short: 'Setup vượt',  group: 'thoi-gian', icon: 'settings-2',     module: 'san-xuat' },
    { id: 'cong-khong',    label: 'Công lao động không hiệu quả',short:'Công rỗng',  group: 'thoi-gian', icon: 'user-x',         module: 'nhan-su' },
    { id: 'lam-them',      label: 'Tăng ca bù lỗi / bù tiến độ',short: 'Tăng ca bù', group: 'thoi-gian', icon: 'moon',           module: 'nhan-su' },
    { id: 'mua-gap',       label: 'Mua gấp giá cao hơn kế hoạch',short:'Mua gấp',    group: 'tai-chinh', icon: 'zap',            module: 'mua-hang' },
    { id: 'giao-tre',      label: 'Phạt / chiết khấu do giao trễ',short:'Phạt trễ',  group: 'tai-chinh', icon: 'alarm-clock',    module: 'kinh-doanh' },
    { id: 'sua-chua',      label: 'Sửa chữa đột xuất',         short: 'Sửa đột xuất',group: 'tai-chinh', icon: 'wrench',         module: 'may-moc' },
    { id: 'no-xau',        label: 'Công nợ quá hạn / khó đòi',  short: 'Nợ quá hạn',  group: 'tai-chinh', icon: 'receipt',        module: 'ke-toan' }
  ];

  /* ============================================================
     2. NHÓM NGUYÊN NHÂN (4M1E) + MÃ NGUYÊN NHÂN ngành nhựa ép phun
     ============================================================ */
  /* CAUSES (mã lỗi đặc thù ngành) đã chuyển lên khối HỒ SƠ NGÀNH ở đầu file. */
  var CAUSE_GROUPS = [
    { id: 'may',    label: 'Máy & khuôn (Machine)',    color: '#c5400a' },
    { id: 'vat-lieu',label:'Nguyên vật liệu (Material)',color: '#9c7714' },
    { id: 'con-nguoi',label:'Con người (Man)',          color: '#4a5560' },
    { id: 'phuong-phap',label:'Phương pháp & thông số (Method)', color: '#2f5d3a' },
    { id: 'moi-truong',label:'Môi trường & ngoại cảnh (Environment)', color: '#918b7e' },
    { id: 'quan-ly', label: 'Quản lý & kế hoạch',       color: '#8a1f1f' }
  ];

  /* ============================================================
     3. MODULE & BỘ PHẬN CHỊU TRÁCH NHIỆM
     ============================================================ */
  var MODULES = [
    { id: 'san-xuat',   label: 'Sản xuất',        icon: 'factory',       page: '04-san-xuat-kanban.html' },
    { id: 'kho',        label: 'Kho & vật tư',    icon: 'warehouse',     page: '05-kho.html' },
    { id: 'may-moc',    label: 'Thiết bị & bảo trì', icon: 'cog',        page: '14-tbmm-bao-tri.html' },
    { id: 'mua-hang',   label: 'Thu mua',         icon: 'truck',         page: '13-mua-hang.html' },
    { id: 'kinh-doanh', label: 'Kinh doanh & đơn hàng', icon: 'shopping-cart', page: '03-don-hang.html' },
    { id: 'nhan-su',    label: 'Nhân sự & lao động', icon: 'users',      page: '16-cham-cong-luong-khoan.html' },
    { id: 'ke-toan',    label: 'Kế toán & công nợ', icon: 'landmark',    page: '15-ke-toan.html' }
  ];
  var DEPTS = [
    { id: 'san-xuat',   label: 'Tổ sản xuất' },
    { id: 'ky-thuat',   label: 'Kỹ thuật công nghệ' },
    { id: 'khuon',      label: 'Tổ khuôn' },
    { id: 'bao-tri',    label: 'Bảo trì thiết bị' },
    { id: 'kho',        label: 'Kho' },
    { id: 'thu-mua',    label: 'Thu mua' },
    { id: 'qc',         label: 'QC / KCS' },
    { id: 'ke-hoach',   label: 'Kế hoạch điều độ' },
    { id: 'kinh-doanh', label: 'Kinh doanh' },
    { id: 'nhan-su',    label: 'Nhân sự' },
    { id: 'ke-toan',    label: 'Kế toán' }
  ];



  /* ---------- tiện ích ---------- */
  function pad(n, w) { n = String(n); while (n.length < w) n = '0' + n; return n; }
  function fmt(n) { return (Math.round(Number(n) || 0)).toLocaleString('vi-VN'); }
  function money(v) {
    v = Number(v) || 0;
    if (Math.abs(v) >= 1e9) return (v / 1e9).toFixed(2).replace('.', ',') + ' tỷ';
    if (Math.abs(v) >= 1e6) return (v / 1e6).toFixed(1).replace('.', ',') + 'M';
    if (Math.abs(v) >= 1e3) return Math.round(v / 1e3) + 'K';
    return fmt(v);
  }
  function money0(v) { return fmt(v) + '₫'; }
  function typeOf(id) { for (var i = 0; i < TYPES.length; i++) if (TYPES[i].id === id) return TYPES[i]; return { id: id, label: id, short: id, group: 'vat-chat', icon: 'alert-triangle' }; }
  function causeOf(code) { for (var i = 0; i < CAUSES.length; i++) if (CAUSES[i].code === code) return CAUSES[i]; return { code: code, label: code, group: 'quan-ly', dept: 'ke-hoach', fix: '' }; }
  function groupOf(id) { for (var i = 0; i < CAUSE_GROUPS.length; i++) if (CAUSE_GROUPS[i].id === id) return CAUSE_GROUPS[i]; return { id: id, label: id, color: '#918b7e' }; }
  function moduleOf(id) { for (var i = 0; i < MODULES.length; i++) if (MODULES[i].id === id) return MODULES[i]; return { id: id, label: id, icon: 'circle', page: '01-dashboard.html' }; }
  function deptOf(id) { for (var i = 0; i < DEPTS.length; i++) if (DEPTS[i].id === id) return DEPTS[i]; return { id: id, label: id }; }

  /* ngày: tạo chuỗi dd/mm/yyyy lùi n ngày so với 12/09/2026 (ngày "hôm nay" của demo) */
  var TODAY = new Date(2026, 8, 12);
  function dayStr(back) {
    var d = new Date(TODAY.getTime() - back * 86400000);
    return pad(d.getDate(), 2) + '/' + pad(d.getMonth() + 1, 2) + '/' + d.getFullYear();
  }
  function dayKey(back) {
    var d = new Date(TODAY.getTime() - back * 86400000);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1, 2) + '-' + pad(d.getDate(), 2);
  }
  function dmy2key(s) { var m = /(\d{2})\/(\d{2})\/(\d{4})/.exec(String(s || '')); return m ? m[3] + '-' + m[2] + '-' + m[1] : ''; }

  /* ============================================================
     6. SINH DỮ LIỆU
     ============================================================ */
  var _records = null, _steps = null, _seq = 0;

  function nextId(d) { _seq++; return 'TT-' + String(d).replace(/\//g, '').slice(0, 4) + '-' + pad(_seq, 4); }

  function lsxSource() {
    try {
      if (global.QuoteStore && global.QuoteStore.allLSX) {
        return global.QuoteStore.allLSX().filter(function (l) {
          return ['da-huy'].indexOf(l.lifecycle || '') < 0;
        });
      }
    } catch (e) {}
    return [];
  }

  /* Đơn giá 1 đơn vị sản phẩm — tất định theo mã sản phẩm */
  function unitCostOf(lsx) {
    var s = String(lsx.productCode || lsx.product || 'X'), h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100000;
    var base = 4200 + (h % 46) * 1350;         // 4.200₫ → ~65.000₫/cái
    if (/pallet|két|thùng rác|ghế/i.test(lsx.product || '')) base = base * 3 + 42000;
    return Math.round(base / 100) * 100;
  }
  function matShareOf() { return 0.58; }       // 58% giá vốn là nguyên vật liệu
  /* Trọng lượng 1 sản phẩm (gram) — để quy đổi công đoạn tính bằng kg */
  function gramOf(lsx) {
    var p = String(lsx.product || '');
    if (/pallet/i.test(p)) return 14500;
    if (/két|thùng rác|ghế/i.test(p)) return 1850;
    if (/thùng|xô|can |bình/i.test(p)) return 720;
    if (/khay|rổ|chậu/i.test(p)) return 260;
    if (/hộp|ly|lọ|nắp|móc/i.test(p)) return 62;
    return 180;
  }

  var SHIFTS = ['Ca 1 (06–14h)', 'Ca 2 (14–22h)', 'Ca 3 (22–06h)'];
  var OPERATORS = ['Trần Văn Tú', 'Nguyễn Văn Hải', 'Kiều', 'Vi', 'An', 'Hơi', 'Lê Thị Thu', 'Phạm Văn Định', 'Đỗ Minh Quân', 'Ngô Thị Lan'];
  var QC_MEN = ['An', 'Lê Thị Thu', 'Vũ Thị Hồng'];

  function stageMachine(lsx, key) {
    if (['in', 'in-phu', 'in-kts', 'in-kho-lon'].indexOf(key) >= 0) return lsx.machine || 'EP-01 · Haitian MA1600';
    if (['sau-in', 'cat', 'can', 'gia-cong'].indexOf(key) >= 0) return 'HT-01 · Bàn cắt bavia';
    if (key === 'be') return 'IN-01 · Máy in lụa / tampon';
    if (['che-ban', 'cb-kem'].indexOf(key) >= 0) return 'SAY-01 · Máy sấy hạt Shini';
    return 'Tổ đóng gói';
  }

  /* ---------- 6.1 Sinh KẾT QUẢ SẢN XUẤT TỪNG BƯỚC ---------- */
  function buildSteps() {
    reseed(20260912);
    var out = [], recs = [];
    var list = lsxSource();
    list.forEach(function (lsx, li) {
      var stages = (lsx.stages || []).filter(function (s) {
        return s.type !== 'date' && NON_OUTPUT.indexOf(s.key) < 0;
      });
      if (!stages.length) return;
      var qty = Number(lsx.qty) || 5000;
      var unitCost = unitCostOf(lsx);
      var lc = lsx.lifecycle || '';
      var running = ['da-dong'].indexOf(lc) < 0;
      var carry = qty + ri(0, Math.max(1, Math.round(qty * 0.02)));  // SL vào công đoạn đầu
      var baseBack = 1 + Math.round(li * 56 / Math.max(1, list.length - 1));  // trải đều bản ghi trên 56 ngày

      stages.forEach(function (st, si) {
        var done = st.status === 'done' || lc === 'da-dong';
        var doing = st.status === 'doing';
        if (!done && !doing && lc !== 'da-dong') {
          // công đoạn chưa chạy → vẫn liệt kê nhưng chưa có số
          out.push({
            lsxId: lsx.id, seq: si + 1, key: st.key, name: st.name,
            btpCode: (BTP_MAP[st.key] || {}).code || 'BTP', btpName: (BTP_MAP[st.key] || {}).name || st.name,
            unit: (BTP_MAP[st.key] || {}).unit || 'cái',
            machine: stageMachine(lsx, st.key), worker: st.owner || pick(OPERATORS), shift: '—',
            date: '', status: 'cho',
            qtyIn: 0, qtyOk: 0, qtyNg: 0, qtyScrap: 0, qtyRework: 0, yieldPct: null,
            planMin: 0, actualMin: 0, wasteMin: 0, wasteDetail: [], causeNote: '',
            causes: [], lossCost: 0, lossIds: [],
            product: lsx.product, customer: lsx.customer
          });
          return;
        }

        var unitStage = (BTP_MAP[st.key] || {}).unit || 'cái';
        var isPiece = unitStage === 'cái';
        var gram = gramOf(lsx);
        var doneRatio = doing ? (ri(35, 88) / 100) : 1;
        var qIn, processed;
        if (isPiece) {
          qIn = carry;
          processed = Math.round(qIn * doneRatio);
        } else if (unitStage === 'kg') {
          // Quy mô 1 LÔ SẤY trong ca (máy sấy 200kg/mẻ) — không gộp cả đơn hàng
          qIn = Math.max(120, Math.min(9000, Math.round(carry * gram / 1000 * 1.03)));
          processed = Math.round(qIn * doneRatio);
        } else {                                  // 'bộ' — khuôn
          qIn = Math.max(1, Math.min(8, Math.round(qty / 2500) || 1));
          processed = qIn;
        }

        /* Tỷ lệ lỗi theo công đoạn — lấy từ HỒ SƠ NGÀNH */
        var ngRate = (P_NG_RATE[st.key] != null ? P_NG_RATE[st.key] : P_NG_RATE._default);
        /* một số lệnh "có vấn đề" → nhân hệ số để tạo điểm nóng cho báo cáo */
        var hot = (li % 7 === 3) ? 2.6 : (li % 5 === 1 ? 1.7 : 1);
        ngRate = ngRate * hot * (0.7 + rnd() * 0.8);

        var qNg = Math.max(0, Math.round(processed * ngRate));
        if (!isPiece && unitStage === 'bộ') qNg = chance(0.18) ? 1 : 0;
        if (unitStage === 'kg') qNg = Math.round(qNg * 0.3);
        var qRework = Math.round(qNg * (0.3 + rnd() * 0.4));   // một phần cứu được
        var qScrap = qNg - qRework;
        var qOk = processed - qNg;

        /* Thời gian: kế hoạch vs thực tế vs lãng phí */
        var rate = (P_THROUGHPUT[st.key] != null ? P_THROUGHPUT[st.key] : P_THROUGHPUT._default);
        var planMin = Math.max(18, Math.round((isPiece ? processed : carry * doneRatio) / rate * 60) +
                      (P_SETUP_MIN[st.key] != null ? P_SETUP_MIN[st.key] : P_SETUP_MIN._default));

        var wasteDetail = [], wasteMin = 0;
        var nWaste = hot > 2 ? ri(1, 3) : (chance(0.52) ? ri(1, 2) : 0);
        var used = {};
        for (var w = 0; w < nWaste; w++) {
          var code = pick(TIME_WASTE_REASONS);
          if (used[code]) continue; used[code] = 1;
          var m = ri(12, 165);
          if (code === 'TG-SUCO') m = ri(35, 260);
          if (code === 'TG-DIEN') m = ri(20, 95);
          if (code === 'TG-SETUP') m = ri(15, 70);
          wasteDetail.push({ code: code, label: causeOf(code).label, min: m });
          wasteMin += m;
        }
        var actualMin = planMin + wasteMin + ri(-6, 14);

        /* Chi phí thiệt hại của bước này */
        var costScrap = isPiece ? Math.round(qScrap * unitCost * (0.55 + si * 0.09)) : Math.round(qScrap * RATE.resinKg);
        var costRework = Math.round(qRework * unitCost * 0.19);
        var costTime = Math.round(wasteMin / 60 * (RATE.machineHour + RATE.labourHour));
        var lossCost = costScrap + costRework + costTime;

        /* Ghi chú nguyên nhân lỗi */
        var causePool = STEP_CAUSES[st.key] || ['LOI-CAT-KT'];
        var nCause = qNg > 0 ? (hot > 2 ? ri(2, 3) : ri(1, 2)) : 0;
        var causes = [], left = qNg, usedCause = {};
        for (var c = 0; c < nCause; c++) {
          var cc = causePool[(li * 3 + si * 5 + c * 7 + ri(0, 2)) % causePool.length];
          if (usedCause[cc]) { cc = causePool[(causePool.indexOf(cc) + 1 + c) % causePool.length]; }
          if (usedCause[cc]) continue;
          usedCause[cc] = 1;
          var part = (c === nCause - 1) ? left : Math.max(1, Math.round(qNg * (0.3 + rnd() * 0.35)));
          part = Math.min(part, left); left -= part;
          if (part <= 0) continue;
          causes.push({ code: cc, label: causeOf(cc).label, qty: part, group: causeOf(cc).group, dept: causeOf(cc).dept });
        }

        var noteBits = [];
        if (causes.length) noteBits.push(causes.map(function (x) { return x.label.split('—')[0].trim() + ' (' + fmt(x.qty) + ')'; }).join(' · '));
        if (wasteDetail.length) noteBits.push('Mất giờ: ' + wasteDetail.map(function (x) { return x.label.split('—')[0].trim() + ' ' + x.min + "'"; }).join(' · '));

        var back = Math.max(0, baseBack - (stages.length - si));
        var stepRec = {
          lsxId: lsx.id, seq: si + 1, key: st.key, name: st.name,
          btpCode: (BTP_MAP[st.key] || {}).code || 'BTP',
          btpName: (BTP_MAP[st.key] || {}).name || st.name,
          unit: (BTP_MAP[st.key] || {}).unit || 'cái',
          machine: stageMachine(lsx, st.key),
          worker: st.owner || pick(OPERATORS),
          shift: SHIFTS[(li + si) % 3],
          date: dayStr(back), dateKey: dayKey(back),
          status: doing ? 'dang-chay' : 'xong',
          qtyIn: qIn, qtyProcessed: processed, qtyOk: qOk, qtyNg: qNg, qtyScrap: qScrap, qtyRework: qRework,
          yieldPct: processed ? +(qOk / processed * 100).toFixed(2) : null,
          planMin: planMin, actualMin: actualMin, wasteMin: wasteMin,
          wastePct: actualMin ? +(wasteMin / actualMin * 100).toFixed(1) : 0,
          wasteDetail: wasteDetail, causes: causes, causeNote: noteBits.join(' · ') || 'Không ghi nhận bất thường',
          lossCost: lossCost, costScrap: costScrap, costRework: costRework, costTime: costTime,
          lossIds: [], product: lsx.product, customer: lsx.customer, unitCost: unitCost
        };
        out.push(stepRec);

        /* → sinh bản ghi SỔ CÁI cho phần hỏng và phần mất giờ */
        causes.forEach(function (cv) {
          var cInfo = causeOf(cv.code);
          var scrapPart = Math.round(cv.qty * (qNg ? qScrap / qNg : 0.6));
          var reworkPart = cv.qty - scrapPart;
          var cost = isPiece ? Math.round(scrapPart * unitCost * (0.55 + si * 0.09) + reworkPart * unitCost * 0.19)
                             : Math.round(cv.qty * RATE.resinKg);
          var r = {
            id: nextId(stepRec.date), date: stepRec.date, dateKey: stepRec.dateKey, shift: stepRec.shift,
            module: 'san-xuat', type: scrapPart >= reworkPart ? 'phe' : 'tai-che',
            title: cInfo.label.split('—')[0].trim() + ' tại ' + st.name,
            lsxId: lsx.id, stepKey: st.key, stepName: st.name,
            btpCode: stepRec.btpCode, btpName: stepRec.btpName, unit: stepRec.unit,
            product: lsx.product, productCode: lsx.productCode, customer: lsx.customer,
            machine: stepRec.machine, worker: stepRec.worker,
            qty: cv.qty, qtyScrap: scrapPart, qtyRework: reworkPart, minutes: 0,
            cost: cost, causeCode: cv.code, causeLabel: cInfo.label, causeGroup: cInfo.group,
            dept: cInfo.dept, action: cInfo.fix,
            note: 'Phát hiện tại ' + st.name + ' — lô ' + (lsx.lot || lsx.id) + ', ' + stepRec.shift +
                  '. Đã tách riêng ' + fmt(scrapPart) + ' ' + stepRec.unit + ' phế' +
                  (reworkPart ? ', ' + fmt(reworkPart) + ' ' + stepRec.unit + ' chuyển tái chế' : '') + '.',
            status: chance(0.62) ? 'da-xu-ly' : (chance(0.5) ? 'dang-xu-ly' : 'moi'),
            severity: cost > 4000000 ? 'cao' : (cost > 1200000 ? 'trung-binh' : 'thap')
          };
          recs.push(r); stepRec.lossIds.push(r.id);
        });
        wasteDetail.forEach(function (wd) {
          var cInfo = causeOf(wd.code);
          var cost = Math.round(wd.min / 60 * (RATE.machineHour + RATE.labourHour));
          var r = {
            id: nextId(stepRec.date), date: stepRec.date, dateKey: stepRec.dateKey, shift: stepRec.shift,
            module: wd.code === 'TG-SUCO' || wd.code === 'TG-DIEN' ? 'may-moc' : (wd.code === 'TG-CHOVT' ? 'kho' : 'san-xuat'),
            type: wd.code === 'TG-SUCO' || wd.code === 'TG-DIEN' ? 'dung-may' : (wd.code === 'TG-SETUP' ? 'setup-vuot' : 'cho-viec'),
            title: cInfo.label.split('—')[0].trim() + ' tại ' + st.name,
            lsxId: lsx.id, stepKey: st.key, stepName: st.name,
            btpCode: stepRec.btpCode, btpName: stepRec.btpName, unit: 'phút',
            product: lsx.product, productCode: lsx.productCode, customer: lsx.customer,
            machine: stepRec.machine, worker: stepRec.worker,
            qty: 0, qtyScrap: 0, qtyRework: 0, minutes: wd.min,
            cost: cost, causeCode: wd.code, causeLabel: cInfo.label, causeGroup: cInfo.group,
            dept: cInfo.dept, action: cInfo.fix,
            note: 'Máy ' + stepRec.machine + ' dừng ' + wd.min + ' phút trong ' + stepRec.shift +
                  ' (' + stepRec.date + '). Sản lượng hụt ước tính ' + fmt(Math.round(wd.min / 60 * 1200)) + ' cái.',
            status: chance(0.5) ? 'da-xu-ly' : (chance(0.5) ? 'dang-xu-ly' : 'moi'),
            severity: wd.min > 150 ? 'cao' : (wd.min > 60 ? 'trung-binh' : 'thap')
          };
          recs.push(r); stepRec.lossIds.push(r.id);
        });

        if (isPiece) carry = qOk;   // BTP đạt chuyển sang bước sau; công đoạn kg/bộ không đổi dòng chảy
      });
    });
    return { steps: out, recs: recs };
  }

  /* ---------- 6.2 Thất thoát ở CÁC MODULE KHÁC ---------- */
  function buildOtherModules(recs) {
    var MATS = P_MATERIALS, MACHINES = P_MACHINES, NCC = P_SUPPLIERS,
        KH = P_CUSTOMERS, NV = P_WORKERS, KHOS = P_WAREHOUSES;

    function push(o) { o.id = nextId(o.date); recs.push(o); return o; }

    /* Chặn phóng đại thiệt hại: ngành nhôm có vật tư 4,85 tr/bộ (bản lề thuỷ lực),
       không thể mất 145 bộ trong một lần như hạt nhựa 38k/kg. Trần giá trị theo ĐVT. */
    var LOSS_CAP = { 'kg': 7000000, 'm²': 4200000, 'bộ': 5200000, 'm': 1800000, 'tuýp': 1200000, 'cây': 5000000, 'cái': 2000000, 'cuộn': 2000000 };
    function capQ(m, q, f) {
      var cap = (LOSS_CAP[m.u] || 3500000) * (f || 1);
      return Math.max(1, Math.min(q, Math.floor(cap / Math.max(1, m.p))));
    }

    /* --- KHO: hao vượt định mức --- */
    for (var i = 0; i < 10; i++) {
      var m = MATS[i % MATS.length], back = ri(0, 55), q = capQ(m, ri(8, 145));
      push({ date: dayStr(back), dateKey: dayKey(back), shift: SHIFTS[i % 3], module: 'kho', type: 'hao-vuot-dm',
        title: 'Hao ' + m.n + ' vượt định mức ' + (ri(3, 14)) + '%',
        lsxId: '', stepKey: '', stepName: 'Cấp phát vật tư', btpCode: m.c, btpName: m.n, unit: m.u,
        product: '', customer: '', machine: '', worker: pick(NV), warehouse: KHOS[0],
        qty: q, qtyScrap: q, qtyRework: 0, minutes: 0, cost: q * m.p,
        causeCode: 'VT-HAO', causeLabel: causeOf('VT-HAO').label, causeGroup: 'con-nguoi', dept: 'kho', action: causeOf('VT-HAO').fix,
        note: 'Xuất thực tế ' + fmt(q + ri(400, 1400)) + ' ' + m.u + ' so với định mức BOM — chênh ' + fmt(q) + ' ' + m.u +
              '. Nguyên nhân: cân đong thủ công, không quét QR từng bao.',
        status: chance(0.45) ? 'da-xu-ly' : 'dang-xu-ly', severity: q * m.p > 3000000 ? 'cao' : 'trung-binh' });
    }
    /* --- KHO: chênh kiểm kê --- */
    for (i = 0; i < 5; i++) {
      var m2 = MATS[(i + 3) % MATS.length], b2 = ri(0, 55), q2 = capQ(m2, ri(4, 60), 0.55);
      push({ date: dayStr(b2), dateKey: dayKey(b2), shift: 'Hành chính', module: 'kho', type: 'chenh-kiem-ke',
        title: 'Lệch kiểm kê ' + m2.n + ' −' + fmt(q2) + ' ' + m2.u,
        lsxId: '', stepKey: '', stepName: 'Kiểm kê chu kỳ', btpCode: m2.c, btpName: m2.n, unit: m2.u,
        product: '', customer: '', machine: '', worker: pick(NV), warehouse: KHOS[i % KHOS.length],
        qty: q2, qtyScrap: q2, qtyRework: 0, minutes: 0, cost: q2 * m2.p,
        causeCode: 'VT-KIEMKE', causeLabel: causeOf('VT-KIEMKE').label, causeGroup: 'quan-ly', dept: 'kho', action: causeOf('VT-KIEMKE').fix,
        note: 'Sổ sách ' + fmt(q2 * ri(8, 22)) + ' ' + m2.u + ' · thực đếm thiếu ' + fmt(q2) + ' ' + m2.u +
              '. Nghi do xuất bù cho lệnh khác nhưng chưa lập phiếu.',
        status: chance(0.35) ? 'da-xu-ly' : 'moi', severity: 'trung-binh' });
    }
    /* --- KHO: hết hạn & tồn chết --- */
    for (i = 0; i < 4; i++) {
      var m3 = MATS[(i + 4) % MATS.length], b3 = ri(0, 55), q3 = capQ(m3, ri(15, 90), 0.7);
      push({ date: dayStr(b3), dateKey: dayKey(b3), shift: 'Hành chính', module: 'kho',
        type: i % 3 === 0 ? 'het-han' : 'ton-chet',
        title: (i % 3 === 0 ? 'Hết hạn / biến chất: ' : 'Tồn chết >180 ngày: ') + m3.n,
        lsxId: '', stepKey: '', stepName: 'Rà soát tồn kho', btpCode: m3.c, btpName: m3.n, unit: m3.u,
        product: '', customer: '', machine: '', worker: 'Diệu', warehouse: KHOS[(i + 1) % KHOS.length],
        qty: q3, qtyScrap: q3, qtyRework: 0, minutes: 0, cost: q3 * m3.p,
        causeCode: i % 3 === 0 ? 'VT-BAOQUAN' : 'VT-TONCHET',
        causeLabel: causeOf(i % 3 === 0 ? 'VT-BAOQUAN' : 'VT-TONCHET').label,
        causeGroup: i % 3 === 0 ? 'moi-truong' : 'quan-ly', dept: i % 3 === 0 ? 'kho' : 'kinh-doanh',
        action: causeOf(i % 3 === 0 ? 'VT-BAOQUAN' : 'VT-TONCHET').fix,
        note: i % 3 === 0 ? 'Bao hạt mở nhưng không hút ẩm lại, vón cục — không dùng cho hàng xuất khẩu được.'
                          : 'Nhập cho đơn đã huỷ/đổi thiết kế, nằm kho ' + ri(182, 410) + ' ngày, chưa có lệnh tiêu thụ.',
        status: chance(0.3) ? 'dang-xu-ly' : 'moi', severity: q3 * m3.p > 5000000 ? 'cao' : 'trung-binh' });
    }
    /* --- MÁY MÓC: dừng máy & sửa chữa đột xuất --- */
    for (i = 0; i < 18; i++) {
      var mc = MACHINES[i % MACHINES.length], b4 = ri(0, 55), mins = ri(45, 420);
      var isRepair = i % 3 === 0;
      push({ date: dayStr(b4), dateKey: dayKey(b4), shift: SHIFTS[i % 3], module: 'may-moc',
        type: isRepair ? 'sua-chua' : 'dung-may',
        title: (isRepair ? 'Sửa chữa đột xuất: ' : 'Dừng máy ngoài KH: ') + mc,
        lsxId: '', stepKey: 'in', stepName: 'Cắt & phay đố (CNC)', btpCode: '', btpName: '', unit: 'phút',
        product: '', customer: '', machine: mc, worker: pick(['Phạm Văn Định', 'Đỗ Minh Quân', 'Hoàng Văn Nam']),
        qty: 0, qtyScrap: 0, qtyRework: 0, minutes: mins,
        cost: Math.round(mins / 60 * RATE.machineHour) + (isRepair ? ri(1, 9) * 850000 : 0),
        causeCode: isRepair ? 'TC-SUACHUA' : 'TG-SUCO',
        causeLabel: causeOf(isRepair ? 'TC-SUACHUA' : 'TG-SUCO').label,
        causeGroup: 'may', dept: 'bao-tri', action: causeOf(isRepair ? 'TC-SUACHUA' : 'TG-SUCO').fix,
        note: pick(P_INCIDENTS) + ' Dừng ' + mins + " phút, trễ tiến độ " + ri(1, 3) + ' lệnh đang chờ máy.',
        status: chance(0.55) ? 'da-xu-ly' : 'dang-xu-ly', severity: mins > 240 ? 'cao' : (mins > 120 ? 'trung-binh' : 'thap') });
    }
    /* --- THU MUA: mua gấp giá cao --- */
    for (i = 0; i < 11; i++) {
      var m5 = MATS[(i + 2) % MATS.length], b5 = ri(0, 55), q5 = capQ(m5, ri(200, 1800), 5);
      var premium = ri(6, 24) / 100;
      push({ date: dayStr(b5), dateKey: dayKey(b5), shift: 'Hành chính', module: 'mua-hang', type: 'mua-gap',
        title: 'Mua gấp ' + m5.n + ' — đội giá ' + Math.round(premium * 100) + '%',
        lsxId: '', stepKey: '', stepName: 'Đặt hàng khẩn', btpCode: m5.c, btpName: m5.n, unit: m5.u,
        product: '', customer: '', machine: '', worker: 'Nguyệt', supplier: pick(NCC),
        qty: q5, qtyScrap: 0, qtyRework: 0, minutes: 0, cost: Math.round(q5 * m5.p * premium),
        causeCode: 'TC-MUAGAP', causeLabel: causeOf('TC-MUAGAP').label, causeGroup: 'quan-ly', dept: 'thu-mua', action: causeOf('TC-MUAGAP').fix,
        note: 'Tồn chạm 0 trước khi lệnh vào máy ' + ri(1, 4) + ' ngày. Đặt gấp NCC phụ, đơn giá ' +
              fmt(Math.round(m5.p * (1 + premium))) + '₫/' + m5.u + ' so với giá hợp đồng ' + fmt(m5.p) + '₫/' + m5.u + '.',
        status: chance(0.6) ? 'da-xu-ly' : 'dang-xu-ly', severity: q5 * m5.p * premium > 8000000 ? 'cao' : 'trung-binh' });
    }
    /* --- KINH DOANH: trả hàng & phạt giao trễ --- */
    for (i = 0; i < 13; i++) {
      var b6 = ri(0, 55), isRet = i % 2 === 0, q6 = ri(120, 1800), uc = ri(6, 26) * 1000;
      var retCause = ['LOI-CAT-KT', 'LOI-VENH', 'LOI-MAU', 'LOI-GIOANG', 'LOI-BANLE', 'LOI-EP-HO'][i % 6];
      push({ date: dayStr(b6), dateKey: dayKey(b6), shift: 'Hành chính', module: 'kinh-doanh',
        type: isRet ? 'tra-hang' : 'giao-tre',
        title: isRet ? ('Khách trả hàng: ' + fmt(q6) + ' cái') : ('Phạt giao trễ hợp đồng ' + ri(2, 11) + ' ngày'),
        lsxId: '', stepKey: 'kcs', stepName: 'KCS / Giao hàng', btpCode: 'TP-KHO', btpName: 'Thành phẩm', unit: 'cái',
        product: pick(['Thùng nhựa công nghiệp 30L', 'Hộp bảo quản thực phẩm 1.5L', 'Két nhựa đựng bia 24 chai', 'Xô nhựa 20L có quai', 'Pallet nhựa 1200×1000']),
        customer: KH[i % KH.length], machine: '', worker: pick(['Nga', 'Oanh']),
        qty: isRet ? q6 : 0, qtyScrap: isRet ? Math.round(q6 * 0.4) : 0, qtyRework: isRet ? Math.round(q6 * 0.6) : 0, minutes: 0,
        cost: isRet ? q6 * uc : ri(4, 46) * 1000000,
        causeCode: isRet ? retCause : 'TC-PHATTRE',
        causeLabel: causeOf(isRet ? retCause : 'TC-PHATTRE').label,
        causeGroup: isRet ? causeOf(retCause).group : 'quan-ly', dept: isRet ? causeOf(retCause).dept : 'ke-hoach',
        action: causeOf(isRet ? retCause : 'TC-PHATTRE').fix,
        note: isRet ? ('Khách phản hồi lô giao ngày ' + dayStr(b6 + ri(3, 9)) + ' bị lỗi: ' +
                       causeOf(retCause).label.split('—')[0].trim().toLowerCase() +
                       '. Đã thu hồi, phân loại lại: 40% phế, 60% sửa được.')
                    : ('Lệnh vào máy trễ do chờ vật tư + kẹt khuôn. Hợp đồng phạt ' + ri(1, 3) + '‰/ngày trên giá trị đơn.'),
        status: chance(0.4) ? 'dang-xu-ly' : 'moi', severity: 'cao' });
    }
    /* --- NHÂN SỰ: công rỗng & tăng ca bù lỗi --- */
    for (i = 0; i < 16; i++) {
      var b7 = ri(0, 55), h = ri(2, 26), isOT = i % 2 === 1;
      push({ date: dayStr(b7), dateKey: dayKey(b7), shift: SHIFTS[i % 3], module: 'nhan-su',
        type: isOT ? 'lam-them' : 'cong-khong',
        title: isOT ? ('Tăng ca bù lỗi ' + h + ' giờ công') : ('Công chờ việc ' + h + ' giờ — tổ ' + pick(['ép phun', 'cắt bavia', 'đóng gói', 'lắp ráp'])),
        lsxId: '', stepKey: '', stepName: isOT ? 'Tăng ca' : 'Chờ việc', btpCode: '', btpName: '', unit: 'giờ công',
        product: '', customer: '', machine: '', worker: NV[i % NV.length],
        qty: h, qtyScrap: 0, qtyRework: 0, minutes: h * 60,
        cost: Math.round(h * RATE.labourHour * (isOT ? 1.5 : 1)),
        causeCode: isOT ? 'TG-SETUP' : 'TG-CHOVT',
        causeLabel: isOT ? 'Tăng ca để làm bù sản lượng hỏng' : causeOf('TG-CHOVT').label,
        causeGroup: isOT ? 'quan-ly' : 'quan-ly', dept: isOT ? 'ke-hoach' : 'nhan-su',
        action: isOT ? 'Giảm tỷ lệ lỗi đầu nguồn để cắt tăng ca bù' : 'Cân bằng chuyền · điều người sang tổ thiếu',
        note: isOT ? ('Phải chạy bù ' + fmt(ri(500, 4200)) + ' cái hỏng ở công đoạn ép — trả lương tăng ca 150%.')
                   : (ri(3, 9) + ' công nhân đứng chờ ' + h + ' giờ do hạt nhựa chưa về / khuôn chưa tháo xong.'),
        status: chance(0.5) ? 'da-xu-ly' : 'moi', severity: h > 16 ? 'cao' : 'thap' });
    }
    /* --- KẾ TOÁN: công nợ quá hạn --- */
    for (i = 0; i < 8; i++) {
      var b8 = ri(0, 55), amt = ri(35, 260) * 1000000, days = ri(35, 180);
      push({ date: dayStr(b8), dateKey: dayKey(b8), shift: 'Hành chính', module: 'ke-toan', type: 'no-xau',
        title: 'Công nợ quá hạn ' + days + ' ngày — ' + KH[i % KH.length],
        lsxId: '', stepKey: '', stepName: 'Theo dõi công nợ', btpCode: '', btpName: '', unit: '₫',
        product: '', customer: KH[i % KH.length], machine: '', worker: pick(['Nga', 'Oanh', 'Kế toán công nợ']),
        qty: 0, qtyScrap: 0, qtyRework: 0, minutes: 0,
        cost: Math.round(amt * 0.011 * days / 30),   // chi phí vốn bị chiếm dụng
        debt: amt,
        causeCode: 'TC-NOXAU', causeLabel: causeOf('TC-NOXAU').label, causeGroup: 'quan-ly', dept: 'ke-toan', action: causeOf('TC-NOXAU').fix,
        note: 'Dư nợ ' + money(amt) + '₫ quá hạn ' + days + ' ngày. Chi phí vốn bị chiếm dụng tính theo lãi vay 13,2%/năm.',
        status: chance(0.35) ? 'dang-xu-ly' : 'moi', severity: amt > 500000000 ? 'cao' : 'trung-binh' });
    }
    return recs;
  }

  function ensure() {
    if (_records) return;
    _seq = 0;
    var b = buildSteps();
    _steps = b.steps;
    _records = buildOtherModules(b.recs);
    _records.sort(function (a, c) { return c.dateKey < a.dateKey ? -1 : (c.dateKey > a.dateKey ? 1 : 0); });
  }

  /* ============================================================
     7. TRUY VẤN & TỔNG HỢP
     ============================================================ */
  function match(r, f) {
    if (!f) return true;
    if (f.module && r.module !== f.module) return false;
    if (f.modules && f.modules.indexOf(r.module) < 0) return false;
    if (f.type && r.type !== f.type) return false;
    if (f.types && f.types.indexOf(r.type) < 0) return false;
    if (f.group && typeOf(r.type).group !== f.group) return false;
    if (f.cause && r.causeCode !== f.cause) return false;
    if (f.causeGroup && r.causeGroup !== f.causeGroup) return false;
    if (f.dept && r.dept !== f.dept) return false;
    if (f.lsxId && r.lsxId !== f.lsxId) return false;
    if (f.stepKey && r.stepKey !== f.stepKey) return false;
    if (f.machine && String(r.machine || '').indexOf(f.machine) < 0) return false;
    if (f.worker && r.worker !== f.worker) return false;
    if (f.customer && r.customer !== f.customer) return false;
    if (f.product && r.product !== f.product) return false;
    if (f.shift && r.shift !== f.shift) return false;
    if (f.severity && r.severity !== f.severity) return false;
    if (f.status && r.status !== f.status) return false;
    if (f.btpCode && r.btpCode !== f.btpCode) return false;
    if (f.from && r.dateKey < f.from) return false;
    if (f.to && r.dateKey > f.to) return false;
    if (f.days != null) { var lim = dayKey(f.days); if (r.dateKey < lim) return false; }
    if (f.q) {
      var s = (r.title + ' ' + r.note + ' ' + r.causeLabel + ' ' + (r.lsxId || '') + ' ' + (r.product || '') + ' ' + (r.machine || '')).toLowerCase();
      if (s.indexOf(String(f.q).toLowerCase()) < 0) return false;
    }
    return true;
  }

  function filter(f) { ensure(); return _records.filter(function (r) { return match(r, f); }); }

  function agg(f, keyFn, labelFn) {
    var rows = filter(f), map = {};
    rows.forEach(function (r) {
      var k = keyFn(r); if (k == null || k === '') return;
      if (!map[k]) map[k] = { key: k, label: labelFn ? labelFn(r, k) : k, cost: 0, qty: 0, scrap: 0, rework: 0, minutes: 0, count: 0, records: [] };
      var o = map[k];
      o.cost += r.cost || 0; o.qty += r.qty || 0; o.scrap += r.qtyScrap || 0;
      o.rework += r.qtyRework || 0; o.minutes += r.minutes || 0; o.count++;
      o.records.push(r.id);
    });
    var out = Object.keys(map).map(function (k) { return map[k]; });
    out.sort(function (a, b) { return b.cost - a.cost; });
    return out;
  }

  function total(f) {
    var rows = filter(f), t = { cost: 0, qty: 0, scrap: 0, rework: 0, minutes: 0, count: rows.length, debt: 0 };
    rows.forEach(function (r) {
      t.cost += r.cost || 0; t.qty += r.qty || 0; t.scrap += r.qtyScrap || 0;
      t.rework += r.qtyRework || 0; t.minutes += r.minutes || 0; t.debt += r.debt || 0;
    });
    return t;
  }

  /* KPI tổng quan — có so sánh kỳ trước */
  function kpi(days) {
    days = days || 30;
    ensure();
    var cur = total({ days: days });
    var prevRows = _records.filter(function (r) { return r.dateKey < dayKey(days) && r.dateKey >= dayKey(days * 2); });
    var prev = { cost: 0, minutes: 0, scrap: 0 };
    prevRows.forEach(function (r) { prev.cost += r.cost || 0; prev.minutes += r.minutes || 0; prev.scrap += r.qtyScrap || 0; });
    var st = stepStats(days);
    function delta(a, b) { return b ? +(((a - b) / b) * 100).toFixed(1) : 0; }
    return {
      totalCost: cur.cost, prevCost: prev.cost, deltaCost: delta(cur.cost, prev.cost),
      records: cur.count,
      scrapQty: cur.scrap, reworkQty: cur.rework,
      lostMinutes: cur.minutes, lostHours: +(cur.minutes / 60).toFixed(1),
      deltaMinutes: delta(cur.minutes, prev.minutes),
      matCost: total({ days: days, group: 'vat-chat' }).cost,
      timeCost: total({ days: days, group: 'thoi-gian' }).cost,
      finCost: total({ days: days, group: 'tai-chinh' }).cost,
      ngQty: st.ng, okQty: st.ok, yieldPct: st.yieldPct, fpy: st.fpy,
      wasteMinProd: st.wasteMin, planMin: st.planMin, actualMin: st.actualMin,
      oee: st.oee, availability: st.availability, performance: st.performance, quality: st.quality,
      revenueRef: 18450000000,
      costPctRevenue: +(cur.cost / 18450000000 * 100).toFixed(2)
    };
  }

  /* Thống kê từ KẾT QUẢ TỪNG BƯỚC */
  function stepStats(days) {
    ensure();
    var lim = days ? dayKey(days) : '';
    var rows = _steps.filter(function (s) { return s.status !== 'cho' && (!lim || s.dateKey >= lim); });
    var ok = 0, ng = 0, waste = 0, plan = 0, act = 0, firstOk = 0, firstTotal = 0;
    rows.forEach(function (s) {
      ok += s.qtyOk; ng += s.qtyNg; waste += s.wasteMin; plan += s.planMin; act += s.actualMin;
      if (['in', 'in-phu', 'in-kts', 'in-kho-lon'].indexOf(s.key) >= 0) { firstOk += s.qtyOk; firstTotal += s.qtyOk + s.qtyNg; }
    });
    var totalQ = ok + ng;
    var availability = act ? +(((act - waste) / act) * 100).toFixed(1) : 100;
    var performance = act && plan ? +Math.min(100, (plan / Math.max(1, act - waste)) * 100).toFixed(1) : 100;
    var quality = totalQ ? +((ok / totalQ) * 100).toFixed(1) : 100;
    return {
      ok: ok, ng: ng, wasteMin: waste, planMin: plan, actualMin: act,
      yieldPct: totalQ ? +((ok / totalQ) * 100).toFixed(2) : 100,
      fpy: firstTotal ? +((firstOk / firstTotal) * 100).toFixed(2) : 100,
      availability: availability, performance: performance, quality: quality,
      oee: +((availability * performance * quality) / 10000).toFixed(1)
    };
  }

  /* Pareto nguyên nhân — trả về mảng có luỹ kế % */
  function pareto(f, by) {
    by = by || 'cause';
    var rows = by === 'cause'
      ? agg(f, function (r) { return r.causeCode; }, function (r) { return r.causeLabel; })
      : agg(f, function (r) { return r.causeGroup; }, function (r) { return groupOf(r.causeGroup).label; });
    var sum = rows.reduce(function (a, b) { return a + b.cost; }, 0), run = 0;
    rows.forEach(function (r) { run += r.cost; r.pct = sum ? +(r.cost / sum * 100).toFixed(1) : 0; r.cum = sum ? +(run / sum * 100).toFixed(1) : 0; });
    return rows;
  }

  /* Chuỗi theo ngày (cho biểu đồ xu hướng) */
  function series(days, f) {
    days = days || 14; ensure();
    var out = [];
    for (var i = days - 1; i >= 0; i--) {
      var k = dayKey(i);
      var rows = _records.filter(function (r) { return r.dateKey === k && match(r, f); });
      var c = 0, mn = 0, sc = 0;
      rows.forEach(function (r) { c += r.cost || 0; mn += r.minutes || 0; sc += r.qtyScrap || 0; });
      var d = new Date(TODAY.getTime() - i * 86400000);
      out.push({ dateKey: k, label: pad(d.getDate(), 2) + '/' + pad(d.getMonth() + 1, 2), cost: c, minutes: mn, scrap: sc, count: rows.length });
    }
    return out;
  }

  /* ============================================================
     8. API
     ============================================================ */
  global.LossStore = {
    TYPES: TYPES, CAUSES: CAUSES, CAUSE_GROUPS: CAUSE_GROUPS, MODULES: MODULES, DEPTS: DEPTS,
    BTP_MAP: BTP_MAP, RATE: RATE, TODAY: TODAY,

    all: function () { ensure(); return _records.slice(); },
    get: function (id) { ensure(); for (var i = 0; i < _records.length; i++) if (_records[i].id === id) return _records[i]; return null; },
    filter: filter,
    byModule: function (m) { return filter({ module: m }); },
    byLSX: function (id) { return filter({ lsxId: id }); },
    byStep: function (lsxId, key) { return filter({ lsxId: lsxId, stepKey: key }); },

    /* kết quả sản xuất từng bước */
    steps: function (lsxId) { ensure(); return _steps.filter(function (s) { return s.lsxId === lsxId; }); },
    allSteps: function () { ensure(); return _steps.slice(); },
    stepsFilter: function (f) {
      ensure(); f = f || {};
      return _steps.filter(function (s) {
        if (s.status === 'cho' && !f.includeWaiting) return false;
        if (f.lsxId && s.lsxId !== f.lsxId) return false;
        if (f.stepKey && s.key !== f.stepKey) return false;
        if (f.machine && String(s.machine).indexOf(f.machine) < 0) return false;
        if (f.days != null && s.dateKey < dayKey(f.days)) return false;
        if (f.btpCode && s.btpCode !== f.btpCode) return false;
        if (f.minNg && s.qtyNg < f.minNg) return false;
        return true;
      });
    },
    stepStats: stepStats,

    /* tổng hợp */
    total: total, kpi: kpi, agg: agg, pareto: pareto, series: series,
    byTypeAgg: function (f) { return agg(f, function (r) { return r.type; }, function (r) { return typeOf(r.type).label; }); },
    byCauseAgg: function (f) { return agg(f, function (r) { return r.causeCode; }, function (r) { return r.causeLabel; }); },
    byCauseGroupAgg: function (f) { return agg(f, function (r) { return r.causeGroup; }, function (r) { return groupOf(r.causeGroup).label; }); },
    byModuleAgg: function (f) { return agg(f, function (r) { return r.module; }, function (r) { return moduleOf(r.module).label; }); },
    byDeptAgg: function (f) { return agg(f, function (r) { return r.dept; }, function (r) { return deptOf(r.dept).label; }); },
    byMachineAgg: function (f) { return agg(f, function (r) { return r.machine; }); },
    byProductAgg: function (f) { return agg(f, function (r) { return r.product; }); },
    byCustomerAgg: function (f) { return agg(f, function (r) { return r.customer; }); },
    byLsxAgg: function (f) { return agg(f, function (r) { return r.lsxId; }); },
    byStepAgg: function (f) { return agg(f, function (r) { return r.stepName; }); },
    byShiftAgg: function (f) { return agg(f, function (r) { return r.shift; }); },
    byWorkerAgg: function (f) { return agg(f, function (r) { return r.worker; }); },

    /* tiện ích hiển thị */
    fmt: fmt, money: money, money0: money0,
    typeOf: typeOf, causeOf: causeOf, groupOf: groupOf, moduleOf: moduleOf, deptOf: deptOf,
    dayStr: dayStr, dayKey: dayKey, dmy2key: dmy2key,
    hours: function (min) { return (Math.round((min || 0) / 6) / 10).toFixed(1); },
    /* Tóm tắt 1 dòng cho từng module — dùng cho chỉ báo trên mọi trang */
    moduleSummary: function (m, days) {
      var t = total({ module: m, days: days || 30 });
      return {
        module: m, cost: t.cost, count: t.count, minutes: t.minutes,
        scrap: t.scrap, rework: t.rework,
        topCause: (agg({ module: m, days: days || 30 }, function (r) { return r.causeCode; }, function (r) { return r.causeLabel; })[0] || null)
      };
    }
  };
})(window);
