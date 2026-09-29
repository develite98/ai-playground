"use client";
import { useState, useEffect, useCallback } from "react";
import {
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Lightbulb,
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
import { getSlides, getChapters, sources } from "./content";
import { Demo } from "./demos";
import { LangContext, type Lang } from "./i18n";
const SLIDE_COUNT = getSlides("vi").length;
const LANG_KEY = "ai-playground-lang";
function initialLang(): Lang {
  // Storage can be blocked (private mode, disabled site data); fall back to Vietnamese.
  try {
    return localStorage.getItem(LANG_KEY) === "en" ? "en" : "vi";
  } catch {
    return "vi";
  }
}
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
    [lang, setLang] = useState<Lang>(initialLang);
  const t = <T,>(vi: T, en: T) => (lang === "en" ? en : vi);
  const slides = getSlides(lang),
    chapters = getChapters(lang);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title =
      lang === "en"
        ? "AI Playground · From zero to aha!"
        : "AI Playground · Từ zero đến aha!";
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      // Storage unavailable: the choice simply isn't remembered.
    }
  }, [lang]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [index]);
  const go = useCallback((n: number) => {
    const next = Math.max(0, Math.min(SLIDE_COUNT - 1, n));
    setIndex(next);
    history.replaceState(null, "", `#slide-${next + 1}`);
  }, []);
  useEffect(() => {
    const load = () => {
      const n = Number(location.hash.replace("#slide-", ""));
      if (Number.isInteger(n) && n >= 1 && n <= SLIDE_COUNT) {
        setIndex(n - 1);
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
    <LangContext.Provider value={lang}>
    <div className="app-shell no-header">
      {slide.divider ? (
        <main
          className={"section-title " + slide.divider}
          key={`${index}-${lang}`}
        >
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
                  [Database, t("Dữ liệu", "Data")],
                  [ListFilter, t("Điều kiện", "Conditions")],
                  [Search, t("So khớp", "Matching")],
                ]
              : [
                  [Layers, "Embedding"],
                  [Network, "Vector"],
                  [Search, t("Ý nghĩa", "Meaning")],
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
              ? t(
                  "Tìm kiếm chưa dùng model học máy.",
                  "Search without machine-learning models.",
                )
              : t(
                  "AI bổ sung một cách tìm kiếm. Từ khóa, metadata và index vẫn tiếp tục được sử dụng.",
                  "AI adds another way to search. Keywords, metadata and indexes are still used.",
                )}
          </p>
        </main>
      ) : (
        <main
          className={
            "slide " +
            ([1, 2, 3].includes(slide.demo) ? "database-slide" : "") +
            (slide.full ? " full-slide" : "")
          }
          key={`${index}-${lang}`}
        >
          {!slide.full && (
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
            {slide.dev.length > 0 && (
              <div className="dev-notes">
                <ul>
                  {slide.dev.map((line) => (
                    <li key={line}>
                      {line
                        .split(/`([^`]+)`/)
                        .map((part, i) =>
                          i % 2 ? <code key={i}>{part}</code> : part,
                        )}
                    </li>
                  ))}
                </ul>
                {slide.refs.length > 0 && (
                  <p className="source-links">
                    <span>{t("Nguồn:", "Sources:")}</span>
                    {slide.refs.map((ref) => {
                      const [title, url, titleEn] = sources[ref];
                      return (
                        <a key={url} href={url} target="_blank" rel="noreferrer">
                          {t(title, titleEn ?? title)}
                          <ExternalLink size={11} />
                        </a>
                      );
                    })}
                  </p>
                )}
                {slide.c === 3 && (
                  <p className="fineprint">
                    {t(
                      "Tham khảo thêm mã nguồn RAG: README, pipeline retrieval và hướng dẫn RAG.",
                      "See also the RAG source code: README, retrieval pipeline and RAG guide.",
                    )}
                  </p>
                )}
              </div>
            )}
          </section>
          )}
          {slide.full ? (
            <Demo index={slide.demo} />
          ) : (
            <section className="demo-card" aria-label={`Demo: ${slide.k}`}>
              <Demo index={slide.demo} />
            </section>
          )}
        </main>
      )}
      <div className="bottom-progress">
        <Progress
          value={((index + 1) / slides.length) * 100}
          aria-label={t("Tiến độ bài học", "Lesson progress")}
        />
      </div>
      <footer className="footer">
        <div className="footer-left">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="quiet" aria-label={t("Nội dung", "Contents")}>
              <BookOpen size={18} />
              <span>{t("Nội dung", "Contents")}</span>
            </button>
          </DialogTrigger>
          <DialogContent className="contents-dialog">
            <DialogTitle>
              {t("Hành trình từ zero đến aha!", "From zero to aha!")}
            </DialogTitle>
            <DialogDescription>
              {slides.length}{" "}
              {t(
                "slide · Chọn một nội dung để khám phá.",
                "slides · Pick one to explore.",
              )}
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
              {t(
                "Demo chạy trong trình duyệt · Không cần API key",
                "Demos run in the browser · No API key needed",
              )}
            </div>
          </DialogContent>
        </Dialog>
        <div
          className="lang-switch"
          role="group"
          aria-label={t("Ngôn ngữ", "Language")}
        >
          {(["vi", "en"] as const).map((l) => (
            <button
              key={l}
              className={lang === l ? "selected" : ""}
              aria-pressed={lang === l}
              onClick={() => setLang(l)}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        </div>
        <div className="footer-middle">
          <div className="slide-number">
            {String(index + 1).padStart(2, "0")} <span>/ {slides.length}</span>
          </div>
          <span className="keyboard-hint">
            {t("Dùng phím ← → để chuyển slide", "Use ← → to change slides")}
          </span>
        </div>
        <div className="footer-buttons">
          <button
            className="back-button"
            disabled={index === 0}
            onClick={() => go(index - 1)}
            aria-label={t("Slide trước", "Previous slide")}
          >
            <ArrowLeft size={19} />
          </button>
          <button className="primary" onClick={() => go(last ? 0 : index + 1)}>
            {last
              ? t("Xem lại", "Start over")
              : slide.divider
                ? t("Bắt đầu", "Start")
                : t("Tiếp theo", "Next")}
            <ArrowRight size={18} />
          </button>
        </div>
      </footer>
    </div>
    </LangContext.Provider>
  );
}

