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
import { useT, type Lang } from "./i18n";
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
type Product = (typeof products)[number];
const nameIn = (p: Product, lang: Lang) => (lang === "en" ? p.nameEn : p.name);
// Terms chosen so both languages give the same posting lists.
const indexTerms: Record<Lang, string[]> = {
  vi: ["áo", "hoodie", "quần"],
  en: ["shirt", "hoodie", "shorts"],
};
const invertedIndex = (lang: Lang): Record<string, string[]> =>
  Object.fromEntries(
    indexTerms[lang].map((term) => [
      term,
      products
        .filter((p) =>
          nameIn(p, lang).toLocaleLowerCase("vi").split(/\s+/).includes(term),
        )
        .map((p) => p.id),
    ]),
  );
export default function DatabaseDemo({ mode }: { mode: number }) {
  const { t, lang } = useT();
  const index = invertedIndex(lang);
  const [query, setQuery] = useState(t("áo", "shirt")),
    [count, setCount] = useState(0),
    [running, setRunning] = useState(false),
    [purple, setPurple] = useState(true),
    [budget, setBudget] = useState(400),
    [term, setTerm] = useState(indexTerms[lang][0]);
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
      ? nameIn(p, lang)
          .toLocaleLowerCase("vi")
          .includes(q.toLocaleLowerCase("vi"))
      : mode === 2
        ? (!purple || p.color === "Tím") && p.price <= budget
        : index[term].includes(p.id);
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
          {t("6 bản ghi", "6 records")} ·{" "}
          {mode === 3 ? t("có index", "indexed") : t("chưa có index", "no index")}
        </span>
      </div>
      {mode === 1 ? (
        <div className="db-query">
          <label htmlFor="search-rows">
            <Search size={17} />
            {t("Từ cần tìm", "Search term")}
          </label>
          <input
            id="search-rows"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCount(0);
              setRunning(false);
            }}
            placeholder={t("Ví dụ: áo, hoodie…", "e.g. shirt, hoodie…")}
          />
          <code>
            name.includes(<b>"{q || "…"}"</b>)
          </code>
        </div>
      ) : mode === 2 ? (
        <div className="db-filter">
          <label>
            <Switch
              aria-label={t("Chỉ màu tím", "Purple only")}
              checked={purple}
              onCheckedChange={setPurple}
            />
            color = <b>&quot;{t("Tím", "Purple")}&quot;</b>
          </label>
          <div>
            <label>
              price ≤ <b>{t(`${budget}.000đ`, `${budget}k VND`)}</b>
            </label>
            <Slider
              aria-label={t("Giá tối đa (nghìn đồng)", "Max price (thousand VND)")}
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
          {indexTerms[lang].map((x) => (
            <button
              className={term === x ? "selected" : ""}
              key={x}
              onClick={() => setTerm(x)}
            >
              <code>{x}</code>
              <ArrowRight size={15} />
              <span>{index[x].join(" · ")}</span>
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
                  <span className="sr-only">{t("Con trỏ", "Cursor")}</span>
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
                {mode === 1 ? t("So khớp", "Match") : t("Kết quả", "Result")}
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
                      <MatchText text={nameIn(p, lang)} query={q} />
                    ) : (
                      nameIn(p, lang)
                    )}
                  </TableCell>
                  {mode === 2 && (
                    <>
                      <TableCell>
                        <span
                          className={p.color === "Tím" ? "purple-value" : ""}
                        >
                          {t(p.color, p.colorEn)}
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
                            {t("Giữ lại", "Keep")}
                          </>
                        ) : (
                          <>
                            <Minus size={14} />
                            {mode === 3
                              ? t("Không đọc", "Not read")
                              : t("Bỏ qua", "Skip")}
                          </>
                        )
                      ) : (
                        t("Chưa đọc", "Not read yet")
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
                  {t("Đang kiểm tra", "Checking")} <b>{current.id}</b>
                </span>
                <code>
                  &quot;{nameIn(current, lang)}&quot;{" "}
                  <span>{t("chứa", "contains")}</span> &quot;{q}&quot;{" "}
                  <b
                    className={matches(current) ? "true-value" : "false-value"}
                  >
                    → {matches(current) ? "true" : "false"}
                  </b>
                </code>
              </>
            ) : (
              <>
                <span>{t("Con trỏ ở đầu bảng", "Cursor at the top")}</span>
                <p>
                  {t(
                    "Đọc một dòng → kiểm tra tên → chuyển sang dòng kế.",
                    "Read a row → check the name → move to the next row.",
                  )}
                </p>
              </>
            )}
          </div>
          <div className="db-controls">
            <button className="small-button" disabled={!q} onClick={run}>
              {running ? <Pause size={16} /> : <Play size={16} />}{" "}
              {running
                ? t("Tạm dừng", "Pause")
                : count === products.length
                  ? t("Chạy lại", "Run again")
                  : t("Chạy tự động", "Auto run")}
            </button>
            <button
              className="small-button"
              disabled={!q || running || count === products.length}
              onClick={() => setCount((c) => c + 1)}
            >
              <StepForward size={16} />
              {t("Từng dòng", "One row")}
            </button>
            <button
              className="quiet"
              aria-label={t("Đặt lại phép quét", "Reset the scan")}
              onClick={() => {
                setCount(0);
                setRunning(false);
              }}
            >
              <RotateCcw size={16} />
            </button>
            <span>
              {count}/{products.length} {t("lần kiểm tra", "checks")}
            </span>
          </div>
        </>
      )}
      <div className="db-results" aria-live="polite">
        <span>
          <b>RESULT</b>
          <span>
            {result.length} {t("bản ghi", "records")}
          </span>
        </span>
        <div>
          {result.length ? (
            result.map((p) => <code key={p.id}>{p.id}</code>)
          ) : (
            <span>
              {mode === 1 && count === 0
                ? t("Chưa có kết quả", "No results yet")
                : t("Không có bản ghi phù hợp", "No matching records")}
            </span>
          )}
        </div>
      </div>
      <p className="db-caption">
        {mode === 1 ? (
          <>
            <b>Linear Search · O(n)</b> —{" "}
            {t(
              "muốn lấy tất cả kết quả, đọc hết n dòng.",
              "to get every match, read all n rows.",
            )}
          </>
        ) : mode === 2 ? (
          <>
            {t("Điều kiện", "Condition")} <b>AND</b>:{" "}
            {t(
              "giữ lại bản ghi thỏa cả màu lẫn giá. Chưa có index, vẫn phải xét từng dòng.",
              "keep records that satisfy both color and price. Without an index, every row is still checked.",
            )}
          </>
        ) : (
          <>
            {t("Tra từ trong", "Look up the term in the")} <b>inverted index</b>{" "}
            →{" "}
            {t(
              "lấy posting list → đọc đúng các ID liên quan.",
              "get the posting list → read only those IDs.",
            )}
          </>
        )}
      </p>
      {mode === 3 && term === indexTerms[lang][0] && (
        <p className="db-callout">
          {t(
            <>
              <b>P02 Hoodie lavender</b> cũng là áo, nhưng tên không chứa từ
              “áo” → index không trả về. Index chỉ biết những từ thực sự xuất
              hiện.
            </>,
            <>
              <b>P02 Lavender hoodie</b> is also a top you could wear, but its
              name doesn&apos;t contain “shirt” → the index never returns it. An
              index only knows words that actually appear.
            </>,
          )}
        </p>
      )}
    </div>
  );
}
