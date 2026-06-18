import { useEffect, useState } from 'react'
import { apiRequest } from '../api'
import PageHero from '../components/PageHero'
import { images, jobs as fallbackJobs } from '../content'

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

function Careers() {
  const [jobs, setJobs] = useState(fallbackJobs)
  const [loadingJobs, setLoadingJobs] = useState(true)
  const [selectedJob, setSelectedJob] = useState(null)
  const [applicationForm, setApplicationForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    resumeFile: '',
    resumeFileName: '',
    resumeMimeType: '',
    portfolio: '',
    coverLetter: '',
  })
  const [applicationStatus, setApplicationStatus] = useState('')
  const [submittingApplication, setSubmittingApplication] = useState(false)

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

  const handleApplicationChange = (event) => {
    setApplicationForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleResumeFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 4 * 1024 * 1024) {
      setApplicationStatus('Resume file must be 4 MB or smaller.')
      event.target.value = ''
      return
    }

    const resumeFile = await readFileAsDataUrl(file)
    setApplicationForm((current) => ({
      ...current,
      resumeFile,
      resumeFileName: file.name,
      resumeMimeType: file.type,
    }))
    setApplicationStatus('')
  }

  const openApplication = (job) => {
    setSelectedJob(job)
    setApplicationStatus('')
  }

  const closeApplication = () => {
    setSelectedJob(null)
    setApplicationStatus('')
  }

  const handleApplicationSubmit = async (event) => {
    event.preventDefault()
    if (!selectedJob?._id) {
      setApplicationStatus('This opening is not connected to online applications yet.')
      return
    }

    try {
      setSubmittingApplication(true)
      setApplicationStatus('')
      await apiRequest(`/jobs/${selectedJob._id}/apply`, {
        method: 'POST',
        body: JSON.stringify(applicationForm),
      })
      setApplicationForm({
        fullName: '',
        email: '',
        phone: '',
        experience: '',
        resumeFile: '',
        resumeFileName: '',
        resumeMimeType: '',
        portfolio: '',
        coverLetter: '',
      })
      setApplicationStatus('Application submitted successfully.')
    } catch (err) {
      setApplicationStatus(err.message || 'Failed to submit application')
    } finally {
      setSubmittingApplication(false)
    }
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

      {selectedJob && (
        <section className="application-modal" aria-modal="true" role="dialog">
          <div className="application-dialog">
            <button className="application-close" onClick={closeApplication} type="button" aria-label="Close application form">
              <i className="bi bi-x-lg" aria-hidden="true"></i>
            </button>
            <div className="section-heading">
              <p className="eyebrow">Apply Now</p>
              <h2>{selectedJob.title}</h2>
              <p>{selectedJob.department || 'Mizen Team'} | {selectedJob.location || 'Remote'} | {selectedJob.type}</p>
            </div>
            <form className="application-form" onSubmit={handleApplicationSubmit}>
              <input name="fullName" placeholder="Full name" value={applicationForm.fullName} onChange={handleApplicationChange} required />
              <input name="email" placeholder="Email" type="email" value={applicationForm.email} onChange={handleApplicationChange} required />
              <input name="phone" placeholder="Phone" value={applicationForm.phone} onChange={handleApplicationChange} required />
              <input name="experience" placeholder="Experience, e.g. 2 years" value={applicationForm.experience} onChange={handleApplicationChange} />
              <label className="application-resume-upload">
                <i className="bi bi-file-earmark-arrow-up" aria-hidden="true"></i>
                <span>{applicationForm.resumeFileName || 'Upload resume file'}</span>
                <input
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={handleResumeFileChange}
                  type="file"
                />
              </label>
              <input name="portfolio" placeholder="Portfolio or LinkedIn link" value={applicationForm.portfolio} onChange={handleApplicationChange} />
              <textarea name="coverLetter" placeholder="Short message" value={applicationForm.coverLetter} onChange={handleApplicationChange}></textarea>
              {applicationStatus && <p className="application-status">{applicationStatus}</p>}
              <button className="primary-btn" disabled={submittingApplication} type="submit">
                {submittingApplication ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </section>
      )}

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
