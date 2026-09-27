"use client";
import { useState, useEffect, useCallback } from "react";
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Lightbulb,
  ChevronDown,
  ExternalLink,
  Database,
  ListFilter,
  Network,
  Search,
  Layers,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { slides, chapters, sources } from "./content";
import { Demo } from "./demos";
const keywordPattern =
  /(Linear Search|inverted index|metadata|Semantic search|semantic search|embedding model|Embedding model|embedding|Embedding|vector database|Vector database|vector DB|Vector DB|vector|Vector|tokenizer|Tokenizer|token ID|Token ID|Attention|attention|Transformer|transformer|Training|training|Inference|inference|RAG|Generative AI|Cosine similarity|cosine similarity|Temperature|temperature|chunk|Chunk|Hybrid search|hybrid search|Reranker|reranker|latent diffusion|logits|loss|top-k)/gi;
function Highlight({ text }: { text: string }) {
  return (
    <>
      {text.split(keywordPattern).map((part, i) =>
        i % 2 ? (
          <mark className="keyword" key={i}>
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}
export default function Home() {
  const [index, setIndex] = useState(0),
    [open, setOpen] = useState(false),
    [notes, setNotes] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [index]);
  const go = useCallback((n: number) => {
    const next = Math.max(0, Math.min(slides.length - 1, n));
    setIndex(next);
    setNotes(false);
    history.replaceState(null, "", `#slide-${next + 1}`);
  }, []);
  useEffect(() => {
    const load = () => {
      const n = Number(location.hash.replace("#slide-", ""));
      if (Number.isInteger(n) && n >= 1 && n <= slides.length) {
        setIndex(n - 1);
        setNotes(false);
      }
    };
    load();
    window.addEventListener("hashchange", load);
    return () => window.removeEventListener("hashchange", load);
  }, []);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (open) return;
      const target = e.target as HTMLElement;
      if (
        target.closest(
          'input,textarea,select,[role="slider"],[role="switch"],[contenteditable="true"]',
        )
      )
        return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        go(index + 1);
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(index - 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, open, go]);
  const slide = slides[index],
    last = index === slides.length - 1;
  return (
    <div className="app-shell no-header">
      {slide.divider ? (
        <main className={"section-title " + slide.divider} key={index}>
          <div className="section-emblem">
            {slide.divider === "before" ? (
              <Database size={34} />
            ) : (
              <Network size={34} />
            )}
          </div>
          <span className="section-kicker">{slide.k}</span>
          <h1>
            {slide.t}
            <br />
            <em>{slide.accent}</em>
          </h1>
          <p>{slide.p}</p>
          <div className="section-path">
            {(slide.divider === "before"
              ? [
                  [Database, "Dữ liệu"],
                  [ListFilter, "Điều kiện"],
                  [Search, "So khớp"],
                ]
              : [
                  [Layers, "Embedding"],
                  [Network, "Vector"],
                  [Search, "Ý nghĩa"],
                ]
            ).map(([Icon, label], i) => (
              <div key={i}>
                {i > 0 && <ArrowRight size={19} />}
                <span>
                  {typeof Icon !== "string" && <Icon size={20} />}
                  <Highlight text={String(label)} />
                </span>
              </div>
            ))}
          </div>
          <p className="section-footnote">
            {slide.divider === "before"
              ? "Tìm kiếm chưa dùng model học máy."
              : "AI bổ sung một cách tìm kiếm. Từ khóa, metadata và index vẫn tiếp tục được sử dụng."}
          </p>
        </main>
      ) : (
        <main
          className={
            "slide " + ([1, 2, 3].includes(slide.demo) ? "database-slide" : "")
          }
          key={index}
        >
          <section className="intro">
            <h1>
              {slide.t.split("\n").map((t, i) => (
                <span key={i}>
                  {t}
                  <br />
                </span>
              ))}
              <em>{slide.accent}</em>
            </h1>
            <p>
              <Highlight text={slide.p} />
            </p>
            <div className="takeaway">
              <Lightbulb size={21} />
              <span>
                <Highlight text={slide.take} />
              </span>
            </div>
            <button
              className="note-toggle"
              aria-expanded={notes}
              onClick={() => setNotes(!notes)}
            >
              <BookOpen size={15} />
              {notes ? "Thu gọn ghi chú" : "Hiểu thêm một chút"}
              <ChevronDown
                size={15}
                style={{ transform: notes ? "rotate(180deg)" : undefined }}
              />
            </button>
          </section>
          <section className="demo-card" aria-label={`Demo: ${slide.k}`}>
            <Demo index={slide.demo} />
          </section>
          {notes && (
            <aside className="notes">
              <div>
                <span className="pill">GÓC CHO DEV</span>
                <p>
                  <Highlight text={slide.note} />
                </p>
              </div>
              <div>
                <strong>Đọc từ nguồn</strong>
                <div className="source-links">
                  {sources
                    .filter((_, i) =>
                      slide.demo < 11
                        ? i === 3
                        : slide.demo < 17
                          ? i < 3
                          : slide.demo < 21
                            ? i === 4
                            : i >= 4,
                    )
                    .map(([t, url]) => (
                      <a key={url} href={url} target="_blank" rel="noreferrer">
                        {t}
                        <ExternalLink size={12} />
                      </a>
                    ))}
                </div>
                <p className="fineprint">
                  Tham khảo thêm mã nguồn RAG: README, pipeline retrieval và
                  hướng dẫn RAG.
                </p>
              </div>
            </aside>
          )}
        </main>
      )}
      <div className="bottom-progress">
        <Progress
          value={((index + 1) / slides.length) * 100}
          aria-label="Tiến độ bài học"
        />
      </div>
      <footer className="footer">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="quiet">
              <BookOpen size={18} />
              <span>Nội dung</span>
            </button>
          </DialogTrigger>
          <DialogContent className="contents-dialog">
            <DialogTitle>Hành trình từ zero đến aha!</DialogTitle>
            <DialogDescription>
              {slides.length} slide · Chọn một nội dung để khám phá.
            </DialogDescription>
            <div className="contents-list">
              {chapters.map((ch, c) => (
                <section key={ch}>
                  <h2>{ch}</h2>
                  {slides.map((s, i) =>
                    s.c === c ? (
                      <button
                        className={i === index ? "selected" : ""}
                        key={i}
                        onClick={() => {
                          go(i);
                          setOpen(false);
                        }}
                      >
                        <span>{String(i + 1).padStart(2, "0")}</span>
                        {s.t.replace("\n", " ")} {s.accent}
                      </button>
                    ) : null,
                  )}
                </section>
              ))}
            </div>
            <div className="dialog-foot">
              Demo chạy trong trình duyệt · Không cần API key
            </div>
          </DialogContent>
        </Dialog>
        <div className="footer-middle">
          <div className="slide-number">
            {String(index + 1).padStart(2, "0")} <span>/ {slides.length}</span>
          </div>
          <span className="keyboard-hint">Dùng phím ← → để chuyển slide</span>
        </div>
        <div className="footer-buttons">
          <button
            className="back-button"
            disabled={index === 0}
            onClick={() => go(index - 1)}
            aria-label="Slide trước"
          >
            <ArrowLeft size={19} />
          </button>
          <button className="primary" onClick={() => go(last ? 0 : index + 1)}>
            {last ? "Xem lại" : slide.divider ? "Bắt đầu" : "Tiếp theo"}
            <ArrowRight size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}

