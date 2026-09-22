/* ============================================================
   ERP NHÔM OWIN - Shared layout (sidebar + topbar injection)
   Usage: each page has <div id="app-shell" data-active="dashboard" data-title="...">
   ============================================================ */

const NAV = [
  {
    section: 'Tổng quan',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', href: '01-dashboard.html' },
    ],
  },
  {
    section: 'Kinh doanh',
    items: [
      { id: 'san-pham', label: 'Sản phẩm', icon: 'box', href: '20-san-pham.html' },
      { id: 'tinh-gia', label: 'Tính giá thành', icon: 'calculator', href: '17-tinh-gia.html' },
      { id: 'bao-gia', label: 'Báo giá', icon: 'file-text', href: '02-bao-gia.html' },
      { id: 'hop-dong', label: 'Hợp đồng', icon: 'file-signature', href: '18-hop-dong.html' },
      { id: 'don-hang', label: 'Đơn hàng bán', icon: 'shopping-cart', href: '03-don-hang.html' },
      { id: 'crm', label: 'Khách hàng', icon: 'users', href: '07-crm.html' },
    ],
  },
  {
    section: 'Sản xuất',
    items: [
      { id: 'sx-kanban', label: 'Lệnh dạng Kanban', icon: 'workflow', href: '04-san-xuat-kanban.html' },
      { id: 'sx-gantt', label: 'Lệnh dạng Gantt', icon: 'gantt-chart', href: '04-san-xuat-gantt.html' },
      { id: 'sx-list', label: 'Lệnh dạng danh sách', icon: 'clipboard-list', href: '19-lsx-san-xuat.html' },
      { id: 'bom', label: 'Định mức BOM', icon: 'list-tree', href: 'bom-dinh-muc.html' },
      { id: 'ke-hoach-sx', label: 'Kế hoạch sản xuất', icon: 'calendar-days', href: '11-ke-hoach-san-xuat.html' },
    ],
  },
  {
    section: 'Kho',
    items: [
      { id: 'kho', label: 'Kho', icon: 'warehouse', children: [
        { id: 'kho-vt', label: 'Kho vật tư', icon: 'package', href: '05-kho.html' },
        { id: 'kho-btp', label: 'Kho bán thành phẩm', icon: 'layers', href: 'kho-ban-thanh-pham.html' },
        { id: 'kho-tp', label: 'Kho thành phẩm', icon: 'package-check', href: '22-kho-thanh-pham.html' },
        { id: 'kho-tieuhao', label: 'Kho vật liệu tiêu hao', icon: 'flask-conical', href: 'kho-vat-lieu-tieu-hao.html' },
        { id: 'kho-ccdc', label: 'Kho công cụ dụng cụ', icon: 'wrench', href: 'kho-cong-cu-dung-cu.html' },
        { id: 'kho-lichsu', label: 'Lịch sử xuất nhập kho', icon: 'history', href: 'lich-su-xnk-kho.html' },
      ] },
    ],
  },
  {
    section: 'Mua hàng',
    items: [
      { id: 'de-xuat-mua', label: 'Đề xuất mua', icon: 'clipboard-plus', href: '13-de-xuat-mua.html' },
      { id: 'mua-hang', label: 'PO mua hàng', icon: 'truck', href: '13-mua-hang.html' },
      { id: 'ncc', label: 'Nhà cung cấp', icon: 'contact', href: '21-nha-cung-cap.html' },
      { id: 'cong-no-ncc', label: 'Công nợ nhà cung cấp', icon: 'wallet', href: '21-cong-no-ncc.html' },
    ],
  },
  {
    section: 'Kỹ thuật máy',
    items: [
      { id: 'tbmm', label: 'Tổng quan thiết bị', icon: 'gauge', href: '14-tbmm-bao-tri.html' },
      { id: 'may-moc', label: 'Quản lý máy móc', icon: 'cog', href: '17-may-moc.html' },
      { id: 'phieu-bao-tri', label: 'Phiếu bảo trì', icon: 'clipboard-check', href: '18-phieu-bao-tri.html' },
      { id: 'sua-chua', label: 'Sửa chữa', icon: 'hammer', href: '19-sua-chua.html' },
      { id: 'vat-tu-may', label: 'Vật tư – linh kiện', icon: 'package-plus', href: '20-vat-tu-may.html' },
    ],
  },
  {
    section: 'Tài chính',
    items: [
      { id: 'ke-toan', label: 'Kế toán', icon: 'landmark', href: '15-ke-toan.html' },
    ],
  },
  {
    section: 'Nhân sự',
    items: [
      { id: 'hr-hoso', label: 'Hồ sơ nhân sự', icon: 'id-card', href: '22-nhan-su-ho-so.html' },
      { id: 'hr-tuyendung', label: 'Tuyển dụng & Định biên', icon: 'user-plus', href: '23-tuyen-dung.html' },
      { id: 'hr-danhgia', label: 'Thử việc & Đánh giá', icon: 'user-check', href: '24-thu-viec-danh-gia.html' },
      { id: 'hr-daotao', label: 'Tài liệu & Quy chế', icon: 'book-text', href: '25-dao-tao-tai-lieu.html' },
      { id: 'hr-hopdong', label: 'HĐ lao động & QĐ', icon: 'file-badge', href: '26-hop-dong-quyet-dinh.html' },
      { id: 'hr-kpi', label: 'Bậc lương & KPI', icon: 'target', href: '27-bac-luong-kpi.html' },
      { id: 'luong', label: 'Chấm công & Lương', icon: 'banknote', href: '16-cham-cong-luong-khoan.html' },
      { id: 'hr-bienban', label: 'Phiếu lỗi & Biên bản', icon: 'file-warning', href: '28-phieu-loi-bien-ban.html' },
    ],
  },
  {
    section: 'Báo cáo & Hệ thống',
    items: [
      { id: 'bao-cao', label: 'Báo cáo', icon: 'bar-chart-3', href: '08-bao-cao.html' },
      { id: 'bao-cao-thiet-hai', label: 'Báo cáo thiệt hại', icon: 'trending-down', href: '31-bao-cao-thiet-hai.html' },
      { id: 'admin', label: 'Quản trị hệ thống', icon: 'settings', href: '09-quan-tri-he-thong.html' },
    ],
  },
];

/* ============================================================
   Phân quyền theo vai trò (RBAC mockup)
   - 8 vai trò; mỗi vai trò thấy/được thao tác với tập màn hình riêng.
   - Cấp độ: 'full' (●) quản lý · 'limited' (◐) thao tác giới hạn · 'view' (○) chỉ xem.
     Vắng mặt = không truy cập. Admin = full mọi thứ.
   - Bảng này bám ma trận domain sản xuất cửa nhôm (docs/quy-trinh-san-xuat-in.md §1.1).
   - Giữ cả id NAV cũ ('san-xuat', 'lsx') làm alias cho các trang chưa đổi data-active.
   ============================================================ */
const ROLES = [
  { id: 'admin', label: 'Quản trị (Admin)' },
  { id: 'kd',    label: 'Kinh doanh' },
  { id: 'sx',    label: 'Sản xuất' },
  { id: 'kho',   label: 'Kho' },
  { id: 'tm',    label: 'Thu mua' },
  { id: 'may',   label: 'Kỹ thuật máy' },
  { id: 'kt',    label: 'Kế toán' },
  { id: 'ns',    label: 'Hành chính – Nhân sự' },
];

const PERMISSIONS = {
  kd: {
    dashboard: 'view',
    'san-pham': 'full', 'tinh-gia': 'full', 'bao-gia': 'full', 'hop-dong': 'full', 'don-hang': 'full', 'crm': 'full',
    'san-xuat': 'view', 'lsx': 'view', 'ke-hoach-sx': 'view',
    'sx-kanban': 'view', 'sx-gantt': 'view', 'sx-list': 'view',
    'kho-tp': 'view', 'kho-vpp': 'full', 'ke-toan': 'view', 'hr-daotao': 'view',
    'bao-cao': 'view', 'bao-cao-thiet-hai': 'view',
  },
  sx: {
    dashboard: 'view',
    'san-pham': 'view', 'tinh-gia': 'view', 'bao-gia': 'view', 'don-hang': 'limited',
    'san-xuat': 'full', 'lsx': 'full', 'ke-hoach-sx': 'full',
    'sx-kanban': 'full', 'sx-gantt': 'full', 'sx-list': 'full',
    'kho-vt': 'view', 'kho-btp': 'view', 'kho-tp': 'view', 'kho-tieuhao': 'view', 'kho-lichsu': 'view',
    'mua-hang': 'view', 'de-xuat-mua': 'limited',
    'tbmm': 'view', 'may-moc': 'view', 'phieu-bao-tri': 'view', 'sua-chua': 'limited',
    'hr-tuyendung': 'view', 'hr-danhgia': 'view', 'hr-daotao': 'view', 'luong': 'view', 'hr-bienban': 'limited',
    'bao-cao': 'view', 'bao-cao-thiet-hai': 'view',
  },
  kho: {
    dashboard: 'view',
    'don-hang': 'view',
    'san-xuat': 'view', 'lsx': 'limited', 'ke-hoach-sx': 'limited',
    'sx-kanban': 'view', 'sx-gantt': 'view', 'sx-list': 'limited',
    'kho-vt': 'full', 'kho-btp': 'full', 'kho-tp': 'full', 'kho-vpp': 'full', 'kho-tieuhao': 'full', 'kho-ccdc': 'full', 'kho-lichsu': 'full',
    'mua-hang': 'limited', 'de-xuat-mua': 'full', 'ncc': 'view',
    'sua-chua': 'view', 'vat-tu-may': 'limited',
    'hr-daotao': 'view', 'bao-cao': 'view', 'bao-cao-thiet-hai': 'view',
  },
  tm: {
    dashboard: 'view',
    'ke-hoach-sx': 'view',
    'kho-vt': 'limited', 'kho-tieuhao': 'limited', 'kho-ccdc': 'view', 'kho-lichsu': 'view',
    'mua-hang': 'full', 'de-xuat-mua': 'full', 'ncc': 'full', 'cong-no-ncc': 'full',
    'phieu-bao-tri': 'view', 'sua-chua': 'view', 'vat-tu-may': 'limited',
    'ke-toan': 'view', 'hr-daotao': 'view', 'bao-cao': 'view', 'bao-cao-thiet-hai': 'view',
  },
  may: {
    dashboard: 'view',
    'san-xuat': 'view', 'lsx': 'view', 'ke-hoach-sx': 'view',
    'sx-kanban': 'view', 'sx-gantt': 'view', 'sx-list': 'view',
    'kho-tieuhao': 'view', 'kho-ccdc': 'limited',
    'mua-hang': 'view', 'de-xuat-mua': 'limited', 'ncc': 'view',
    'tbmm': 'full', 'may-moc': 'full', 'phieu-bao-tri': 'full', 'sua-chua': 'full', 'vat-tu-may': 'full',
    'hr-daotao': 'view', 'bao-cao': 'view', 'bao-cao-thiet-hai': 'view',
  },
  kt: {
    dashboard: 'view',
    'san-pham': 'view', 'tinh-gia': 'view', 'bao-gia': 'view', 'hop-dong': 'limited', 'don-hang': 'view', 'crm': 'view',
    'san-xuat': 'view', 'lsx': 'view',
    'sx-kanban': 'view', 'sx-gantt': 'view', 'sx-list': 'view',
    'kho-vt': 'view', 'kho-btp': 'view', 'kho-tp': 'view', 'kho-vpp': 'view', 'kho-tieuhao': 'view', 'kho-ccdc': 'view', 'kho-lichsu': 'view',
    'mua-hang': 'limited', 'de-xuat-mua': 'view', 'ncc': 'view', 'cong-no-ncc': 'full',
    'tbmm': 'view', 'may-moc': 'view', 'vat-tu-may': 'view',
    'ke-toan': 'full',
    'hr-hoso': 'view', 'hr-hopdong': 'view', 'hr-kpi': 'limited', 'luong': 'limited', 'hr-bienban': 'view', 'hr-daotao': 'view',
    'bao-cao': 'limited', 'bao-cao-thiet-hai': 'limited',
  },
  ns: {
    dashboard: 'view',
    'ke-toan': 'view',
    'hr-hoso': 'full', 'hr-tuyendung': 'full', 'hr-danhgia': 'full', 'hr-daotao': 'full',
    'hr-hopdong': 'full', 'hr-kpi': 'full', 'luong': 'full', 'hr-bienban': 'full',
    'bao-cao': 'view', 'bao-cao-thiet-hai': 'view',
  },
};

// Trang cũ còn dùng data-active cũ → ánh xạ sang id NAV mới để sidebar vẫn sáng đúng mục.
const NAV_ALIAS = { 'san-xuat': 'sx-kanban', 'lsx': 'sx-list' };

const ROLE_KEY = 'erp.role';
function currentRole() { try { return localStorage.getItem(ROLE_KEY) || 'admin'; } catch (e) { return 'admin'; } }
function setRole(r) { try { localStorage.setItem(ROLE_KEY, r); } catch (e) {} }
function roleLabel(r) { const x = ROLES.find(o => o.id === r); return x ? x.label : 'Quản trị (Admin)'; }

// Trạng thái gập/mở các nhóm sidebar (nhớ qua localStorage vì mỗi trang dựng lại sidebar)
const NAVCOL_KEY = 'erp.navCollapsed';
function collapsedSet() { try { return new Set(JSON.parse(localStorage.getItem(NAVCOL_KEY) || '[]')); } catch (e) { return new Set(); } }
function saveCollapsed(set) { try { localStorage.setItem(NAVCOL_KEY, JSON.stringify([...set])); } catch (e) {} }
function accessLevel(role, id) {
  if (role === 'admin') return 'full';
  const m = PERMISSIONS[role];
  return (m && m[id]) || null;
}
function roMark(lvl) {
  if (lvl === 'view') return `<i data-lucide="eye" class="nav-lvl nav-lvl-view" title="Chỉ xem"></i>`;
  if (lvl === 'limited') return `<i data-lucide="square-pen" class="nav-lvl nav-lvl-limited" title="Thao tác giới hạn"></i>`;
  return '';
}

// API phân quyền cho code từng trang (ẩn nút / khóa field theo vai trò ở đợt sau).
// can(id) = có thấy không; can(id,'edit') = được sửa (full/limited); can(id,'full') = quản lý.
window.ERPAuth = {
  ROLES: ROLES,
  currentRole: currentRole,
  setRole: setRole,
  roleLabel: roleLabel,
  level: function (id) { return accessLevel(currentRole(), id); },
  can: function (id, need) {
    const lvl = accessLevel(currentRole(), id);
    if (!lvl) return false;
    if (need === 'full') return lvl === 'full';
    if (need === 'edit') return lvl === 'full' || lvl === 'limited';
    return true; // chỉ cần thấy
  },
  readonly: function (id) {
    const lvl = accessLevel(currentRole(), id);
    return lvl === 'view';
  },
};

