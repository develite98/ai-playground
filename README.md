# AI Playground — Từ zero đến aha!

Website React + TypeScript + Vite gồm 29 slide (tiếng Việt, có bản tiếng Anh) để chia sẻ nền tảng AI cho developer mới bắt đầu. Source chính nằm trong D:\ai-playground.

## Context cho agent tiếp tục

Đọc [Requirements & Agent Handoff](docs/AGENT-HANDOFF.md) để nắm yêu cầu ban đầu, các chỉnh sửa đã chốt, cấu trúc code và lưu ý kỹ thuật.

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
- VI | EN (footer, cạnh Nội dung): đổi ngôn ngữ; lựa chọn được nhớ trong localStorage.
- Dưới mỗi phần giới thiệu: 2–4 gạch đầu dòng kỹ thuật cho developer và nguồn tham khảo, luôn hiển thị.
- URL #slide-3 mở trực tiếp demo Linear Search.
- Vector 3D: kéo để xoay hoặc dùng slider; slider hỗ trợ mũi tên và Home/End.

## Nội dung

1: Trước khi có AI.
2–6: ecommerce, Linear Search trên bảng dữ liệu, metadata, inverted index, “áo đi Đà Lạt” (vấn đề keyword chưa giải được).
7: Sau khi có AI.
8: tổng quan semantic search — câu tìm thành một điểm trong không gian 3D, tìm top-3 lân cận.
9–14: kho vector (vector DB), embedding đặt điểm vào kho, model tự học cách xếp chỗ, dữ liệu để học đến từ đâu, cosine, pipeline.
15: từ prompt đến code — animation toàn bộ một lượt gọi LLM (slide chỉ có hình).
16–21: model, training/inference, tokenizer, attention (causal), generation, temperature.
22–25: RAG, chunking, hybrid (RRF)/rerank, trả lời dựa vào nguồn.
26–29: generative AI, diffusion, một câu hỏi đi xuyên hệ thống, câu hỏi tổng kết.

Gợi ý thời lượng: 45–60 phút. Trước mỗi thao tác, mời người nghe dự đoán điều gì sẽ xảy ra.

## Chỉnh sửa

- app/content.ts: nội dung 29 slide, gạch đầu dòng kỹ thuật (dev), sản phẩm và nguồn (mỗi bài chọn nguồn qua refs).
- app/content-en.ts: bản tiếng Anh của từng bài (cùng thứ tự với lessons trong content.ts).
- app/i18n.tsx: context ngôn ngữ và hook useT() → t(vi, en), num().
- app/demos.tsx: các demo tương tác.
- app/database-demo.tsx: bảng dữ liệu, quét từng dòng/tự động, filter và inverted index.
- app/page.tsx: layout, slide phân đoạn, highlight từ khóa, điều hướng và mục lục.
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

