// app/api/test-db/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        portfolios: {
          include: {
            positions: true,
          },
        },
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("❌ DB Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

