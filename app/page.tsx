"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Maximize2,
  Lightbulb,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { slides, chapters, starts, sources } from "./content";
import { Demo } from "./demos";
export default function Home() {
  const [index, setIndex] = useState(0),
    [open, setOpen] = useState(false),
    [notes, setNotes] = useState(false),
    [fullscreenError, setFullscreenError] = useState("");
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
  const slide = slides[index];
  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#slide-1" onClick={() => go(0)}>
          <span className="brand-icon">
            <Sparkles size={23} />
          </span>
          AI playground<span className="brand-label">TỪ ZERO ĐẾN AHA!</span>
        </a>
        <button
          className="quiet"
          onClick={async () => {
            try {
              if (document.fullscreenElement) await document.exitFullscreen();
              else await document.documentElement.requestFullscreen();
              setFullscreenError("");
            } catch {
              setFullscreenError(
                "Trình duyệt này không hỗ trợ toàn màn hình. Bạn vẫn có thể trình chiếu bằng các nút bên dưới.",
              );
            }
          }}
        >
          <Maximize2 size={18} />
          Toàn màn hình
        </button>
      </header>
      {fullscreenError && (
        <p className="fullscreen-error" role="status">
          {fullscreenError}
        </p>
      )}
      <nav className="chapterbar" aria-label="Chương học">
        {chapters.map((ch, i) => (
          <button
            key={ch}
            onClick={() => go(starts[i])}
            className={
              slide.c === i ? "current" : slide.c > i ? "completed" : ""
            }
            aria-current={slide.c === i ? "step" : undefined}
          >
            <span className="chapter-dot">
              {String(i + 1).padStart(2, "0")}
            </span>
            {ch}
          </button>
        ))}
      </nav>
      <main className="slide" key={index}>
        <section className="intro">
          <div className="eyebrow">
            <span className="pill">
              CHƯƠNG {String(slide.c + 1).padStart(2, "0")}
            </span>
            <span>
              {index === 0
                ? "LÀM QUEN VỚI AI"
                : `BƯỚC ${String(index).padStart(2, "0")}`}
            </span>
          </div>
          <h1>
            {slide.t.split("\n").map((t, i) => (
              <span key={i}>
                {t}
                <br />
              </span>
            ))}
            <em>{slide.accent}</em>
          </h1>
          <p>{slide.p}</p>
          <div className="takeaway">
            <Lightbulb size={21} />
            <span>{slide.take}</span>
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
          <Demo index={index} />
        </section>
        {notes && (
          <aside className="notes">
            <div>
              <span className="pill">GÓC CHO DEV</span>
              <p>{slide.note}</p>
            </div>
            <div>
              <strong>Đọc từ nguồn</strong>
              <div className="source-links">
                {sources
                  .filter((_, i) =>
                    index < 11
                      ? i === 3
                      : index < 17
                        ? i < 3
                        : index < 21
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
                Tham khảo thêm mã nguồn RAG do bạn cung cấp: README, pipeline
                retrieval và hướng dẫn RAG. Nội dung demo được biên soạn lại cho
                người mới.
              </p>
            </div>
          </aside>
        )}
      </main>
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
              24 slide · 5 chương · Chọn một bước để khám phá.
            </DialogDescription>
            <div className="contents-list">
              {chapters.map((ch, c) => (
                <section key={ch}>
                  <h2>
                    {String(c + 1).padStart(2, "0")} · {ch}
                  </h2>
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
          <button
            className="primary"
            onClick={() => go(index === 23 ? 0 : index + 1)}
          >
            {index === 0 ? "Khám phá" : index === 23 ? "Xem lại" : "Tiếp theo"}
            <ArrowRight size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
