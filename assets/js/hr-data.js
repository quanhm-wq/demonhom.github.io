/* ============================================================
   Dữ liệu nhân sự dùng chung (Hồ sơ 22 + Trang chi tiết 30)
   window.HR_EMP  — hồ sơ nhân sự
   window.HR_PERF — hiệu suất & lỗi sản xuất (drill-down)
   window.HR_verdict / HR_radar — helper đánh giá
   ============================================================ */
window.HR_EMP = {
  'NV-018': { init:'TT', ten:'Trần Văn Tú', sub:'NV-018 · Cắt CNC · Vận hành chính', status:'chinhthuc', hd:'HĐLĐ-2024-018', missCert:true, chkBadge:'5/6 đủ',
    badges:'<span class="badge badge-moss">Chính thức</span> <span class="badge badge-steel">Vô thời hạn</span>',
    lifeNote:'Vào làm 12/03/2021 · thâm niên 5 năm 3 tháng',
    canhan:[['Giới tính','Nam'],['Ngày sinh · Nơi sinh','14/08/1990 · Hà Nội'],['Số CCCD','001090001221'],['Cấp ngày · Nơi cấp','10/05/2021 · Cục CS QLHC TTXH'],['Thường trú','Xâm Xuyên, Thường Tín, Hà Nội'],['Điện thoại','0938 552 112'],['Email','tu.tv@owin.vn'],['Liên hệ khẩn cấp','Vợ · 0907 233 540']],
    congviec:[['Phòng / Bộ phận','Xưởng sản xuất · Tổ Cắt CNC'],['Chức danh','Thợ cắt CNC chính'],['Máy phụ trách','Máy cắt nhôm 2 đầu lưỡi 500 CAT-01'],['Quản lý trực tiếp','Đỗ Văn Minh (Tổ trưởng cắt CNC)'],['Ngày vào làm','12/03/2021'],['Loại hợp đồng','Vô thời hạn · HĐLĐ-2024-018']],
    luong:[['Bậc lương','Bậc 5/7 · CN sản xuất'],['Hình thức lương','Khoán theo cây nhôm cắt'],['Lương cơ bản (BHXH)','6.000.000 đ'],['Số sổ BHXH','7921000482'],['MST cá nhân','8012449106'],['Ngân hàng · STK','Vietcombank · 0071000615']] },

  'NV-031': { init:'NM', ten:'Nguyễn Thị Mai', sub:'NV-031 · KCS · KCS nhôm kính', status:'chinhthuc', hd:'HĐLĐ-2024-031', missCert:false, chkBadge:'6/6 đủ',
    badges:'<span class="badge badge-moss">Chính thức</span> <span class="badge badge-orange">HĐ 1 năm</span>',
    lifeNote:'Vào làm 05/09/2024 · thâm niên 1 năm 9 tháng · HĐ hết hạn 05/09/2026',
    canhan:[['Giới tính','Nữ'],['Ngày sinh · Nơi sinh','22/03/1995 · Hà Nội'],['Số CCCD','001195003311'],['Cấp ngày · Nơi cấp','14/08/2021 · Cục CS QLHC TTXH'],['Thường trú','Tứ Hiệp, Thanh Trì, Hà Nội'],['Điện thoại','0907 441 220'],['Email','mai.nt@owin.vn'],['Liên hệ khẩn cấp','Chồng · 0938 110 022']],
    congviec:[['Phòng / Bộ phận','Khối KCS · Phòng KCS nhôm kính'],['Chức danh','KCS nhôm kính'],['Ca làm việc','Ca ngày (07:30–16:30)'],['Quản lý trực tiếp','Trần Thị Hồng (Trưởng KCS)'],['Ngày vào làm','05/09/2024'],['Loại hợp đồng','HĐ 1 năm · HĐLĐ-2024-031']],
    luong:[['Bậc lương','Bậc 3/7 · Khối KCS'],['Hình thức lương','Theo thời gian'],['Lương cơ bản (BHXH)','7.000.000 đ'],['Số sổ BHXH','7921003311'],['MST cá nhân','8033210577'],['Ngân hàng · STK','ACB · 0270114882']] },

  'NV-042': { init:'LN', ten:'Lê Hoàng Nam', sub:'NV-042 · Hoàn thiện · Thợ đóng kiện', status:'thuviec', hd:'HĐTV-2026-042',
    badges:'<span class="badge badge-orange">Thử việc</span> <span class="badge status-warning">Sắp hết TV · 3 ngày</span>',
    lifeNote:'Thử việc 21/05/2026 – 20/06/2026 · còn 3 ngày · cần quyết định nhận',
    canhan:[['Giới tính','Nam'],['Ngày sinh · Nơi sinh','07/05/1998 · Hà Nội'],['Số CCCD','001098001234'],['Cấp ngày · Nơi cấp','12/06/2021 · Cục CS QLHC TTXH'],['Thường trú','Thôn Giá Ngự, Xâm Xuyên, Thường Tín, Hà Nội'],['Điện thoại','0356 778 991'],['Email','nam.lh@owin.vn'],['Liên hệ khẩn cấp','Mẹ · 0903 221 765']],
    congviec:[['Phòng / Bộ phận','Xưởng hoàn thiện · Tổ 3 (Đóng kiện)'],['Chức danh','Thợ hoàn thiện – đóng kiện'],['Khu vực','Xưởng hoàn thiện – đóng kiện'],['Người hướng dẫn','Phạm Văn Nam (Tổ trưởng Tổ 3)'],['Ngày vào làm','21/05/2026'],['Loại hợp đồng','Thử việc 1 tháng · HĐTV-2026-042']],
    luong:[['Bậc lương','Thử việc (85% bậc 1)'],['Hình thức lương','Theo thời gian (TV)'],['Lương thử việc','6.000.000 đ'],['Lương cơ bản (BHXH)','Đóng khi ký chính thức'],['Số sổ BHXH','Cấp khi chính thức'],['Ngân hàng · STK','Chưa cập nhật']] },

  'NV-041': { init:'PH', ten:'Phạm Thu Hà', sub:'NV-041 · Văn phòng · Kế toán kho', status:'thuviec', hd:'HĐTV-2026-041',
    badges:'<span class="badge badge-orange">Thử việc</span> <span class="badge status-warning">Sắp hết TV · 5 ngày</span>',
    lifeNote:'Thử việc 19/05/2026 – 18/06/2026 · còn 5 ngày · cần quyết định nhận',
    canhan:[['Giới tính','Nữ'],['Ngày sinh · Nơi sinh','11/11/1999 · Hà Nội'],['Số CCCD','001199004422'],['Cấp ngày · Nơi cấp','20/03/2022 · Cục CS QLHC TTXH'],['Thường trú','P. Xuân Phương, Hà Nội'],['Điện thoại','0987 220 113'],['Email','ha.pt@owin.vn'],['Liên hệ khẩn cấp','Bố · 0913 556 008']],
    congviec:[['Phòng / Bộ phận','Văn phòng · Phòng Kế toán'],['Chức danh','Kế toán kho'],['Ca làm việc','Ca ngày (07:30–16:30)'],['Người hướng dẫn','Lê Thị Ngọc (Kế toán trưởng)'],['Ngày vào làm','19/05/2026'],['Loại hợp đồng','Thử việc 1 tháng · HĐTV-2026-041']],
    luong:[['Bậc lương','Thử việc (85% bậc 2)'],['Hình thức lương','Theo thời gian (TV)'],['Lương thử việc','7.200.000 đ'],['Lương cơ bản (BHXH)','Đóng khi ký chính thức'],['Số sổ BHXH','Cấp khi chính thức'],['Ngân hàng · STK','Chưa cập nhật']] },

  'NV-040': { init:'VK', ten:'Võ Minh Khôi', sub:'NV-040 · Ép góc · Phụ máy', status:'thuviec', hd:'HĐTV-2026-040',
    badges:'<span class="badge badge-orange">Thử việc</span>',
    lifeNote:'Thử việc 02/06/2026 – 01/07/2026 · còn 11 ngày',
    canhan:[['Giới tính','Nam'],['Ngày sinh · Nơi sinh','02/09/2001 · Hà Nội'],['Số CCCD','001201005533'],['Cấp ngày · Nơi cấp','05/07/2022 · Cục CS QLHC TTXH'],['Thường trú','Xã Hồng Vân, Thường Tín, Hà Nội'],['Điện thoại','0344 990 112'],['Email','khoi.vm@owin.vn'],['Liên hệ khẩn cấp','Mẹ · 0908 771 332']],
    congviec:[['Phòng / Bộ phận','Xưởng lắp ráp · Tổ 2 (Ép góc)'],['Chức danh','Phụ máy ép góc'],['Khu vực','Máy ép góc cơ EP-02'],['Người hướng dẫn','Nguyễn Văn Hải'],['Ngày vào làm','02/06/2026'],['Loại hợp đồng','Thử việc 1 tháng · HĐTV-2026-040']],
    luong:[['Bậc lương','Thử việc (85% bậc 1)'],['Hình thức lương','Theo thời gian (TV)'],['Lương thử việc','5.600.000 đ'],['Lương cơ bản (BHXH)','Đóng khi ký chính thức'],['Số sổ BHXH','Cấp khi chính thức'],['Ngân hàng · STK','Chưa cập nhật']] },

  'NV-022': { init:'ĐM', ten:'Đỗ Văn Minh', sub:'NV-022 · Cắt CNC · Tổ trưởng cắt CNC', status:'chinhthuc', hd:'HĐLĐ-2023-022', missCert:false, chkBadge:'6/6 đủ',
    badges:'<span class="badge badge-moss">Chính thức</span> <span class="badge badge-rust">HĐ 3 năm</span>',
    lifeNote:'Vào làm 15/01/2023 · thâm niên 3 năm 5 tháng · HĐ hết hạn 15/01/2027',
    canhan:[['Giới tính','Nam'],['Ngày sinh · Nơi sinh','30/06/1992 · Hà Nội'],['Số CCCD','001092006644'],['Cấp ngày · Nơi cấp','18/01/2021 · Cục CS QLHC TTXH'],['Thường trú','TT. Thường Tín, Hà Nội'],['Điện thoại','0909 332 551'],['Email','minh.dv@owin.vn'],['Liên hệ khẩn cấp','Vợ · 0938 220 119']],
    congviec:[['Phòng / Bộ phận','Xưởng sản xuất · Tổ Cắt CNC'],['Chức danh','Tổ trưởng cắt CNC'],['Máy phụ trách','Máy cắt nhôm 2 đầu lưỡi 500 CAT-02'],['Quản lý trực tiếp','Quản đốc nhà máy'],['Ngày vào làm','15/01/2023'],['Loại hợp đồng','HĐ 3 năm · HĐLĐ-2023-022']],
    luong:[['Bậc lương','Bậc 4/7 · CN sản xuất'],['Hình thức lương','Khoán theo cây nhôm cắt'],['Lương cơ bản (BHXH)','6.500.000 đ'],['Số sổ BHXH','7921006644'],['MST cá nhân','8044663012'],['Ngân hàng · STK','Vietcombank · 0071009223']] },

  'NV-009': { init:'BL', ten:'Bùi Thị Lan', sub:'NV-009 · Kinh doanh dự án · NV phát triển đại lý', status:'chinhthuc', hd:'HĐLĐ-2020-009', missCert:false, chkBadge:'6/6 đủ',
    badges:'<span class="badge badge-moss">Chính thức</span> <span class="badge badge-steel">Vô thời hạn</span>',
    lifeNote:'Vào làm 08/07/2020 · thâm niên 5 năm 11 tháng',
    canhan:[['Giới tính','Nữ'],['Ngày sinh · Nơi sinh','15/02/1989 · Hà Nội'],['Số CCCD','001189007755'],['Cấp ngày · Nơi cấp','22/04/2021 · Cục CS QLHC TTXH'],['Thường trú','P. Xuân Phương, Hà Nội'],['Điện thoại','0902 118 446'],['Email','lan.bt@owin.vn'],['Liên hệ khẩn cấp','Chồng · 0907 556 223']],
    congviec:[['Phòng / Bộ phận','Phòng Kinh doanh dự án'],['Chức danh','Nhân viên phát triển đại lý'],['Khu vực phụ trách','Miền Bắc'],['Quản lý trực tiếp','Trưởng phòng Kinh doanh dự án'],['Ngày vào làm','08/07/2020'],['Loại hợp đồng','Vô thời hạn · HĐLĐ-2020-009']],
    luong:[['Bậc lương','Bậc 4/7 · Khối KD'],['Hình thức lương','Lương + hoa hồng doanh số'],['Lương cơ bản (BHXH)','8.000.000 đ'],['Số sổ BHXH','7920007755'],['MST cá nhân','8025778009'],['Ngân hàng · STK','Techcombank · 1903556771']] },

  'NV-035': { init:'HS', ten:'Hoàng Văn Sơn', sub:'NV-035 · Uốn vòm · Thợ uốn vòm', status:'chinhthuc', hd:'HĐLĐ-2025-035', missCert:true, chkBadge:'5/6 đủ',
    badges:'<span class="badge badge-moss">Chính thức</span> <span class="badge badge-orange">HĐ 1 năm</span>',
    lifeNote:'Vào làm 03/02/2025 · thâm niên 1 năm 4 tháng · HĐ hết hạn 02/02/2027',
    canhan:[['Giới tính','Nam'],['Ngày sinh · Nơi sinh','09/12/1996 · Hà Nội'],['Số CCCD','001096008866'],['Cấp ngày · Nơi cấp','30/09/2021 · Cục CS QLHC TTXH'],['Thường trú','Xã Vân Tảo, Thường Tín, Hà Nội'],['Điện thoại','0356 220 778'],['Email','son.hv@owin.vn'],['Liên hệ khẩn cấp','Mẹ · 0905 332 110']],
    congviec:[['Phòng / Bộ phận','Xưởng định hình · Tổ 1 (Uốn vòm)'],['Chức danh','Thợ uốn vòm'],['Máy phụ trách','Máy uốn vòm nhôm CNC 3 trục UON-01'],['Quản lý trực tiếp','Tổ trưởng Tổ 1'],['Ngày vào làm','03/02/2025'],['Loại hợp đồng','HĐ 1 năm · HĐLĐ-2025-035']],
    luong:[['Bậc lương','Bậc 2/7 · CN sản xuất'],['Hình thức lương','Khoán theo mét dài uốn vòm'],['Lương cơ bản (BHXH)','5.800.000 đ'],['Số sổ BHXH','7921008866'],['MST cá nhân','8056889035'],['Ngân hàng · STK','Agribank · 6300118035']] },

  'NV-014': { init:'TB', ten:'Trần Quốc Bảo', sub:'NV-014 · Kho · Thủ kho nhôm – kính (đã nghỉ)', status:'nghi', hd:'HĐLĐ-2022-014',
    badges:'<span class="badge">Đã nghỉ việc · 04/2026</span>',
    lifeNote:'Vào làm 11/2019 · nghỉ việc 04/2026 · đã thanh lý hợp đồng',
    canhan:[['Giới tính','Nam'],['Ngày sinh · Nơi sinh','25/07/1990 · Hà Nội'],['Số CCCD','001090009977'],['Cấp ngày · Nơi cấp','15/11/2020 · Cục CS QLHC TTXH'],['Thường trú','Xã Hồng Vân, Thường Tín, Hà Nội'],['Điện thoại','0908 110 556'],['Email','—'],['Liên hệ khẩn cấp','—']],
    congviec:[['Phòng / Bộ phận','Kho · Kho nhôm – kính'],['Chức danh','Thủ kho nhôm – kính'],['Ngày vào làm','11/2019'],['Ngày nghỉ việc','04/2026'],['Lý do','Chuyển công tác'],['Loại hợp đồng','Đã thanh lý HĐ']],
    luong:[['Bậc lương','Bậc 4/7 (cũ)'],['Hình thức lương','Theo thời gian'],['Tình trạng lương','Đã chốt & thanh toán 04/2026'],['Sổ BHXH','Đã chốt & trả NV'],['MST cá nhân','8011990014'],['Ngân hàng · STK','Đã ngừng chi trả']] }
};

