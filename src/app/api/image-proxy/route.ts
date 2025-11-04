import { NextRequest, NextResponse } from "next/server";

const TIMEOUT_MS = 12_000;

const ALLOWED_HOSTS: string[] = [];

function isHttpUrlSafe(u: URL) {
  if (!["http:", "https:"].includes(u.protocol)) return false;

  if (ALLOWED_HOSTS.length > 0 && !ALLOWED_HOSTS.includes(u.hostname)) {
    return false;
  }

  const host = u.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.startsWith("10.") ||
    host.startsWith("192.168.") ||
    host.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)
  ) {
    return false;
  }

  return true;
}

function passthroughHeaders(res: Response) {
  const headers = new Headers();
  const contentType = res.headers.get("Content-Type");
  if (contentType) headers.set("Content-Type", contentType);

  headers.set(
    "Cache-Control",
    "public, s-maxage=3600, max-age=1800, stale-while-revalidate=60"
  );

  return headers;
}

async function doProxy(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "Thiếu tham số ?url=" }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "URL không hợp lệ" }, { status: 400 });
  }

  if (!isHttpUrlSafe(target)) {
    return NextResponse.json({ error: "URL đã bị chặn" }, { status: 403 });
  }

  // Xử lý timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const upstream = await fetch(target.toString(), {
      headers: {
        Accept: "image/*,*/*;q=0.8",
        "User-Agent": "EVSwapImageProxy/1.0",
      },
      signal: controller.signal,
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        { error: `Lỗi từ server gốc: ${upstream.status}` },
        { status: 502 }
      );
    }

    const headers = passthroughHeaders(upstream);
    return new NextResponse(upstream.body, { status: 200, headers });
  } catch (err: any) {
    const isTimeout = err?.name === "AbortError";
    return NextResponse.json(
      { error: isTimeout ? "Hết thời gian chờ" : "Proxy fetch thất bại" },
      { status: isTimeout ? 504 : 502 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

// Chỉ định hàm doProxy cho phương thức GET
export async function GET(req: NextRequest) {
  return doProxy(req);
}
