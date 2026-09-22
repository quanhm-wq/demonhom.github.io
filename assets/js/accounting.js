/* ============================================================
   ERPAccounting — Xuất phiếu ghi nhận chứng từ → đẩy sang MISA
   ------------------------------------------------------------
   ERP vận hành CHỈ xuất phiếu ghi nhận (số CT, ngày, đối tượng,
   giá trị, thuế) — KHÔNG định khoản Nợ/Có. MISA tự sinh bút toán
   theo cấu hình TT200 khi nhận chứng từ; định khoản là việc kế toán.

   Dùng chung cho mọi chứng từ có giá trị tiền (đơn hàng, hợp đồng,
   phiếu thu/chi, đề nghị mua/PO, phiếu nhập/xuất kho).

   Cách dùng nhanh (khai báo, không cần JS từng trang):
     <button class="btn btn-secondary" data-no-interact="true"
       data-acct-type="sale" data-acct-code="DH-0319"
       data-acct-amount="16760000" data-acct-partner="Nhôm kính Đại Phát"
       data-acct-note="Doanh thu đơn DH-0319" data-acct-date="12/05/2026">
       Xuất file kế toán
     </button>
   ERPAccounting.init() bắt mọi click có [data-acct-type] → mở popup.

   Hoặc gọi trực tiếp:  ERPAccounting.exportModal({ type, code, amount, partner, note, date, vatRate })
   ============================================================ */
