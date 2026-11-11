import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site.config";
import { checkAdminPermission } from "@/lib/auth/permissions";
import { updateSession } from "@/lib/supabase/middleware";

/** 外部AIを使う画面・APIのパス。AI無効時は存在しないものとして扱う */
const AI_PATH_PATTERNS = [
  /^\/ai-collection(\/|$)/,
  /^\/api\/(ai-collection|interview-config|topic-analysis)(\/|$)/,
  /^\/bills\/[^/]+\/(interview|reports|topic-analysis)(\/|$)/,
];

export async function middleware(request: NextRequest) {
  if (
    !siteConfig.features.ai &&
    AI_PATH_PATTERNS.some((p) => p.test(request.nextUrl.pathname))
  ) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const { supabaseResponse, user } = await updateSession(request);

  // ログインページへのアクセスで、既にログイン済みの場合
  if (request.nextUrl.pathname === "/login") {
    if (user && checkAdminPermission(user)) {
      const url = request.nextUrl.clone();
      url.pathname = "/bills";
      return NextResponse.redirect(url);
    }
    // ログインページは常にアクセス可能
    return supabaseResponse;
  }

  // 保護されたルートへのアクセス
  // 未認証の場合
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // admin権限チェック
  if (!checkAdminPermission(user)) {
    // 権限がない場合もログイン画面へ
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