function renderSidebar(activeId, role) {
  role = role || currentRole();
  const collapsed = collapsedSet();
  let colDirty = false;
  let html = `
    <a href="../index.html" class="sidebar-logo" style="text-decoration:none">
      <span class="sidebar-logo-mark" aria-hidden="true">OW</span>
      <span class="sidebar-logo-text">ERP NHÔM OWIN<small>Nhôm hệ · Cửa thủy lực · Trượt quay · Uốn vòm</small></span>
    </a>
  `;
  for (const sec of NAV) {
    let inner = '';
    for (const it of sec.items) {
      if (it.children) {
        const kids = it.children.filter(c => accessLevel(role, c.id));
        if (!kids.length) continue;
        const open = kids.some(c => c.id === activeId);
        inner += `<div class="nav-group${open ? ' open' : ''}">`;
        inner += `<button type="button" class="nav-item nav-parent"><i data-lucide="${it.icon}" class="nav-icon"></i>${it.label}<i data-lucide="chevron-down" class="nav-caret"></i></button>`;
        inner += `<div class="nav-children">`;
        for (const c of kids) {
          const ccls = c.id === activeId ? 'nav-item nav-child active' : 'nav-item nav-child';
          inner += `<a href="${c.href}" class="${ccls}"><i data-lucide="${c.icon}" class="nav-icon"></i>${c.label}${roMark(accessLevel(role, c.id))}</a>`;
        }
        inner += `</div></div>`;
      } else {
        const lvl = accessLevel(role, it.id);
        if (!lvl) continue;
        const cls = it.id === activeId ? 'nav-item active' : 'nav-item';
        inner += `<a href="${it.href}" class="${cls}"><i data-lucide="${it.icon}" class="nav-icon"></i>${it.label}${roMark(lvl)}</a>`;
      }
    }
    if (!inner) continue;
    const hasActive = sec.items.some(it => it.id === activeId || (it.children && it.children.some(c => c.id === activeId)));
    // Nhóm chứa trang đang xem luôn mở; nếu trước đó bị gập thì bỏ gập & lưu lại.
    if (hasActive && collapsed.has(sec.section)) { collapsed.delete(sec.section); colDirty = true; }
    const isCollapsed = collapsed.has(sec.section);
    html += `<div class="nav-section${isCollapsed ? ' collapsed' : ''}" data-section="${sec.section}">`
      + `<button type="button" class="nav-section-title"><span>${sec.section}</span><i data-lucide="chevron-down" class="nav-section-caret"></i></button>`
      + `<div class="nav-section-body">${inner}</div></div>`;
  }
  if (colDirty) saveCollapsed(collapsed);
  return html;
}

function renderTopbar(title, breadcrumb) {
  const role = currentRole();
  const opts = ROLES.map(r => `<option value="${r.id}"${r.id === role ? ' selected' : ''}>${r.label}</option>`).join('');
  return `
    <div class="breadcrumb">${breadcrumb || `<b>${title || ''}</b>`}</div>
    <div class="topbar-right">
      <div class="input-search" style="display:flex;align-items:center;width:280px">
        <input class="input input-search" placeholder="Tìm đơn hàng, khách hàng, sản phẩm..." style="border:none;background:transparent;padding-left:32px"/>
      </div>
      <label class="role-switch" title="Xem hệ thống dưới vai trò khác (mockup phân quyền)">
        <i data-lucide="shield-check" style="width:15px;height:15px"></i>
        <select id="roleSwitch">${opts}</select>
      </label>
      <button class="btn-icon bell-wrap" id="bellBtn" title="Thông báo"><i data-lucide="bell" style="width:16px;height:16px"></i><span class="bell-badge" id="bellBadge" hidden></span></button>
      <button class="btn-icon" title="Trợ giúp"><i data-lucide="help-circle" style="width:16px;height:16px"></i></button>
      <div class="avatar" title="Nguyễn Văn A">NA</div>
    </div>
  `;
}

/* ============================================================
   Interaction layer — make every button feel alive
   - Toast notifications for actions without real navigation
   - Modal helper
   - Tab switcher (data-tab + data-tab-pane)
   - Active row highlight
   ============================================================ */
