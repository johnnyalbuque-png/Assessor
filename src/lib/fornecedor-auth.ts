import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function getContaFromSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("forn_session")?.value;
    if (!token) return null;

    return await prisma.contaFornecedor.findUnique({
      where: { sessionToken: token },
      include: {
        fornecedor: {
          include: { categoria: true },
        },
      },
    });
  } catch {
    return null;
  }
}
