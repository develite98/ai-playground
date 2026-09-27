"use client";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Search,
  Shirt,
  Sparkles,
  Database,
  Check,
  RotateCcw,
  Play,
  Code2,
  FileText,
  BrainCircuit,
  Send,
  Layers,
  MousePointer2,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { products, sources } from "./content";
import DatabaseDemo from "./database-demo";
type Product = (typeof products)[number];
function Range({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="range">
      <div>
        <span>{label}</span>
        <strong>{Number(value.toFixed(2))}</strong>
      </div>
      <Slider
        aria-label={label}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(v[0])}
      />
    </div>
  );
}
function Hint({ children }: { children: React.ReactNode }) {
  return (
    <div className="demo-result" aria-live="polite">
      {children}
    </div>
  );
}
function Top({ title, tag = "TƯƠNG TÁC" }: { title: string; tag?: string }) {
  return (
    <div className="demo-top">
      <span className="shop-logo">
        <Sparkles size={18} />
        {title}
      </span>
      <span className="demo-tag">{tag}</span>
    </div>
  );
}
function ProductCard({
  p,
  dim = false,
  active = false,
}: {
  p: Product;
  dim?: boolean;
  active?: boolean;
}) {
  return (
    <div className={`product ${dim ? "dim" : ""} ${active ? "active" : ""}`}>
      <div className={"product-art tone-" + ((Number(p.id.slice(1)) - 1) % 3)}>
        {p.id === "P02" ? (
          <img src="/hoodie.png" alt="Hoodie lavender có ngôi sao vàng" />
        ) : (
          <Shirt size={76} strokeWidth={1.3} />
        )}
      </div>
      <strong>{p.name}</strong>
      <small>
        {p.price}.000đ <span>· {p.id}</span>
      </small>
    </div>
  );
}
function Shop({ mode }: { mode: number }) {
  const [q, setQ] = useState(
    mode === 1 ? "áo" : mode === 4 ? "áo đi Đà Lạt" : "áo đi Đà Lạt",
  );
  const [scan, setScan] = useState(0);
  const [running, setRunning] = useState(false);
  const [purple, setPurple] = useState(false);
  const [budget, setBudget] = useState(600);
  const [semantic, setSemantic] = useState(false);
  const [term, setTerm] = useState("áo");
  useEffect(() => {
    if (!running) return;
    const t = setInterval(
      () =>
        setScan((n) => {
          if (n >= products.length) {
            setRunning(false);
            return n;
          }
          return n + 1;
        }),
      650,
    );
    return () => clearInterval(t);
  }, [running]);
  const match = (p: Product) =>
    p.name.toLocaleLowerCase("vi").includes(q.trim().toLocaleLowerCase("vi"));
  return (
    <>
      <Top
        title="little closet"
        tag={mode === 1 ? "LINEAR SEARCH" : "CỬA HÀNG CỦA CHÚNG TA"}
      />
      {mode === 2 ? (
        <div className="searchbox">
          <Search size={19} />
          <span>Lọc catalog bằng màu sắc và giá</span>
        </div>
      ) : mode === 3 ? (
        <div className="chips">
          {["áo", "hoodie", "quần"].map((t) => (
            <button
              className={term === t ? "selected" : ""}
              key={t}
              onClick={() => setTerm(t)}
            >
              “{t}”
            </button>
          ))}
        </div>
      ) : (
        <form
          className="searchbox"
          onSubmit={(e) => {
            e.preventDefault();
            if (mode === 1) {
              setScan(0);
              setRunning(true);
            } else setSemantic(true);
          }}
        >
          <Search size={19} />
          <input
            aria-label="Tìm sản phẩm"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setScan(0);
              setRunning(false);
              setSemantic(false);
            }}
          />
          <button aria-label="Chạy tìm kiếm" disabled={!q.trim() || running}>
            <ArrowRight size={19} />
          </button>
        </form>
      )}
      {mode === 2 && (
        <div className="filter-row">
          <label>
            Tím{" "}
            <Switch
              checked={purple}
              onCheckedChange={setPurple}
              aria-label="Chỉ màu tím"
            />
          </label>
          <Range
            label="Giá tối đa (nghìn đ)"
            value={budget}
            min={150}
            max={600}
            step={10}
            onChange={setBudget}
          />
        </div>
      )}
      {mode === 3 && (
        <div className="index-row">
          <code>{term}</code>
          <ArrowRight size={20} />
          <div>
            {products
              .filter((p) => p.name.toLowerCase().includes(term))
              .map((p) => (
                <span className="token" key={p.id}>
                  {p.id}
                </span>
              ))}
          </div>
        </div>
      )}
      <div className={"product-grid " + (mode === 0 ? "" : "six-products")}>
        {products.slice(0, mode === 0 ? 3 : 6).map((p, i) => {
          const good =
            mode === 2
              ? (!purple || p.color === "Tím") && p.price <= budget
              : mode === 3
                ? p.name.toLowerCase().includes(term)
                : mode === 4
                  ? semantic
                    ? q.toLowerCase().includes("đà lạt")
                      ? p.warm
                      : match(p)
                    : match(p)
                  : match(p);
          return (
            <ProductCard
              key={p.id}
              p={p}
              active={
                mode === 1
                  ? scan === i + 1
                  : mode === 2 || mode === 3 || mode === 4
                    ? good
                    : false
              }
              dim={
                mode === 1
                  ? scan > i && !good
                  : mode === 2 || mode === 3 || mode === 4
                    ? !good
                    : false
              }
            />
          );
        })}
      </div>
      {mode === 0 ? (
        <Hint>
          {semantic
            ? "Tên sản phẩm không chứa “Đà Lạt”. Nhưng áo ấm có thể phù hợp!"
            : "Từ vài từ bạn gõ… đến những món đồ phù hợp."}
        </Hint>
      ) : mode === 1 ? (
        <>
          <div className="action-row">
            <button
              className="small-button"
              disabled={running || !q.trim()}
              onClick={() => {
                setScan(0);
                setRunning(true);
              }}
            >
              <Play size={15} />
              Quét từ đầu
            </button>
            <span>{scan} / 6 lần kiểm tra</span>
          </div>
          <Hint>
            {scan === 0
              ? "Bấm chạy để xem từng lần kiểm tra."
              : `Đã tìm thấy ${products.slice(0, scan).filter(match).length} sản phẩm khớp “${q}”.`}
          </Hint>
        </>
      ) : mode === 2 ? (
        <Hint>
          {
            products.filter(
              (p) => (!purple || p.color === "Tím") && p.price <= budget,
            ).length
          }{" "}
          sản phẩm thỏa điều kiện · price ≤ {budget}.000
          {purple ? " AND color = Tím" : ""}
        </Hint>
      ) : mode === 3 ? (
        <Hint>
          Tra posting list cho “{term}” → chỉ lấy những ID đã được lập chỉ mục.
        </Hint>
      ) : (
        <>
          <button
            className="small-button wide"
            onClick={() => {
              setQ("áo đi Đà Lạt");
              setSemantic(!semantic);
            }}
          >
            <Sparkles size={16} />
            {semantic ? "Trở lại tìm đúng chữ" : "Thử tìm theo ý nghĩa"}
          </button>
          <Hint>
            {semantic
              ? "Kịch bản minh họa: “Đà Lạt” → nhu cầu giữ ấm → 3 món áo ấm."
              : "So khớp tên đơn giản: không có kết quả cho “áo đi Đà Lạt”."}
          </Hint>
        </>
      )}
    </>
  );
}
function Taste() {
  const [v, setV] = useState([8, 0, 2]);
  return (
    <>
      <Top title="Một vector có thể nếm thử" />
      <div className="taste-icon">{v[1] > 5 ? "🍲" : "🧋"}</div>
      <div className="vector-code">
        [ <b>{v[0]}</b>, <b>{v[1]}</b>, <b>{v[2]}</b> ]
      </div>
      {["Độ ngọt", "Độ cay", "Độ nóng"].map((x, i) => (
        <Range
          key={x}
          label={x}
          value={v[i]}
          onChange={(n) => setV(v.map((x, j) => (i === j ? n : x)))}
        />
      ))}
      <div className="chips">
        <button onClick={() => setV([8, 0, 2])}>🧋 Trà sữa</button>
        <button onClick={() => setV([1, 9, 9])}>🍲 Lẩu cay</button>
      </div>
      <Hint>3 con số · 3 chiều · cùng một thứ tự</Hint>
    </>
  );
}
function Embed() {
  const [s, setS] = useState(0);
  return (
    <>
      <Top title="Cùng model, cùng không gian" tag="SỐ MINH HỌA" />
      <div className="chips">
        {["Áo nỉ giữ ấm", "Hoodie đi trời lạnh", "Quần short mùa hè"].map(
          (t, i) => (
            <button
              className={s === i ? "selected" : ""}
              key={t}
              onClick={() => setS(i)}
            >
              {t}
            </button>
          ),
        )}
      </div>
      <div className="machine">
        <span>
          <FileText />
          Văn bản
        </span>
        <ArrowRight />
        <span className="machine-core">
          <BrainCircuit />
          Embedding model
        </span>
        <ArrowRight />
        <span>
          <Layers />
          Vector
        </span>
      </div>
      <div className="embedding-grid">
        {Array.from({ length: 24 }, (_, i) => {
          const n = Math.sin(i * 3.2 + (s === 2 ? 5 : s * 0.15));
          return (
            <div
              key={i}
              style={{
                background: `rgba(113,85,214,${0.1 + (n + 1) * 0.32})`,
                color: n > 0.5 ? "#fff" : "#574682",
              }}
            >
              {n.toFixed(2)}
            </div>
          );
        })}
      </div>
      <Hint>
        {s === 2
          ? "Đổi chủ đề → bộ số thay đổi nhiều hơn trong ví dụ này."
          : "Hai cách nói gần nghĩa → bộ số tương tự trong ví dụ này."}
      </Hint>
      <p className="fineprint">
        24 ô số giả lập. Không phải output từ embedding model thật.
      </p>
    </>
  );
}
function Space() {
  const [yaw, setYaw] = useState(32);
  const [pitch, setPitch] = useState(18);
  const [warm, setWarm] = useState(8);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const query = [warm, 8, 3];
  const project = (v: number[]) => {
    let [x, y, z] = v.map((n) => (n - 5) * 22);
    const a = (yaw * Math.PI) / 180,
      b = (pitch * Math.PI) / 180;
    const xx = x * Math.cos(a) - z * Math.sin(a),
      zz = x * Math.sin(a) + z * Math.cos(a);
    return [260 + xx, 174 - y * Math.cos(b) + zz * Math.sin(b), zz];
  };
  const nearest = [...products].sort(
    (a, b) =>
      a.v.reduce((s, v, i) => s + (v - query[i]) ** 2, 0) -
      b.v.reduce((s, v, i) => s + (v - query[i]) ** 2, 0),
  )[0];
  const axes = [
    [[0, 0, 0], [10, 0, 0], "Độ ấm"],
    [[0, 0, 0], [0, 10, 0], "Thoải mái"],
    [[0, 0, 0], [0, 0, 10], "Trang trọng"],
  ] as const;
  const qq = project(query);
  return (
    <>
      <Top title="Bản đồ vector 3D" tag="KÉO ĐỂ XOAY" />
      <svg
        className="space"
        viewBox="0 0 520 360"
        role="img"
        aria-label="Không gian 3D các sản phẩm theo độ ấm, thoải mái, trang trọng"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, y: e.clientY };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerMove={(e) => {
          if (drag.current) {
            setYaw((a) => a + (e.clientX - drag.current!.x) * 0.6);
            setPitch((a) =>
              Math.max(
                -70,
                Math.min(70, a + (e.clientY - drag.current!.y) * 0.4),
              ),
            );
            drag.current = { x: e.clientX, y: e.clientY };
          }
        }}
      >
        {Array.from({ length: 6 }, (_, i) => {
          const a = project([i * 2, 0, 0]),
            b = project([i * 2, 0, 10]),
            c = project([0, 0, i * 2]),
            d = project([10, 0, i * 2]);
          return (
            <g key={i}>
              <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#e3e3ed" />
              <line x1={c[0]} y1={c[1]} x2={d[0]} y2={d[1]} stroke="#e3e3ed" />
            </g>
          );
        })}
        {axes.map(([a, b, label]) => {
          const p = project([...a]),
            q = project([...b]);
          return (
            <g key={label}>
              <line
                x1={p[0]}
                y1={p[1]}
                x2={q[0]}
                y2={q[1]}
                stroke="#aaa3c7"
                strokeWidth="1.5"
              />
              <text
                x={q[0]}
                y={q[1] - 12}
                textAnchor="middle"
                fontSize="12"
                fill="#78718c"
              >
                {label}
              </text>
            </g>
          );
        })}
        {products.map((p) => {
          const c = project(p.v);
          return (
            <g key={p.id}>
              {nearest.id === p.id && (
                <line
                  x1={qq[0]}
                  y1={qq[1]}
                  x2={c[0]}
                  y2={c[1]}
                  stroke="#7d61dc"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                />
              )}
              <circle
                cx={c[0]}
                cy={c[1]}
                r={nearest.id === p.id ? 10 : 7}
                fill={p.warm ? "#9678e1" : "#78bfa5"}
                stroke="white"
                strokeWidth="3"
              />
              <text x={c[0] + 13} y={c[1] - 8} fontSize="12" fill="#58536d">
                {p.id}
              </text>
            </g>
          );
        })}
        <circle cx={qq[0]} cy={qq[1]} r="17" fill="#ffc65040" />
        <circle cx={qq[0]} cy={qq[1]} r="7" fill="#e3a527" />
        <text x={qq[0] + 13} y={qq[1] + 20} fontSize="13" fill="#866420">
          Bạn
        </text>
      </svg>
      <div className="two-ranges">
        <Range label="Nhu cầu giữ ấm" value={warm} onChange={setWarm} />
        <Range
          label="Góc xoay"
          value={yaw}
          min={-180}
          max={180}
          onChange={setYaw}
        />
      </div>
      <Hint>
        Gần nhất:{" "}
        <strong>
          {nearest.id} · {nearest.name}
        </strong>
        <br />
        Query = [{query.join(", ")}] · Euclidean distance
      </Hint>
    </>
  );
}
function Score() {
  const [angle, setAngle] = useState(25);
  const score = Math.cos((angle * Math.PI) / 180);
  return (
    <>
      <Top title="Cùng hướng đến đâu?" />
      <svg className="score-svg" viewBox="0 0 440 235">
        <circle cx="210" cy="133" r="90" fill="#f6f3ff" />
        <line x1="90" y1="133" x2="360" y2="133" stroke="#dad5e7" />
        <line x1="210" y1="23" x2="210" y2="223" stroke="#dad5e7" />
        <line
          x1="210"
          y1="133"
          x2="300"
          y2="133"
          stroke="#72b99e"
          strokeWidth="5"
        />
        <circle cx="300" cy="133" r="6" fill="#72b99e" />
        <line
          x1="210"
          y1="133"
          x2={210 + 90 * score}
          y2={133 - 90 * Math.sin((angle * Math.PI) / 180)}
          stroke="#8064d7"
          strokeWidth="5"
        />
        <circle
          cx={210 + 90 * score}
          cy={133 - 90 * Math.sin((angle * Math.PI) / 180)}
          r="6"
          fill="#8064d7"
        />
        <text x="305" y="155" fill="#529178" fontSize="13">
          Sản phẩm
        </text>
        <text x="20" y="30" fill="#8064d7" fontSize="13">
          ● Truy vấn
        </text>
      </svg>
      <div className="big-score">
        {score.toFixed(3)}
        <span>cosine similarity</span>
      </div>
      <Range
        label="Góc giữa hai vector (°)"
        value={angle}
        max={180}
        onChange={setAngle}
      />
      <Hint>
        cos({angle}°) = {score.toFixed(3)} ·{" "}
        {angle < 45
          ? "Gần cùng hướng"
          : angle > 135
            ? "Gần ngược hướng"
            : "Hướng khác nhau"}
      </Hint>
    </>
  );
}
const pipelines: Record<
  number,
  { title: string; steps: string[]; details: string[] }[]
