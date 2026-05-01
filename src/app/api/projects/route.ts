import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export async function GET() {
  const db = getDb();
  const projects = db
    .prepare("SELECT * FROM projects ORDER BY created_at DESC")
    .all();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const db = getDb();
    const result = db
      .prepare(
        `INSERT INTO projects (title, slug, description, long_description, client_name, project_url, image_url, technologies, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        title,
        slug,
        description,
        long_description || null,
        client_name || null,
        project_url || null,
        image_url || null,
        technologies || null,
        featured ? 1 : 0
      );

    const project = db
      .prepare("SELECT * FROM projects WHERE id = ?")
      .get(result.lastInsertRowid);

    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
