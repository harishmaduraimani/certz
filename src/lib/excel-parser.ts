import ExcelJS from "exceljs";

export type ExcelRow = Record<string, string>;

export interface ParsedExcel {
  headers: string[];
  rows: ExcelRow[];
}

export async function parseExcel(file: File): Promise<ParsedExcel> {
  // Free version limit
  const MAX_CERTIFICATES = 100;

  const buf = await file.arrayBuffer();

  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buf);

  const ws = wb.worksheets[0];

  if (!ws) {
    throw new Error("No sheet found in workbook");
  }

  const headers: string[] = [];

  const headerRow = ws.getRow(1);

  headerRow.eachCell({ includeEmpty: false }, (cell) => {
    headers.push(String(cell.value ?? "").trim());
  });

  const rows: ExcelRow[] = [];

  ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    // Skip header row
    if (rowNumber === 1) return;

    const obj: ExcelRow = {};

    headers.forEach((h, i) => {
      const cell = row.getCell(i + 1);
      const v = cell.value;

      let str = "";

      if (v == null) {
        str = "";
      } else if (typeof v === "object" && "text" in (v as object)) {
        str = String((v as { text: string }).text);
      } else if (v instanceof Date) {
        str = v.toLocaleDateString();
      } else {
        str = String(v);
      }

      obj[h] = str.trim();
    });

    rows.push(obj);
  });

  // ==============================
  // FREE VERSION LIMIT
  // ==============================
  if (rows.length > MAX_CERTIFICATES) {
    throw new Error(
      `❌ Free Version Limit Reached

You uploaded ${rows.length} participants.

The free version supports only ${MAX_CERTIFICATES} certificates per generation.

Please reduce the number of participants or upgrade to the Pro version for unlimited certificate generation.`
    );
  }

  return {
    headers,
    rows,
  };
}