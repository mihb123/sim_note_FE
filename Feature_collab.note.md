## Cải thiện:
- [ ] Chưa xử lý conflict
Tình huống: Client A đang ở version 10, edit text -> tạo version 11 (local). Trước khi A kịp push lên server, Client B đã push một thay đổi khác lên server -> Server nhảy lên version 11.
Giải pháp: Client A phải nhận changes của B về -> Rebase changes của A lên trên changes của B -> Push lại với version mới.

Tình huống: Client A xóa ký tự ở index 5. Client B chèn ký tự ở index 10.
Giải pháp: CodeMirror receiveUpdates và sendableUpdates tự động tính toán lại (map) các thay đổi này thông qua ChangeSet miễn là version đúng.

- [ ] Handle cập nhật title

### Backend:
- [ ] Tạo 1 job để merge changes vào content hoặc title và xóa các row đã merge trong bảng note_version
- [ ] Update lại các note_version thành các update lớn
