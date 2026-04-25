import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const fornecedor = await prisma.fornecedor.create({ data });
  return NextResponse.json(fornecedor);
}
