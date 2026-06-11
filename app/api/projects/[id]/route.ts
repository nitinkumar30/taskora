import { NextRequest, NextResponse } from "next/server";
import { updateProject, deleteProject } from "@/utils/json-storage";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const updates = await request.json();
  const projects = updateProject(id, updates);
  return NextResponse.json(projects);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projects = deleteProject(id);
  return NextResponse.json(projects);
}
