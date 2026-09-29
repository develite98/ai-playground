# AI Playground — Requirements & Agent Handoff

Cập nhật: 29/09/2026 (tạo 27/09/2026). Tài liệu này ghi lại yêu cầu và các quyết định trong cuộc trao đổi với người dùng, để agent mới có thể tiếp tục mà không cần đọc lại lịch sử chat.

Đọc tài liệu này trước khi thay đổi trải nghiệm học. Sau đó xem `README.md`, `app/content.ts`, `app/page.tsx` và demo liên quan. Các yêu cầu mới trực tiếp từ người dùng có ưu tiên cao hơn bản ghi này.

## 1. Mục tiêu và đối tượng

Người dùng muốn một website để **sharing kiến thức AI từ nền tảng cho developer chưa có kinh nghiệm AI nhưng đã có base technical**.

Trọng tâm là giải thích từng bước, giúp người nghe hình dung được:

- Người dùng thao tác gì trên giao diện?
- Dữ liệu được biểu diễn như thế nào?
- Thuật toán/model nào chạy phía dưới?
- Mỗi thành phần đóng vai trò gì trong toàn bộ flow?

Đây là website trình bày và khám phá kiến thức theo slide, không phải website bán quần áo, chatbot production hay khóa học chứa quá nhiều chữ. Ecommerce/quần áo là ví dụ xuyên suốt để tạo sự gần gũi.

Ngôn ngữ: tiếng Việt, giữ thuật ngữ tiếng Anh khi cần, giải thích đơn giản trước rồi mới mở rộng kỹ thuật.

## 2. Yêu cầu ban đầu của người dùng

### Hành trình nội dung

1. Bắt đầu từ tìm kiếm truyền thống: **Linear Search** là gì, duyệt một danh sách ra sao.
2. Dùng ví dụ gần gũi: website ecommerce, tìm quần áo.
3. Bổ sung **metadata** để filter, giải thích vì sao cần các biến thể nâng cấp.
4. Chuyển sang tìm kiếm dùng AI: biểu diễn dữ liệu thành **vector nhiều chiều**, tìm sự gần nhau trong không gian đó.
5. Giải thích dần **vector là gì**, gắn hành động trên UI với xử lý bên dưới.
6. Giải thích flow nhập văn bản vào model, dùng câu **“Mình thích lập trình”**: tokenizer, token, biểu diễn vector, xử lý ngữ cảnh, dự đoán token tiếp theo, lặp lại để tạo câu trả lời.
7. Phân tích **model là gì**.
8. Mở rộng sang **RAG**, vai trò của RAG, **vector database**, **score** và các thuật ngữ liên quan.
9. Cuối cùng giải thích **Generative AI**: khi người dùng nhập thông tin, “AI suy nghĩ” thực chất được thực hiện như thế nào; tạo ảnh ra sao.

Ví dụ vector mà người dùng đề xuất:

```text
[độ ngọt, độ cay, độ nóng]
trà sữa → [8, 0, 2]
lẩu cay → [1, 9, 9]
```

### Hình thức và công nghệ

- Website dạng **slide show, từng bước**.
- Style và màu sắc **tươi sáng, dễ thương, dễ hiểu, trực quan**.
- Ưu tiên visualization và tương tác hơn nhiều thông tin hoặc trình bày quá technical.
- Nếu phù hợp, dùng **3D visualization** để dễ hình dung.
- Công nghệ tùy chọn; người dùng gợi ý React.
- Người dùng cho phép đặt source trong ổ D.
- Có thể tham khảo tài liệu/source tại **`D:\RAG`**.

Người dùng không yêu cầu tích hợp model thật, API trả phí, backend, đăng nhập riêng cho ứng dụng hay chạy toàn bộ dự án RAG.

## 3. Các chỉnh sửa người dùng đã chốt

Sau bản đầu tiên, người dùng yêu cầu:

> “bỏ giúp mình phần header đi nhé, không cần nút Toàn màn hình”

> “Thêm giúp mình 1 slice title kiểu ‘Trước khi có AI’ xong mới bắt đầu, xong tới Sau khi có AI”

> “bỏ từ ‘Chương’ ... để title là được rồi”

> “1 số từ khoá phải được highligh lên ... Tìm kiếm từ con số một => Tìm kiếm với linear search”

> “phần minh hoạ ... visualize kiểu database linearsearch nó trông như nào ... chứ ko hẳn là minh hoạ cái trang web mua hàng”

Cách đã triển khai theo các yêu cầu này:

- Bỏ header thương hiệu, nút fullscreen và thanh điều hướng phía trên.
- Bỏ nhãn “Chương” và nhãn bước ở đầu slide nội dung; ưu tiên tiêu đề.
- Giữ footer với mục lục, tiến độ, nút trước/sau và hướng dẫn phím mũi tên.
- Thêm slide phân đoạn **“Trước khi có AI”** ở đầu. *(29/09: đổi tên thành “Tìm theo chữ” và chuyển vào chương Search.)*
- Thêm slide phân đoạn **“Sau khi có AI”** trước semantic search/vector. *(29/09: đổi tên thành “Tìm theo ý nghĩa”.)*
- Đổi tiêu đề thành **“Tìm kiếm với Linear Search”**, **“Lọc dữ liệu với metadata”**, **“Tra cứu với inverted index”**.
- Highlight thuật ngữ chính trong phần giải thích và takeaway (gạch đầu dòng kỹ thuật không highlight, chỉ định dạng `code`).
- Thay demo Linear Search bằng **bảng `products`**, con trỏ đọc từng dòng, so khớp `true/false`, số lần kiểm tra và tập ID kết quả.
- Có **Từng dòng**, **Chạy tự động**, **Tạm dừng**, **Chạy lại**, đặt lại và thay từ cần tìm.
- Metadata và inverted index cũng dùng bảng dữ liệu để thể hiện sự khác nhau giữa các cách xử lý.
- Inverted index hiển thị posting list; dòng không thuộc danh sách ID được ghi **“Không đọc”**.