window.ERPInteract = (function () {

  function ensureToastStack() {
    let stack = document.getElementById('toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.id = 'toast-stack';
      stack.className = 'toast-stack';
      stack.setAttribute('aria-live', 'polite');
      document.body.appendChild(stack);
    }
    return stack;
  }

  function showToast(message, type = 'info', durationMs = 2800) {
    const stack = ensureToastStack();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const iconName =
      type === 'success' ? 'check' :
      type === 'warning' ? 'alert-triangle' :
      type === 'error' ? 'x-circle' :
      'info';
    toast.innerHTML = `
      <span class="toast-icon"><i data-lucide="${iconName}" style="width:14px;height:14px"></i></span>
      <span class="toast-msg">${message}</span>
    `;
    stack.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => {
      toast.classList.add('is-leaving');
      setTimeout(() => toast.remove(), 200);
    }, durationMs);
  }

  function showModal({ title, body, primaryText = 'Đồng ý', secondaryText, onPrimary, onSecondary }) {
    const overlay = document.createElement('div');
    overlay.className = 'erp-modal-overlay';
    overlay.innerHTML = `
      <div class="erp-modal" role="dialog" aria-modal="true">
        <h3>${title || ''}</h3>
        <div>${body || ''}</div>
        <div class="erp-modal-actions">
          ${secondaryText ? `<button class="btn btn-secondary" data-modal-action="secondary">${secondaryText}</button>` : ''}
          <button class="btn btn-primary" data-modal-action="primary">${primaryText}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    if (window.lucide) window.lucide.createIcons();

    function close() {
      overlay.classList.add('is-leaving');
      setTimeout(() => overlay.remove(), 160);
    }
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) return close();
      if (e.target.closest('[data-modal-action="primary"]')) {
        if (onPrimary && onPrimary() === false) return; // giữ modal mở (validation thất bại)
        return close();
      }
      if (e.target.closest('[data-modal-action="secondary"]')) {
        if (onSecondary) onSecondary();
        return close();
      }
    });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });
  }

  function inferAction(text) {
    const t = (text || '').toLowerCase().trim();
    if (!t) return { type: 'info', msg: 'Đã ghi nhận thao tác' };

    if (/tạm dừng|^dừng|huỷ|hủy/.test(t))
      return { type: 'warning', msg: `Đã ghi nhận: <b>${text.trim()}</b>` };
    if (/hoàn thành|đã duyệt|^duyệt|chấp nhận|chốt|xác nhận/.test(t))
      return { type: 'success', msg: `<b>${text.trim()}</b> — đã thực hiện` };
    if (/^lưu/.test(t))
      return { type: 'success', msg: `Đã lưu thay đổi` };
    if (/^in |in phiếu|in báo|xuất file|xuất excel|export|tải về|download/.test(t))
      return { type: 'info', msg: `Đang chuẩn bị: <b>${text.trim()}</b>` };
    if (/^thêm|tạo mới|^\+|tạo lsx|tạo phiếu|tạo đơn|tạo báo giá/.test(t))
      return { type: 'info', msg: `<b>${text.trim()}</b> — mở form mới` };
    if (/^sửa|chỉnh sửa|edit/.test(t))
      return { type: 'info', msg: `<b>${text.trim()}</b> — chuyển sang chế độ chỉnh sửa` };
    if (/^xoá|^xóa|^delete/.test(t))
      return { type: 'error', msg: `<b>${text.trim()}</b> — cần xác nhận trước khi xoá` };
    if (/lọc|^tìm|filter|^search/.test(t))
      return { type: 'info', msg: `Đang lọc: <b>${text.trim()}</b>` };
    if (/gửi|send|chuyển/.test(t))
      return { type: 'success', msg: `<b>${text.trim()}</b> — đã gửi đi` };
    if (/quét qr|scan/.test(t))
      return { type: 'info', msg: `Đang quét QR…` };

    return { type: 'info', msg: `Đã ghi nhận: <b>${text.trim()}</b>` };
  }

  function isInteractive(el) {
    if (!el) return false;
    if (el.dataset && el.dataset.noInteract === 'true') return false;
    // anchor with real href: let navigate
    if (el.tagName === 'A') {
      const href = el.getAttribute('href');
      if (href && href !== '#' && !href.startsWith('javascript')) return false;
    }
    // real form submit: handled by form, not us
    if (el.tagName === 'BUTTON' && el.type === 'submit' && el.closest('form')) return false;
    // sidebar nav items handled by browser navigation
    if (el.closest('.sidebar') && el.tagName === 'A') return false;
    return true;
  }

  function handleClick(e) {
    // Sidebar: gập/mở cả nhóm (section)
    const secTitle = e.target.closest('.nav-section-title');
    if (secTitle) {
      e.preventDefault();
      const sec = secTitle.closest('.nav-section');
      if (sec) {
        sec.classList.toggle('collapsed');
        const set = collapsedSet();
        if (sec.classList.contains('collapsed')) set.add(sec.dataset.section);
        else set.delete(sec.dataset.section);
        saveCollapsed(set);
      }
      return;
    }

    // Sidebar collapsible group (parent toggle)
    const navParent = e.target.closest('.nav-parent');
    if (navParent) {
      e.preventDefault();
      const grp = navParent.closest('.nav-group');
      if (grp) grp.classList.toggle('open');
      return;
    }

    // Tabs first
    const tab = e.target.closest('[data-tab]');
    if (tab) {
      e.preventDefault();
      const group = tab.closest('[data-tab-group]') || document;
      group.querySelectorAll('[data-tab]').forEach(t => t.classList.toggle('active', t === tab));
      const targetId = tab.dataset.tab;
      if (targetId) {
        const scope = tab.closest('[data-tab-group]') || document;
        scope.querySelectorAll('[data-tab-pane]').forEach(p => {
          p.style.display = (p.dataset.tabPane === targetId) ? '' : 'none';
        });
      }
      return;
    }

    // Generic filter tabs (.tab inside .tabs) — toggle active state
    const filterTab = e.target.closest('.tabs .tab');
    if (filterTab) {
      e.preventDefault();
      const tabsContainer = filterTab.closest('.tabs');
      tabsContainer.querySelectorAll('.tab').forEach(t => t.classList.remove('tab-active'));
      filterTab.classList.add('tab-active');
      filterTab.classList.add('erp-flash');
      setTimeout(() => filterTab.classList.remove('erp-flash'), 600);
      const label = (filterTab.textContent || '').trim();
      showToast(`Lọc: <b>${label}</b>`, 'info', 1800);
      return;
    }

    // Filter pills with chevron-down (dropdown style) — show toast
    const pill = e.target.closest('.filter-pill');
    if (pill) {
      e.preventDefault();
      pill.classList.add('erp-flash');
      setTimeout(() => pill.classList.remove('erp-flash'), 600);
      showToast(`Mở bộ lọc: <b>${pill.textContent.trim().replace(/\s+/g,' ')}</b>`, 'info', 1800);
      return;
    }

    // Checkbox in table header → select all
    const headerCheckbox = e.target.closest('.tbl thead input[type="checkbox"]');
    if (headerCheckbox) {
      const all = headerCheckbox.closest('table').querySelectorAll('tbody input[type="checkbox"]');
      all.forEach(c => c.checked = headerCheckbox.checked);
      showToast(headerCheckbox.checked ? `Đã chọn ${all.length} dòng` : 'Bỏ chọn tất cả', 'info', 1500);
      return;
    }

    // Modal triggers
    const modalTrigger = e.target.closest('[data-modal-trigger]');
    if (modalTrigger) {
      e.preventDefault();
      showModal({
        title: modalTrigger.dataset.modalTitle || 'Xác nhận',
        body: modalTrigger.dataset.modalBody || 'Bạn có muốn tiếp tục?',
        primaryText: modalTrigger.dataset.modalPrimary || 'Đồng ý',
        secondaryText: modalTrigger.dataset.modalSecondary || 'Huỷ',
        onPrimary: () => showToast('Đã xác nhận', 'success'),
      });
      return;
    }

    // Generic buttons
    const btn = e.target.closest('button, .btn, .btn-primary, .btn-secondary, .btn-yellow, .btn-link, .btn-icon, .btn-ghost');
    if (!btn) return;
    if (!isInteractive(btn)) return;
    if (btn.closest('.erp-modal-overlay')) return; // modal handles itself
    if (btn.dataset.toggle) return;

    e.preventDefault();

    // Visual feedback
    btn.classList.add('erp-flash');
    setTimeout(() => btn.classList.remove('erp-flash'), 600);

    // Custom message
    if (btn.dataset.toastMsg) {
      showToast(btn.dataset.toastMsg, btn.dataset.toastType || 'info');
      return;
    }

    // Infer from button text
    let text = btn.textContent.trim();
    if (!text) text = btn.getAttribute('title') || btn.getAttribute('aria-label') || '';

    // Special: topbar bell / help / avatar
    if (btn.classList.contains('btn-icon') && /thông báo|bell/i.test(btn.getAttribute('title') || '')) {
      if (window.ERPNotify) window.ERPNotify.open();
      return;
    }
    if (btn.classList.contains('btn-icon') && /trợ giúp|help/i.test(btn.getAttribute('title') || '')) {
      showModal({
        title: 'Trợ giúp',
        body: '<p>Hệ thống ERP cho nhà máy sản xuất cửa nhôm Owin. Sử dụng sidebar bên trái để chuyển giữa các phân hệ.</p><p>Phím tắt: <code>/</code> để focus thanh tìm kiếm.</p>',
        primaryText: 'Đã hiểu',
      });
      return;
    }

    const action = inferAction(text);
    showToast(action.msg, action.type);
  }

  function handleAvatarClick(e) {
    const avatar = e.target.closest('.avatar');
    if (!avatar) return;
    e.preventDefault();
    showModal({
      title: 'Nguyễn Văn A',
      body: '<p style="color:var(--slate)">Vai trò: Quản đốc nhà máy · Đăng nhập: Hôm nay 08:12</p><p style="margin-top:12px">Phân quyền: Sản xuất, Kho, QC, Báo cáo.</p>',
      primaryText: 'Đóng',
      secondaryText: 'Đăng xuất',
      onSecondary: () => showToast('Đã đăng xuất', 'info'),
    });
  }

  function handleSearch(e) {
    const input = e.target.closest('.topbar input.input-search');
    if (!input) return;
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) showToast(`Đang tìm: <b>${q}</b>`, 'info');
    }
  }

  function highlightRows() {
    // Make table rows clickable for highlight
    document.querySelectorAll('.tbl tbody tr').forEach(tr => {
      tr.style.cursor = 'pointer';
      tr.addEventListener('click', (e) => {
        if (e.target.closest('button, a, input')) return;
        tr.parentElement.querySelectorAll('tr').forEach(r => r.classList.remove('row-selected'));
        tr.classList.add('row-selected');
      });
    });
  }

  function init() {
    if (window.__erpInteractInit) return;
    window.__erpInteractInit = true;

    document.addEventListener('click', handleClick);
    document.addEventListener('click', handleAvatarClick);
    document.addEventListener('keydown', handleSearch);

    highlightRows();

    // Welcome toast on first page load (suppressed on subsequent nav via sessionStorage)
    if (!sessionStorage.getItem('erp.welcomed')) {
      sessionStorage.setItem('erp.welcomed', '1');
      setTimeout(() => {
        showToast('Chào mừng — click bất kỳ nút nào để xem phản hồi.', 'info', 3200);
      }, 600);
    }
  }

  return { init, showToast, showModal };
})();

/* ============================================================
   ERPFilter — Bộ lọc "chọn tiêu chí" dùng chung cho mọi danh sách
   Dùng:
     var flt = ERPFilter.create('#hostEl', {
       fields: [
         { key:'customer', label:'Khách hàng', icon:'user', options: () => distinct('customer'), get: r => r.customer },
         { key:'tech', label:'Công nghệ', icon:'layers',
           options:[{value:'offset',label:'Cửa thuỷ lực'},{value:'flexo',label:'Cửa trượt quay'}], get: r => PE.typeOf(r.state) },
       ],
       onChange: renderList,   // gọi lại khi bộ lọc đổi
     });
     // trong renderList: rows = rows.filter(flt.pass);
   - field.options: mảng (chuỗi | {value,label}) HOẶC hàm trả về mảng (gọi mỗi lần mở).
   - field.get(row): lấy giá trị của bản ghi cho tiêu chí (mặc định row[key]).
   - field.multi (mặc định true): cho chọn nhiều giá trị (OR trong 1 tiêu chí, AND giữa các tiêu chí).
   ============================================================ */
window.ERPFilter = (function () {
  var openInst = null;
  document.addEventListener('click', function (e) {
    if (openInst && !e.target.closest('.erp-filter')) openInst.closePop();
  });

  function esc(s) { return String(s).replace(/"/g, '&quot;'); }

  function create(host, opts) {
    if (typeof host === 'string') host = document.querySelector(host);
    if (!host) return { pass: function () { return true; }, clear: function () {}, state: {} };
    opts = opts || {};
    var fields = (opts.fields || []).map(function (f) {
      return { key: f.key, label: f.label, icon: f.icon || 'filter', multi: f.multi !== false, options: f.options, get: f.get };
    });
    var onChange = opts.onChange || function () {};
    var state = {};            // key -> [values]
    var popField = null;       // field đang mở trong popover (null = danh sách tiêu chí)
    var inst = { state: state };

    function optionsOf(f) {
      var o = typeof f.options === 'function' ? f.options() : (f.options || []);
      return o.map(function (x) { return (x && typeof x === 'object') ? x : { value: x, label: String(x) }; });
    }
    function labelFor(f, val) {
      var o = optionsOf(f).filter(function (x) { return String(x.value) === String(val); })[0];
      return o ? o.label : val;
    }
    function activeCount() { return fields.filter(function (f) { return state[f.key] && state[f.key].length; }).length; }

    inst.pass = function (row) {
      for (var i = 0; i < fields.length; i++) {
        var f = fields[i], sel = state[f.key];
        if (!sel || !sel.length) continue;
        var v = f.get ? f.get(row) : row[f.key];
        if (sel.map(String).indexOf(String(v)) < 0) return false;
      }
      return true;
    };
    inst.clear = function () { Object.keys(state).forEach(function (k) { delete state[k]; }); inst.closePop(); render(); onChange(state); };
    inst.closePop = function () { var p = host.querySelector('.ef-pop'); if (p) p.remove(); popField = null; if (openInst === inst) openInst = null; };

    function render() {
      var html = '';
      fields.forEach(function (f) {
        var sel = state[f.key];
        if (sel && sel.length) {
          var txt = sel.length <= 2 ? sel.map(function (v) { return labelFor(f, v); }).join(', ') : (sel.length + ' mục');
          html += '<span class="ef-chip" data-field="' + f.key + '"><i data-lucide="' + f.icon + '" class="ef-ic"></i>'
            + '<span class="ef-chip-txt">' + f.label + ': <b>' + txt + '</b></span>'
            + '<button class="ef-x" data-remove="' + f.key + '" title="Bỏ lọc này"><i data-lucide="x" style="width:12px;height:12px"></i></button></span>';
        }
      });
      html += '<button class="ef-add" data-add="1"><i data-lucide="sliders-horizontal" class="ef-ic"></i>' + (activeCount() ? 'Thêm tiêu chí' : 'Lọc theo tiêu chí') + '</button>';
      if (activeCount()) html += '<button class="ef-clear" data-clear="1">Xóa lọc</button>';
      host.innerHTML = html;
      host.classList.add('erp-filter');
      if (window.lucide) lucide.createIcons();
    }

    function openPop(field) {
      inst.closePop();
      popField = field;
      var pop = document.createElement('div');
      pop.className = 'ef-pop';
      if (!field) {
        pop.innerHTML = '<div class="ef-pop-h">Chọn tiêu chí lọc</div><div class="ef-pop-body">'
          + fields.map(function (f) {
            var n = state[f.key] && state[f.key].length;
            return '<button class="ef-pop-field" data-field="' + f.key + '"><i data-lucide="' + f.icon + '" class="ef-ic"></i><span>' + f.label + '</span>'
              + (n ? '<span class="ef-badge">' + n + '</span>' : '') + '<i data-lucide="chevron-right" class="ef-arrow"></i></button>';
          }).join('') + '</div>';
      } else {
        var sel = state[field.key] || [], opts = optionsOf(field);
        pop.innerHTML = '<div class="ef-pop-h"><button class="ef-back" data-back="1"><i data-lucide="chevron-left" style="width:14px;height:14px"></i></button><span>' + field.label + '</span></div>'
          + '<div class="ef-pop-body">'
          + (opts.length ? opts.map(function (o) {
              var on = sel.map(String).indexOf(String(o.value)) >= 0;
              return '<label class="ef-opt"><input type="' + (field.multi ? 'checkbox' : 'radio') + '" name="ef-opt" value="' + esc(o.value) + '"' + (on ? ' checked' : '') + '/><span>' + o.label + '</span></label>';
            }).join('') : '<div class="ef-empty">Không có giá trị</div>')
          + '</div><div class="ef-pop-foot"><button class="ef-clearone" data-clearone="1">Bỏ chọn</button><button class="ef-apply" data-apply="1">Áp dụng</button></div>';
      }
      host.appendChild(pop);
      if (window.lucide) lucide.createIcons();
      openInst = inst;
    }

    host.addEventListener('click', function (e) {
      var rm = e.target.closest('[data-remove]');
      if (rm) { e.stopPropagation(); delete state[rm.getAttribute('data-remove')]; render(); onChange(state); return; }
      if (e.target.closest('[data-clear]')) { inst.clear(); return; }
      if (e.target.closest('[data-add]')) { e.stopPropagation(); openPop(null); return; }
      var pf = e.target.closest('.ef-pop-field');
      if (pf) { e.stopPropagation(); openPop(fields.filter(function (x) { return x.key === pf.getAttribute('data-field'); })[0]); return; }
      if (e.target.closest('[data-back]')) { e.stopPropagation(); openPop(null); return; }
      var chip = e.target.closest('.ef-chip');
      if (chip && !rm) { e.stopPropagation(); openPop(fields.filter(function (x) { return x.key === chip.getAttribute('data-field'); })[0]); return; }
      if (e.target.closest('[data-clearone]')) { e.stopPropagation(); if (popField) delete state[popField.key]; render(); onChange(state); inst.closePop(); return; }
      if (e.target.closest('[data-apply]')) {
        e.stopPropagation();
        if (popField) {
          var checked = Array.prototype.map.call(host.querySelectorAll('.ef-pop input:checked'), function (i) { return i.value; });
          if (checked.length) state[popField.key] = checked; else delete state[popField.key];
        }
        render(); onChange(state); inst.closePop(); return;
      }
    });

    render();
    return inst;
  }

  return { create: create };
})();

/* ============================================================
   ERPNotify — Trung tâm thông báo (chuông topbar)
   - Lưu trong sessionStorage để giữ qua các trang.
   - push() để bắn noti mới (vd: cấp trên duyệt báo giá) → badge đỏ + chuông rung.
   - open() mở danh sách + đánh dấu đã đọc.
   ============================================================ */
window.ERPNotify = (function () {
  var KEY = 'erp.notifs';
  function seed() {
    return [
      { title: 'Đơn DH-0312 đến hạn', sub: 'Giao trong hôm nay', time: '2 giờ trước', type: 'warning', read: false },
      { title: 'QC lô cửa #042 cần duyệt', sub: 'KCS nhôm kính chờ xác nhận', time: '3 giờ trước', type: 'info', read: false },
      { title: 'Lương kỳ T05 sắp chốt', sub: 'Hạn 25/06', time: 'hôm qua', type: 'info', read: false }
    ];
  }
  function load() {
    try { var v = JSON.parse(sessionStorage.getItem(KEY)); return Array.isArray(v) ? v : seed(); }
    catch (e) { return seed(); }
  }
  var list = load();
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }
  function unread() { return list.filter(function (n) { return !n.read; }).length; }

  function refreshBadge() {
    var b = document.getElementById('bellBadge');
    if (!b) return;
    var n = unread();
    if (n > 0) { b.textContent = n > 9 ? '9+' : n; b.hidden = false; }
    else { b.hidden = true; }
  }
  function pulse() {
    var btn = document.getElementById('bellBtn');
    if (!btn) return;
    btn.classList.remove('bell-ring'); void btn.offsetWidth; btn.classList.add('bell-ring');
  }
  function push(n) {
    list.unshift({ title: n.title || 'Thông báo', sub: n.sub || '', time: n.time || 'vừa xong', type: n.type || 'info', read: false });
    if (list.length > 30) list = list.slice(0, 30);
    save(); refreshBadge(); pulse();
    if (window.ERPInteract) window.ERPInteract.showToast('<i data-lucide="bell" style="width:13px;height:13px;vertical-align:-2px"></i> ' + (n.title || 'Thông báo'), n.type || 'info', 3200);
  }
  function open() {
    var iconFor = function (t) { return t === 'success' ? 'check-circle' : t === 'warning' ? 'alert-triangle' : t === 'error' ? 'x-circle' : 'info'; };
    var rows = list.length ? list.map(function (n) {
      return '<div class="ntf-row' + (n.read ? '' : ' unread') + '">' +
        '<span class="ntf-ic ntf-' + (n.type || 'info') + '"><i data-lucide="' + iconFor(n.type) + '" style="width:14px;height:14px"></i></span>' +
        '<div class="ntf-body"><div class="ntf-title">' + n.title + '</div>' + (n.sub ? '<div class="ntf-sub">' + n.sub + '</div>' : '') + '</div>' +
        '<span class="ntf-time">' + (n.time || '') + '</span></div>';
    }).join('') : '<div style="padding:18px;text-align:center;color:var(--ash)">Chưa có thông báo.</div>';
    window.ERPInteract.showModal({
      title: 'Thông báo',
      body: '<div class="ntf-list">' + rows + '</div>',
      primaryText: 'Đóng'
    });
    list.forEach(function (n) { n.read = true; });
    save(); refreshBadge();
  }
  return { push: push, open: open, refreshBadge: refreshBadge, list: function () { return list; } };
})();

/* ============================================================
   ERPTags — Thẻ (nhãn) khách hàng dùng CHUNG toàn app.
   - Lưu localStorage theo TÊN khách → mọi trang (CRM, Lệnh SX…) đọc cùng 1 nguồn.
   - Bảng màu cố định theo tên thẻ để nhất quán giữa các trang.
   ============================================================ */
window.ERPTags = (function () {
  var KEY = 'erp_cust_tags_nhomowin_v1';
  var PALETTE = ['#c5400a', '#2f5d3a', '#4a5560', '#9c7714', '#8a1f1f', '#3f6f8c', '#6b4a8a'];
  var PRESETS = ['Tiềm năng', 'Ưu tiên', 'Đối tác lâu năm', 'Trả đúng hạn', 'Hay trễ hẹn', 'Khó tính', 'Nhạy giá', 'Ưa giao nhanh', 'Cần chăm sóc', 'Tái ký HĐ'];
  function load() { try { var v = JSON.parse(localStorage.getItem(KEY)); return (v && typeof v === 'object') ? v : {}; } catch (e) { return {}; } }
  function save(m) { try { localStorage.setItem(KEY, JSON.stringify(m)); } catch (e) {} }
  function get(name) { return load()[String(name == null ? '' : name).trim()] || []; }
  function set(name, tags) { var m = load(); name = String(name == null ? '' : name).trim(); if (tags && tags.length) m[name] = tags.slice(); else delete m[name]; save(m); }
  function all() { return load(); }
  function color(name) { var h = 0, s = String(name || ''); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return PALETTE[h % PALETTE.length]; }
  // seed mặc định cho khách CHƯA có thẻ (không đè thẻ đã có)
  function seedDefaults(map) { var m = load(); Object.keys(map || {}).forEach(function (k) { if (!(m[k] && m[k].length)) m[k] = map[k]; }); save(m); }
  // Thẻ mặc định demo — auto seed 1 lần để mọi trang (kể cả Lệnh SX mở trực tiếp) có nhãn
  var DEFAULTS = {
    'Nhôm kính Đại Phát': ['Ưu tiên', 'Ưa giao nhanh'], 'ĐL Nhôm kính Minh Anh': ['Đối tác lâu năm', 'Trả đúng hạn'],
    'ĐL Owin Hoàng Long': ['Nhạy giá'], 'Cty Xây dựng ABC': ['Ưu tiên'], 'ĐL Owin Phương Nam': ['Đối tác lâu năm'],
    'VINHOMES OCEAN PARK': ['Đối tác lâu năm', 'Ưu tiên'], 'ECOPARK': ['Tiềm năng'], 'NHÔM KÍNH MINH AN': ['Trả đúng hạn'], 'NT XÂY DỰNG HOÀNG GIA': ['Cần chăm sóc']
  };
  try { if (!localStorage.getItem('erp_tags_seeded_nhomowin_v1')) { seedDefaults(DEFAULTS); localStorage.setItem('erp_tags_seeded_nhomowin_v1', '1'); } } catch (e) {}
  return { get: get, set: set, all: all, color: color, seedDefaults: seedDefaults, DEFAULTS: DEFAULTS, PRESETS: PRESETS };
})();

/* ============================================================
   ERPCharts — Inline SVG charts (no external dep)
   Use after `erp:ready` event so DOM is settled.
   ============================================================ */
window.ERPCharts = (function () {
  const COLORS = ['#14130f','#c5400a','#2f5d3a','#4a5560','#9c7714','#8a1f1f','#918b7e','#e85a2a','#b8b2a2'];
  const DEFAULT_COLOR = '#14130f';
  const GRID_COLOR = '#e8e3d3';
  const TEXT_MUTED = '#918b7e';
  const TEXT_AXIS = '#6b665b';

  function getEl(id) { return typeof id === 'string' ? document.getElementById(id) : id; }
  function widthOf(el) { return el.clientWidth || el.parentElement.clientWidth || 600; }

  function bar(target, data, opts = {}) {
    const el = getEl(target); if (!el) return;
    const w = widthOf(el);
    const h = opts.height || 220;
    const padT = 20, padB = 32, padL = 40, padR = 16;
    const cw = w - padL - padR, ch = h - padT - padB;
    const values = data.values;
    const max = opts.max || Math.max(...values) * 1.1;
    const color = opts.color || '#14130f';
    const colors = opts.colors;

    let grid = '';
    for (let i = 0; i <= 4; i++) {
      const y = padT + (ch * i / 4);
      const v = max * (4 - i) / 4;
      grid += `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="#e8e3d3" stroke-width="1"/>`;
      grid += `<text x="${padL - 8}" y="${y + 4}" font-size="10" fill="#918b7e" text-anchor="end">${v >= 1000 ? (v/1000).toFixed(1)+'k' : v.toFixed(v < 10 ? 2 : 0)}</text>`;
    }

    const slotW = cw / values.length;
    const barW = slotW * 0.58;
    let bars = '', labels = '';
    values.forEach((v, i) => {
      const x = padL + i * slotW + (slotW - barW) / 2;
      const bh = Math.max(2, (v / max) * ch);
      const y = padT + ch - bh;
      const c = colors ? colors[i % colors.length] : color;
      bars += `<g class="erp-chart-bar"><rect x="${x}" y="${y}" width="${barW}" height="${bh}" fill="${c}" rx="6" data-tip="${data.labels[i]}: ${v}" style="cursor:pointer"><title>${data.labels[i]}: ${v}</title></rect></g>`;
      labels += `<text x="${x + barW/2}" y="${h - padB + 18}" font-size="11" fill="#6b665b" text-anchor="middle">${data.labels[i]}</text>`;
    });

    el.innerHTML = `<svg width="100%" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block">${grid}${bars}${labels}</svg>`;
  }

  function line(target, data, opts = {}) {
    const el = getEl(target); if (!el) return;
    const w = widthOf(el);
    const h = opts.height || 220;
    const padT = 24, padB = 32, padL = 44, padR = 16;
    const cw = w - padL - padR, ch = h - padT - padB;
    const values = data.values;
    const max = opts.max || Math.max(...values) * 1.1;
    const min = opts.min !== undefined ? opts.min : (opts.startFromZero ? 0 : Math.min(...values) * 0.9);
    const color = opts.color || '#14130f';
    const fill = opts.fill;

    let grid = '';
    for (let i = 0; i <= 4; i++) {
      const y = padT + (ch * i / 4);
      const v = max - (max - min) * i / 4;
      grid += `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="#e8e3d3" stroke-width="1"/>`;
      grid += `<text x="${padL - 8}" y="${y + 4}" font-size="10" fill="#918b7e" text-anchor="end">${v >= 1000 ? (v/1000).toFixed(1)+'k' : v.toFixed(v < 10 ? 1 : 0)}</text>`;
    }

    let pts = '', dots = '', labels = '';
    values.forEach((v, i) => {
      const x = padL + (i / (values.length - 1)) * cw;
      const y = padT + ch - ((v - min) / (max - min)) * ch;
      pts += `${x},${y} `;
      dots += `<circle cx="${x}" cy="${y}" r="4" fill="${color}" stroke="#fff" stroke-width="2" data-tip="${data.labels[i]}: ${v}" style="cursor:pointer"/>`;
      labels += `<text x="${x}" y="${h - padB + 18}" font-size="11" fill="#6b665b" text-anchor="middle">${data.labels[i]}</text>`;
    });
    const fillArea = fill ? `<polygon points="${padL},${padT + ch} ${pts}${padL + cw},${padT + ch}" fill="${color}" opacity="0.08"/>` : '';

    el.innerHTML = `<svg width="100%" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block">${grid}${fillArea}<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${dots}${labels}</svg>`;
  }

  function donut(target, data, opts = {}) {
    const el = getEl(target); if (!el) return;
    const size = opts.size || 220;
    const cx = size / 2, cy = size / 2;
    const r = size / 2 - 8;
    const innerR = r * 0.62;
    const total = data.values.reduce((a, b) => a + b, 0);
    const colors = data.colors || COLORS;

    let angle = -Math.PI / 2;
    let paths = '';
    data.values.forEach((v, i) => {
      const a = (v / total) * 2 * Math.PI;
      const large = a > Math.PI ? 1 : 0;
      const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
      const x2 = cx + r * Math.cos(angle + a), y2 = cy + r * Math.sin(angle + a);
      const x3 = cx + innerR * Math.cos(angle + a), y3 = cy + innerR * Math.sin(angle + a);
      const x4 = cx + innerR * Math.cos(angle), y4 = cy + innerR * Math.sin(angle);
      paths += `<path d="M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${large} 0 ${x4} ${y4} Z" fill="${colors[i % colors.length]}" data-tip="${data.labels[i]}: ${v}" style="cursor:pointer"><title>${data.labels[i]}: ${v}</title></path>`;
      angle += a;
    });

    const centerLabel = opts.centerLabel
      ? `<text x="${cx}" y="${cy - 6}" font-size="13" fill="#6b665b" text-anchor="middle">${opts.centerLabel}</text>
         <text x="${cx}" y="${cy + 18}" font-size="22" font-weight="600" fill="#1c1c1e" text-anchor="middle">${opts.centerValue || total}</text>`
      : '';

    el.innerHTML = `<svg width="100%" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="display:block;max-width:${size}px;margin:0 auto">${paths}${centerLabel}</svg>`;
  }

  function sparkline(target, values, opts = {}) {
    const el = getEl(target); if (!el) return;
    const w = opts.width || 90;
    const h = opts.height || 28;
    const max = Math.max(...values), min = Math.min(...values);
    const range = (max - min) || 1;
    let pts = '';
    values.forEach((v, i) => {
      const x = (i / (values.length - 1)) * (w - 4) + 2;
      const y = h - 2 - ((v - min) / range) * (h - 4);
      pts += `${x},${y} `;
    });
    el.innerHTML = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><polyline points="${pts}" fill="none" stroke="${opts.color || '#14130f'}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
  }

  function stackedBar(target, data, opts = {}) {
    // data: { labels, datasets: [{name, values, color}, ...] }
    const el = getEl(target); if (!el) return;
    const w = widthOf(el);
    const h = opts.height || 220;
    const padT = 24, padB = 32, padL = 40, padR = 16;
    const cw = w - padL - padR, ch = h - padT - padB;
    const n = data.labels.length;
    const totals = data.labels.map((_, i) => data.datasets.reduce((s, ds) => s + ds.values[i], 0));
    const max = opts.max || Math.max(...totals) * 1.1;
    let grid = '';
    for (let i = 0; i <= 4; i++) {
      const y = padT + (ch * i / 4);
      const v = max * (4 - i) / 4;
      grid += `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="#e8e3d3" stroke-width="1"/>`;
      grid += `<text x="${padL - 8}" y="${y + 4}" font-size="10" fill="#918b7e" text-anchor="end">${v >= 1000 ? (v/1000).toFixed(1)+'k' : v.toFixed(0)}</text>`;
    }
    const slotW = cw / n;
    const barW = slotW * 0.58;
    let bars = '', labels = '';
    for (let i = 0; i < n; i++) {
      let cum = 0;
      const x = padL + i * slotW + (slotW - barW) / 2;
      data.datasets.forEach(ds => {
        const v = ds.values[i];
        const bh = (v / max) * ch;
        const y = padT + ch - cum - bh;
        bars += `<rect x="${x}" y="${y}" width="${barW}" height="${bh}" fill="${ds.color}"><title>${ds.name} - ${data.labels[i]}: ${v}</title></rect>`;
        cum += bh;
      });
      labels += `<text x="${x + barW/2}" y="${h - padB + 18}" font-size="11" fill="#6b665b" text-anchor="middle">${data.labels[i]}</text>`;
    }
    el.innerHTML = `<svg width="100%" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="display:block">${grid}${bars}${labels}</svg>`;
  }

  function groupedBar(target, data, opts = {}) {
    // data: { labels, datasets: [{name, values, color}, ...] } — clustered bars per label
    const el = getEl(target); if (!el) return;
    const w = widthOf(el);
    const h = opts.height || 240;
    const padT = 20, padB = 34, padL = 42, padR = 14;
    const cw = w - padL - padR, ch = h - padT - padB;
    const labels = data.labels;
    const ds = data.datasets;
    const n = labels.length;
    const allVals = ds.reduce((a, d) => a.concat(d.values), []);
    const max = opts.max || Math.max(...allVals) * 1.12;
    const uSuf = opts.unit ? ' ' + opts.unit : '';

    let grid = '';
    for (let i = 0; i <= 4; i++) {
      const y = padT + (ch * i / 4);
      const v = max * (4 - i) / 4;
      grid += `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="#e8e3d3" stroke-width="1"/>`;
      grid += `<text x="${padL - 8}" y="${y + 4}" font-size="10" fill="#918b7e" text-anchor="end">${v >= 1000 ? (v/1000).toFixed(1)+'k' : v.toFixed(v < 10 ? 1 : 0)}</text>`;
    }

    const slotW = cw / n;
    const groupW = slotW * 0.6;
    const gap = 2;
    const barW = (groupW - gap * (ds.length - 1)) / ds.length;
    let bars = '', labelEls = '';
    for (let i = 0; i < n; i++) {
      const gx = padL + i * slotW + (slotW - groupW) / 2;
      ds.forEach((d, j) => {
        const v = d.values[i];
        const bh = Math.max(2, (v / max) * ch);
        const x = gx + j * (barW + gap);
        const y = padT + ch - bh;
        bars += `<rect x="${x}" y="${y}" width="${barW}" height="${bh}" fill="${d.color}" rx="3" data-tip="${d.name} · ${labels[i]}: ${v}${uSuf}" style="cursor:pointer"><title>${d.name} · ${labels[i]}: ${v}</title></rect>`;
      });
      labelEls += `<text x="${padL + i * slotW + slotW/2}" y="${h - padB + 18}" font-size="10" fill="#6b665b" text-anchor="middle">${labels[i]}</text>`;
    }
    el.innerHTML = `<svg width="100%" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="display:block">${grid}${bars}${labelEls}</svg>`;
  }

  function radar(target, data, opts = {}) {
    // data: { labels:[...], values:[...] } — mạng nhện (spider chart)
    const el = getEl(target); if (!el) return;
    const size = opts.size || 240;
    const cx = size / 2, cy = size / 2;
    const pad = opts.pad || 36;
    const r = size / 2 - pad;
    const max = opts.max || 10;
    const n = data.labels.length;
    const color = opts.color || '#c5400a';
    const ang = i => (-Math.PI / 2) + i * (2 * Math.PI / n);
    const pt = (i, radius) => [cx + radius * Math.cos(ang(i)), cy + radius * Math.sin(ang(i))];

    let rings = '';
    const levels = 4;
    for (let L = 1; L <= levels; L++) {
      const rr = r * L / levels;
      let pts = '';
      for (let i = 0; i < n; i++) { const [x, y] = pt(i, rr); pts += `${x.toFixed(1)},${y.toFixed(1)} `; }
      rings += `<polygon points="${pts.trim()}" fill="none" stroke="#e8e3d3" stroke-width="1"/>`;
    }
    let axes = '';
    for (let i = 0; i < n; i++) { const [x, y] = pt(i, r); axes += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#e8e3d3" stroke-width="1"/>`; }

    const series = data.datasets || [{ values: data.values, color: color }];
    let polys = '', dots = '';
    series.forEach(s => {
      const col = s.color || color;
      let vpts = '';
      s.values.forEach((v, i) => {
        const rr = r * Math.max(0, Math.min(1, v / max));
        const [x, y] = pt(i, rr);
        vpts += `${x.toFixed(1)},${y.toFixed(1)} `;
        dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${col}" data-tip="${s.name ? s.name + ' · ' : ''}${data.labels[i]}: ${v}" style="cursor:pointer"/>`;
      });
      polys += `<polygon points="${vpts.trim()}" fill="${col}" fill-opacity="0.14" stroke="${col}" stroke-width="2" stroke-linejoin="round"/>`;
    });

    let labels = '';
    data.labels.forEach((lb, i) => {
      const [x, y] = pt(i, r + (opts.labelGap || 16));
      const anchor = Math.abs(x - cx) < 6 ? 'middle' : (x > cx ? 'start' : 'end');
      labels += `<text x="${x.toFixed(1)}" y="${(y + 3).toFixed(1)}" font-size="10" fill="#6b665b" text-anchor="${anchor}">${lb}</text>`;
    });

    el.innerHTML = `<svg width="100%" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="display:block;max-width:${size}px;margin:0 auto;overflow:visible">${rings}${axes}${polys}${dots}${labels}</svg>`;
  }

  return { bar, line, donut, sparkline, stackedBar, groupedBar, radar };
})();

