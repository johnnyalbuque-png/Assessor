import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXTAUTH_URL ?? "https://vitrineisp.com.br").replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/fornecedor", "/api"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
