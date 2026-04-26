import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { cookies } from "next/headers";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB input max

const RESIZE: Record<string, { width: number; height?: number }> = {
  logo:    { width: 400, height: 400 },
  banner:  { width: 1200, height: 500 },
  default: { width: 1920 },
};

async function autorizado(): Promise<boolean> {
  const c = await cookies();
  return c.get("admin_auth")?.value === "true" || !!c.get("forn_session")?.value;
}

export async function POST(req: NextRequest) {
  if (!(await autorizado())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const tipo = (form.get("tipo") as string | null) ?? "default";

  if (!file) return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Arquivo muito grande (máx 8 MB)" }, { status: 413 });

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml"];
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: "Formato não suportado. Use JPG, PNG, WebP ou GIF." }, { status: 415 });
  }

  const isSvg = file.type === "image/svg+xml";
  const buffer = Buffer.from(await file.arrayBuffer());

  let finalBuffer: Buffer;
  let contentType: string;
  let ext: string;

  if (isSvg) {
    finalBuffer = buffer;
    contentType = "image/svg+xml";
    ext = "svg";
  } else {
    const cfg = RESIZE[tipo] ?? RESIZE.default;
    finalBuffer = await sharp(buffer)
      .resize(cfg.width, cfg.height, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
    contentType = "image/webp";
    ext = "webp";
  }

  const filename = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  try {
    const blob = await put(filename, finalBuffer, { access: "public", contentType });
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro no upload";
    // Give a clear message if the env var is missing
    if (msg.includes("BLOB_READ_WRITE_TOKEN")) {
      return NextResponse.json(
        { error: "Configure BLOB_READ_WRITE_TOKEN no painel da Vercel (Storage → Blob)" },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
