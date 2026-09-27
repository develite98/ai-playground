# AI Playground — Từ zero đến aha!

Website React + TypeScript + Vite gồm 24 slide tiếng Việt để chia sẻ nền tảng AI cho developer mới bắt đầu. Source chính nằm trong D:\ai-playground.

## Chạy local

Yêu cầu Node.js >=22.13.

```powershell
cd D:\ai-playground
npm install
npm run dev
```

Mở URL do Vite hiển thị (mặc định http://127.0.0.1:5173). Nếu PowerShell chặn npm.ps1, dùng npm.cmd thay npm.

```powershell
npm run build
npm start
```

Build tĩnh ở dist/. Có thể đưa thư mục này lên static hosting. Không có backend, API key hay yêu cầu chạy hệ thống D:\RAG. Sau khi cài dependencies, local app chạy không cần internet; chỉ các link tài liệu ngoài cần mạng.

## Điều khiển

- Nút Tiếp theo / quay lại và phím mũi tên trái, phải (khi không focus control).
- Nội dung: nhảy đến bất cứ slide nào.
- Toàn màn hình: trình chiếu nếu browser hỗ trợ.
- Hiểu thêm một chút: ghi chú kỹ thuật, giới hạn của mô phỏng, nguồn tham khảo.
- URL #slide-8 mở trực tiếp slide 8.
- Vector 3D: kéo để xoay hoặc dùng slider; slider hỗ trợ mũi tên và Home/End.

## Nội dung

1–5: ecommerce, linear search, metadata, inverted index, semantic search.
6–11: vector, embedding, bản đồ 3D, cosine score, vector DB, offline/online pipeline.
12–17: model, training/inference, tokenizer → ID → embedding, attention, token generation, temperature.
18–21: RAG, chunking, hybrid/rerank, trả lời dựa vào nguồn và xử lý thiếu bằng chứng.
22–24: generative AI, diffusion, câu hỏi tổng kết.

Gợi ý thời lượng: 45–60 phút. Trước mỗi thao tác, mời người nghe dự đoán điều gì sẽ xảy ra.

## Chỉnh sửa

- app/content.ts: nội dung 24 slide, ghi chú, sản phẩm và nguồn.
- app/demos.tsx: toàn bộ demo tương tác.
- app/page.tsx: layout, điều hướng, mục lục, fullscreen.
- app/globals.css: màu sắc, responsive và chuyển động.
- app/main.tsx: React entry point.
- public/hoodie.png: ảnh hoodie được tạo để minh họa (không phải hàng hóa thật).

Các component nền tảng trong components/ui được giữ từ starter. Những file tích hợp server của starter không tham gia runtime SPA. Cấu hình chạy thực tế là vite.config.ts, index.html và app/main.tsx.

## Demo nào tính thật, demo nào mô phỏng?

Tính trực tiếp: so khớp chuỗi tuyến tính; filter giá/màu; phép chiếu và xoay tọa độ 3D; nearest neighbor Euclid trên vector tự đặt; cosine theo góc; gradient descent một trọng số; softmax với temperature và lấy mẫu.

Mô phỏng giáo dục: vector embedding, tokenizer/ID, attention, output sinh văn bản, ranking hybrid/rerank, câu trả lời RAG. Không có model AI nào đang chạy trong browser. Diffusion là ảnh có sẵn cộng lớp nhiễu và blur, không phải suy luận diffusion thật. 3D là tọa độ 3 chiều tự đặt được chiếu lên SVG, không phải giảm chiều embedding thật.

## Các điểm kỹ thuật được làm rõ

- Trước AI hiện đại đã có index, full-text search, BM25, từ đồng nghĩa; không phải mọi search đều linear.
- Metadata tự nó không làm truy vấn nhanh hơn; cần index phù hợp.
- Vector search vẫn có thể brute-force; ANN là cách tăng tốc có đánh đổi recall.
- Tokenizer tạo token IDs trước bước embedding.
- Cosine similarity không phải xác suất đúng. Điểm số khác loại không chung thang đo.
- RAG không cập nhật trọng số model và không loại bỏ hoàn toàn hallucination.
- Không phải mọi image model dùng cùng quy trình diffusion.

## Nguồn

- D:\RAG\README.md
- D:\RAG\src\rag\pipeline\retrieval.py (dense, BM25, RRF, MMR)
- D:\RAG\data\sample_documents\rag_systems_guide.md
- https://huggingface.co/docs/transformers/main_classes/tokenizer
- https://huggingface.co/docs/transformers/main/en/generation_strategies
- https://qdrant.tech/documentation/search/
- https://arxiv.org/abs/1706.03762
- https://arxiv.org/abs/2005.11401
- https://arxiv.org/abs/2112.10752

Đã đối chiếu tài liệu chính thức ngày 27/09/2026. Nội dung nguồn D:\RAG được tham khảo và diễn giải, không sao chép toàn bộ dự án hay dữ liệu riêng tư vào website.
