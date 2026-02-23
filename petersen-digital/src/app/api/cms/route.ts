import { NextRequest, NextResponse } from "next/server";
import { writeProjectFile, deleteProjectFile } from "@/lib/cms";
import { revalidatePath } from "next/cache";

const CMS_SECRET_KEY = process.env.CMS_SECRET_KEY;

export async function POST(req: NextRequest) {
  // Auth
  const auth = req.headers.get("Authorization");
  if (!CMS_SECRET_KEY || auth !== `Bearer ${CMS_SECRET_KEY}`) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  let body: { action: string; data: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const { action, data } = body;

  try {
    if (action === "add_project" || action === "update_project") {
      const slug = await writeProjectFile(data);
      revalidatePath("/");
      revalidatePath("/projects");
      revalidatePath(`/projects/${slug}`);
      return NextResponse.json({
        ok: true,
        slug,
        message: `Prosjekt "${data.title}" lagt til! ✅`,
      });
    }

    if (action === "delete_project") {
      await deleteProjectFile(data.slug as string);
      revalidatePath("/");
      revalidatePath("/projects");
      return NextResponse.json({
        ok: true,
        slug: data.slug,
        message: `Prosjekt slettet ✅`,
      });
    }

    return NextResponse.json(
      { ok: false, message: `Ukjent action: ${action}` },
      { status: 400 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, message: msg }, { status: 500 });
  }
}

// Health check
export async function GET() {
  return NextResponse.json({ ok: true, service: "petersen-digital-cms" });
}