### Cập nhật sau review nội dung (27/09/2026)

Người dùng duyệt các chỉnh sửa sau:

- Đưa slide **“Đi Đà Lạt” đâu có trong tên?** lên *trước* divider “Sau khi có AI”, làm vấn đề khép lại phần 1 (thay cho vị trí sau divider trước đây).
- Attention: trọng số dựng tay nhưng **causal thật**, tức mỗi hàng chỉ phụ thuộc token hiện tại và các token phía trước. Ở vị trí “chuột”, Ví dụ 2 và 3 phải cho trọng số giống hệt nhau.
- RAG: 3 kịch bản (đủ bằng chứng / chỉ lấy top-1 / không có bằng chứng). Câu trả lời đủ phải nêu cả P02 và P05, vì cả hai đều ấm và dưới 400k.
- Nguồn: mỗi bài chọn nguồn qua `refs` (key trong `sources` ở `app/content.ts`), không lọc theo ngưỡng `demo`.
- Retrieval: 2 query (keyword thắng nhờ mã SKU / vector thắng nhờ nghĩa). Keyword được tính bằng cách đếm từ trùng; RRF tính thật với k = 60. Thứ hạng vector và rerank là minh họa.
- Score: cosine tính thật giữa query 3 chiều và vector của 6 sản phẩm, có hiện công thức.
- Bản đồ 3D hiển thị top-3. Inverted index có callout “Hoodie không có trong posting list của ‘áo’”.
- Thêm slide **“Một câu hỏi. Đi qua cả hệ thống.”** (9 bước, dữ liệu đổi hình dạng, phân biệt embedding model và LLM) trước Tổng kết.
- Slide 2 đổi title thành câu hỏi **“Khi bạn bấm tìm kiếm, máy làm gì?”**. Người dùng không muốn title kiểu diễn văn/slogan; title phải nói thẳng vấn đề và gọn trong khoảng 3 dòng.
- Bỏ khung thu gọn “Góc cho dev” / nút “Hiểu thêm một chút”. Người dùng cho rằng cả bộ slide vốn dành cho dev, nên ghi chú phải hiện sẵn. Mỗi bài có `dev: string[]` gồm 2–4 gạch đầu dòng ngắn, chỉ chứa kiến thức kỹ thuật. Lời thanh minh “đây là minh họa” đặt trong demo (tag/fineprint), không lặp lại ở đây. Đoạn nằm trong backtick được hiển thị dạng `code`.

### Đa ngôn ngữ VI + EN

- Nút **VI | EN** nằm ở footer, cạnh “Nội dung”. Lựa chọn lưu ở `localStorage` (key `ai-playground-lang`, có try/catch) và cập nhật `<html lang>` cùng `document.title`. Mặc định là VI.
- Không dùng thư viện i18n. `app/i18n.tsx` cung cấp `LangContext` và `useT()` → `t(vi, en)` và `num(n, digits)` (VI dùng dấu phẩy thập phân, EN dùng dấu chấm).
- Nội dung bài học EN nằm ở `app/content-en.ts`, **cùng thứ tự** với `lessons` (có kiểm tra độ dài khi load). Cấu trúc `c`, `refs`, `demo` dùng chung. **Thêm hoặc sửa bài thì phải cập nhật cả hai file.**
- Dữ liệu EN của các demo có tính toán được chọn để ra **cùng kết quả** như VI: “shirt” → P01, P03, P04, P05; posting list shirt/hoodie/shorts; keyword overlap ở Retrieval (C3 > C1; C2 > C4); P02 + P05 ở RAG. Đổi tên sản phẩm EN hoặc câu truy vấn thì kiểm tra lại các kết quả này.
- Filter màu vẫn dùng key tiếng Việt `color === "Tím"`; `colorEn`/`nameEn` chỉ để hiển thị và so khớp tên.
- Demo được remount khi đổi ngôn ngữ (`key` gồm `lang`), nên state của demo reset về mặc định của ngôn ngữ mới.

### Slide tổng quan semantic search (28/09/2026)

Người dùng thấy chuyển từ divider “Sau khi có AI” sang vector vị giác bị đột ngột, vì người nghe chưa có cái nhìn tổng quan. Đã thêm slide 8 **“Cùng một câu tìm. Hai cách hiểu.”** (nội dung đã được duyệt).

Demo của slide này **chỉ tập trung vào semantic search**. Người dùng đã từ chối phương án so sánh 2 cột với Linear Search, vì Linear Search vừa được trình bày ở phần trước nên không cần lặp lại. Demo hiện tại:

- Chọn 1 trong 4 câu tìm → các bước sáng lần lượt: Câu tìm → Embedding model → Vector → Tìm lân cận → Top-k.
- Người dùng yêu cầu làm **3D** (thay cho bản 2D ban đầu): không gian 3 trục ấm × thoải mái × trang trọng lấy từ `v` của sản phẩm; tự đung đưa ±20° (không xoay 360° để nhãn không đè nhau), kéo để xoay. Khoảng cách Euclid 3D tính thật.
- Cuối demo có link “Mở từng bước” tới Kho vector → Embedding → Model tự học → Dữ liệu để học → Score.
- **Top-k và ngưỡng (29/09/2026):** người dùng hỏi dựa vào điều kiện gì mà kết quả dừng ở 3 món, và tại sao Áo thun cotton không vào dù trông gần. Câu trả lời: top-k chỉ xét thứ hạng (áo thun đứng hạng 4, cách 6,1); hình 3D chiếu xuống 2D có thể làm hai điểm xa trông như gần. Slide 8 giờ có: thanh trượt k (1–6), công tắc “Áp dụng ngưỡng” kèm bán kính (vòng nét đứt chỉ hiện và chỉ cắt kết quả khi bật), bảng xếp hạng cả 6 món (✓ trả về / ⭕ ngoài ngưỡng / ✂ ngoài top-k), và nút (?) hover/focus hiện code `vectorDB.search({ limit, scoreThreshold, filter })` → `rerank` → `fitTokenBudget` cùng bảng “Lớp · Giới hạn theo · Ví dụ”. Người dùng yêu cầu dùng đúng đoạn code họ gửi. Thêm gạch đầu dòng dev về `LIMIT` trong pgvector.
- Ở bản VI, tọa độ viết dạng `[8; 3,2]`, dùng dấu chấm phẩy để không lẫn với dấu phẩy thập phân.

### Cốt truyện 5 chương (29/09/2026)

Người dùng chốt cốt truyện mới để các phần nối với nhau. Nguyên nhân: chính họ từng hiểu nhầm vector DB là trọng số của LLM, và người đọc slide cũng dễ nhầm như vậy.

0. **Bức tranh tổng**: 4 khối 💻 App · 🔎 Search · 📋 Bàn (context) · 🧠 LLM, cộng câu trả lời. Ví von **thi mở sách**: kiến thức trong đầu (trọng số), thư viện (dữ liệu / vector DB), vài trang trên bàn (context); app là thủ thư.
1. **LLM: bộ não** (kèm “mổ xẻ” theo yêu cầu): Model là hàm đã học → Training → **Tham số là gì** (so sánh model thật) → Từ prompt đến code → Token → **Bên trong LLM** (32 lớp) → Attention → Sinh token → Temperature → **Model nhớ gì? Model đọc gì?** (cầu nối: LLM nhớ mơ hồ, đóng băng, không biết dữ liệu riêng, nên cần search).
2. **Search: tìm gì để đặt lên bàn?**: gồm hai phân đoạn con **“Tìm theo chữ”** và **“Tìm theo ý nghĩa”**. Người dùng đã đồng ý đổi tên từ “Trước / Sau khi có AI”.
3. **RAG: đặt lên bàn.**
4. **Ghép lại**: slide prompt→code bản đầy đủ (lesson 31, mặc định bật RAG và Ranh giới) → GenAI → Diffusion → Tổng kết. Slide “Một câu hỏi đi xuyên hệ thống” (lesson 23) đã gỡ khỏi flow, code vẫn giữ.

Kỹ thuật:
- Phân đoạn chương có `divider: "chapter"`, `id` (khóa lấy bản EN trong `dividersEn`) và `focus` để làm sáng khối tương ứng trên `StoryMap` (xuất từ `demos.tsx`, dùng chung với slide mở đầu).
- Hàm `chapter(c, items)` gán `c` theo thứ tự trình chiếu, **không** dùng `c` trong dữ liệu bài học.
- Không dùng chữ “Chương” trên giao diện (yêu cầu cũ vẫn giữ). Tên chương chỉ hiện trong mục lục.
- Tránh nói “LLM chứa dữ liệu khổng lồ”. Cách nói đúng: LLM *học* từ dữ liệu khổng lồ, kiến thức được nén vào trọng số và không giữ bản gốc để tra cứu.

### Từ điển LLM và ví dụ training thật (29/09/2026)

- **Slide 2 “Từ điển nhỏ khi làm việc với LLM”** (lesson 34, demo `Glossary`): người dùng yêu cầu đặt ở vị trí 2 và gửi kèm bảng thuật ngữ. Gồm 14 từ: Token, Tokenizer, Prompt, System prompt, Context window, Input/output tokens, Inference, Parameters/weights, Temperature, Embedding, RAG, Tool/function calling, Fine-tuning, Hallucination. Mỗi từ có giải thích bằng lời thường (dùng lời của người dùng), ví dụ, và link tới slide nói kỹ về nó.
- **Context window** có biểu đồ so sánh, lấy từ tài liệu chính thức ngày 29/09/2026: Claude Opus 5.5 1M (output 128K), Claude Haiku 4.5 200K (64K), Gemini 3.1 Pro 1M (64K), GPT-6 Sol 1,05M (128K). Người dùng hỏi “Gemini khác gì Opus”: câu trả lời đúng là **các model hàng đầu hiện đều khoảng 1M**; khác nhau ở output tối đa, giá và tokenizer. Cách so sánh cũ “Gemini 1M, Claude 200K” đã lỗi thời. **Các số này thay đổi theo từng đời model: cần kiểm tra lại trước mỗi buổi trình bày.**
- **Slide Training (slide 5):** người dùng thấy ví dụ `y = w·x` chỉ đọc hiểu chứ không “thấm”. Đã thêm tab mặc định “Ví dụ thật: đoán chữ tiếp theo”: câu trong dữ liệu train bị che chữ cuối, bấm “Học một bước” thì xác suất của đáp án tăng (21% → 57% → 76% → …) và loss giảm. Gradient softmax được tính thật trên 4 điểm số. Tab “1 núm vặn w” cũ vẫn giữ, vì slide Tham số nhắc lại ví dụ này.

