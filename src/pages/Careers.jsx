import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../api'
import PageHero from '../components/PageHero'
import { images, jobs as fallbackJobs } from '../content'

function Careers() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState(fallbackJobs)
  const [loadingJobs, setLoadingJobs] = useState(true)

  useEffect(() => {
    let isActive = true

    apiRequest('/jobs')
      .then((data) => {
        if (isActive && data.jobs?.length) {
          setJobs(data.jobs)
        }
      })
      .catch(() => {
        if (isActive) {
          setJobs(fallbackJobs)
        }
      })
      .finally(() => {
        if (isActive) {
          setLoadingJobs(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  const openApplication = (job) => {
    if (job._id) {
      navigate(`/apply?jobId=${encodeURIComponent(job._id)}`)
      return
    }

    navigate(`/apply?jobTitle=${encodeURIComponent(job.title)}`)
  }

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
            {loadingJobs ? 'Loading current openings...' : 'These openings are managed from the admin dashboard.'}
          </p>
        </div>
        <div className="job-grid">
          {jobs.map((job) => (
            <article className="job-card reveal" key={job._id || job.title}>
              <span>{job.type}</span>
              <h3>{job.title}</h3>
              <p>{job.description || job.text}</p>
              <div className="job-card-meta">
                <b>{job.department || 'Product Team'}</b>
                <b>{job.location || 'Remote'}</b>
                {job.experience && <b>{job.experience}</b>}
                {job.salary && <b>{job.salary}</b>}
              </div>
              {job.skills && <p className="job-card-skills">{job.skills}</p>}
              <button className="job-apply-button" onClick={() => openApplication(job)} type="button">Apply Now</button>
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
