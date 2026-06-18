import PageHero from '../components/PageHero'
import TestimonialCard from '../components/TestimonialCard'
import { images, testimonials } from '../content'

function Testimonials() {
  const mobileTestimonials = testimonials.slice(0, 3)
  const desktopTestimonials = testimonials.slice(2, 5)
  return (
    <main>
      <PageHero
        eyebrow="Testimonials"
        image={images.office}
        title="Employee voices from inside Mizen."
        text="A people-first technology culture depends on ownership, learning, clear communication, and delivery discipline. Here is how our team describes the experience."
      />

      <section className="testimonial-section">
        <div className="section-heading reveal">
          <p className="eyebrow">Employee Ratings</p>
          <h2>Eight team stories, moving in rhythm.</h2>
          <p>
            Three cards are visible first on wide screens, then the lane keeps
            moving every few seconds to reveal more team members.
          </p>
        </div>

        <div className="testimonial-marquee reveal" aria-label="Employee testimonials">
          <div className="testimonial-lane lane-swing testimonial-lane-desktop">
            {desktopTestimonials.map((item) => (
              <TestimonialCard item={item} key={item.name} />
            ))}
          </div>
        </div>

        <div className="testimonial-marquee reveal testimonial-marquee-mobile" aria-label="Employee testimonials mobile">
          <div className="testimonial-lane">
            {mobileTestimonials.map((item) => (
              <TestimonialCard item={item} key={item.name} />
            ))}
          </div>
        </div>

      </section>
    </main>
  )
}

export default Testimonials