### Mổ xẻ LLM (29/09/2026)

- **Tham số là gì** (lesson 32, demo `ParamScale`): nối từ demo 1 tham số `w`, rồi đến biểu đồ thang log gồm GPT-2 1,5B, Mistral 7B, Llama 3.1 8B/70B/405B, Gemma 2 27B, Mixtral 47B (13B hoạt động), GPT-3 175B, DeepSeek-V3 671B (37B hoạt động). GPT-4o, Claude, Gemini ghi “không công bố”. Mọi con số đều lấy từ bài báo gốc (đã đối chiếu abstract arXiv). Rê hoặc bấm từng dòng để xem dung lượng ước lượng (16-bit ≈ 2 byte/tham số, 4-bit ≈ 0,55) và máy có thể chạy.
- **Bên trong LLM** (lesson 33, demo `InsideLLM`): input “Mình thích lập”, thanh trượt lớp 0–32. Vector của từng token đổi màu và trộn ngữ cảnh theo lớp. Ô “nếu dừng ở lớp này thì đoán gì” mô phỏng logit lens (lập → trình). Thanh tỷ lệ tham số lấy từ config Llama 3.1 8B: embedding 0,53B · 32 lớp 6,98B · logits 0,53B, tổng 8,03B.

### Đối tượng người đọc (28/09/2026)

Slide dành cho dev, nhưng **mục tiêu là người ít kỹ thuật đọc vẫn hiểu**. Vì vậy flow đi từng bước thật cơ bản. Title, `p`, `take` và chữ trong demo phải dùng lời thường, ưu tiên ví von (ví dụ “người vẽ bản đồ”, “tấm bản đồ đã cắm ghim”) thay vì thuật ngữ quy trình (indexing, upsert, self-supervised). Giữ nguyên tiếng Anh cho các keyword quan trọng của ngành AI (vector, embedding, model, RAG, token…) để dev tự research thêm. Gạch đầu dòng `dev` được phép giữ tính kỹ thuật.

### Tổ chức lại phần “Sau khi có AI” (28/09/2026)

Người dùng muốn các slide sau slide tổng quan đi theo ý: không gian vector giống một “kho dữ liệu” cho semantic search → dữ liệu trong kho hình thành thế nào → liên hệ thực tế (nghề data labelling) → AI có tự tạo dữ liệu / tự học được không. Người dùng tự nhận là chưa rành phần cuối và nhờ chỉnh cho đúng. Các điểm đã chỉnh:

- **Embedding model** (quyết định tọa độ; “không gian” nằm trong trọng số của model, không được lưu riêng) khác với **vector database** (lưu các điểm của dữ liệu *của bạn* và tìm điểm gần).
- Không ai đặt tọa độ bằng tay: sản phẩm đi qua embedding model rồi mới được lưu vào kho. Trục có tên (ấm, thoải mái…) chỉ để minh họa.
- Data labelling là nghề có thật và vẫn tồn tại: ImageNet 2009 dùng Amazon Mechanical Turk; RLHF (InstructGPT 2022) cần người xếp hạng câu trả lời.
- “AI tự học”: đúng theo nghĩa self-supervised / contrastive (word2vec 2013, Sentence-BERT 2019); LLM sinh dữ liệu tổng hợp để train embedding (arXiv 2401.00368). **Chưa đúng** nếu hiểu là AI tự dựng vector DB cho shop, hoặc không còn cần con người. Có rủi ro model collapse (arXiv 2305.17493).

Quyết định cấu trúc:

- **Bỏ slide trà sữa/lẩu (lesson 5) và slide “Không gian vector 3D” (lesson 7) khỏi flow.** Người dùng cho phép bỏ ví dụ vector vị giác nếu không hợp flow mới. Ý “tọa độ = vector” được dạy ở slide kho vector. Code của hai bài vẫn còn trong `lessons` và `Demo`, chỉ không được đưa vào `slidesVi`.
- Slide 9 và 10 viết lại lesson 9 và 6. Demo Embed cũ và pipeline “Một bản ghi trong vector DB” đã được thay thế.
- Slide 11 và 12 là lesson 26 và 27, thêm vào cuối mảng.
- `useOrbit` và `SpaceGrid` trong `demos.tsx` dùng chung cho các demo 3D. `project3d` cũng được slide Space cũ dùng.
- Demo contrastive (slide 11) tính thật trên 2D: cặp cùng nhóm hoạt động như lò xo có độ dài nghỉ 1,2; cặp khác nhóm bị đẩy ra xa khi gần hơn 4. Mô phỏng hội tụ sau khoảng 23 bước (loss từ 115 xuống dưới 0,05), không có điểm nào bị đè lên nhau.

### Slide “Từ prompt đến code” (28/09/2026)

Người dùng yêu cầu một slide **không có chữ**, chỉ có graph animation: từ lúc user nhập prompt, prompt đi qua các bước quan trọng của model, dữ liệu đổi dạng ra sao, rồi quay về user. Ví dụ phải gần với dev, tức prompt để build một thứ gì đó chứ không phải hỏi chat.

