import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const badge = searchParams.get("badge");

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(category && { category: { slug: category } }),
      ...(search && { name: { contains: search, mode: "insensitive" } }),
      ...(badge && { badge }),
    },
    include: { category: true },
    orderBy: { sold: "desc" },
  });

  return NextResponse.json(products);
}
