import { NextResponse } from "next/server";
import { readTasks, writeTasks, createTask } from "@/utils/json-storage";

export async function GET() {
  const tasks = readTasks();
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const tasks = createTask(body);
  return NextResponse.json(tasks);
}
