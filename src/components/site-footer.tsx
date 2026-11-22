export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-foam bg-white">
      <div className="container-page flex flex-col gap-3 py-8 text-sm text-muted sm:flex-row sm:justify-between">
        <p>
          A portfolio project by{" "}
          <a className="font-medium text-lagoon underline" href="https://github.com/Shani67">
            Geethma Ranathunga
          </a>
          . Travel details are a summary; check transfers and seasons before booking.
        </p>
        <p>Not affiliated with any resort or tourism board.</p>
      </div>
    </footer>
  );
}
