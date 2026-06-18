import PageHero from '../components/PageHero'
import { images, strengths } from '../content'

const proofItems = [
  {
    title: 'Business-first',
    text: 'We connect every feature to a workflow, user need, or measurable business outcome.',
  },
  {
    title: 'Secure by design',
    text: 'We plan authentication, data protection, permissions, and deployment reliability early.',
  },
  {
    title: 'Support after launch',
    text: 'We help maintain, improve, and scale systems after the first release goes live.',
  },
]

function WhyUs() {
  return (
    <main>
      <PageHero
        eyebrow="Why Choose Us"
        image={images.office}
        title="A technology partner focused on outcomes."
        text="We combine customer focus, scalable engineering, transparent delivery, and ongoing support so your software investment keeps creating value."
      />

      <section className="why-page-section">
        <div className="section-heading reveal">
          <p className="eyebrow">Our Strengths</p>
          <h2>Reliable software delivery without unnecessary complexity.</h2>
        </div>
        <div className="strength-grid">
          {strengths.map((item, index) => (
            <article
              className="mini-card reveal"
              style={{ '--delay': `${index * 70}ms` }}
              key={item.title}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="proof-block">
        <div className="proof-heading reveal">
          <p className="eyebrow">Partnership Promise</p>
          <h2>Strategy, security, and support moving in one direction.</h2>
          <p>
            Every engagement is shaped to protect your investment before launch,
            during delivery, and after your product reaches real users.
          </p>
        </div>

        <div className="proof-section">
          {proofItems.map((item, index) => (
            <article
              className="proof-card reveal"
              style={{ '--delay': `${index * 120}ms` }}
              key={item.title}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default WhyUs
