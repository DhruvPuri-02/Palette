import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { formatPrice, store, useArtwork, useBids } from "@/lib/artStore";

export const Route = createFileRoute("/artwork/$id")({
  component: ArtworkPage,
});

function ArtworkPage() {
  const { id } = useParams({ from: "/artwork/$id" });
  const artId = Number(id);
  const artwork = useArtwork(artId);
  const bids = useBids(artId);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  if (!artwork) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <h1 className="font-display text-3xl">Artwork not found</h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">
            ← Back to feed
          </Link>
        </div>
      </div>
    );
  }

  const highest = bids[0]?.amount ?? artwork.price;

  const placeBid = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(amount);
    if (!name.trim() || !amt) return;
    store.addBid({ artwork_id: artId, bidder_name: name.trim(), amount: amt });
    setName("");
    setAmount("");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <span>←</span> Back to feed
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="overflow-hidden rounded-3xl border border-border bg-card">
            <img
              src={artwork.image}
              alt={artwork.title}
              className="h-full max-h-[80vh] w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {artwork.listing_type === "auction" ? "Live auction" : "Available"}
              </span>
              <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
                {artwork.title}
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                by <span className="text-foreground">{artwork.artist}</span>
              </p>
            </div>

            <p className="leading-relaxed text-muted-foreground">
              {artwork.description || "No description provided."}
            </p>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    {artwork.listing_type === "auction" ? "Highest bid" : "Price"}
                  </div>
                  <div className="mt-1 font-display text-4xl font-semibold text-gradient">
                    ₹{formatPrice(artwork.listing_type === "auction" ? highest : artwork.price)}
                  </div>
                </div>
                {artwork.listing_type === "auction" && (
                  <div className="text-right text-xs text-muted-foreground">
                    <div>{bids.length} bid{bids.length === 1 ? "" : "s"}</div>
                    <div className="mt-1">Starting: ₹{formatPrice(artwork.price)}</div>
                  </div>
                )}
              </div>

              {artwork.listing_type === "auction" ? (
                <form onSubmit={placeBid} className="mt-6 flex flex-col gap-3">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    min={highest + 1}
                    placeholder={`₹ ${formatPrice(highest + 500)} or more`}
                    required
                    className="w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Place bid
                  </button>
                </form>
              ) : (
                <button className="mt-6 w-full rounded-xl bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.02] active:scale-[0.98]">
                  Buy now
                </button>
              )}
            </div>

            {artwork.listing_type === "auction" && (
              <div>
                <h3 className="font-display text-xl font-semibold">Bid history</h3>
                <ul className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
                  {bids.length === 0 && (
                    <li className="px-5 py-4 text-sm text-muted-foreground">
                      No bids yet. Be the first.
                    </li>
                  )}
                  {bids.map((b, i) => (
                    <li key={b.id} className="flex items-center justify-between px-5 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${i === 0 ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground"}`}>
                          {i + 1}
                        </span>
                        <span className="truncate text-sm">{b.bidder_name}</span>
                      </div>
                      <span className={`shrink-0 text-sm font-medium ${i === 0 ? "text-primary" : ""}`}>
                        ₹{formatPrice(b.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
