/* ============================================================
   Nhà cung cấp — dữ liệu + drawer chi tiết (dùng chung nhiều trang)
   openNCC(key) mở drawer trượt phải; tự chèn CSS khi cần.
   ============================================================ */
window.NCC = {
  tanmai:      { ten:'Đùn ép Nhôm Đông Anh',     dm:'Nhôm thanh (profile)',   lh:'A. Hùng',  sdt:'024 3882 1xxx', dc:'KCN Nguyên Khê, Đông Anh, Hà Nội', dg:5, don:28, gt:'720M', tt:'Đang hợp tác', ttc:'success', giao:'5 ngày', cl:5, datQc:'99,2%', loi:'0,8%', tra:'0 đợt', clgc:'Nhôm 6063-T5 đủ CO/CQ, cây thẳng đều, dung sai độ dày ổn định', tp:[['Thanh nhôm hệ thuỷ lực 120 (6063-T5)','Cây 5,8m · dày 2,0mm','78.500 ₫/kg'],['Thanh nhôm hệ trượt quay 93','Cây 5,8m','76.000 ₫/kg'],['Thanh nhôm hệ chấn song + phào','Cây 5,8m','71.000 ₫/kg']] },
  baibang:     { ten:'Nhôm Luxanode nhập khẩu',  dm:'Nhôm thanh nhập khẩu',   lh:'C. Lan',   sdt:'024 3775 5xx',  dc:'Cảng Hồng Vân, Thường Tín, Hà Nội', dg:4, don:22, gt:'485M', tt:'Đang hợp tác', ttc:'success', giao:'7 ngày', cl:4, datQc:'97,1%', loi:'2,1%', tra:'1 đợt', clgc:'Đôi lô lớp anod mỏng dưới 15µm, phải đo lại khi nhập kho', tp:[['Thanh nhôm Luxanode Anodized-ED 121','Cây 5,8m · anod ≥15µm','96.000 ₫/kg'],['Thanh nhôm hệ thuỷ lực 180','Cây 5,8m · dày 2,5mm','82.000 ₫/kg'],['Thanh nhôm Luxanode 76 mở lùa','Cây 5,8m','92.000 ₫/kg']] },
  mucvn:       { ten:'Phụ kiện Kinlong VN',      dm:'Phụ kiện cửa nhôm',      lh:'A. Sơn',   sdt:'024 3845 2xx',  dc:'KCN Quang Minh, Mê Linh, Hà Nội', dg:5, don:18, gt:'180M', tt:'Đang hợp tác', ttc:'success', giao:'4 ngày', cl:5, datQc:'99,6%', loi:'0,4%', tra:'0 đợt', clgc:'Bản lề thuỷ lực đúng tải công bố, lực đóng ổn định giữa các lô', tp:[['Bộ bản lề thuỷ lực sàn (Đức)','Tải 150kg/cánh','4.850K ₫/bộ'],['Bộ khoá & tay nắm cao cấp','Khoá vân tay + tay gạt','3.200K ₫/bộ'],['Gioăng EPDM','Cuộn 100m','9.500 ₫/m'],['Ke góc & vít inox (bộ)','Bộ / 1 cánh','185K ₫/bộ']] },
  phuongdong:  { ten:'Kính Việt Nhật Hải Long',  dm:'Kính cường lực · kính hộp', lh:'A. Tâm', sdt:'024 3822 9xx',  dc:'KCN Phú Nghĩa, Chương Mỹ, Hà Nội', dg:4, don:12, gt:'120M', tt:'Đang hợp tác', ttc:'success', giao:'7 ngày', cl:4, datQc:'96,3%', loi:'2,8%', tra:'1 đợt', clgc:'Kính đạt chuẩn an toàn, thỉnh thoảng sứt mép cắt phải mài lại', tp:[['Kính hộp 5-9-5 cường lực','Tấm 1,2×2,4m','385.000 ₫/m²'],['Kính cường lực 8mm','Tấm 1,2×2,4m','295.000 ₫/m²']] },
  vuhoangminh: { ten:'Hoá chất Xây dựng Việt',   dm:'Keo & hoá chất',         lh:'A. Tánh',  sdt:'0777 565 677',  dc:'Q. Hà Đông, Hà Nội',         dg:4, don:9,  gt:'96M',  tt:'Đang hợp tác', ttc:'success', giao:'5 ngày', cl:4, datQc:'97,4%', loi:'1,9%', tra:'1 đợt', clgc:'Keo bám tốt, đôi lô tuýp thiếu định lượng ±5%', tp:[['Keo silicon trung tính','Tuýp 300ml','62.000 ₫/tuýp'],['Keo kết cấu structural','Tuýp 300ml','128.000 ₫/tuýp']] },
  avery:       { ten:'Bao bì Phú Mỹ',            dm:'Bao bì đóng kiện',       lh:'C. Hiền',  sdt:'0934 047 568',  dc:'KCN Phú Nghĩa, Chương Mỹ, Hà Nội', dg:5, don:7,  gt:'72M',  tt:'Đang hợp tác', ttc:'success', giao:'6 ngày', cl:5, datQc:'99,1%', loi:'0,6%', tra:'0 đợt', clgc:'Xốp và kiện gỗ chắc, cửa giao tới công trình không xước', tp:[['Xốp + kiện gỗ đóng cửa','Bộ / 1 bộ cửa','145.000 ₫/kiện'],['Màng bảo vệ bề mặt nhôm','Cuộn 1m×200m','3.000.000 ₫/cuộn'],['Băng keo & dây đai đóng kiện','Bộ đóng kiện','38.000 ₫/kiện']] },
  adong:       { ten:'Sơn tĩnh điện Á Đông',     dm:'Sơn tĩnh điện & vân gỗ', lh:'A. Quang', sdt:'024 3568 4xx',  dc:'CCN Thanh Oai, Hà Nội',      dg:4, don:11, gt:'132M', tt:'Đang hợp tác', ttc:'success', giao:'6 ngày', cl:4, datQc:'96,8%', loi:'2,4%', tra:'1 đợt', clgc:'Màu vân gỗ đều giữa các lô, đôi đợt độ bám cross-cut chưa đạt', tp:[['Bột sơn tĩnh điện ghi xám','Thùng 20kg','128.000 ₫/kg'],['Film vân gỗ trắc (chuyển nhiệt)','Cuộn 1,2m','2.400.000 ₫/cuộn'],['Bột sơn tĩnh điện trắng sứ','Thùng 20kg','122.000 ₫/kg']] },
  hungvuong:   { ten:'Cơ khí WEIKE Việt Nam',    dm:'Máy & phụ tùng',         lh:'A. Dũng',  sdt:'024 3866 7xx',  dc:'KCN Quang Minh, Mê Linh, Hà Nội', dg:3, don:8,  gt:'45M',  tt:'Giao trễ 2 lần', ttc:'yellow', giao:'21 ngày', cl:3, datQc:'92,0%', loi:'5,4%', tra:'3 đợt', clgc:'Vài đợt lưỡi cắt mài chưa đạt / dao phay sai cốt, phải đổi lại', tp:[['Lưỡi cắt nhôm Ø500 máy CAT-01','Linh kiện','1.850K ₫/cái'],['Dao phay đố máy CNC-21','Linh kiện','980K ₫/cái']] },
};