> = {
  9: [
    {
      title: "Một bản ghi trong vector DB",
      steps: [
        "ID: P02",
        "Vector: [8, 9, 2]",
        "Payload: hoodie, giá, màu",
        "Index → top-k",
      ],
      details: [
        "ID giúp cập nhật hoặc xóa đúng bản ghi.",
        "Bộ số minh họa dùng để tính độ gần.",
        "Nội dung và metadata hỗ trợ filter, hiển thị và trích nguồn.",
        "Index ANN như HNSW có thể giảm số ứng viên cần so sánh; có đánh đổi recall.",
      ],
    },
  ],
  10: [
    {
      title: "Chuẩn bị trước khi khách tìm",
      steps: ["Sản phẩm", "Embedding model", "Upsert vào DB"],
      details: [
        "Tên, mô tả và thuộc tính cần thiết.",
        "Encode nội dung mỗi sản phẩm một lần hoặc khi thay đổi.",
        "Lưu ID, vector, nội dung, metadata.",
      ],
    },
    {
      title: "Khi khách bấm tìm",
      steps: ["Query + filter", "Encode query", "Tìm top-k", "Hiển thị"],
      details: [
        "“Áo đi Đà Lạt”, giá dưới 400k.",
        "Cùng embedding model/không gian với sản phẩm.",
        "Lọc giá và tìm vector gần query.",
        "Trả danh sách có thật trong catalog.",
      ],
    },
  ],
  11: [
    {
      title: "Model = f(x; θ)",
      steps: ["Input x", "Kiến trúc + trọng số θ", "Output"],
      details: [
        "Có thể là văn bản, hình ảnh, số hoặc âm thanh.",
        "Các phép toán kết hợp với những tham số đã được học.",
        "Tùy loại model: nhãn, vector, logits, ảnh…",
      ],
    },
  ],
  13: [
    {
      title: "Mình thích lập trình",
      steps: ["Token", "Token ID", "Embedding", "Vị trí"],
      details: [
        "[“Mình”, “ thích”, “ lập”, “ trình”] — cách chia minh họa.",
        "[41, 205, 78, 912] — ID minh họa do tokenizer ánh xạ.",
        "Tra bảng: ID 41 → [0.2, −0.7, …]. Mỗi token có một vector.",
        "Đưa thông tin thứ tự/vị trí vào quá trình tính của model.",
      ],
    },
  ],
  17: [
    {
      title: "RAG = tìm + bổ sung + tạo",
      steps: ["Retrieve", "Augment", "Generate"],
      details: [
        "Tìm những đoạn liên quan đến câu hỏi trong nguồn dữ liệu.",
        "Đưa đoạn tìm được cùng hướng dẫn và câu hỏi vào context.",
        "LLM sinh câu trả lời dựa trên context vừa nhận.",
      ],
    },
  ],
  21: [
    {
      title: "Cùng một yêu cầu, khác loại đầu ra",
      steps: ["Search", "Generate text", "Generate image"],
      details: [
        "“Tìm hoodie tím” → trả sản phẩm P02 đã có trong catalog.",
        "“Viết mô tả hoodie tím” → tạo một đoạn văn mới từ ngữ cảnh.",
        "“Vẽ hoodie tím có ngôi sao” → tạo một hình ảnh theo prompt.",
      ],
    },
  ],
};
function Pipeline({ index }: { index: number }) {
  const [lane, setLane] = useState(0),
    [step, setStep] = useState(0);
  const data = pipelines[index][lane];
  return (
    <>
      <Top title={data.title} tag="BẤM TỪNG BƯỚC" />
      {pipelines[index].length > 1 && (
        <div className="chips">
          {pipelines[index].map((p, i) => (
            <button
              className={lane === i ? "selected" : ""}
              key={p.title}
              onClick={() => {
                setLane(i);
                setStep(0);
              }}
            >
              {i === 0 ? "01 · Chuẩn bị" : "02 · Khi tìm kiếm"}
            </button>
          ))}
        </div>
      )}
      <div className="pipeline">
        {data.steps.map((s, i) => (
          <button
            className={
              "pipeline-step " +
              (step === i ? "chosen" : step > i ? "done" : "")
            }
            key={s}
            onClick={() => setStep(i)}
          >
            <span className="step-icon">
              {step > i ? <Check size={20} /> : i + 1}
            </span>
            <strong>{s}</strong>
            {i < data.steps.length - 1 && (
              <ArrowRight className="flow-arrow" size={16} />
            )}
          </button>
        ))}
      </div>
      <div className="explanation" aria-live="polite">
        <span>BƯỚC {step + 1}</span>
        <p>{data.details[step]}</p>
      </div>
      <button
        className="small-button wide"
        onClick={() => setStep((step + 1) % data.steps.length)}
      >
        {step === data.steps.length - 1 ? (
          <RotateCcw size={16} />
        ) : (
          <Play size={16} />
        )}{" "}
        {step === data.steps.length - 1 ? "Xem lại" : "Chạy bước tiếp theo"}
      </button>
    </>
  );
}
function Training() {
  const [w, setW] = useState(1);
  const [n, setN] = useState(0);
  const loss = (8 - w) ** 2;
  return (
    <>
      <Top title="Model nhỏ xíu: y = w × x" tag="x = 1 · y MỤC TIÊU = 8" />
      <div className="training-stats">
        <div>
          <small>Trọng số w</small>
          <strong>{w.toFixed(2)}</strong>
        </div>
        <div>
          <small>Dự đoán y</small>
          <strong>{w.toFixed(2)}</strong>
        </div>
        <div>
          <small>Loss</small>
          <strong>{loss.toFixed(2)}</strong>
        </div>
      </div>
      <div className="target-track">
        <span style={{ left: `${w * 10}%` }}>●</span>
        <b style={{ left: "80%" }}>8</b>
      </div>
      <div className="action-row">
        <button
          className="small-button"
          onClick={() => {
            setW(w + 0.2 * (8 - w));
            setN(n + 1);
          }}
        >
          <Play size={16} />
          Học một bước
        </button>
        <button
          className="quiet"
          aria-label="Reset training"
          onClick={() => {
            setW(1);
            setN(0);
          }}
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <Hint>{n} lần cập nhật · loss = (dự đoán − mục tiêu)²</Hint>
      <div className="comparison">
        <div>
          <strong>Training</strong>
          <span>Thay đổi trọng số</span>
        </div>
        <div>
          <strong>Inference</strong>
          <span>Dùng trọng số đã học</span>
        </div>
      </div>
    </>
  );
}
function Attention() {
  const [which, setWhich] = useState(0);
  const texts = [
    ["Mình", "thích", "lập", "trình"],
    ["Con", "chuột", "ăn", "phô mai"],
    ["Con", "chuột", "máy tính", "bị hỏng"],
  ];
  const [token, setToken] = useState(1);
  return (
    <>
      <Top title="Token nhìn ngữ cảnh" tag="QUAN HỆ MINH HỌA" />
      <div className="chips">
        {texts.map((_, i) => (
          <button
            key={i}
            className={which === i ? "selected" : ""}
            onClick={() => {
              setWhich(i);
              setToken(1);
            }}
          >
            Ví dụ {i + 1}
          </button>
        ))}
      </div>
      <div className="attention-tokens">
        {texts[which].map((t, i) => (
          <button
            key={i}
            style={{ opacity: i > token ? 0.3 : 1 }}
            className={token === i ? "selected" : ""}
            onClick={() => setToken(i)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="attention-lines">
        {texts[which].map((t, i) => (
          <div key={i}>
            <span>{t}</span>
            <div
              style={{
                width: `${i > token ? 0 : 25 + (((i + which) * 23) % 70)}%`,
              }}
            />
          </div>
        ))}
      </div>
      <Hint>
        Đang xét “{texts[which][token]}”. Causal attention chỉ nhìn vị trí hiện
        tại và phía trước.
      </Hint>
      <p className="fineprint">
        Đến cuối câu, ngữ cảnh phân biệt “chuột” con vật với thiết bị.
      </p>
    </>
  );
}
function Generation() {
  const [n, setN] = useState(0);
  const tokens = [
    " vì",
    " mình",
    " có thể",
    " tạo",
    " ra",
    " những",
    " điều",
    " hữu ích",
    ".",
  ];
  return (
    <>
      <Top title="Vòng lặp sinh văn bản" tag="ĐẦU RA THEO KỊCH BẢN" />
      <div className="chat-bubble">Mình thích lập trình</div>
      <div className="generated-text">
        Mình thích lập trình
        {tokens.slice(0, n).map((t, i) => (
          <span key={i} className="new-token">
            {t}
          </span>
        ))}
        <i />
      </div>
      <div className="mini-flow">
        <span>Context</span>
        <ArrowRight />
        <span>Model → logits</span>
        <ArrowRight />
        <span>Chọn token</span>
      </div>
      <div className="action-row">
        <button
          className="small-button"
          disabled={n === tokens.length}
          onClick={() => setN(n + 1)}
        >
          <Play size={16} />
          Sinh token tiếp
        </button>
        <button
          className="quiet"
          onClick={() => setN(0)}
          aria-label="Chạy lại generation"
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <Hint>
        {n === tokens.length
          ? "Dừng theo kịch bản demo. Model thật có EOS/stop/giới hạn token."
          : `Đã nối ${n} mảnh token minh họa. Token mới trở thành một phần ngữ cảnh.`}
      </Hint>
    </>
  );
}
function Sampling() {
  const [temp, setTemp] = useState(0.7),
    [picked, setPicked] = useState("");
  const probs = [3, 2, 1].map((x) => Math.exp(x / temp));
  const sum = probs.reduce((a, b) => a + b, 0);
  const labels = ["vì", "và", "nhưng"];
  return (
    <>
      <Top title="Token nào được viết tiếp?" tag="LOGITS GIẢ ĐỊNH" />
      <div className="chat-bubble">“Mình thích lập trình …”</div>
      {probs.map((p, i) => (
        <div className="prob-row" key={i}>
          <span>{labels[i]}</span>
          <div>
            <i style={{ width: `${(p / sum) * 100}%` }} />
          </div>
          <strong>{((p / sum) * 100).toFixed(1)}%</strong>
        </div>
      ))}
      <Range
        label="Temperature"
        value={temp}
        min={0.2}
        max={2}
        step={0.1}
        onChange={(n) => {
          setTemp(n);
          setPicked("");
        }}
      />
      <button
        className="small-button wide"
        onClick={() => {
          let r = Math.random(),
            s = 0;
          for (let i = 0; i < 3; i++) {
            s += probs[i] / sum;
            if (r < s) {
              setPicked(labels[i]);
              break;
            }
          }
        }}
      >
        Lấy mẫu một lần
      </button>
      <Hint>
        {picked
          ? `Token lấy mẫu: “${picked}”. Bấm lại có thể ra lựa chọn khác.`
          : "Phân phối tính từ softmax(logits / temperature)."}
      </Hint>
    </>
  );
}
const docSentences = [
  "Hoodie lavender làm từ nỉ, phù hợp trời lạnh.",
  "Sản phẩm có size S, M, L và giá 349.000đ.",
  "Shop nhận đổi size trong 7 ngày.",
  "Sản phẩm đổi phải còn tem và chưa qua sử dụng.",
];
function Chunking() {
  const [size, setSize] = useState(2);
  const chunks = Array.from(
    { length: Math.ceil(docSentences.length / size) },
    (_, i) => docSentences.slice(i * size, (i + 1) * size).join(" "),
  );
  return (
    <>
      <Top title="catalog.md → các chunk" />
      <Range
        label="Số câu trong mỗi chunk"
        min={1}
        max={4}
        value={size}
        onChange={setSize}
      />
      <div className="chunk-list">
        {chunks.map((c, i) => (
          <div key={i}>
            <span>
              CHUNK {i + 1} <small>source: catalog.md</small>
            </span>
            <p>{c}</p>
          </div>
        ))}
      </div>
      <Hint>
        {chunks.length} chunk → {chunks.length} embedding → lưu kèm nguồn
      </Hint>
    </>
  );
}
function Retrieval() {
  const [mode, setMode] = useState(0);
  const docs = [
    "C1 · Áo nỉ P02 giữ ấm, giá 349k",
    "C2 · Chính sách đổi áo trong 7 ngày",
    "C3 · Quần short thoáng mát",
  ];
  const ranks = [
    [1, 0, 2],
    [0, 2, 1],
    [0, 1, 2],
  ];
  return (
    <>
      <Top title="“Áo đi trời lạnh dưới 400k”" tag="THỨ HẠNG MINH HỌA" />
      <div className="chips">
        {["Từ khóa", "Vector", "Hybrid + rerank"].map((m, i) => (
          <button
            key={m}
            className={mode === i ? "selected" : ""}
            onClick={() => setMode(i)}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="rank-list">
        {ranks[mode].map((i, j) => (
          <div key={i}>
            <span>{j + 1}</span>
            <p>{docs[i]}</p>
            {j === 0 && <Sparkles size={18} />}
          </div>
        ))}
      </div>
      <Hint>
        {
          [
            "Khớp chữ “áo” chưa chắc trả lời đúng nhu cầu.",
            "Vector đưa đoạn nói về giữ ấm lên đầu.",
            "Gộp tín hiệu và đánh giá liên quan giúp chọn context.",
          ][mode]
        }
      </Hint>
      <p className="fineprint">
        Rerank là bước tùy chọn. Thứ hạng trên được dựng để minh họa.
      </p>
    </>
  );
}
function Rag() {
  const [n, setN] = useState(0);
  const [found, setFound] = useState(true);
  const stages = ["Câu hỏi", "Retrieve", "Ghép context", "Generate"];
  return (
    <>
      <Top title="Bên trong một lượt hỏi đáp" />
      <label className="toggle-label">
        Có tài liệu liên quan
        <Switch
          checked={found}
          onCheckedChange={(v) => {
            setFound(v);
            setN(0);
          }}
        />
      </label>
      <div className="chat-bubble">Shop có áo ấm dưới 400k không?</div>
      <div className="rag-stages">
        {stages.map((x, i) => (
          <button
            key={x}
            className={i <= n ? "lit" : ""}
            onClick={() => setN(i)}
          >
            {i + 1}. {x}
          </button>
        ))}
      </div>
      <div className="rag-output" aria-live="polite">
        {n === 0 ? (
          <>
            <Search />
            Nhận câu hỏi và điều kiện giá.
          </>
        ) : n === 1 ? (
          <>
            <Database />
            {found
              ? "[C1] Hoodie lavender · nỉ giữ ấm · 349.000đ"
              : "Không tìm thấy bằng chứng phù hợp."}
          </>
        ) : n === 2 ? (
          <>
            <FileText />
            {found
              ? "Context = hướng dẫn bám nguồn + câu hỏi + đoạn C1."
              : "Context ghi nhận không có tài liệu hỗ trợ."}
          </>
        ) : (
          <>
            <Sparkles />
            {found
              ? "Bạn có thể chọn Hoodie lavender bằng nỉ, giá 349.000đ [C1]."
              : "Mình chưa có đủ dữ liệu để xác nhận. Bạn có thể kiểm tra catalog mới nhất của shop."}
          </>
        )}
      </div>
      <button className="small-button wide" onClick={() => setN((n + 1) % 4)}>
        <Play size={16} />
        {n === 3 ? "Chạy lại" : "Chạy bước tiếp theo"}
      </button>
      <p className="fineprint">
        Demo theo kịch bản · không gọi LLM. [C1] là bản ghi catalog giả lập.
      </p>
    </>
  );
}
function Diffusion() {
  const [step, setStep] = useState(0);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let seed = 41;
    const data = ctx.createImageData(120, 120);
    for (let i = 0; i < data.data.length; i += 4) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const n = seed % 256;
      data.data[i] = n;
      data.data[i + 1] = n;
      data.data[i + 2] = n;
      data.data[i + 3] = 255;
    }
    ctx.putImageData(data, 0, 0);
  }, []);
  return (
    <>
      <Top title="Hoodie tím, một ngôi sao nhỏ" tag="MÔ PHỎNG DIFFUSION" />
      <div className="diffusion-image">
        <img
          src="/hoodie.png"
          alt="Ảnh hoodie tím với ngôi sao vàng được tạo sẵn để minh họa diffusion"
          style={{ filter: `blur(${(100 - step) / 10}px)` }}
        />
        <canvas
          width="120"
          height="120"
          ref={canvas}
          style={{ opacity: (100 - step) / 100 }}
        />
        <span>
          {step === 0
            ? "Nhiễu ban đầu"
            : step === 100
              ? "Ảnh minh họa hoàn chỉnh"
              : `Tiến trình minh họa ${step}%`}
        </span>
      </div>
      <Range
        label="Tiến trình khử nhiễu (%)"
        value={step}
        max={100}
        step={5}
        onChange={setStep}
      />
      <div className="mini-flow">
        <span>Prompt</span>
        <ArrowRight />
        <span>Nhiễu + model</span>
        <ArrowRight />
        <span>Decoder → ảnh</span>
      </div>
      <Hint>
        Đây là chuyển cảnh từ nhiễu sang ảnh có sẵn, không phải chạy model thật.
      </Hint>
    </>
  );
}
function Summary() {
  const [pick, setPick] = useState(-1);
  return (
    <>
      <Top title="Một câu hỏi trước khi kết thúc" />
      <p className="quiz-question">
        Giá hoodie vừa đổi. Để chatbot trả lời đúng giá mới, nên làm gì?
      </p>
      <div className="quiz">
        {[
          "Tăng temperature của LLM",
          "Cập nhật dữ liệu catalog và nguồn retrieval",
          "Chỉ tăng số chiều vector",
        ].map((t, i) => (
          <button
            key={t}
            className={pick === i ? (i === 1 ? "correct" : "incorrect") : ""}
            onClick={() => setPick(i)}
          >
            {String.fromCharCode(65 + i)}
            <span>{t}</span>
            {pick === i && i === 1 && <Check size={18} />}
          </button>
        ))}
      </div>
      {pick >= 0 && (
        <Hint>
          {pick === 1
            ? "Đúng! Cập nhật nguồn; thay đổi nội dung thì cập nhật embedding tương ứng. RAG lấy dữ liệu mới vào context."
            : "Chưa đúng. Vấn đề ở dữ liệu nguồn, không phải cách lấy mẫu hay số chiều."}
        </Hint>
      )}
      <div className="recap-tags">
        {[
          "Search: tìm",
          "Embedding: biểu diễn",
          "DB: lưu & truy hồi",
          "Model: tính toán",
          "RAG: nối nguồn",
          "GenAI: tạo",
        ].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </>
  );
}
export function Demo({ index }: { index: number }) {
  if ([1, 2, 3].includes(index)) return <DatabaseDemo mode={index} />;
  if (index < 5) return <Shop mode={index} />;
  if (pipelines[index]) return <Pipeline index={index} />;
  switch (index) {
    case 5:
      return <Taste />;
    case 6:
      return <Embed />;
    case 7:
      return <Space />;
    case 8:
      return <Score />;
    case 12:
      return <Training />;
    case 14:
      return <Attention />;
    case 15:
      return <Generation />;
    case 16:
      return <Sampling />;
    case 18:
      return <Chunking />;
    case 19:
      return <Retrieval />;
    case 20:
      return <Rag />;
    case 22:
      return <Diffusion />;
    case 23:
      return <Summary />;
    default:
      return null;
  }
}
