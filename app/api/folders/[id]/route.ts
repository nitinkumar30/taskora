import { NextRequest, NextResponse } from "next/server";
import { updateFolder, deleteFolder } from "@/utils/json-storage";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const updates = await request.json();
  const folders = updateFolder(id, updates);
  return NextResponse.json(folders);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const folders = deleteFolder(id);
  return NextResponse.json(folders);
}
