import { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSearchParams } from "react-router-dom";
import { apiRequest } from "../api";
import { jobs as fallbackJobs } from "../content";

const emptyApplication = {
  jobId: "",
  jobTitle: "",
  fullName: "",
  email: "",
  phone: "",
  experience: "",
  resumeFile: "",
  resumeFileName: "",
  resumeMimeType: "",
  portfolio: "",
  coverLetter: "",
};

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

function Register() {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [formData, setFormData] = useState(emptyApplication);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    apiRequest("/jobs")
      .then((data) => {
        if (isActive && data.jobs?.length) {
          const requestedJobId = searchParams.get("jobId");
          const requestedJobTitle = searchParams.get("jobTitle");
          const selectedJob =
            data.jobs.find((job) => job._id === requestedJobId) ||
            data.jobs.find((job) => job.title === requestedJobTitle) ||
            data.jobs[0];

          setJobs(data.jobs);
          setFormData((current) => ({
            ...current,
            jobId: selectedJob?._id || "",
            jobTitle: selectedJob?.title || current.jobTitle,
          }));
        }
      })
      .catch(() => {
        if (isActive) {
          setJobs(fallbackJobs);
        }
      })
      .finally(() => {
        if (isActive) {
          setLoadingJobs(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [searchParams]);

  const selectedJob = useMemo(
    () => jobs.find((job) => (job._id || job.title) === (formData.jobId || formData.jobTitle)),
    [formData.jobId, formData.jobTitle, jobs],
  );

  const handleChange = (event) => {
    if (event.target.name === "jobId") {
      const nextJob = jobs.find((job) => (job._id || job.title) === event.target.value);
      setFormData((current) => ({
        ...current,
        jobId: nextJob?._id || "",
        jobTitle: nextJob?.title || "",
      }));
      setStatus("");
      return;
    }

    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setStatus("");
  };

  const handleResumeChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setStatus("Resume file must be 4 MB or smaller.");
      event.target.value = "";
      return;
    }

    const resumeFile = await readFileAsDataUrl(file);
    setFormData((current) => ({
      ...current,
      resumeFile,
      resumeFileName: file.name,
      resumeMimeType: file.type,
    }));
    setStatus("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.jobId) {
      setStatus("Please choose an available job before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      setStatus("");
      await apiRequest(`/jobs/${formData.jobId}/apply`, {
        method: "POST",
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          experience: formData.experience,
          resumeFile: formData.resumeFile,
          resumeFileName: formData.resumeFileName,
          resumeMimeType: formData.resumeMimeType,
          portfolio: formData.portfolio,
          coverLetter: formData.coverLetter,
        }),
      });
      setFormData((current) => ({
        ...emptyApplication,
        jobId: current.jobId,
        jobTitle: current.jobTitle,
      }));
      setStatus(`Thank you, ${formData.fullName}. Your application has been submitted successfully.`);
    } catch (error) {
      setStatus(error.message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
.application-page{
  min-height:100vh;
  background:
    linear-gradient(135deg, rgba(23,67,111,.08), rgba(111,182,83,.08)),
    #f7fafc;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:48px 18px;
}

.application-card{
  width:100%;
  max-width:1180px;
  background:#fff;
  border:1px solid rgba(159,181,202,.55);
  border-radius:22px;
  box-shadow:0 22px 60px rgba(23,67,111,.14);
  display:grid;
  grid-template-columns:minmax(300px, .86fr) minmax(0, 1.14fr);
  overflow:hidden;
}

.application-info{
  background:
    linear-gradient(145deg, rgba(23,67,111,.96), rgba(62,133,91,.95)),
    #17436f;
  color:#fff;
  min-height:100%;
  padding:52px 42px;
  position:relative;
  overflow:hidden;
}

.application-info::before,
.application-info::after{
  content:"";
  position:absolute;
  border-radius:999px;
  background:rgba(255,255,255,.11);
}

.application-info::before{
  height:190px;
  right:-56px;
  top:-68px;
  width:190px;
}

.application-info::after{
  bottom:-74px;
  height:210px;
  left:-82px;
  width:210px;
}

.application-badge{
  align-items:center;
  background:rgba(255,255,255,.16);
  border:1px solid rgba(255,255,255,.22);
  border-radius:999px;
  display:inline-flex;
  font-size:12px;
  font-weight:800;
  letter-spacing:.08em;
  margin-bottom:24px;
  padding:9px 16px;
  text-transform:uppercase;
}

.application-info h1{
  font-size:clamp(2.4rem, 5vw, 4.25rem);
  font-weight:900;
  line-height:1;
  margin:0 0 18px;
}

.application-info p{
  color:rgba(255,255,255,.88);
  font-size:1rem;
  line-height:1.75;
  margin:0;
  max-width:420px;
}

.application-steps{
  display:grid;
  gap:16px;
  margin-top:34px;
  position:relative;
  z-index:1;
}

.application-step{
  align-items:center;
  display:grid;
  gap:12px;
  grid-template-columns:42px minmax(0, 1fr);
}

.application-step i{
  align-items:center;
  background:rgba(255,255,255,.18);
  border:1px solid rgba(255,255,255,.22);
  border-radius:14px;
  display:flex;
  height:42px;
  justify-content:center;
  width:42px;
}

.application-step strong{
  display:block;
  font-size:.98rem;
  line-height:1.25;
}

.application-step span{
  color:rgba(255,255,255,.76);
  display:block;
  font-size:.86rem;
  margin-top:2px;
}

.application-form-panel{
  padding:48px;
}

.application-heading{
  display:grid;
  gap:8px;
  margin-bottom:26px;
}

.application-heading span{
  color:#6fb653;
  font-size:12px;
  font-weight:900;
  letter-spacing:.12em;
  text-transform:uppercase;
}

.application-heading h2{
  color:#123c65;
  font-size:clamp(1.85rem, 3vw, 2.45rem);
  font-weight:900;
  line-height:1.08;
  margin:0;
}

.application-heading p{
  color:#5d7288;
  line-height:1.65;
  margin:0;
}

.selected-role{
  align-items:center;
  background:#f3f8f3;
  border:1px solid rgba(111,182,83,.26);
  border-radius:16px;
  display:grid;
  gap:14px;
  grid-template-columns:46px minmax(0, 1fr);
  margin-bottom:22px;
  padding:16px;
}

.selected-role i{
  align-items:center;
  background:#6fb653;
  border-radius:14px;
  color:#123c65;
  display:flex;
  font-size:22px;
  height:46px;
  justify-content:center;
  width:46px;
}

.selected-role span{
  color:#627486;
  display:block;
  font-size:.82rem;
  font-weight:800;
  text-transform:uppercase;
}

.selected-role strong{
  color:#123c65;
  display:block;
  font-size:1.04rem;
  line-height:1.3;
  overflow-wrap:anywhere;
}

.application-form{
  display:grid;
  gap:18px;
}

.field-grid{
  display:grid;
  gap:18px;
  grid-template-columns:repeat(2, minmax(0, 1fr));
}

.application-field{
  display:grid;
  gap:8px;
}

.application-field.full{
  grid-column:1 / -1;
}

.application-field label,
.resume-upload-label{
  color:#123c65;
  font-size:.92rem;
  font-weight:800;
}

.application-field input,
.application-field select,
.application-field textarea{
  background:#fff;
  border:1px solid #d7e2ec;
  border-radius:14px;
  color:#0f2f4d;
  min-height:54px;
  outline:0;
  padding:13px 15px;
  transition:border-color .2s ease, box-shadow .2s ease, transform .2s ease;
  width:100%;
}

.application-field textarea{
  min-height:122px;
  resize:vertical;
}

.application-field input:focus,
.application-field select:focus,
.application-field textarea:focus{
  border-color:#6fb653;
  box-shadow:0 0 0 4px rgba(111,182,83,.16);
}

.resume-upload{
  background:#f8fbff;
  border:1px dashed #9fb5ca;
  border-radius:16px;
  color:#123c65;
  cursor:pointer;
  display:grid;
  gap:12px;
  grid-template-columns:46px minmax(0, 1fr);
  min-height:70px;
  padding:14px;
}

.resume-upload input{
  display:none;
}

.resume-upload i{
  align-items:center;
  background:#e8f5e7;
  border-radius:14px;
  color:#2d7b42;
  display:flex;
  font-size:22px;
  height:46px;
  justify-content:center;
  width:46px;
}

.resume-upload strong{
  color:#123c65;
  display:block;
  overflow-wrap:anywhere;
}

.resume-upload small{
  color:#667b8e;
  display:block;
  margin-top:3px;
}

.register-btn{
  align-items:center;
  background:linear-gradient(135deg, #17436f, #6fb653);
  border:0;
  border-radius:14px;
  color:#fff;
  display:inline-flex;
  font-size:1rem;
  font-weight:900;
  gap:10px;
  justify-content:center;
  min-height:56px;
  padding:14px 18px;
  transition:transform .2s ease, box-shadow .2s ease, opacity .2s ease;
  width:100%;
}

.register-btn:hover{
  box-shadow:0 14px 28px rgba(23,67,111,.22);
  transform:translateY(-2px);
}

.register-btn:disabled{
  cursor:not-allowed;
  opacity:.62;
  transform:none;
}

.application-status{
  border-radius:14px;
  font-weight:750;
  line-height:1.55;
  margin:0 0 20px;
  padding:14px 16px;
}

.application-status.success{
  background:#eff9ef;
  border:1px solid rgba(111,182,83,.34);
  color:#20592f;
}

.application-status.error{
  background:#fff4f4;
  border:1px solid rgba(220,53,69,.26);
  color:#9d1f2e;
}

@media(max-width:900px){
  .application-card{
    grid-template-columns:1fr;
  }

  .application-info{
    min-height:auto;
    padding:38px 28px;
  }

  .application-form-panel{
    padding:34px 26px;
  }
}

@media(max-width:640px){
  .application-page{
    padding:24px 12px;
  }

  .application-card{
    border-radius:18px;
  }

  .field-grid{
    grid-template-columns:1fr;
  }

  .application-info,
  .application-form-panel{
    padding:28px 20px;
  }
}
`}</style>

      <main className="application-page">
        <section className="application-card" aria-label="Job application register">
          <aside className="application-info">
            <span className="application-badge" style={{color:"white"}}>Job Application</span>
            <h1>Apply Now</h1>
            <p>
              Share your details with Mizen Tech Solutions. Your application
              will be reviewed by the admin team from the dashboard.
            </p>

            <div className="application-steps" aria-label="Application steps">
              <div className="application-step">
                <i className="bi bi-briefcase-fill" aria-hidden="true"></i>
                <div>
                  <strong>Choose an open role</strong>
                  <span>Select the position that matches your profile.</span>
                </div>
              </div>
              <div className="application-step">
                <i className="bi bi-file-earmark-arrow-up-fill" aria-hidden="true"></i>
                <div>
                  <strong>Upload your resume</strong>
                  <span>PDF, DOC, DOCX, or image files up to 4 MB.</span>
                </div>
              </div>
              <div className="application-step">
                <i className="bi bi-check2-circle" aria-hidden="true"></i>
                <div>
                  <strong>Submit for review</strong>
                  <span>Your application appears in the admin dashboard.</span>
                </div>
              </div>
            </div>
          </aside>

          <section className="application-form-panel">
            <div className="application-heading">
              <span>Candidate Register</span>
              <h2>Job Application Register</h2>
              <p>
                This form is for candidates applying for jobs. Employee accounts
                are created separately by admin.
              </p>
            </div>

            <div className="selected-role">
              <i className="bi bi-stars" aria-hidden="true"></i>
              <div>
                <span>Selected role</span>
                <strong>{selectedJob?.title || formData.jobTitle || "Choose an open role"}</strong>
              </div>
            </div>

            {status && (
              <p className={`application-status ${status.startsWith("Thank you") ? "success" : "error"}`}>
                {status}
              </p>
            )}

            <form className="application-form" onSubmit={handleSubmit}>
              <div className="application-field full">
                <label htmlFor="jobId">Applying For</label>
                <select
                  id="jobId"
                  name="jobId"
                  value={formData.jobId}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    {loadingJobs ? "Loading open roles..." : "Select an open role"}
                  </option>
                  {jobs.map((job) => (
                    <option disabled={!job._id} key={job._id || job.title} value={job._id || job.title}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-grid">
                <div className="application-field">
                  <label htmlFor="fullName">Full Name</label>
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="application-field">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="field-grid">
                <div className="application-field">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="application-field">
                  <label htmlFor="experience">Experience</label>
                  <input
                    id="experience"
                    type="text"
                    name="experience"
                    placeholder="Example: 2 years"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="application-field full">
                <span className="resume-upload-label">Resume</span>
                <label className="resume-upload">
                  <i className="bi bi-file-earmark-arrow-up" aria-hidden="true"></i>
                  <span>
                    <strong>{formData.resumeFileName || "Upload resume file"}</strong>
                    <small>PDF, DOC, DOCX, or image files up to 4 MB</small>
                  </span>
                  <input
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={handleResumeChange}
                    type="file"
                  />
                </label>
              </div>

              <div className="application-field full">
                <label htmlFor="portfolio">Portfolio or LinkedIn Link</label>
                <input
                  id="portfolio"
                  type="url"
                  name="portfolio"
                  placeholder="https://"
                  value={formData.portfolio}
                  onChange={handleChange}
                />
              </div>

              <div className="application-field full">
                <label htmlFor="coverLetter">Short Message</label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  placeholder="Tell us briefly about your fit for this role"
                  value={formData.coverLetter}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button className="register-btn" disabled={submitting || !formData.jobId} type="submit">
                <i className="bi bi-send-fill" aria-hidden="true"></i>
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </section>
        </section>
      </main>
    </>
  );
}

export default Register;
