import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { useArtworks, formatPrice, store } from "@/lib/artStore";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const artworks = useArtworks();

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-16">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Live marketplace
          </span>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] md:text-7xl">
            Where <span className="text-gradient italic">original</span> work
            finds its collector.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            A curated feed of paintings, sculpture, and digital work from
            independent artists. Buy at a fixed price or place a bid — every
            piece is one of a kind.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/upload"
              className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.03]"
            >
              List your work
            </Link>
            <a
              href="#feed"
              className="inline-flex items-center rounded-full border border-border bg-surface/50 px-6 py-3 text-sm font-medium transition-colors hover:bg-surface"
            >
              Browse the feed
            </a>
          </div>
          <div className="mt-10 flex gap-8 text-sm">
            <Stat label="Works" value={String(artworks.length)} />
            <Stat label="Artists" value={String(new Set(artworks.map(a => a.artist)).size)} />
            <Stat label="Live auctions" value={String(artworks.filter(a => a.listing_type === "auction").length)} />
          </div>
        </div>
      </section>

      {/* Feed */}
      <section id="feed" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-semibold">The Feed</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Freshly listed. Curated daily.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artworks.map((art) => {
            const bids = store.getBids(art.id);
            const highest = bids[0]?.amount ?? art.price;
            return (
              <Link
                key={art.id}
                to="/artwork/$id"
                params={{ id: String(art.id) }}
                className="group card-glow card-glow-hover flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={art.image}
                    alt={art.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3">
                    <span
                      className={
                        "rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest backdrop-blur-md " +
                        (art.listing_type === "auction"
                          ? "bg-primary/90 text-primary-foreground"
                          : "bg-background/70 text-foreground border border-border")
                      }
                    >
                      {art.listing_type === "auction" ? "Auction" : "Fixed"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="min-w-0 truncate font-display text-lg font-semibold">
                      {art.title}
                    </h3>
                    <span className="shrink-0 text-sm font-medium text-primary">
                      ₹{formatPrice(art.listing_type === "auction" ? highest : art.price)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    by <span className="text-foreground/80">{art.artist}</span>
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {art.listing_type === "auction"
                        ? `${bids.length} bid${bids.length === 1 ? "" : "s"}`
                        : "Available now"}
                    </span>
                    <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-semibold">{value}</div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
