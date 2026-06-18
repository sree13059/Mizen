import PageHero from '../components/PageHero'
import { images, jobs } from '../content'

function Careers() {
  return (
    <main>
      <PageHero
        eyebrow="Careers"
        image={images.careers}
        title="Join a team that builds practical technology."
        text="We look for curious engineers, designers, and problem-solvers who care about clean delivery, useful products, and steady growth."
      />

      <section className="feature-section dark-section">
        <div className="section-heading reveal">
          <p className="eyebrow">Open Roles</p>
          <h2>Grow with meaningful product work.</h2>
          <p>
            These sample roles can be updated as your hiring plans change.
          </p>
        </div>
        <div className="job-grid">
          {jobs.map((job) => (
            <article className="job-card reveal" key={job.title}>
              <span>{job.type}</span>
              <h3>{job.title}</h3>
              <p>{job.text}</p>
              <a href="mailto:careers@mizentechsolutions.com">Apply Now</a>
            </article>
          ))}
        </div>
      </section>

      <section className="content-band">
        <div className="section-copy reveal">
          <p className="eyebrow">Life at Mizen</p>
          <h2>Clear work, practical learning, and shared ownership.</h2>
        </div>
        <div className="value-stack reveal delay-1">
          <article>
            <h3>Learn by building</h3>
            <p>
              Work on real product problems, production systems, and client
              workflows.
            </p>
          </article>
          <article>
            <h3>Collaborate openly</h3>
            <p>
              We value clear communication, respectful reviews, and visible
              progress.
            </p>
          </article>
          <article>
            <h3>Own outcomes</h3>
            <p>
              Every team member contributes to quality, customer value, and
              product success.
            </p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default Careers
