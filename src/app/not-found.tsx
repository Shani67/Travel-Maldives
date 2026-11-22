import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page space-y-6 py-24 text-center">
      <h1 className="font-display text-4xl font-semibold">This island isn&apos;t on our map</h1>
      <p className="text-muted">The page may have moved. Start again from the destinations list.</p>
      <Link href="/destinations" className="btn-primary">
        Browse destinations
      </Link>
    </div>
  );
}
