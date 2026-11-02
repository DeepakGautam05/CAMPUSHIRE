import { Suspense } from "react";
import { ComingSoon } from "@/components/layout/coming-soon";

async function Content({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <ComingSoon slug={slug} />;
}

export default function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  return (
    <Suspense fallback={null}>
      <Content params={params} />
    </Suspense>
  );
}