- Là lesson 28, cờ `full: true`. `page.tsx` bỏ cột chữ và cho demo chiếm toàn bộ chiều rộng (class `full-slide`). Slide nằm ở vị trí 15, mở đầu chương Model & LLM.
- Slide full-bleed (không có card): `page.tsx` render trực tiếp `<Demo>` khi `slide.full`. Stage SVG 1600×820 tự co giãn.
- Hàng trên: Prompt → ① Tokenizer → ② Embedding → ③ Transformer → ④ Logits → ⑤ Sampling, có vòng lặp cong “+1 token vào context”. Mỗi tile hiển thị dữ liệu của chính nó: chip token và ID, heatmap, cung attention cộng 6 lớp, thanh xác suất, vòng quay chọn token.
- Hàng dưới: ⑥ Detokenize → ⑦ App / IDE → 💬 Chat · Response và 📄 Editor `LikeButton.tsx`.
- **Ý chính (người dùng hỏi thêm “còn khúc Response qua khung chat”):** model chỉ sinh MỘT dòng token. Lời chat và code đều ra từ cùng vòng lặp; chính app/IDE chia luồng: chữ vào chat, khối ` ```tsx ` vào file. Dòng token theo thứ tự: câu mở đầu → ` ```tsx ` → code → ` ``` ` → câu kết.
- 4 token đầu chạy từng bước là lời mở đầu trong chat (VI: “Đây”, “ là”, “ component”, “ LikeButton”; EN: “Here”, “ is”, “ the”, “ LikeButton”). Ghép lại phải đúng bằng đầu của `p2cIntro`. Phần còn lại stream nhanh; tile App sáng hướng đang chuyển tới.
- **Nhánh RAG (công tắc “🔎 RAG”, mặc định tắt):** người dùng hỏi vector DB nằm ở đâu trong luồng này. Câu trả lời: nó nằm **ngoài model** và chạy **trước** Tokenizer; app tra cứu rồi dán kết quả vào prompt. Bước ② Embedding bên trong LLM chỉ là tra bảng theo token, không tìm kiếm gì. Khi bật công tắc, pipeline dịch xuống 170 đơn vị (`P2C_RAG_SHIFT`) để có chỗ cho làn: Prompt → Embedding model (RAG) → Vector DB (mini 3D gồm 6 đoạn code, cosine tính thật; top-2 là FavoriteButton.tsx 0,996 và Button.tsx 0,985) → context được gắn vào prompt → Tokenizer. Khi có RAG, code trả về dùng `<Button variant="ghost">` có sẵn của dự án và câu kết nói về việc dùng lại Button. Mục đích là để người xem thấy retrieval thay đổi kết quả. Vector của các đoạn code và của câu hỏi là số đặt tay.
- **Ranh giới (công tắc “🗺️ Ranh giới”, mặc định tắt):** người dùng muốn biết phần nào chạy trong app/IDE (FE + BE: lịch sử hội thoại, system prompt, RAG, chia luồng, chạy tool) và phần nào chạy trên server Claude / GPT / Gemini. Khi bật, slide vẽ các vùng nét đứt lồng nhau: 💻 App/IDE bao toàn slide; ☁️ Server là hình chữ L quanh ①–⑥ và vòng lặp; 🧠 LLM · trọng số quanh ②③④. Có hai cổng `request ➜` và `⬅ stream` nằm trên mũi tên đi qua ranh giới. Bên phải có thêm cột chú thích rộng 380 (`P2C_PANEL_W`, người dùng đồng ý thu nhỏ graph để hiện thêm thông tin): trách nhiệm của từng vùng và một request JSON rút gọn cho thấy vị trí của system prompt và lịch sử. Vùng, nhãn và cổng đều có tooltip. Lưu ý đúng: API thường stateless nên app phải gửi lại lịch sử; tokenize diễn ra phía server; app gửi chữ chứ không gửi token.
- Tooltip chi tiết (`p2cTips`) hiện khi rê chuột, Tab hoặc chạm vào 11 điểm: Prompt, 7 tile, vòng lặp, Chat, Editor. Mỗi tooltip gồm “Làm gì”, “Vào → Ra” và 💡 một điều dev nên biết. Animation tạm dừng khi tooltip đang mở. Tooltip vẽ bằng `foreignObject` trong SVG để co giãn cùng stage; nội dung song ngữ, lời thường.
- Token, ID, ma trận, xác suất và “× 32 layers” đều là minh họa; dòng fineprint ghi rõ đây là mô phỏng.

**Không tự đưa header/fullscreen/nhãn “Chương” trở lại.** Không thay demo thuật toán bằng các product card thuần túy. Ví dụ shop vẫn có thể dùng để đặt bối cảnh ở slide giới thiệu.

## 4. Trạng thái hiện tại

- Source chính: **`D:\ai-playground`**.
- Website đã triển khai: **https://ai-playground-dev.phongcao3091998.chatgpt.site**.
- Lần kiểm tra gần nhất: quyền xem riêng tư, chỉ owner. Không tự chuyển sang public hoặc mở rộng người xem.
- Giao diện hiện có **38 slide**, chia 5 chương theo cốt truyện (xem mục “Cốt truyện 5 chương”).
- **Website đang deploy là bản cũ** (commit `d47e181`, 26 slide). Mọi thay đổi từ 27/09 trở đi mới chỉ có ở local. Không tự deploy; hỏi người dùng trước.
- Mốc commit: `ec8b94b` (code: i18n, semantic search 3D, stage prompt→code…) và `301d1bb` (tài liệu). Phần làm sau đó (cốt truyện 5 chương, mổ xẻ LLM, từ điển, training thật) có thể chưa commit: kiểm tra `git status` / `git log` trước khi làm tiếp.
- Các yêu cầu đã nêu trong tài liệu này đều đã được thực hiện.

### Việc còn dở / đã đề xuất nhưng chưa làm

- Rà lại phần chữ chính của các slide cũ (Token, Attention, Sinh token, Temperature, Chunking, Hybrid, GenAI, Diffusion) theo nguyên tắc “người ít kỹ thuật đọc vẫn hiểu”. Mới làm cho slide 1–6, 13 và phần Search.
- Code không còn trong flow: lesson 5 (trà sữa/lẩu), 7 (không gian 3D cũ), 23 (Một câu hỏi đi xuyên hệ thống), nhánh `Shop` mode 1–3, icon import không dùng (`Code2`, `Send`, `MousePointer2`), CSS `.topbar` / `.chapterbar`, `app/layout.tsx`. Chỉ xóa khi người dùng đồng ý.
- 3 lỗi lint có sẵn ở `app/database-demo.tsx` (setState trong effect; dấu `"` chưa escape).
- `.playwright-mcp/` (ảnh chụp kiểm tra) chưa được gitignore; không commit thư mục này.
- Trên mobile, chữ trong các stage SVG lớn (prompt→code, bản đồ 3D) khá nhỏ.
- Số liệu context window ở slide Từ điển cần kiểm tra lại trước mỗi buổi trình bày.