(function (global) {
  'use strict';

  var VAT_RATE = (global.PricingEngine && global.PricingEngine.VAT_RATE) || 0.08;

  // Hệ thống tài khoản TT200 (rút gọn các TK dùng trong nhà máy cửa nhôm Owin)
  var ACC = {
    '111':  'Tiền mặt',
    '1121': 'Tiền gửi ngân hàng',
    '131':  'Phải thu khách hàng · đại lý',
    '152':  'Nguyên vật liệu — nhôm thanh · kính · phụ kiện',
    '154':  'Chi phí SXKD dở dang — lệnh sản xuất cửa',
    '155':  'Thành phẩm — bộ cửa nhôm nhập kho',
    '1331': 'Thuế GTGT được khấu trừ',
    '211':  'TSCĐ hữu hình — dàn máy làm cửa nhôm',
    '331':  'Phải trả người bán — NCC nhôm · kính · phụ kiện',
    '3331': 'Thuế GTGT phải nộp',
    '511':  'Doanh thu bán hàng & cung cấp dịch vụ',
    '5111': 'Doanh thu bán cửa nhôm thành phẩm',
    '5112': 'Doanh thu bán nhôm thanh (bán xá)',
    '5113': 'Doanh thu gia công uốn vòm nhôm',
    '5118': 'Doanh thu chuyển giao công nghệ & bán máy',
    '621':  'Chi phí NVL trực tiếp — nhôm · kính · phụ kiện',
    '632':  'Giá vốn hàng bán'
  };

  // Mô tả + bộ sinh bút toán cho từng loại chứng từ
  var TYPES = {
    sale: {
      title: 'Hóa đơn bán cửa nhôm / Đơn hàng', misa: 'Hóa đơn bán hàng',
      partnerLbl: 'Khách hàng · đại lý', hasVat: true,
      build: function (d, net, vat) {
        return [
          { debit: '131', credit: '5111', amount: net, note: d.note || 'Doanh thu bán cửa nhôm thành phẩm' },
          { debit: '131', credit: '3331', amount: vat, note: 'Thuế GTGT đầu ra ' + pct() }
        ];
      }
    },
    sale_profile: {
      title: 'Hóa đơn bán nhôm thanh (bán xá)', misa: 'Hóa đơn bán hàng',
      partnerLbl: 'Đại lý uỷ quyền', hasVat: true,
      build: function (d, net, vat) {
        return [
          { debit: '131', credit: '5112', amount: net, note: d.note || 'Doanh thu bán nhôm thanh theo kg' },
          { debit: '131', credit: '3331', amount: vat, note: 'Thuế GTGT đầu ra ' + pct() }
        ];
      }
    },
    sale_bend: {
      title: 'Hóa đơn gia công uốn vòm nhôm', misa: 'Hóa đơn dịch vụ',
      partnerLbl: 'Khách gia công', hasVat: true,
      build: function (d, net, vat) {
        return [
          { debit: '131', credit: '5113', amount: net, note: d.note || 'Doanh thu gia công uốn vòm theo mét dài' },
          { debit: '131', credit: '3331', amount: vat, note: 'Thuế GTGT đầu ra ' + pct() }
        ];
      }
    },
    sale_tech: {
      title: 'Chuyển giao công nghệ & bán dàn máy', misa: 'Hóa đơn bán hàng',
      partnerLbl: 'Đại lý uỷ quyền', hasVat: true,
      build: function (d, net, vat) {
        return [
          { debit: '131', credit: '5118', amount: net, note: d.note || 'Doanh thu chuyển giao công nghệ & bán dàn máy WEIKE' },
          { debit: '131', credit: '3331', amount: vat, note: 'Thuế GTGT đầu ra ' + pct() }
        ];
      }
    },
    contract: {
      title: 'Hợp đồng — doanh thu dự kiến', misa: 'Hóa đơn bán hàng (theo HĐ)',
      partnerLbl: 'Chủ đầu tư · đại lý', hasVat: true,
      build: function (d, net, vat) {
        return [
          { debit: '131', credit: '5111', amount: net, note: d.note || 'Doanh thu cửa nhôm theo hợp đồng' },
          { debit: '131', credit: '3331', amount: vat, note: 'Thuế GTGT đầu ra ' + pct() }
        ];
      }
    },
    receipt: {
      title: 'Phiếu thu', misa: 'Thu tiền khách hàng',
      partnerLbl: 'Người nộp', hasVat: false,
      build: function (d) {
        return [{ debit: '1121', credit: '131', amount: d.amount, note: d.note || 'Thu tiền khách hàng · đại lý' }];
      }
    },
    payment: {
      title: 'Phiếu chi', misa: 'Chi tiền trả NCC',
      partnerLbl: 'Người nhận', hasVat: false,
      build: function (d) {
        return [{ debit: '331', credit: '1121', amount: d.amount, note: d.note || 'Chi trả nhà cung cấp nhôm · kính · phụ kiện' }];
      }
    },
    purchase: {
      title: 'Đơn mua / Đề nghị mua vật tư nhôm – kính', misa: 'Mua hàng nhập kho',
      partnerLbl: 'Nhà cung cấp', hasVat: true,
      build: function (d, net, vat) {
        return [
          { debit: '152',  credit: '331', amount: net, note: d.note || 'Nhập vật tư nhôm · kính · phụ kiện' },
          { debit: '1331', credit: '331', amount: vat, note: 'Thuế GTGT đầu vào ' + pct() }
        ];
      }
    },
    purchase_nhom: {
      title: 'Mua nhôm thanh (profile)', misa: 'Mua hàng nhập kho',
      partnerLbl: 'NCC nhôm thanh', hasVat: true,
      build: function (d, net, vat) {
        return [
          { debit: '152',  credit: '331', amount: net, note: d.note || 'Mua nhôm thanh 6063-T5 nhập Kho nhôm thanh' },
          { debit: '1331', credit: '331', amount: vat, note: 'Thuế GTGT đầu vào ' + pct() }
        ];
      }
    },
    purchase_kinh: {
      title: 'Mua kính cường lực · kính hộp', misa: 'Mua hàng nhập kho',
      partnerLbl: 'NCC kính', hasVat: true,
      build: function (d, net, vat) {
        return [
          { debit: '152',  credit: '331', amount: net, note: d.note || 'Mua kính cường lực / kính hộp nhập Kho kính' },
          { debit: '1331', credit: '331', amount: vat, note: 'Thuế GTGT đầu vào ' + pct() }
        ];
      }
    },
    purchase_pk: {
      title: 'Mua phụ kiện cửa nhôm', misa: 'Mua hàng nhập kho',
      partnerLbl: 'NCC phụ kiện', hasVat: true,
      build: function (d, net, vat) {
        return [
          { debit: '152',  credit: '331', amount: net, note: d.note || 'Mua bản lề thuỷ lực · khoá · gioăng nhập Kho phụ kiện' },
          { debit: '1331', credit: '331', amount: vat, note: 'Thuế GTGT đầu vào ' + pct() }
        ];
      }
    },
    goods_in: {
      title: 'Phiếu nhập kho vật tư', misa: 'Nhập kho vật tư',
      partnerLbl: 'Nhà cung cấp', hasVat: false,
      build: function (d) {
        return [{ debit: '152', credit: '331', amount: d.amount, note: d.note || 'Nhập kho nhôm thanh · kính · phụ kiện' }];
      }
    },
    goods_out: {
      title: 'Phiếu xuất NVL cho lệnh sản xuất', misa: 'Xuất kho NVL cho SX',
      partnerLbl: 'Lệnh sản xuất', hasVat: false,
      build: function (d) {
        return [{ debit: '621', credit: '152', amount: d.amount, note: d.note || 'Xuất nhôm · kính · phụ kiện cho lệnh sản xuất' }];
      }
    },
    goods_tp: {
      title: 'Phiếu nhập kho thành phẩm', misa: 'Nhập kho thành phẩm',
      partnerLbl: 'Lệnh sản xuất', hasVat: false,
      build: function (d) {
        return [{ debit: '155', credit: '154', amount: d.amount, note: d.note || 'Nhập kho bộ cửa nhôm hoàn thiện từ lệnh sản xuất' }];
      }
    }
  };

  function pct() { return Math.round(VAT_RATE * 100) + '%'; }
  function fmt(n) { n = Math.round(Number(n) || 0); return n.toLocaleString('vi-VN'); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // Tách net/VAT từ tổng tiền (đã gồm thuế)
  function splitVat(amount, rate) {
    rate = (typeof rate === 'number') ? rate : VAT_RATE;
    amount = Math.round(Number(amount) || 0);
    var net = Math.round(amount / (1 + rate));
    return { net: net, vat: amount - net };
  }

  // Sinh danh sách bút toán định khoản từ 1 chứng từ
  function entriesFor(doc) {
    var t = TYPES[doc.type];
    if (!t) return [];
    if (t.hasVat) {
      var s = splitVat(doc.amount, doc.vatRate);
      return t.build(doc, s.net, s.vat);
    }
    return t.build(doc);
  }

  // Bóc tách giá trị 1 chứng từ thành các dòng phiếu ghi nhận (chưa thuế / thuế / tổng)
  function breakdownFor(doc) {
    var t = TYPES[doc.type] || {};
    var total = Math.round(Number(doc.amount) || 0);
    if (t.hasVat) {
      var s = splitVat(doc.amount, doc.vatRate);
      return { net: s.net, vat: s.vat, total: total, hasVat: true };
    }
    return { net: total, vat: 0, total: total, hasVat: false };
  }

  // -------- Tải file Excel (CSV UTF-8, mở được bằng Excel) --------
  // Xuất theo kiểu PHIẾU GHI NHẬN: chỉ dữ liệu chứng từ, không định khoản Nợ/Có.
  // MISA tự sinh bút toán theo cấu hình TT200 khi nhận chứng từ.
  function downloadCSV(doc) {
    var t = TYPES[doc.type] || {};
    var b = breakdownFor(doc);
    var rows = [
      ['So_CT', 'Ngay', 'Loai_chung_tu', 'Doi_tuong', 'Gia_tri_chua_thue', 'Thue_GTGT', 'Tong_tien', 'Dien_giai'],
      [
        doc.code || '', doc.date || '', t.misa || doc.type,
        (doc.partner || '').replace(/"/g, "'"),
        String(b.net), String(b.vat), String(b.total),
        (doc.note || '').replace(/"/g, "'")
      ]
    ];
    var csv = rows.map(function (r) {
      return r.map(function (c) { return '"' + String(c) + '"'; }).join(',');
    }).join('\r\n');
    try {
      var blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = (doc.code || 'chung-tu') + '-phieu-ghi-nhan.csv';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
      return true;
    } catch (err) {
      return false;
    }
  }

  function ensureStyle() {
    if (document.getElementById('erp-acct-style')) return;
    var st = document.createElement('style');
    st.id = 'erp-acct-style';
    st.textContent =
      '.acct-ov{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;' +
        'background:rgba(20,19,15,0.42);padding:20px;opacity:0;transition:opacity 140ms ease}' +
      '.acct-ov.in{opacity:1}' +
      '.acct-modal{background:var(--paper,#f5f1e8);border:1px solid var(--rule,#d8d2c0);border-radius:var(--r-5,12px);' +
        'width:min(560px,100%);max-height:88vh;overflow:auto;box-shadow:0 24px 60px rgba(0,0,0,0.22)}' +
      '.acct-hd{padding:18px 20px;border-bottom:1px solid var(--rule,#d8d2c0);display:flex;justify-content:space-between;align-items:flex-start;gap:12px}' +
      '.acct-hd .ttl{font-size:16px;font-weight:600;color:var(--ink,#14130f)}' +
      '.acct-hd .cap{font-family:var(--ff-mono,monospace);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--ash,#6b665b);margin-bottom:4px}' +
      '.acct-x{border:0;background:transparent;cursor:pointer;color:var(--ash,#6b665b);padding:2px;line-height:0}' +
      '.acct-bd{padding:16px 20px}' +
      '.acct-meta{display:grid;grid-template-columns:1fr 1fr;gap:6px 18px;margin-bottom:14px;font-size:13px}' +
      '.acct-meta .k{color:var(--ash,#6b665b);font-size:11px}' +
      '.acct-meta b{color:var(--ink,#14130f);font-variant-numeric:tabular-nums}' +
      '.acct-tbl{width:100%;border-collapse:collapse;font-size:13px}' +
      '.acct-tbl th{text-align:left;font-family:var(--ff-mono,monospace);font-size:9px;letter-spacing:.1em;text-transform:uppercase;' +
        'color:var(--ash,#6b665b);padding:6px 8px;border-bottom:1px solid var(--rule,#d8d2c0)}' +
      '.acct-tbl td{padding:8px;border-bottom:1px solid rgba(0,0,0,0.06);vertical-align:top}' +
      '.acct-tbl td.amt{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}' +
      '.acct-tk{font-family:var(--ff-mono,monospace);font-weight:700;color:var(--ink,#14130f)}' +
      '.acct-tk small{display:block;font-weight:400;font-size:10px;color:var(--ash,#6b665b);font-family:inherit;letter-spacing:0}' +
      '.acct-tot{display:flex;justify-content:space-between;align-items:center;padding:10px 8px;margin-top:4px;font-size:13px;border-top:2px solid var(--ink,#14130f)}' +
      '.acct-tot b{font-size:16px;font-variant-numeric:tabular-nums}' +
      '.acct-misa{margin-top:12px;padding:10px 12px;border-radius:var(--r-3,6px);background:var(--moss-soft,#e6efe6);' +
        'color:var(--moss-deep,#234a2c);font-size:12px;display:flex;align-items:center;gap:8px}' +
      '.acct-ft{padding:14px 20px;border-top:1px solid var(--rule,#d8d2c0);display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}';
    document.head.appendChild(st);
  }

  function close(ov) {
    ov.classList.remove('in');
    setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 160);
  }

  function exportModal(doc) {
    var t = TYPES[doc.type];
    if (!t) { if (global.ERPInteract) ERPInteract.showToast('Loại chứng từ chưa hỗ trợ xuất kế toán', 'warning'); return; }
    ensureStyle();
    var b = breakdownFor(doc);

    var rowsHTML = '';
    if (b.hasVat) {
      rowsHTML =
        '<tr><td>Giá trị chưa thuế</td><td class="amt">' + fmt(b.net) + '</td></tr>' +
        '<tr><td>Thuế GTGT (' + pct() + ')</td><td class="amt">' + fmt(b.vat) + '</td></tr>';
    } else {
      rowsHTML = '<tr><td>Số tiền</td><td class="amt">' + fmt(b.total) + '</td></tr>';
    }
    var noteHTML = doc.note
      ? '<tr><td>Diễn giải</td><td class="amt" style="white-space:normal;color:var(--ash,#6b665b);text-align:right">' + esc(doc.note) + '</td></tr>'
      : '';

    var ov = document.createElement('div');
    ov.className = 'acct-ov';
    ov.innerHTML =
      '<div class="acct-modal" role="dialog" aria-modal="true">' +
        '<div class="acct-hd">' +
          '<div><div class="cap">Phiếu ghi nhận · Đẩy sang kế toán</div><div class="ttl">' + esc(t.title) + '</div></div>' +
          '<button class="acct-x" data-acct-close="1" data-no-interact="true"><i data-lucide="x" style="width:18px;height:18px"></i></button>' +
        '</div>' +
        '<div class="acct-bd">' +
          '<div class="acct-meta">' +
            '<div><div class="k">Số chứng từ</div><b>' + esc(doc.code || '—') + '</b></div>' +
            '<div><div class="k">Ngày</div><b>' + esc(doc.date || 'hôm nay') + '</b></div>' +
            '<div><div class="k">' + esc(t.partnerLbl) + '</div><b>' + esc(doc.partner || '—') + '</b></div>' +
            '<div><div class="k">Loại chứng từ</div><b>' + esc(t.misa) + '</b></div>' +
          '</div>' +
          '<table class="acct-tbl"><thead><tr><th>Nội dung</th><th style="text-align:right">Số tiền</th></tr></thead>' +
            '<tbody>' + rowsHTML + noteHTML + '</tbody></table>' +
          '<div class="acct-tot"><span>Tổng cộng' + (b.hasVat ? ' (đã gồm VAT ' + pct() + ')' : '') + '</span><b>' + fmt(b.total) + '₫</b></div>' +
          '<div class="acct-misa"><i data-lucide="link" style="width:14px;height:14px"></i> Phiếu ghi nhận sẵn sàng đẩy sang MISA — phần mềm kế toán tự hạch toán theo TT200.</div>' +
        '</div>' +
        '<div class="acct-ft">' +
          '<button class="btn btn-secondary" data-acct-close="1" data-no-interact="true">Đóng</button>' +
          '<button class="btn btn-secondary" data-acct-dl="1" data-no-interact="true"><i data-lucide="download" style="width:14px;height:14px"></i> Tải file Excel</button>' +
          '<button class="btn btn-primary" data-acct-misa="1" data-no-interact="true"><i data-lucide="upload-cloud" style="width:14px;height:14px"></i> Đẩy sang MISA</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(ov);
    if (global.lucide) global.lucide.createIcons();
    requestAnimationFrame(function () { ov.classList.add('in'); });

    ov.addEventListener('click', function (e) {
      if (e.target === ov || e.target.closest('[data-acct-close]')) { close(ov); return; }
      if (e.target.closest('[data-acct-dl]')) {
        var ok = downloadCSV(doc);
        if (global.ERPInteract) ERPInteract.showToast(ok ? ('Đã tải <b>' + esc(doc.code || 'chứng từ') + '-phieu-ghi-nhan.csv</b>') : 'Trình duyệt chặn tải file (mở qua server để tải)', ok ? 'success' : 'warning');
        return;
      }
      if (e.target.closest('[data-acct-misa]')) {
        if (global.ERPInteract) ERPInteract.showToast('Đã đẩy phiếu ghi nhận <b>' + esc(doc.code || 'chứng từ') + '</b> sang MISA', 'success');
        close(ov);
        return;
      }
    });
    document.addEventListener('keydown', function escKey(ev) {
      if (ev.key === 'Escape') { close(ov); document.removeEventListener('keydown', escKey); }
    });
    return ov;
  }

  // Đọc 1 chứng từ từ dataset của phần tử có [data-acct-type]
  function docFromEl(el) {
    var d = el.dataset;
    return {
      type: d.acctType,
      code: d.acctCode || '',
      amount: parseFloat(d.acctAmount) || 0,
      partner: d.acctPartner || '',
      note: d.acctNote || '',
      date: d.acctDate || '',
      vatRate: d.acctVat ? parseFloat(d.acctVat) : undefined
    };
  }

  // Gắn nút "Xuất KT" vào các dòng bảng có mã chứng từ khớp `map`.
  //   map: { 'PT-0517': { type, amount, partner, note, date }, ... }
  // Khớp theo mã xuất hiện trong text của dòng → không phụ thuộc vị trí cột.
  function attachToRows(map, opts) {
    opts = opts || {};
    var sel = opts.rowSelector || 'table.tbl tbody tr';
    var keys = Object.keys(map);
    var rows = document.querySelectorAll(sel);
    Array.prototype.forEach.call(rows, function (tr) {
      if (tr.querySelector('[data-acct-type]')) return; // idempotent
      var txt = tr.textContent || '';
      var key = keys.filter(function (k) { return txt.indexOf(k) >= 0; })[0];
      if (!key) return;
      var d = map[key];
      var cell = (opts.targetCell && tr.querySelector(opts.targetCell)) || tr.lastElementChild;
      if (!cell) return;
      var b = document.createElement('button');
      b.className = opts.btnClass || 'btn btn-secondary btn-sm';
      b.setAttribute('data-no-interact', 'true');
      b.setAttribute('data-acct-type', d.type);
      b.setAttribute('data-acct-code', d.code || key);
      b.setAttribute('data-acct-amount', d.amount || 0);
      if (d.partner) b.setAttribute('data-acct-partner', d.partner);
      if (d.note) b.setAttribute('data-acct-note', d.note);
      if (d.date) b.setAttribute('data-acct-date', d.date);
      b.style.whiteSpace = 'nowrap';
      b.innerHTML = '<i data-lucide="file-spreadsheet" style="width:12px;height:12px"></i> ' + (opts.label || 'Xuất KT');
      cell.appendChild(b);
    });
    if (global.lucide) global.lucide.createIcons();
  }

  function init() {
    if (global.__erpAcctInit) return;
    global.__erpAcctInit = true;
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-acct-type]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      exportModal(docFromEl(btn));
    });
  }

  global.ERPAccounting = {
    ACC: ACC, TYPES: TYPES, VAT_RATE: VAT_RATE,
    entriesFor: entriesFor, splitVat: splitVat,
    exportModal: exportModal, downloadCSV: downloadCSV,
    attachToRows: attachToRows, init: init
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(typeof window !== 'undefined' ? window : this);

/* ============================================================
   ERPCash — QUẢN LÝ THU CHI · SỔ QUỸ (nhà máy cửa nhôm Owin)
   ------------------------------------------------------------
   Store phiếu thu (PT-) / phiếu chi (PC-) trên localStorage,
   số dư quỹ đầu kỳ OPENING, tổng hợp thu chi theo tháng và
   hàm đọc số tiền thành chữ tiếng Việt (in phiếu TT200).

   API:
     ERPCash.all()          → mảng phiếu (mới nhất trước)
     ERPCash.get(id)        → 1 phiếu theo số phiếu
     ERPCash.create(p)      → tạo phiếu (tự sinh id theo kind, ngày hôm nay nếu thiếu)
     ERPCash.nextId(kind)   → 'PT-2026-0xx' | 'PC-2026-0xx'
     ERPCash.summary()      → {totalThu, totalChi, balance, thuThang, chiThang}
     ERPCash.toWords(n)     → số tiền bằng chữ (mốt/tư/lăm/lẻ chuẩn)
   ============================================================ */
(function (global) {
  'use strict';

  var KEY = 'erp_thuchi_nhomowin_v1';
  var OPENING = 1250000000;      // Số dư quỹ đầu kỳ (tiền mặt + tiền gửi NH)
  var MONTH = 8, YEAR = 2026;    // Kỳ báo cáo hiện hành của demo (tháng 8/2026)

  // Danh mục loại thu / chi
  var TYPES = {
    thu: [
      { value: 'thu_banhang', label: 'Thu tiền bán hàng' },
      { value: 'thu_congno',  label: 'Thu hồi công nợ' },
      { value: 'thu_khac',    label: 'Thu khác' }
    ],
    chi: [
      { value: 'chi_nvl',      label: 'Chi mua nhôm · kính · phụ kiện' },
      { value: 'chi_luong',    label: 'Chi lương' },
      { value: 'chi_diennuoc', label: 'Chi điện nước - năng lượng' },
      { value: 'chi_baotri',   label: 'Chi bảo trì máy cắt · ép góc · uốn vòm' },
      { value: 'chi_khac',     label: 'Chi khác' }
    ]
  };
  function typeLabel(type) {
    var list = TYPES.thu.concat(TYPES.chi);
    for (var i = 0; i < list.length; i++) if (list[i].value === type) return list[i].label;
    return type || '';
  }

  // Seed 6 phiếu tháng 7–8/2026 — mới nhất trước (khớp thứ tự unshift)
  var SEED = [
    { id: 'PC-2026-004', kind: 'chi', date: '12/08/2026', type: 'chi_baotri',   typeLabel: 'Chi bảo trì máy cắt · ép góc · uốn vòm', partner: 'Cơ khí WEIKE Việt Nam',    method: 'tm', amount: 18600000,  reason: 'Bảo trì định kỳ máy uốn vòm UON-01 + thay lưỡi cắt Ø500 máy CAT-01', createdBy: 'Trần Thị Thu Hà', ref: 'BT-0031' },
    { id: 'PC-2026-003', kind: 'chi', date: '08/08/2026', type: 'chi_diennuoc', typeLabel: 'Chi điện nước - năng lượng',     partner: 'EVN Hà Nội',               method: 'ck', amount: 42300000,  reason: 'Tiền điện tháng 7/2026 — xưởng cắt CNC & ép góc nhà máy Giá Ngự', createdBy: 'Trần Thị Thu Hà', ref: 'HD-DIEN-T7' },
    { id: 'PT-2026-002', kind: 'thu', date: '04/08/2026', type: 'thu_congno',   typeLabel: 'Thu hồi công nợ',                partner: 'ĐL Nhôm kính Minh Anh',    method: 'ck', amount: 96500000,  reason: 'Thu hồi công nợ đơn hàng cửa thuỷ lực hệ 120 · 2 cánh',   createdBy: 'Trần Thị Thu Hà', ref: 'DH-0285' },
    { id: 'PC-2026-002', kind: 'chi', date: '31/07/2026', type: 'chi_luong',    typeLabel: 'Chi lương',                      partner: 'Nhân viên nhà máy',        method: 'ck', amount: 145000000, reason: 'Lương tháng 7/2026 — 32 thợ cắt/ép góc/uốn vòm + khối văn phòng', createdBy: 'Trần Thị Thu Hà', ref: 'BL-07-2026' },
    { id: 'PC-2026-001', kind: 'chi', date: '15/07/2026', type: 'chi_nvl',      typeLabel: 'Chi mua nhôm · kính · phụ kiện', partner: 'Đùn ép Nhôm Đông Anh',     method: 'ck', amount: 320000000, reason: 'Thanh toán nhôm thanh hệ 120 (6063-T5) đợt 1 tháng 7',    createdBy: 'Trần Thị Thu Hà', ref: 'PO-0044' },
    { id: 'PT-2026-001', kind: 'thu', date: '12/07/2026', type: 'thu_banhang',  typeLabel: 'Thu tiền bán hàng',              partner: 'Nhôm kính Đại Phát',       method: 'ck', amount: 185000000, reason: 'Thu tiền bán cửa trượt quay 93 + nhôm thanh bán xá kỳ tháng 6', createdBy: 'Trần Thị Thu Hà', ref: 'DH-0298' }
  ];

  // ---------- localStorage ----------
  function loadData() {
    try {
      var raw = global.localStorage && global.localStorage.getItem(KEY);
      if (raw) { var arr = JSON.parse(raw); if (arr && arr.length) return arr; }
    } catch (e) {}
    return null;
  }
  function saveData() {
    try { global.localStorage && global.localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }
  var data = loadData() || SEED.slice();
  if (!loadData()) saveData(); // ghi seed lần đầu

  // ---------- helpers ----------
  function pad(n, w) { n = String(n); while (n.length < w) n = '0' + n; return n; }
  function todayStr() {
    var d = new Date();
    return pad(d.getDate(), 2) + '/' + pad(d.getMonth() + 1, 2) + '/' + d.getFullYear();
  }
  function parseDate(s) {
    var m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(s || '').trim());
    if (!m) return null;
    return { d: +m[1], m: +m[2], y: +m[3] };
  }

  // ---------- API ----------
  function all() { return data.slice(); }

  function get(id) {
    for (var i = 0; i < data.length; i++) if (data[i].id === id) return data[i];
    return null;
  }

  function nextId(kind) {
    var prefix = (kind === 'chi' ? 'PC-' : 'PT-') + YEAR + '-';
    var max = 0;
    for (var i = 0; i < data.length; i++) {
      var id = String(data[i].id || '');
      if (id.indexOf(prefix) === 0) {
        var n = parseInt(id.slice(prefix.length), 10);
        if (n > max) max = n;
      }
    }
    return prefix + pad(max + 1, 3);
  }

  function create(p) {
    p = p || {};
    var kind = p.kind === 'chi' ? 'chi' : 'thu';
    var rec = {
      id: p.id || nextId(kind),
      kind: kind,
      date: p.date || todayStr(),
      type: p.type || (kind === 'thu' ? 'thu_khac' : 'chi_khac'),
      typeLabel: p.typeLabel || typeLabel(p.type) || (kind === 'thu' ? 'Thu khác' : 'Chi khác'),
      partner: p.partner || '',
      method: p.method === 'ck' ? 'ck' : 'tm',
      amount: Math.round(Number(p.amount) || 0),
      reason: p.reason || '',
      createdBy: p.createdBy || 'Kế toán viên',
      ref: p.ref || ''
    };
    data.unshift(rec);
    saveData();
    return rec;
  }

  function summary() {
    var totalThu = 0, totalChi = 0, thuThang = 0, chiThang = 0;
    for (var i = 0; i < data.length; i++) {
      var r = data[i];
      var amt = Math.round(Number(r.amount) || 0);
      var d = parseDate(r.date);
      var inMonth = d && d.m === MONTH && d.y === YEAR;
      if (r.kind === 'thu') { totalThu += amt; if (inMonth) thuThang += amt; }
      else { totalChi += amt; if (inMonth) chiThang += amt; }
    }
    return {
      totalThu: totalThu,
      totalChi: totalChi,
      balance: OPENING + totalThu - totalChi,
      thuThang: thuThang,
      chiThang: chiThang
    };
  }

  // ---------- Đọc số tiền thành chữ tiếng Việt ----------
  var CHU_SO = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
  function doc3(n, full) {
    var tram = Math.floor(n / 100), chuc = Math.floor((n % 100) / 10), dv = n % 10, s = '';
    if (full || tram > 0) {
      s += CHU_SO[tram] + ' trăm';
      if (chuc === 0 && dv > 0) s += ' lẻ';
    }
    if (chuc > 1) {
      s += ' ' + CHU_SO[chuc] + ' mươi';
      if (dv === 1) s += ' mốt';
      else if (dv === 4) s += ' tư';
      else if (dv === 5) s += ' lăm';
      else if (dv > 0) s += ' ' + CHU_SO[dv];
    } else if (chuc === 1) {
      s += ' mười';
      if (dv === 5) s += ' lăm';
      else if (dv > 0) s += ' ' + CHU_SO[dv];
    } else if (dv > 0) {
      s += ' ' + CHU_SO[dv];
    }
    return s.replace(/\s+/g, ' ').trim();
  }
  function toWords(n) {
    n = Math.round(Number(n) || 0);
    if (n === 0) return 'Không đồng';
    if (n < 0) return 'Âm ' + toWords(-n).toLowerCase();
    var UNITS = ['', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ', ' triệu tỷ'];
    var groups = [];
    while (n > 0) { groups.push(n % 1000); n = Math.floor(n / 1000); }
    var parts = [];
    for (var i = groups.length - 1; i >= 0; i--) {
      if (groups[i] === 0) continue;
      var full = i < groups.length - 1; // nhóm giữa đọc cả "không trăm"
      parts.push(doc3(groups[i], full) + UNITS[i]);
    }
    var s = parts.join(' ');
    return s.charAt(0).toUpperCase() + s.slice(1) + ' đồng';
  }

  global.ERPCash = {
    KEY: KEY, OPENING: OPENING, MONTH: MONTH, YEAR: YEAR, TYPES: TYPES,
    typeLabel: typeLabel, parseDate: parseDate, todayStr: todayStr,
    all: all, get: get, create: create, nextId: nextId,
    summary: summary, toWords: toWords
  };
})(typeof window !== 'undefined' ? window : this);
