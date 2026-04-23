import { notFound } from "next/navigation";
import { RealtorView } from "./RealtorView";
import { REALTORS, realtorById } from "@/lib/realtors";

export function generateStaticParams() {
  return REALTORS.map((r) => ({ id: r.id }));
}

export default function RealtorProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const realtor = realtorById(params.id);
  if (!realtor) notFound();
  return <RealtorView realtor={realtor} />;
}
