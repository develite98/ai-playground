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
  StepForward,
  Code2,
  FileText,
  Send,
  MousePointer2,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { products, getSlides } from "./content";
import DatabaseDemo from "./database-demo";
import { useT, type Lang } from "./i18n";
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
function Top({ title, tag }: { title: string; tag?: string }) {
  const { t } = useT();
  return (
    <div className="demo-top">
      <span className="shop-logo">
        <Sparkles size={18} />
        {title}
      </span>
      <span className="demo-tag">{tag ?? t("TƯƠNG TÁC", "INTERACTIVE")}</span>
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
  const { t } = useT();
  return (
    <div className={`product ${dim ? "dim" : ""} ${active ? "active" : ""}`}>
      <div className={"product-art tone-" + ((Number(p.id.slice(1)) - 1) % 3)}>
        {p.id === "P02" ? (
          <img
            src="/hoodie.png"
            alt={t(
              "Hoodie lavender có ngôi sao vàng",
              "Lavender hoodie with a yellow star",
            )}
          />
        ) : (
          <Shirt size={76} strokeWidth={1.3} />
        )}
      </div>
      <strong>{t(p.name, p.nameEn)}</strong>
      <small>
        {t(`${p.price}.000đ`, `${p.price}k VND`)} <span>· {p.id}</span>
      </small>
    </div>
  );
}
function Shop({ mode }: { mode: number }) {
  const { t } = useT();
  const needQuery = t("áo đi Đà Lạt", "top for a Da Lat trip");
  const [q, setQ] = useState(mode === 1 ? t("áo", "shirt") : needQuery);
  const [scan, setScan] = useState(0);
  const [running, setRunning] = useState(false);
  const [purple, setPurple] = useState(false);
  const [budget, setBudget] = useState(600);
  const [semantic, setSemantic] = useState(false);
  const [term, setTerm] = useState("áo");
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(
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
    return () => clearInterval(timer);
  }, [running]);
  const match = (p: Product) =>
    t(p.name, p.nameEn)
      .toLocaleLowerCase("vi")
      .includes(q.trim().toLocaleLowerCase("vi"));
  const aboutDaLat = /đà lạt|da lat/.test(q.toLocaleLowerCase("vi"));
  return (
    <>
      <Top
        title="little closet"
        tag={mode === 1 ? "LINEAR SEARCH" : t("CỬA HÀNG CỦA CHÚNG TA", "OUR SHOP")}
      />
      {mode === 2 ? (
        <div className="searchbox">
          <Search size={19} />
          <span>Lọc catalog bằng màu sắc và giá</span>
        </div>
      ) : mode === 3 ? (
        <div className="chips">
          {["áo", "hoodie", "quần"].map((x) => (
            <button
              className={term === x ? "selected" : ""}
              key={x}
              onClick={() => setTerm(x)}
            >
              “{x}”
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
            aria-label={t("Tìm sản phẩm", "Search products")}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setScan(0);
              setRunning(false);
              setSemantic(false);
            }}
          />
          <button
            aria-label={t("Chạy tìm kiếm", "Run search")}
            disabled={!q.trim() || running}
          >
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
                    ? aboutDaLat
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
            ? t(
                "Tên sản phẩm không chứa “Đà Lạt”. Nhưng áo ấm có thể phù hợp!",
                "No product name contains “Da Lat”. But warm clothes might fit!",
              )
            : t(
                "Từ vài từ bạn gõ… đến những món đồ phù hợp.",
                "From a few typed words… to matching products.",
              )}
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
              setQ(needQuery);
              setSemantic(!semantic);
            }}
          >
            <Sparkles size={16} />
            {semantic
              ? t("Trở lại tìm đúng chữ", "Back to exact words")
              : t("Thử tìm theo ý nghĩa", "Try searching by meaning")}
          </button>
          <Hint>
            {semantic
              ? t(
                  "Kịch bản minh họa: “Đà Lạt” → nhu cầu giữ ấm → 3 món áo ấm. Máy làm sao hiểu được điều này?",
                  "Scripted example: “Da Lat” → need to stay warm → 3 warm items. How could a machine understand that?",
                )
              : t(
                  "So khớp tên đơn giản: không có kết quả cho “áo đi Đà Lạt”.",
                  "Plain name matching: no results for “top for a Da Lat trip”.",
                )}
          </Hint>
        </>
      )}
    </>
  );
}
function Taste() {
  const [v, setV] = useState([8, 0, 2]);
  const { t } = useT();
  return (
    <>
      <Top title={t("Một vector có thể nếm thử", "A vector you can taste")} />
      <div className="taste-icon">{v[1] > 5 ? "🍲" : "🧋"}</div>
      <div className="vector-code">
        [ <b>{v[0]}</b>, <b>{v[1]}</b>, <b>{v[2]}</b> ]
      </div>
      {t(
        ["Độ ngọt", "Độ cay", "Độ nóng"],
        ["Sweetness", "Spiciness", "Heat"],
      ).map((x, i) => (
        <Range
          key={x}
          label={x}
          value={v[i]}
          onChange={(n) => setV(v.map((x, j) => (i === j ? n : x)))}
        />
      ))}
      <div className="chips">
        <button onClick={() => setV([8, 0, 2])}>
          🧋 {t("Trà sữa", "Milk tea")}
        </button>
        <button onClick={() => setV([1, 9, 9])}>
          🍲 {t("Lẩu cay", "Spicy hotpot")}
        </button>
      </div>
      <Hint>
        {t(
          "3 con số · 3 chiều · cùng một thứ tự",
          "3 numbers · 3 dimensions · one fixed order",
        )}
      </Hint>
    </>
  );
}
// Orthographic 3D → SVG projection shared by the vector-space demos.
// Values 0–10 per axis; returns [x, y, depth] (larger depth = closer).
function project3d(
  v: number[],
  yaw: number,
  pitch: number,
): [number, number, number] {
  const [x, y, z] = v.map((n) => (n - 5) * 22);
  const a = (yaw * Math.PI) / 180,
    b = (pitch * Math.PI) / 180;
  const xx = x * Math.cos(a) - z * Math.sin(a),
    zz = x * Math.sin(a) + z * Math.cos(a);
  return [260 + xx, 174 - y * Math.cos(b) + zz * Math.sin(b), zz];
}
// Drag-to-rotate state for the 3D vector-space demos. Pointer capture starts
// only after a real drag, so clicks on points still reach their handlers.
function useOrbit(initialYaw: number, initialPitch: number) {
  const [yaw, setYaw] = useState(initialYaw),
    [pitch, setPitch] = useState(initialPitch),
    [dragged, setDragged] = useState(false);
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const bind = {
    onPointerDown: (e: React.PointerEvent<SVGSVGElement>) => {
      drag.current = { x: e.clientX, y: e.clientY, moved: false };
    },
    onPointerUp: () => {
      drag.current = null;
    },
    onPointerMove: (e: React.PointerEvent<SVGSVGElement>) => {
      const d = drag.current;
      if (!d) return;
      const dx = e.clientX - d.x,
        dy = e.clientY - d.y;
      if (!d.moved) {
        if (Math.hypot(dx, dy) < 4) return;
        setDragged(true);
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      setYaw((a) => a + dx * 0.6);
      setPitch((a) => Math.max(-70, Math.min(70, a + dy * 0.4)));
      drag.current = { x: e.clientX, y: e.clientY, moved: true };
    },
  };
  return {
    setYaw,
    dragged,
    bind,
    project: (v: number[]) => project3d(v, yaw, pitch),
  };
}
// Floor grid and the three named axes shared by the 3D demos.
function SpaceGrid({
  project,
}: {
  project: (v: number[]) => [number, number, number];
}) {
  const { t } = useT();
  const axes = [
    [[10, 0, 0], t("Độ ấm", "Warmth")],
    [[0, 10, 0], t("Thoải mái", "Comfort")],
    [[0, 0, 10], t("Trang trọng", "Formality")],
  ] as const;
  const o = project([0, 0, 0]);
  return (
    <g>
      {Array.from({ length: 6 }, (_, i) => {
        const a = project([i * 2, 0, 0]),
          b = project([i * 2, 0, 10]),
          c = project([0, 0, i * 2]),
          d = project([10, 0, i * 2]);
        return (
          <g key={i} stroke="#ece9f3">
            <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
            <line x1={c[0]} y1={c[1]} x2={d[0]} y2={d[1]} />
          </g>
        );
      })}
      {axes.map(([end, label]) => {
        const e = project([...end]);
        return (
          <g key={label}>
            <line
              x1={o[0]}
              y1={o[1]}
              x2={e[0]}
              y2={e[1]}
              stroke="#b9b1d3"
              strokeWidth="1.5"
            />
            <text
              x={e[0]}
              y={e[1] - 9}
              textAnchor="middle"
              fontSize="12"
              fill="#8c8499"
            >
              {label}
            </text>
          </g>
        );
      })}
    </g>
  );
}
function Space() {
  const [yaw, setYaw] = useState(32);
  const [pitch, setPitch] = useState(18);
  const [warm, setWarm] = useState(8);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const { t, num } = useT();
  const query = [warm, 8, 3];
  const project = (v: number[]) => project3d(v, yaw, pitch);
  const top = products
    .map((p) => ({
      p,
      d: Math.sqrt(p.v.reduce((s, v, i) => s + (v - query[i]) ** 2, 0)),
    }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 3);
  const rankOf = (id: string) => top.findIndex((x) => x.p.id === id);
  const axes = [
    [[0, 0, 0], [10, 0, 0], t("Độ ấm", "Warmth")],
    [[0, 0, 0], [0, 10, 0], t("Thoải mái", "Comfort")],
    [[0, 0, 0], [0, 0, 10], t("Trang trọng", "Formality")],
  ] as const;
  const qq = project(query);
  return (
    <>
      <Top
        title={t("Bản đồ vector 3D", "3D vector map")}
        tag={t("KÉO ĐỂ XOAY", "DRAG TO ROTATE")}
      />
      <svg
        className="space"
        viewBox="0 0 520 360"
        role="img"
        aria-label={t(
          "Không gian 3D các sản phẩm theo độ ấm, thoải mái, trang trọng",
          "3D space of products by warmth, comfort and formality",
        )}
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
          const c = project(p.v),
            rank = rankOf(p.id);
          return (
            <g key={p.id}>
              {rank >= 0 && (
                <line
                  x1={qq[0]}
                  y1={qq[1]}
                  x2={c[0]}
                  y2={c[1]}
                  stroke="#7d61dc"
                  strokeWidth={rank === 0 ? 2.5 : 1.5}
                  strokeOpacity={1 - rank * 0.25}
                  strokeDasharray="5 5"
                />
              )}
              <circle
                cx={c[0]}
                cy={c[1]}
                r={rank === 0 ? 10 : rank > 0 ? 8.5 : 7}
                fill={p.warm ? "#9678e1" : "#78bfa5"}
                stroke="white"
                strokeWidth="3"
              />
              <text x={c[0] + 13} y={c[1] - 8} fontSize="12" fill="#58536d">
                {rank >= 0 ? `#${rank + 1} ${p.id}` : p.id}
              </text>
            </g>
          );
        })}
        <circle cx={qq[0]} cy={qq[1]} r="17" fill="#ffc65040" />
        <circle cx={qq[0]} cy={qq[1]} r="7" fill="#e3a527" />
        <text
          x={qq[0] - 14}
          y={qq[1] + 5}
          textAnchor="end"
          fontSize="13"
          fill="#866420"
        >
          {t("Bạn", "You")}
        </text>
      </svg>
      <div className="two-ranges">
        <Range
          label={t("Nhu cầu giữ ấm", "Need for warmth")}
          value={warm}
          onChange={setWarm}
        />
        <Range
          label={t("Góc xoay", "Rotation")}
          value={yaw}
          min={-180}
          max={180}
          onChange={setYaw}
        />
      </div>
      <Hint>
        {t("Top-3 gần nhất:", "Top-3 nearest:")}{" "}
        {top.map((x, i) => (
          <span key={x.p.id}>
            {i > 0 && " · "}
            <strong>
              {x.p.id} {t(x.p.name, x.p.nameEn)}
            </strong>{" "}
            ({num(x.d, 2)})
          </span>
        ))}
        <br />
        Query = [{query.join(", ")}] · Euclidean distance
      </Hint>
    </>
  );
}
const dot = (a: number[], b: number[]) =>
  a.reduce((s, x, i) => s + x * b[i], 0);
