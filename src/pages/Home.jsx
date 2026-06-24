import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../api'
import FlipCard from '../components/FlipCard'
import TestimonialCard from '../components/TestimonialCard'
import { images, services, strengths, testimonials } from '../content'

function Home() {
  const [managedServices, setManagedServices] = useState(services)

  useEffect(() => {
    let isActive = true

    apiRequest('/services')
      .then((data) => {
        if (isActive && data.services?.length) {
          setManagedServices(data.services)
        }
      })
      .catch(() => {
        if (isActive) {
          setManagedServices(services)
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  return (
    <main>
      <section className="home-hero" >
        <div className="hero-copy reveal">
          <p className="eyebrow">Smart software for growing businesses</p>
          <h1>Mizen Tech Solutions</h1>
          <p>
            We build modern digital products and end-to-end software services
            that help businesses grow, optimize operations, and stay
            competitive in a fast-changing digital world.
          </p>

          <div className="hero-actions">
            <Link className="primary-btn hero-register-btn" to="/apply">
              Apply Now
              <span className="hero-register-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>

        <div className="hero-visual reveal delay-1">
          <div className="shape-3d cube-one"></div>
          <div className="shape-3d cube-two"></div>
          <div className="orbit-3d">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <img src={images.hero} alt="Software team collaborating" />
          <div className="floating-card card-top">
            <span>Scalable</span>
            <strong>Digital Products</strong>
          </div>
          <div className="floating-card card-bottom">
            <span>Cloud Ready</span>
            <strong>Business Growth</strong>
          </div>
        </div>
      </section>

      <section className="stats-band" backbround-color="white">
        <div className="stat">
          <strong>End-to-end</strong>
          <span>software delivery</span>
        </div>
        <div className="stat">
          <strong>Cloud-ready</strong>
          <span>architecture</span>
        </div>
        <div className="stat">
          <strong>Agile</strong>
          <span>transparent process</span>
        </div>
      </section>

      <section className="intro-section">
        <div className="section-copy reveal">
          <p className="eyebrow">Who We Are</p>
          <h2>Technology-driven, business-focused, delivery-minded.</h2>
          <p>
            Mizen Tech Solutions creates customized software solutions tailored
            to the needs of startups, SMEs, and enterprises. Our team combines
            technical expertise with strategic thinking to transform ideas into
            powerful digital products.
          </p>
          <Link className="text-link" to="/about">
            Learn more about us
          </Link>
        </div>
        <div className="image-panel reveal delay-1">
          <img src={images.team} alt="Technology consultants reviewing a plan" />
        </div>
      </section>

      <section className="feature-section dark-section">
        <div className="section-heading reveal">
          <p className="eyebrow" style={{color:"#17436f"}}>Popular Services</p>
          <h2>Cards that flip, services that scale.</h2>
          <p>
            Hover or tap the cards to view more detail about each capability.
          </p>
        </div>
        <div className="flip-grid">
          {managedServices.slice(0, 4).map((service) => (
            <FlipCard key={service.title} {...service} />
          ))}
        </div>
      </section>

      <section className="why-preview">
        <div className="section-heading reveal">
          <p className="eyebrow">Why Choose Us</p>
          <h2>Built around trust, clarity, and measurable outcomes.</h2>
        </div>
        <div className="strength-grid">
          {strengths.slice(0, 3).map((item, index) => (
            <Link className="mini-card reveal" key={item.title} to="/why-us">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </Link>
          ))}
        </div>

        <div className="view-more-row">
          <Link className="text-link" to="/why-us">
            View More
          </Link>
        </div>
      </section>

      <section className="testimonial-section home-testimonials">
        <div className="section-heading reveal">
          <p className="eyebrow">Testimonials</p>
          <h2>Employee ratings from the Mizen team.</h2>
          <p>
            Real team voices with photo cards, ratings, and a smooth moving
            carousel.
          </p>
        </div>

        <div className="testimonial-marquee reveal" aria-label="Employee testimonials">
          <div className="testimonial-lane lane-swing">
            {[...testimonials, ...testimonials].map((item, index) => (
              <TestimonialCard item={item} key={`${item.name}-${index}`} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
