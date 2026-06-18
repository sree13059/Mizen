import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import FlipCard from '../components/FlipCard'
import PageHero from '../components/PageHero'
import { images, processSteps, services } from '../content'

function Services() {
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
      <PageHero
        eyebrow="Our Services"
        image={images.cloud}
        title="End-to-end software services for modern businesses."
        text="We help organizations design, build, deploy, and maintain digital systems that are secure, scalable, and useful from day one."
      />

      <section className="feature-section">
        <div className="section-heading reveal">
          <p className="eyebrow">Capabilities</p>
          <h2>Hover each card to see what we deliver.</h2>
          <p>
            Our services cover the full software lifecycle, from early product
            thinking to long-term technical support.
          </p>
        </div>
        <div className="flip-grid">
          {managedServices.map((service) => (
            <FlipCard key={service.title} {...service} />
          ))}
        </div>
      </section>

      <section className="process-section">
        <div className="section-copy reveal">
          <p className="eyebrow">Delivery Process</p>
          <h2>A practical workflow from idea to launch.</h2>
          <p>
            We keep the process transparent so every stakeholder can see what
            is being built, why it matters, and when it will be ready.
          </p>
        </div>
        <div className="timeline reveal delay-1">
          {processSteps.map((step, index) => (
            <article key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Services
