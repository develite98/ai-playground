// Prints the slide order (VI | EN) with chapters, and flags any Vietnamese text
// left in the English content. Run: node scripts/check-slides.mjs
import { build } from "esbuild";

const result = await build({
  entryPoints: ["app/content.ts"],
  bundle: true,
  format: "esm",
  platform: "node",
  write: false,
  logLevel: "error",
});
const code = result.outputFiles[0].text;
const { getSlides, getChapters } = await import(
  "data:text/javascript;base64," + Buffer.from(code).toString("base64")
);

const vi = getSlides("vi");
const en = getSlides("en");
const chapters = getChapters("vi");
let chapter = -1;
vi.forEach((s, i) => {
  if (s.c !== chapter) {
    chapter = s.c;
    console.log(`\n== ${chapters[s.c]}`);
  }
  const kind = s.divider ? `[${s.divider}] ` : "";
  const title = (x) => `${x.t.replace("\n", " ")} ${x.accent}`;
  console.log(`${String(i + 1).padStart(2)} ${kind}${title(s)} | ${title(en[i])}`);
});

const vietnamese =
  /[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹàáèéìíòóùúýãõĩũ]/i;
const leftovers = en.flatMap((s, i) =>
  [s.t, s.accent, s.p, s.take, ...s.dev]
    .filter((x) => vietnamese.test(x))
    .map((x) => `slide ${i + 1}: ${x.slice(0, 60)}`),
);
console.log(`\n${vi.length} slides · EN leftovers: ${leftovers.length}`);
leftovers.forEach((x) => console.log("  " + x));
process.exitCode = leftovers.length ? 1 : 0;
