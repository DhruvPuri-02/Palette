import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { store } from "@/lib/artStore";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload Artwork · Artify" },
      { name: "description", content: "List your original artwork on Artify — sell at a fixed price or run an auction." },
    ],
  }),
  component: Upload,
});

function Upload() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [listingType, setListingType] = useState<"fixed" | "auction">("fixed");

  const onFile = (f: File | null) => {
    if (!f) return setPreview(null);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get("image") as File | null;
    const image = file && file.size > 0 ? URL.createObjectURL(file) : preview ?? "";
    const created = store.addArtwork({
      title: String(fd.get("title") ?? ""),
      artist: String(fd.get("artist") ?? ""),
      description: String(fd.get("description") ?? ""),
      listing_type: (fd.get("listing_type") as "fixed" | "auction") ?? "fixed",
      price: Number(fd.get("price") ?? 0),
      image,
    });
    navigate({ to: "/artwork/$id", params: { id: String(created.id) } });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            New listing
          </span>
          <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
            Share your <span className="text-gradient italic">work</span>.
          </h1>
          <p className="mt-2 text-muted-foreground">
            Fill in the details. Collectors will see it in the feed instantly.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="grid gap-8 rounded-3xl border border-border bg-card/60 p-6 md:p-10 lg:grid-cols-[1fr_1.2fr]"
        >
          {/* Image drop */}
          <label className="group relative flex aspect-[4/5] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-surface/40 transition-colors hover:border-primary/60 hover:bg-surface">
            {preview ? (
              <img src={preview} alt="preview" className="h-full w-full object-cover" />
            ) : (
              <div className="p-6 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <p className="mt-4 font-medium">Drop your image here</p>
                <p className="mt-1 text-xs text-muted-foreground">PNG or JPG, up to 20MB</p>
              </div>
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              required
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(e) => onFile(e.currentTarget.files?.[0] ?? null)}
            />
          </label>

          <div className="flex flex-col gap-5">
            <Field label="Title">
              <input name="title" required placeholder="e.g. Neon Requiem" className={inputCls} />
            </Field>
            <Field label="Artist name">
              <input name="artist" required placeholder="Your name" className={inputCls} />
            </Field>
            <Field label="Description">
              <textarea name="description" rows={4} placeholder="Tell collectors about the piece..." className={inputCls + " resize-none"} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setListingType("fixed")}
                className={`rounded-xl border px-4 py-3 text-left transition-all ${
                  listingType === "fixed"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-surface/40 hover:bg-surface"
                }`}
              >
                <div className="text-sm font-semibold">Fixed price</div>
                <div className="text-xs text-muted-foreground">Sell instantly</div>
              </button>
              <button
                type="button"
                onClick={() => setListingType("auction")}
                className={`rounded-xl border px-4 py-3 text-left transition-all ${
                  listingType === "auction"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-surface/40 hover:bg-surface"
                }`}
              >
                <div className="text-sm font-semibold">Auction</div>
                <div className="text-xs text-muted-foreground">Let collectors bid</div>
              </button>
            </div>
            <input type="hidden" name="listing_type" value={listingType} />

            <Field label={listingType === "auction" ? "Starting price (₹)" : "Price (₹)"}>
              <input name="price" type="number" min={0} step={1} required placeholder="0" className={inputCls} />
            </Field>

            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-[image:var(--gradient-primary)] px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Publish artwork
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-all focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
