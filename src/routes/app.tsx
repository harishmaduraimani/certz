import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Sparkles,
  LayoutDashboard,
  Wand2,
  Images,
  HelpCircle,
  Settings,
  Search,
  Bell,
  Upload,
  FileSpreadsheet,
  Trash2,
  Download,
  Plus,
  Type,
  ShieldCheck,
  ImagePlus,
  Loader2,
  X,
  ChevronRight,
} from "lucide-react";

import { parseExcel, type ExcelRow } from "../lib/excel-parser";
import {
  drawCertificate,
  generateAndDownloadZip,
  loadImageFromFile,
  type PlacedField,
  type TemplateImage,
} from "../lib/certificate-generator";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Certz Studio — Generate certificates in bulk" },
      { name: "description", content: "Drag placeholders, map your Excel, and export thousands of certificates in seconds." },
      { property: "og:title", content: "Certz Studio" },
      { property: "og:description", content: "Bulk certificate generator. Private in-browser processing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Studio,
});

const SIDEBAR = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "generate", label: "Generate", icon: Wand2 },
  { key: "templates", label: "Templates", icon: Images },
  { key: "help", label: "Help", icon: HelpCircle },
  { key: "settings", label: "Settings", icon: Settings },
] as const;

const FONT_FAMILIES = [
  "Plus Jakarta Sans",
  "Inter",
  "Georgia",
  "Times New Roman",
  "Arial",
  "Courier New",
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function Studio() {
  const [active, setActive] = useState<(typeof SIDEBAR)[number]["key"]>("generate");

  return (
    <div className="flex min-h-screen">
     {/*<Sidebar active={active} onSelect={setActive} />*/}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav />
        <main className="min-w-0 flex-1 p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
             {active === "generate" ? <Generator /> : <ComingSoon label={SIDEBAR.find((s) => s.key === active)!.label} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
/*function Sidebar({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (k: (typeof SIDEBAR)[number]["key"]) => void;
}) {
  return (
    <aside className="glass sticky top-0 hidden h-screen w-60 shrink-0 flex-col p-4 md:flex">
      <Link to="/" className="mb-8 flex items-center gap-2 px-2">
        <div className="grid h-8 w-8 place-items-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <span className="font-display text-lg font-bold">Certz</span>
      </Link>
      <nav className="space-y-1">
        {SIDEBAR.map((s) => {
          const isActive = active === s.key;
          return (
            <button
              key={s.key}
              onClick={() => onSelect(s.key)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "text-white shadow-lg"
                  : "text-muted-foreground hover:bg-white/40 hover:text-foreground"
              }`}
              style={isActive ? { background: "var(--gradient-brand)" } : undefined}
            >
              <s.icon className="h-4 w-4" />
              {s.label}
            </button>
          );
        })}
      </nav>
      <div className="mt-auto">
        <div className="glass rounded-2xl p-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Private mode
          </div>
          <p className="mt-1.5">Files are processed temporarily and never stored on our servers.</p>
        </div>
      </div>
    </aside>
  );
}*/

function TopNav() {
  return (
    <div className="sticky top-0 z-30 px-4 pt-4 md:px-6">
      <div className="glass flex items-center gap-3 rounded-2xl px-4 py-2.5">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="w-full rounded-xl bg-white/60 py-2 pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-indigo-400/40 dark:bg-white/10"
            placeholder="Search templates, fields, actions..."
          />
        </div>
        <button aria-label="Notifications" className="grid h-9 w-9 place-items-center rounded-xl hover:bg-white/40">
          <Bell className="h-4 w-4" />
        </button>
        <div className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white" style={{ background: "var(--gradient-brand)" }}>
          C
        </div>
      </div>
    </div>
  );
}

/*function ComingSoon({ label }: { label: string }) {
  return (
    <div className="glass grid min-h-[60vh] place-items-center rounded-3xl p-10 text-center">
      <div>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl" style={{ background: "var(--gradient-brand)" }}>
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <h2 className="mt-4 font-display text-2xl font-bold">{label}</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">Coming soon. For now, head to Generate.</p>
      </div>
    </div>
  );
}*/

function Generator() {
  const [template, setTemplate] = useState<TemplateImage | null>(null);
  const [excel, setExcel] = useState<{ headers: string[]; rows: ExcelRow[] } | null>(null);
  const [fields, setFields] = useState<PlacedField[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [format, setFormat] = useState<"pdf" | "png" | "jpg">("pdf");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [search, setSearch] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);

  const selected = fields.find((f) => f.id === selectedId) ?? null;
  const currentRow: ExcelRow = excel?.rows[previewIndex] ?? {};
  const nameField = excel?.headers.find((h) => /name/i.test(h)) ?? excel?.headers[0] ?? "Name";

  const filteredRows = useMemo(() => {
    if (!excel) return [];
    const q = search.trim().toLowerCase();
    if (!q) return excel.rows.map((r, i) => ({ r, i }));
    return excel.rows
      .map((r, i) => ({ r, i }))
      .filter(({ r }) => Object.values(r).some((v) => v.toLowerCase().includes(q)));
  }, [excel, search]);

  // Preview render
  useEffect(() => {
    if (!template || !canvasRef.current) return;
    const c = canvasRef.current;
    // fit to display width, keep template aspect
    const wrap = canvasWrapRef.current!;
    const maxW = wrap.clientWidth;
    const scale = maxW / template.width;
    c.width = template.width;
    c.height = template.height;
    c.style.width = `${template.width * scale}px`;
    c.style.height = `${template.height * scale}px`;
    const ctx = c.getContext("2d")!;
    // Substitute placeholder text if no data
    const displayRow: ExcelRow = { ...currentRow };
    if (!excel) {
      fields.forEach((f) => (displayRow[f.key] = `{${f.key}}`));
    } else {
      fields.forEach((f) => {
        if (!displayRow[f.key]) displayRow[f.key] = `{${f.key}}`;
      });
    }
    drawCertificate(ctx, template, fields, displayRow);
  }, [template, fields, currentRow, excel]);

  // Redraw on resize
  useEffect(() => {
    if (!template) return;
    const handler = () => {
      const c = canvasRef.current;
      const wrap = canvasWrapRef.current;
      if (!c || !wrap) return;
      const scale = wrap.clientWidth / template.width;
      c.style.width = `${template.width * scale}px`;
      c.style.height = `${template.height * scale}px`;
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [template]);

  const onTemplateDrop = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    if (f.type === "application/pdf") {
      toast.error("PDF template preview isn't supported yet — please export a PNG or JPG from your PDF.");
      return;
    }
    try {
      const img = await loadImageFromFile(f);
      setTemplate(img);
      toast.success("Template loaded");
    } catch {
      toast.error("Couldn't read that image");
    }
  }, []);

  const onExcelDrop = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    try {
      const parsed = await parseExcel(f);
      if (parsed.rows.length === 0) {
        toast.error("The Excel file has no data rows.");
        return;
      }
      setExcel(parsed);
      setPreviewIndex(0);
      toast.success(`Loaded ${parsed.rows.length} rows`);
    } catch {
      toast.error("Couldn't parse Excel file. Make sure it's .xlsx");
    }
  }, []);

  const addField = (key: string) => {
    if (!key.trim()) return;
    const k = key.trim();
    const f: PlacedField = {
      id: uid(),
      key: k,
      x: 0.5,
      y: 0.5,
      fontSize: template ? Math.round(template.height * 0.045) : 48,
      fontFamily: "Plus Jakarta Sans",
      fontWeight: "700",
      italic: false,
      underline: false,
      color: "#111827",
      align: "center",
      letterSpacing: 0,
      opacity: 1,
      rotation: 0,
    };
    setFields((p) => [...p, f]);
    setSelectedId(f.id);
  };

  const updateSelected = (patch: Partial<PlacedField>) => {
    if (!selectedId) return;
    setFields((p) => p.map((f) => (f.id === selectedId ? { ...f, ...patch } : f)));
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setFields((p) => p.filter((f) => f.id !== selectedId));
    setSelectedId(null);
  };

  // Drag handling on canvas
  const draggingRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const onCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!template) return;
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    // hit-test in reverse (top-most first)
    for (let i = fields.length - 1; i >= 0; i--) {
      const f = fields[i];
      const w = 0.35; // rough hitbox width relative
      const h = (f.fontSize * 1.6) / template.height;
      const dx =
        f.align === "center"
          ? Math.abs(relX - f.x)
          : f.align === "right"
            ? Math.max(0, f.x - relX)
            : Math.max(0, relX - f.x);
      if (dx < w / 2 && Math.abs(relY - f.y) < h / 2 + 0.01) {
        setSelectedId(f.id);
        draggingRef.current = { id: f.id, offsetX: relX - f.x, offsetY: relY - f.y };
        c.setPointerCapture(e.pointerId);
        return;
      }
    }
    setSelectedId(null);
  };
  const onCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const d = draggingRef.current;
    if (!d) return;
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width - d.offsetX));
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height - d.offsetY));
    setFields((p) => p.map((f) => (f.id === d.id ? { ...f, x, y } : f)));
  };
  const onCanvasPointerUp = () => {
    draggingRef.current = null;
  };

  const generate = async () => {
    if (!template) return toast.error("Upload a certificate template first");
    if (!excel) return toast.error("Upload an Excel sheet with participant data");
    if (fields.length === 0) return toast.error("Add at least one placeholder field");
    const missing = fields.map((f) => f.key).filter((k) => !excel.headers.includes(k));
    if (missing.length) {
      toast.error(`Missing columns in Excel: ${missing.join(", ")}`);
      return;
    }
    setGenerating(true);
    setProgress(0);
    try {
      await generateAndDownloadZip({
        template,
        rows: excel.rows,
        fields,
        format,
        nameField,
        onProgress: (d, t) => setProgress(Math.round((d / t) * 100)),
      });
      toast.success(`Generated ${excel.rows.length} certificates`);
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong while generating.");
    } finally {
      setGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-4">
        {/* Privacy banner */}
        <div className="glass flex items-start gap-3 rounded-2xl p-4 text-sm">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">Your files are processed temporarily and are never stored on our servers.</span>{" "}
            Everything runs locally in your browser.
          </p>
        </div>

        {/* Upload row */}
        {!template || !excel ? (
          <div className="grid gap-4 md:grid-cols-2">
            <DropCard
              title="Upload certificate template"
              subtitle="PNG or JPG · exported from Canva or any design tool"
              icon={<ImagePlus className="h-5 w-5" />}
              accept={{ "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] }}
              done={!!template}
              doneLabel={template ? `${template.width}×${template.height}px` : ""}
              onDrop={onTemplateDrop}
              onClear={() => setTemplate(null)}
            />
            <DropCard
              title="Upload Excel sheet"
              subtitle="First row must contain column headers (Name, Event, Date, ...)"
              icon={<FileSpreadsheet className="h-5 w-5" />}
              accept={{ "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] }}
              done={!!excel}
              doneLabel={excel ? `${excel.rows.length} rows · ${excel.headers.length} cols` : ""}
              onDrop={onExcelDrop}
              onClear={() => setExcel(null)}
            />
          </div>
        ) : null}

        {/* Editor + toolbar */}
        {template ? (
          <div className="glass rounded-3xl p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-semibold">Editor</div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => document.getElementById("replace-template")?.click()}
                  className="glass rounded-full px-3 py-1.5 text-xs font-semibold"
                >
                  Replace template
                </button>
                <input
                  id="replace-template"
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={(e) => e.target.files && onTemplateDrop(Array.from(e.target.files))}
                />
                {excel && (
                  <div className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs">
                    <span className="text-muted-foreground">Preview:</span>
                    <select
                      value={previewIndex}
                      onChange={(e) => setPreviewIndex(Number(e.target.value))}
                      className="max-w-[180px] truncate bg-transparent outline-none"
                    >
                      {excel.rows.map((r, i) => (
                        <option key={i} value={i}>
                          {r[nameField] || `Row ${i + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div
              ref={canvasWrapRef}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/50 to-white/20 p-2 dark:from-white/5 dark:to-white/0"
            >
              <canvas
                ref={canvasRef}
                onPointerDown={onCanvasPointerDown}
                onPointerMove={onCanvasPointerMove}
                onPointerUp={onCanvasPointerUp}
                className="mx-auto block cursor-move rounded-xl shadow-lg"
              />
              {selected && (
                <div className="pointer-events-none absolute top-3 left-3 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white">
                  {`{${selected.key}}`} selected
                </div>
              )}
            </div>

            {/* Field pills */}
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-xs font-semibold text-muted-foreground">PLACED FIELDS</div>
                <AddFieldControl headers={excel?.headers ?? []} onAdd={addField} />
              </div>
              <div className="flex flex-wrap gap-2">
                {fields.length === 0 && (
                  <div className="text-xs text-muted-foreground">
                    Add a field to start placing text on the certificate.
                  </div>
                )}
                {fields.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedId(f.id)}
                    className={`glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                      selectedId === f.id ? "ring-2 ring-indigo-400" : ""
                    }`}
                  >
                    <Type className="h-3 w-3" /> {`{${f.key}}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* Preview list */}
        {excel && (
          <div className="glass rounded-3xl p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-semibold">Participants ({excel.rows.length})</div>
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or ID..."
                  className="rounded-full bg-white/60 py-1.5 pr-3 pl-8 text-xs outline-none focus:ring-2 focus:ring-indigo-400/40 dark:bg-white/10"
                />
              </div>
            </div>
            <div className="max-h-64 overflow-auto rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-white/70 backdrop-blur dark:bg-white/10">
                  <tr>
                    {excel.headers.map((h) => (
                      <th key={h} className="px-3 py-2 font-semibold text-muted-foreground">
                        {h}
                      </th>
                    ))}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.slice(0, 200).map(({ r, i }) => (
                    <tr
                      key={i}
                      className={`cursor-pointer border-t border-white/40 hover:bg-white/30 ${
                        previewIndex === i ? "bg-indigo-500/10" : ""
                      }`}
                      onClick={() => setPreviewIndex(i)}
                    >
                      {excel.headers.map((h) => (
                        <td key={h} className="max-w-[180px] truncate px-3 py-2">
                          {r[h]}
                        </td>
                      ))}
                      <td className="px-3 py-2">
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRows.length > 200 && (
                <div className="px-3 py-2 text-xs text-muted-foreground">
                  Showing first 200 of {filteredRows.length} matches.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right rail */}
      <div className="space-y-4">
        <div className="glass rounded-3xl p-4">
          <div className="mb-3 text-sm font-semibold">Generate</div>
          <div className="mb-3 grid grid-cols-3 gap-2">
            {(["pdf", "png", "jpg"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`rounded-xl py-2 text-xs font-semibold uppercase transition ${
                  format === f ? "text-white shadow-lg" : "glass text-muted-foreground"
                }`}
                style={format === f ? { background: "var(--gradient-brand)" } : undefined}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={generate}
            disabled={generating}
            className="btn-gradient inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold disabled:opacity-60"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generating {progress}%
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Generate & download ZIP
              </>
            )}
          </button>
          {generating && (
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/40 dark:bg-white/10">
              <div
                className="h-full transition-all"
                style={{ width: `${progress}%`, background: "var(--gradient-brand)" }}
              />
            </div>
          )}
          <div className="mt-3 text-[11px] text-muted-foreground">
            Files will be named{" "}
            <code className="rounded bg-white/50 px-1 py-0.5 dark:bg-white/10">
              Name.{format}
            </code>{" "}
            using your{" "}
            <span className="font-semibold text-foreground">{nameField}</span> column.
          </div>
        </div>

       <PropertiesPanel
         selected={selected}
         onChange={updateSelected}
         onDelete={deleteSelected}
        />
      </div>
    </div>
  );
}

function DropCard({
  title,
  subtitle,
  icon,
  accept,
  onDrop,
  done,
  doneLabel,
  onClear,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accept: Record<string, string[]>;
  onDrop: (files: File[]) => void;
  done: boolean;
  doneLabel: string;
  onClear: () => void;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  });
  return (
    <div className="glass rounded-3xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-xl text-white" style={{ background: "var(--gradient-brand)" }}>
            {icon}
          </span>
          {title}
        </div>
        {done && (
          <button onClick={onClear} className="rounded-full p-1.5 text-muted-foreground hover:bg-white/40" aria-label="Clear">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div
        {...getRootProps()}
        className={`grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
          isDragActive ? "border-indigo-400 bg-indigo-500/5" : "border-white/60 hover:border-indigo-300"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mb-2 h-5 w-5 text-indigo-500" />
        {done ? (
          <div>
            <div className="text-sm font-semibold text-emerald-600">Loaded</div>
            <div className="text-xs text-muted-foreground">{doneLabel}</div>
          </div>
        ) : (
          <div>
            <div className="text-sm font-semibold">Drop file or click to upload</div>
            <div className="text-xs text-muted-foreground">{subtitle}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function AddFieldControl({
  headers,
  onAdd,
}: {
  headers: string[];
  onAdd: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn-gradient inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
      >
        <Plus className="h-3.5 w-3.5" /> Add field
      </button>
      {open && (
        <div className="glass-strong absolute right-0 z-20 mt-2 w-64 rounded-2xl p-3">
          <div className="mb-2 text-[11px] font-semibold text-muted-foreground uppercase">From Excel</div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {headers.length === 0 && <div className="text-xs text-muted-foreground">Upload Excel to see columns.</div>}
            {headers.map((h) => (
              <button
                key={h}
                onClick={() => {
                  onAdd(h);
                  setOpen(false);
                }}
                className="rounded-full bg-white/60 px-2.5 py-1 text-xs hover:bg-white dark:bg-white/10 dark:hover:bg-white/20"
              >
                {h}
              </button>
            ))}
          </div>
          <div className="mb-1.5 text-[11px] font-semibold text-muted-foreground uppercase">Custom placeholder</div>
          <div className="flex gap-1.5">
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="e.g. Grade"
              className="min-w-0 flex-1 rounded-lg bg-white/70 px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-indigo-400/40 dark:bg-white/10"
            />
            <button
              onClick={() => {
                if (custom.trim()) {
                  onAdd(custom.trim());
                  setCustom("");
                  setOpen(false);
                }
              }}
              className="btn-gradient rounded-lg px-2.5 py-1.5 text-xs font-semibold"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PropertiesPanel({
  selected,
  onChange,
  onDelete,
}: {
  selected: PlacedField | null;
  onChange: (patch: Partial<PlacedField>) => void;
  onDelete: () => void;
}) {
  if (!selected) {
    return (
      <div className="glass rounded-3xl p-5 text-sm text-muted-foreground">
        <div className="mb-1 font-semibold text-foreground">Text properties</div>
        Select a field on the canvas to edit its style.
      </div>
    );
  }
  return (
    <div className="glass rounded-3xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">EDITING</div>
          <div className="font-semibold">{`{${selected.key}}`}</div>
        </div>
        <button onClick={onDelete} className="rounded-full p-2 text-red-500 hover:bg-red-500/10" aria-label="Delete">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <Field label="Font">
          <select
            value={selected.fontFamily}
            onChange={(e) => onChange({ fontFamily: e.target.value })}
            className="w-full rounded-lg bg-white/60 px-2 py-1.5 outline-none dark:bg-white/10"
          >
            {FONT_FAMILIES.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </Field>
        <Field label="Weight">
          <select
            value={selected.fontWeight}
            onChange={(e) => onChange({ fontWeight: e.target.value })}
            className="w-full rounded-lg bg-white/60 px-2 py-1.5 outline-none dark:bg-white/10"
          >
            {["300", "400", "500", "600", "700", "800"].map((w) => (
              <option key={w}>{w}</option>
            ))}
          </select>
        </Field>
        <Field label="Size">
          <input
            type="number"
            value={selected.fontSize}
            onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
            className="w-full rounded-lg bg-white/60 px-2 py-1.5 outline-none dark:bg-white/10"
          />
        </Field>
        <Field label="Color">
          <input
            type="color"
            value={selected.color}
            onChange={(e) => onChange({ color: e.target.value })}
            className="h-9 w-full cursor-pointer rounded-lg bg-white/60 dark:bg-white/10"
          />
        </Field>
        <Field label="Align">
          <select
            value={selected.align}
            onChange={(e) => onChange({ align: e.target.value as PlacedField["align"] })}
            className="w-full rounded-lg bg-white/60 px-2 py-1.5 outline-none dark:bg-white/10"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </Field>
        <Field label="Opacity">
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={selected.opacity}
            onChange={(e) => onChange({ opacity: Number(e.target.value) })}
            className="w-full"
          />
        </Field>
        <Field label="Letter spacing">
          <input
            type="number"
            value={selected.letterSpacing}
            onChange={(e) => onChange({ letterSpacing: Number(e.target.value) })}
            className="w-full rounded-lg bg-white/60 px-2 py-1.5 outline-none dark:bg-white/10"
          />
        </Field>
        <Field label="Rotation °">
          <input
            type="number"
            value={selected.rotation}
            onChange={(e) => onChange({ rotation: Number(e.target.value) })}
            className="w-full rounded-lg bg-white/60 px-2 py-1.5 outline-none dark:bg-white/10"
          />
        </Field>
      </div>
      <div className="mt-4 flex gap-2">
        <ToggleBtn active={selected.italic} onClick={() => onChange({ italic: !selected.italic })} label="I" italic />
        <ToggleBtn active={selected.underline} onClick={() => onChange({ underline: !selected.underline })} label="U" underline />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[10px] font-semibold text-muted-foreground uppercase">{label}</div>
      {children}
    </label>
  );
}

function ToggleBtn({
  active,
  onClick,
  label,
  italic,
  underline,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  italic?: boolean;
  underline?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${
        active ? "text-white shadow" : "glass text-muted-foreground"
      }`}
      style={{
        ...(active ? { background: "var(--gradient-brand)" } : {}),
        fontStyle: italic ? "italic" : undefined,
        textDecoration: underline ? "underline" : undefined,
      }}
    >
      {label}
    </button>
  );
}
