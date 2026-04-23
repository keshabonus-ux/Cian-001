import { notFound } from "next/navigation";
import { OfferView } from "./OfferView";
import { findListing, LISTINGS } from "@/lib/data";

export function generateStaticParams() {
  return LISTINGS.map((l) => ({ id: l.id }));
}

export default function OfferPage({ params }: { params: { id: string } }) {
  const listing = findListing(params.id);
  if (!listing) notFound();
  const similar = LISTINGS.filter(
    (l) =>
      l.id !== listing.id &&
      l.cityId === listing.cityId &&
      l.dealType === listing.dealType &&
      l.propertyType === listing.propertyType,
  ).slice(0, 4);
  return <OfferView listing={listing} similar={similar} />;
}
