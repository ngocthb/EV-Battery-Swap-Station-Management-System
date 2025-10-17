import { NextRequest, NextResponse } from "next/server";

const TIMEOUT_MS = 12_000;

// (khuyến nghị) Whitelist host cho an toàn SSRF. Để trống = cho phép mọi http(s)
const ALLOWED_HOSTS: string[] = []; // ví dụ: ["imgur.com", "images.example.com"]

function isHttpUrlSafe(u: URL) {
  if (!["http:", "https:"].includes(u.protocol)) return false;
  if (ALLOWED_HOSTS.length > 0 && !ALLOWED_HOSTS.includes(u.hostname)) {
    return false;
  }
  // Chặn localhost/private IP cơ bản
  const host = u.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.startsWith("10.") ||
    host.startsWith("192.168.") ||
    host.startsWith("172.16.") ||
    host.startsWith("172.17.") ||
    host.startsWith("172.18.") ||
    host.startsWith("172.19.") ||
    host.startsWith("172.2") // 172.20-172.31
  ) {
    return false;
  }
  return true;
}

function passthroughHeaders(res: Response) {
  const headers = new Headers();

  // Chuyển tiếp các header quan trọng
  const ct = res.headers.get("Content-Type");
  if (ct) headers.set("Content-Type", ct);

  const cl = res.headers.get("Content-Length");
  if (cl) headers.set("Content-Length", cl);

  const cc = res.headers.get("Cache-Control");
  if (cc) {
    headers.set("Cache-Control", cc);
  } else {
    // nếu upstream không có, cho phép cache CDN 1h, trình duyệt 10 phút (tuỳ bạn sửa)
    headers.set(
      "Cache-Control",
      "public, s-maxage=3600, max-age=600, stale-while-revalidate=60"
    );
  }

  // Bảo mật & CORS cơ bản
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Access-Control-Allow-Origin", "*"); // đổi thành domain của bạn nếu cần
  headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");

  return headers;
}

async function doProxy(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "Missing ?url=" }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!isHttpUrlSafe(target)) {
    return NextResponse.json({ error: "Blocked URL" }, { status: 400 });
  }

  // Timeout bằng AbortController
  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const upstream = await fetch(target.toString(), {
      // ép upstream trả ảnh; nhiều server dựa vào Accept
      headers: {
        Accept: "image/*,*/*;q=0.8",
        "User-Agent": "NextImageProxy/1.0",
      },
      redirect: "follow",
      // Với ảnh, để mặc định cache của fetch; ta kiểm soát cache bằng header trả về
      signal: controller.signal,
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${upstream.status} ${upstream.statusText}` },
        { status: upstream.status }
      );
    }

    // Stream body trực tiếp → ít tốn RAM hơn blob/arrayBuffer
    const headers = passthroughHeaders(upstream);

    // Nếu request là HEAD → chỉ trả header
    if (req.method === "HEAD") {
      return new NextResponse(null, { status: 200, headers });
    }

    // Nếu upstream không có body (HEAD chẳng hạn)
    if (!upstream.body) {
      return NextResponse.json({ error: "No upstream body" }, { status: 502 });
    }

    return new NextResponse(upstream.body as any, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    const aborted = err?.name === "AbortError";
    const msg = aborted ? "Fetch timeout" : "Proxy fetch failed";
    return NextResponse.json({ error: msg }, { status: aborted ? 504 : 502 });
  } finally {
    clearTimeout(to);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new NextResponse("URL is required", { status: 400 });
  }

  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const imageBlob = await response.blob();
    const headers = new Headers();
    headers.set(
      "Content-Type",
      response.headers.get("Content-Type") || "image/*"
    );

    return new NextResponse(imageBlob, { status: 200, headers });
  } catch (error) {
    console.error("Image Proxy Error:", error);
    return new NextResponse("Could not fetch the image.", { status: 500 });
  }
}

export async function HEAD(req: NextRequest) {
  return doProxy(req);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