/* Sinh đủ số đợt cung cấp đúng bằng "số đơn 6T" (n.don) của mỗi NCC — deterministic */
window.NCC_PO = (function () {
  var PO_BASE = { tanmai:248, baibang:220, mucvn:196, phuongdong:172, vuhoangminh:148, avery:128, adong:112, hungvuong:96 };
  var QTY = { 'kg':[320,480,220,400,280,350], 'tuýp':[80,150,220,110,180,130], 'bộ':[2,4,1,6,3], 'm²':[28,42,18,35,24], 'cái':[4,6,2,8,3], 'm':[600,1200,800,1000], 'kiện':[40,90,60,120,75], 'cuộn':[2,4,3,5,2] };
  var APX = { 'kg':80000, 'tuýp':62000, 'bộ':500000, 'm²':340000, 'cái':600000, 'm':9500, 'kiện':145000, 'cuộn':3000000 };
  function pad(n) { return 'PO-' + String(n).padStart(4, '0'); }
  function fd(d) { return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0'); }
  function fdy(d) { return fd(d) + '/' + d.getFullYear(); }
  function vnd(n) { return Math.round(n).toLocaleString('vi-VN') + '₫'; }
  function unitOf(s) { var p = String(s).split('/'); return p[p.length - 1].trim(); }
  var base = new Date(2026, 4, 18), DAY = 86400000, out = {};
  Object.keys(NCC).forEach(function (key) {
    var n = NCC[key], count = n.don || 0, lead = parseInt(n.giao) || 7;
    var step = n.dg >= 5 ? 12 : (n.dg === 4 ? 6 : 3), prods = n.tp, arr = [];
    for (var i = 0; i < count; i++) {
      var p = prods[i % prods.length], unit = unitOf(p[2]);
      var ql = QTY[unit] || [10], qty = ql[i % ql.length];
      var dayOff = Math.round(i * 160 / Math.max(1, count - 1)) + (i ? 2 : 0);
      var order = new Date(base.getTime() - dayOff * DAY);
      var han = new Date(order.getTime() + lead * DAY);
      var pending = (i === 0 && (key === 'mucvn' || key === 'hungvuong'));
      var late = !pending && (i % step === step - 1), lateN = 2 + (i % 3);
      var giao = pending ? null : new Date(han.getTime() + (late ? lateN : -(i % 2)) * DAY);
      arr.push({
        po: pad(PO_BASE[key] - i), ngay: fdy(order), sp: p[0],
        sl: qty.toLocaleString('vi-VN') + ' ' + unit, gt: vnd(qty * (APX[unit] || 100000)),
        han: fd(han), giao: pending ? '—' : fd(giao),
        tt: pending ? 'Đang giao' : (late ? ('Trễ ' + lateN + ' ngày') : 'Đúng hạn'),
        ttc: pending ? 'blue' : (late ? 'danger' : 'success')
      });
    }
    out[key] = arr;
  });
  return out;
})();

function nccStars(n) { return '<span style="color:var(--amber)">' + '★'.repeat(n) + '☆'.repeat(5 - n) + '</span>'; }
window.nccStars = nccStars;

function ensureNccCss() {
  if (document.getElementById('nc-drawer-css')) return;
  var s = document.createElement('style');
  s.id = 'nc-drawer-css';
  s.textContent =
    '.nc-overlay{position:fixed;inset:0;background:rgba(20,19,15,.42);backdrop-filter:blur(2px);z-index:950;opacity:0;animation:ncov 180ms ease forwards}' +
    '@keyframes ncov{to{opacity:1}}' +
    '.nc-overlay.leaving{animation:ncov-out 200ms ease forwards}' +
    '@keyframes ncov-out{to{opacity:0}}' +
    '.nc-drawer{position:fixed;top:0;right:0;height:100%;width:820px;max-width:96vw;background:var(--paper);display:flex;flex-direction:column;box-shadow:-16px 0 48px rgba(20,19,15,.22);transform:translateX(100%);animation:ncdr 260ms cubic-bezier(.2,.8,.2,1) forwards}' +
    '@keyframes ncdr{to{transform:translateX(0)}}' +
    '.nc-overlay.leaving .nc-drawer{animation:ncdr-out 200ms ease forwards}' +
    '@keyframes ncdr-out{to{transform:translateX(100%)}}' +
    '.nc-head{background:var(--ink);color:var(--paper);padding:20px 22px;position:relative;flex-shrink:0}' +
    '.nc-head .nc-cat{font-family:var(--ff-mono);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--rust-2)}' +
    '.nc-head h3{font-size:19px;font-weight:600;color:var(--paper);margin-top:6px}' +
    '.nc-head .nc-sub{font-size:12px;color:rgba(245,241,232,.6);margin-top:5px}' +
    '.nc-head .nc-close{position:absolute;top:14px;right:14px;width:30px;height:30px;border:0;border-radius:6px;background:rgba(245,241,232,.1);color:var(--paper);display:inline-flex;align-items:center;justify-content:center;cursor:pointer}' +
    '.nc-tabs{display:flex;gap:2px;padding:0 22px;background:var(--paper);border-bottom:1px solid var(--rule);flex-shrink:0}' +
    '.nc-tab{padding:12px 14px;font-family:var(--ff-sans);font-size:12.5px;font-weight:500;color:var(--ash);background:transparent;border:0;border-bottom:2px solid transparent;margin-bottom:-1px;cursor:pointer;transition:color 140ms ease,border-color 140ms ease}' +
    '.nc-tab:hover{color:var(--ink)}' +
    '.nc-tab.active{color:var(--ink);border-bottom-color:var(--rust);font-weight:600}' +
    '.nc-body{flex:1;overflow-y:auto;padding:18px 22px}' +
    '.nc-sec{margin-bottom:18px}' +
    '.nc-sec-h{font-family:var(--ff-mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash);margin-bottom:10px;display:flex;align-items:center;gap:6px}' +
    '.nc-kv{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px 16px}' +
    '.nc-kv .kl{font-size:11px;color:var(--ash)}' +
    '.nc-kv .kv{font-size:13.5px;color:var(--ink);font-weight:600;margin-top:2px}' +
    '.nc-spec{width:100%;border-collapse:separate;border-spacing:0;table-layout:fixed;margin-top:2px;background:#fff;border:1px solid var(--rule);border-radius:9px;overflow:hidden}' +
    '.nc-spec td{border-bottom:1px solid var(--rule-soft);border-right:1px solid var(--rule-soft);padding:10px 13px;font-size:13px;vertical-align:middle}' +
    '.nc-spec tr:last-child td{border-bottom:none}' +
    '.nc-spec td:last-child{border-right:none}' +
    '.nc-spec .sl{background:var(--canvas);color:var(--ash);width:148px;font-weight:500;white-space:nowrap;font-size:11.5px;letter-spacing:.01em}' +
    '.nc-spec .sv{color:var(--ink);font-weight:600}' +
    '.nc-qbar{height:8px;border-radius:5px;background:var(--rule-soft);overflow:hidden;min-width:90px;flex:1}' +
    '.nc-qbar>i{display:block;height:100%;border-radius:5px}' +
    '.nc-foot{padding:14px 22px;border-top:1px solid var(--rule);background:var(--canvas);display:flex;gap:8px;flex-shrink:0}' +
    '.nc-foot .btn{flex:1;justify-content:center}';
  document.head.appendChild(s);
}

function openNCC(k) {
  ensureNccCss();
  var n = NCC[k]; if (!n) return;
  var tpRows = n.tp.map(function (t) { return '<tr><td><b>' + t[0] + '</b></td><td>' + t[1] + '</td><td class="num"><b>' + t[2] + '</b></td></tr>'; }).join('');
  var pos = NCC_PO[k] || [];
  var done = pos.filter(function (p) { return p.giao !== '—'; });
  var onTime = done.filter(function (p) { return p.ttc === 'success'; }).length;
  var late = done.filter(function (p) { return p.ttc === 'danger'; }).length;
  var rate = done.length ? Math.round(onTime / done.length * 100) : 0;
  // Điểm & nhãn chất lượng sản phẩm
  var cl = n.cl || n.dg || 0;
  var qDat = parseFloat(String(n.datQc).replace(',', '.')) || 0;
  var qLoi = parseFloat(String(n.loi).replace(',', '.')) || 0;
  var qScore = Math.round(cl / 5 * 100 * 0.5 + qDat * 0.5);
  var qColor = qScore >= 90 ? 'var(--moss)' : qScore >= 75 ? 'var(--amber)' : 'var(--signal)';
  var qLabel = cl >= 5 ? 'Xuất sắc' : cl >= 4 ? 'Tốt' : cl >= 3 ? 'Cần cải thiện' : 'Kém';
  var loiColor = qLoi <= 2 ? 'var(--moss)' : qLoi <= 4 ? 'var(--amber)' : 'var(--signal)';
  var poRows = pos.length ? pos.map(function (p) {
    return '<tr><td><b>' + p.po + '</b></td><td>' + p.ngay + '</td><td>' + p.sp + '</td><td class="num">' + p.sl + '</td><td class="num"><b>' + p.gt + '</b></td><td>' + p.han + '</td><td>' + p.giao + '</td><td><span class="badge badge-' + p.ttc + '">' + p.tt + '</span></td></tr>';
  }).join('') : '<tr><td colspan="8" style="text-align:center;color:var(--ash);padding:20px">Chưa có lịch sử mua hàng.</td></tr>';
  var ov = document.createElement('div');
  ov.className = 'nc-overlay';
  ov.innerHTML = '<div class="nc-drawer" role="dialog" aria-modal="true">' +
    '<div class="nc-head">' +
      '<div class="nc-cat">' + n.dm + '</div>' +
      '<h3>' + n.ten + '</h3>' +
      '<div class="nc-sub">' + nccStars(n.dg) + ' · ' + n.don + ' đơn / 6 tháng · giá trị ' + n.gt + '</div>' +
      '<button class="nc-close" data-nc-close data-no-interact="true"><i data-lucide="x" style="width:18px;height:18px"></i></button>' +
    '</div>' +
    '<div class="nc-tabs">' +
      '<button class="nc-tab active" data-nctab2="info" data-no-interact="true">Thông tin &amp; sản phẩm</button>' +
      '<button class="nc-tab" data-nctab2="history" data-no-interact="true">Lịch sử mua hàng</button>' +
    '</div>' +
    '<div class="nc-body">' +
      '<div data-ncpane2="info">' +
        '<div class="nc-sec"><div class="nc-sec-h"><i data-lucide="contact" style="width:13px;height:13px"></i> Thông tin liên hệ</div>' +
          '<table class="nc-spec"><tbody>' +
            '<tr><td class="sl">Người liên hệ</td><td class="sv">' + n.lh + '</td><td class="sl">Điện thoại</td><td class="sv">' + n.sdt + '</td></tr>' +
            '<tr><td class="sl">Địa chỉ</td><td class="sv">' + n.dc + '</td><td class="sl">Danh mục cung cấp</td><td class="sv">' + n.dm + '</td></tr>' +
            '<tr><td class="sl">Thời gian giao</td><td class="sv">' + n.giao + '</td><td class="sl">Trạng thái</td><td class="sv"><span class="badge badge-' + n.ttc + '">' + n.tt + '</span></td></tr>' +
          '</tbody></table></div>' +
        '<div class="nc-sec"><div class="nc-sec-h"><i data-lucide="truck" style="width:13px;height:13px"></i> Hiệu suất giao hàng</div>' +
          '<table class="nc-spec"><tbody>' +
            '<tr><td class="sl">Số đợt cung cấp</td><td class="sv">' + pos.length + ' đợt</td><td class="sl">Giao đúng hạn</td><td class="sv" style="color:var(--moss)">' + onTime + '/' + done.length + ' · ' + rate + '%</td></tr>' +
            '<tr><td class="sl">Giao trễ</td><td class="sv" style="color:' + (late ? 'var(--signal)' : 'var(--ink)') + '">' + late + ' đợt</td><td class="sl">Đánh giá giao hàng</td><td class="sv">' + nccStars(n.dg) + '</td></tr>' +
          '</tbody></table></div>' +
        '<div class="nc-sec"><div class="nc-sec-h"><i data-lucide="award" style="width:13px;height:13px"></i> Đánh giá chất lượng sản phẩm</div>' +
          '<table class="nc-spec"><tbody>' +
            '<tr><td class="sl">Chất lượng sản phẩm</td><td class="sv">' + nccStars(cl) + ' <span class="t-caption" style="color:' + qColor + '">' + qLabel + '</span></td><td class="sl">Tỷ lệ đạt QC khi nhập</td><td class="sv" style="color:var(--moss)">' + n.datQc + '</td></tr>' +
            '<tr><td class="sl">Tỷ lệ lỗi / khiếu nại</td><td class="sv" style="color:' + loiColor + '">' + n.loi + '</td><td class="sl">Số đợt trả / đổi hàng</td><td class="sv">' + n.tra + '</td></tr>' +
            '<tr><td class="sl">Điểm chất lượng</td><td class="sv" colspan="3"><div style="display:flex;align-items:center;gap:10px"><div class="nc-qbar"><i style="width:' + qScore + '%;background:' + qColor + '"></i></div><span style="font-weight:700;color:' + qColor + '">' + qScore + '/100</span></div></td></tr>' +
            (n.clgc ? '<tr><td class="sl">Nhận xét</td><td class="sv" colspan="3" style="font-weight:500">' + n.clgc + '</td></tr>' : '') +
          '</tbody></table></div>' +
        '<div class="nc-sec"><div class="nc-sec-h"><i data-lucide="tags" style="width:13px;height:13px"></i> Sản phẩm cung cấp &amp; bảng giá</div>' +
          '<div class="table-wrap" style="border:none"><table class="tbl" style="min-width:0">' +
            '<thead><tr><th>Sản phẩm</th><th>Quy cách</th><th class="num">Đơn giá</th></tr></thead>' +
            '<tbody>' + tpRows + '</tbody></table></div></div>' +
      '</div>' +
      '<div data-ncpane2="history" style="display:none">' +
        '<div class="nc-sec"><div class="nc-sec-h"><i data-lucide="history" style="width:13px;height:13px"></i> Các đợt cung cấp (PO)</div>' +
          '<div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">' +
            '<span class="badge badge-blue">' + pos.length + ' đợt</span>' +
            '<span class="badge badge-success">' + onTime + ' đúng hạn</span>' +
            (late ? '<span class="badge badge-coral">' + late + ' trễ hạn</span>' : '') +
            '<span class="badge badge-' + (rate >= 90 ? 'success' : rate >= 70 ? 'yellow' : 'coral') + '">Đúng hạn ' + rate + '%</span>' +
          '</div>' +
          '<div class="table-wrap" style="border:none"><table class="tbl" style="min-width:0">' +
            '<thead><tr><th>PO</th><th>Ngày đặt</th><th>Sản phẩm</th><th class="num">SL</th><th class="num">Giá trị</th><th>Hạn giao</th><th>Giao thực tế</th><th>Tình trạng</th></tr></thead>' +
            '<tbody>' + poRows + '</tbody></table></div></div>' +
      '</div>' +
    '</div>' +
    '<div class="nc-foot">' +
      '<a class="btn btn-secondary" href="13-mua-hang.html"><i data-lucide="file-text" style="width:14px;height:14px"></i> Tạo PO cho NCC</a>' +
      '<button class="btn btn-primary" data-toast-msg="Đã ghi nhận liên hệ với <b>' + n.ten + '</b>" data-toast-type="success"><i data-lucide="phone" style="width:14px;height:14px"></i> Liên hệ</button>' +
    '</div>' +
  '</div>';
  document.body.appendChild(ov);
  if (window.lucide) lucide.createIcons();
  ov.querySelectorAll('.nc-tab').forEach(function (t) {
    t.addEventListener('click', function () {
      ov.querySelectorAll('.nc-tab').forEach(function (x) { x.classList.remove('active'); });
      t.classList.add('active');
      var v = t.dataset.nctab2;
      ov.querySelectorAll('[data-ncpane2]').forEach(function (p) { p.style.display = (p.dataset.ncpane2 === v) ? '' : 'none'; });
      var body = ov.querySelector('.nc-body'); if (body) body.scrollTop = 0;
    });
  });
  function close() { ov.classList.add('leaving'); setTimeout(function () { ov.remove(); }, 220); }
  ov.addEventListener('click', function (e) { if (e.target === ov || e.target.closest('[data-nc-close]')) close(); });
  document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });
}
window.openNCC = openNCC;

/* Tự gắn click cho mọi dòng có [data-ncc] (gọi sau khi render bảng) */
function wireNccRows(root) {
  (root || document).querySelectorAll('[data-ncc]').forEach(function (el) {
    if (el.__nccWired) return;
    el.__nccWired = true;
    el.style.cursor = 'pointer';
    el.addEventListener('click', function (e) {
      if (e.target.closest('button, a, input')) return;
      openNCC(el.getAttribute('data-ncc'));
    });
  });
}
window.wireNccRows = wireNccRows;
