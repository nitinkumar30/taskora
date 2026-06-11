import { NextResponse } from "next/server";
import { readFolders, createFolder } from "@/utils/json-storage";

export async function GET() {
  const folders = readFolders();
  return NextResponse.json(folders);
}

export async function POST(request: Request) {
  const body = await request.json();
  const folders = createFolder(body);
  return NextResponse.json(folders);
}
