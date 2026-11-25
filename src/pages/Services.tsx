/**
 * Placeholder sections — content lands in later chunks.
 * duka-manager / custom anchors match the nav service cards; contact matches /services#contact.
 */
export default function Services() {
  return (
    <>
      <section id="duka-manager" aria-label="Duka Manager" className="min-h-screen" />
      <section id="custom" aria-label="Custom business apps" className="min-h-screen border-t border-line" />
      <section id="contact" aria-label="Contact" className="min-h-screen border-t border-line" />
    </>
  );
}
