import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getAdminSession } from "@/lib/server/admin-session";
import { ADMIN_COOKIE_NAME } from "@/lib/server/admin-session";
import { ensureSchema, getSql, isDatabaseConfigured } from "@/lib/server/db";

function redirect(view: string) {
  return NextResponse.redirect(
    new URL(`/admin?view=${view}&saved=coupon`, process.env.NEXT_PUBLIC_APP_URL || "https://eluxus.dk"),
    { status: 303 }
  );
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const session = getAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url), { status: 303 });
  }

  if (!isDatabaseConfigured()) return redirect("coupons");

  const formData = await request.formData();
  const action = formData.get("action") as string;
  const returnView = (formData.get("return_view") as string) || "coupons";
  const baseUrl = new URL(request.url).origin;

  try {
    await ensureSchema();
    const sql = getSql();

    if (action === "create") {
      const code = (formData.get("code") as string)?.trim().toUpperCase();
      const description = (formData.get("description") as string)?.trim() || null;
      const discountType = (formData.get("discount_type") as string) || "percent";
      const discountValue = Number(formData.get("discount_value") || 10);
      const minOrderDkk = Number(formData.get("min_order_dkk") || 0);
      const maxUsesRaw = formData.get("max_uses") as string;
      const maxUses = maxUsesRaw ? Number(maxUsesRaw) : null;
      const expiresAt = (formData.get("expires_at") as string) || null;

      if (!code) return NextResponse.redirect(new URL(`/admin?view=${returnView}&error=action`, baseUrl), { status: 303 });

      const id = randomBytes(12).toString("hex");
      await sql`
        INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_dkk, max_uses, expires_at)
        VALUES (${id}, ${code}, ${description}, ${discountType}, ${discountValue}, ${minOrderDkk}, ${maxUses}, ${expiresAt})
        ON CONFLICT DO NOTHING
      `;
    } else if (action === "toggle") {
      const id = formData.get("id") as string;
      await sql`UPDATE coupons SET is_active = NOT is_active, updated_at = NOW() WHERE id = ${id}`;
    } else if (action === "delete") {
      const id = formData.get("id") as string;
      await sql`DELETE FROM coupons WHERE id = ${id}`;
    }

    return NextResponse.redirect(new URL(`/admin?view=${returnView}&saved=coupon`, baseUrl), { status: 303 });
  } catch {
    return NextResponse.redirect(new URL(`/admin?view=${returnView}&error=action`, baseUrl), { status: 303 });
  }
}
