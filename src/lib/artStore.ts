import { useSyncExternalStore } from "react";
import art1 from "@/assets/art1.jpg";
import art2 from "@/assets/art2.jpg";
import art3 from "@/assets/art3.jpg";
import art4 from "@/assets/art4.jpg";

export type Artwork = {
  id: number;
  title: string;
  artist: string;
  description: string;
  image: string;
  listing_type: "fixed" | "auction";
  price: number;
};

export type Bid = {
  id: number;
  artwork_id: number;
  bidder_name: string;
  amount: number;
};

let artworks: Artwork[] = [
  {
    id: 1,
    title: "Neon Requiem",
    artist: "Aria Volkov",
    description:
      "A study in motion — magenta and cobalt collide across a black field, capturing the moment between silence and sound.",
    image: art1,
    listing_type: "auction",
    price: 24000,
  },
  {
    id: 2,
    title: "Golden Hour",
    artist: "Milo Chen",
    description:
      "Oil on linen. A quiet portrait bathed in late afternoon light — patience rendered in warm ochre.",
    image: art2,
    listing_type: "fixed",
    price: 58000,
  },
  {
    id: 3,
    title: "Monolith 04",
    artist: "Sara Okafor",
    description:
      "Fabricated in weathered steel. Part of an ongoing series exploring negative space and gravity.",
    image: art3,
    listing_type: "auction",
    price: 92000,
  },
  {
    id: 4,
    title: "After Hours",
    artist: "Kenji Rivera",
    description:
      "Digital painting. A love letter to cities that never sleep and the palettes they broadcast at midnight.",
    image: art4,
    listing_type: "fixed",
    price: 18500,
  },
];

let bids: Bid[] = [
  { id: 1, artwork_id: 1, bidder_name: "L. Hartmann", amount: 24000 },
  { id: 2, artwork_id: 1, bidder_name: "R. Iyer", amount: 26500 },
  { id: 3, artwork_id: 3, bidder_name: "Studio Nomad", amount: 92000 },
  { id: 4, artwork_id: 3, bidder_name: "V. Costa", amount: 95000 },
];

let nextArtId = 5;
let nextBidId = 5;

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const store = {
  getArtworks: () => artworks,
  getArtwork: (id: number) => artworks.find((a) => a.id === id),
  getBids: (artworkId: number) =>
    bids.filter((b) => b.artwork_id === artworkId).sort((a, b) => b.amount - a.amount),
  addArtwork: (a: Omit<Artwork, "id">) => {
    const created = { ...a, id: nextArtId++ };
    artworks = [created, ...artworks];
    notify();
    return created;
  },
  addBid: (b: Omit<Bid, "id">) => {
    bids = [...bids, { ...b, id: nextBidId++ }];
    notify();
  },
};

export function useArtworks() {
  return useSyncExternalStore(
    subscribe,
    () => artworks,
    () => artworks,
  );
}
export function useBids(artworkId: number) {
  return useSyncExternalStore(
    subscribe,
    () => store.getBids(artworkId),
    () => store.getBids(artworkId),
  );
}
export function useArtwork(id: number) {
  return useSyncExternalStore(
    subscribe,
    () => store.getArtwork(id),
    () => store.getArtwork(id),
  );
}

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