window.HR_PERF = {
  'NV-018': { diem:94, ns:96, cl:95, dh:92, cp:100, sanLuong:'86.500 kg nhôm cắt CNC', tyLeLoi:'0,6%', defects:[
    { ma:'BB-2026-018', loai:'BB', ngay:'09/06/2026', loaiLoi:'CAT-SAI-KT · Cắt sai kích thước (>2mm)', congDoan:'Cắt CNC · máy CAT-01', don:'LSX-2206', kh:'Nhôm kính Đại Phát', slHong:'48 cây nhôm phải cắt lại', giaTri:1200000, anhHuong:'Nội bộ (xử lý lại)', truLuong:'Đang trừ · 1 kỳ', nguyenNhan:'Nhập sai kích thước trên máy cắt, không cắt thử cây đầu trước khi chạy loạt' },
    { ma:'PL-2026-049', loai:'PL', ngay:'12/06/2026', loaiLoi:'Cài đặt máy chậm gây trễ ca', congDoan:'Chuẩn bị lệnh cắt', don:'LSX-2211', kh:'Nội bộ', slHong:'Không thiệt hại vật tư · nhắc nhở', giaTri:180000, anhHuong:'Nội bộ', truLuong:'Chưa trừ · nhắc nhở', nguyenNhan:'Lấy nhôm thanh từ kho chậm, lập trình CNC chậm đầu ca' } ] },
  'NV-022': { diem:88, ns:90, cl:85, dh:88, cp:86, sanLuong:'74.200 kg nhôm cắt CNC', tyLeLoi:'0,9%', defects:[
    { ma:'BB-2026-022', loai:'BB', ngay:'06/06/2026', loaiLoi:'Hao hụt cắt nhôm vượt định mức (đầu mẩu)', congDoan:'Cắt CNC · máy CAT-02', don:'LSX-2208', kh:'Nội bộ', slHong:'+128 kg nhôm đầu mẩu vượt định mức', giaTri:620000, anhHuong:'Nội bộ', truLuong:'Đã trừ xong', nguyenNhan:'Không tối ưu sơ đồ cắt trên cây 5,8m, bỏ nhiều đầu mẩu dài' } ] },
  'NV-035': { diem:80, ns:82, cl:74, dh:84, cp:80, sanLuong:'1.860 md uốn vòm', tyLeLoi:'1,8%', defects:[
    { ma:'BB-2026-035', loai:'BB', ngay:'05/06/2026', loaiLoi:'UON-NUT · Nứt/gãy thanh khi uốn vòm', congDoan:'Uốn vòm · máy UON-01', don:'LSX-2205', kh:'Nội bộ', slHong:'6 cây nhôm 120 nứt, bồi thường giá thành lô', giaTri:480000, anhHuong:'Nội bộ', truLuong:'Đã trừ xong', nguyenNhan:'Bán kính uốn nhỏ hơn cho phép, không gia nhiệt trước khi uốn' },
    { ma:'PL-2026-044', loai:'PL', ngay:'11/06/2026', loaiLoi:'UON-MEO · Méo tiết diện sau uốn', congDoan:'Uốn vòm · máy UON-01', don:'LSX-2209', kh:'Nội bộ', slHong:'2,4 md thanh vòm lỗi nhẹ (đã loại)', giaTri:95000, anhHuong:'Nội bộ', truLuong:'Chưa trừ · nhắc nhở', nguyenNhan:'Không thay con lăn đỡ đúng tiết diện hệ 120 đầu ca' } ] },
  'NV-040': { diem:68, ns:70, cl:60, dh:75, cp:68, sanLuong:'TV · 460 khung cánh ép góc', tyLeLoi:'5,2%', defects:[
    { ma:'BB-2026-040', loai:'BB', ngay:'08/06/2026', loaiLoi:'EP-HO-MOI · Mối ép góc hở, lộ khe', congDoan:'Ép góc · máy EP-02', don:'LSX-2210', kh:'Nội bộ', slHong:'26 khung cánh phải ép lại', giaTri:850000, anhHuong:'Nội bộ', truLuong:'Đang trừ · 2 kỳ', nguyenNhan:'Canh dao ép sai, không kiểm mối ép cánh đầu chuyền — thao tác chưa thành thạo (đang thử việc)' },
    { ma:'PL-2026-047', loai:'PL', ngay:'10/06/2026', loaiLoi:'Vi phạm an toàn lao động', congDoan:'Ép góc · máy EP-02', don:'—', kh:'Nội bộ', slHong:'Quên dán nhãn cảnh báo khu vực dao ép', giaTri:120000, anhHuong:'An toàn LĐ', truLuong:'Chưa trừ · nhắc nhở', nguyenNhan:'Quên quy định dán nhãn cảnh báo khu vực dao ép máy ép góc' } ] },
  'NV-031': { diem:79, ns:85, cl:70, dh:80, cp:78, sanLuong:'KCS 62 bộ cửa / kỳ', tyLeLoi:'Sót 1 lô ra khách', defects:[
    { ma:'BB-2026-031', loai:'BB', ngay:'07/06/2026', loaiLoi:'GIOANG-HO · Kiểm hàng sót lỗi hở gioăng', congDoan:'KCS xuất xưởng', don:'DH-0312', kh:'Nhôm kính Đại Phát', slHong:'Cả lô đã giao bị hở gioăng, không kín nước', giaTri:4500000, anhHuong:'Khách hàng', truLuong:'Đang trừ · dồn nhiều kỳ', nguyenNhan:'Bỏ sót bước thử kín nước, tần suất lấy mẫu kiểm chưa đủ' },
    { ma:'PL-2026-051', loai:'PL', ngay:'11/06/2026', loaiLoi:'Đếm thiếu phụ kiện khi đóng kiện', congDoan:'Hoàn thiện · đóng kiện', don:'LSX-2207', kh:'Nội bộ', slHong:'Thiếu 2 bộ khoá · đã bù nội bộ', giaTri:350000, anhHuong:'Nội bộ', truLuong:'Chưa trừ', nguyenNhan:'Đếm thủ công, không đối chiếu phiếu đóng kiện' } ] },
  'NV-042': { diem:85, ns:86, cl:84, dh:85, cp:88, sanLuong:'TV · 318 bộ cửa đóng kiện', tyLeLoi:'0,7%', defects:[] },
  'NV-041': { diem:84, ns:84, cl:86, dh:82, cp:88, sanLuong:'Văn phòng · 19 phiếu/ngày', tyLeLoi:'—', defects:[] },
  'NV-009': { diem:90, ns:92, cl:90, dh:88, cp:92, sanLuong:'KD · 36 đơn / kỳ', tyLeLoi:'—', defects:[] }
};

