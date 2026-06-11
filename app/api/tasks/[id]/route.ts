import { NextRequest, NextResponse } from "next/server";
import { updateTask, deleteTask, restoreTask } from "@/utils/json-storage";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const updates = await request.json();
  const tasks = updateTask(id, updates);
  return NextResponse.json(tasks);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tasks = deleteTask(id);
  return NextResponse.json(tasks);
}
