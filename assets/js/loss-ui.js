/* ============================================================
   LossUI — TẦNG HIỂN THỊ THẤT THOÁT & LÃNG PHÍ dùng chung mọi trang
   ------------------------------------------------------------
   · Chỉ báo (strip) gắn vào bất kỳ module nào → LossUI.strip(el, {module})
     hoặc khai báo HTML: <div data-loss-strip="kho"></div>
   · Bôi ĐỎ mọi con số lỗi / lãng phí → LossUI.bad(), .badMoney(), .cell()
   · Bấm vào bất kỳ điểm kém hiệu quả nào → mở danh sách BẢN GHI LIÊN QUAN
     → LossUI.drill(filter, title)  ·  HTML: data-loss-drill='{"module":"kho"}'
   · Bấm 1 bản ghi → xem chi tiết NGUYÊN NHÂN – HẬU QUẢ – HÀNH ĐỘNG
     → LossUI.record(id)            ·  HTML: data-loss-id="TT-1209-0001"
   · Bảng KẾT QUẢ SẢN XUẤT TỪNG BƯỚC → LossUI.stepTable(lsxId)
   Phụ thuộc: loss-data.js (window.LossStore), layout.js (tùy chọn).
   ============================================================ */
(function (global) {
  'use strict';
  var L = function () { return global.LossStore; };

  /* ------------------------------------------------------------------ CSS */
  var CSS = [
    /* --- số liệu bôi đỏ --- */
    '.lw-bad{color:#8a1f1f;font-weight:600;font-variant-numeric:tabular-nums}',
    '.lw-bad-cell{background:#efd5d5;color:#8a1f1f;font-weight:600}',
    '.lw-warn{color:#9c7714;font-weight:600;font-variant-numeric:tabular-nums}',
    '.lw-ok{color:#2f5d3a;font-weight:600;font-variant-numeric:tabular-nums}',
    '.lw-zero{color:#b8b2a2}',
    '.lw-chip{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:9999px;font-size:10.5px;font-weight:600;letter-spacing:.02em;white-space:nowrap}',
    '.lw-chip.bad{background:#efd5d5;color:#8a1f1f}.lw-chip.warn{background:#f0e6c4;color:#9c7714}',
    '.lw-chip.ok{background:#dde8d8;color:#1f4127}.lw-chip.info{background:#e0e5ea;color:#4a5560}',
    '.lw-chip.neutral{background:#ece7d7;color:#6b665b}',
    /* --- strip chỉ báo --- */
    '.lw-strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(168px,1fr));gap:10px;margin-bottom:14px}',
    '.lw-strip.compact{grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px}',
    '.lw-tile{position:relative;background:#fbfaf5;border:1px solid #e8e3d3;border-left:3px solid #8a1f1f;border-radius:10px;padding:10px 13px;cursor:pointer;transition:transform 120ms ease,box-shadow 120ms ease,border-color 120ms ease;text-align:left;width:100%;font-family:inherit}',
    '.lw-tile:hover{transform:translateY(-1px);box-shadow:0 4px 14px rgba(20,19,15,.09);border-color:#c5400a}',
    '.lw-tile.ok{border-left-color:#2f5d3a}.lw-tile.warn{border-left-color:#9c7714}.lw-tile.info{border-left-color:#4a5560}',
    '.lw-tile .l{display:flex;align-items:center;gap:5px;font-family:var(--ff-mono,monospace);font-size:8.8px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;color:#6b665b;margin-bottom:3px}',
    '.lw-tile .v{font-size:19px;font-weight:600;color:#8a1f1f;font-variant-numeric:tabular-nums;letter-spacing:-.02em;line-height:1.1}',
    '.lw-tile.ok .v{color:#2f5d3a}.lw-tile.warn .v{color:#9c7714}.lw-tile.info .v{color:#14130f}',
    '.lw-tile .v .u{font-size:11px;font-weight:400;color:#918b7e;margin-left:2px}',
    '.lw-tile .d{font-size:10.5px;color:#6b665b;margin-top:3px;line-height:1.35}',
    '.lw-tile .go{position:absolute;top:9px;right:10px;opacity:0;color:#c5400a;transition:opacity 120ms ease}',
    '.lw-tile:hover .go{opacity:1}',
    /* --- banner cảnh báo trong module --- */
    '.lw-banner{display:flex;align-items:flex-start;gap:11px;background:#efd5d5;border:1px solid rgba(138,31,31,.25);border-radius:10px;padding:11px 14px;margin-bottom:14px}',
    '.lw-banner i{color:#8a1f1f;flex:none;margin-top:1px}',
    '.lw-banner .tx{flex:1;font-size:12.5px;color:#5d1414;line-height:1.5}',
    '.lw-banner .tx b{color:#8a1f1f}',
    '.lw-banner button{flex:none;background:#8a1f1f;color:#f5f1e8;border:0;border-radius:8px;padding:6px 12px;font-size:11.5px;font-weight:600;cursor:pointer;font-family:inherit}',
    '.lw-banner button:hover{background:#6d1717}',
    /* --- bảng kết quả từng bước --- */
    '.lw-steps{width:100%;border-collapse:collapse;font-size:12.3px;background:#fbfaf5}',
    '.lw-steps th{font-family:var(--ff-mono,monospace);font-size:8.8px;letter-spacing:.1em;text-transform:uppercase;color:#6b665b;text-align:left;padding:8px 9px;background:#ece7d7;border-bottom:1px solid #d8d2c0;white-space:nowrap;vertical-align:bottom}',
    '.lw-steps td{padding:8px 9px;border-bottom:1px solid #efebde;vertical-align:top}',
    '.lw-steps tr:last-child td{border-bottom:0}',
    '.lw-steps tr.hot{background:#fdf4f2}',
    '.lw-steps tr.wait{opacity:.5}',
    '.lw-steps .r{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}',
    '.lw-steps .c{text-align:center}',
    '.lw-steps tbody tr:hover{background:#f3efe3}',
    '.lw-steps .stp{font-weight:600;color:#14130f}',
    '.lw-steps .btp{font-size:10.8px;color:#6b665b;margin-top:2px}',
    '.lw-steps .mono{font-family:var(--ff-mono,monospace);font-size:10px;color:#918b7e;letter-spacing:.04em}',
    '.lw-steps tfoot td{background:#ece7d7;font-weight:600;border-top:1px solid #d8d2c0;padding:9px}',
    '.lw-note{font-size:11.4px;color:#6b665b;line-height:1.45;max-width:320px}',
    '.lw-note .hl{color:#8a1f1f;font-weight:600}',
    '.lw-link{color:#c5400a;cursor:pointer;text-decoration:none;border-bottom:1px dotted rgba(197,64,10,.4)}',
    '.lw-link:hover{color:#8a2d07;border-bottom-style:solid}',
    /* --- thanh tỷ lệ đạt --- */
    '.lw-yield{display:flex;align-items:center;gap:7px;min-width:92px}',
    '.lw-yield .bar{flex:1;height:6px;border-radius:9999px;background:#efd5d5;overflow:hidden}',
    '.lw-yield .bar>i{display:block;height:100%;background:#2f5d3a;border-radius:9999px}',
    '.lw-yield .bar.bad>i{background:#8a1f1f}.lw-yield .bar.warn>i{background:#9c7714}',
    '.lw-yield .pc{font-size:11px;font-variant-numeric:tabular-nums;color:#14130f;font-weight:600;min-width:38px;text-align:right}',
    /* --- panel drill-down --- */
    '.lw-ov{position:fixed;inset:0;z-index:900;background:rgba(20,19,15,.45);backdrop-filter:blur(2px);animation:lw-fade 140ms ease}',
    '@keyframes lw-fade{from{opacity:0}to{opacity:1}}',
    '.lw-ov.leaving{animation:lw-fadeout 160ms ease forwards}',
    '@keyframes lw-fadeout{to{opacity:0}}',
    '.lw-pn{position:absolute;top:0;bottom:0;right:0;width:min(780px,96vw);display:flex;flex-direction:column;background:#f5f1e8;box-shadow:-16px 0 52px rgba(0,0,0,.34);animation:lw-slide 230ms cubic-bezier(.2,.8,.25,1)}',
    '@keyframes lw-slide{from{transform:translateX(100%)}to{transform:translateX(0)}}',
    '.lw-ov.leaving .lw-pn{animation:lw-slideout 170ms ease forwards}',
    '@keyframes lw-slideout{to{transform:translateX(100%)}}',
    '.lw-hd{padding:15px 20px 14px;background:linear-gradient(135deg,#5d1414,#8a1f1f);color:#f5f1e8;flex:none}',
    '.lw-hd .t1{display:flex;align-items:center;gap:8px;font-family:var(--ff-mono,monospace);font-size:9.2px;font-weight:600;letter-spacing:.17em;text-transform:uppercase;color:#f0c8c8}',
    '.lw-hd .x{margin-left:auto;display:flex;gap:7px}',
    '.lw-hd .xb{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;font-size:11.5px;background:rgba(245,241,232,.1);border:1px solid rgba(245,241,232,.28);border-radius:9999px;color:#f5f1e8;cursor:pointer;font-family:inherit}',
    '.lw-hd .xb:hover{background:rgba(245,241,232,.2)}',
    '.lw-hd h3{margin:9px 0 0;font-size:18.5px;font-weight:600;letter-spacing:-.01em;line-height:1.25}',
    '.lw-hd .sub{margin-top:4px;font-size:12.3px;color:#e7c3c3}',
    '.lw-sum{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:9px;margin-top:13px}',
    '.lw-sum .s{background:rgba(245,241,232,.1);border:1px solid rgba(245,241,232,.17);border-radius:8px;padding:7px 10px}',
    '.lw-sum .s span{display:block;font-family:var(--ff-mono,monospace);font-size:8.4px;letter-spacing:.12em;text-transform:uppercase;color:#e7c3c3;margin-bottom:2px}',
    '.lw-sum .s b{font-size:15px;font-weight:600;color:#fff;font-variant-numeric:tabular-nums}',
    '.lw-bd{flex:1;overflow-y:auto;padding:16px 20px 26px}',
    '.lw-sec{display:flex;align-items:center;gap:7px;margin:16px 0 9px;font-family:var(--ff-mono,monospace);font-size:9.5px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#14130f}',
    '.lw-sec:first-child{margin-top:0}',
    '.lw-sec i{color:#8a1f1f}',
    '.lw-sec::after{content:"";flex:1;height:1px;background:#d8d2c0}',
    '.lw-tbl{width:100%;border-collapse:collapse;font-size:12.2px;background:#fbfaf5;border:1px solid #e2ddd2;border-radius:9px;overflow:hidden}',
    '.lw-tbl th{font-family:var(--ff-mono,monospace);font-size:8.6px;letter-spacing:.1em;text-transform:uppercase;color:#6b665b;text-align:left;padding:7px 9px;background:#ece7d7;border-bottom:1px solid #d8d2c0}',
    '.lw-tbl td{padding:8px 9px;border-bottom:1px solid #efebde;vertical-align:top}',
    '.lw-tbl tr:last-child td{border-bottom:0}',
    '.lw-tbl tbody tr{cursor:pointer}',
    '.lw-tbl tbody tr:hover{background:#f3efe3}',
    '.lw-tbl .r{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}',
    '.lw-rank{display:flex;flex-direction:column;gap:7px}',
    '.lw-rank .rw{display:grid;grid-template-columns:1fr auto;gap:4px 10px;padding:8px 11px;background:#fbfaf5;border:1px solid #e8e3d3;border-radius:8px;cursor:pointer;transition:border-color 120ms ease}',
    '.lw-rank .rw:hover{border-color:#c5400a}',
    '.lw-rank .rw .n{font-size:12.4px;color:#14130f;font-weight:500}',
    '.lw-rank .rw .c{font-size:12.4px;font-weight:600;color:#8a1f1f;font-variant-numeric:tabular-nums}',
    '.lw-rank .rw .b{grid-column:1/-1;height:5px;border-radius:9999px;background:#ece7d7;overflow:hidden}',
    '.lw-rank .rw .b>i{display:block;height:100%;background:#8a1f1f;border-radius:9999px}',
    '.lw-rank .rw .m{grid-column:1/-1;font-size:10.6px;color:#6b665b}',
    '.lw-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}',
    '.lw-cell{background:#fbfaf5;border:1px solid #e2ddd2;border-radius:9px;padding:8px 12px}',
    '.lw-cell.wide{grid-column:1/-1}',
    '.lw-cell span{display:block;font-family:var(--ff-mono,monospace);font-size:8.6px;letter-spacing:.11em;text-transform:uppercase;color:#6b665b;margin-bottom:3px}',
    '.lw-cell b{font-size:13.2px;color:#14130f;font-weight:600;line-height:1.45;word-break:break-word}',
    '.lw-cell b.big{font-size:17px;color:#8a1f1f}',
    '.lw-cell.acc{background:#efd5d5;border-color:rgba(138,31,31,.22)}',
    '.lw-fix{background:#dde8d8;border:1px solid rgba(47,93,58,.25);border-radius:9px;padding:10px 13px;font-size:12.4px;color:#1f4127;line-height:1.55}',
    '.lw-fix b{display:block;font-family:var(--ff-mono,monospace);font-size:8.8px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:4px;color:#2f5d3a}',
    '.lw-empty{padding:26px;text-align:center;font-size:12.5px;color:#918b7e;background:#fbfaf5;border:1px dashed #d8d2c0;border-radius:9px}',
    '.lw-fbar{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:11px}',
    '.lw-fbar button{padding:5px 11px;font-size:11.4px;background:#fbfaf5;border:1px solid #d8d2c0;border-radius:9999px;color:#6b665b;cursor:pointer;font-family:inherit}',
    '.lw-fbar button.on{background:#8a1f1f;border-color:#8a1f1f;color:#f5f1e8;font-weight:600}',
    '.lw-fbar button:hover{border-color:#8a1f1f;color:#8a1f1f}',
    '.lw-fbar button.on:hover{color:#f5f1e8}',
    /* --- pareto bar dùng chung --- */
    '.lw-pareto{display:flex;flex-direction:column;gap:6px}',
    '.lw-pareto .pr{display:grid;grid-template-columns:22px 1fr 76px 52px;align-items:center;gap:9px;padding:5px 8px;border-radius:7px;cursor:pointer}',
    '.lw-pareto .pr:hover{background:#f3efe3}',
    '.lw-pareto .pr .no{font-family:var(--ff-mono,monospace);font-size:10px;color:#918b7e}',
    '.lw-pareto .pr .nm{font-size:12.2px;color:#14130f;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.lw-pareto .pr .bar{grid-column:2/3;height:5px;background:#ece7d7;border-radius:9999px;overflow:hidden;margin-top:3px}',
    '.lw-pareto .pr .bar>i{display:block;height:100%;background:#8a1f1f}',
    '.lw-pareto .pr .ct{font-size:12.2px;font-weight:600;color:#8a1f1f;text-align:right;font-variant-numeric:tabular-nums}',
    '.lw-pareto .pr .pc{font-size:10.6px;color:#6b665b;text-align:right;font-variant-numeric:tabular-nums}',
    '@media(max-width:640px){.lw-grid{grid-template-columns:1fr}.lw-pn{width:100vw}}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('lw-css')) return;
    var st = document.createElement('style'); st.id = 'lw-css'; st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* ------------------------------------------------------------ helpers */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function el(id) { return typeof id === 'string' ? document.getElementById(id) : id; }
  function icons() { if (global.lucide) try { global.lucide.createIcons(); } catch (e) {} }
  function fmt(n) { return L().fmt(n); }
  function money(n) { return L().money(n); }

  /* Số bôi đỏ nếu > 0 */
  function bad(n, unit) {
    n = Number(n) || 0;
    if (!n) return '<span class="lw-zero">0' + (unit ? ' ' + unit : '') + '</span>';
    return '<span class="lw-bad">' + fmt(n) + (unit ? ' ' + unit : '') + '</span>';
  }
  function badMoney(v) {
    v = Number(v) || 0;
    if (!v) return '<span class="lw-zero">—</span>';
    return '<span class="lw-bad">' + money(v) + '₫</span>';
  }
  function badMin(m) {
    m = Number(m) || 0;
    if (!m) return '<span class="lw-zero">0′</span>';
    var h = Math.floor(m / 60), mm = m % 60;
    return '<span class="lw-bad">' + (h ? h + 'h' + (mm ? String(mm).padStart(2, '0') : '') : m + '′') + '</span>';
  }
  function yieldBar(pct) {
    if (pct == null) return '<span class="lw-zero">—</span>';
    var cls = pct >= 98 ? '' : (pct >= 95 ? 'warn' : 'bad');
    return '<span class="lw-yield"><span class="bar ' + cls + '"><i style="width:' + Math.max(2, Math.min(100, pct)) + '%"></i></span>' +
      '<span class="pc" style="color:' + (cls === 'bad' ? '#8a1f1f' : cls === 'warn' ? '#9c7714' : '#2f5d3a') + '">' + pct.toFixed(1) + '%</span></span>';
  }
  function sevChip(s) {
    var m = { cao: ['bad', 'Nghiêm trọng'], 'trung-binh': ['warn', 'Trung bình'], thap: ['neutral', 'Nhẹ'] }[s] || ['neutral', s];
    return '<span class="lw-chip ' + m[0] + '">' + m[1] + '</span>';
  }
  function statusChip(s) {
    var m = { 'da-xu-ly': ['ok', 'Đã xử lý'], 'dang-xu-ly': ['warn', 'Đang xử lý'], moi: ['bad', 'Chưa xử lý'] }[s] || ['neutral', s];
    return '<span class="lw-chip ' + m[0] + '">' + m[1] + '</span>';
  }
  function attr(f) { return esc(JSON.stringify(f || {})); }

  /* --------------------------------------------------------- panel stack */
  var stack = [];
  function closeTop() {
    var ov = stack.pop(); if (!ov) return;
    ov.classList.add('leaving');
    setTimeout(function () { ov.remove(); }, 180);
  }
  function openPanel(html) {
    injectCSS();
    var ov = document.createElement('div');
    ov.className = 'lw-ov';
    ov.innerHTML = '<div class="lw-pn">' + html + '</div>';
    document.body.appendChild(ov);
    stack.push(ov);
    ov.addEventListener('click', function (e) {
      if (e.target === ov) return closeTop();
      if (e.target.closest('[data-lw-close]')) return closeTop();
    });
    icons();
    return ov;
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && stack.length) closeTop(); });

  /* ============================================================
     A. DRILL — danh sách bản ghi liên quan tới 1 điểm kém hiệu quả
     ============================================================ */
  function drill(f, title, opts) {
    injectCSS();
    f = f || {}; opts = opts || {};
    var S = L();
    if (f.days == null && !f.from && !f.lsxId) f.days = 30;
    var rows = S.filter(f);
    rows.sort(function (a, b) { return (b.cost || 0) - (a.cost || 0); });
    var t = S.total(f);

    var sub = [];
    if (f.module) sub.push(S.moduleOf(f.module).label);
    if (f.type) sub.push(S.typeOf(f.type).label);
    if (f.cause) sub.push(S.causeOf(f.cause).label);
    if (f.causeGroup) sub.push(S.groupOf(f.causeGroup).label);
    if (f.dept) sub.push('BP chịu trách nhiệm: ' + S.deptOf(f.dept).label);
    if (f.lsxId) sub.push('Lệnh ' + f.lsxId);
    if (f.machine) sub.push('Máy ' + f.machine);
    if (f.stepKey) sub.push('Công đoạn ' + f.stepKey);
    if (f.days) sub.push(f.days + ' ngày gần nhất');

    var head =
      '<div class="lw-hd">' +
        '<div class="t1"><i data-lucide="search-x" style="width:12px;height:12px"></i> Bản ghi liên quan · truy nguyên nguyên nhân' +
          '<span class="x">' +
            '<button class="xb" data-lw-export><i data-lucide="download" style="width:12px;height:12px"></i> Xuất Excel</button>' +
            '<button class="xb" data-lw-close><i data-lucide="x" style="width:13px;height:13px"></i> Đóng</button>' +
          '</span></div>' +
        '<h3>' + esc(title || 'Điểm kém hiệu quả') + '</h3>' +
        '<div class="sub">' + esc(sub.join(' · ') || 'Toàn nhà máy') + '</div>' +
        '<div class="lw-sum">' +
          '<div class="s"><span>Thiệt hại quy tiền</span><b>' + money(t.cost) + '₫</b></div>' +
          '<div class="s"><span>Số bản ghi</span><b>' + fmt(t.count) + '</b></div>' +
          '<div class="s"><span>SL phế / tái chế</span><b>' + fmt(t.scrap) + ' / ' + fmt(t.rework) + '</b></div>' +
          '<div class="s"><span>Giờ máy mất</span><b>' + S.hours(t.minutes) + 'h</b></div>' +
        '</div>' +
      '</div>';

    /* xếp hạng nguyên nhân trong phạm vi lọc */
    var par = S.pareto(f).slice(0, 6);
    var maxC = par.length ? par[0].cost : 1;
    var parHtml = par.length ? '<div class="lw-pareto">' + par.map(function (p, i) {
      var nf = JSON.parse(JSON.stringify(f)); nf.cause = p.key;
      return '<div class="pr" data-loss-drill=\'' + attr(nf) + '\' data-loss-title="' + esc(p.label) + '">' +
        '<span class="no">' + (i + 1) + '</span><span class="nm">' + esc(p.label) + '</span>' +
        '<span class="ct">' + money(p.cost) + '₫</span><span class="pc">' + p.pct + '%</span>' +
        '<span class="bar"><i style="width:' + Math.round(p.cost / maxC * 100) + '%"></i></span></div>';
    }).join('') + '</div>' : '';

    var listHtml = rows.length ? '<table class="lw-tbl"><thead><tr>' +
      '<th>Mã</th><th>Ngày / ca</th><th>Nội dung &amp; nguyên nhân</th><th class="r">SL</th><th class="r">Giờ mất</th><th class="r">Thiệt hại</th><th>Trạng thái</th>' +
      '</tr></thead><tbody>' +
      rows.slice(0, 160).map(function (r) {
        return '<tr data-loss-id="' + esc(r.id) + '">' +
          '<td><span class="mono" style="font-family:var(--ff-mono,monospace);font-size:10.4px;color:#c5400a">' + esc(r.id) + '</span></td>' +
          '<td style="white-space:nowrap;font-size:11.4px">' + esc(r.date) + '<div style="color:#918b7e;font-size:10.4px">' + esc(r.shift) + '</div></td>' +
          '<td><div style="font-weight:500">' + esc(r.title) + '</div>' +
            '<div style="font-size:10.8px;color:#6b665b;margin-top:2px">' +
              (r.lsxId ? '<b style="color:#c5400a">' + esc(r.lsxId) + '</b> · ' : '') +
              (r.stepName ? esc(r.stepName) + ' · ' : '') + esc(r.causeLabel).slice(0, 60) + '</div></td>' +
          '<td class="r">' + (r.qty ? bad(r.qty) + ' <span style="color:#918b7e;font-size:10px">' + esc(r.unit || '') + '</span>' : '<span class="lw-zero">—</span>') + '</td>' +
          '<td class="r">' + (r.minutes ? badMin(r.minutes) : '<span class="lw-zero">—</span>') + '</td>' +
          '<td class="r">' + badMoney(r.cost) + '</td>' +
          '<td>' + statusChip(r.status) + '</td></tr>';
      }).join('') + '</tbody></table>' +
      (rows.length > 160 ? '<div style="font-size:11px;color:#918b7e;margin-top:7px">Hiển thị 160/' + fmt(rows.length) + ' bản ghi — lọc hẹp hơn để xem hết.</div>' : '')
      : '<div class="lw-empty">Không có bản ghi thất thoát nào khớp bộ lọc này. 👍</div>';

    var body = '<div class="lw-bd">' +
      (parHtml ? '<div class="lw-sec"><i data-lucide="target" style="width:12px;height:12px"></i> Nguyên nhân gốc (Pareto) — bấm để lọc sâu</div>' + parHtml : '') +
      '<div class="lw-sec"><i data-lucide="list" style="width:12px;height:12px"></i> Bản ghi chi tiết (' + fmt(rows.length) + ') — bấm 1 dòng để xem nguyên nhân &amp; hành động</div>' +
      listHtml + '</div>';

    openPanel(head + body);
  }

  /* ============================================================
     B. RECORD — chi tiết 1 bản ghi thất thoát
     ============================================================ */
  function record(id) {
    injectCSS();
    var S = L(), r = S.get(id);
    if (!r) { toast('Không tìm thấy bản ghi ' + id, 'warning'); return; }
    var ty = S.typeOf(r.type), cg = S.groupOf(r.causeGroup);

    var head =
      '<div class="lw-hd">' +
        '<div class="t1"><i data-lucide="' + ty.icon + '" style="width:12px;height:12px"></i> ' + esc(ty.label) +
          '<span class="x">' +
            '<button class="xb" data-lw-print><i data-lucide="printer" style="width:12px;height:12px"></i> In biên bản</button>' +
            '<button class="xb" data-lw-close><i data-lucide="x" style="width:13px;height:13px"></i> Đóng</button>' +
          '</span></div>' +
        '<h3>' + esc(r.title) + '</h3>' +
        '<div class="sub"><b style="font-family:var(--ff-mono,monospace)">' + esc(r.id) + '</b> · ' + esc(r.date) + ' · ' + esc(r.shift) +
          ' · ' + esc(S.moduleOf(r.module).label) + '</div>' +
        '<div class="lw-sum">' +
          '<div class="s"><span>Thiệt hại</span><b>' + money(r.cost) + '₫</b></div>' +
          (r.qty ? '<div class="s"><span>Số lượng</span><b>' + fmt(r.qty) + ' ' + esc(r.unit || '') + '</b></div>' : '') +
          (r.minutes ? '<div class="s"><span>Thời gian mất</span><b>' + S.hours(r.minutes) + 'h</b></div>' : '') +
          '<div class="s"><span>Mức độ</span><b>' + (r.severity === 'cao' ? 'Nghiêm trọng' : r.severity === 'trung-binh' ? 'Trung bình' : 'Nhẹ') + '</b></div>' +
        '</div>' +
      '</div>';

    var chain = [];
    if (r.lsxId) chain.push('<a class="lw-link" href="06-lsx-phieu-cong-nghe.html?lsx=' + esc(r.lsxId) + '">' + esc(r.lsxId) + '</a>');
    if (r.machine) chain.push('<span data-loss-drill=\'' + attr({ machine: r.machine, days: 30 }) + '\' data-loss-title="Thất thoát trên máy ' + esc(r.machine) + '" class="lw-link">' + esc(r.machine) + '</span>');
    if (r.worker) chain.push('<span data-loss-drill=\'' + attr({ worker: r.worker, days: 30 }) + '\' data-loss-title="Thất thoát liên quan ' + esc(r.worker) + '" class="lw-link">' + esc(r.worker) + '</span>');

    var body = '<div class="lw-bd">' +
      '<div class="lw-sec"><i data-lucide="alert-triangle" style="width:12px;height:12px"></i> Nguyên nhân được ghi nhận</div>' +
      '<div class="lw-grid">' +
        '<div class="lw-cell wide acc"><span>Mã nguyên nhân · nhóm ' + esc(cg.label) + '</span><b>' + esc(r.causeCode) + ' — ' + esc(r.causeLabel) + '</b></div>' +
        '<div class="lw-cell wide"><span>Ghi chú hiện trường</span><b style="font-weight:400;font-size:12.6px">' + esc(r.note) + '</b></div>' +
        '<div class="lw-cell"><span>Bộ phận chịu trách nhiệm</span><b>' + esc(S.deptOf(r.dept).label) + '</b></div>' +
        '<div class="lw-cell"><span>Người ghi nhận</span><b>' + esc(r.worker || '—') + '</b></div>' +
      '</div>' +
      '<div class="lw-sec"><i data-lucide="crosshair" style="width:12px;height:12px"></i> Hậu quả &amp; quy đổi thiệt hại</div>' +
      '<div class="lw-grid">' +
        (r.qtyScrap ? '<div class="lw-cell"><span>Phế bỏ hẳn</span><b class="big">' + fmt(r.qtyScrap) + ' ' + esc(r.unit || '') + '</b></div>' : '') +
        (r.qtyRework ? '<div class="lw-cell"><span>Phải tái chế / sửa</span><b class="big">' + fmt(r.qtyRework) + ' ' + esc(r.unit || '') + '</b></div>' : '') +
        (r.minutes ? '<div class="lw-cell"><span>Thời gian lãng phí</span><b class="big">' + fmt(r.minutes) + ' phút</b></div>' : '') +
        (r.debt ? '<div class="lw-cell"><span>Dư nợ bị chiếm dụng</span><b class="big">' + money(r.debt) + '₫</b></div>' : '') +
        '<div class="lw-cell acc wide"><span>Tổng thiệt hại quy tiền</span><b class="big">' + fmt(r.cost) + '₫</b></div>' +
      '</div>' +
      '<div class="lw-sec"><i data-lucide="wrench" style="width:12px;height:12px"></i> Hành động khắc phục đề xuất</div>' +
      '<div class="lw-fix"><b>Biện pháp</b>' + esc(r.action || 'Đang phân tích') + '</div>' +
      '<div style="margin-top:10px">' + statusChip(r.status) + ' ' + sevChip(r.severity) + '</div>' +
      (r.product || r.customer || chain.length ?
        '<div class="lw-sec"><i data-lucide="link-2" style="width:12px;height:12px"></i> Truy nguyên chuỗi</div>' +
        '<div class="lw-grid">' +
          (r.product ? '<div class="lw-cell"><span>Sản phẩm</span><b>' + esc(r.product) + '</b></div>' : '') +
          (r.customer ? '<div class="lw-cell"><span>Khách hàng</span><b>' + esc(r.customer) + '</b></div>' : '') +
          (r.stepName ? '<div class="lw-cell"><span>Công đoạn</span><b>' + esc(r.stepName) + '</b></div>' : '') +
          (r.btpName ? '<div class="lw-cell"><span>Bán thành phẩm</span><b>' + esc(r.btpName) + '</b></div>' : '') +
          (r.supplier ? '<div class="lw-cell"><span>Nhà cung cấp</span><b>' + esc(r.supplier) + '</b></div>' : '') +
          (r.warehouse ? '<div class="lw-cell"><span>Kho</span><b>' + esc(r.warehouse) + '</b></div>' : '') +
          (chain.length ? '<div class="lw-cell wide"><span>Liên kết</span><b style="font-weight:400">' + chain.join(' · ') + '</b></div>' : '') +
        '</div>' : '') +
      '<div class="lw-sec"><i data-lucide="layers" style="width:12px;height:12px"></i> Cùng nguyên nhân trong 30 ngày</div>' +
      (function () {
        var same = S.filter({ cause: r.causeCode, days: 30 });
        var tt = same.reduce(function (a, b) { return a + b.cost; }, 0);
        return '<div class="lw-rank"><div class="rw" data-loss-drill=\'' + attr({ cause: r.causeCode, days: 30 }) +
          '\' data-loss-title="' + esc(r.causeLabel) + '"><span class="n">' + esc(r.causeLabel) + '</span>' +
          '<span class="c">' + money(tt) + '₫</span><span class="m">' + same.length + ' lần xảy ra · bấm để xem toàn bộ</span></div></div>';
      })() +
    '</div>';

    openPanel(head + body);
  }

  /* ============================================================
     C. STRIP — chỉ báo thất thoát gắn vào mọi module
     ============================================================ */
  var STRIP_PRESETS = {
    'san-xuat': function (S, d) {
      var st = S.stepStats(d), t = S.total({ module: 'san-xuat', days: d });
      return [
        { l: 'Tỷ lệ đạt (Yield)', v: st.yieldPct + '<span class="u">%</span>', cls: st.yieldPct >= 98 ? 'ok' : (st.yieldPct >= 96 ? 'warn' : ''), d: 'Đạt ' + fmt(st.ok) + ' / lỗi ' + fmt(st.ng) + ' sp', f: { module: 'san-xuat', days: d }, t: 'Sản lượng lỗi toàn xưởng' },
        { l: 'SL lỗi & phế', v: fmt(st.ng), cls: '', d: 'Phế ' + fmt(t.scrap) + ' · tái chế ' + fmt(t.rework), f: { module: 'san-xuat', types: ['phe', 'tai-che'], days: d }, t: 'Hàng lỗi theo công đoạn' },
        { l: 'Giờ máy lãng phí', v: S.hours(st.wasteMin) + '<span class="u">h</span>', cls: '', d: 'Trên tổng ' + S.hours(st.actualMin) + 'h chạy máy', f: { module: 'san-xuat', types: ['dung-may', 'cho-viec', 'setup-vuot'], days: d }, t: 'Thời gian lãng phí trong sản xuất' },
        { l: 'OEE', v: st.oee + '<span class="u">%</span>', cls: st.oee >= 75 ? 'ok' : (st.oee >= 60 ? 'warn' : ''), d: 'A ' + st.availability + '% · P ' + st.performance + '% · Q ' + st.quality + '%', f: { module: 'san-xuat', days: d }, t: 'Phân rã OEE — điểm kém hiệu quả' },
        { l: 'Thiệt hại quy tiền', v: money(t.cost) + '<span class="u">₫</span>', cls: '', d: t.count + ' bản ghi có nguyên nhân', f: { module: 'san-xuat', days: d }, t: 'Thiệt hại sản xuất' }
      ];
    },
    kho: function (S, d) {
      var t = S.total({ module: 'kho', days: d });
      var hao = S.total({ module: 'kho', type: 'hao-vuot-dm', days: d });
      var kk = S.total({ module: 'kho', type: 'chenh-kiem-ke', days: d });
      var tc = S.total({ module: 'kho', types: ['ton-chet', 'het-han'], days: d });
      return [
        { l: 'Hao vượt định mức', v: money(hao.cost) + '<span class="u">₫</span>', d: hao.count + ' lần cấp phát vượt BOM', f: { module: 'kho', type: 'hao-vuot-dm', days: d }, t: 'Hao vật tư vượt định mức' },
        { l: 'Lệch kiểm kê', v: money(kk.cost) + '<span class="u">₫</span>', d: kk.count + ' mã lệch sổ sách/thực tế', f: { module: 'kho', type: 'chenh-kiem-ke', days: d }, t: 'Chênh lệch kiểm kê kho' },
        { l: 'Tồn chết & hết hạn', v: money(tc.cost) + '<span class="u">₫</span>', d: tc.count + ' mã nằm kho quá lâu', f: { module: 'kho', types: ['ton-chet', 'het-han'], days: d }, t: 'Tồn chết / vật tư hết hạn' },
        { l: 'Tổng thất thoát kho', v: money(t.cost) + '<span class="u">₫</span>', d: t.count + ' bản ghi · ' + d + ' ngày', f: { module: 'kho', days: d }, t: 'Thất thoát tại kho' }
      ];
    },
    'may-moc': function (S, d) {
      var t = S.total({ module: 'may-moc', days: d });
      var dm = S.total({ type: 'dung-may', days: d });
      var sc = S.total({ type: 'sua-chua', days: d });
      var top = S.byMachineAgg({ module: 'may-moc', days: d })[0];
      return [
        { l: 'Giờ dừng máy', v: S.hours(dm.minutes) + '<span class="u">h</span>', d: dm.count + ' lần dừng ngoài kế hoạch', f: { type: 'dung-may', days: d }, t: 'Dừng máy ngoài kế hoạch' },
        { l: 'Chi phí sửa đột xuất', v: money(sc.cost) + '<span class="u">₫</span>', d: sc.count + ' lần hỏng bất ngờ', f: { type: 'sua-chua', days: d }, t: 'Sửa chữa đột xuất' },
        { l: 'Máy tổn thất nhất', v: top ? esc(String(top.key).split('·')[0].trim()) : '—', cls: 'warn', d: top ? money(top.cost) + '₫ · ' + top.count + ' sự cố' : '', f: top ? { machine: top.key, days: d } : { module: 'may-moc', days: d }, t: top ? 'Thất thoát trên ' + top.key : 'Thiết bị' },
        { l: 'Tổng thiệt hại TB', v: money(t.cost) + '<span class="u">₫</span>', d: t.count + ' bản ghi · ' + d + ' ngày', f: { module: 'may-moc', days: d }, t: 'Thất thoát thiết bị' }
      ];
    },
    'mua-hang': function (S, d) {
      var t = S.total({ module: 'mua-hang', days: d });
      var cho = S.total({ cause: 'TG-CHOVT', days: d });
      return [
        { l: 'Đội giá do mua gấp', v: money(t.cost) + '<span class="u">₫</span>', d: t.count + ' đơn đặt khẩn', f: { module: 'mua-hang', days: d }, t: 'Chi phí mua gấp' },
        { l: 'Giờ SX chờ vật tư', v: S.hours(cho.minutes) + '<span class="u">h</span>', d: cho.count + ' lần dừng chờ NVL', f: { cause: 'TG-CHOVT', days: d }, t: 'Sản xuất chờ vật tư' },
        { l: 'Thiệt hại kéo theo', v: money(t.cost + cho.cost) + '<span class="u">₫</span>', d: 'Mua gấp + dừng chờ', f: { causeGroup: 'quan-ly', days: d }, t: 'Thiệt hại do kế hoạch vật tư' }
      ];
    },
    'kinh-doanh': function (S, d) {
      var tr = S.total({ type: 'tra-hang', days: d });
      var gt = S.total({ type: 'giao-tre', days: d });
      return [
        { l: 'Hàng bị trả lại', v: money(tr.cost) + '<span class="u">₫</span>', d: fmt(tr.qty) + ' sp · ' + tr.count + ' vụ khiếu nại', f: { type: 'tra-hang', days: d }, t: 'Khách trả hàng' },
        { l: 'Phạt giao trễ', v: money(gt.cost) + '<span class="u">₫</span>', d: gt.count + ' hợp đồng bị phạt', f: { type: 'giao-tre', days: d }, t: 'Phạt / chiết khấu do giao trễ' },
        { l: 'Tổng mất doanh thu', v: money(tr.cost + gt.cost) + '<span class="u">₫</span>', d: 'Trả hàng + phạt hợp đồng', f: { module: 'kinh-doanh', days: d }, t: 'Thất thoát phía khách hàng' }
      ];
    },
    'nhan-su': function (S, d) {
      var ck = S.total({ type: 'cong-khong', days: d });
      var ot = S.total({ type: 'lam-them', days: d });
      return [
        { l: 'Giờ công chờ việc', v: fmt(ck.qty) + '<span class="u">h</span>', d: ck.count + ' lượt tổ đứng chờ', f: { type: 'cong-khong', days: d }, t: 'Công lao động không hiệu quả' },
        { l: 'Tăng ca bù lỗi', v: fmt(ot.qty) + '<span class="u">h</span>', d: money(ot.cost) + '₫ lương 150%', f: { type: 'lam-them', days: d }, t: 'Tăng ca bù sản lượng hỏng' },
        { l: 'Chi phí nhân công phí', v: money(ck.cost + ot.cost) + '<span class="u">₫</span>', d: 'Chờ việc + tăng ca bù', f: { module: 'nhan-su', days: d }, t: 'Lãng phí nhân công' }
      ];
    },
    'ke-toan': function (S, d) {
      var t = S.total({ module: 'ke-toan', days: d });
      var all = S.total({ days: d });
      return [
        { l: 'Vốn bị chiếm dụng', v: money(t.debt) + '<span class="u">₫</span>', d: t.count + ' khách quá hạn', f: { module: 'ke-toan', days: d }, t: 'Công nợ quá hạn' },
        { l: 'Chi phí vốn phát sinh', v: money(t.cost) + '<span class="u">₫</span>', d: 'Lãi vay bù đắp dòng tiền', f: { module: 'ke-toan', days: d }, t: 'Chi phí công nợ quá hạn' },
        { l: 'Tổng thiệt hại toàn NM', v: money(all.cost) + '<span class="u">₫</span>', d: 'Cần hạch toán vào giá thành', f: { days: d }, t: 'Toàn bộ thất thoát' }
      ];
    }
  };

  function stripData(module, days) {
    var S = L(); days = days || 30;
    var fn = STRIP_PRESETS[module];
    if (fn) return fn(S, days);
    var t = S.total({ module: module, days: days });
    var top = S.byCauseAgg({ module: module, days: days })[0];
    return [
      { l: 'Thiệt hại ghi nhận', v: money(t.cost) + '<span class="u">₫</span>', d: t.count + ' bản ghi · ' + days + ' ngày', f: { module: module, days: days }, t: 'Thất thoát' },
      { l: 'Nguyên nhân hàng đầu', v: top ? money(top.cost) + '<span class="u">₫</span>' : '—', cls: 'warn', d: top ? esc(top.label).slice(0, 52) : 'Không có', f: top ? { module: module, cause: top.key, days: days } : { module: module }, t: top ? top.label : 'Nguyên nhân' }
    ];
  }

  function strip(target, opts) {
    injectCSS();
    opts = opts || {};
    var node = el(target); if (!node) return;
    var module = opts.module || node.getAttribute('data-loss-strip') || 'san-xuat';
    var days = opts.days || +(node.getAttribute('data-loss-days') || 30);
    var tiles = opts.tiles || stripData(module, days);
    node.className = 'lw-strip' + (opts.compact ? ' compact' : '') + (node.className.indexOf('lw-strip') >= 0 ? '' : '');
    node.innerHTML = tiles.map(function (t) {
      return '<button type="button" class="lw-tile ' + (t.cls || '') + '" data-no-interact="true" ' +
        'data-loss-drill=\'' + attr(t.f) + '\' data-loss-title="' + esc(t.t || t.l) + '">' +
        '<i data-lucide="arrow-up-right" class="go" style="width:13px;height:13px"></i>' +
        '<div class="l"><i data-lucide="alert-octagon" style="width:10px;height:10px"></i>' + esc(t.l) + '</div>' +
        '<div class="v">' + t.v + '</div>' +
        '<div class="d">' + (t.d || '') + '</div></button>';
    }).join('');
    icons();
  }

  /* Banner cảnh báo gọn cho đầu trang module */
  function banner(target, module, days) {
    injectCSS();
    var node = el(target); if (!node) return;
    var S = L(); days = days || 30;
    var s = S.moduleSummary(module, days);
    if (!s.count) { node.innerHTML = ''; return; }
    node.innerHTML = '<div class="lw-banner">' +
      '<i data-lucide="alert-triangle" style="width:17px;height:17px"></i>' +
      '<div class="tx">Phân hệ này đang ghi nhận <b>' + fmt(s.count) + ' bản ghi thất thoát / lãng phí</b> trong ' + days + ' ngày, ' +
      'quy tiền <b>' + money(s.cost) + '₫</b>' + (s.minutes ? ' · mất <b>' + S.hours(s.minutes) + ' giờ</b>' : '') +
      (s.topCause ? '. Nguyên nhân lớn nhất: <b>' + esc(s.topCause.label) + '</b> (' + money(s.topCause.cost) + '₫).' : '.') + '</div>' +
      '<button data-loss-drill=\'' + attr({ module: module, days: days }) + '\' data-loss-title="Thất thoát — ' + esc(S.moduleOf(module).label) + '">Xem bản ghi</button>' +
      '</div>';
    icons();
  }

  /* ============================================================
     D. BẢNG KẾT QUẢ SẢN XUẤT TỪNG BƯỚC
     ============================================================ */
  function stepTable(lsxId, opts) {
    var S = L(); opts = opts || {};
    var steps = S.steps(lsxId);
    if (!steps.length) return '<div class="lw-empty">Lệnh này chưa có dữ liệu sản xuất theo bước.</div>';
    var tOk = 0, tNg = 0, tScrap = 0, tRw = 0, tWaste = 0, tCost = 0, tPlan = 0, tAct = 0;
    var rows = steps.map(function (s) {
      if (s.status !== 'cho') { tOk += s.qtyOk; tNg += s.qtyNg; tScrap += s.qtyScrap; tRw += s.qtyRework; tWaste += s.wasteMin; tCost += s.lossCost; tPlan += s.planMin; tAct += s.actualMin; }
      var hot = s.qtyNg > 0 && (s.yieldPct != null && s.yieldPct < 97) || s.wasteMin > 90;
      var cls = s.status === 'cho' ? 'wait' : (hot ? 'hot' : '');
      var f = { lsxId: lsxId, stepKey: s.key };
      return '<tr class="' + cls + '" data-loss-drill=\'' + attr(f) + '\' data-loss-title="' + esc(s.name + ' — ' + lsxId) + '" style="cursor:pointer">' +
        '<td class="c mono">' + s.seq + '</td>' +
        '<td><div class="stp">' + esc(s.name) + '</div>' +
          '<div class="btp"><span class="mono">' + esc(s.btpCode) + '</span> ' + esc(s.btpName) + '</div></td>' +
        '<td style="font-size:11.3px;white-space:nowrap">' + esc(String(s.machine).split('·')[0].trim()) +
          '<div style="color:#918b7e;font-size:10.4px">' + esc(s.worker) + ' · ' + esc(s.shift.split('(')[0].trim()) + '</div></td>' +
        '<td class="r">' + (s.status === 'cho' ? '<span class="lw-zero">—</span>' : fmt(s.qtyIn) + ' <span style="color:#918b7e;font-size:10px">' + esc(s.unit) + '</span>') + '</td>' +
        '<td class="r">' + (s.status === 'cho' ? '<span class="lw-zero">—</span>' : '<span class="lw-ok">' + fmt(s.qtyOk) + '</span>') + '</td>' +
        '<td class="r">' + (s.status === 'cho' ? '<span class="lw-zero">—</span>' : bad(s.qtyNg)) + '</td>' +
        '<td class="r">' + (s.status === 'cho' ? '<span class="lw-zero">—</span>' : bad(s.qtyScrap)) + '</td>' +
        '<td class="r">' + (s.status === 'cho' ? '<span class="lw-zero">—</span>' : bad(s.qtyRework)) + '</td>' +
        '<td>' + (s.status === 'cho' ? '<span class="lw-zero">—</span>' : yieldBar(s.yieldPct)) + '</td>' +
        '<td class="r" style="font-size:11.3px">' + (s.status === 'cho' ? '<span class="lw-zero">—</span>' : s.planMin + '′ / <b>' + s.actualMin + '′</b>') + '</td>' +
        '<td class="r">' + (s.status === 'cho' ? '<span class="lw-zero">—</span>' : badMin(s.wasteMin)) + '</td>' +
        '<td class="r">' + (s.status === 'cho' ? '<span class="lw-zero">—</span>' : badMoney(s.lossCost)) + '</td>' +
        '<td><div class="lw-note">' + (s.status === 'cho' ? '<span class="lw-zero">Chưa chạy</span>' : noteHtml(s)) + '</div></td>' +
      '</tr>';
    }).join('');

    return '<div style="overflow-x:auto"><table class="lw-steps">' +
      '<thead><tr>' +
        '<th class="c">#</th><th>Công đoạn / Bán thành phẩm</th><th>Máy · Thợ · Ca</th>' +
        '<th class="r">SL vào</th><th class="r">Đạt</th><th class="r">Lỗi</th><th class="r">Phế</th><th class="r">Tái chế</th>' +
        '<th>Tỷ lệ đạt</th><th class="r">KH / TT (phút)</th><th class="r">Giờ lãng phí</th><th class="r">Thiệt hại</th>' +
        '<th>Ghi chú nguyên nhân</th>' +
      '</tr></thead><tbody>' + rows + '</tbody>' +
      '<tfoot><tr>' +
        '<td colspan="4" style="text-align:right">TỔNG CỘNG LỆNH ' + esc(lsxId) + '</td>' +
        '<td class="r"><span class="lw-ok">' + fmt(tOk) + '</span></td>' +
        '<td class="r">' + bad(tNg) + '</td><td class="r">' + bad(tScrap) + '</td><td class="r">' + bad(tRw) + '</td>' +
        '<td>' + yieldBar(tOk + tNg ? +(tOk / (tOk + tNg) * 100).toFixed(2) : null) + '</td>' +
        '<td class="r">' + tPlan + '′ / ' + tAct + '′</td>' +
        '<td class="r">' + badMin(tWaste) + '</td><td class="r">' + badMoney(tCost) + '</td>' +
        '<td style="font-size:11px;color:#6b665b">Bấm 1 dòng để xem bản ghi lỗi của công đoạn đó</td>' +
      '</tr></tfoot></table></div>';
  }

  function noteHtml(s) {
    var out = [];
    if (s.causes && s.causes.length) {
      out.push(s.causes.map(function (c) {
        return '<span class="hl">' + esc(c.label.split('—')[0].trim()) + '</span> ' + fmt(c.qty) + ' ' + esc(s.unit);
      }).join('<br>'));
    }
    if (s.wasteDetail && s.wasteDetail.length) {
      out.push('<span style="color:#9c7714">⏱ ' + s.wasteDetail.map(function (w) {
        return esc(w.label.split('—')[0].trim()) + ' ' + w.min + '′';
      }).join(' · ') + '</span>');
    }
    if (!out.length) return '<span class="lw-ok">Không có bất thường</span>';
    return out.join('<br>');
  }

  /* Tổng hợp theo bán thành phẩm (dùng cho báo cáo & trang kho BTP) */
  function btpSummary(days) {
    var S = L(), map = {};
    S.stepsFilter({ days: days || 30 }).forEach(function (s) {
      if (!map[s.btpCode]) map[s.btpCode] = { code: s.btpCode, name: s.btpName, unit: s.unit, ok: 0, ng: 0, scrap: 0, rework: 0, waste: 0, cost: 0, steps: 0, stepName: s.name };
      var o = map[s.btpCode];
      o.ok += s.qtyOk; o.ng += s.qtyNg; o.scrap += s.qtyScrap; o.rework += s.qtyRework;
      o.waste += s.wasteMin; o.cost += s.lossCost; o.steps++;
    });
    var out = Object.keys(map).map(function (k) {
      var o = map[k]; o.yieldPct = (o.ok + o.ng) ? +(o.ok / (o.ok + o.ng) * 100).toFixed(2) : 100; return o;
    });
    out.sort(function (a, b) { return b.cost - a.cost; });
    return out;
  }

  /* ============================================================
     E. DELEGATION — mọi phần tử có data-loss-drill / data-loss-id
     ============================================================ */
  function toast(msg, type) {
    if (global.ERPInteract && global.ERPInteract.showToast) global.ERPInteract.showToast(msg, type || 'info');
  }
  document.addEventListener('click', function (e) {
    var rec = e.target.closest('[data-loss-id]');
    if (rec) { e.preventDefault(); e.stopPropagation(); record(rec.getAttribute('data-loss-id')); return; }
    var dr = e.target.closest('[data-loss-drill]');
    if (dr) {
      e.preventDefault(); e.stopPropagation();
      var f = {};
      try { f = JSON.parse(dr.getAttribute('data-loss-drill') || '{}'); } catch (x) {}
      drill(f, dr.getAttribute('data-loss-title') || '');
      return;
    }
    if (e.target.closest('[data-lw-export]')) { e.preventDefault(); toast('Đang xuất danh sách bản ghi thất thoát ra Excel…', 'info'); return; }
    if (e.target.closest('[data-lw-print]')) { e.preventDefault(); toast('Đang chuẩn bị <b>Biên bản ghi nhận thất thoát</b>…', 'info'); return; }
  }, true);

  function autoInit() {
    injectCSS();
    if (!global.LossStore) return;
    document.querySelectorAll('[data-loss-strip]').forEach(function (n) { if (!n.getAttribute('data-lw-done')) { strip(n); n.setAttribute('data-lw-done', '1'); } });
    document.querySelectorAll('[data-loss-banner]').forEach(function (n) { if (!n.getAttribute('data-lw-done')) { banner(n, n.getAttribute('data-loss-banner')); n.setAttribute('data-lw-done', '1'); } });
    document.querySelectorAll('[data-loss-steps]').forEach(function (n) { if (!n.getAttribute('data-lw-done')) { n.innerHTML = stepTable(n.getAttribute('data-loss-steps')); n.setAttribute('data-lw-done', '1'); icons(); } });
  }
  document.addEventListener('erp:ready', autoInit);
  if (document.readyState !== 'loading') setTimeout(autoInit, 0);
  else document.addEventListener('DOMContentLoaded', function () { setTimeout(autoInit, 0); });

  global.LossUI = {
    drill: drill, record: record, strip: strip, banner: banner,
    stepTable: stepTable, btpSummary: btpSummary, stripData: stripData,
    bad: bad, badMoney: badMoney, badMin: badMin, yieldBar: yieldBar,
    sevChip: sevChip, statusChip: statusChip, attr: attr, esc: esc,
    autoInit: autoInit, injectCSS: injectCSS, noteHtml: noteHtml
  };
})(window);