### Thứ tự slide hiện tại (đánh số từ 1)

| Slide | Chương | Nội dung |
| --- | --- | --- |
| 1 | Bức tranh tổng | Phía sau một câu trả lời AI. |
| 2 | Bức tranh tổng | Từ điển nhỏ khi làm việc với LLM. |
| 3 | LLM: bộ não | [phân đoạn chương] LLM: bộ não. |
| 4 | LLM: bộ não | Model là một hàm đã học. |
| 5 | LLM: bộ não | Dự đoán. Đo sai. Điều chỉnh. |
| 6 | LLM: bộ não | Tham số là những núm vặn đã học. |
| 7 | LLM: bộ não | Từ prompt đến code. (full-width) |
| 8 | LLM: bộ não | Chữ → token → ID → vector. |
| 9 | LLM: bộ não | Đi xuyên 32 lớp. |
| 10 | LLM: bộ não | Cùng một từ. Khác ngữ cảnh. |
| 11 | LLM: bộ não | Từng token. Rồi từng token. |
| 12 | LLM: bộ não | Có nhiều cách viết tiếp. |
| 13 | LLM: bộ não | Model nhớ gì? Model đọc gì? |
| 14 | Search: tìm tài liệu | [phân đoạn chương] Search: tìm gì để đặt lên bàn? |
| 15 | Search: tìm tài liệu | Khi bạn bấm tìm kiếm, máy làm gì? |
| 16 | Search: tìm tài liệu | [phân đoạn] Tìm theo chữ |
| 17 | Search: tìm tài liệu | Tìm kiếm với Linear Search |
| 18 | Search: tìm tài liệu | Lọc dữ liệu với metadata |
| 19 | Search: tìm tài liệu | Tra cứu với inverted index |
| 20 | Search: tìm tài liệu | “Đi Đà Lạt” đâu có trong tên? |
| 21 | Search: tìm tài liệu | [phân đoạn] Tìm theo ý nghĩa |
| 22 | Search: tìm tài liệu | Cùng một câu tìm. Hai cách hiểu. |
| 23 | Search: tìm tài liệu | Không gian này là một kho dữ liệu. |
| 24 | Search: tìm tài liệu | Ai đặt các điểm vào không gian? |
| 25 | Search: tìm tài liệu | Embedding model học cách xếp chỗ thế nào? |
| 26 | Search: tìm tài liệu | Dữ liệu để học đến từ đâu? |
| 27 | Search: tìm tài liệu | Score là một phép đo. |
| 28 | Search: tìm tài liệu | Hai luồng chạy ở phía dưới. |
| 29 | RAG: đặt lên bàn | [phân đoạn chương] RAG: đặt tài liệu lên bàn. |
| 30 | RAG: đặt lên bàn | Cho AI đọc đúng tài liệu. |
| 31 | RAG: đặt lên bàn | Cắt vừa đủ. Giữ ngữ cảnh. |
| 32 | RAG: đặt lên bàn | Lấy ứng viên. Chọn phần liên quan. |
| 33 | RAG: đặt lên bàn | Tìm trước. Trả lời có nguồn. |
| 34 | Ghép lại | [phân đoạn chương] Ghép lại các mảnh. |
| 35 | Ghép lại | Toàn bộ hệ thống. (full-width) |
| 36 | Ghép lại | Tìm cái đã có. Tạo điều tiếp theo. |
| 37 | Ghép lại | Từ nhiễu. Dần thành hình. |
| 38 | Ghép lại | Bạn đã mở được chiếc hộp AI. |

Gợi ý 45–60 phút là ước lượng của agent cho cách trình bày, không phải thời lượng bắt buộc từ người dùng.

## 5. Các điểm kỹ thuật cần giữ chính xác

Đây là những điều đã được chỉnh/giải thích khi chuyển ý tưởng ban đầu thành nội dung:

- Phân đoạn “Tìm theo chữ” (trước đây “Trước khi có AI”) là **tìm kiếm chưa dùng model học máy**, không khẳng định lịch sử tìm kiếm chỉ có Linear Search.
- Tìm kiếm truyền thống đã có index, full-text, BM25, từ đồng nghĩa. AI không thay thế toàn bộ các cách đó.
- Metadata mô tả bản ghi và phục vụ filter; tự thêm metadata không làm truy vấn nhanh hơn nếu vẫn quét tất cả bản ghi.
- Vector là một bộ số có thứ tự. Các chiều có tên như “độ ngọt” chỉ là ví dụ trực giác; chiều của embedding học được thường không có tên đơn giản.
- Vector search vẫn có thể brute-force. ANN/index như HNSW là phương pháp tăng tốc, có đánh đổi recall.
- Query và document phải được encode trong không gian tương thích; cùng số chiều chưa đủ.
- Cosine similarity không phải xác suất đúng: 0,9 không có nghĩa “đúng 90%”. Các loại score không tự cùng thang đo.
- **Token ID có trước bước tra embedding.** Sơ đồ người dùng ban đầu đặt ID sau xử lý vector đã được sửa cho đúng:

```text
Text → tokenizer → token IDs → token embeddings + thông tin vị trí
→ transformer tạo biểu diễn có ngữ cảnh → logits
→ chọn token ID tiếp theo → decode → nối vào context → lặp
```

- Cách tách “Mình thích lập trình” và ID hiển thị là minh họa, không phải output tokenizer cụ thể.
- Training cập nhật trọng số; inference dùng trọng số đã học. Nhập prompt không đồng nghĩa model được train lại.
- RAG bổ sung bằng chứng vào context lúc inference, không tự cập nhật trọng số. Retrieval có thể dùng keyword/vector/hybrid; không bắt buộc có vector DB.
- RAG không bảo đảm loại bỏ hallucination. Không có bằng chứng thì demo nói chưa đủ dữ liệu.
- MMR và cross-encoder reranker không phải một thuật toán.
- “AI suy nghĩ” được giải thích bằng xử lý số, ngữ cảnh, sinh token/các bước tính; không trình bày như ý thức con người hay trace nội bộ thật.
- Latent diffusion là một cách tạo ảnh phổ biến, không phải cơ chế của mọi image model.

## 6. Ranh giới mô phỏng

Ứng dụng hiện **không gọi LLM, embedding API, vector DB hay diffusion model**. Không cần API key.

**Có tính toán trực tiếp trên dữ liệu nhỏ:**

- Linear Search, filter, lookup posting list đã dựng từ catalog.
- Xoay/chiếu tọa độ 3D lên SVG; láng giềng Euclid, top-k và ngưỡng với vector tự đặt.
- Cosine giữa query và vector của 6 sản phẩm; cosine trong làn RAG của slide prompt→code.
- Đếm từ trùng (đơn giản hóa keyword/BM25) và RRF với k = 60.
- Gradient descent cho một trọng số với squared loss; gradient softmax cross-entropy ở tab “đoán chữ tiếp theo”.
- Contrastive learning trên 2D (lò xo 1,2 / đẩy khi gần hơn 4).
- Softmax theo temperature và lấy mẫu.
- Số tham số, tỷ lệ tham số và dung lượng ước lượng (từ số công bố và config Llama 3.1 8B).

**Đầu ra mô phỏng giáo dục:**

- Embedding, token/ID, trọng số attention (dựng tay nhưng causal).
- Văn bản sinh theo kịch bản, thứ hạng vector/rerank, câu trả lời RAG, câu trả lời ở slide “Model nhớ gì / đọc gì”, token/ID/logits ở slide prompt→code, dự đoán theo lớp (logit lens) ở slide “Bên trong LLM”.
- Diffusion dùng ảnh hoodie có sẵn với lớp nhiễu và blur. Không phải intermediate output của model.

Bản đồ 3D không dùng WebGL/Three.js: tọa độ 3D thật của dữ liệu tự đặt được chiếu lên SVG và xoay tương tác. Không phải giảm chiều embedding thật. Ảnh `public/hoodie.png` là asset đã tạo riêng cho demo, không phải dữ liệu sản phẩm thật.

Giữ các nhãn mô phỏng trong demo. Không làm người học hiểu nhầm demo đang chạy model thật.

## 7. Cấu trúc triển khai

Stack hoạt động: **React + TypeScript + Vite**, Tailwind/CSS, Lucide, một số UI primitive Radix qua `components/ui`.

| File | Vai trò |
| --- | --- |
| `app/content.ts` | Nội dung, gạch đầu dòng kỹ thuật (`dev`), nguồn (`refs`), catalog; ghép bài học với slide phân đoạn |
| `app/page.tsx` | Layout, divider, highlight, mục lục, URL hash, bàn phím, footer |
| `app/database-demo.tsx` | Bảng dữ liệu, linear scan, metadata, inverted index |
| `app/content-en.ts` | Bản tiếng Anh của bài học, chương, divider |
| `app/i18n.tsx` | Context ngôn ngữ, `useT()` |
| `app/demos.tsx` | Các demo còn lại: vector, model, RAG, diffusion… |
| `app/globals.css` | Style, màu sắc, responsive, animation |
| `app/main.tsx` | React entry point |
| `index.html` | Entry HTML và metadata thực tế của SPA |
| `vite.config.ts` | Alias, React plugin, dev server, build tĩnh |
| `components/ui/` | UI primitive dùng lại từ starter |
| `public/` | Favicon và ảnh minh họa |
| `.openai/hosting.json` | Site identity và thư mục build tĩnh `dist` |

### Lưu ý dễ làm sai khi thêm slide