/* ============================================================
   Chart tooltip — hiện số khi rê chuột lên cột / điểm / cung
   ============================================================ */
function initChartTip() {
  if (window.__erpChartTip) return;
  window.__erpChartTip = true;
  const tip = document.createElement('div');
  tip.id = 'erp-chart-tip';
  tip.style.cssText = 'position:fixed;z-index:2000;pointer-events:none;background:#14130f;color:#f5f1e8;font-family:Geist,Inter,sans-serif;font-size:12px;font-weight:500;padding:6px 10px;border-radius:6px;box-shadow:0 8px 20px rgba(20,19,15,.22);opacity:0;transition:opacity 120ms ease;white-space:nowrap;border-left:3px solid #c5400a;';
  document.body.appendChild(tip);
  let active = false;
  document.addEventListener('mousemove', (e) => {
    const el = e.target.closest ? e.target.closest('[data-tip]') : null;
    if (el) {
      tip.textContent = el.getAttribute('data-tip');
      tip.style.opacity = '1';
      const pad = 14, tw = tip.offsetWidth, th = tip.offsetHeight;
      let x = e.clientX + pad, y = e.clientY + pad;
      if (x + tw > window.innerWidth - 8) x = e.clientX - tw - pad;
      if (y + th > window.innerHeight - 8) y = e.clientY - th - pad;
      tip.style.left = x + 'px';
      tip.style.top = y + 'px';
      active = true;
    } else if (active) {
      tip.style.opacity = '0';
      active = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const shell = document.getElementById('app-shell');
  if (!shell) return;
  const activeRaw = shell.dataset.active || '';
  const active = NAV_ALIAS[activeRaw] || activeRaw;
  const title = shell.dataset.title || '';
  const crumb = shell.dataset.crumb || `<b>${title}</b>`;

  const role = currentRole();

  // Chốt chặn truy cập: vai trò hiện tại không có quyền vào trang này → đưa về Dashboard.
  if (active && !accessLevel(role, active) && !accessLevel(role, activeRaw)) {
    try { sessionStorage.setItem('erp.denied', JSON.stringify({ role: roleLabel(role), title })); } catch (e) {}
    window.location.replace('01-dashboard.html');
    return;
  }

  const content = shell.innerHTML;

  shell.outerHTML = `
    <div class="app">
      <aside class="sidebar">${renderSidebar(active, role)}</aside>
      <div class="main">
        <div class="topbar">${renderTopbar(title, crumb)}</div>
        <div class="content">${content}</div>
      </div>
    </div>
    <div id="toast-stack" class="toast-stack" aria-live="polite"></div>
  `;

  if (window.lucide) window.lucide.createIcons();

  // Đổi vai trò → lưu & về Dashboard (tránh đứng trên trang vai trò mới không có quyền).
  const roleSwitch = document.getElementById('roleSwitch');
  if (roleSwitch) {
    roleSwitch.addEventListener('change', (e) => {
      setRole(e.target.value);
      window.location.href = '01-dashboard.html';
    });
  }

  // Báo nếu vừa bị chặn khỏi một trang do không đủ quyền.
  try {
    const denied = JSON.parse(sessionStorage.getItem('erp.denied') || 'null');
    if (denied) {
      sessionStorage.removeItem('erp.denied');
      if (window.ERPInteract) {
        window.ERPInteract.showToast(
          `Vai trò <b>${denied.role}</b> không có quyền truy cập <b>${denied.title}</b> — đã chuyển về Dashboard.`,
          'warning', 4200);
      }
    }
  } catch (e) {}

  // Giữ vị trí cuộn của sidebar khi chuyển trang (mỗi trang là 1 file HTML riêng,
  // sidebar được dựng lại nên mặc định cuộn về đầu — lưu/khôi phục qua sessionStorage)
  const sidebarEl = document.querySelector('.sidebar');
  if (sidebarEl) {
    const SB_KEY = 'erp.sidebarScroll';
    const saved = parseInt(sessionStorage.getItem(SB_KEY) || '0', 10);
    if (saved > 0) sidebarEl.scrollTop = saved;
    let raf = 0;
    sidebarEl.addEventListener('scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        try { sessionStorage.setItem(SB_KEY, String(sidebarEl.scrollTop)); } catch (e) {}
      });
    }, { passive: true });
  }

  if (window.ERPInteract) window.ERPInteract.init();
  if (window.ERPNotify) window.ERPNotify.refreshBadge();
  initChartTip();

  // Emit ready event so page-specific code (charts, etc.) can run after DOM restructure
  document.dispatchEvent(new CustomEvent('erp:ready'));
});

/* ============================================================
   ERPQR — Mã QR sinh tại chỗ, KHÔNG phụ thuộc thư viện / mạng
   - ERPQR.svg(text, size)          → chuỗi SVG 25×25 module (deterministic theo text)
   - ERPQR.block(text, label, size) → khối HTML: SVG QR + mã text bên dưới (mono 10px)
   - ERPQR.matrix(text)             → ma trận 25×25 (0/1) nếu cần tự vẽ
   Ma trận có 3 ô định vị 7×7 (3 góc) + 1 ô căn chỉnh 5×5 góc dưới-phải + vạch nhịp;
   phần còn lại điền theo hash ổn định của text (KHÔNG random) nên in ra luôn giống nhau.
   ============================================================ */
