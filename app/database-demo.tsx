"use client";
import { useEffect, useState } from "react";
import {
  Database,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Check,
  Minus,
  Search,
  StepForward,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { products } from "./content";
function MatchText({ text, query }: { text: string; query: string }) {
  const at = text
    .toLocaleLowerCase("vi")
    .indexOf(query.toLocaleLowerCase("vi"));
  return at < 0 || !query ? (
    <>{text}</>
  ) : (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + query.length)}</mark>
      {text.slice(at + query.length)}
    </>
  );
}
const indexTerms = ["áo", "hoodie", "quần"];
const invertedIndex = Object.fromEntries(
  indexTerms.map((term) => [
    term,
    products
      .filter((p) => p.name.toLocaleLowerCase("vi").split(/\s+/).includes(term))
      .map((p) => p.id),
  ]),
);
export default function DatabaseDemo({ mode }: { mode: number }) {
  const [query, setQuery] = useState("áo"),
    [count, setCount] = useState(0),
    [running, setRunning] = useState(false),
    [purple, setPurple] = useState(true),
    [budget, setBudget] = useState(400),
    [term, setTerm] = useState("áo");
  useEffect(() => {
    if (!running) return;
    if (count >= products.length) {
      setRunning(false);
      return;
    }
    const timer = setTimeout(() => setCount((c) => c + 1), 850);
    return () => clearTimeout(timer);
  }, [running, count]);
  const q = query.trim();
  const matches = (p: (typeof products)[number]) =>
    mode === 1
      ? p.name.toLocaleLowerCase("vi").includes(q.toLocaleLowerCase("vi"))
      : mode === 2
        ? (!purple || p.color === "Tím") && p.price <= budget
        : invertedIndex[term].includes(p.id);
  const result = products.filter(
    (p, i) => (mode !== 1 || i < count) && matches(p),
  );
  const current = mode === 1 && count > 0 ? products[count - 1] : null;
  const run = () => {
    if (count === products.length) setCount(0);
    setRunning(!running);
  };
  return (
    <div className="db-demo">
      <div className="db-heading">
        <span>
          <Database size={21} />
          <strong>products</strong>
        </span>
        <span className="db-label">
          6 bản ghi · {mode === 3 ? "có index" : "chưa có index"}
        </span>
      </div>
      {mode === 1 ? (
        <div className="db-query">
          <label htmlFor="search-rows">
            <Search size={17} />
            Từ cần tìm
          </label>
          <input
            id="search-rows"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCount(0);
              setRunning(false);
            }}
            placeholder="Ví dụ: áo, hoodie…"
          />
          <code>
            name.includes(<b>"{q || "…"}"</b>)
          </code>
        </div>
      ) : mode === 2 ? (
        <div className="db-filter">
          <label>
            <Switch
              aria-label="Chỉ màu tím"
              checked={purple}
              onCheckedChange={setPurple}
            />
            color = <b>"Tím"</b>
          </label>
          <div>
            <label>
              price ≤ <b>{budget}.000đ</b>
            </label>
            <Slider
              aria-label="Giá tối đa (nghìn đồng)"
              min={150}
              max={600}
              step={10}
              value={[budget]}
              onValueChange={(v) => setBudget(v[0])}
            />
          </div>
        </div>
      ) : (
        <div className="posting-lists">
          {indexTerms.map((t) => (
            <button
              className={term === t ? "selected" : ""}
              key={t}
              onClick={() => setTerm(t)}
            >
              <code>{t}</code>
              <ArrowRight size={15} />
              <span>{invertedIndex[t].join(" · ")}</span>
            </button>
          ))}
        </div>
      )}
      <div className="db-table-wrap">
        <Table className="db-table">
          <TableHeader>
            <TableRow>
              {mode === 1 && (
                <TableHead className="cursor-column">
                  <span className="sr-only">Con trỏ</span>
                </TableHead>
              )}
              <TableHead>id</TableHead>
              <TableHead>name</TableHead>
              {mode === 2 && (
                <>
                  <TableHead>color</TableHead>
                  <TableHead>price</TableHead>
                </>
              )}
              <TableHead className="status-column">
                {mode === 1 ? "So khớp" : "Kết quả"}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p, i) => {
              const visited = mode !== 1 || i < count,
                good = visited && matches(p),
                active = mode === 1 && i === count - 1;
              return (
                <TableRow
                  key={p.id}
                  className={`${active ? "reading-row" : ""} ${good ? "matched-row" : ""} ${visited && !good ? "skipped-row" : ""}`}
                  aria-current={active ? "step" : undefined}
                >
                  {mode === 1 && (
                    <TableCell className="cursor-column">
                      {active ? (
                        <ArrowRight size={18} />
                      ) : (
                        <span className="row-position">{i + 1}</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <code>{p.id}</code>
                  </TableCell>
                  <TableCell className="name-cell">
                    {mode === 1 && visited ? (
                      <MatchText text={p.name} query={q} />
                    ) : (
                      p.name
                    )}
                  </TableCell>
                  {mode === 2 && (
                    <>
                      <TableCell>
                        <span
                          className={p.color === "Tím" ? "purple-value" : ""}
                        >
                          {p.color}
                        </span>
                      </TableCell>
                      <TableCell>{p.price}k</TableCell>
                    </>
                  )}
                  <TableCell className="status-column">
                    <span
                      className={
                        "row-status " +
                        (visited ? (good ? "is-match" : "no-match") : "waiting")
                      }
                    >
                      {visited ? (
                        good ? (
                          <>
                            <Check size={14} />
                            Giữ lại
                          </>
                        ) : (
                          <>
                            <Minus size={14} />
                            {mode === 3 ? "Không đọc" : "Bỏ qua"}
                          </>
                        )
                      ) : (
                        "Chưa đọc"
                      )}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {mode === 1 && (
        <>
          <div className="db-inspector" aria-live="polite">
            {current ? (
              <>
                <span>
                  Đang kiểm tra <b>{current.id}</b>
                </span>
                <code>
                  "{current.name}" <span>chứa</span> "{q}"{" "}
                  <b
                    className={matches(current) ? "true-value" : "false-value"}
                  >
                    → {matches(current) ? "true" : "false"}
                  </b>
                </code>
              </>
            ) : (
              <>
                <span>Con trỏ ở đầu bảng</span>
                <p>Đọc một dòng → kiểm tra tên → chuyển sang dòng kế.</p>
              </>
            )}
          </div>
          <div className="db-controls">
            <button className="small-button" disabled={!q} onClick={run}>
              {running ? <Pause size={16} /> : <Play size={16} />}{" "}
              {running
                ? "Tạm dừng"
                : count === products.length
                  ? "Chạy lại"
                  : "Chạy tự động"}
            </button>
            <button
              className="small-button"
              disabled={!q || running || count === products.length}
              onClick={() => setCount((c) => c + 1)}
            >
              <StepForward size={16} />
              Từng dòng
            </button>
            <button
              className="quiet"
              aria-label="Đặt lại phép quét"
              onClick={() => {
                setCount(0);
                setRunning(false);
              }}
            >
              <RotateCcw size={16} />
            </button>
            <span>
              {count}/{products.length} lần kiểm tra
            </span>
          </div>
        </>
      )}
      <div className="db-results" aria-live="polite">
        <span>
          <b>RESULT</b>
          <span>{result.length} bản ghi</span>
        </span>
        <div>
          {result.length ? (
            result.map((p) => <code key={p.id}>{p.id}</code>)
          ) : (
            <span>
              {mode === 1 && count === 0
                ? "Chưa có kết quả"
                : "Không có bản ghi phù hợp"}
            </span>
          )}
        </div>
      </div>
      <p className="db-caption">
        {mode === 1 ? (
          <>
            <b>Linear Search · O(n)</b> — muốn lấy tất cả kết quả, đọc hết n
            dòng.
          </>
        ) : mode === 2 ? (
          <>
            Điều kiện <b>AND</b>: giữ lại bản ghi thỏa cả màu lẫn giá. Chưa có
            index, vẫn phải xét từng dòng.
          </>
        ) : (
          <>
            Tra từ trong <b>inverted index</b> → lấy posting list → đọc đúng các
            ID liên quan.
          </>
        )}
      </p>
    </div>
  );
}