const norm = (v: number[]) => Math.sqrt(dot(v, v));
function Score() {
  const { t, num } = useT();
  const vn = (n: number) => num(n, 3);
  const [q, setQ] = useState([8, 8, 3]);
  const [sel, setSel] = useState("P01");
  // A zero query vector has no direction, so cosine is undefined.
  const cos = (v: number[]) =>
    norm(q) === 0 ? null : dot(q, v) / (norm(q) * norm(v));
  const rows = products
    .map((p) => ({ p, s: cos(p.v) }))
    .sort((a, b) => (b.s ?? 0) - (a.s ?? 0));
  const cur = products.find((p) => p.id === sel)!;
  const score = cos(cur.v);
  const angle = score === null ? 0 : Math.acos(Math.min(1, score));
  return (
    <>
      <Top
        title={t("Cùng hướng đến đâu?", "How aligned are they?")}
        tag={t("TÍNH TRÊN VECTOR SẢN PHẨM", "COMPUTED ON PRODUCT VECTORS")}
      />
      <div className="three-ranges">
        {t(
          ["Độ ấm", "Thoải mái", "Trang trọng"],
          ["Warmth", "Comfort", "Formality"],
        ).map((label, i) => (
          <Range
            key={label}
            label={label}
            value={q[i]}
            onChange={(n) => setQ(q.map((x, j) => (i === j ? n : x)))}
          />
        ))}
      </div>
      <div className="score-top">
        <svg
          className="score-svg"
          viewBox="0 0 230 150"
          role="img"
          aria-label={t(
            `Góc giữa truy vấn và ${cur.id}`,
            `Angle between the query and ${cur.id}`,
          )}
        >
          <path
            d={`M 40 135 L 95 135 A 55 55 0 0 0 ${40 + 55 * Math.cos(angle)} ${135 - 55 * Math.sin(angle)} Z`}
            fill="#efe9ff"
          />
          <line x1="40" y1="135" x2="200" y2="135" stroke="#8064d7" strokeWidth="5" />
          <line
            x1="40"
            y1="135"
            x2={40 + 115 * Math.cos(angle)}
            y2={135 - 115 * Math.sin(angle)}
            stroke="#72b99e"
            strokeWidth="5"
          />
          <text x="150" y="126" fill="#8064d7" fontSize="12">
            {t("Truy vấn", "Query")}
          </text>
          <text
            x={48 + 118 * Math.cos(angle)}
            y={Math.max(14, 128 - 118 * Math.sin(angle))}
            fill="#529178"
            fontSize="12"
          >
            {cur.id}
          </text>
          <text x="100" y="118" fill="#90849d" fontSize="11">
            {Math.round((angle * 180) / Math.PI)}°
          </text>
        </svg>
        <div className="big-score">
          {score === null ? "—" : vn(score)}
          <span>cosine similarity · {t(cur.name, cur.nameEn)}</span>
        </div>
      </div>
      <div className="score-formula">
        {score === null ? (
          t(
            "Vector truy vấn toàn số 0 không có hướng → chưa tính được cosine.",
            "An all-zero query vector has no direction → cosine is undefined.",
          )
        ) : (
          <>
            q·v = {q.map((x, i) => `${x}×${cur.v[i]}`).join(" + ")} ={" "}
            <b>{dot(q, cur.v)}</b>
            <br />
            |q| = {vn(norm(q))} · |v| = {vn(norm(cur.v))} → cos ={" "}
            <b>{vn(score)}</b>
          </>
        )}
      </div>
      <div className="score-rows">
        {rows.map(({ p, s }) => (
          <button
            key={p.id}
            className={"prob-row" + (p.id === sel ? " selected" : "")}
            aria-pressed={p.id === sel}
            onClick={() => setSel(p.id)}
          >
            <span>{p.id}</span>
            <div>
              <i style={{ width: `${(s ?? 0) * 100}%` }} />
            </div>
            <strong>{s === null ? "—" : vn(s)}</strong>
          </button>
        ))}
      </div>
      <Hint>
        {rows[0].s !== null &&
          t(
            `Cùng hướng nhất: ${rows[0].p.name} (${vn(rows[0].s)}). `,
            `Most aligned: ${rows[0].p.nameEn} (${vn(rows[0].s)}). `,
          )}
        {t("Bấm một dòng để xem cách tính.", "Click a row to see the math.")}
      </Hint>
      <p className="fineprint">
        {t(
          "Vector ở đây đều ≥ 0 nên score nằm trong [0, 1]. Score cao không có nghĩa là “phù hợp bấy nhiêu phần trăm”.",
          "All values here are ≥ 0, so scores fall in [0, 1]. A high score does not mean “this many percent relevant”.",
        )}
      </p>
    </>
  );
}
// 3D space = product vectors [warmth, comfort, formality]. Query points are
// hand-set in place of an embedding model; distances are computed live.
const overviewQueries: { vi: string; en: string; v: number[] }[] = [
  { vi: "áo đi Đà Lạt", en: "top for a Da Lat trip", v: [8, 8, 3] },
  { vi: "áo ấm mặc đi làm", en: "warm top for the office", v: [7, 6, 7] },
  { vi: "đồ đi biển mùa hè", en: "summer beach outfit", v: [1, 9, 1] },
  { vi: "đi phỏng vấn xin việc", en: "job interview outfit", v: [3, 4, 9] },
];
// Cluster labels float just above each group of products.
const overviewRegions = [
  { vi: "Đồ giữ ấm", en: "Warm clothes", v: [9, 9.6, 4] },
  { vi: "Mùa hè", en: "Summer", v: [1.5, 6.4, 1.5] },
  { vi: "Công sở", en: "Office", v: [3, 6, 10] },
];
// "How real systems limit results": shown in the (?) popover on this slide.
const topkCode: Record<Lang, string> = {
  vi: `const hits = await vectorDB.search({
  vector: queryVector,
  limit: 20,              // k: lấy tối đa 20 ứng viên
  scoreThreshold: 0.75,   // bỏ những kết quả không đủ gần
  filter: { price: { lte: 400_000 }, inStock: true },
});
const best = rerank(question, hits).slice(0, 5);   // chấm lại, giữ 5 đoạn tốt nhất
const context = fitTokenBudget(best, 3000);        // không vượt ngân sách context`,
  en: `const hits = await vectorDB.search({
  vector: queryVector,
  limit: 20,              // k: take at most 20 candidates
  scoreThreshold: 0.75,   // drop results that aren't close enough
  filter: { price: { lte: 400_000 }, inStock: true },
});
const best = rerank(question, hits).slice(0, 5);   // re-score, keep the best 5
const context = fitTokenBudget(best, 3000);        // stay within the context budget`,
};
const topkLayers: Record<Lang, [string, string, string][]> = {
  vi: [
    ["limit (k)", "số lượng", "lấy 20 ứng viên"],
    ["Ngưỡng score", "độ gần", "cosine < 0,75 → bỏ"],
    ["Filter", "điều kiện nghiệp vụ", "giá, còn hàng, quyền truy cập"],
    ["Rerank", "chất lượng", "20 ứng viên → 5 tốt nhất"],
    ["Ngân sách token", "độ dài context", "thêm theo hạng đến ~3000 token"],
  ],
  en: [
    ["limit (k)", "count", "take 20 candidates"],
    ["Score threshold", "closeness", "cosine < 0.75 → drop"],
    ["Filter", "business rules", "price, in stock, permissions"],
    ["Rerank", "quality", "20 candidates → best 5"],
    ["Token budget", "context length", "add by rank up to ~3000 tokens"],
  ],
};
// Lessons explained right after this overview, in presentation order.
const overviewNext = [
  { demo: 9, vi: "Kho vector (vector database)", en: "Vector store (vector database)" },
  { demo: 6, vi: "Embedding", en: "Embedding" },
  { demo: 26, vi: "Model tự học", en: "How models learn" },
  { demo: 27, vi: "Dữ liệu để học", en: "Training data" },
  { demo: 8, vi: "Score", en: "Score" },
];
function SemanticOverview() {
  const [qi, setQi] = useState(0),
    [stage, setStage] = useState(0),
    [running, setRunning] = useState(false),
    [k, setK] = useState(3),
    [useThreshold, setUseThreshold] = useState(false),
    [radius, setRadius] = useState(4);
  const orbit = useOrbit(35, 20);
  const { dragged, setYaw } = orbit;
  const { t, lang, num } = useT();
  const slides = getSlides(lang);
  const query = overviewQueries[qi];
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => {
      if (stage >= 4) setRunning(false);
      else setStage(stage + 1);
    }, 700);
    return () => clearTimeout(timer);
  }, [running, stage]);
  // Gentle sway (±20°) around the starting angle shows depth while keeping
  // labels readable; stops on drag and for reduced motion.
  useEffect(() => {
    if (dragged || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      setYaw(35 + 20 * Math.sin((now - start) / 2500));
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [dragged, setYaw]);
  const run = (i: number) => {
    setQi(i);
    setStage(1);
    setRunning(true);
  };
  const project = orbit.project;
  const dist = (v: number[]) =>
    Math.sqrt(v.reduce((sum, x, i) => sum + (x - query.v[i]) ** 2, 0));
  const ranked = products
    .map((p) => ({ p, d: dist(p.v) }))
    .sort((a, b) => a.d - b.d);
  // Top-k is purely by rank; the threshold (when on) then drops far results.
  const top = ranked.slice(0, k);
  const kept = useThreshold ? top.filter((x) => x.d <= radius) : top;
  const cut = top.filter((x) => !kept.includes(x));
  const farKept = kept.filter((x) => x.d > radius);
  const rankOf = (id: string) =>
    stage >= 4 ? kept.findIndex((x) => x.p.id === id) : -1;
  const at1 = (x: { p: Product; d: number }) =>
    t(`${x.p.id} cách ${num(x.d, 1)}`, `${x.p.id} at ${num(x.d, 1)}`);
  // Vietnamese uses a decimal comma, so separate coordinates with "; ".
  const point = `[${query.v.join(t("; ", ", "))}]`;
  const qq = project(query.v);
  const flow = t(
    ["Câu tìm", "Embedding model", "Vector", "Tìm lân cận", `Top-${k}`],
    ["Query", "Embedding model", "Vector", "Nearest neighbors", `Top-${k}`],
  );
  const hint = [
    t(
      "Chọn một câu tìm để xem nó đi qua từng bước. Kéo để xoay không gian.",
      "Pick a query to watch it go through each step. Drag to rotate the space.",
    ),
    t("Embedding model đọc câu tìm…", "The embedding model reads the query…"),
    t(
      `…và biến nó thành một điểm trong không gian ý nghĩa: ${point}.`,
      `…and turns it into a point in the space of meaning: ${point}.`,
    ),
    t(
      "Đo khoảng cách tới từng sản phẩm rồi xếp từ gần đến xa.",
      "Measure the distance to every product and sort from closest to farthest.",
    ) +
      (useThreshold
        ? t(" Vòng nét đứt là ngưỡng “đủ gần”.", " The dashed circle is the “close enough” threshold.")
        : ""),
    (kept.length
      ? t(
          `Trả về ${kept.length} món: ${kept.map(at1).join("; ")}.`,
          `Returns ${kept.length}: ${kept.map(at1).join(", ")}.`,
        )
      : t(
          "Không món nào đủ gần → nên trả lời “không tìm thấy” thay vì đoán.",
          "Nothing is close enough → answer “no results” instead of guessing.",
        )) +
      (cut.length
        ? t(
            ` Ngưỡng loại ${cut.map((x) => x.p.id).join(", ")}.`,
            ` The threshold drops ${cut.map((x) => x.p.id).join(", ")}.`,
          )
        : "") +
      (!useThreshold && farKept.length
        ? t(
            ` Không có ngưỡng nên vẫn trả đủ ${k} món, kể cả ${farKept.map((x) => x.p.id).join(", ")} ở xa. Thử bật ngưỡng.`,
            ` Without a threshold it still returns all ${k}, including far-away ${farKept.map((x) => x.p.id).join(", ")}. Try turning the threshold on.`,
          )
        : ""),
  ][stage];
  // Paint far points first so closer ones sit on top.
  const dots = products
    .map((p) => ({ p, at: project(p.v) }))
    .sort((a, b) => a.at[2] - b.at[2]);
  return (
    <>
      <Top
        title={t("Semantic search, toàn cảnh", "Semantic search at a glance")}
        tag={t("KÉO ĐỂ XOAY", "DRAG TO ROTATE")}
      />
      <div className="chips">
        {overviewQueries.map((x, i) => (
          <button
            key={x.vi}
            className={qi === i && stage > 0 ? "selected" : ""}
            onClick={() => run(i)}
          >
            “{x[lang]}”
          </button>
        ))}
      </div>
      <ol className="overview-flow">
        {flow.map((label, i) => (
          <li key={label} className={stage > 0 && i <= stage ? "lit" : ""}>
            <span>{label}</span>
            {i === 2 && stage >= 2 && <code>{point}</code>}
          </li>
        ))}
      </ol>
      <svg
        className="overview-map"
        viewBox="0 20 520 330"
        role="img"
        aria-label={t(
          "Không gian 3 chiều: độ ấm, độ thoải mái và độ trang trọng của các sản phẩm",
          "3D space: warmth, comfort and formality of the products",
        )}
        {...orbit.bind}
      >
        <SpaceGrid project={project} />
        {overviewRegions.map((r) => {
          const at = project(r.v);
          return (
            <text
              key={r.vi}
              x={at[0]}
              y={at[1]}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="#b3a4cf"
            >
              {r[lang]}
            </text>
          );
        })}
        {stage >= 3 && useThreshold && (
          <circle
            cx={qq[0]}
            cy={qq[1]}
            r={radius * 22}
            fill="#ffc6500d"
            stroke="#e3a527"
            strokeDasharray="4 5"
            strokeOpacity="0.7"
          />
        )}
        {stage >= 3 &&
          top.map((x, i) => {
            const at = project(x.p.v);
            return (
              <line
                key={x.p.id}
                x1={qq[0]}
                y1={qq[1]}
                x2={at[0]}
                y2={at[1]}
                stroke={kept.includes(x) ? "#7d61dc" : "#d6cfe3"}
                strokeWidth={i === 0 ? 2.5 : 1.6}
                strokeDasharray="5 4"
              />
            );
          })}
        {dots.map(({ p, at }) => {
          const rank = rankOf(p.id);
          // Depth cue: points nearer the viewer are drawn slightly larger.
          const r = (rank >= 0 ? 9 : 7) * (1 + at[2] / 400);
          return (
            <g key={p.id}>
              <circle
                cx={at[0]}
                cy={at[1]}
                r={r}
                fill={p.warm ? "#9678e1" : "#78bfa5"}
                stroke="#fff"
                strokeWidth="2.5"
              />
              <text
                x={at[0] + 12}
                y={at[1] + 4}
                fontSize="12"
                fill={rank >= 0 ? "#4d3f75" : "#8a8499"}
                fontWeight={rank >= 0 ? 700 : 400}
              >
                {rank >= 0 ? `#${rank + 1} ` : ""}
                {t(p.name, p.nameEn)}
              </text>
            </g>
          );
        })}
        {stage >= 2 && (
          <g className="overview-query" key={qi}>
            <circle cx={qq[0]} cy={qq[1]} r="16" fill="#ffc65040" />
            <circle cx={qq[0]} cy={qq[1]} r="7" fill="#e3a527" />
          </g>
        )}
      </svg>
      <div className="topk-controls">
        <Range label={t("k (số kết quả tối đa)", "k (max results)")} value={k} min={1} max={6} onChange={setK} />
        <div className="topk-threshold">
          <label>
            <Switch
              checked={useThreshold}
              onCheckedChange={setUseThreshold}
              aria-label={t("Áp dụng ngưỡng", "Apply threshold")}
            />
            {t("Áp dụng ngưỡng", "Apply threshold")}
          </label>
          {useThreshold && (
            <Range
              label={t("khoảng cách tối đa", "max distance")}
              value={radius}
              min={1}
              max={8}
              step={0.5}
              onChange={setRadius}
            />
          )}
        </div>
        <span className="help-wrap">
          <button
            className="help-btn"
            aria-label={t("Hệ thống thật giới hạn kết quả thế nào?", "How do real systems limit results?")}
            aria-describedby="topk-help"
          >
            ?
          </button>
          <div role="tooltip" id="topk-help" className="help-pop">
            <b>{t("Hệ thống thật giới hạn kết quả thế nào?", "How do real systems limit results?")}</b>
            <p>
              {t(
                "k do dev cấu hình, không phải người dùng. Thường có nhiều lớp giới hạn chồng lên nhau:",
                "k is configured by developers, not users. Usually several limits stack up:",
              )}
            </p>
            <pre>{topkCode[lang]}</pre>
            <table>
              <thead>
                <tr>
                  <th>{t("Lớp", "Layer")}</th>
                  <th>{t("Giới hạn theo", "Limits by")}</th>
                  <th>{t("Ví dụ", "Example")}</th>
                </tr>
              </thead>
              <tbody>
                {topkLayers[lang].map(([a, b, c]) => (
                  <tr key={a}>
                    <td>
                      <code>{a}</code>
                    </td>
                    <td>{b}</td>
                    <td>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <small>
              {t(
                "Số kết quả thật sự đưa vào dùng có thể ít hơn k, thậm chí bằng 0. Tên hàm trong code là minh họa.",
                "The number of results actually used can be less than k, even 0. Function names are illustrative.",
              )}
            </small>
          </div>
        </span>
      </div>
      {stage >= 4 && (
        <ol className="topk-rank">
          {ranked.map((x, i) => {
            const state = kept.includes(x) ? "kept" : i < k ? "cut" : "beyond";
            return (
              <li key={x.p.id} className={state}>
                <span>#{i + 1}</span>
                <b>{t(x.p.name, x.p.nameEn)}</b>
                <small>{num(x.d, 1)}</small>
                <em>
                  {state === "kept"
                    ? t("✓ trả về", "✓ returned")
                    : state === "cut"
                      ? t("⭕ ngoài ngưỡng", "⭕ over threshold")
                      : t("✂ ngoài top-k", "✂ beyond top-k")}
                </em>
              </li>
            );
          })}
        </ol>
      )}
      <Hint>{hint}</Hint>
      <nav
        className="compare-next"
        aria-label={t("Các bước tiếp theo", "Next steps")}
      >
        <span>{t("Mở từng bước:", "Step by step:")}</span>
        {overviewNext.map((x, i) => {
          const n = slides.findIndex((s) => s.demo === x.demo) + 1;
          return (
            <a key={x.demo} href={`#slide-${n}`}>
              {i > 0 && <ArrowRight size={12} />}
              {x[lang]} <small>{n}</small>
            </a>
          );
        })}
      </nav>
      <p className="fineprint">
        {t(
          "Không gian 3 chiều (ấm, thoải mái, trang trọng) lấy từ vector tự đặt của sản phẩm; vị trí câu tìm do ta đặt thay cho embedding model. Embedding thật có hàng trăm chiều.",
          "The 3D space (warmth, comfort, formality) comes from the products' hand-set vectors; query positions are hand-set in place of an embedding model. Real embeddings have hundreds of dimensions.",
        )}
      </p>
    </>
  );
}
const vecText = (v: number[], sep: string) => `[${v.join(sep)}]`;
function VectorStore() {
  const [sel, setSel] = useState("P02");
  const { t } = useT();
  const orbit = useOrbit(35, 20);
  const project = orbit.project;
  const cur = products.find((p) => p.id === sel)!;
  const [x, y, z] = cur.v;
  const sep = t("; ", ", ");
  // Guides from the selected point down to the floor, then out to two axes.
  const guide = [cur.v, [x, 0, z], [x, 0, 0]].map(project);
  const guide2 = [[x, 0, z], [0, 0, z]].map(project);
  const dots = products
    .map((p) => ({ p, at: project(p.v) }))
    .sort((a, b) => a.at[2] - b.at[2]);
  return (
    <>
      <Top
        title={t("Kho vector của shop", "The shop's vector store")}
        tag={t("BẤM VÀO MỘT ĐIỂM", "CLICK A POINT")}
      />
      <svg
        className="overview-map"
        viewBox="0 20 520 330"
        role="img"
        aria-label={t(
          "Không gian 3 chiều chứa 6 sản phẩm của shop",
          "3D space holding the shop's 6 products",
        )}
        {...orbit.bind}
      >
        <SpaceGrid project={project} />
        <polyline
          points={guide.map((a) => `${a[0]},${a[1]}`).join(" ")}
          fill="none"
          stroke="#e3a527"
          strokeDasharray="4 4"
        />
        <polyline
          points={guide2.map((a) => `${a[0]},${a[1]}`).join(" ")}
          fill="none"
          stroke="#e3a527"
          strokeDasharray="4 4"
        />
        {dots.map(({ p, at }) => {
          const on = p.id === sel;
          return (
            <g
              key={p.id}
              className="store-dot"
              onClick={() => setSel(p.id)}
            >
              <circle
                cx={at[0]}
                cy={at[1]}
                r={(on ? 10 : 7) * (1 + at[2] / 400)}
                fill={p.warm ? "#9678e1" : "#78bfa5"}
                stroke={on ? "#e3a527" : "#fff"}
                strokeWidth={on ? 3 : 2.5}
              />
              <text
                x={at[0] + 12}
                y={at[1] + 4}
                fontSize="12"
                fill={on ? "#4d3f75" : "#8a8499"}
                fontWeight={on ? 700 : 400}
              >
                {t(p.name, p.nameEn)}
              </text>
            </g>
          );
        })}
      </svg>
      <table className="store-table">
        <thead>
          <tr>
            <th>id</th>
            <th>vector</th>
            <th>payload</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr
              key={p.id}
              className={p.id === sel ? "selected" : ""}
              onClick={() => setSel(p.id)}
            >
              <td>
                <button
                  aria-pressed={p.id === sel}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSel(p.id);
                  }}
                >
                  {p.id}
                </button>
              </td>
              <td>
                <code>{vecText(p.v, sep)}</code>
              </td>
              <td>
                {t(p.name, p.nameEn)} · {t(`${p.price}k`, `${p.price}k VND`)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Hint>
        {t(
          `${cur.name} nằm ở: ấm ${x}, thoải mái ${y}, trang trọng ${z}. Ba con số này chính là vector ${vecText(cur.v, sep)}, được lưu thành một dòng trong kho.`,
          `${cur.nameEn} sits at: warmth ${x}, comfort ${y}, formality ${z}. Those three numbers are its vector ${vecText(cur.v, sep)}, stored as one row in the store.`,
        )}
      </Hint>
      <p className="fineprint">
        {t(
          "3 chiều có tên để dễ hình dung. Kho thật lưu hàng trăm con số cho mỗi món và dùng index (ví dụ HNSW) để tìm nhanh.",
          "The 3 dimensions have names to make them easy to picture. A real store keeps hundreds of numbers per item and uses an index (e.g. HNSW) to search fast.",
        )}
      </p>
    </>
  );
}
// New products to index; vectors are hand-set in place of a real model.
const newItems = [
  {
    id: "P07",
    vi: "Áo gió chống nước",
    en: "Waterproof windbreaker",
    descVi: "Áo gió mỏng, chống nước, mặc đi phượt",
    descEn: "Light waterproof windbreaker for road trips",
    v: [6, 7, 4],
  },
  {
    id: "P08",
    vi: "Đầm dự tiệc",
    en: "Party dress",
    descVi: "Đầm lụa dáng dài cho tiệc tối",
    descEn: "Long silk dress for evening parties",
    v: [2, 3, 9],
  },
  {
    id: "P09",
    vi: "Áo giữ nhiệt",
    en: "Thermal top",
    descVi: "Áo giữ nhiệt ôm người cho mùa đông",
    descEn: "Snug thermal top for winter",
    v: [9, 8, 2],
  },
];
function Indexing() {
  const [pick, setPick] = useState(0),
    [stage, setStage] = useState(0),
    [running, setRunning] = useState(false),
    [added, setAdded] = useState<string[]>([]);
  const { t, lang, num } = useT();
  const orbit = useOrbit(35, 20);
  const project = orbit.project;
  const item = newItems[pick];
  const sep = t("; ", ", ");
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => {
      const next = stage + 1;
      setStage(next);
      if (next === 3) {
        setAdded((a) => (a.includes(item.id) ? a : [...a, item.id]));
        setRunning(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [running, stage, item.id]);
  const run = (i: number) => {
    setPick(i);
    setStage(1);
    setRunning(true);
  };
  const nearest = products
    .map((p) => ({
      p,
      d: Math.sqrt(p.v.reduce((sum, x, i) => sum + (x - item.v[i]) ** 2, 0)),
    }))
    .sort((a, b) => a.d - b.d)[0];
  const stored = newItems.filter((n) => added.includes(n.id));
  const flow = t(
    ["Mô tả sản phẩm", "Embedding model", "Vector", "Lưu vào kho"],
    ["Product description", "Embedding model", "Vector", "Save to the store"],
  );
  const hint = [
    t(
      "Chọn một sản phẩm mới để đưa vào kho.",
      "Pick a new product to add to the store.",
    ),
    t(
      `Embedding model đọc mô tả: “${item.descVi}”…`,
      `The embedding model reads the description: “${item.descEn}”…`,
    ),
    t(
      `…và trả về vector ${vecText(item.v, sep)}. Model thật trả về hàng trăm con số.`,
      `…and returns the vector ${vecText(item.v, sep)}. A real model returns hundreds of numbers.`,
    ),
    t(
      `Lưu vào kho: ${item.vi} nằm gần ${nearest.p.name} (cách ${num(nearest.d, 1)}), vì model thấy hai món có ý nghĩa gần nhau.`,
      `Saved: ${item.en} lands near ${nearest.p.nameEn} (${num(nearest.d, 1)} away), because the model sees their meanings as close.`,
    ),
  ][stage];
  return (
    <>
      <Top
        title={t("Thêm sản phẩm mới vào kho", "Adding new products to the store")}
        tag={t(
          `KHO: ${products.length + stored.length} MÓN`,
          `STORE: ${products.length + stored.length} ITEMS`,
        )}
      />
      <div className="chips">
        {newItems.map((x, i) => (
          <button
            key={x.id}
            className={pick === i && stage > 0 ? "selected" : ""}
            disabled={running}
            onClick={() => run(i)}
          >
            {x[lang]}
          </button>
        ))}
      </div>
      <ol className="overview-flow">
        {flow.map((label, i) => (
          <li key={label} className={stage > 0 && i <= stage ? "lit" : ""}>
            <span>{label}</span>
            {i === 2 && stage >= 2 && <code>{vecText(item.v, sep)}</code>}
          </li>
        ))}
      </ol>
      <svg
        className="overview-map"
        viewBox="0 20 520 330"
        role="img"
        aria-label={t(
          "Không gian 3 chiều của kho sản phẩm",
          "3D space of the product store",
        )}
        {...orbit.bind}
      >
        <SpaceGrid project={project} />
        {products.map((p) => {
          const at = project(p.v);
          return (
            <g key={p.id}>
              <circle
                cx={at[0]}
                cy={at[1]}
                r="6"
                fill={p.warm ? "#c9b8ef" : "#b4dccd"}
                stroke="#fff"
                strokeWidth="2"
              />
              <text x={at[0] + 10} y={at[1] + 4} fontSize="11" fill="#a39cb3">
                {t(p.name, p.nameEn)}
              </text>
            </g>
          );
        })}
        {stored.map((n) => {
          const at = project(n.v);
          return (
            <g key={n.id} className="overview-query">
              <circle cx={at[0]} cy={at[1]} r="15" fill="#ffc65040" />
              <circle cx={at[0]} cy={at[1]} r="7" fill="#e3a527" />
              <text
                x={at[0] + 12}
                y={at[1] - 8}
                fontSize="12"
                fontWeight="700"
                fill="#866420"
              >
                {n[lang]}
              </text>
            </g>
          );
        })}
      </svg>
      <Hint>{hint}</Hint>
      <p className="fineprint">
        {t(
          "Vector của sản phẩm mới do ta đặt thay cho embedding model. Làm lần lượt cho cả catalog, ta có kho dữ liệu cho semantic search.",
          "The new products' vectors are hand-set in place of an embedding model. Do this for the whole catalog and you have the store semantic search runs on.",
        )}
      </p>
    </>
  );
}
// Contrastive learning, computed for real on a 2D plane: same-group pairs
// act like springs of rest length PULL_TO (pulled in when far, pushed out when
// overlapping, so labels stay readable); other pairs are pushed apart when
// closer than PUSH_UNDER.
const learnItems = [
  { vi: "áo ấm đi Đà Lạt", en: "warm top for Da Lat", g: 0, start: [2, 8] },
  { vi: "Hoodie nỉ giữ ấm", en: "Warm fleece hoodie", g: 0, start: [8, 2.5] },
  { vi: "đồ đi biển", en: "beach outfit", g: 1, start: [6, 8.5] },
  { vi: "Quần short thoáng mát", en: "Breezy shorts", g: 1, start: [1.5, 3] },
  { vi: "đi phỏng vấn", en: "job interview", g: 2, start: [8.5, 6.5] },
  { vi: "Sơ mi trắng công sở", en: "White office shirt", g: 2, start: [4, 1.5] },
];
const PULL_TO = 1.2,
  PUSH_UNDER = 4,
  LEARN_RATE = 0.3;
const groupColors = ["#9678e1", "#5fb08f", "#e3a527"];
function learnPairs(pos: number[][], visit: (i: number, j: number, d: number) => void) {
  for (let i = 0; i < pos.length; i++)
    for (let j = i + 1; j < pos.length; j++)
      visit(i, j, Math.hypot(pos[j][0] - pos[i][0], pos[j][1] - pos[i][1]));
}
function learnLoss(pos: number[][]) {
  let loss = 0;
  learnPairs(pos, (i, j, d) => {
    loss +=
      learnItems[i].g === learnItems[j].g
        ? (d - PULL_TO) ** 2
        : Math.max(0, PUSH_UNDER - d) ** 2;
  });
  return loss;
}
function learnStep(pos: number[][]) {
  const next = pos.map((p) => [...p]);
  learnPairs(pos, (i, j, d) => {
    const same = learnItems[i].g === learnItems[j].g;
    const force = same ? d - PULL_TO : -Math.max(0, PUSH_UNDER - d);
    const k = (LEARN_RATE * force) / (2 * (d || 1e-6));
    const dx = (pos[j][0] - pos[i][0]) * k,
      dy = (pos[j][1] - pos[i][1]) * k;
    next[i][0] += dx;
    next[i][1] += dy;
    next[j][0] -= dx;
    next[j][1] -= dy;
  });
  return next.map((p) => p.map((v) => Math.max(0.5, Math.min(9.5, v))));
}
function Learning() {
  const start = () => learnItems.map((x) => [...x.start]);
  const [era, setEra] = useState(1),
    [pos, setPos] = useState(start),
    [steps, setSteps] = useState(0),
    [running, setRunning] = useState(false);
  const { t, lang, num } = useT();
  const loss = learnLoss(pos);
  const done = loss < 0.05 || steps >= 30;
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => {
      const next = learnStep(pos);
      setPos(next);
      setSteps(steps + 1);
      if (learnLoss(next) < 0.05 || steps + 1 >= 30) setRunning(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [running, pos, steps]);
  const X = (x: number) => 30 + x * 30,
    Y = (y: number) => 245 - y * 23;
  return (
    <>
      <Top
        title={t("Model học cách xếp chỗ", "How a model learns where things go")}
        tag={t("TÍNH THẬT TRÊN 2D", "COMPUTED LIVE IN 2D")}
      />
      <div className="chips">
        {t(
          ["Ngày xưa: người chấm điểm", "Ngày nay: model tự học"],
          ["Then: people score by hand", "Now: the model learns"],
        ).map((label, i) => (
          <button
            key={label}
            className={era === i ? "selected" : ""}
            onClick={() => setEra(i)}
          >
            {label}
          </button>
        ))}
      </div>
      {era === 0 ? (
        <>
          <table className="store-table learn-table">
            <thead>
              <tr>
                <th>{t("Sản phẩm", "Product")}</th>
                <th>{t("Ấm", "Warm")}</th>
                <th>{t("Thoải mái", "Comfort")}</th>
                <th>{t("Trang trọng", "Formal")}</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{t(p.name, p.nameEn)}</td>
                  {p.v.map((n, i) => (
                    <td key={i}>
                      <code>{n}</code>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <Hint>
            {t(
              `Con người tự đặt tiêu chí và chấm từng ô: ${products.length} món × 3 tiêu chí = ${products.length * 3} lần chấm. Thêm tiêu chí mới (ví dụ “chống nước”) là phải chấm lại tất cả.`,
              `People invent the criteria and fill every cell: ${products.length} items × 3 criteria = ${products.length * 3} scores. Add a new criterion (say “waterproof”) and everything must be scored again.`,
            )}
          </Hint>
          <p className="fineprint">
            {t(
              "Các con số ở những slide trước chính là kiểu này: do người đặt để minh họa.",
              "The numbers on the previous slides are exactly this kind: hand-set for illustration.",
            )}
          </p>
        </>
      ) : (
        <>
          <svg
            className="learn-plane"
            viewBox="0 0 360 260"
            role="img"
            aria-label={t(
              "Mặt phẳng 2D: các câu dịch chuyển trong quá trình học",
              "2D plane: sentences moving during training",
            )}
          >
            <rect x="30" y="15" width="300" height="230" fill="#fcfbff" stroke="#ece9f3" />
            {learnItems.map((a, i) =>
              learnItems.map((b, j) =>
                j > i && a.g === b.g ? (
                  <line
                    key={`${i}-${j}`}
                    x1={X(pos[i][0])}
                    y1={Y(pos[i][1])}
                    x2={X(pos[j][0])}
                    y2={Y(pos[j][1])}
                    stroke={groupColors[a.g]}
                    strokeDasharray="4 4"
                    strokeOpacity="0.7"
                  />
                ) : null,
              ),
            )}
            {learnItems.map((a, i) => (
              <g key={a.vi} className="learn-dot">
                <circle
                  cx={X(pos[i][0])}
                  cy={Y(pos[i][1])}
                  r="6"
                  fill={groupColors[a.g]}
                  stroke="#fff"
                  strokeWidth="2"
                />
                <text
                  x={X(pos[i][0])}
                  y={Y(pos[i][1]) - 10}
                  textAnchor="middle"
                  fontSize="11"
                  fill="#5d4e7a"
                >
                  {a[lang]}
                </text>
              </g>
            ))}
          </svg>
          <div className="action-row">
            <button
              className="small-button"
              disabled={running || done}
              onClick={() => {
                setPos(learnStep);
                setSteps((n) => n + 1);
              }}
            >
              <StepForward size={16} />
              {t("Học 1 bước", "Learn 1 step")}
            </button>
            <button
              className="small-button"
              disabled={done}
              onClick={() => setRunning(!running)}
            >
              <Play size={16} />
              {running ? t("Tạm dừng", "Pause") : t("Tự chạy", "Auto run")}
            </button>
            <button
              className="quiet"
              aria-label={t("Bắt đầu lại", "Start over")}
              onClick={() => {
                setRunning(false);
                setPos(start());
                setSteps(0);
              }}
            >
              <RotateCcw size={16} />
            </button>
            <span>
              {t("Bước", "Step")} {steps} · loss {num(loss, 2)}
            </span>
          </div>
          <Hint>
            {steps === 0
              ? t(
                  "Lúc đầu model chưa biết gì: các câu nằm lộn xộn. Nét đứt nối những câu cùng ý với nhau.",
                  "At first the model knows nothing: sentences are scattered. Dashed lines connect sentences with the same meaning.",
                )
              : done
                ? t(
                    `Sau ${steps} bước: câu cùng ý đã về gần nhau, khác ý bị đẩy ra xa. Không ai đặt tọa độ bằng tay.`,
                    `After ${steps} steps: same-meaning sentences sit together, different ones are pushed apart. Nobody placed coordinates by hand.`,
                  )
                : t(
                    `Bước ${steps}: mỗi bước kéo cặp cùng ý lại gần và đẩy cặp khác ý ra xa. Loss (mức “sai”) giảm dần.`,
                    `Step ${steps}: each step pulls same-meaning pairs closer and pushes others apart. The loss (how “wrong” it is) keeps dropping.`,
                  )}
          </Hint>
        </>
      )}
    </>
  );
}
const dataEras = [
  {
    year: "2009",
    who: 0,
    name: "ImageNet",
    vi: "Hàng triệu ảnh được con người gán nhãn (“đây là con mèo”) qua Amazon Mechanical Turk, một chợ thuê người làm việc nhỏ trên mạng.",
    en: "Millions of images labeled by people (“this is a cat”) through Amazon Mechanical Turk, an online marketplace for small paid tasks.",
  },
  {
    year: "2013",
    who: 1,
    name: "word2vec",
    vi: "Model tự học từ chữ có sẵn: từ nào hay đi cùng những từ giống nhau thì được đặt gần nhau. Không cần ai gán nhãn.",
    en: "The model learns from existing text: words that appear with similar neighbors are placed close together. No labels needed.",
  },
  {
    year: "2019",
    who: 0,
    name: "Sentence-BERT",
    vi: "Embedding cho cả câu. Model được dạy thêm bằng các cặp câu do con người đánh dấu là cùng ý hay khác ý.",
    en: "Embeddings for whole sentences. The model is further trained on sentence pairs that people marked as same or different meaning.",
  },
  {
    year: "2022",
    who: 0,
    name: "InstructGPT",
    vi: "Con người viết câu trả lời mẫu và xếp hạng câu trả lời của model, để chatbot trả lời hữu ích hơn (RLHF).",
    en: "People write example answers and rank the model's answers, so the chatbot becomes more helpful (RLHF).",
  },
  {
    year: "2024",
    who: 2,
    name: "Synthetic data",
    vi: "Một LLM lớn tự viết rất nhiều cặp câu hỏi – đoạn văn để dạy embedding model. Con người vẫn phải lọc và kiểm tra.",
    en: "A large LLM writes lots of question–passage pairs to train an embedding model. People still filter and check them.",
  },
];
const dataMyths = [
  {
    ok: true,
    vi: "Model tự học cách sắp xếp không gian từ dữ liệu chưa gán nhãn.",
    en: "A model learns how to arrange the space from unlabeled data.",
    whyVi: "Đúng. Model tự tạo bài tập từ chính dữ liệu, ví dụ đoán từ bị che hay kéo các cặp cùng ý lại gần.",
    whyEn: "True. The model makes its own exercises from the data, like guessing hidden words or pulling same-meaning pairs together.",
  },
  {
    ok: false,
    vi: "AI tự dựng kho vector cho shop của bạn.",
    en: "AI builds your shop's vector store by itself.",
    whyVi: "Chưa đúng. Bạn vẫn phải đưa dữ liệu của mình qua embedding model rồi lưu vào kho.",
    whyEn: "Not quite. You still run your own data through the embedding model and save it to the store.",
  },
  {
    ok: false,
    vi: "Không còn cần con người gán nhãn nữa.",
    en: "People no longer need to label anything.",
    whyVi: "Chưa đúng. Vẫn cần người để đánh giá chất lượng, xếp hạng câu trả lời và gán nhãn dữ liệu chuyên ngành.",
    whyEn: "Not quite. People are still needed to judge quality, rank answers and label specialist data.",
  },
  {
    ok: true,
    vi: "Có thể dùng AI để tạo dữ liệu dạy AI.",
    en: "AI can be used to create data for teaching AI.",
    whyVi: "Đúng, nhưng phải lọc kỹ. Dạy lặp đi lặp lại bằng dữ liệu do AI tạo có thể làm model kém dần.",
    whyEn: "True, but it must be filtered carefully. Training again and again on AI-made data can make models worse over time.",
  },
];
function DataTimeline() {
  const [era, setEra] = useState(0),
    [open, setOpen] = useState<number[]>([]);
  const { t, lang } = useT();
  const who = t(
    ["Con người gán nhãn", "Tự học từ dữ liệu", "AI tạo dữ liệu"],
    ["People label", "Learns from raw data", "AI makes data"],
  );
  const cur = dataEras[era];
  return (
    <>
      <Top
        title={t("Ai tạo ra dữ liệu để AI học?", "Who makes the data AI learns from?")}
        tag={t("DÒNG THỜI GIAN", "TIMELINE")}
      />
      <div className="timeline">
        {dataEras.map((x, i) => (
          <button
            key={x.year}
            className={`who-${x.who} ${era === i ? "selected" : ""}`}
            aria-pressed={era === i}
            onClick={() => setEra(i)}
          >
            <b>{x.year}</b>
            <span>{x.name}</span>
          </button>
        ))}
      </div>
      <div className="timeline-card" aria-live="polite">
        <span className={`who-badge who-${cur.who}`}>{who[cur.who]}</span>
        <p>{cur[lang]}</p>
      </div>
      <p className="myth-title">{t("Đúng hay hiểu nhầm? Bấm để xem.", "True or myth? Click to check.")}</p>
      <div className="myths">
        {dataMyths.map((m, i) => {
          const shown = open.includes(i);
          return (
            <button
              key={m.vi}
              className={shown ? (m.ok ? "correct" : "incorrect") : ""}
              aria-expanded={shown}
              onClick={() =>
                setOpen((o) => (shown ? o.filter((x) => x !== i) : [...o, i]))
              }
            >
              <span>{m[lang]}</span>
              {shown && (
                <small>
                  {m.ok ? "✅ " : "❌ "}
                  {t(m.whyVi, m.whyEn)}
                </small>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
// "From prompt to code": an animated, scripted walk through one LLM call.
// Token splits, IDs, matrices and probabilities are illustrative.
const p2cPrompt: Record<Lang, string> = {
  vi: "Viết React component nút Like có đếm số lượt bấm",
  en: "Write a React Like button that counts clicks",
};
const p2cTokens: Record<Lang, [string, number][]> = {
  vi: [
    ["Vi", 23471],
    ["ết", 9201],
    [" React", 3882],
    [" component", 3777],
    [" n", 308],
    ["út", 15634],
    [" Like", 9086],
    [" có", 25759],
    [" đ", 44036],
    ["ếm", 31282],
    [" số", 16534],
    [" lượt", 79413],
    [" bấm", 61207],
  ],
  en: [
    ["Write", 8144],
    [" a", 264],
    [" React", 3882],
    [" Like", 9086],
    [" button", 3215],
    [" that", 430],
    [" counts", 14921],
    [" clicks", 28849],
  ],
};
const p2cCode = `import { useState } from "react";

export function LikeButton() {
  const [likes, setLikes] = useState(0);
  return (
    <button onClick={() => setLikes(likes + 1)}>
      ♥ {likes}
    </button>
  );
}`;
// The model emits ONE token stream. The app routes it: plain text goes to
// the chat, the ```tsx block goes to the file. The first tokens are shown
// step by step (illustrative probabilities); the rest streams quickly.
const p2cSteps: Record<Lang, { options: [string, number][]; id: number }[]> = {
  vi: [
    { options: [["Đây", 0.58], ["Dưới", 0.2], ["Bạn", 0.1], ["Mình", 0.07]], id: 20478 },
    { options: [[" là", 0.88], [" chính", 0.06], [" có", 0.03], [",", 0.02]], id: 1208 },
    { options: [[" component", 0.64], [" đoạn", 0.19], [" code", 0.1], [" nút", 0.04]], id: 3777 },
    { options: [[" LikeButton", 0.71], [" React", 0.16], [" nút", 0.07], [" mới", 0.03]], id: 51962 },
  ],
  en: [
    { options: [["Here", 0.61], ["Sure", 0.22], ["Below", 0.08], ["This", 0.05]], id: 8586 },
    { options: [[" is", 0.82], ["'s", 0.12], [" are", 0.03], [",", 0.02]], id: 374 },
    { options: [[" the", 0.77], [" a", 0.18], [" your", 0.03], [" one", 0.01]], id: 279 },
    { options: [[" LikeButton", 0.69], [" React", 0.17], [" component", 0.09], [" button", 0.03]], id: 51962 },
  ],
};
const p2cIntro: Record<Lang, string> = {
  vi: "Đây là component LikeButton bạn cần:",
  en: "Here is the LikeButton component you asked for:",
};
const p2cOutro: Record<Lang, string> = {
  vi: "Mỗi lần bấm, số like tăng thêm 1 nhờ useState.",
  en: "Each click adds 1 to the like count, thanks to useState.",
};
// With RAG the model sees the project's Button in its context, so the answer
// reuses it: retrieval visibly changes the output.
const p2cCodeRag = `import { useState } from "react";
import { Button } from "@/components/ui/button";

export function LikeButton() {
  const [likes, setLikes] = useState(0);
  return (
    <Button variant="ghost" onClick={() => setLikes(likes + 1)}>
      ♥ {likes}
    </Button>
  );
}`;
const p2cOutroRag: Record<Lang, string> = {
  vi: "Mình dùng lại Button có sẵn trong dự án để giữ đúng style.",
  en: "I reused the project's existing Button to match your style.",
};
type P2cRoute = "chat" | "fence" | "file" | "outro";
const p2cParts = (lang: Lang, rag: boolean): { to: P2cRoute; text: string }[] => [
  { to: "chat", text: p2cIntro[lang] },
  { to: "fence", text: "```tsx" },
  { to: "file", text: rag ? p2cCodeRag : p2cCode },
  { to: "fence", text: "```" },
  { to: "outro", text: rag ? p2cOutroRag[lang] : p2cOutro[lang] },
];
// Code chunks indexed in the project's vector DB. Vectors (3 of the real
// hundreds of dimensions) are hand-set; cosine to the query is computed live.
const p2cChunks = [
  { name: "FavoriteButton.tsx", v: [7, 8, 3] },
  { name: "Button.tsx", v: [6, 7, 5] },
  { name: "api/likes.ts", v: [7, 3, 7] },
  { name: "Navbar.tsx", v: [2, 6, 3] },
  { name: "useAuth.ts", v: [2, 2, 8] },
  { name: "Footer.tsx", v: [1, 7, 2] },
];
const P2C_QUERY = [7, 7, 3.5];
const p2cRanked = p2cChunks
  .map((c) => ({ ...c, s: dot(c.v, P2C_QUERY) / (norm(c.v) * norm(P2C_QUERY)) }))
  .sort((a, b) => b.s - a.s);
const P2C_TOPK = 2;
// How far the core pipeline moves down to make room for the RAG lane.
const P2C_RAG_SHIFT = 170;
const P2C_STEPS = 4;
type P2cSeg = { kind: string; ms: number; step: number };
const p2cBuild = (rag: boolean): P2cSeg[] => {
  const out: P2cSeg[] = [];
  const add = (kind: string, ms: number, step = 0) =>
    out.push({ kind, ms, step });
  add("type", 1600);
  if (rag) {
    add("e-r1", 500);
    add("remb", 900);
    add("e-r2", 400);
    add("vdb", 1500);
    add("e-r3", 800);
    add("ctx", 700);
  }
  add("e-tok", 500);
  add("tok", 900);
  add("e-emb", 500);
  add("emb", 800);
  Array.from({ length: P2C_STEPS }, (_, i) => {
    const again = i > 0;
    add(again ? "loop" : "e-tf", again ? 800 : 500, i);
    add("tf", again ? 700 : 1300, i);
    add("e-log", 400, i);
    add("log", again ? 700 : 1100, i);
    add("e-samp", 300, i);
    add("samp", again ? 500 : 800, i);
    add("e-detok", 500, i);
    add("e-app", 400, i);
    add("r-chat", 800, i);
  });
  add("fast", 5200, P2C_STEPS);
  add("hold", 3600, P2C_STEPS);
  return out;
};
const p2cSchedules = { off: p2cBuild(false), on: p2cBuild(true) };
const p2cTotals = {
  off: p2cSchedules.off.reduce((n, x) => n + x.ms, 0),
  on: p2cSchedules.on.reduce((n, x) => n + x.ms, 0),
};
// Playback speed: the schedule above is authored at 1×.
const P2C_SPEED = 1.6;
// RAG lane edges, in stage coordinates (above the shifted core pipeline).
const p2cRagPaths: Record<string, number[][]> = {
  "e-r1": [[330, 270], [330, 95], [400, 95]],
  "e-r2": [[580, 95], [620, 95]],
  "e-r3": [[800, 190], [800, 236], [385, 236], [385, 400]],
};
// Stage layout (viewBox 1600 × 820). Straight edges are polylines; the
// autoregressive loop is a cubic curve from Sampling back to Transformer.
const P2C_LOOP = [[1487, 100], [1487, 18], [1010, 8], [1010, 80]];
const p2cPaths: Record<string, number[][]> = {
  "e-tok": [[360, 230], [410, 230]],
  "e-emb": [[620, 230], [665, 230]],
  "e-tf": [[855, 230], [900, 230]],
  "e-log": [[1120, 230], [1165, 230]],
  "e-samp": [[1365, 230], [1405, 230]],
  "e-detok": [[1487, 360], [1487, 480]],
  "e-app": [[1405, 565], [1360, 565]],
  "r-file": [[1190, 565], [1150, 565]],
  "r-chat": [[1275, 480], [1275, 414], [255, 414], [255, 440]],
};
function alongPath(pts: number[][], p: number) {
  const lens = pts.slice(1).map((b, i) => Math.hypot(b[0] - pts[i][0], b[1] - pts[i][1]));
  let d = p * lens.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i]) {
      const k = lens[i] ? d / lens[i] : 0;
      return [
        pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k,
        pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k,
      ];
    }
    d -= lens[i];
  }
  return pts[pts.length - 1];
}
function bezierAt([a, b, c, d]: number[][], t: number) {
  const u = 1 - t;
  return [0, 1].map(
    (k) => u * u * u * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t * t * t * d[k],
  );
}
function heat(row: number, col: number, shift: number) {
  return (Math.sin(row * 1.7 + col * 0.9 + shift) + 1) / 2;
}
// Minimal syntax colouring for the generated TSX.
const p2cSyntax =
  /("[^"]*"|\b(?:import|from|export|function|const|return)\b|\buse[A-Z]\w*|<\/?[A-Za-z]+|[{}()[\]])/;
function codeClass(part: string) {
  if (part.startsWith('"')) return "str";
  if (/^(import|from|export|function|const|return)$/.test(part)) return "kw";
  if (/^use[A-Z]/.test(part)) return "hook";
  if (part.startsWith("<")) return "tag";
  if (/^[{}()[\]]$/.test(part)) return "punct";
  return undefined;
}
const shown = (tk: string) => tk.replace(/ /g, "·");
// Hover / focus tooltips for the prompt-to-code stage. `at` is the tooltip's
// top-left corner in viewBox units; `up` anchors it above instead of below.
type P2cTip = { title: string; body: string; io?: string; fact: string };
const p2cTips: Record<
  string,
  {
    n?: number;
    color: string;
    at: [number, number];
    up?: boolean;
    // RAG-lane tips are placed in stage coordinates, not the shifted pipeline.
    lane?: boolean;
    vi: P2cTip;
    en: P2cTip;
  }
> = {
  "zone-app": {
    color: "#7d61dc",
    at: [40, 486],
    up: true,
    vi: {
      title: "💻 App / IDE · frontend + backend",
      body: "Phần của bạn (hoặc của Cursor, ChatGPT web…): giao diện chat, lưu lịch sử hội thoại, ghép system prompt + lịch sử + context RAG + câu hỏi thành một request, gọi API, nhận stream, hiển thị chat, ghi file, chạy tool.",
      io: "thao tác của user ⇄ request / stream",
      fact: "API thường không nhớ gì giữa các lần gọi: app phải gửi lại lịch sử mỗi lần, và tự cắt bớt khi vượt context window.",
    },
    en: {
      title: "💻 App / IDE · frontend + backend",
      body: "Your side (or Cursor's, ChatGPT web's…): the chat UI, storing conversation history, assembling system prompt + history + RAG context + question into one request, calling the API, receiving the stream, rendering chat, writing files, running tools.",
      io: "user actions ⇄ request / stream",
      fact: "APIs usually remember nothing between calls: the app resends the history every time and trims it when it exceeds the context window.",
    },
  },
  "zone-server": {
    color: "#4f8fd6",
    at: [405, 412],
    vi: {
      title: "☁️ Server của nhà cung cấp model",
      body: "Server của Claude / GPT / Gemini: nhận request dạng chữ, áp chat template (đánh dấu vai system / user / assistant), tokenize, chạy model trên GPU, sampling theo tham số, lặp đến khi dừng, rồi stream từng mảnh chữ về.",
      io: "request (chữ) → stream (chữ)",
      fact: "Tính tiền theo số token vào và ra. Phần prompt lặp lại giữa các lần gọi có thể được cache (prompt caching) để rẻ và nhanh hơn.",
    },
    en: {
      title: "☁️ The model provider's server",
      body: "Claude / GPT / Gemini servers: receive the request as text, apply the chat template (marking system / user / assistant roles), tokenize, run the model on GPUs, sample with your parameters, loop until done, then stream text pieces back.",
      io: "request (text) → stream (text)",
      fact: "Billing counts input and output tokens. Prompt parts repeated across calls can be cached (prompt caching) to be cheaper and faster.",
    },
  },
  "zone-llm": {
    color: "#4f8fd6",
    at: [890, 412],
    vi: {
      title: "🧠 LLM · trọng số",
      body: "Chỉ phần này là “bộ não” đã học: file trọng số hàng GB chạy trên GPU. Mọi thứ xung quanh (tokenizer, sampling, app) là code bình thường.",
      io: "token ID → logits",
      fact: "Với model cỡ ~8B tham số, khoảng 7 tỷ nằm trong ③ Transformer; bảng ② Embedding và phần ④ Logits mỗi phần cỡ 0,5 tỷ.",
    },
    en: {
      title: "🧠 LLM · weights",
      body: "Only this part is the learned “brain”: a multi-GB weights file running on GPUs. Everything around it (tokenizer, sampling, the app) is ordinary code.",
      io: "token IDs → logits",
      fact: "In a ~8B-parameter model, about 7 billion live in ③ Transformer; the ② Embedding table and ④ Logits part are about 0.5 billion each.",
    },
  },
  "gate-req": {
    color: "#7d61dc",
    at: [150, 262],
    vi: {
      title: "Cổng đi: API request",
      body: "App gửi lên server: system prompt, danh sách messages (lịch sử + context RAG + câu hỏi) và tham số như model, temperature, max_tokens.",
      io: "gửi CHỮ (JSON), không phải token",
      fact: "Server mới là nơi tokenize, nên số token (và tiền) phụ thuộc tokenizer của từng nhà cung cấp.",
    },
    en: {
      title: "Outbound gate: API request",
      body: "The app sends: the system prompt, the messages list (history + RAG context + question) and parameters such as model, temperature, max_tokens.",
      io: "sends TEXT (JSON), not tokens",
      fact: "Tokenizing happens on the server, so token counts (and cost) depend on each provider's tokenizer.",
    },
  },
  "gate-stream": {
    color: "#7d61dc",
    at: [900, 256],
    up: true,
    vi: {
      title: "Cổng về: stream",
      body: "Server trả về từng mảnh chữ ngay khi sinh ra (streaming, thường qua Server-Sent Events). App ghép lại rồi quyết định hiển thị ở đâu.",
      io: "từng mảnh chữ → app",
      fact: "Với agent, stream còn có thể chứa “tool call”; app thực thi (sửa file, chạy lệnh) rồi gửi kết quả trong request tiếp theo.",
    },
    en: {
      title: "Inbound gate: stream",
      body: "The server sends text pieces back as soon as they are generated (streaming, usually Server-Sent Events). The app joins them and decides where to show them.",
      io: "text pieces → app",
      fact: "For agents the stream can also contain “tool calls”; the app runs them (edit files, run commands) and sends the results in the next request.",
    },
  },
  remb: {
    color: "#3fa57a",
    at: [250, 200],
    lane: true,
    vi: {
      title: "Embedding model (RAG)",
      body: "Một model riêng, thường nhỏ hơn LLM, biến câu hỏi thành một vector để đi tìm. Khác với bước ② Embedding nằm bên trong LLM.",
      io: "câu hỏi → 1 vector",
      fact: "Code của dự án đã được index sẵn bằng đúng model này từ trước; đổi model là phải index lại.",
    },
    en: {
      title: "Embedding model (RAG)",
      body: "A separate model, usually smaller than the LLM, turns the question into one vector to search with. Not the same as step ② Embedding inside the LLM.",
      io: "question → 1 vector",
      fact: "The project's code was indexed earlier with this same model; switching models means re-indexing.",
    },
  },
  vdb: {
    color: "#3fa57a",
    at: [560, 205],
    lane: true,
    vi: {
      title: "Vector DB",
      body: "Kho chứa vector của từng đoạn code trong dự án. Tìm các đoạn có hướng gần câu hỏi nhất (cosine), dùng index ANN như HNSW để tìm nhanh.",
      io: "1 vector → top-k đoạn code",
      fact: "Model không tự vào kho. App tìm trước rồi dán kết quả vào prompt: đó là chữ R (Retrieval) trong RAG.",
    },
    en: {
      title: "Vector DB",
      body: "Stores a vector for each chunk of the project's code. Finds the chunks pointing closest to the question (cosine), using an ANN index such as HNSW to be fast.",
      io: "1 vector → top-k code chunks",
      fact: "The model never queries the store itself. The app searches first and pastes the results into the prompt: that's the R (Retrieval) in RAG.",
    },
  },
  prompt: {
    color: "#e3a527",
    at: [20, 372],
    vi: {
      title: "Prompt",
      body: "Câu bạn gõ cho AI. App thường ghép thêm system prompt (hướng dẫn ẩn) và ngữ cảnh như file đang mở, thành một đoạn văn bản dài gửi cho model.",
      io: "chữ bạn gõ → một chuỗi văn bản",
      fact: "Model không tự nhớ các lần chat trước: app gửi lại lịch sử mỗi lần hỏi.",
    },
    en: {
      title: "Prompt",
      body: "What you type to the AI. The app usually adds a system prompt (hidden instructions) and context such as the open file, forming one long text sent to the model.",
      io: "your words → one long text",
      fact: "The model doesn't remember earlier chats by itself: the app resends the history every time.",
    },
  },
  tok: {
    n: 1,
    color: "#e3a527",
    at: [275, 372],
    vi: {
      title: "Tokenizer",
      body: "Cắt văn bản thành các mảnh nhỏ gọi là token, rồi đổi mỗi mảnh thành một con số (token ID) theo bảng từ vựng.",
      io: "chữ → dãy token ID",
      fact: "Token không phải là từ: “Viết” có thể thành “Vi” + “ết”. Tiếng Việt thường tốn nhiều token hơn tiếng Anh. Giá API và giới hạn độ dài đều tính theo token.",
    },
    en: {
      title: "Tokenizer",
      body: "Cuts the text into small pieces called tokens, then turns each piece into a number (token ID) from a vocabulary table.",
      io: "text → token IDs",
      fact: "Tokens aren't words: a word may split into several pieces. Many languages need more tokens than English. API pricing and length limits are counted in tokens.",
    },
  },
  emb: {
    n: 2,
    color: "#7d61dc",
    at: [520, 372],
    vi: {
      title: "Embedding",
      body: "Tra bảng: mỗi token ID lấy ra một vector, tức một dãy vài nghìn con số đại diện cho mảnh đó. Thông tin vị trí cũng được thêm vào.",
      io: "N token ID → ma trận N × 4096",
      fact: "Bảng embedding cũng là tham số được học khi train, không do người đặt.",
    },
    en: {
      title: "Embedding",
      body: "A table lookup: each token ID fetches a vector, a list of a few thousand numbers representing that piece. Position information is added too.",
      io: "N token IDs → N × 4096 matrix",
      fact: "The embedding table is also learned during training; nobody fills it in by hand.",
    },
  },
  tf: {
    n: 3,
    color: "#4f8fd6",
    at: [770, 392],
    vi: {
      title: "Transformer",
      body: "Phần “bộ não”: nhiều lớp giống nhau xếp chồng. Mỗi lớp có attention (mỗi token nhìn các token phía trước để lấy ngữ cảnh) và feed-forward (biến đổi thông tin).",
      io: "ma trận N × 4096 → ma trận cùng cỡ, đã có ngữ cảnh",
      fact: "Đây là bước tốn tính toán nhất. KV cache giữ kết quả của các token cũ, nên vòng sau chỉ phải tính thêm cho token mới.",
    },
    en: {
      title: "Transformer",
      body: "The “brain”: many identical layers stacked up. Each layer has attention (every token looks at earlier tokens for context) and a feed-forward part (transforms the information).",
      io: "N × 4096 matrix → same size, now context-aware",
      fact: "This is the most compute-heavy step. The KV cache keeps results for earlier tokens, so each new round only computes the new token.",
    },
  },
  log: {
    n: 4,
    color: "#e07aa3",
    at: [1025, 372],
    vi: {
      title: "Logits",
      body: "Lấy vector ở vị trí cuối, chấm điểm cho mọi token trong từ vựng (khoảng 100 nghìn), rồi softmax đổi điểm thành xác suất.",
      io: "1 vector → ~100k điểm → xác suất",
      fact: "Xác suất ở đây là “khả năng viết tiếp”, không phải mức độ chắc chắn về sự thật.",
    },
    en: {
      title: "Logits",
      body: "Takes the vector at the last position, scores every token in the vocabulary (about 100 thousand), then softmax turns scores into probabilities.",
      io: "1 vector → ~100k scores → probabilities",
      fact: "These are “how likely to come next”, not how sure the model is that something is true.",
    },
  },
  samp: {
    n: 5,
    color: "#3fa57a",
    at: [1100, 372],
    vi: {
      title: "Sampling",
      body: "Chọn một token từ phân phối xác suất. Temperature, top-p, top-k quyết định chọn kiểu “an toàn” hay “đa dạng”.",
      io: "~100k xác suất → 1 token ID",
      fact: "Vì có bước chọn ngẫu nhiên này, cùng một prompt có thể cho ra kết quả khác nhau.",
    },
    en: {
      title: "Sampling",
      body: "Picks one token from the probability distribution. Temperature, top-p and top-k decide between “safe” and “varied” choices.",
      io: "~100k probabilities → 1 token ID",
      fact: "Because of this random pick, the same prompt can give different results.",
    },
  },
  loop: {
    color: "#7d61dc",
    at: [1011, 50],
    vi: {
      title: "Vòng lặp sinh token",
      body: "Token vừa chọn được nối vào cuối context, rồi cả vòng chạy lại để sinh token tiếp theo. Một câu trả lời dài là hàng trăm vòng như vậy.",
      fact: "Dừng khi gặp token kết thúc (EOS) hoặc chạm giới hạn max tokens. Vì vậy câu trả lời hiện ra dần (streaming).",
    },
    en: {
      title: "The generation loop",
      body: "The chosen token is appended to the context, and the whole round runs again to produce the next token. A long answer is hundreds of rounds.",
      fact: "It stops at an end token (EOS) or the max tokens limit. That's why answers appear gradually (streaming).",
    },
  },
  detok: {
    n: 6,
    color: "#e3a527",
    at: [1100, 170],
    up: true,
    vi: {
      title: "Detokenize",
      body: "Đổi token ID ngược lại thành chữ để hiển thị.",
      io: "474 → “import”",
      fact: "Có khi phải ghép vài token mới thành một từ, hoặc một chữ tiếng Việt có dấu.",
    },
    en: {
      title: "Detokenize",
      body: "Turns token IDs back into text for display.",
      io: "474 → “import”",
      fact: "Sometimes several tokens join to form one word or one accented character.",
    },
  },
  app: {
    n: 7,
    color: "#5b6bd6",
    at: [1035, 170],
    up: true,
    vi: {
      title: "App / IDE",
      body: "Model chỉ trả ra một dòng token. App (Cursor, Copilot, ChatGPT…) đọc dòng đó và chia: chữ hiện trong chat, khối ```code``` ghi vào file hoặc hiện nút “Apply”.",
      io: "1 dòng token → chat + file",
      fact: "Với agent, dòng token còn có thể chứa lệnh “gọi tool” (sửa file, chạy lệnh) để app thực hiện.",
    },
    en: {
      title: "App / IDE",
      body: "The model only returns one token stream. The app (Cursor, Copilot, ChatGPT…) reads it and splits it: text goes to the chat, ```code``` blocks go to a file or an “Apply” button.",
      io: "1 token stream → chat + file",
      fact: "For agents, the stream can also contain “tool calls” (edit a file, run a command) that the app executes.",
    },
  },
  chat: {
    color: "#7d61dc",
    at: [20, 130],
    up: true,
    vi: {
      title: "Chat · Response",
      body: "Câu trả lời bạn thấy trong khung chat, hiện dần theo từng token.",
      fact: "Lịch sử chat được gửi lại làm context cho lần hỏi sau, nên chat càng dài thì càng tốn token.",
    },
    en: {
      title: "Chat · Response",
      body: "The answer you see in the chat, appearing token by token.",
      fact: "The chat history is sent again as context next time, so long chats use more tokens.",
    },
  },
  editor: {
    color: "#e3a527",
    at: [585, 130],
    up: true,
    vi: {
      title: "Editor",
      body: "Code được app ghi vào file LikeButton.tsx.",
      fact: "Nên review trước khi chấp nhận: code do AI sinh có thể sai, thiếu trường hợp, hoặc dùng API không tồn tại.",
    },
    en: {
      title: "Editor",
      body: "The code the app writes into LikeButton.tsx.",
      fact: "Review before accepting: AI-written code can be wrong, miss cases, or call APIs that don't exist.",
    },
  },
};
// Width of the legend column shown with the boundaries view.
const P2C_PANEL_W = 380;
const P2C_TIP_W = 480,
  P2C_TIP_H = 300;
function PromptToCode() {
  const { t, lang } = useT();
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Reduced motion starts paused on the finished state.
  const [rag, setRag] = useState(false),
    [zones, setZones] = useState(false);
  const mode = rag ? "on" : "off";
  const schedule = p2cSchedules[mode],
    p2cTotal = p2cTotals[mode];
  const p2cFirst = (kind: string, step = 0) =>
    schedule.findIndex((x) => x.kind === kind && x.step === step);
  const [elapsed, setElapsed] = useState(reduced ? p2cTotals.off - 1 : 0),
    [playing, setPlaying] = useState(!reduced),
    [hover, setHover] = useState<string | null>(null);
  // Pausing while a tooltip is open keeps the explained step on screen.
  useEffect(() => {
    if (!playing || hover) return;
    let last = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      setElapsed((e) => (e + (now - last) * P2C_SPEED) % p2cTotal);
      last = now;
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [playing, hover, p2cTotal]);
  // Hover, keyboard focus and tap (focus) all open the same tooltip.
  const hot = (key: string) => ({
    tabIndex: 0,
    onMouseEnter: () => setHover(key),
    onMouseLeave: () => setHover(null),
    onFocus: () => setHover(key),
    onBlur: () => setHover(null),
  });
  let rest = elapsed,
    si = 0;
  while (si < schedule.length - 1 && rest >= schedule[si].ms) {
    rest -= schedule[si].ms;
    si++;
  }
  const seg = schedule[si];
  const prog = Math.min(1, rest / seg.ms);
  const reached = (kind: string, step = 0) => si >= p2cFirst(kind, step);
  const prompt = p2cPrompt[lang];
  const tokens = p2cTokens[lang];
  const promptChars =
    seg.kind === "type" ? Math.floor(prog * prompt.length) : prompt.length;
  const tokCount = !reached("tok")
    ? 0
    : seg.kind === "tok"
      ? Math.ceil(prog * tokens.length)
      : tokens.length;
  const showIds = reached("e-emb");
  const embCells = !reached("emb") ? 0 : seg.kind === "emb" ? prog : 1;
  const showCtx = reached("tf");
  const steps = p2cSteps[lang];
  const stepChars = steps.map((_, i) =>
    steps.slice(0, i + 1).reduce((n, x) => n + x.options[0][0].length, 0),
  );
  const logStep = steps.reduce((acc, _, i) => (reached("log", i) ? i : acc), -1);
  const sampStep = steps.reduce((acc, _, i) => (reached("samp", i) ? i : acc), -1);
  const growing = seg.kind === "log" ? prog : 1;
  // While sampling, the highlight spins over the options before settling.
  const spinning = seg.kind === "samp" && prog < 0.7;
  const highlight = spinning ? Math.floor(prog * 16) % 4 : 0;
  const doneSteps = steps.reduce(
    (n, _, i) => (si > p2cFirst("r-chat", i) ? i + 1 : n),
    0,
  );
  // Split the characters streamed so far across chat / fence / file / outro.
  const parts = p2cParts(lang, rag);
  const total = parts.reduce((n, x) => n + x.text.length, 0);
  const base = stepChars[stepChars.length - 1];
  const streamed =
    seg.kind === "fast"
      ? base + Math.floor(prog * (total - base))
      : seg.kind === "hold"
        ? total
        : doneSteps
          ? stepChars[doneSteps - 1]
          : 0;
  const starts = parts.map((_, i) =>
    parts.slice(0, i).reduce((n, x) => n + x.text.length, 0),
  );
  const visible = parts.map((x, i) =>
    x.text.slice(0, Math.max(0, streamed - starts[i])),
  );
  // The part currently being streamed decides where the app sends tokens.
  const route: P2cRoute =
    parts.find((x, i) => streamed <= starts[i] + x.text.length)?.to ?? "outro";
  const [chatText, , codeText, , outroText] = visible;
  const routeEdge =
    seg.kind === "fast" ? (route === "file" || route === "fence" ? "r-file" : "r-chat") : "";
  const nodeOf: Record<string, string> = {
    type: "prompt",
    tok: "tok",
    emb: "emb",
    tf: "tf",
    log: "log",
    samp: "samp",
    "e-detok": "detok",
    "e-app": "app",
    "r-chat": "app",
    fast: "app",
    hold: "chat",
    remb: "remb",
    vdb: "vdb",
    "e-r3": "vdb",
    ctx: "prompt",
  };
  const active = nodeOf[seg.kind];
  const shift = rag ? P2C_RAG_SHIFT : 0;
  // Fixed-angle mini 3D view inside the Vector DB tile.
  const mini = (v: number[]) => {
    const [x, y] = project3d(v, 35, 20);
    return [630 + (x - 150) * 0.75, 40 + (y - 60) * 0.7];
  };
  const q2 = mini(P2C_QUERY);
  // RAG progress: the query dot lands, then lines reach the top-k chunks.
  const vdbStage = !rag || !reached("vdb") ? 0 : seg.kind === "vdb" ? (prog < 0.4 ? 1 : 2) : 2;
  const ctxAttached = rag && reached("ctx");
  const packet =
    seg.kind === "loop"
      ? bezierAt(P2C_LOOP, prog)
      : p2cPaths[seg.kind]
        ? alongPath(p2cPaths[seg.kind], prog)
        : p2cRagPaths[seg.kind]
          ? // RAG edges live in stage space; draw inside the shifted group.
            (([x, y]) => [x, y - shift])(alongPath(p2cRagPaths[seg.kind], prog))
          : null;
  const picked = sampStep >= 0 ? steps[sampStep] : null;
  const curStep = seg.step < steps.length ? steps[seg.step] : null;
  const promptLines = wrapWords(prompt.slice(0, promptChars), 24);
  const codeLines = codeText.split("\n");
  const embRows = Math.min(8, tokens.length);
  const tile = (
    key: string,
    n: number,
    color: string,
    x: number,
    y: number,
    w: number,
    h: number,
    title: string,
    sub: string,
  ) => (
    <g
      className={"p2c-tile p2c-hot" + (active === key ? " on" : "")}
      style={{ "--c": color } as React.CSSProperties}
      {...hot(key)}
    >
      <rect x={x} y={y} width={w} height={h} rx="22" />
      <circle cx={x + 28} cy={y + 32} r="14" />
      <text className="p2c-num" x={x + 28} y={y + 37} textAnchor="middle">
        {n}
      </text>
      <text className="p2c-title" x={x + 52} y={y + 31}>
        {title}
      </text>
      <text className="p2c-sub" x={x + 52} y={y + 49}>
        {sub}
      </text>
    </g>
  );
  const note = (x: number, y: number, text: string) => (
    <text className="p2c-note" x={x} y={y} textAnchor="middle">
      {text}
    </text>
  );
  return (
    <div className="p2c-stage">
      <svg
        className="p2c"
        viewBox={`0 0 ${1600 + (zones ? P2C_PANEL_W : 0)} ${820 + shift}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={t(
          "Prompt đi qua tokenizer, embedding, transformer, logits, sampling rồi được decode thành code trả về editor",
          "The prompt goes through tokenizer, embedding, transformer, logits and sampling, then is decoded into code back in the editor",
        )}
      >
        <defs>
          <pattern id="p2c-dots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="#e4def2" />
          </pattern>
          <marker id="p2c-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill="#c3b6e2" />
          </marker>
          <radialGradient id="p2c-glow">
            <stop offset="0" stopColor="#ffd36b" />
            <stop offset="0.45" stopColor="#f2b233" />
            <stop offset="1" stopColor="#f2b233" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={1600 + (zones ? P2C_PANEL_W : 0)} height={820 + shift} fill="url(#p2c-dots)" />

        {zones && (
          <rect className="p2c-zone app" x="12" y="4" width="1576" height={812 + shift} rx="30" />
        )}
        {rag && (
          <g className="p2c-rag">
            <g className="p2c-lane-label">
              <rect x="40" y="18" width="270" height="34" rx="17" />
              <text x="175" y="40" textAnchor="middle">
                {t("🔎 RAG · app tra cứu trước khi hỏi model", "🔎 RAG · the app looks things up first")}
              </text>
            </g>
            {Object.entries(p2cRagPaths).map(([k, pts]) => (
              <polyline
                key={k}
                className={"p2c-edge rag" + (seg.kind === k ? " on" : "")}
                points={pts.map((q) => q.join(",")).join(" ")}
                markerEnd="url(#p2c-arrow)"
              />
            ))}
            <g
              className={"p2c-tile p2c-hot" + (active === "remb" ? " on" : "")}
              style={{ "--c": "#3fa57a" } as React.CSSProperties}
              {...hot("remb")}
            >
              <rect x="400" y="30" width="180" height="140" rx="20" />
              <text className="p2c-title" x="490" y="68" textAnchor="middle">
                Embedding
              </text>
              <text className="p2c-title" x="490" y="90" textAnchor="middle">
                model
              </text>
              <text className="p2c-sub" x="490" y="112" textAnchor="middle">
                {t("câu hỏi → 1 vector", "question → 1 vector")}
              </text>
              {reached("remb") && (
                <text className="p2c-mono" x="490" y="146" textAnchor="middle">
                  [{P2C_QUERY.join(t("; ", ", "))}]
                </text>
              )}
            </g>
            <g
              className={"p2c-tile p2c-hot" + (active === "vdb" ? " on" : "")}
              style={{ "--c": "#3fa57a" } as React.CSSProperties}
              {...hot("vdb")}
            >
              <rect x="620" y="10" width="360" height="180" rx="20" />
              <text className="p2c-title" x="640" y="38">
                Vector DB
              </text>
              <text className="p2c-sub" x="640" y="56">
                {t("code của dự án", "your project's code")}
              </text>
              {p2cChunks.map((c) => {
                const [cx, cy] = mini(c.v);
                const top = vdbStage === 2 && p2cRanked.slice(0, P2C_TOPK).some((r) => r.name === c.name);
                return (
                  <g key={c.name}>
                    {top && (
                      <line
                        x1={q2[0]}
                        y1={q2[1]}
                        x2={cx}
                        y2={cy}
                        stroke="#3fa57a"
                        strokeWidth="2"
                        strokeDasharray="4 3"
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={top ? 6 : 4.5}
                      fill={top ? "#3fa57a" : "#b9dccb"}
                    />
                  </g>
                );
              })}
              {vdbStage >= 1 && (
                <circle
                  className="overview-query"
                  cx={q2[0]}
                  cy={q2[1]}
                  r="6"
                  fill="#e3a527"
                />
              )}
              {vdbStage === 2 &&
                p2cRanked.slice(0, P2C_TOPK).map((r, i) => (
                  <g key={r.name} className="p2c-hit">
                    <rect x="800" y={70 + i * 46} width="166" height="38" rx="10" />
                    <text className="p2c-mono" x="812" y={88 + i * 46}>
                      {r.name}
                    </text>
                    <text className="p2c-mono dim" x="812" y={102 + i * 46}>
                      cos {r.s.toFixed(2).replace(".", lang === "vi" ? "," : ".")}
                    </text>
                  </g>
                ))}
            </g>
          </g>
        )}

        <g transform={`translate(0 ${shift})`}>
        {zones && (
          <g>
            {/* Provider server: ① to ⑥ plus the loop (an L shape). */}
            <path
              className="p2c-zone server"
              d="M398 0 H1590 V668 H1386 V400 H398 Z"
            />
            <rect className="p2c-zone llm" x="652" y="66" width="728" height="322" rx="24" />
          </g>
        )}
        {/* Edges */}
        {Object.entries(p2cPaths).map(([k, pts]) => (
          <polyline
            key={k}
            className={"p2c-edge" + (seg.kind === k || routeEdge === k ? " on" : "")}
            points={pts.map((q) => q.join(",")).join(" ")}
            markerEnd="url(#p2c-arrow)"
          />
        ))}
        <path
          className={"p2c-edge loop" + (seg.kind === "loop" ? " on" : "")}
          d={`M${P2C_LOOP[0].join(" ")} C${P2C_LOOP.slice(1).map((q) => q.join(" ")).join(", ")}`}
          markerEnd="url(#p2c-arrow)"
        />
        <g className={"p2c-loop-label p2c-hot" + (seg.kind === "loop" ? " on" : "")} {...hot("loop")}>
          <rect x="1135" y="10" width="232" height="30" rx="15" />
          <text x="1251" y="30" textAnchor="middle">
            {t("↺ +1 token vào context, lặp lại", "↺ +1 token into context, repeat")}
          </text>
        </g>

        {/* Prompt window */}
        <g className={"p2c-window p2c-hot" + (active === "prompt" ? " on" : "")} {...hot("prompt")}>
          <rect x="40" y="100" width="320" height="260" rx="22" />
          <path d="M40 142 v-20 a22 22 0 0 1 22 -22 h276 a22 22 0 0 1 22 22 v20 z" className="bar" />
          <circle cx="64" cy="121" r="5" fill="#f28b82" />
          <circle cx="82" cy="121" r="5" fill="#f7c65c" />
          <circle cx="100" cy="121" r="5" fill="#7fcf9a" />
          <text className="p2c-wtitle" x="120" y="126">
            Prompt · {t("bạn gõ", "you type")}
          </text>
          {promptLines.map((line, i) => (
            <text key={i} className="p2c-prompt" x="62" y={182 + i * 32}>
              {line}
              {i === promptLines.length - 1 && seg.kind === "type" ? "▌" : ""}
            </text>
          ))}
          {ctxAttached &&
            p2cRanked.slice(0, P2C_TOPK).map((r, i) => (
              <g key={r.name} className="p2c-ctxchip">
                <rect x="58" y={278 + i * 34} width="200" height="28" rx="8" />
                <text x="70" y={297 + i * 34}>
                  + {r.name}
                </text>
              </g>
            ))}
        </g>

        {/* 1 · Tokenizer */}
        {tile("tok", 1, "#e3a527", 410, 100, 210, 260, "Tokenizer", t("cắt chữ thành mảnh", "cuts text into pieces"))}
        {tokens.slice(0, tokCount).map(([tk, id], i) => {
          const x = 422 + (i % 3) * 62,
            y = 164 + Math.floor(i / 3) * 36;
          return (
            <g key={i} className="p2c-chip pop">
              <rect x={x} y={y} width="58" height="32" rx="8" />
              <text className="tk" x={x + 29} y={y + (showIds ? 13 : 20)} textAnchor="middle">
                {shown(tk)}
              </text>
              {showIds && (
                <text className="id" x={x + 29} y={y + 26} textAnchor="middle">
                  {id}
                </text>
              )}
            </g>
          );
        })}
        {tokCount > 0 &&
          note(
            515,
            352,
            rag
              ? t(`${tokens.length} + ~420 mảnh context`, `${tokens.length} + ~420 context tokens`)
              : t(`${tokens.length} mảnh → ${tokens.length} ID`, `${tokens.length} tokens → ${tokens.length} IDs`),
          )}

        {/* 2 · Embedding */}
        {tile("emb", 2, "#7d61dc", 665, 100, 190, 260, "Embedding", t("mảnh → vector", "pieces → vectors"))}
        {embCells > 0 &&
          Array.from({ length: embRows }, (_, r) =>
            Array.from({ length: 9 }, (_, c) =>
              (r * 9 + c) / (embRows * 9) <= embCells ? (
                <rect
                  key={`${r}-${c}`}
                  x={679 + c * 18.5}
                  y={166 + r * 20}
                  width="16"
                  height="16"
                  rx="4"
                  fill={`rgba(125, 97, 220, ${0.12 + heat(r, c, 0) * 0.78})`}
                />
              ) : null,
            ),
          )}
        {embCells > 0 && note(760, 352, rag ? `~${tokens.length + 420} × 4096` : `${tokens.length} × 4096`)}

        {/* 3 · Transformer */}
        {tile("tf", 3, "#4f8fd6", 900, 80, 220, 300, "Transformer", t("đọc ngữ cảnh", "reads the context"))}
        {Array.from({ length: 6 }, (_, i) => {
          const x = 928 + i * 33;
          const on = showCtx && (seg.kind !== "tf" || prog * 6 > i);
          return (
            <g key={i}>
              {i > 0 &&
                Array.from({ length: i }, (_, j) => {
                  const x0 = 928 + j * 33;
                  const h = 6 + (i - j) * 4;
                  return (
                    <path
                      key={j}
                      className="p2c-attn"
                      d={`M${x0} 160 Q${(x0 + x) / 2} ${160 - h} ${x} 160`}
                      style={{ opacity: on ? 0.15 + 0.5 * heat(i, j, seg.kind === "tf" ? prog * 6 : 1) : 0 }}
                    />
                  );
                })}
              <circle cx={x} cy="162" r="6" className={"p2c-tokdot" + (on ? " on" : "")} />
            </g>
          );
        })}
        {Array.from({ length: 6 }, (_, i) => (
          <rect
            key={i}
            className={
              "p2c-layer" +
              (seg.kind === "tf" && Math.floor(prog * 6) === i ? " on" : "") +
              (showCtx && !(seg.kind === "tf" && prog * 6 < i) ? " done" : "")
            }
            x="920"
            y={190 + i * 24}
            width="180"
            height="16"
            rx="6"
          />
        ))}
        {note(1010, 364, t("× 32 lớp", "× 32 layers"))}

        {/* 4 · Logits */}
        {tile("log", 4, "#e07aa3", 1165, 100, 200, 260, "Logits", t("chấm điểm mảnh tiếp theo", "scores the next piece"))}
        {logStep >= 0 &&
          steps[logStep].options.map(([tk, pr], i) => (
            <g key={tk + i}>
              <text className="p2c-mono" x="1181" y={171 + i * 44}>
                {shown(tk)}
              </text>
              <text className="p2c-mono dim" x="1351" y={171 + i * 44} textAnchor="end">
                {Math.round(pr * 100)}%
              </text>
              <rect x="1181" y={178 + i * 44} width="170" height="10" rx="5" fill="#f6eef3" />
              <rect
                x="1181"
                y={178 + i * 44}
                width={170 * pr * growing}
                height="10"
                rx="5"
                fill={i === 0 ? "#e07aa3" : "#efb9cf"}
              />
            </g>
          ))}
        {logStep >= 0 && note(1265, 352, t("~100k lựa chọn", "~100k options"))}

        {/* 5 · Sampling */}
        {tile("samp", 5, "#3fa57a", 1405, 100, 165, 260, "Sampling", t("chọn 1 mảnh", "picks one piece"))}
        {(seg.kind === "samp" ? curStep : picked)?.options.map(([tk], i) => {
          const on = seg.kind === "samp" ? highlight === i : i === 0;
          return (
            <g key={tk + i} className={"p2c-option" + (on ? " on" : "")}>
              <rect x="1419" y={160 + i * 40} width="137" height="32" rx="9" />
              <text x="1487" y={181 + i * 40} textAnchor="middle">
                {shown(tk)}
              </text>
            </g>
          );
        })}
        {picked && !spinning && note(1487, 352, `ID ${picked.id}`)}

        {/* 6 · Detokenize */}
        {tile("detok", 6, "#e3a527", 1405, 480, 165, 170, "Detokenize", t("mảnh → chữ", "pieces → text"))}
        {picked && (
          <g className="p2c-detok">
            <text className="p2c-mono dim" x="1487" y="572" textAnchor="middle">
              {picked.id}
            </text>
            <text className="p2c-mono dim" x="1487" y="596" textAnchor="middle">
              ↓
            </text>
            <text className="p2c-mono big" x="1487" y="626" textAnchor="middle">
              &quot;{picked.options[0][0]}&quot;
            </text>
          </g>
        )}

        {/* 7 · App / IDE routes the stream */}
        {tile("app", 7, "#5b6bd6", 1190, 480, 170, 170, "App / IDE", t("chia luồng token", "routes the tokens"))}
        <g className={"p2c-route" + (active === "app" && route !== "file" && route !== "fence" ? " on" : "")}>
          <rect x="1202" y="548" width="146" height="30" rx="9" />
          <text x="1275" y="568" textAnchor="middle">
            {t("chữ → 💬 Chat", "text → 💬 Chat")}
          </text>
        </g>
        <g className={"p2c-route" + (active === "app" && (route === "file" || route === "fence") ? " on" : "")}>
          <rect x="1202" y="586" width="146" height="30" rx="9" />
          <text x="1275" y="606" textAnchor="middle">
            ```tsx → 📄 file
          </text>
        </g>

        {/* Chat window: the response back to you */}
        <g className={"p2c-window p2c-hot" + (active === "chat" ? " on" : "")} {...hot("chat")}>
          <rect x="40" y="440" width="430" height="350" rx="22" />
          <path d="M40 482 v-20 a22 22 0 0 1 22 -22 h386 a22 22 0 0 1 22 22 v20 z" className="bar" />
          <text className="p2c-wtitle" x="62" y="466">
            💬 Chat · Response
          </text>
          <rect className="p2c-bubble me" x="150" y="496" width="300" height="58" rx="14" />
          {wrapWords(prompt, 34).slice(0, 2).map((line, i) => (
            <text key={i} className="p2c-bubble-text me" x="164" y={520 + i * 20}>
              {line}
            </text>
          ))}
          {chatText && (
            <>
              <rect className="p2c-bubble ai" x="58" y="570" width="394" height={codeText || outroText ? 204 : 62} rx="14" />
              {wrapWords(chatText, 38).map((line, i) => (
                <text key={i} className="p2c-bubble-text" x="74" y={594 + i * 22}>
                  {line}
                  {!codeText && i === wrapWords(chatText, 38).length - 1 && <tspan className="caret">▌</tspan>}
                </text>
              ))}
              {codeText && (
                <g className="p2c-filechip">
                  <rect x="74" y="640" width="190" height="30" rx="8" />
                  <text x="88" y="660">
                    📄 LikeButton.tsx
                  </text>
                </g>
              )}
              {wrapWords(outroText, 38).map((line, i) =>
                line ? (
                  <text key={i} className="p2c-bubble-text" x="74" y={700 + i * 22}>
                    {line}
                  </text>
                ) : null,
              )}
            </>
          )}
        </g>

        {/* Editor window: the file the app writes */}
        <g className={"p2c-window editor p2c-hot" + (routeEdge === "r-file" ? " on" : "")} {...hot("editor")}>
          <rect x="500" y="440" width="650" height="350" rx="22" />
          <path d="M500 482 v-20 a22 22 0 0 1 22 -22 h606 a22 22 0 0 1 22 22 v20 z" className="bar" />
          <circle cx="524" cy="461" r="5" fill="#f28b82" />
          <circle cx="542" cy="461" r="5" fill="#f7c65c" />
          <circle cx="560" cy="461" r="5" fill="#7fcf9a" />
          <text className="p2c-wtitle" x="580" y="466">
            📄 LikeButton.tsx
          </text>
          {codeText &&
            codeLines.map((line, i) => (
              <text key={i} className="p2c-code" x="526" y={520 + i * 26} xmlSpace="preserve">
                {line.split(p2cSyntax).map((part, k) =>
                  part ? (
                    <tspan key={k} className={codeClass(part)}>
                      {part}
                    </tspan>
                  ) : null,
                )}
                {route === "file" && i === codeLines.length - 1 && <tspan className="caret">▌</tspan>}
              </text>
            ))}
        </g>

        {zones && (
          <g>
            <g className="p2c-zone-label server p2c-hot" {...hot("zone-server")}>
              <rect x="404" y="386" width="244" height="28" rx="14" />
              <text x="526" y="405" textAnchor="middle">
                {t("☁️ Server Claude / GPT / Gemini", "☁️ Claude / GPT / Gemini server")}
              </text>
            </g>
            <g className="p2c-zone-label llm p2c-hot" {...hot("zone-llm")}>
              <rect x="1150" y="374" width="220" height="28" rx="14" />
              <text x="1260" y="393" textAnchor="middle">
                {t("🧠 LLM · trọng số", "🧠 LLM · weights")}
              </text>
            </g>
            <g className="p2c-zone-label app p2c-hot" {...hot("zone-app")}>
              <rect x="40" y="792" width="300" height="28" rx="14" />
              <text x="190" y="811" textAnchor="middle">
                💻 App / IDE · frontend + backend
              </text>
            </g>
            <g className="p2c-gate p2c-hot" {...hot("gate-req")}>
              <rect x="336" y="218" width="98" height="24" rx="12" />
              <text x="385" y="234" textAnchor="middle">
                request ➜
              </text>
            </g>
            <g className="p2c-gate p2c-hot" {...hot("gate-stream")}>
              <rect x="1334" y="553" width="98" height="24" rx="12" />
              <text x="1383" y="569" textAnchor="middle">
                ⬅ stream
              </text>
            </g>
          </g>
        )}
        {/* Moving data: a glowing dot, or the token itself on its way to the editor */}
        {packet && seg.kind === "r-chat" && picked ? (
          <g className="p2c-flying">
            <rect x={packet[0] - 48} y={packet[1] - 17} width="96" height="34" rx="10" />
            <text x={packet[0]} y={packet[1] + 6} textAnchor="middle">
              {shown(picked.options[0][0])}
            </text>
          </g>
        ) : packet ? (
          <circle cx={packet[0]} cy={packet[1]} r="15" fill="url(#p2c-glow)" />
        ) : null}
        </g>
        {zones && (
          // Legend column: what each zone is responsible for, readable without hovering.
          <foreignObject x="1610" y="8" width={P2C_PANEL_W - 20} height={804 + shift}>
            <div className="p2c-legend">
              <section className="app">
                <b>💻 App / IDE · FE + BE</b>
                <ul>
                  {t(
                    [
                      "Lưu lịch sử hội thoại",
                      "Ghép system prompt + lịch sử + context + câu hỏi",
                      "RAG: index code, vector DB",
                      "Gọi API, nhận stream",
                      "Chữ → chat, code → file, chạy tool",
                    ],
                    [
                      "Stores conversation history",
                      "Builds system prompt + history + context + question",
                      "RAG: code index, vector DB",
                      "Calls the API, receives the stream",
                      "Text → chat, code → file, runs tools",
                    ],
                  ).map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </section>
              <section className="server">
                <b>☁️ {t("Server nhà cung cấp", "Provider server")}</b>
                <ul>
                  {t(
                    [
                      "Áp chat template (system / user / assistant)",
                      "① Tokenize · ⑥ detokenize",
                      "⑤ Sampling, vòng lặp, KV cache",
                      "Stream về, đếm token để tính tiền",
                    ],
                    [
                      "Applies the chat template (system / user / assistant)",
                      "① Tokenize · ⑥ detokenize",
                      "⑤ Sampling, the loop, KV cache",
                      "Streams back, counts tokens for billing",
                    ],
                  ).map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </section>
              <section className="llm">
                <b>🧠 LLM · {t("trọng số", "weights")}</b>
                <ul>
                  {t(
                    ["② Embedding · ③ Transformer · ④ Logits", "File trọng số hàng GB, chạy trên GPU"],
                    ["② Embedding · ③ Transformer · ④ Logits", "A multi-GB weights file running on GPUs"],
                  ).map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </section>
              <section className="req">
                <b>📨 {t("Request gửi đi (rút gọn)", "The request sent (simplified)")}</b>
                <pre>{`{
  "model": "…",
  "system": "${t("Bạn là trợ lý code…", "You are a coding assistant…")}",
  "messages": [
    ${t("…lịch sử chat…", "…chat history…")},
    { "role": "user",
      "content": "${t("Viết React component…", "Write a React Like…")}" }
  ],
  "temperature": 0.7,
  "max_tokens": 1024,
  "stream": true
}`}</pre>
                <small>{t("Minh họa; tên trường khác nhau đôi chút giữa các nhà cung cấp.", "Illustrative; field names vary slightly between providers.")}</small>
              </section>
            </div>
          </foreignObject>
        )}
        {hover && p2cTips[hover] && (() => {
          const tip = p2cTips[hover];
          const text = tip[lang];
          const x = tip.at[0],
            y = tip.at[1] + (tip.lane ? 0 : shift);
          return (
            <foreignObject
              x={x}
              y={y}
              width={P2C_TIP_W}
              height={P2C_TIP_H}
              className="p2c-tip-box"
            >
              <div
                className={"p2c-tip" + (tip.up ? " up" : "")}
                style={{ "--c": tip.color } as React.CSSProperties}
              >
                <div className="p2c-tip-card">
                  <div className="p2c-tip-head">
                    {tip.n && <span>{tip.n}</span>}
                    <b>{text.title}</b>
                  </div>
                  <p>{text.body}</p>
                  {text.io && (
                    <p className="io">
                      <small>{t("Vào → Ra", "In → Out")}</small> {text.io}
                    </p>
                  )}
                  <p className="fact">💡 {text.fact}</p>
                </div>
              </div>
            </foreignObject>
          );
        })()}
      </svg>
      <div className="p2c-controls">
        <span className="p2c-hover-hint">
          {t("Rê chuột vào từng bước để xem chi tiết", "Hover a step for details")}
        </span>
        <span>
          {seg.kind === "fast" || seg.kind === "hold"
            ? t("stream phần còn lại…", "streaming the rest…")
            : si >= p2cFirst("e-tf")
              ? `token ${seg.step + 1} / ${steps.length}`
              : ""}
        </span>
        <button
          className={"small-button p2c-zone-toggle" + (zones ? " on" : "")}
          aria-pressed={zones}
          onClick={() => setZones(!zones)}
        >
          🗺️ {t("Ranh giới", "Boundaries")}
        </button>
        <button
          className={"small-button p2c-rag-toggle" + (rag ? " on" : "")}
          aria-pressed={rag}
          onClick={() => {
            setRag(!rag);
            setElapsed(0);
            setPlaying(true);
          }}
        >
          🔎 RAG {rag ? t("· bật", "· on") : t("· tắt", "· off")}
        </button>
        <button className="small-button" onClick={() => setPlaying(!playing)}>
          {playing ? t("Tạm dừng", "Pause") : t("Chạy", "Play")}
        </button>
        <button
          className="quiet"
          aria-label={t("Chạy lại từ đầu", "Restart")}
          onClick={() => {
            setElapsed(0);
            setPlaying(true);
          }}
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <p className="p2c-fineprint">
        {t(
          "Mô phỏng theo kịch bản: token, ID, ma trận và xác suất là minh họa; không gọi model thật.",
          "Scripted simulation: tokens, IDs, matrices and probabilities are illustrative; no real model is called.",
        )}
      </p>
    </div>
  );
}
// Greedy word wrap for SVG text (no native wrapping in SVG).
function wrapWords(text: string, width: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    if (line && (line + " " + word).length > width) {
      lines.push(line);
      line = word;
    } else line = line ? line + " " + word : word;
  }
  return [...lines, line];
}
type Lane = { title: string; steps: string[]; details: string[] };
const pipelines: Record<number, Record<Lang, Lane[]>> = {
  10: {
    vi: [
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
    en: [
      {
        title: "Prepared before anyone searches",
        steps: ["Products", "Embedding model", "Upsert into DB"],
        details: [
          "Name, description and the attributes you need.",
          "Encode each product once, and again when it changes.",
          "Store ID, vector, content, metadata.",
        ],
      },
      {
        title: "When the shopper hits search",
        steps: ["Query + filter", "Encode query", "Find top-k", "Display"],
        details: [
          "“Top for a Da Lat trip”, under 400k.",
          "Same embedding model and space as the products.",
          "Filter by price and find vectors close to the query.",
          "Return items that really exist in the catalog.",
        ],
      },
    ],
  },
  11: {
    vi: [
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
    en: [
      {
        title: "Model = f(x; θ)",
        steps: ["Input x", "Architecture + weights θ", "Output"],
        details: [
          "Text, images, numbers or audio.",
          "Operations combined with learned parameters.",
          "Depends on the model: a label, a vector, logits, an image…",
        ],
      },
    ],
  },
  13: {
    vi: [
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
    en: [
      {
        title: "I like to code",
        steps: ["Token", "Token ID", "Embedding", "Position"],
        details: [
          "[“I”, “ like”, “ to”, “ code”] — an illustrative split.",
          "[40, 1093, 311, 2082] — illustrative IDs from the tokenizer.",
          "Table lookup: ID 40 → [0.2, −0.7, …]. Each token gets one vector.",
          "Order/position information is added to the model's computation.",
        ],
      },
    ],
  },
  17: {
    vi: [
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
    en: [
      {
        title: "RAG = retrieve + augment + generate",
        steps: ["Retrieve", "Augment", "Generate"],
        details: [
          "Find passages relevant to the question in your data.",
          "Put those passages, instructions and the question into the context.",
          "The LLM generates an answer from that context.",
        ],
      },
    ],
  },
  21: {
    vi: [
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
    en: [
      {
        title: "Same request, different kinds of output",
        steps: ["Search", "Generate text", "Generate image"],
        details: [
          "“Find a purple hoodie” → returns P02, already in the catalog.",
          "“Describe a purple hoodie” → writes a new paragraph from context.",
          "“Draw a purple hoodie with a star” → creates an image from the prompt.",
        ],
      },
    ],
  },
};
function Pipeline({ index }: { index: number }) {
  const [lane, setLane] = useState(0),
    [step, setStep] = useState(0);
  const { t, lang } = useT();
  const lanes = pipelines[index][lang];
  const data = lanes[lane];
  return (
    <>
      <Top title={data.title} tag={t("BẤM TỪNG BƯỚC", "CLICK EACH STEP")} />
      {lanes.length > 1 && (
        <div className="chips">
          {lanes.map((p, i) => (
            <button
              className={lane === i ? "selected" : ""}
              key={p.title}
              onClick={() => {
                setLane(i);
                setStep(0);
              }}
            >
              {i === 0
                ? t("01 · Chuẩn bị", "01 · Prepare")
                : t("02 · Khi tìm kiếm", "02 · At search time")}
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
        <span>
          {t("BƯỚC", "STEP")} {step + 1}
        </span>
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
        {step === data.steps.length - 1
          ? t("Xem lại", "Start over")
          : t("Chạy bước tiếp theo", "Run next step")}
      </button>
    </>
  );
}
function Training() {
  const [w, setW] = useState(1);
  const [n, setN] = useState(0);
  const loss = (8 - w) ** 2;
  const { t, num } = useT();
  return (
    <>
      <Top
        title={t("Model nhỏ xíu: y = w × x", "A tiny model: y = w × x")}
        tag={t("x = 1 · y MỤC TIÊU = 8", "x = 1 · TARGET y = 8")}
      />
      <div className="training-stats">
        <div>
          <small>{t("Trọng số w", "Weight w")}</small>
          <strong>{num(w, 2)}</strong>
        </div>
        <div>
          <small>{t("Dự đoán y", "Prediction y")}</small>
          <strong>{num(w, 2)}</strong>
        </div>
        <div>
          <small>Loss</small>
          <strong>{num(loss, 2)}</strong>
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
          {t("Học một bước", "Learn one step")}
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
      <Hint>
        {t(
          `${n} lần cập nhật · loss = (dự đoán − mục tiêu)²`,
          `${n} updates · loss = (prediction − target)²`,
        )}
      </Hint>
      <div className="comparison">
        <div>
          <strong>Training</strong>
          <span>{t("Thay đổi trọng số", "Changes the weights")}</span>
        </div>
        <div>
          <strong>Inference</strong>
          <span>{t("Dùng trọng số đã học", "Uses the learned weights")}</span>
        </div>
      </div>
    </>
  );
}
const attentionExamples: Record<Lang, string[][]> = {
  vi: [
    ["Mình", "thích", "lập", "trình"],
    ["Con", "chuột", "ăn", "phô mai"],
    ["Con", "chuột", "máy tính", "bị hỏng"],
  ],
  en: [
    ["I", "like", "to", "code"],
    ["The", "mouse", "ate", "cheese"],
    ["The", "mouse", "cable", "broke"],
  ],
};
// Hand-made relevance of an earlier token to the current one (illustrative,
// not real weights). Default is 1; the current token itself scores 2.
const attentionLinks: Record<string, Record<string, number>> = {
  thích: { Mình: 3 },
  lập: { thích: 2 },
  trình: { lập: 4, thích: 2 },
  chuột: { Con: 3 },
  ăn: { chuột: 4 },
  "phô mai": { ăn: 4, chuột: 3 },
  "máy tính": { chuột: 5 },
  "bị hỏng": { "máy tính": 4, chuột: 3 },
  like: { I: 3 },
  to: { like: 2 },
  code: { to: 2, like: 4 },
  mouse: { The: 3 },
  ate: { mouse: 4 },
  cheese: { ate: 4, mouse: 3 },
  cable: { mouse: 5 },
  broke: { cable: 4, mouse: 3 },
};
// Causal: a row only reads tokens[0..at], so equal prefixes give equal rows.
function attentionRow(tokens: string[], at: number) {
  const raw = tokens
    .slice(0, at + 1)
    .map((t, i) => (i === at ? 2 : (attentionLinks[tokens[at]]?.[t] ?? 1)));
  const sum = raw.reduce((a, b) => a + b, 0);
  return raw.map((r) => r / sum);
}
const attentionInsights: Record<Lang, Record<string, string>> = {
  vi: {
    "1-0": "“Con” chưa có token phía trước để nhìn.",
    "2-0": "“Con” chưa có token phía trước để nhìn.",
    "1-1":
      "Phần phía trước giống hệt Ví dụ 3 → trọng số giống hệt. Tại “chuột”, model chưa thể biết là con vật hay thiết bị.",
    "2-1":
      "Phần phía trước giống hệt Ví dụ 2 → trọng số giống hệt. Tại “chuột”, model chưa thể biết là con vật hay thiết bị.",
    "1-2": "“ăn” nhìn mạnh về “chuột” → ngữ cảnh nghiêng về con vật.",
    "1-3": "“phô mai” gom thông tin từ “ăn” và “chuột”: câu nói về con vật.",
    "2-2": "“máy tính” nhìn mạnh về “chuột” → ngữ cảnh nghiêng về thiết bị.",
    "2-3":
      "“bị hỏng” gom thông tin từ “máy tính” và “chuột”: câu nói về thiết bị.",
  },
  en: {
    "1-0": "“The” has no earlier token to look at.",
    "2-0": "“The” has no earlier token to look at.",
    "1-1":
      "Everything before is identical to Example 3 → identical weights. At “mouse”, the model cannot yet tell an animal from a device.",
    "2-1":
      "Everything before is identical to Example 2 → identical weights. At “mouse”, the model cannot yet tell an animal from a device.",
    "1-2": "“ate” looks strongly at “mouse” → the context leans toward an animal.",
    "1-3": "“cheese” gathers information from “ate” and “mouse”: the sentence is about an animal.",
    "2-2": "“cable” looks strongly at “mouse” → the context leans toward a device.",
    "2-3": "“broke” gathers information from “cable” and “mouse”: the sentence is about a device.",
  },
};
function Attention() {
  const [which, setWhich] = useState(1);
  const [token, setToken] = useState(1);
  const { t, lang } = useT();
  const examples = attentionExamples[lang];
  const tokens = examples[which];
  const row = attentionRow(tokens, token);
  return (
    <>
      <Top
        title={t("Token nhìn ngữ cảnh", "Tokens look at context")}
        tag={t("TRỌNG SỐ MINH HỌA", "ILLUSTRATIVE WEIGHTS")}
      />
      <div className="chips">
        {examples.map((_, i) => (
          <button
            key={i}
            className={which === i ? "selected" : ""}
            onClick={() => {
              setWhich(i);
              setToken(1);
            }}
          >
            {t("Ví dụ", "Example")} {i + 1}
          </button>
        ))}
      </div>
      <div className="attention-tokens">
        {tokens.map((x, i) => (
          <button
            key={i}
            style={{ opacity: i > token ? 0.3 : 1 }}
            className={token === i ? "selected" : ""}
            onClick={() => setToken(i)}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="attention-lines">
        {tokens.map((x, i) => (
          <div key={i} className={i > token ? "masked" : ""}>
            <span>{x}</span>
            <div style={{ width: `${i > token ? 0 : row[i] * 70}%` }} />
            <b>
              {i > token
                ? t("bị che", "masked")
                : `${Math.round(row[i] * 100)}%`}
            </b>
          </div>
        ))}
      </div>
      <Hint>
        {attentionInsights[lang][`${which}-${token}`] ??
          t(
            `Đang xét “${tokens[token]}”. Causal attention chỉ nhìn vị trí hiện tại và phía trước.`,
            `Looking at “${tokens[token]}”. Causal attention only sees the current and earlier positions.`,
          )}
      </Hint>
      <p className="fineprint">
        {t(
          "Chuyển qua lại Ví dụ 2 và 3 tại “chuột”: các thanh không đổi. Nghĩa được phân biệt ở những vị trí phía sau.",
          "Switch between Examples 2 and 3 at “mouse”: the bars don't change. The meaning is resolved at later positions.",
        )}
      </p>
    </>
  );
}
function Generation() {
  const [n, setN] = useState(0);
  const { t } = useT();
  const prompt = t("Mình thích lập trình", "I like to code");
  const tokens = t(
    [" vì", " mình", " có thể", " tạo", " ra", " những", " điều", " hữu ích", "."],
    [" because", " I", " can", " build", " useful", " things", "."],
  );
  return (
    <>
      <Top
        title={t("Vòng lặp sinh văn bản", "The text generation loop")}
        tag={t("ĐẦU RA THEO KỊCH BẢN", "SCRIPTED OUTPUT")}
      />
      <div className="chat-bubble">{prompt}</div>
      <div className="generated-text">
        {prompt}
        {tokens.slice(0, n).map((x, i) => (
          <span key={i} className="new-token">
            {x}
          </span>
        ))}
        <i />
      </div>
      <div className="mini-flow">
        <span>Context</span>
        <ArrowRight />
        <span>Model → logits</span>
        <ArrowRight />
        <span>{t("Chọn token", "Pick a token")}</span>
      </div>
      <div className="action-row">
        <button
          className="small-button"
          disabled={n === tokens.length}
          onClick={() => setN(n + 1)}
        >
          <Play size={16} />
          {t("Sinh token tiếp", "Generate next token")}
        </button>
        <button
          className="quiet"
          onClick={() => setN(0)}
          aria-label={t("Chạy lại generation", "Restart generation")}
        >
          <RotateCcw size={16} />
        </button>
      </div>
      <Hint>
        {n === tokens.length
          ? t(
              "Dừng theo kịch bản demo. Model thật có EOS/stop/giới hạn token.",
              "Stopped by the demo script. Real models stop at EOS, a stop sequence or a token limit.",
            )
          : t(
              `Đã nối ${n} mảnh token minh họa. Token mới trở thành một phần ngữ cảnh.`,
              `Appended ${n} illustrative tokens. Each new token becomes part of the context.`,
            )}
      </Hint>
    </>
  );
}
function Sampling() {
  const [temp, setTemp] = useState(0.7),
    [picked, setPicked] = useState("");
  const probs = [3, 2, 1].map((x) => Math.exp(x / temp));
  const sum = probs.reduce((a, b) => a + b, 0);
  const { t, num } = useT();
  const labels = t(["vì", "và", "nhưng"], ["because", "and", "but"]);
  return (
    <>
      <Top
        title={t("Token nào được viết tiếp?", "Which token comes next?")}
        tag={t("LOGITS GIẢ ĐỊNH", "ASSUMED LOGITS")}
      />
      <div className="chat-bubble">
        {t("“Mình thích lập trình …”", "“I like to code …”")}
      </div>
      {probs.map((p, i) => (
        <div className="prob-row" key={i}>
          <span>{labels[i]}</span>
          <div>
            <i style={{ width: `${(p / sum) * 100}%` }} />
          </div>
          <strong>{num((p / sum) * 100, 1)}%</strong>
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
          const r = Math.random();
          let s = 0;
          for (let i = 0; i < 3; i++) {
            s += probs[i] / sum;
            if (r < s) {
              setPicked(labels[i]);
              break;
            }
          }
        }}
      >
        {t("Lấy mẫu một lần", "Sample once")}
      </button>
      <Hint>
        {picked
          ? t(
              `Token lấy mẫu: “${picked}”. Bấm lại có thể ra lựa chọn khác.`,
              `Sampled token: “${picked}”. Click again and you may get another one.`,
            )
          : t(
              "Phân phối tính từ softmax(logits / temperature).",
              "The distribution is softmax(logits / temperature).",
            )}
      </Hint>
    </>
  );
}
const docSentences: Record<Lang, string[]> = {
  vi: [
    "Hoodie lavender làm từ nỉ, phù hợp trời lạnh.",
    "Sản phẩm có size S, M, L và giá 349.000đ.",
    "Shop nhận đổi size trong 7 ngày.",
    "Sản phẩm đổi phải còn tem và chưa qua sử dụng.",
  ],
  en: [
    "The lavender hoodie is made of fleece, good for cold weather.",
    "It comes in sizes S, M, L and costs 349,000 VND.",
    "The shop accepts size exchanges within 7 days.",
    "Exchanged items must keep their tags and be unused.",
  ],
};
function Chunking() {
  const [size, setSize] = useState(2);
  const { t, lang } = useT();
  const sentences = docSentences[lang];
  const chunks = Array.from(
    { length: Math.ceil(sentences.length / size) },
    (_, i) => sentences.slice(i * size, (i + 1) * size).join(" "),
  );
  return (
    <>
      <Top title={t("catalog.md → các chunk", "catalog.md → chunks")} />
      <Range
        label={t("Số câu trong mỗi chunk", "Sentences per chunk")}
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
        {t(
          `${chunks.length} chunk → ${chunks.length} embedding → lưu kèm nguồn`,
          `${chunks.length} chunks → ${chunks.length} embeddings → stored with their source`,
        )}
      </Hint>
    </>
  );
}
// English data is chosen so word overlap gives the same keyword ranking.
const retrievalDocs: Record<Lang, Record<string, string>> = {
  vi: {
    C1: "Hoodie lavender P02: nỉ dày, mặc ấm, giá 349k",
    C2: "Áo len tím P05: giữ ấm, giá 379k, còn size S và M",
    C3: "Mẹo giặt áo khi trời lạnh và độ ẩm cao",
    C4: "Bảng quy đổi size S, M, L theo chiều cao",
  },
  en: {
    C1: "Lavender hoodie P02: thick fleece, warm to wear, 349k",
    C2: "Purple wool shirt P05: keeps you warm, 379k, size S and M available",
    C3: "Tips for washing clothes during cold, humid weather",
    C4: "Size chart for S, M, L by height",
  },
};
// Vector and rerank orders are illustrative; keyword and RRF are computed.
const retrievalQueries = [
  {
    q: { vi: "Mua gì mặc khi trời lạnh?", en: "What should I wear in cold weather?" },
    vector: ["C1", "C2", "C3", "C4"],
    rerank: ["C1", "C2", "C3", "C4"],
    hints: {
      vi: [
        "C3 khớp nhiều từ nhất nhưng nói về giặt áo. Khớp chữ ≠ đúng nhu cầu.",
        "Vector đưa đồ giữ ấm lên đầu, kể cả C2 không trùng từ nào với câu hỏi.",
        "RRF cộng 1/(60 + hạng) từ hai danh sách: C1 lên đầu, nhưng C3 vẫn đứng thứ 2.",
        "Reranker chấm lại từng cặp câu hỏi–đoạn văn: C2 vượt lên trên C3.",
      ],
      en: [
        "C3 matches the most words but is about washing clothes. Matching words ≠ meeting the need.",
        "Vectors put warm clothing first, even C2, which shares no word with the question.",
        "RRF adds 1/(60 + rank) from both lists: C1 comes first, but C3 is still 2nd.",
        "The reranker re-scores each question–passage pair: C2 moves above C3.",
      ],
    },
  },
  {
    q: { vi: "P05 còn size M không?", en: "Is P05 available in size M?" },
    vector: ["C4", "C2", "C1", "C3"],
    rerank: ["C2", "C4", "C1", "C3"],
    hints: {
      vi: [
        "Keyword bắt đúng mã P05 → C2 đứng đầu.",
        "Embedding thường yếu với mã SKU: vector ưu tiên bảng size C4 vì cùng chủ đề “size”.",
        "C2 và C4 hòa điểm RRF: mỗi đoạn đứng đầu một danh sách. Cả hai vẫn vào top-2.",
        "Reranker thấy C2 trả lời trực tiếp câu hỏi về P05.",
      ],
      en: [
        "Keywords catch the exact code P05 → C2 comes first.",
        "Embeddings are often weak on SKU codes: vectors favor the size chart C4 because it's about “size”.",
        "C2 and C4 tie on RRF: each tops one list. Both still make the top 2.",
        "The reranker sees that C2 directly answers the question about P05.",
      ],
    },
  },
];
const words = (text: string) =>
  text.toLocaleLowerCase("vi").split(/[^\p{L}\p{N}]+/u).filter(Boolean);
function Retrieval() {
  const [qi, setQi] = useState(0),
    [mode, setMode] = useState(0);
  const { t, lang, num } = useT();
  const docs = retrievalDocs[lang];
  const query = retrievalQueries[qi];
  const qWords = new Set(words(query.q[lang]));
  const ids = Object.keys(docs);
  const hits = Object.fromEntries(
    ids.map((id) => [
      id,
      [...new Set(words(docs[id]))].filter((w) => qWords.has(w)),
    ]),
  );
  // A keyword engine only returns documents that share at least one term.
  const keyword = ids
    .filter((id) => hits[id].length)
    .sort((a, b) => hits[b].length - hits[a].length);
  const rrf = Object.fromEntries(
    ids.map((id) => [
      id,
      [keyword, query.vector].reduce((sum, list) => {
        const r = list.indexOf(id);
        return r < 0 ? sum : sum + 1 / (60 + r + 1);
      }, 0),
    ]),
  );
  const order = [
    [...keyword, ...ids.filter((id) => !keyword.includes(id))],
    query.vector,
    [...ids].sort((a, b) => rrf[b] - rrf[a]),
    query.rerank,
  ][mode];
  return (
    <>
      <Top
        title={`“${query.q[lang]}”`}
        tag={t("RRF TÍNH THẬT", "RRF COMPUTED LIVE")}
      />
      <div className="chips">
        {retrievalQueries.map((x, i) => (
          <button
            key={x.q.vi}
            className={qi === i ? "selected" : ""}
            onClick={() => setQi(i)}
          >
            {x.q[lang]}
          </button>
        ))}
      </div>
      <div className="chips">
        {[t("Từ khóa", "Keyword"), "Vector", "Hybrid (RRF)", "+ Rerank"].map((m, i) => (
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
        {order.map((id, j) => {
          const missing = mode === 0 && !keyword.includes(id);
          return (
            <div key={id} className={missing ? "missing" : ""}>
              <span>{missing ? "–" : j + 1}</span>
              <p>
                <b>{id}</b> ·{" "}
                {mode === 0
                  ? docs[id]
                      .split(/([\p{L}\p{N}]+)/u)
                      .map((part, k) =>
                        hits[id].includes(part.toLocaleLowerCase("vi")) ? (
                          <mark key={k}>{part}</mark>
                        ) : (
                          part
                        ),
                      )
                  : docs[id]}
              </p>
              <small>
                {mode === 0
                  ? t(
                      `${hits[id].length} từ khớp`,
                      `${hits[id].length} word${hits[id].length === 1 ? "" : "s"} matched`,
                    )
                  : mode === 2
                    ? `RRF ${num(rrf[id], 4)}`
                    : ""}
              </small>
            </div>
          );
        })}
      </div>
      <Hint>{query.hints[lang][mode]}</Hint>
      <p className="fineprint">
        {t(
          "Từ khóa = đếm từ trùng (đơn giản hóa BM25). RRF tính thật với k = 60. Thứ hạng vector và rerank được dựng để minh họa.",
          "Keyword = counting shared words (a simplified BM25). RRF is computed live with k = 60. Vector and rerank orders are illustrative.",
        )}
      </p>
    </>
  );
}
const ragScenarios: Record<
  Lang,
  { label: string; retrieved: string[]; context: string; answer: string; warning: string }[]
> = {
  vi: [
    {
      label: "Đủ bằng chứng",
      retrieved: [
        "[C1] Hoodie lavender · nỉ giữ ấm · 349.000đ",
        "[C2] Áo len tím · giữ ấm · 379.000đ",
      ],
      context: "Context = hướng dẫn bám nguồn + câu hỏi + đoạn C1, C2.",
      answer:
        "Có 2 lựa chọn dưới 400k: Hoodie lavender bằng nỉ, 349.000đ [C1] và Áo len tím, 379.000đ [C2].",
      warning: "",
    },
    {
      label: "Chỉ lấy top-1",
      retrieved: ["[C1] Hoodie lavender · nỉ giữ ấm · 349.000đ"],
      context: "Context = hướng dẫn bám nguồn + câu hỏi + đoạn C1.",
      answer: "Bạn có thể chọn Hoodie lavender bằng nỉ, giá 349.000đ [C1].",
      warning:
        "Thiếu Áo len tím 379k: đoạn C2 không được đưa vào context, nên model không thể nhắc tới.",
    },
    {
      label: "Không có bằng chứng",
      retrieved: ["Không tìm thấy bằng chứng phù hợp."],
      context: "Context ghi nhận không có tài liệu hỗ trợ.",
      answer:
        "Mình chưa có đủ dữ liệu để xác nhận. Bạn có thể kiểm tra catalog mới nhất của shop.",
      warning: "",
    },
  ],
  en: [
    {
      label: "Enough evidence",
      retrieved: [
        "[C1] Lavender hoodie · warm fleece · 349,000 VND",
        "[C2] Purple wool shirt · keeps you warm · 379,000 VND",
      ],
      context: "Context = grounding instructions + question + passages C1, C2.",
      answer:
        "There are 2 options under 400k: the fleece Lavender hoodie, 349,000 VND [C1], and the Purple wool shirt, 379,000 VND [C2].",
      warning: "",
    },
    {
      label: "Top-1 only",
      retrieved: ["[C1] Lavender hoodie · warm fleece · 349,000 VND"],
      context: "Context = grounding instructions + question + passage C1.",
      answer: "You could pick the fleece Lavender hoodie, 349,000 VND [C1].",
      warning:
        "Missing the Purple wool shirt (379k): passage C2 never reached the context, so the model cannot mention it.",
    },
    {
      label: "No evidence",
      retrieved: ["No matching evidence found."],
      context: "The context records that no supporting document was found.",
      answer:
        "I don't have enough data to confirm. You can check the shop's latest catalog.",
      warning: "",
    },
  ],
};
function Rag() {
  const [n, setN] = useState(0);
  const [scenario, setScenario] = useState(0);
  const { t, lang } = useT();
  const stages = t(
    ["Câu hỏi", "Retrieve", "Ghép context", "Generate"],
    ["Question", "Retrieve", "Build context", "Generate"],
  );
  const scenarios = ragScenarios[lang];
  const sc = scenarios[scenario];
  return (
    <>
      <Top title={t("Bên trong một lượt hỏi đáp", "Inside one Q&A turn")} />
      <div className="chips">
        {scenarios.map((x, i) => (
          <button
            key={x.label}
            className={scenario === i ? "selected" : ""}
            onClick={() => {
              setScenario(i);
              setN(0);
            }}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div className="chat-bubble">
        {t(
          "Shop có áo ấm dưới 400k không?",
          "Do you have warm clothes under 400k?",
        )}
      </div>
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
            {t(
              "Nhận câu hỏi và điều kiện giá.",
              "Receive the question and the price condition.",
            )}
          </>
        ) : n === 1 ? (
          <>
            <Database />
            <div>
              {sc.retrieved.map((r) => (
                <div key={r}>{r}</div>
              ))}
            </div>
          </>
        ) : n === 2 ? (
          <>
            <FileText />
            {sc.context}
          </>
        ) : (
          <>
            <Sparkles />
            <div>
              {sc.answer}
              {sc.warning && <p className="rag-warning">{sc.warning}</p>}
            </div>
          </>
        )}
      </div>
      <button className="small-button wide" onClick={() => setN((n + 1) % 4)}>
        <Play size={16} />
        {n === 3
          ? t("Chạy lại", "Run again")
          : t("Chạy bước tiếp theo", "Run next step")}
      </button>
      <p className="fineprint">
        {t(
          "Demo theo kịch bản · không gọi LLM. [C1], [C2] là bản ghi catalog giả lập (P02, P05).",
          "Scripted demo · no LLM call. [C1], [C2] are simulated catalog records (P02, P05).",
        )}
      </p>
    </>
  );
}
function Diffusion() {
  const [step, setStep] = useState(0);
  const { t } = useT();
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
      <Top
        title={t("Hoodie tím, một ngôi sao nhỏ", "Purple hoodie, a small star")}
        tag={t("MÔ PHỎNG DIFFUSION", "DIFFUSION SIMULATION")}
      />
      <div className="diffusion-image">
        <img
          src="/hoodie.png"
          alt={t(
            "Ảnh hoodie tím với ngôi sao vàng được tạo sẵn để minh họa diffusion",
            "Pre-made image of a purple hoodie with a yellow star, used to illustrate diffusion",
          )}
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
            ? t("Nhiễu ban đầu", "Initial noise")
            : step === 100
              ? t("Ảnh minh họa hoàn chỉnh", "Finished illustration")
              : t(`Tiến trình minh họa ${step}%`, `Illustrative progress ${step}%`)}
        </span>
      </div>
      <Range
        label={t("Tiến trình khử nhiễu (%)", "Denoising progress (%)")}
        value={step}
        max={100}
        step={5}
        onChange={setStep}
      />
      <div className="mini-flow">
        <span>Prompt</span>
        <ArrowRight />
        <span>{t("Nhiễu + model", "Noise + model")}</span>
        <ArrowRight />
        <span>{t("Decoder → ảnh", "Decoder → image")}</span>
      </div>
      <Hint>
        {t(
          "Đây là chuyển cảnh từ nhiễu sang ảnh có sẵn, không phải chạy model thật.",
          "This fades from noise to a pre-made image; it is not a real model run.",
        )}
      </Hint>
    </>
  );
}
const journeyZones: Record<Lang, string[]> = {
  vi: ["Giao diện", "Retrieval", "Augment", "Generation"],
  en: ["Interface", "Retrieval", "Augment", "Generation"],
};
type JourneyText = {
  actor: string;
  name: string;
  does: string;
  shape: string;
  data: string;
};
// `demos` point to the lessons that explain each step in depth.
const journeySteps: {
  zone: number;
  kind: string;
  demos: number[];
  vi: JourneyText;
  en: JourneyText;
}[] = [
  {
    zone: 0,
    kind: "plain",
    demos: [20],
    vi: {
      actor: "Không phải model",
      name: "Khách gửi câu hỏi",
      does: "Ô chat nhận văn bản, gồm cả điều kiện giá.",
      shape: "Văn bản",
      data: "“Shop có áo ấm dưới 400k không?”",
    },
    en: {
      actor: "Not a model",
      name: "The shopper asks",
      does: "The chat box receives text, including the price condition.",
      shape: "Text",
      data: "“Do you have warm clothes under 400k?”",
    },
  },
  {
    zone: 1,
    kind: "embed",
    demos: [6, 8],
    vi: {
      actor: "Embedding model",
      name: "Encode câu hỏi",
      does: "Biến câu hỏi thành vector trong cùng không gian với các chunk đã index.",
      shape: "Vector",
      data: "[0.12, −0.48, 0.31, 0.05, …] · 768 số",
    },
    en: {
      actor: "Embedding model",
      name: "Encode the question",
      does: "Turns the question into a vector in the same space as the indexed chunks.",
      shape: "Vector",
      data: "[0.12, −0.48, 0.31, 0.05, …] · 768 numbers",
    },
  },
  {
    zone: 1,
    kind: "plain",
    demos: [9, 10],
    vi: {
      actor: "Không phải model",
      name: "Vector DB + filter",
      does: "Lọc price ≤ 400000, tìm các vector gần nhất, trả về ID kèm score và payload.",
      shape: "ID + score",
      data: "C1 · 0,83   C2 · 0,79\n(P03 Áo khoác ấm 599k bị filter loại)",
    },
    en: {
      actor: "Not a model",
      name: "Vector DB + filter",
      does: "Filters price ≤ 400000, finds the nearest vectors, returns IDs with scores and payloads.",
      shape: "IDs + scores",
      data: "C1 · 0.83   C2 · 0.79\n(P03 Warm shirt jacket 599k removed by the filter)",
    },
  },
  {
    zone: 1,
    kind: "embed",
    demos: [19],
    vi: {
      actor: "Reranker (tùy chọn)",
      name: "Hybrid + rerank",
      does: "Gộp thứ hạng từ khóa và vector, chấm lại để giữ đoạn thực sự liên quan.",
      shape: "Danh sách ID",
      data: "context = [C1, C2]",
    },
    en: {
      actor: "Reranker (optional)",
      name: "Hybrid + rerank",
      does: "Fuses keyword and vector ranks, re-scores to keep what's truly relevant.",
      shape: "List of IDs",
      data: "context = [C1, C2]",
    },
  },
  {
    zone: 2,
    kind: "plain",
    demos: [17],
    vi: {
      actor: "Không phải model",
      name: "Ghép prompt",
      does: "Ghép hướng dẫn, bằng chứng và câu hỏi thành một đoạn văn bản.",
      shape: "Văn bản",
      data: "Chỉ trả lời dựa trên nguồn.\n[C1] Hoodie lavender · nỉ · 349.000đ\n[C2] Áo len tím · giữ ấm · 379.000đ\nCâu hỏi: Shop có áo ấm dưới 400k không?",
    },
    en: {
      actor: "Not a model",
      name: "Build the prompt",
      does: "Joins instructions, evidence and the question into one piece of text.",
      shape: "Text",
      data: "Answer only from the sources.\n[C1] Lavender hoodie · fleece · 349,000 VND\n[C2] Purple wool shirt · keeps you warm · 379,000 VND\nQuestion: Do you have warm clothes under 400k?",
    },
  },
  {
    zone: 3,
    kind: "llm",
    demos: [13],
    vi: {
      actor: "Tokenizer của LLM",
      name: "Văn bản → token ID",
      does: "Tách prompt thành token và ánh xạ mỗi token sang một ID.",
      shape: "Token ID",
      data: "[1204, 88, 5310, 72, 931, …] · ~90 token",
    },
    en: {
      actor: "The LLM's tokenizer",
      name: "Text → token IDs",
      does: "Splits the prompt into tokens and maps each to an ID.",
      shape: "Token IDs",
      data: "[1204, 88, 5310, 72, 931, …] · ~70 tokens",
    },
  },
  {
    zone: 3,
    kind: "llm",
    demos: [14, 15],
    vi: {
      actor: "LLM",
      name: "Transformer → logits",
      does: "Tra embedding cho từng ID, cho qua nhiều lớp attention, ra điểm cho mọi token có thể viết tiếp.",
      shape: "Logits",
      data: "“Có” 6,1 · “Shop” 4,3 · “Hiện” 3,8 · …",
    },
    en: {
      actor: "LLM",
      name: "Transformer → logits",
      does: "Looks up an embedding per ID, runs many attention layers, scores every possible next token.",
      shape: "Logits",
      data: "“There” 6.1 · “Yes” 4.3 · “We” 3.8 · …",
    },
  },
  {
    zone: 3,
    kind: "llm",
    demos: [16, 15],
    vi: {
      actor: "LLM",
      name: "Chọn token, lặp lại",
      does: "Softmax + sampling chọn một token, nối vào context rồi chạy lại cho tới khi gặp điều kiện dừng.",
      shape: "Token ID nối tiếp",
      data: "Có → 2 → lựa → chọn → … → [EOS]",
    },
    en: {
      actor: "LLM",
      name: "Pick a token, repeat",
      does: "Softmax + sampling picks a token, appends it to the context and runs again until a stop condition.",
      shape: "Growing token IDs",
      data: "There → are → 2 → options → … → [EOS]",
    },
  },
  {
    zone: 0,
    kind: "llm",
    demos: [20],
    vi: {
      actor: "Tokenizer của LLM",
      name: "Decode → hiển thị",
      does: "Đổi token ID về văn bản và hiển thị kèm trích dẫn nguồn.",
      shape: "Văn bản",
      data: "Có 2 lựa chọn dưới 400k: Hoodie lavender, 349.000đ [C1] và Áo len tím, 379.000đ [C2].",
    },
    en: {
      actor: "The LLM's tokenizer",
      name: "Decode → display",
      does: "Turns token IDs back into text and shows it with citations.",
      shape: "Text",
      data: "There are 2 options under 400k: the Lavender hoodie, 349,000 VND [C1], and the Purple wool shirt, 379,000 VND [C2].",
    },
  },
];
function Journey() {
  const [step, setStep] = useState(0);
  const { t, lang } = useT();
  const slides = getSlides(lang);
  const cur = journeySteps[step][lang];
  const zone = journeySteps[step].zone,
    kind = journeySteps[step].kind;
  const last = step === journeySteps.length - 1;
  return (
    <>
      <Top
        title={t("Một lượt hỏi đáp, từng bước", "One Q&A turn, step by step")}
        tag={t("LUỒNG MINH HỌA", "ILLUSTRATIVE FLOW")}
      />
      <div className="journey-track">
        {journeySteps.map((x, i) => (
          <button
            key={x.vi.name}
            className={
              `journey-dot kind-${x.kind} ` +
              (i === step ? "chosen" : i < step ? "done" : "")
            }
            aria-label={`${t("Bước", "Step")} ${i + 1}: ${x[lang].name}`}
            aria-current={i === step ? "step" : undefined}
            onClick={() => setStep(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className="journey-card" aria-live="polite">
        <div className="journey-meta">
          <span>{journeyZones[lang][zone]}</span>
          <span className={`journey-actor kind-${kind}`}>{cur.actor}</span>
        </div>
        <strong>{cur.name}</strong>
        <p>{cur.does}</p>
        <div className="journey-data">
          <small>
            {t("Dữ liệu lúc này", "Data at this point")} · {cur.shape}
          </small>
          <pre>{cur.data}</pre>
        </div>
        <p className="journey-ref">
          {t("Xem lại:", "Revisit:")}{" "}
          {journeySteps[step].demos
            .map((d) => {
              const n = slides.findIndex((x) => x.demo === d);
              return `slide ${n + 1} (${slides[n].t.replace("\n", " ")} ${slides[n].accent})`;
            })
            .join(" · ")}
        </p>
      </div>
      <div className="action-row">
        <button
          className="small-button"
          onClick={() => setStep(last ? 0 : step + 1)}
        >
          {last ? <RotateCcw size={16} /> : <Play size={16} />}
          {last
            ? t("Xem lại từ đầu", "Start over")
            : t("Bước tiếp theo", "Next step")}
        </button>
        <span>
          {step + 1}/{journeySteps.length}
        </span>
      </div>
      <div className="journey-legend">
        <span className="kind-embed">Embedding model / reranker</span>
        <span className="kind-llm">LLM</span>
        <span className="kind-plain">{t("Không phải model", "Not a model")}</span>
      </div>
    </>
  );
}
function Summary() {
  const [pick, setPick] = useState(-1);
  const { t } = useT();
  return (
    <>
      <Top title={t("Một câu hỏi trước khi kết thúc", "One last question")} />
      <p className="quiz-question">
        {t(
          "Giá hoodie vừa đổi. Để chatbot trả lời đúng giá mới, nên làm gì?",
          "The hoodie price just changed. What should you do so the chatbot quotes the new price?",
        )}
      </p>
      <div className="quiz">
        {t(
          [
            "Tăng temperature của LLM",
            "Cập nhật dữ liệu catalog và nguồn retrieval",
            "Chỉ tăng số chiều vector",
          ],
          [
            "Raise the LLM's temperature",
            "Update the catalog data and the retrieval source",
            "Just add more vector dimensions",
          ],
        ).map((x, i) => (
          <button
            key={x}
            className={pick === i ? (i === 1 ? "correct" : "incorrect") : ""}
            onClick={() => setPick(i)}
          >
            {String.fromCharCode(65 + i)}
            <span>{x}</span>
            {pick === i && i === 1 && <Check size={18} />}
          </button>
        ))}
      </div>
      {pick >= 0 && (
        <Hint>
          {pick === 1
            ? t(
                "Đúng! Cập nhật nguồn; thay đổi nội dung thì cập nhật embedding tương ứng. RAG lấy dữ liệu mới vào context.",
                "Correct! Update the source; if content changes, update its embedding too. RAG brings the new data into the context.",
              )
            : t(
                "Chưa đúng. Vấn đề ở dữ liệu nguồn, không phải cách lấy mẫu hay số chiều.",
                "Not quite. The problem is the source data, not sampling or dimensions.",
              )}
        </Hint>
      )}
      <div className="recap-tags">
        {t(
          [
            "Search: tìm",
            "Embedding: biểu diễn",
            "DB: lưu & truy hồi",
            "Model: tính toán",
            "RAG: nối nguồn",
            "GenAI: tạo",
          ],
          [
            "Search: find",
            "Embedding: represent",
            "DB: store & retrieve",
            "Model: compute",
            "RAG: connect sources",
            "GenAI: create",
          ],
        ).map((x) => (
          <span key={x}>{x}</span>
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
      return <Indexing />;
    case 7:
      return <Space />;
    case 8:
      return <Score />;
    case 9:
      return <VectorStore />;
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
      return <Journey />;
    case 24:
      return <Summary />;
    case 25:
      return <SemanticOverview />;
    case 26:
      return <Learning />;
    case 27:
      return <DataTimeline />;
    case 28:
      return <PromptToCode />;
    default:
      return null;
  }
}
