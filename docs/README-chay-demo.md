# ERP NHÔM OWIN — hướng dẫn chạy demo

```bash
cd "/Users/mac/Documents/Ai/khách hàng/Nhôm Owin/erp-nhom-owin" && node serve.js
```
Mở http://localhost:8123 — lần đầu nhấn **Cmd+R** một lần vì key localStorage đã đổi sang
`erp_*_nhomowin_*` nên hệ thống sẽ nạp lại dữ liệu mẫu ngành nhôm.

## Đường demo gợi ý (15 phút, bám đúng chuỗi tiền)
1. **Tính giá thành** → danh sách phiếu → bấm một dòng (mở *ngay trong trang*, không trượt)
   → xem bóc tách chi phí → **[→ Tạo báo giá]**.
2. **Báo giá** → bấm dòng (drawer trượt phải, sửa được) → **[Xem trước bản in]** →
   **[→ Tạo hợp đồng]**.
3. **Hợp đồng** → mở HĐ xuất khẩu ALUMEX (Singapore) → **[In]** → đổi sang mẫu
   **SALES CONTRACT** tiếng Anh (13 điều, FOB Hải Phòng, Incoterms 2020, VIAC).
4. **Đơn hàng bán** → [+ Đơn hàng mới] chọn hàng **từ tồn kho** (thử nhập quá tồn để thấy bị chặn)
   → gắn hợp đồng → xác nhận (trừ tồn) → mở bản ghi → **[+ Tạo phiếu thu tiền]** →
   **[→ Phát lệnh sản xuất]**.
5. **Kế hoạch sản xuất** → tab **Lệnh dự thảo** → **[Kế hoạch nguyên liệu]** (thiếu/đủ ghi rõ cả hai)
   → **[→ Tạo đề xuất mua]** → phát hành lệnh → nhảy sang tab **Lệnh đã phát hành**.
6. **Mua hàng** → Đề xuất mua (tự động / theo phòng ban) → tạo PO → tab **PO đã đặt** →
   [Nhận hàng] (tăng tồn NVL) → tab **PO đã nhập** → **[+ Trả tiền cho nhà cung cấp]** (phiếu chi 02-TT).
7. **Sản xuất** → Lệnh dạng **danh sách** → bấm một lệnh (mở *cả trang*) → đây là màn công nhân:
   [Bắt đầu]/[Kết thúc] từng bước, nhập đạt/lỗi/phế, [Nhập nguyên liệu] (trừ tồn, in phiếu có QR),
   [Nhập thành phẩm] (đối chiếu BOM → hoàn nhập thừa / cấp bù thiếu, chọn **Kho lưu** hay **Kho bán hàng**),
   [Báo sự cố máy] → sinh phiếu sửa chữa thật. Cuộn xuống xem **phân tích lỗi hỏng & quá thời gian**
   có cột Máy tham gia + Người phụ trách.
   Xem tiếp cùng dữ liệu đó ở dạng **Kanban** và **Gantt**.
8. **Thiết bị** → Quản lý máy móc → mở CAT-01: kỹ thuật / khấu hao / bảo trì / năng lực (OEE = A×P×Q)
   → **[+ Tạo phiếu bảo trì]** → nhảy thẳng sang bản ghi vừa tạo.
9. **Báo cáo thiệt hại** — chốt câu chuyện: 111 bản ghi, ~484 triệu trong 56 ngày,
   Pareto chạm 80% ở nguyên nhân thứ 7. Bấm bất kỳ con số đỏ nào để truy ngược về bản ghi hiện trường.

## Quy ước liên kết
- Mọi mã bản ghi trong bảng là **link trường**: bấm mở **drawer trượt phải xếp lớp**, Esc hoặc ✕
  đóng **từng lớp một** (góc panel hiện `Lớp 2/3`). Drawer có nút **[Sửa]** sửa tại chỗ.
- **Hai ngoại lệ không dùng drawer**: *Tính giá thành* và *Lệnh sản xuất* — bấm vào mở thẳng màn chi tiết.
- Bản in luôn nổi trên mọi lớp (z-index 9000), luôn có [Xem trước] trước khi [In].

## Quy ước màu cảnh báo
Đỏ `#8a1f1f` = kém hiệu quả (trễ hạn, lỗi cao, hao vượt định mức, công nợ quá hạn).
Xanh lá `#1f6b3a` = làm tốt (xong sớm, hao dưới định mức, tỷ lệ đạt ≥99%).
`—` = bình thường. Chỉ khoảng 30% số dòng có cảnh báo — cố ý, để bảng không bị nhiễu.