window.ERPQR = (function () {
  var N = 25;                     // số module mỗi cạnh
  var QUIET = 2;                  // viền trắng (quiet zone)

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  // FNV-1a: hash 32-bit ổn định của chuỗi
  function h32(str) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }
  // trộn hash gốc với chỉ số ô → bit ổn định cho từng module
  function mix(base, idx) {
    var x = (base ^ Math.imul(idx + 0x9e3779b9, 2654435761)) >>> 0;
    x ^= x >>> 15; x = Math.imul(x, 2246822519) >>> 0;
    x ^= x >>> 13; x = Math.imul(x, 3266489917) >>> 0;
    x ^= x >>> 16;
    return x >>> 0;
  }

  function matrix(text) {
    var src = String(text == null ? '' : text);
    var base = h32(src || 'ERP-NHOM-OWIN');
    var g = [], fixed = [], r, c;
    for (r = 0; r < N; r++) {
      g.push([]); fixed.push([]);
      for (c = 0; c < N; c++) { g[r].push(0); fixed[r].push(false); }
    }
    function put(rr, cc, v) {
      if (rr < 0 || cc < 0 || rr >= N || cc >= N) return;
      g[rr][cc] = v ? 1 : 0; fixed[rr][cc] = true;
    }
    // ô định vị 7×7 + dải phân cách trắng 1 module
    function finder(r0, c0) {
      for (var dr = -1; dr <= 7; dr++) {
        for (var dc = -1; dc <= 7; dc++) {
          var inner = dr >= 0 && dr <= 6 && dc >= 0 && dc <= 6;
          var v = 0;
          if (inner) {
            var ring = (dr === 0 || dr === 6 || dc === 0 || dc === 6);
            var core = (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4);
            v = (ring || core) ? 1 : 0;
          }
          put(r0 + dr, c0 + dc, v);
        }
      }
    }
    finder(0, 0); finder(0, N - 7); finder(N - 7, 0);
    // ô căn chỉnh 5×5 ở góc dưới-phải
    (function alignment(r0, c0) {
      for (var dr = 0; dr < 5; dr++) {
        for (var dc = 0; dc < 5; dc++) {
          var ring = (dr === 0 || dr === 4 || dc === 0 || dc === 4);
          var core = (dr === 2 && dc === 2);
          put(r0 + dr, c0 + dc, (ring || core) ? 1 : 0);
        }
      }
    })(N - 9, N - 9);
    // vạch nhịp (timing) hàng 6 / cột 6
    for (var i = 8; i < N - 8; i++) { put(6, i, i % 2 === 0); put(i, 6, i % 2 === 0); }
    put(N - 8, 8, 1); // module tối cố định
    // phần còn lại: điền theo hash → luôn giống nhau với cùng một text
    for (r = 0; r < N; r++) {
      for (c = 0; c < N; c++) {
        if (fixed[r][c]) continue;
        g[r][c] = (mix(base, r * N + c + 1) % 1000) < 470 ? 1 : 0;
      }
    }
    return g;
  }

  function svg(text, size) {
    size = Number(size) || 96;
    var g = matrix(text);
    var total = N + QUIET * 2;
    var rects = '';
    for (var r = 0; r < N; r++) {
      var c = 0;
      while (c < N) {
        if (!g[r][c]) { c++; continue; }
        var start = c;
        while (c < N && g[r][c]) c++;
        rects += '<rect x="' + (start + QUIET) + '" y="' + (r + QUIET) + '" width="' + (c - start) + '" height="1"/>';
      }
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '"' +
      ' viewBox="0 0 ' + total + ' ' + total + '" shape-rendering="crispEdges" role="img"' +
      ' aria-label="Mã QR ' + esc(text) + '" style="display:block">' +
      '<rect width="' + total + '" height="' + total + '" fill="#ffffff"/>' +
      '<g fill="#000000">' + rects + '</g></svg>';
  }

  function block(text, label, size) {
    size = Number(size) || 96;
    return '<div class="erp-qr" style="display:inline-block;text-align:center;line-height:1.2">' +
      svg(text, size) +
      '<div class="erp-qr-code" style="font-family:var(--ff-mono,ui-monospace,SFMono-Regular,Menlo,monospace);' +
      'font-size:10px;letter-spacing:.02em;color:#14130f;margin-top:4px;word-break:break-all;max-width:' + size + 'px">' +
      esc(label == null || label === '' ? text : label) + '</div></div>';
  }

  return { svg: svg, block: block, matrix: matrix, SIZE: N };
})();

/* ============================================================
   ERPPrint — Xem trước bản in + in thật (iframe, giữ CSS trang)
   ============================================================ */
window.ERPPrint = (function () {
  // CSS cho khối overlay xem trước + tài liệu in dùng chung
  var css = document.createElement('style');
  css.id = 'erp-print-css';
  css.textContent =
    '.erp-print-overlay{position:fixed;inset:0;z-index:9000;background:rgba(20,19,15,.55);display:flex;align-items:center;justify-content:center;padding:20px;animation:overlay-in 160ms ease}' +
    '.erp-print-panel{display:flex;flex-direction:column;width:min(900px,96vw);max-height:94vh;background:var(--paper,#f5f1e8);border-radius:12px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.35)}' +
    '.erp-print-bar{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--rule,#ddd);background:var(--paper-2,#eee9dd)}' +
    '.erp-print-ttl{font-weight:700;font-size:14px;color:var(--ink,#14130f)}' +
    '.erp-print-scroll{overflow:auto;padding:22px;background:#8b877c33}' +
    '.erp-print-sheet{width:794px;max-width:100%;margin:0 auto;background:#fff;color:#14130f;padding:34px 38px;box-shadow:0 2px 14px rgba(0,0,0,.18)}' +
    /* ---- tài liệu chuẩn (dùng cho peek print & phiếu tự dựng) ---- */
    '.pdoc{font-size:12.5px;line-height:1.55;color:#14130f}' +
    '.pdoc-head{display:flex;gap:14px;align-items:center;border-bottom:2px solid #14130f;padding-bottom:12px;margin-bottom:14px}' +
    '.pdoc-logo{width:54px;height:54px;flex:none;display:flex;align-items:center;justify-content:center;background:#14130f;color:#fff;font-weight:800;font-size:20px;border-radius:8px}' +
    '.pdoc-co b{font-size:14px;letter-spacing:.02em}' +
    '.pdoc-co div{font-size:11px;color:#3d3a33}' +
    '.pdoc-title{text-align:center;font-size:18px;font-weight:800;letter-spacing:.06em;margin:16px 0 2px}' +
    '.pdoc-sub{text-align:center;font-size:11.5px;color:#55524a;margin-bottom:14px}' +
    '.pdoc-rows{width:100%;border-collapse:collapse;margin:10px 0}' +
    '.pdoc-rows td{padding:5px 8px;border:1px solid #c9c4b8;vertical-align:top}' +
    '.pdoc-rows td:first-child{width:32%;background:#f3efe6;font-weight:600}' +
    '.pdoc-items{width:100%;border-collapse:collapse;margin:12px 0}' +
    '.pdoc-items th{border:1px solid #14130f;background:#f3efe6;padding:6px 8px;font-size:11px;text-transform:uppercase;letter-spacing:.05em}' +
    '.pdoc-items td{border:1px solid #c9c4b8;padding:6px 8px}' +
    '.pdoc-items .r{text-align:right;font-variant-numeric:tabular-nums}.pdoc-items .c{text-align:center}' +
    '.pdoc-tot{text-align:right;font-size:13px;margin:8px 0}.pdoc-tot b{font-size:15px}' +
    '.pdoc-note{font-size:11.5px;color:#3d3a33;margin-top:10px}' +
    '.pdoc-sign{display:flex;gap:20px;margin-top:34px;text-align:center}' +
    '.pdoc-sign>div{flex:1}.pdoc-sign b{font-size:12px;letter-spacing:.04em}' +
    '.pdoc-sign i{display:block;font-style:normal;font-size:10.5px;color:#55524a;margin-top:2px}' +
    '.pdoc-sign .sp{height:70px}' +
    '@media print{.erp-print-overlay{position:static;background:none;padding:0}.erp-print-panel{box-shadow:none;max-height:none}}';
  document.head.appendChild(css);

  function collectStyles() {
    var out = '<base href="' + document.baseURI + '">';
    document.querySelectorAll('link[rel="stylesheet"],style').forEach(function (n) { out += n.outerHTML; });
    return out;
  }
  function printHtml(title, bodyHtml) {
    var f = document.createElement('iframe');
    f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
    document.body.appendChild(f);
    var d = f.contentDocument || f.contentWindow.document;
    d.open();
    d.write('<!doctype html><html><head><meta charset="utf-8"><title>' + title + '</title>' + collectStyles() +
      '<style>@page{size:A4;margin:12mm}body{margin:0;background:#fff!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
      '.erp-print-sheet{width:auto;max-width:none;box-shadow:none;padding:0}</style>' +
      '</head><body><div class="erp-print-sheet">' + bodyHtml + '</div></body></html>');
    d.close();
    setTimeout(function () {
      try { f.contentWindow.focus(); f.contentWindow.print(); } catch (e) {}
      setTimeout(function () { f.remove(); }, 4000);
    }, 300);
  }
  function preview(opts) { // {title, bodyHtml, printTitle}
    var ov = document.createElement('div');
    ov.className = 'erp-print-overlay';
    ov.innerHTML = '<div class="erp-print-panel">' +
      '<div class="erp-print-bar"><span class="erp-print-ttl">' + (opts.title || 'Xem trước bản in') + '</span>' +
      '<span style="flex:1"></span>' +
      '<button class="btn btn-primary" data-pp="print" data-no-interact="true"><i data-lucide="printer" style="width:14px;height:14px"></i> In / Lưu PDF</button>' +
      '<button class="btn btn-secondary" data-pp="close" data-no-interact="true">Đóng</button></div>' +
      '<div class="erp-print-scroll"><div class="erp-print-sheet">' + (opts.bodyHtml || '') + '</div></div></div>';
    document.body.appendChild(ov);
    if (window.lucide) lucide.createIcons();
    function close() { ov.remove(); document.removeEventListener('keydown', onKey, true); }
    function onKey(e) { if (e.key === 'Escape') { e.stopImmediatePropagation(); close(); } }
    document.addEventListener('keydown', onKey, true);
    ov.addEventListener('click', function (e) {
      if (e.target === ov || e.target.closest('[data-pp="close"]')) return close();
      if (e.target.closest('[data-pp="print"]')) printHtml(opts.printTitle || opts.title || 'In', ov.querySelector('.erp-print-sheet').innerHTML);
    });
    return { close: close };
  }
  // Header công ty dùng chung cho mọi phiếu
  function docHead() {
    return '<div class="pdoc-head"><div class="pdoc-logo">OW</div><div class="pdoc-co">' +
      '<b>CÔNG TY CỔ PHẦN THƯƠNG MẠI OWIN · MST 0109541582</b>' +
      '<div>Trụ sở: Số 359 đường Phúc Diễn, phường Xuân Phương, TP Hà Nội</div>' +
      '<div>Nhà máy: Số 8 Giá Ngự, Xâm Xuyên, Thường Tín, TP Hà Nội</div>' +
      '<div>Hotline: 056.386.9999 · Email: owingroup@gmail.com · Web: owin.com.vn</div>' +
      '</div></div>';
  }
  return { preview: preview, printHtml: printHtml, docHead: docHead };
})();

/* ============================================================
   ERPPeek — Xem nhanh bản ghi liên quan: drawer trượt từ PHẢI
   Chuỗi: Tính giá → Báo giá → Hợp đồng → Đơn hàng
   ============================================================ */