- `index` trong page là vị trí hiện tại của mảng `slides`; URL là `#slide-${index + 1}`.
- Mỗi bài có **`demo` riêng** (= index trong `lessons`). Divider có `demo: -1`, `divider: "chapter" | "before" | "after"` và `id` (khóa của `dividersEn`); divider chương có thêm `focus` cho `StoryMap`.
- Render demo bằng `slide.demo`, **không dùng index của mảng slide**.
- `c` (chương trong mục lục) do hàm `chapter(c, items)` gán theo thứ tự trình chiếu trong `slidesVi`; `c` trong dữ liệu bài học không còn ý nghĩa. UI không hiển thị từ “Chương”.
- Slide chỉ có hình dùng `full: true` (không cột chữ, demo render trực tiếp, không có card).
- Thành phần dùng chung trong `demos.tsx`: `useT` (i18n), `Top`, `Hint`, `Range`, `project3d` / `useOrbit` / `SpaceGrid` (3D), `StoryMap` (bản đồ 4 khối, cũng dùng trong `page.tsx`), `dot` / `norm` (cosine).
- Dùng `slides.length` cho progress/nút cuối; không hardcode số slide trong logic. Bài mới nên **thêm vào cuối `lessons`** (và cuối `lessonsEn`) rồi đặt vị trí trong `slidesVi`, để không làm lệch index `demo` của các bài có sẵn; nhớ thêm `case` trong `switch` của `Demo`. Ví dụ: bài tổng quan semantic search là `demo 25` nhưng hiển thị ở slide 8.
- Arrow keys chuyển slide, nhưng không chiếm phím của input/slider/switch. Chuyển slide reset scroll để mobile không bị giữ vị trí cũ.

### Phần starter không còn là runtime chính

Dự án ban đầu được scaffold từ Vinext/Sites starter. Sau lỗi hydration/khởi tạo tương tác đã chuyển sang React SPA dùng Vite. `next`, `vinext`, một số file server/DB/auth và package vẫn còn từ starter nhưng không điều khiển app hiện tại.

Đừng suy ra app đang chạy Next/Vinext server chỉ từ dependency hoặc `app/layout.tsx`. Theo entry `index.html` → `app/main.tsx` và npm scripts. Không cần cài lại hoặc dọn dependency hàng loạt cho một thay đổi giao diện nhỏ.

## 8. Chạy và kiểm tra

```powershell
cd D:\ai-playground
npm.cmd install
npm.cmd run dev
# Mặc định: http://127.0.0.1:5173

npm.cmd run build
npm.cmd start
# Preview production cũng dùng port 5173: dừng dev trước nếu cần.
```

Node.js yêu cầu >=22.13. `npm run build` chạy `tsc --noEmit` rồi `vite build`. Output ở `dist/`.

Nếu wrapper npm của môi trường agent bị lỗi đường dẫn, trên máy này đã chạy được:

```powershell
node 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' run build
```

`README.md` có hướng dẫn chạy thông thường. `work/` chứa scratch script bị gitignore; không coi đó là API triển khai ổn định và không đưa token/credential vào tài liệu hay repository.

### Kiểm tra đã thực hiện ở các lần triển khai trước

- TypeScript và production build thành công.
- Bản đầu kiểm tra điều hướng qua toàn bộ 24 bài gốc; bản cập nhật kiểm tra hai divider và các demo bảng dữ liệu mới.
- Quét “áo” đủ 6 dòng → P01, P03, P04, P05. “xyz” → 0 kết quả.
- Metadata màu tím, giá tối đa 400k → P02, P05.
- Posting list “hoodie” → P02.
- Đã thử vector slider, cosine ở 180° = -1, training giảm loss, RAG thiếu nguồn, diffusion slider và mục lục.
- Đã kiểm tra mobile khoảng 390px; không tràn ngang toàn trang. Bảng có wrapper riêng để xử lý không gian nhỏ.
- Không phát hiện console error trong lượt kiểm tra cuối của bản cập nhật.

**Từ 28/09: người dùng tự test giao diện; không dùng Playwright.** Agent chỉ chạy `npm.cmd run build` và eslint, cộng thêm kiểm tra dữ liệu bằng Node, ví dụ in thứ tự slide và phát hiện chữ tiếng Việt còn sót trong bản EN:

```bash
node scripts/check-slides.mjs   # thứ tự slide theo chương (VI | EN); exit 1 nếu bản EN còn chữ tiếng Việt
```

Đây là ghi nhận kiểm tra trước đó, không phải bảo đảm cho mọi chỉnh sửa tương lai. Với thay đổi mới, build và kiểm tra đúng interaction bị ảnh hưởng; không cần viết unit test cho việc sửa văn bản/tài liệu đơn giản.

## 9. Nguồn và bàn giao

Nguồn local đã tham khảo (không phải dependency runtime):

- `D:\RAG\README.md`
- `D:\RAG\src\rag\pipeline\retrieval.py`
- `D:\RAG\data\sample_documents\rag_systems_guide.md`

Trong source RAG có dense search, BM25, RRF và MMR. Không sao chép toàn bộ dự án hoặc dữ liệu riêng tư của `D:\RAG` lên website.

Nguồn ngoài được dẫn trong `app/content.ts` và `README.md`: tài liệu Hugging Face tokenizer/generation, Qdrant search, các bài báo Transformer, RAG và Latent Diffusion. Nếu đổi kiến thức kỹ thuật, đối chiếu nguồn chính thức.

Site đang dùng identity đã lưu ở `.openai/hosting.json`; dùng lại Site hiện có khi cập nhật, không tạo Site trùng. Publication gần nhất là private. Khi cần xuất bản thay đổi ứng dụng, tuân theo các tool/skill có sẵn trong phiên mới, build từ đúng source đã push và xác nhận deployment thành công. Credential ngắn hạn phải lấy mới; không có credential nào được lưu trong tài liệu này.

Các bản ZIP và screenshot từng bàn giao nằm ngoài source tại:

```text
C:\Users\Admin\Documents\Codex\2026-09-27\cont\outputs
```

Đó là snapshot, không phải source chính. Khi tiếp tục công việc, ưu tiên source hiện tại tại `D:\ai-playground` và kiểm tra `git status` để không ghi đè thay đổi của người dùng.
