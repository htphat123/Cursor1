# Phân tích công ty - Kể chuyện theo dòng thời gian

Website tĩnh để kể câu chuyện phát triển của công ty theo cấu trúc thời gian. Hỗ trợ:

- Mở/Thu gọn chi tiết từng sự kiện
- Mở tất cả / Thu gọn tất cả
- Tìm kiếm theo từ khóa (tiêu đề, tóm tắt, chi tiết, tag)
- Nhóm sự kiện theo năm và có thể đóng/mở theo nhóm
- Dữ liệu tách riêng: mỗi công ty là một tệp JSON riêng, có `index.json` làm danh sách

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
- `data/companies/index.json`: Danh sách công ty (id, name, summary ngắn)
- `data/companies/<id>.json`: Chi tiết từng công ty (events...)

## Định dạng dữ liệu

- `data/companies/index.json`

```json
{
  "companies": [
    { "id": "apple", "name": "Apple Inc.", "summary": "Tóm tắt ngắn" }
  ]
}
```

- `data/companies/<id>.json`

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

## Cách thêm công ty mới

1. Thêm một tệp mới: `data/companies/<id>.json` theo định dạng trên.
2. Cập nhật `data/companies/index.json` để thêm `{ id, name, summary }`.
3. Reload trang. Ứng dụng sẽ tải chi tiết khi bạn chọn công ty đó.

## Gợi ý tuỳ biến

- Thêm biểu đồ mini (sparkline) theo năm cho doanh thu/lợi nhuận
- Gắn màu/biểu tượng riêng cho từng loại tag
- Lưu trạng thái mở/thu gọn vào `localStorage`
- Xuất timeline ra PDF cho báo cáo