window.HR_verdict = function (p) {
  var dims = [['Năng suất', p.ns], ['Chất lượng', p.cl], ['Đúng hạn', p.dh], ['Chấp hành', p.cp]];
  var low = dims.reduce(function (a, b) { return b[1] < a[1] ? b : a; });
  var cls, label;
  if (p.diem >= 90) { cls = 'good'; label = 'Xuất sắc'; }
  else if (p.diem >= 80) { cls = 'good'; label = 'Tốt'; }
  else if (p.diem >= 70) { cls = 'mid'; label = 'Cần cải thiện'; }
  else { cls = 'bad'; label = 'Chưa đạt'; }
  var nBB = p.defects.filter(function (d) { return d.loai === 'BB'; }).length;
  var dmg = p.defects.reduce(function (s, d) { return s + d.giaTri; }, 0);
  return { cls: cls, label: label, low: low[0], nBB: nBB, dmg: dmg };
};

window.HR_radar = function (p) {
  var hasATLD = p.defects.some(function (d) { return /an toàn/i.test(d.loaiLoi || ''); });
  return { labels: ['Năng suất', 'Chất lượng', 'Đúng hạn', 'Chấp hành', 'An toàn LĐ', 'Hợp tác'],
    values: [p.ns, p.cl, p.dh, p.cp, hasATLD ? 65 : 95, Math.round((p.ns + p.cp) / 2)] };
};
