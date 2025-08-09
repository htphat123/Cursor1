# Phân tích công ty - Kể chuyện theo dòng thời gian

Website tĩnh để kể câu chuyện phát triển của công ty theo cấu trúc thời gian. Hỗ trợ:

- Mở/Thu gọn chi tiết từng sự kiện
- Mở tất cả / Thu gọn tất cả
- Tìm kiếm theo từ khóa (tiêu đề, tóm tắt, chi tiết, tag)
- Nhóm sự kiện theo năm và có thể đóng/mở theo nhóm
- Dữ liệu tách riêng dưới dạng JSON, dễ mở rộng

## Chạy dự án

1. Yêu cầu: có Python 3 để chạy server tĩnh (hoặc dùng bất kỳ HTTP server nào bạn có).
2. Chạy server:

```bash
cd story-timeline
python3 -m http.server 5173
```

Sau đó mở trình duyệt: `http://localhost:5173`

Lưu ý: Truy cập qua `file://` có thể chặn `fetch` JSON. Hãy dùng HTTP server như trên.

## Cấu trúc dự án

- `index.html`: Trang chính
- `styles.css`: Giao diện
- `app.js`: Logic render timeline, tìm kiếm, mở/thu gọn
- `data/companies.json`: Dữ liệu ví dụ

## Mở rộng dữ liệu

Thêm công ty hoặc sự kiện bằng cách chỉnh `data/companies.json` theo cấu trúc sau:

```json
{
  "id": "unique_id",
  "name": "Tên công ty",
  "summary": "Mô tả ngắn",
  "events": [
    {
      "date": "YYYY-MM-DD",
      "title": "Tiêu đề sự kiện",
      "summary": "Tóm tắt",
      "details": "(tuỳ chọn) Diễn giải chi tiết",
      "tags": ["Product", "Finance", "Strategy", "Warning"],
      "metrics": {"Chỉ số": "Giá trị"},
      "links": [{"label": "Nguồn", "url": "https://..."}]
    }
  ]
}
```

## Gợi ý tuỳ biến

- Thêm biểu đồ mini (sparkline) theo năm cho doanh thu/lợi nhuận
- Gắn màu/biểu tượng riêng cho từng loại tag
- Lưu trạng thái mở/thu gọn vào `localStorage`
- Xuất timeline ra PDF cho báo cáo