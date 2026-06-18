import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiRequest } from '../api'
import PageHero from '../components/PageHero'
import { services } from '../content'

function ServiceDetail() {
  const { slug } = useParams()
  const fallbackService = services.find((item) => item.slug === slug)
  const [service, setService] = useState(fallbackService)

  useEffect(() => {
    let isActive = true

    apiRequest('/services')
      .then((data) => {
        const apiService = data.services?.find((item) => item.slug === slug)
        if (isActive && apiService) {
          setService({
            ...apiService,
            detailPage: fallbackService?.detailPage || {
              title: `${apiService.title} for practical business growth.`,
              summary: apiService.front || apiService.back,
              promise: apiService.back || apiService.front,
              outcomes: apiService.details?.length ? apiService.details.slice(0, 3) : ['Clear scope', 'Reliable delivery', 'Responsive support'],
              deliverables: apiService.details?.length ? apiService.details : ['Planning', 'Design and build', 'Testing and support'],
              process: ['Understand the requirement', 'Plan the service delivery', 'Build and review', 'Launch and improve'],
            },
          })
        }
      })
      .catch(() => {
        if (isActive) {
          setService(fallbackService)
        }
      })

    return () => {
      isActive = false
    }
  }, [fallbackService, slug])

  if (!service) {
    return (
      <main>
        <section className="service-not-found reveal">
          <p className="eyebrow">Service Not Found</p>
          <h1>That service page is not available.</h1>
          <p>Explore our services to find the capability that matches your project.</p>
          <Link className="primary-btn" to="/services">
            Back to services
          </Link>
        </section>
      </main>
    )
  }

  const { detailPage } = service

  return (
    <main>
      <PageHero
        eyebrow={`${service.badge} Details`}
        image={service.image}
        title={detailPage.title}
        text={detailPage.summary}
      />

      <section className="service-detail-section">
        <div className="service-detail-intro reveal">
          <span>{service.badge}</span>
          <div>
            <p className="eyebrow">Service Focus</p>
            <h2>{service.title}</h2>
            <p>{detailPage.promise}</p>
          </div>
        </div>

        <div className="service-outcome-row reveal delay-1" aria-label={`${service.title} outcomes`}>
          {detailPage.outcomes.map((outcome) => (
            <article key={outcome}>
              <strong>{outcome}</strong>
              <span>{service.badge}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="service-detail-section service-detail-grid">
        <article className="service-detail-panel reveal">
          <p className="eyebrow">What You Get</p>
          <h2>Delivery that moves from idea to usable product.</h2>
          <ul className="service-check-list">
            {detailPage.deliverables.map((item) => (
              <li key={item}>
                <i className="bi bi-check2" aria-hidden="true"></i>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="service-detail-panel service-detail-accent reveal delay-1">
          <p className="eyebrow">Why It Works</p>
          <h2>Clear scope, strong engineering, steady launch support.</h2>
          <p>
            We keep the work visible through practical milestones, focused
            releases, and communication that helps business and technical teams
            stay aligned.
          </p>
          <Link className="text-link" to="/contact">
            Start a project conversation
          </Link>
        </article>
      </section>

      <section className="service-flow-section">
        <div className="section-heading reveal">
          <p className="eyebrow">How We Deliver</p>
          <h2>A focused path from planning to improvement.</h2>
        </div>

        <div className="service-flow-grid">
          {detailPage.process.map((step, index) => (
            <article
              className="reveal"
              style={{ '--delay': `${index * 90}ms` }}
              key={step}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="service-cta-band reveal">
        <div>
          <p className="eyebrow">Ready To Build</p>
          <h2>Bring your {service.title.toLowerCase()} idea to Mizen.</h2>
          <p>
            Share your goals, current challenges, and timeline. We will help
            shape a practical next step.
          </p>
        </div>
        <div className="service-cta-actions">
          <Link className="secondary-btn" to="/services">
            <i className="bi bi-arrow-left" aria-hidden="true"></i>
            All services
          </Link>
          <Link className="primary-btn" to="/contact">
            Contact us
          </Link>
        </div>
      </section>
    </main>
  )
}

export default ServiceDetail
