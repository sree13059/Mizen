import PageHero from '../components/PageHero'
import { images } from '../content'

function About() {
  return (
    <main>
      <PageHero
        eyebrow="About Us"
        image={images.team}
        title="We turn ideas into reliable digital products."
        text="Mizen Tech Solutions is a dynamic software company dedicated to delivering innovative, scalable, and result-driven technology solutions for ambitious businesses."
      />

      <section className="content-band">
        <div className="section-copy reveal">
          <p className="eyebrow">Our Story</p>
          <h2>Software built with strategy, not guesswork.</h2>
          <p>
            We work with startups, SMEs, and enterprises that need technology to
            improve operations, launch products, or modernize legacy workflows.
            Every engagement starts with understanding business needs, user
            behavior, technical constraints, and growth plans.
          </p>
        </div>
        <div className="value-stack reveal delay-1">
          <article>
            <h3>What we build</h3>
            <p>
              Custom platforms, dashboards, portals, mobile apps, cloud systems,
              and automation tools.
            </p>
          </article>
          <article>
            <h3>How we work</h3>
            <p>
              Clear planning, agile delivery, practical design, frequent
              communication, and dependable support.
            </p>
          </article>
          <article>
            <h3>Who we serve</h3>
            <p>
              Founders, growing businesses, operational teams, and enterprises
              that need software to move faster.
            </p>
          </article>
        </div>
      </section>

      <section className="mission-section">
        <article className="mission-card reveal">
          <p className="eyebrow">Our Vision</p>
          <h2>To become a trusted technology partner worldwide.</h2>
          <p>
            We aim to deliver innovative, reliable, and impactful software
            solutions that help businesses compete with confidence.
          </p>
        </article>
        <article className="mission-card reveal delay-1">
          <p className="eyebrow">Our Mission</p>
          <h2>To empower organizations with smart technology.</h2>
          <p>
            Our mission is to drive efficiency, growth, and digital
            transformation through software that fits real business needs.
          </p>
        </article>
      </section>
    </main>
  )
}

export default About
