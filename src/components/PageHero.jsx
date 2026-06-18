function PageHero({ eyebrow, title, text, image }) {
  return (
    <section className="page-hero">
      {/* Animated end-to-end border around the whole banner */}
      <div className="page-hero-border" aria-hidden="true">
        <span className="border-glow" />
        <span className="border-stroke" />
        <span className="border-shimmer" />
      </div>

      <div className="page-hero-copy reveal">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
        <div className="banner-points" aria-label="Mizen strengths">
          <span>Smart Delivery</span>
          <span>Secure Builds</span>
          <span>Scalable Systems</span>
        </div>
      </div>
      <div className="page-hero-image reveal delay-1">
        <img src={image} alt="" />

        {/* Animated decorative frame overlay (CSS-only) */}
        <div className="image-frame" aria-hidden="true">
          <span className="frame-glow" />
          <span className="frame-border" />
          <span className="frame-shimmer" />
        </div>

        <div className="banner-float">
          <span>Mizen</span>
          <strong>Digital Transformation</strong>
        </div>
      </div>
    </section>
  )
}

export default PageHero
