import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BannerForm from "@/components/BannerForm";
import DeleteBannerBtn from "./DeleteBannerBtn";

export default async function EditarBanner({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const banner = await prisma.banner.findUnique({ where: { id } });
  if (!banner) notFound();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Editar banner</h1>
        <DeleteBannerBtn id={banner.id} />
      </div>
      <BannerForm inicial={banner} />
    </div>
  );
}
