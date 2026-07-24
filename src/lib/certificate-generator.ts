import { PDFDocument } from "pdf-lib";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { ExcelRow } from "./excel-parser";

export interface PlacedField {
  id: string;
  key: string; // header name
  x: number; // relative 0..1
  y: number;
  fontSize: number; // relative to canvas height * scale (in px on preview)
  fontFamily: string;
  fontWeight: string;
  italic: boolean;
  underline: boolean;
  color: string;
  align: "left" | "center" | "right";
  letterSpacing: number;
  opacity: number;
  rotation: number; // degrees
}

export interface TemplateImage {
  image: HTMLImageElement;
  width: number;
  height: number;
}

export function drawCertificate(
  ctx: CanvasRenderingContext2D,
  tpl: TemplateImage,
  fields: PlacedField[],
  row: ExcelRow,
) {
  ctx.clearRect(0, 0, tpl.width, tpl.height);
  ctx.drawImage(tpl.image, 0, 0, tpl.width, tpl.height);
  for (const f of fields) {
    const text = row[f.key] ?? "";
    if (!text) continue;
    ctx.save();
    ctx.globalAlpha = f.opacity;
    const px = f.x * tpl.width;
    const py = f.y * tpl.height;
    ctx.translate(px, py);
    if (f.rotation) ctx.rotate((f.rotation * Math.PI) / 180);
    const style = `${f.italic ? "italic " : ""}${f.fontWeight} ${f.fontSize}px ${f.fontFamily}`;
    ctx.font = style;
    ctx.fillStyle = f.color;
    ctx.textAlign = f.align;
    ctx.textBaseline = "middle";
    if (f.letterSpacing && "letterSpacing" in ctx) {
      (ctx as unknown as { letterSpacing: string }).letterSpacing = `${f.letterSpacing}px`;
    }
    ctx.fillText(text, 0, 0);
    if (f.underline) {
      const w = ctx.measureText(text).width;
      const x0 = f.align === "center" ? -w / 2 : f.align === "right" ? -w : 0;
      ctx.fillRect(x0, f.fontSize * 0.55, w, Math.max(1, f.fontSize / 16));
    }
    ctx.restore();
  }
}

export function safeFileName(s: string) {
  return s.replace(/[^a-z0-9-_]+/gi, "_").replace(/^_+|_+$/g, "") || "certificate";
}

export interface GenerateOptions {
  template: TemplateImage;
  rows: ExcelRow[];
  fields: PlacedField[];
  format: "pdf" | "png" | "jpg";
  nameField: string;
  onProgress?: (done: number, total: number) => void;
}

async function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("canvas.toBlob failed"))),
      type,
      quality,
    );
  });
}

export async function generateAndDownloadZip(opts: GenerateOptions) {
  const { template, rows, fields, format, nameField, onProgress } = opts;
  const zip = new JSZip();
  const canvas = document.createElement("canvas");
  canvas.width = template.width;
  canvas.height = template.height;
  const ctx = canvas.getContext("2d")!;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    drawCertificate(ctx, template, fields, row);
    const base = safeFileName(row[nameField] || `certificate_${i + 1}`);

    if (format === "png") {
      const blob = await canvasToBlob(canvas, "image/png");
      zip.file(`${base}.png`, blob);
    } else if (format === "jpg") {
      const blob = await canvasToBlob(canvas, "image/jpeg", 0.92);
      zip.file(`${base}.jpg`, blob);
    } else {
      const jpg = await canvasToBlob(canvas, "image/jpeg", 0.92);
      const pdf = await PDFDocument.create();
      const bytes = new Uint8Array(await jpg.arrayBuffer());
      const img = await pdf.embedJpg(bytes);
      const page = pdf.addPage([template.width, template.height]);
      page.drawImage(img, { x: 0, y: 0, width: template.width, height: template.height });
      const pdfBytes = await pdf.save();
      zip.file(`${base}.pdf`, pdfBytes);
    }

    onProgress?.(i + 1, rows.length);
    if (i % 10 === 0) await new Promise((r) => setTimeout(r, 0));
  }

  const blob = await zip.generateAsync({ type: "blob" }, (meta) => {
    onProgress?.(rows.length, rows.length + Math.round(meta.percent));
  });
  saveAs(blob, `certificates_${Date.now()}.zip`);
}

export async function loadImageFromFile(file: File): Promise<TemplateImage> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("Failed to load image"));
      i.src = url;
    });
    return { image: img, width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    // keep url alive until image cached in memory; browser may still need it — revoke later
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
  }
}
