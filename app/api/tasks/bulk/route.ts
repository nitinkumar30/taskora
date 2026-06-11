import { NextRequest, NextResponse } from "next/server";
import { readTasks, writeTasks, updateTask } from "@/utils/json-storage";

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { ids, updates } = body;
  let tasks = readTasks();
  ids.forEach((id: string) => {
    tasks = updateTask(id, updates);
  });
  return NextResponse.json(tasks);
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { ids } = body;
  let tasks = readTasks();
  tasks = tasks.filter((t: any) => !ids.includes(t.id));
  writeTasks(tasks);
  return NextResponse.json(tasks);
}
