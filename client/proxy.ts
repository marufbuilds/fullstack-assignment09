
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL || "http://localhost:5000/api";

export async function proxy(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname.replace(/^\/api/, "");
    const searchParams = request.nextUrl.search;

    const targetUrl = `${BACKEND_URL}${pathname}${searchParams}`;

    const headers = new Headers(request.headers);

    headers.delete("host");
    headers.delete("connection");

    const body =
      request.method !== "GET" && request.method !== "HEAD"
        ? await request.arrayBuffer()
        : undefined;

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      redirect: "manual",
      cache: "no-store",
    });

    const responseHeaders = new Headers(response.headers);

    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Equiply API Proxy Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to the Equiply server. Please try again.",
      },
      { status: 502 },
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
