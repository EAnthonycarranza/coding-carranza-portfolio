import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const {
      title,
      description,
      long_description,
      client_name,
      project_url,
      image_url,
      technologies,
      featured,
    } = body;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const db = getDb();
    db.prepare(
      `UPDATE projects SET title=?, slug=?, description=?, long_description=?, client_name=?, project_url=?, image_url=?, technologies=?, featured=?, updated_at=CURRENT_TIMESTAMP
       WHERE id=?`
    ).run(
      title,
      slug,
      description,
      long_description || null,
      client_name || null,
      project_url || null,
      image_url || null,
      technologies || null,
      featured ? 1 : 0,
      id
    );

    const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(id);
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const db = getDb();
    db.prepare("DELETE FROM projects WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
