# Hướng Dẫn Cấu Hình

## Cài Đặt

1. **Copy file config mẫu:**
   ```
   copy config.example.js config.js
   ```

2. **Lấy Pixabay API Key (miễn phí):**
   - Truy cập: https://pixabay.com/api/docs/
   - Đăng ký tài khoản
   - Copy API key của bạn

3. **Cập nhật config.js:**
   - Mở file `config.js`
   - Thay thế `YOUR_PIXABAY_API_KEY_HERE` bằng API key thật
   - Điều chỉnh DECK_NAME và MODEL_NAME nếu cần

4. **Load extension vào Chrome:**
   - Mở `chrome://extensions/`
   - Bật "Developer mode"
   - Click "Load unpacked"
   - Chọn thư mục chứa extension này

## Lưu Ý Bảo Mật

- File `config.js` chứa API keys nhạy cảm, **KHÔNG BAO GIỜ** commit lên Git
- File đã được thêm vào `.gitignore` để tránh lỗi commit nhầm
- Chỉ chia sẻ file `config.example.js` làm mẫu

## Cấu Trúc Files

- `background.js` - Script chính của extension
- `config.js` - Chứa API keys (không commit)
- `config.example.js` - File mẫu (có thể commit)
- `manifest.json` - Cấu hình Chrome extension
- `.gitignore` - Danh sách files không commit