window.ERPPeek = (function () {
  var css = document.createElement('style');
  css.id = 'erp-peek-css';
  css.textContent =
    '.pk-overlay{position:fixed;inset:0;background:rgba(20,19,15,.42);backdrop-filter:blur(1.5px);animation:overlay-in 150ms ease}' +
    '.pk-panel{position:absolute;top:0;bottom:0;right:0;width:min(600px,94vw);display:flex;flex-direction:column;background:var(--paper,#f5f1e8);border-radius:14px 0 0 14px;overflow:hidden;box-shadow:-14px 0 48px rgba(0,0,0,.34);animation:pk-slide-in 240ms cubic-bezier(.2,.8,.25,1)}' +
    '@keyframes pk-slide-in{from{transform:translateX(100%)}to{transform:translateX(0)}}' +
    '.pk-overlay.pk-leaving{animation:overlay-out 180ms ease forwards}' +
    '.pk-overlay.pk-leaving .pk-panel{animation:pk-slide-out 180ms ease forwards}' +
    '@keyframes pk-slide-out{to{transform:translateX(100%)}}' +
    /* header hiện đại: dải màu + id lớn + chip trạng thái */
    '.pk-head{padding:16px 20px 14px;background:linear-gradient(135deg,var(--ink,#14130f),#2e2b24);color:#f5f1e8}' +
    '.pk-head-top{display:flex;align-items:center;gap:8px}' +
    '.pk-type{display:inline-flex;align-items:center;gap:6px;font-family:var(--ff-mono,monospace);font-size:9.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#e8a075}' +
    '.pk-x{margin-left:auto;display:flex;gap:8px;align-items:center}' +
    '.pk-btn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;font-size:11.5px;background:rgba(245,241,232,.08);border:1px solid rgba(245,241,232,.25);border-radius:999px;color:#f5f1e8;cursor:pointer;text-decoration:none;transition:background 120ms ease}' +
    '.pk-btn:hover{background:rgba(245,241,232,.18)}' +
    '.pk-head-id{display:flex;align-items:baseline;gap:10px;margin-top:8px}' +
    '.pk-id{font-family:var(--ff-mono,monospace);font-weight:700;font-size:21px;letter-spacing:-.01em}' +
    '.pk-chip{display:inline-flex;align-items:center;padding:3px 10px;border-radius:999px;font-size:10.5px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;background:#e8a075;color:#14130f}' +
    '.pk-chip.ok{background:#8fbf6f}.pk-chip.warn{background:#e5c454}.pk-chip.bad{background:#e07a6a}' +
    '.pk-head-sub{margin-top:4px;font-size:12.5px;color:#c9c4b8}' +
    '.pk-crumb{font-family:var(--ff-mono,monospace);font-size:9.5px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#e8a075;margin-bottom:7px}' +
    /* sửa tại chỗ */
    '.pk-edit{width:100%;box-sizing:border-box;font:inherit;font-size:13px;font-weight:600;color:var(--ink,#14130f);background:#fff;border:1px solid var(--rust,#c5400a);border-radius:6px;padding:3px 7px;outline:none}' +
    '.pk-editbar{display:flex;gap:10px;justify-content:flex-end;align-items:center;margin-top:20px;padding-top:14px;border-top:1px solid var(--rule,#ddd)}' +
    '.pk-editbar .btn{min-height:36px}' +
    /* body */
    '.pk-body{padding:6px 20px 20px;overflow-y:auto;flex:1}' +
    '.pk-sec{display:flex;align-items:center;gap:7px;margin:18px 0 8px;font-family:var(--ff-mono,monospace);font-size:10px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:var(--ink,#14130f)}' +
    '.pk-sec i{color:var(--rust,#c5400a)}' +
    '.pk-sec::after{content:"";flex:1;height:1px;background:var(--rule,#ddd)}' +
    '.pk-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 14px}' +
    '.pk-cell{background:var(--canvas,#fff);border:1px solid var(--rule,#e2ddd2);border-radius:10px;padding:8px 12px}' +
    '.pk-cell.wide{grid-column:1/-1}' +
    '.pk-cell span{display:block;font-family:var(--ff-mono,monospace);font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--ash,#6b665b);margin-bottom:2px}' +
    '.pk-cell b{font-size:13px;color:var(--ink,#14130f);font-variant-numeric:tabular-nums;line-height:1.4;word-break:break-word}' +
    '.pk-cell b.big{font-size:16px;color:var(--rust,#c5400a)}' +
    /* bảng phụ (items, versions, timeline) */
    '.pk-items{width:100%;border-collapse:collapse;font-size:12.5px;background:var(--canvas,#fff);border-radius:10px;overflow:hidden;border:1px solid var(--rule,#e2ddd2)}' +
    '.pk-items th{font-family:var(--ff-mono,monospace);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--ash,#6b665b);text-align:left;padding:7px 10px;border-bottom:1px solid var(--rule,#ddd);background:var(--paper-2,#eee9dd)}' +
    '.pk-items td{padding:7px 10px;border-bottom:1px solid var(--rule,#eee)}' +
    '.pk-items tr:last-child td{border-bottom:0}' +
    '.pk-items .r{text-align:right;font-variant-numeric:tabular-nums}' +
    '.pk-bar{height:7px;border-radius:4px;background:var(--paper-2,#e8e3d8);overflow:hidden;margin-top:5px}' +
    '.pk-bar>i{display:block;height:100%;background:var(--moss,#2f5d3a)}' +
    '.pk-tl{list-style:none;margin:0;padding:0}' +
    '.pk-tl li{position:relative;padding:0 0 12px 20px;font-size:12.5px}' +
    '.pk-tl li::before{content:"";position:absolute;left:5px;top:5px;width:7px;height:7px;border-radius:50%;background:var(--rust,#c5400a)}' +
    '.pk-tl li::after{content:"";position:absolute;left:8px;top:14px;bottom:0;width:1px;background:var(--rule,#ddd)}' +
    '.pk-tl li:last-child::after{display:none}' +
    '.pk-tl .tl-d{font-family:var(--ff-mono,monospace);font-size:10.5px;color:var(--ash,#6b665b)}' +
    /* liên kết chuỗi */
    '.pk-links{display:flex;flex-wrap:wrap;gap:8px}' +
    '.pk-pill{display:inline-flex;align-items:center;gap:7px;padding:8px 13px;font-size:12px;font-family:var(--ff-mono,monospace);background:var(--canvas,#fff);border:1px solid var(--rule,#ccc);border-radius:10px;color:var(--ink,#14130f);text-decoration:none;cursor:pointer;transition:border-color 120ms ease,transform 120ms ease}' +
    '.pk-pill:hover{border-color:var(--rust,#c5400a);color:var(--rust,#c5400a);transform:translateY(-1px)}' +
    '.pk-pill .pk-pill-t{color:var(--ash,#6b665b);font-size:9.5px;text-transform:uppercase;letter-spacing:.08em}' +
    '.pk-empty{font-size:12px;color:var(--ash,#6b665b)}';
  document.head.appendChild(css);

  var stack = [];
  function S() { return window.QuoteStore; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(n) { return (Number(n) || 0).toLocaleString('vi-VN'); }
  var TECH = { offset: 'Cửa thuỷ lực', flexo: 'Cửa trượt quay', digital: 'Cửa sổ mở quay', digitalSheet: 'Uốn vòm nhôm', wideFormat: 'Bán nhôm thanh (xá)', kts: 'Cửa sổ mở quay', wide: 'Bán nhôm thanh (xá)' };
  var META = {
    ptg:   { label: 'Phiếu tính giá', icon: 'calculator',   page: '17-tinh-gia.html?ptg=',   doc: 'PHIẾU TÍNH GIÁ THÀNH', docSub: '(Lưu hành nội bộ)' },
    bg:    { label: 'Báo giá',        icon: 'file-text',    page: '02-bao-gia.html?bg=',     doc: 'BẢNG BÁO GIÁ',         docSub: 'Quotation' },
    hd:    { label: 'Hợp đồng',       icon: 'file-check-2', page: '18-hop-dong.html?id=',    doc: 'HỢP ĐỒNG MUA BÁN HÀNG HÓA', docSub: 'V/v: cung cấp cửa nhôm & nhôm thanh định hình' },
    order: { label: 'Đơn hàng',       icon: 'shopping-cart',page: '03-don-hang.html?order=', doc: 'XÁC NHẬN ĐƠN HÀNG',    docSub: 'Sales Order Confirmation' },
    // --- các loại bản ghi bổ sung (dùng panel "Thông tin bản ghi" dựng từ store tương ứng) ---
    po:  { label: 'PO mua hàng',   icon: 'truck',           page: '13-mua-hang.html?po=',       doc: 'ĐƠN ĐẶT HÀNG (PO)',    docSub: 'Purchase Order' },
    dnm: { label: 'Đề xuất mua',   icon: 'clipboard-plus',  page: '13-de-xuat-mua.html?dnm=',   doc: 'ĐỀ XUẤT MUA HÀNG',     docSub: 'Purchase Request' },
    pt:  { label: 'Phiếu thu',     icon: 'wallet',          page: '15-ke-toan.html?pt=',        doc: 'PHIẾU THU',            docSub: 'Receipt voucher' },
    pc:  { label: 'Phiếu chi',     icon: 'wallet',          page: '15-ke-toan.html?pc=',        doc: 'PHIẾU CHI',            docSub: 'Payment voucher' },
    may: { label: 'Máy móc',       icon: 'cog',             page: '17-may-moc.html?may=',       doc: 'LÝ LỊCH MÁY',          docSub: 'Machine record' },
    bt:  { label: 'Phiếu bảo trì', icon: 'clipboard-check', page: '18-phieu-bao-tri.html?bt=',  doc: 'PHIẾU BẢO TRÌ',        docSub: 'Maintenance order' },
    sc:  { label: 'Phiếu sửa chữa',icon: 'hammer',          page: '19-sua-chua.html?sc=',       doc: 'PHIẾU SỬA CHỮA',       docSub: 'Repair order' },
    ncc: { label: 'Nhà cung cấp',  icon: 'contact',         page: '21-nha-cung-cap.html?ncc=',  doc: 'HỒ SƠ NHÀ CUNG CẤP',   docSub: 'Supplier profile' },
    mat: { label: 'Vật tư',        icon: 'package',         page: '05-kho.html?mat=',           doc: 'THẺ KHO VẬT TƯ',       docSub: 'Material card' },
    kh:  { label: 'Khách hàng',    icon: 'users',           page: '07-crm.html?kh=',            doc: 'HỒ SƠ KHÁCH HÀNG',     docSub: 'Customer profile' },
    vtm: { label: 'Linh kiện máy', icon: 'package-plus',    page: '20-vat-tu-may.html?vtm=',    doc: 'THẺ LINH KIỆN THAY THẾ', docSub: 'Spare part card' },
    bom: { label: 'Định mức BOM',  icon: 'list-tree',       page: 'bom-dinh-muc.html?bom=',     doc: 'ĐỊNH MỨC NGUYÊN VẬT LIỆU', docSub: 'Bill of materials' },
    nv:  { label: 'Nhân sự',       icon: 'id-card',         page: '22-nhan-su-ho-so.html?nv=',  doc: 'HỒ SƠ NHÂN SỰ',        docSub: 'Employee record' },
    pnk: { label: 'Phiếu nhập kho',icon: 'package-check',   page: '05-kho.html?pnk=',           doc: 'PHIẾU NHẬP KHO',       docSub: 'Goods receipt note' },
    pxk: { label: 'Phiếu xuất kho',icon: 'package-minus',   page: '05-kho.html?pxk=',           doc: 'PHIẾU XUẤT KHO',       docSub: 'Goods issue note' }
  };
  // 4 loại lõi có store thật → không tìm thấy thì báo, không mở panel rỗng
  var CORE = { ptg: 1, bg: 1, hd: 1, order: 1 };
  // Hai loại mở THẲNG màn chi tiết (feature-brief §5) — không dùng drawer
  var FULLPAGE = { lsx: '06-lsx-phieu-cong-nghe.html?id=', ptg: '17-tinh-gia.html?ptg=' };
  // nhãn tiếng Việt cho các trường thô của store
  var FLD = {
    po: 'Mã PO', ngay: 'Ngày đặt', sp: 'Mặt hàng', sl: 'Số lượng', gt: 'Giá trị', han: 'Hạn giao',
    giao: 'Ngày giao / lead time', tt: 'Trạng thái', ten: 'Tên', dm: 'Nhóm hàng', lh: 'Người liên hệ',
    sdt: 'Điện thoại', dc: 'Địa chỉ', dg: 'Đánh giá', don: 'Số đơn 6 tháng', cl: 'Điểm chất lượng',
    datQc: 'Tỷ lệ đạt QC', loi: 'Tỷ lệ lỗi', tra: 'Số đợt trả hàng', clgc: 'Nhận xét chất lượng',
    code: 'Mã', name: 'Tên', spec: 'Quy cách', unit: 'Đơn vị tính', onHand: 'Tồn kho',
    minStock: 'Tồn tối thiểu', price: 'Đơn giá', supplier: 'Nhà cung cấp', supplierName: 'Nhà cung cấp',
    id: 'Mã bản ghi', date: 'Ngày', kind: 'Loại phiếu', type: 'Loại', typeLabel: 'Nội dung',
    partner: 'Đối tượng', method: 'Hình thức', amount: 'Số tiền', reason: 'Lý do / diễn giải',
    createdBy: 'Người lập', ref: 'Chứng từ gốc', status: 'Trạng thái', note: 'Ghi chú',
    title: 'Tiêu đề', dept: 'Bộ phận', owner: 'Người phụ trách', requester: 'Người đề nghị',
    total: 'Tổng tiền', qty: 'Số lượng', dueDate: 'Hạn', needDate: 'Ngày cần',
    startDate: 'Bắt đầu', endDate: 'Kết thúc', cost: 'Chi phí', tech: 'Kỹ thuật viên',
    machine: 'Máy', machineCode: 'Mã máy', machineName: 'Tên máy', vendor: 'Nhà cung cấp'
  };
  function chipCls(st) {
    st = String(st || '').toLowerCase();
    if (/ký|duyệt|chốt|hoàn thành|đã lên đơn|chuyển đơn|đang sx|đã ghi sổ/.test(st)) return 'ok';
    if (/chờ|soạn|nháp|gửi/.test(st)) return 'warn';
    if (/từ chối|hủy|trễ|quá hạn|hết hạn/.test(st)) return 'bad';
    return '';
  }
  function pageBase() { return /\/pages\//.test(location.pathname) ? '' : 'pages/'; }
  // đọc biến toàn cục kể cả khi trang khai báo bằng `const`/`let` ở tầng script
  function gref(name) {
    try { if (window[name] != null) return window[name]; } catch (e) {}
    try { return (new Function('try{return typeof ' + name + '!=="undefined"?' + name + ':null}catch(e){return null}'))(); }
    catch (e) { return null; }
  }
  function firstArr(names) {
    for (var i = 0; i < names.length; i++) { var v = gref(names[i]); if (v && v.length) return v; }
    return null;
  }
  function findIn(arr, id, keys) {
    if (!arr || !arr.length) return null;
    for (var i = 0; i < arr.length; i++) {
      var r = arr[i]; if (!r) continue;
      for (var j = 0; j < keys.length; j++) {
        if (r[keys[j]] != null && String(r[keys[j]]).toUpperCase() === String(id).toUpperCase()) return r;
      }
    }
    return null;
  }
  function findNCC(id) {
    var m = window.NCC; if (!m) return null;
    if (m[id]) { var o = {}; for (var k in m[id]) if (Object.prototype.hasOwnProperty.call(m[id], k)) o[k] = m[id][k]; o.code = id; return o; }
    var keys = Object.keys(m);
    for (var i = 0; i < keys.length; i++) {
      if (String(m[keys[i]].ten || '').toUpperCase() === String(id).toUpperCase()) {
        var p = {}; for (var k2 in m[keys[i]]) if (Object.prototype.hasOwnProperty.call(m[keys[i]], k2)) p[k2] = m[keys[i]][k2];
        p.code = keys[i]; return p;
      }
    }
    return null;
  }
  function findPO(id) {
    var m = window.NCC_PO; if (!m) return null;
    var keys = Object.keys(m);
    for (var i = 0; i < keys.length; i++) {
      var hit = findIn(m[keys[i]], id, ['po']);
      if (hit) {
        var o = {}; for (var k in hit) if (Object.prototype.hasOwnProperty.call(hit, k)) o[k] = hit[k];
        o.supplierName = (window.NCC && window.NCC[keys[i]] && window.NCC[keys[i]].ten) || keys[i];
        return o;
      }
    }
    return null;
  }
  function getRec(type, id) {
    var s = S();
    try {
      if (type === 'ptg') return s ? s.getPTG(id) : null;
      if (type === 'bg') return s ? s.getBG(id) : null;
      if (type === 'hd') return s ? s.getContract(id) : null;
      if (type === 'order') return s ? s.getOrder(id) : null;
      if (type === 'dnm') return window.ERPPurchase ? window.ERPPurchase.get(id) : null;
      if (type === 'pt' || type === 'pc') return window.ERPCash ? window.ERPCash.get(id) : null;
      if (type === 'mat') return window.StockStore ? window.StockStore.getMaterial(id) : null;
      if (type === 'ncc') return findNCC(id);
      if (type === 'kh') return findIn(firstArr(['CUSTOMERS', 'KHACH_HANG', 'KHACHHANG', 'CRM_DATA', 'CUST']), id, ['code', 'id', 'ma', 'ten', 'name']);
      if (type === 'vtm') return findIn(firstArr(['SPARE_PARTS', 'VAT_TU_MAY', 'VATTUMAY', 'PARTS']), id, ['code', 'id', 'ma']);
      if (type === 'bom') return window.ERPBOM ? window.ERPBOM.get(id) : null;
      if (type === 'nv') return findIn(firstArr(['EMPLOYEES', 'NHAN_SU', 'NHANSU', 'HR_DATA', 'STAFF']), id, ['code', 'id', 'ma', 'maNV']);
      if (type === 'pnk' || type === 'pxk') {
        var inv = window.ERPInv; if (!inv) return null;
        if (inv.getTxn) { var t = inv.getTxn(id); if (t) return t; }
        if (inv.getDoc) { var d = inv.getDoc(id); if (d) return d; }
        var arr = (inv.txns && inv.txns()) || (inv.all && inv.all()) || (inv.list && inv.list()) || [];
        return findIn(arr, id, ['id', 'code', 'ma', 'so', 'soPhieu']);
      }
      if (type === 'po') return findPO(id);
      if (type === 'may') return findIn(firstArr(['MACHINES', 'MAY_MOC', 'MAYMOC']), id, ['code', 'id', 'ma', 'maMay']);
      if (type === 'bt') return findIn(firstArr(['MAINTENANCE', 'BAO_TRI', 'BAOTRI', 'PHIEU_BAO_TRI', 'TICKETS']), id, ['id', 'code', 'ma', 'so']);
      if (type === 'sc') return findIn(firstArr(['REPAIRS', 'SUA_CHUA', 'SUACHUA', 'PHIEU_SUA_CHUA']), id, ['id', 'code', 'ma', 'so']);
    } catch (e) {}
    return null;
  }
  function cell(k, v, opts) {
    opts = opts || {};
    if (!v && v !== 0) return '';
    return '<div class="pk-cell' + (opts.wide ? ' wide' : '') + '"><span>' + k + '</span><b class="pk-val' + (opts.big ? ' big' : '') + '">' + v + '</b>' + (opts.extra || '') + '</div>';
  }
  function sec(icon, title) { return '<div class="pk-sec"><i data-lucide="' + icon + '" style="width:12px;height:12px"></i> ' + title + '</div>'; }
  function pill(type, id, extra) {
    if (!id || !getRec(type, id)) return '';
    return '<a href="#" class="pk-pill" data-peek="' + type + ':' + esc(id) + '" data-no-interact="true">' +
      '<i data-lucide="' + META[type].icon + '" style="width:13px;height:13px"></i>' +
      '<span><span class="pk-pill-t">' + META[type].label + '</span><br>' + esc(id) + (extra ? ' · ' + esc(extra) : '') + '</span></a>';
  }

  // ---------- builders: {sub, status, bodyHtml, printPairs, printItems, signL, signR} ----------
  function buildPTG(p) {
    var st = p.state || {};
    var cost = 0; try { cost = S().lineCost(p.id) || 0; } catch (e) {}
    var qty = Number(st.quantity) || 0;
    var bgs = S().allBG().filter(function (b) { return b.ptgId === p.id; });
    var orders = S().allOrders().filter(function (o) { return o.ptgId === p.id; });
    var unitCost = (cost && qty) ? Math.round(cost / qty) : 0;
    var body =
      sec('info', 'Thông tin chung') +
      '<div class="pk-grid">' +
        cell('Khách hàng', esc(p.customer)) + cell('Sản phẩm', esc(p.product)) +
        cell('Người lập', esc(p.createdBy || '—')) + cell('Ngày lập', esc(p.date || '—')) +
        cell('Ghi chú', esc(p.note || ''), { wide: true }) +
      '</div>' +
      sec('ruler', 'Thông số kỹ thuật') +
      '<div class="pk-grid">' +
        cell('Công nghệ', TECH[st.productType] || esc(st.productType || '—')) +
        cell('Nguyên liệu chính', esc(st.paperName || '—')) +
        cell('Số loại phụ kiện', st.colors != null ? st.colors + ' loại' : '') +
        cell('Số bộ khuôn ép góc', st.plates != null ? st.plates + ' bộ' : '') +
        cell('Dây chuyền', esc(st.machineName || '')) +
        cell('Số lượt cài đặt máy', st.signatures != null ? st.signatures + ' lượt' : '') +
      '</div>' +
      sec('badge-dollar-sign', 'Giá vốn') +
      '<div class="pk-grid">' +
        cell('Số lượng', qty ? fmt(qty) : '—') +
        cell('Giá vốn / đơn vị', unitCost ? fmt(unitCost) + '₫' : '—') +
        cell('Tổng giá vốn', cost ? fmt(cost) + '₫' : '—', { big: true, wide: true }) +
      '</div>';
    var pairs = [['Khách hàng', esc(p.customer)], ['Sản phẩm', esc(p.product)],
      ['Công nghệ', TECH[st.productType] || '—'], ['Nguyên liệu', esc(st.paperName || '—')],
      ['Số lượng', fmt(qty)], ['Giá vốn / đơn', fmt(unitCost) + '₫'], ['Tổng giá vốn', fmt(cost) + '₫'],
      ['Người lập', esc(p.createdBy || '—')], ['Ngày', esc(p.date || '—')]];
    return { sub: esc(p.customer) + ' · ' + esc(p.product), status: p.status, bodyHtml: body,
      links: bgs.map(function (b) { return pill('bg', b.id, b.status); }).join('') + orders.map(function (o) { return pill('order', o.id); }).join(''),
      pairs: pairs, itemsHtml: '', signL: 'NGƯỜI LẬP PHIẾU', signR: 'TRƯỞNG PHÒNG KINH DOANH' };
  }
  function buildBG(b) {
    var vs = b.versions || [];
    var v = vs[vs.length - 1] || {};
    var price = 0;
    try {
      var PEx = window.PricingEngine || window.PE;
      var m = PEx && PEx.applyMarkup && PEx.applyMarkup(S().lineCost(b.ptgId), v.markup || 0);
      price = m ? (m.netTotal || m.total || 0) : 0;
      if (!price) { var c0 = S().lineCost(b.ptgId) || 0; price = c0 * (1 + (v.markup || 0) / 100); }
      price = Math.round(price);
    } catch (e) {}
    var orders = S().allOrders().filter(function (o) { return o.bgId === b.id; });
    var hds = [];
    orders.forEach(function (o) { try { var c = S().getContractByOrder(o.id); if (c && hds.indexOf(c) < 0) hds.push(c); } catch (e) {} });
    var verRows = vs.slice().reverse().map(function (x) {
      return '<tr><td>v' + x.v + '</td><td>' + esc(x.status || '') + '</td><td class="r">' + (x.markup != null ? x.markup + '%' : '—') + '</td><td>' + esc(x.date || '') + '</td><td>' + esc(x.createdBy || '') + '</td></tr>';
    }).join('');
    var body =
      sec('info', 'Thông tin chung') +
      '<div class="pk-grid">' +
        cell('Khách hàng', esc(b.customer)) + cell('Sản phẩm', esc(b.product)) +
        cell('Phiên bản hiện tại', 'v' + (v.v || 1)) + cell('Hiệu lực', v.validityDays ? v.validityDays + ' ngày' : '—') +
        cell('Người tạo', esc(v.createdBy || '—')) + cell('Ngày', esc(v.date || '—')) +
      '</div>' +
      sec('badge-dollar-sign', 'Giá trị') +
      '<div class="pk-grid">' +
        cell('Markup', v.markup != null ? v.markup + '%' : '—') +
        cell('Giá bán (chưa VAT)', price ? fmt(price) + '₫' : '—', { big: true }) +
        cell('Điều khoản', esc(v.terms || '—'), { wide: true }) +
        cell('Ghi chú', esc(v.note || ''), { wide: true }) +
      '</div>' +
      (verRows ? sec('history', 'Lịch sử phiên bản') +
        '<table class="pk-items"><thead><tr><th>Phiên bản</th><th>Trạng thái</th><th class="r">Markup</th><th>Ngày</th><th>Người tạo</th></tr></thead><tbody>' + verRows + '</tbody></table>' : '');
    var pairs = [['Khách hàng', esc(b.customer)], ['Sản phẩm', esc(b.product)],
      ['Phiên bản', 'v' + (v.v || 1) + ' · ' + esc(v.status || b.status)], ['Markup', (v.markup != null ? v.markup + '%' : '—')],
      ['Giá bán (chưa VAT)', price ? fmt(price) + '₫' : '—'], ['Điều khoản', esc(v.terms || '—')],
      ['Người tạo', esc(v.createdBy || '—')], ['Ngày', esc(v.date || '—')]];
    return { sub: esc(b.customer) + ' · ' + esc(b.product), status: v.status || b.status, bodyHtml: body,
      links: pill('ptg', b.ptgId) + orders.map(function (o) { return pill('order', o.id); }).join('') + hds.map(function (c) { return pill('hd', c.id, c.status); }).join(''),
      pairs: pairs, itemsHtml: '', signL: 'KHÁCH HÀNG XÁC NHẬN', signR: 'ĐẠI DIỆN BÊN BÁN' };
  }
  function buildHD(c) {
    var isFrame = c.contractType === 'nguyen_tac';
    var payM = { ck: 'Chuyển khoản', tm: 'Tiền mặt', ck_tm: 'CK + tiền mặt' }[c.payMethod] || '—';
    var shipM = { kho_kh: 'Giao tại kho khách', kho_ban: 'Nhận tại kho bên bán', npp: 'Giao qua đại lý / chành xe' }[c.deliveryTerms] || '—';
    var itemsHtml = '';
    if (!isFrame && c.items && c.items.length) {
      itemsHtml = '<table class="pk-items"><thead><tr><th>Sản phẩm</th><th class="r">SL</th><th>ĐVT</th><th class="r">Đơn giá</th><th class="r">Thành tiền</th></tr></thead><tbody>' +
        c.items.map(function (it) {
          return '<tr><td>' + esc(it.name) + '</td><td class="r">' + fmt(it.qty) + '</td><td>' + esc(it.unit || '') + '</td><td class="r">' + fmt(it.price) + '</td><td class="r">' + fmt(it.qty * it.price) + '₫</td></tr>';
        }).join('') + '</tbody></table>';
    } else if (!isFrame && c.product) {
      itemsHtml = '<table class="pk-items"><thead><tr><th>Sản phẩm</th><th class="r">SL</th><th class="r">Giá trị</th></tr></thead><tbody><tr><td>' +
        esc(c.product) + '</td><td class="r">' + fmt(c.qty) + '</td><td class="r">' + fmt(c.value) + '₫</td></tr></tbody></table>';
    }
    var tv = Number(c.targetValue) || 0, rv = Number(c.releasedValue) || 0;
    var pct = tv ? Math.min(100, Math.round(rv / tv * 100)) : 0;
    var body =
      sec('info', 'Thông tin chung') +
      '<div class="pk-grid">' +
        cell('Loại hợp đồng', isFrame ? 'Nguyên tắc (khung)' : 'Mua bán (cụ thể)') +
        cell('Khách hàng', esc(c.customer)) +
        cell('Đại diện KH', c.rep ? esc(c.rep) + (c.repTitle ? ' — ' + esc(c.repTitle) : '') : '') +
        cell('MST', esc(c.taxCode || '')) +
        cell('Người phụ trách', esc(c.owner || '')) +
        cell('File đính kèm', esc(c.file || '')) +
      '</div>' +
      sec('calendar-check', 'Hiệu lực') +
      '<div class="pk-grid">' +
        cell('Ngày ký', esc(c.signDate || '—')) + cell('Hiệu lực', esc(c.effectiveDate || '—')) +
        cell('Hết hạn', esc(c.expiryDate || '—')) +
      '</div>' +
      sec('credit-card', 'Thanh toán & giao hàng') +
      '<div class="pk-grid">' +
        cell('Tạm ứng / cọc', c.payDeposit ? c.payDeposit + '%' : '') +
        cell('Công nợ', c.payDebtDays ? c.payDebtDays + ' ngày' : '') +
        cell('Hình thức TT', payM) +
        cell('Giao hàng', shipM) +
        cell('Địa điểm giao', esc(c.deliveryPlace || '')) +
        cell('Phạt chậm giao', c.latePenalty ? c.latePenalty + '%/tuần' : '') +
      '</div>' +
      (isFrame
        ? sec('layers', 'Khung giá trị') + '<div class="pk-grid">' +
            cell('Trần giá trị', fmt(tv) + '₫') + cell('Đã dùng', fmt(rv) + '₫ (' + pct + '%)', { extra: '<div class="pk-bar"><i style="width:' + pct + '%"></i></div>' }) +
            cell('Khung giá / điều khoản', esc(c.priceTerms || ''), { wide: true }) + '</div>'
        : sec('package', 'Hàng hóa') + itemsHtml +
          '<div class="pk-grid" style="margin-top:8px">' +
            (c.subTotal ? cell('Tạm tính', fmt(c.subTotal) + '₫') + cell('VAT ' + (c.vatPct || 0) + '%', fmt(c.vatAmount) + '₫') : '') +
            cell('Tổng giá trị' + (c.subTotal ? ' (đã VAT)' : ''), fmt(c.value) + '₫', { big: true, wide: !c.subTotal }) +
          '</div>') +
      (c.note ? '<div class="pk-grid" style="margin-top:8px">' + cell('Ghi chú', esc(c.note), { wide: true }) + '</div>' : '');
    var pairs = [['Loại hợp đồng', isFrame ? 'Nguyên tắc (khung)' : 'Mua bán (cụ thể)'], ['Khách hàng', esc(c.customer)],
      ['Đại diện KH', c.rep ? esc(c.rep) + (c.repTitle ? ' — ' + esc(c.repTitle) : '') : ''], ['MST', esc(c.taxCode || '')],
      ['Ngày ký', esc(c.signDate || '—')], ['Hiệu lực', esc(c.effectiveDate || '—')], ['Hết hạn', esc(c.expiryDate || '—')],
      ['Thanh toán', (c.payDeposit ? 'Cọc ' + c.payDeposit + '% · ' : '') + (c.payDebtDays ? 'công nợ ' + c.payDebtDays + ' ngày · ' : '') + payM],
      ['Giao hàng', shipM + (c.deliveryPlace ? ' — ' + esc(c.deliveryPlace) : '')],
      isFrame ? ['Trần giá trị', fmt(tv) + '₫'] : ['Tổng giá trị (đã VAT)', fmt(c.value) + '₫'],
      ['Ghi chú', esc(c.note || '')]];
    var ordIds = isFrame ? (c.orderIds || []) : (c.orderId ? [c.orderId] : []);
    return { sub: esc(c.customer), status: c.status, bodyHtml: body,
      links: ordIds.map(function (oid) { return pill('order', oid); }).join(''),
      pairs: pairs, itemsHtml: itemsHtml, signL: 'ĐẠI DIỆN BÊN MUA', signR: 'ĐẠI DIỆN BÊN BÁN' };
  }
  function buildOrder(o) {
    var hd = null; try { hd = S().getContractByOrder(o.id); } catch (e) {}
    var po = ''; try { po = S().poCode(o); } catch (e) {}
    var pay = o.payment || {};
    var tl = (o.timeline || []).slice(-5).reverse();
    var tlHtml = tl.length
      ? sec('history', 'Dòng thời gian') + '<ul class="pk-tl">' + tl.map(function (t) {
          var d = t.date || t.time || ''; var txt = t.text || t.label || t.event || JSON.stringify(t);
          return '<li><span class="tl-d">' + esc(d) + '</span><br>' + esc(txt) + '</li>';
        }).join('') + '</ul>'
      : '';
    var prog = (o.progress != null) ? Math.min(100, Number(o.progress) || 0) : null;
    var body =
      sec('info', 'Thông tin chung') +
      '<div class="pk-grid">' +
        cell('Mã PO', esc(po || o.id)) + cell('Khách hàng', esc(o.customer)) +
        cell('Liên hệ', esc(o.contact || '')) + cell('NV kinh doanh', esc(o.salesRep || '—')) +
        cell('Ngày tạo', esc(o.createdDate || '—')) + cell('Hạn giao', esc(o.dueDate || 'Chưa đặt hạn')) +
      '</div>' +
      sec('package', 'Hàng hóa & giá trị') +
      '<div class="pk-grid">' +
        cell('Sản phẩm', esc(o.product) + (o.productNote ? '<br><small style="color:var(--ash)">' + esc(o.productNote) + '</small>' : ''), { wide: true }) +
        cell('Số lượng', fmt(o.qty)) +
        cell('Giá trị đơn', fmt(o.value) + '₫', { big: true }) +
      '</div>' +
      sec('workflow', 'Sản xuất & tiến độ') +
      '<div class="pk-grid">' +
        cell('Công đoạn hiện tại', esc(o.currentStage || '—'), prog != null ? { extra: '<div class="pk-bar"><i style="width:' + prog + '%"></i></div>' } : {}) +
        cell('Tiến độ', prog != null ? prog + '%' : '—') +
        (o.lsxId ? cell('Lệnh sản xuất', '<a class="link-order" href="' + pageBase() + '19-lsx-san-xuat.html?lsx=' + encodeURIComponent(o.lsxId) + '">' + esc(o.lsxId) + '</a>') : '') +
      '</div>' +
      ((pay.paid != null || pay.remaining != null)
        ? sec('credit-card', 'Thanh toán') + '<div class="pk-grid">' +
            cell('Đã thanh toán', fmt(pay.paid) + '₫') + cell('Còn lại', fmt(pay.remaining) + '₫') + '</div>'
        : '') +
      tlHtml;
    var pairs = [['Mã PO', esc(po || o.id)], ['Khách hàng', esc(o.customer)],
      ['Sản phẩm', esc(o.product) + (o.productNote ? ' · ' + esc(o.productNote) : '')],
      ['Số lượng', fmt(o.qty)], ['Giá trị', fmt(o.value) + '₫'],
      ['NV kinh doanh', esc(o.salesRep || '—')], ['Ngày tạo', esc(o.createdDate || '—')],
      ['Hạn giao', esc(o.dueDate || 'Chưa đặt hạn')],
      ['Công đoạn', esc(o.currentStage || '—') + (prog != null ? ' · ' + prog + '%' : '')]];
    return { sub: esc(o.customer) + ' · ' + esc(o.product), status: o.currentStage || '', bodyHtml: body,
      links: pill('bg', o.bgId) + pill('ptg', o.ptgId) + (hd ? pill('hd', hd.id, hd.status) : ''),
      pairs: pairs, itemsHtml: '', signL: 'KHÁCH HÀNG', signR: 'PHÒNG KINH DOANH' };
  }
  // Panel chung cho các loại bản ghi chưa có builder riêng: dựng từ đúng các trường
  // tìm được trong store tương ứng; không có dữ liệu thì tối giản (mã + trạng thái + mở trang gốc).
  function buildGeneric(type, id, rec) {
    rec = rec || {};
    var thin = rec.__thin === true;
    var skip = { __thin: 1, versions: 1, timeline: 1, items: 1, lines: 1, tp: 1 };
    var keys = Object.keys(rec).filter(function (k) {
      if (skip[k] || k.charAt(0) === '_') return false;
      var v = rec[k];
      if (v == null || typeof v === 'function' || typeof v === 'object') return false;
      if (String(v) === '' || String(v) === String(id)) return false;
      return true;
    });
    function disp(v) { return (typeof v === 'number' && Math.abs(v) >= 1000) ? fmt(v) : esc(v); }
    var status = '';
    ['tt', 'status', 'trangThai', 'state'].forEach(function (k) {
      if (!status && typeof rec[k] === 'string') status = rec[k];
    });
    var itemsHtml = '';
    var lines = rec.lines || rec.items;
    if (lines && lines.length && typeof lines[0] === 'object') {
      itemsHtml = '<table class="pk-items"><thead><tr><th>Nội dung</th><th class="r">SL</th><th>ĐVT</th><th class="r">Đơn giá</th><th class="r">Thành tiền</th></tr></thead><tbody>' +
        lines.map(function (it) {
          var q = Number(it.qty) || 0, pr = Number(it.price) || 0;
          return '<tr><td>' + esc(it.name || it.matName || it.code || '') + '</td><td class="r">' + fmt(q) +
            '</td><td>' + esc(it.unit || '') + '</td><td class="r">' + fmt(pr) + '</td><td class="r">' + fmt(it.amount != null ? it.amount : q * pr) + '₫</td></tr>';
        }).join('') + '</tbody></table>';
    }
    var body = sec('info', 'Thông tin bản ghi') +
      '<div class="pk-grid">' + cell('Mã bản ghi', esc(id)) +
      keys.map(function (k) { return cell(FLD[k] || k, disp(rec[k]), { wide: String(rec[k]).length > 42 }); }).join('') +
      '</div>' +
      (itemsHtml ? sec('package', 'Dòng hàng') + itemsHtml : '') +
      (thin ? '<div class="pk-empty" style="margin-top:12px">Bản ghi chưa có dữ liệu chi tiết trong hệ thống — bấm <b>Mở trang</b> để xem tại danh sách gốc.</div>' : '');
    var pairs = [['Mã bản ghi', esc(id)]].concat(keys.map(function (k) { return [FLD[k] || k, disp(rec[k])]; }));
    var sub = rec.name || rec.ten || rec.partner || rec.supplierName || rec.supplier || rec.sp || rec.typeLabel || '';
    return {
      sub: esc(sub), status: status, bodyHtml: body, links: '',
      pairs: pairs, itemsHtml: itemsHtml, signL: 'NGƯỜI LẬP', signR: 'PHỤ TRÁCH BỘ PHẬN'
    };
  }
  function build(type, rec, id) {
    if (type === 'ptg') return buildPTG(rec);
    if (type === 'bg') return buildBG(rec);
    if (type === 'hd') return buildHD(rec);
    if (type === 'order') return buildOrder(rec);
    return buildGeneric(type, id, rec);
  }

  // ---------- print doc ----------
  function printDoc(type, id, rec, b) {
    var m = META[type] || { label: 'Bản ghi', doc: 'THÔNG TIN BẢN GHI', docSub: '' };
    var body = ERPPrint.docHead() +
      '<div class="pdoc"><div class="pdoc-title">' + m.doc + '</div>' +
      '<div class="pdoc-sub">Số: ' + esc(id) + ' · ' + m.docSub + '</div>' +
      '<table class="pdoc-rows">' + b.pairs.map(function (p) {
        return (p[1] || p[1] === 0) ? '<tr><td>' + p[0] + '</td><td>' + p[1] + '</td></tr>' : '';
      }).join('') + '</table>' +
      (b.itemsHtml ? b.itemsHtml.replace(/pk-items/g, 'pdoc-items') : '') +
      '<div class="pdoc-note">Chứng từ khởi tạo từ hệ thống ERP NHÔM OWIN — chuỗi liên kết: Tính giá → Báo giá → Hợp đồng → Đơn hàng.</div>' +
      '<div class="pdoc-sign">' +
        '<div><b>' + b.signL + '</b><i>(Ký, ghi rõ họ tên)</i><div class="sp"></div></div>' +
        '<div><b>' + b.signR + '</b><i>(Ký, ghi rõ họ tên)</i><div class="sp"></div></div>' +
      '</div></div>';
    ERPPrint.preview({ title: m.label + ' ' + id + ' — bản in', printTitle: m.label + ' ' + id, bodyHtml: body });
  }

  // ---------- sửa tại chỗ trong panel ----------
  function startEdit(ov, id) {
    var panel = ov.querySelector('.pk-panel');
    if (!panel || panel.getAttribute('data-pk-edit') === '1') return;
    var vals = panel.querySelectorAll('.pk-body .pk-val');
    if (!vals.length) {
      if (window.ERPInteract) ERPInteract.showToast('Bản ghi <b>' + esc(id) + '</b> chưa có trường nào để sửa', 'warning');
      return;
    }
    panel.setAttribute('data-pk-edit', '1');
    Array.prototype.forEach.call(vals, function (el) {
      el.setAttribute('data-pk-orig', el.innerHTML);
      el.innerHTML = '<input class="pk-edit" type="text" data-no-interact="true" value="' + esc((el.textContent || '').trim()) + '"/>';
    });
    var bar = document.createElement('div');
    bar.className = 'pk-editbar';
    bar.innerHTML = '<button class="btn btn-secondary" data-pk="edit-cancel" data-no-interact="true">Huỷ</button>' +
      '<button class="btn btn-primary" data-pk="edit-save" data-no-interact="true">Lưu</button>';
    panel.querySelector('.pk-body').appendChild(bar);
    if (window.lucide) lucide.createIcons();
  }
  function endEdit(ov, keep) {
    var panel = ov.querySelector('.pk-panel');
    if (!panel || panel.getAttribute('data-pk-edit') !== '1') return;
    Array.prototype.forEach.call(panel.querySelectorAll('.pk-val'), function (el) {
      var inp = el.querySelector('input.pk-edit');
      if (!inp) return;
      if (keep) el.textContent = inp.value;
      else el.innerHTML = el.getAttribute('data-pk-orig') || '';
      el.removeAttribute('data-pk-orig');
    });
    var bar = panel.querySelector('.pk-editbar');
    if (bar) bar.remove();
    panel.setAttribute('data-pk-edit', '');
  }
  // breadcrumb "Lớp 2/3" — chỉ hiện khi đang xếp lớp
  function relabel() {
    stack.forEach(function (o, i) {
      var el = o.querySelector('[data-pk-crumb]');
      if (!el) return;
      if (stack.length > 1) { el.textContent = 'Lớp ' + (i + 1) + '/' + stack.length; el.hidden = false; }
      else { el.textContent = ''; el.hidden = true; }
    });
  }

  // ---------- panel ----------
  function open(type, id) {
    // Tính giá & Lệnh sản xuất: mở THẲNG màn chi tiết, không dùng drawer (feature-brief §5)
    if (FULLPAGE[type]) { window.location.href = pageBase() + FULLPAGE[type] + encodeURIComponent(id); return; }
    var rec = getRec(type, id);
    if (!rec) {
      if (CORE[type] || !META[type]) {
        if (window.ERPInteract) ERPInteract.showToast('Không tìm thấy bản ghi <b>' + esc(id) + '</b>', 'warning');
        return;
      }
      rec = { __thin: true }; // panel tối giản: mã + trạng thái + nút mở trang gốc
    }
    var b = build(type, rec, id);
    var m = META[type];
    var ov = document.createElement('div');
    ov.className = 'pk-overlay';
    ov.style.zIndex = 5000 + stack.length * 10;
    ov.innerHTML = '<div class="pk-panel">' +
      '<div class="pk-head">' +
        '<div class="pk-crumb" data-pk-crumb hidden></div>' +
        '<div class="pk-head-top">' +
          '<span class="pk-type"><i data-lucide="' + m.icon + '" style="width:13px;height:13px"></i> ' + m.label + '</span>' +
          '<span class="pk-x">' +
            '<button class="pk-btn" data-pk="edit" data-no-interact="true"><i data-lucide="square-pen" style="width:12px;height:12px"></i> Sửa</button>' +
            '<button class="pk-btn" data-pk="print" data-no-interact="true"><i data-lucide="printer" style="width:12px;height:12px"></i> In</button>' +
            '<a class="pk-btn" data-pk-nav="1" href="' + pageBase() + m.page + encodeURIComponent(id) + '"><i data-lucide="external-link" style="width:12px;height:12px"></i> Mở trang</a>' +
            '<button class="pk-btn" data-pk="close" data-no-interact="true"><i data-lucide="x" style="width:12px;height:12px"></i></button>' +
          '</span>' +
        '</div>' +
        '<div class="pk-head-id"><span class="pk-id">' + esc(id) + '</span>' +
          (b.status ? '<span class="pk-chip ' + chipCls(b.status) + '">' + esc(b.status) + '</span>' : '') + '</div>' +
        (b.sub ? '<div class="pk-head-sub">' + b.sub + '</div>' : '') +
      '</div>' +
      '<div class="pk-body">' +
        b.bodyHtml +
        sec('link-2', 'Đối tượng liên quan') +
        '<div class="pk-links">' + (b.links || '<span class="pk-empty">Chưa có liên kết.</span>') + '</div>' +
      '</div></div>';
    // các tầng sâu hơn trượt lệch trái dần để thấy mép tầng dưới
    ov.querySelector('.pk-panel').style.right = Math.min(stack.length * 30, 120) + 'px';
    document.body.appendChild(ov);
    stack.push(ov);
    relabel();
    if (window.lucide) lucide.createIcons();
    ov.addEventListener('click', function (e) {
      if (e.target === ov || e.target.closest('[data-pk="close"]')) { e.stopPropagation(); return closeTop(); }
      if (e.target.closest('[data-pk="print"]')) { e.stopPropagation(); return printDoc(type, id, rec, b); }
      if (e.target.closest('[data-pk="edit"]')) { e.stopPropagation(); return startEdit(ov, id); }
      if (e.target.closest('[data-pk="edit-cancel"]')) { e.stopPropagation(); return endEdit(ov, false); }
      if (e.target.closest('[data-pk="edit-save"]')) {
        e.stopPropagation();
        endEdit(ov, true);
        if (window.ERPInteract) ERPInteract.showToast('Đã lưu thay đổi bản ghi <b>' + esc(id) + '</b>', 'success');
        return;
      }
      var pk = e.target.closest('[data-peek]');
      if (pk) { e.preventDefault(); e.stopPropagation(); var parts = pk.dataset.peek.split(':'); open(parts[0], parts.slice(1).join(':')); }
    });
  }
  function closeTop() {
    var ov = stack.pop();
    if (!ov) return;
    ov.classList.add('pk-leaving');
    setTimeout(function () { ov.remove(); }, 180);
    relabel();
  }
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape' || !stack.length) return;
    if (document.querySelector('.erp-print-overlay')) return;
    closeTop();
  });
  function print(type, id) {
    var rec = getRec(type, id);
    if (!rec) { if (window.ERPInteract) ERPInteract.showToast('Không tìm thấy bản ghi <b>' + esc(id) + '</b>', 'warning'); return; }
    printDoc(type, id, rec, build(type, rec, id));
  }

  // ---------- chặn link liên kết chéo trên mọi trang → mở peek tại chỗ ----------
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a || a.dataset.pkNav) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var h = a.getAttribute('href') || '';
    var mm, type = null, id = null;
    // --- hai loại KHÔNG drawer: điều hướng thẳng tới màn chi tiết ---
    if ((mm = h.match(/[?&]lsx=([^&#]+)/))) {
      e.preventDefault(); e.stopPropagation();
      window.location.href = pageBase() + '06-lsx-phieu-cong-nghe.html?id=' + encodeURIComponent(decodeURIComponent(mm[1]));
      return;
    }
    if ((mm = h.match(/[?&]ptg=([^&#]+)/))) {
      e.preventDefault(); e.stopPropagation();
      window.location.href = pageBase() + '17-tinh-gia.html?ptg=' + encodeURIComponent(decodeURIComponent(mm[1]));
      return;
    }
    // --- các loại mở drawer xếp lớp ---
    if ((mm = h.match(/02-bao-gia\.html\?bg=([^&#]+)/))) { type = 'bg'; id = mm[1]; }
    else if ((mm = h.match(/18-hop-dong\.html\?(?:id|hd)=([^&#]+)/)) || (mm = h.match(/[?&]hd=([^&#]+)/))) { type = 'hd'; id = mm[1]; }
    else if ((mm = h.match(/03-don-hang\.html\?order=([^&#]+)/))) { type = 'order'; id = mm[1]; }
    else if ((mm = h.match(/[?&]po=([^&#]+)/))) { type = 'po'; id = mm[1]; }
    else if ((mm = h.match(/[?&]dnm=([^&#]+)/))) { type = 'dnm'; id = mm[1]; }
    else if ((mm = h.match(/[?&]pt=([^&#]+)/))) { type = 'pt'; id = mm[1]; }
    else if ((mm = h.match(/[?&]pc=([^&#]+)/))) { type = 'pc'; id = mm[1]; }
    else if ((mm = h.match(/[?&]may=([^&#]+)/))) { type = 'may'; id = mm[1]; }
    else if ((mm = h.match(/[?&]bt=([^&#]+)/))) { type = 'bt'; id = mm[1]; }
    else if ((mm = h.match(/[?&]sc=([^&#]+)/))) { type = 'sc'; id = mm[1]; }
    else if ((mm = h.match(/[?&]ncc=([^&#]+)/))) { type = 'ncc'; id = mm[1]; }
    else if ((mm = h.match(/[?&]mat=([^&#]+)/))) { type = 'mat'; id = mm[1]; }
    else if ((mm = h.match(/[?&]kh=([^&#]+)/))) { type = 'kh'; id = mm[1]; }
    else if ((mm = h.match(/[?&]vtm=([^&#]+)/))) { type = 'vtm'; id = mm[1]; }
    else if ((mm = h.match(/[?&]bom=([^&#]+)/))) { type = 'bom'; id = mm[1]; }
    else if ((mm = h.match(/[?&]nv=([^&#]+)/))) { type = 'nv'; id = mm[1]; }
    else if ((mm = h.match(/[?&]pnk=([^&#]+)/))) { type = 'pnk'; id = mm[1]; }
    else if ((mm = h.match(/[?&]pxk=([^&#]+)/))) { type = 'pxk'; id = mm[1]; }
    if (!type) return;
    id = decodeURIComponent(id);
    if (CORE[type] && !getRec(type, id)) return; // 4 loại lõi: không có bản ghi thì để link đi bình thường
    e.preventDefault();
    e.stopPropagation();
    open(type, id);
  }, true);

  return { open: open, print: print, closeTop: closeTop };
})();
