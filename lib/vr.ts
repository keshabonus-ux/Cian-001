// Demo 3D/VR tour embeds for selected listings. In a real product this would
// come from the listing data itself (Matterport / Kuula / custom tour URL).
// For the prototype we map listing ids to a handful of public sample tours.

export const VR_TOURS: Record<string, string> = {
  "ash-001": "https://kuula.co/share/collection/7KNVf?fs=1&vr=1&thumbs=1",
  "ash-002": "https://kuula.co/share/collection/7KNVf?fs=1&vr=1&thumbs=1&chromeless=1",
  "ash-004": "https://kuula.co/share/collection/7KNVf?fs=1&vr=1&thumbs=1&logo=-1",
  "tkm-001": "https://kuula.co/share/collection/7KNVf?fs=1&vr=1&thumbs=1",
  "mary-002": "https://kuula.co/share/collection/7KNVf?fs=1&vr=1&thumbs=1",
  "tb-001": "https://kuula.co/share/collection/7KNVf?fs=1&vr=1&thumbs=1",
};

export function vrTourUrl(listingId: string): string | undefined {
  return VR_TOURS[listingId];
}
