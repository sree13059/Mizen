import { useEffect, useMemo, useRef, useState } from "react";
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

const getPhoneDigits = (value) => {
  if (value.trim().startsWith("+91")) {
    return value.replace(/\D/g, "").slice(2);
  }

  const digits = value.replace(/\D/g, "");
  return digits;
};

function Register() {
  const [searchParams] = useSearchParams();
  const resumeInputRef = useRef(null);
  const successCloseRef = useRef(null);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [formData, setFormData] = useState(emptyApplication);
  const [status, setStatus] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!successMessage) return undefined;

    successCloseRef.current?.focus();
    const handleEscape = (event) => {
      if (event.key === "Escape") setSuccessMessage("");
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [successMessage]);

  useEffect(() => {
    let isActive = true;

    apiRequest("/jobs")
      .then((data) => {
        if (isActive) {
          const availableJobs = data.jobs?.length ? data.jobs : fallbackJobs;
          const requestedJobId = searchParams.get("jobId");
          const requestedJobTitle = searchParams.get("jobTitle");
          const selectedJob =
            availableJobs.find((job) => job._id === requestedJobId) ||
            availableJobs.find((job) => job.title === requestedJobTitle);

          setJobs(availableJobs);
          if (selectedJob) {
            setFormData((current) => ({
              ...current,
              jobId: selectedJob._id || selectedJob.title,
              jobTitle: selectedJob.title || current.jobTitle,
            }));
          }
        }
      })
      .catch(() => {
        if (isActive) {
          const requestedJobTitle = searchParams.get("jobTitle");
          const selectedJob = fallbackJobs.find((job) => job.title === requestedJobTitle);

          setJobs(fallbackJobs);
          if (selectedJob) {
            setFormData((current) => ({
              ...current,
              jobId: selectedJob.title,
              jobTitle: selectedJob.title,
            }));
          }
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
  const phoneDigits = getPhoneDigits(formData.phone);

  const handleChange = (event) => {
    if (event.target.name === "jobId") {
      const nextJob = jobs.find((job) => (job._id || job.title) === event.target.value);
      setFormData((current) => ({
        ...current,
        jobId: nextJob?._id || nextJob?.title || "",
        jobTitle: nextJob?.title || "",
      }));
      setStatus("");
      return;
    }

    if (event.target.name === "phone") {
      const digits = getPhoneDigits(event.target.value).slice(0, 10);
      setFormData((current) => ({
        ...current,
        phone: digits,
      }));
      setStatus("");
      return;
    }

    if (event.target.name === "experience") {
      const digits = event.target.value.replace(/\D/g, "").slice(0, 2);
      setFormData((current) => ({
        ...current,
        experience: digits,
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
    event.target.value = "";
    setStatus("");
  };

  const handleResumeEdit = () => {
    resumeInputRef.current?.click();
  };

  const handleResumeDelete = () => {
    setFormData((current) => ({
      ...current,
      resumeFile: "",
      resumeFileName: "",
      resumeMimeType: "",
    }));
    if (resumeInputRef.current) {
      resumeInputRef.current.value = "";
    }
    setStatus("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.jobId && !formData.jobTitle) {
      setStatus("Please choose an available job before submitting.");
      return;
    }

    if (phoneDigits.length !== 10) {
      setStatus("Phone number must be exactly 10 digits.");
      return;
    }

    if (!formData.resumeFile) {
      setStatus("Please upload your resume before submitting.");
      return;
    }

    try {
      setSubmitting(true);
      setStatus("");
      const hasJobId = selectedJob?._id && formData.jobId === selectedJob._id;
      await apiRequest(hasJobId ? `/jobs/${formData.jobId}/apply` : "/jobs/apply", {
        method: "POST",
        body: JSON.stringify({
          jobTitle: formData.jobTitle,
          fullName: formData.fullName,
          email: formData.email,
          phone: `+91 ${phoneDigits}`,
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
      setSuccessMessage(`Thank you, ${formData.fullName}. Your application has been submitted successfully.`);
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
  max-width:1260px;
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
  gap:20px;
  grid-template-columns:1fr;
}

.field-grid{
  display:grid;
  gap:20px;
  grid-template-columns:repeat(2, minmax(260px, 1fr));
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

.required-mark{
  color:#b42318;
  margin-left:3px;
}

.application-field input,
.application-field select,
.application-field textarea{
  background:#fff;
  border:1px solid #d7e2ec;
  border-radius:14px;
  color:#0f2f4d;
  font-size:1.05rem;
  min-height:66px;
  outline:0;
  padding:18px 20px;
  transition:border-color .2s ease, box-shadow .2s ease, transform .2s ease;
  width:100%;
}

.application-field textarea{
  min-height:122px;
  resize:vertical;
}

.phone-input-group{
  align-items:center;
  background:#fff;
  border:1px solid #d7e2ec;
  border-radius:14px;
  display:flex;
  min-height:66px;
  overflow:hidden;
  transition:border-color .2s ease, box-shadow .2s ease, transform .2s ease;
  width:100%;
}

.phone-input-group:focus-within{
  border-color:#6fb653;
  box-shadow:0 0 0 4px rgba(111,182,83,.16);
}

.phone-prefix{
  align-items:center;
  align-self:stretch;
  background:#f1f7ed;
  border-right:1px solid #d7e2ec;
  color:#123c65;
  display:flex;
  flex:0 0 auto;
  font-weight:900;
  min-width:64px;
  padding:0 16px;
}

.application-field .phone-input-group input{
  border:0;
  border-radius:0;
  box-shadow:none;
  flex:1 1 auto;
  min-height:64px;
  min-width:0;
  padding-left:20px;
  padding-right:20px;
}

.application-field .phone-input-group input:focus{
  box-shadow:none;
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
  min-height:82px;
  padding:18px;
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

.resume-actions{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  margin-top:10px;
}

.resume-action-button{
  align-items:center;
  background:#fff;
  border:1px solid #d7e2ec;
  border-radius:12px;
  color:#123c65;
  display:inline-flex;
  font-weight:800;
  gap:8px;
  min-height:42px;
  padding:9px 14px;
  transition:border-color .2s ease, box-shadow .2s ease, transform .2s ease;
}

.resume-action-button:hover{
  border-color:#6fb653;
  box-shadow:0 10px 22px rgba(23,67,111,.12);
  transform:translateY(-1px);
}

.resume-action-button.danger{
  color:#b42318;
}

.apply-btn{
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

.apply-btn:hover{
  box-shadow:0 14px 28px rgba(23,67,111,.22);
  transform:translateY(-2px);
}

.apply-btn:disabled{
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

.application-success-popup{
  align-items:center;
  background:rgba(8, 29, 49, .68);
  display:flex;
  inset:0;
  justify-content:center;
  padding:20px;
  position:fixed;
  z-index:2000;
}

.application-success-dialog{
  background:#fff;
  border:1px solid rgba(111,182,83,.35);
  border-radius:24px;
  box-shadow:0 28px 80px rgba(8,29,49,.3);
  max-width:470px;
  padding:38px 32px 32px;
  position:relative;
  text-align:center;
  width:100%;
}

.application-success-icon{
  align-items:center;
  background:#eaf7e8;
  border-radius:999px;
  color:#3d8d45;
  display:flex;
  font-size:42px;
  height:82px;
  justify-content:center;
  margin:0 auto 20px;
  width:82px;
}

.application-success-dialog h2{
  color:#123c65;
  font-size:1.75rem;
  font-weight:900;
  margin:0 0 12px;
}

.application-success-dialog p{
  color:#5d7288;
  line-height:1.65;
  margin:0 0 24px;
}

.application-popup-close{
  align-items:center;
  background:#f2f6f9;
  border:0;
  border-radius:999px;
  color:#123c65;
  display:flex;
  font-size:18px;
  height:38px;
  justify-content:center;
  position:absolute;
  right:16px;
  top:16px;
  width:38px;
}

.application-popup-done{
  background:linear-gradient(135deg, #17436f, #6fb653);
  border:0;
  border-radius:13px;
  color:#fff;
  font-weight:900;
  min-height:50px;
  padding:12px 32px;
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
        <section className="application-card" aria-label="Job application form">
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
              <span>Candidate Application</span>
              <h2>Apply for a Job</h2>
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
              <p className="application-status error">
                {status}
              </p>
            )}

            <form className="application-form" onSubmit={handleSubmit}>
              <div className="application-field full">
                <label htmlFor="jobId">Applying For<span className="required-mark">*</span></label>
                <select
                  id="jobId"
                  name="jobId"
                  value={formData.jobId}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    {loadingJobs ? "Loading open roles..." : "Select an open role"}
                  </option>
                  {jobs.map((job) => (
                    <option key={job._id || job.title} value={job._id || job.title}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-grid">
                <div className="application-field">
                  <label htmlFor="fullName">Full Name<span className="required-mark">*</span></label>
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
                  <label htmlFor="email">Email Address<span className="required-mark">*</span></label>
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
                  <label htmlFor="phone">Phone Number<span className="required-mark">*</span></label>
                  <div className="phone-input-group">
                    <span className="phone-prefix">+91</span>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      inputMode="numeric"
                      pattern="\d{10}"
                      maxLength="10"
                      placeholder="10 digit mobile number"
                      value={phoneDigits}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="application-field">
                  <label htmlFor="experience">Experience</label>
                  <input
                    id="experience"
                    type="text"
                    name="experience"
                    inputMode="numeric"
                    pattern="\d{1,2}"
                    maxLength="2"
                    placeholder="Years of experience"
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="application-field full">
                <span className="resume-upload-label">Resume<span className="required-mark">*</span></span>
                <label className="resume-upload">
                  <i className="bi bi-file-earmark-arrow-up" aria-hidden="true"></i>
                  <span>
                    <strong>{formData.resumeFileName || "Upload resume file"}</strong>
                    <small>PDF, DOC, DOCX, or image files up to 4 MB</small>
                  </span>
                  <input
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={handleResumeChange}
                    ref={resumeInputRef}
                    type="file"
                  />
                </label>
                {formData.resumeFileName && (
                  <div className="resume-actions" aria-label="Resume file actions">
                    <button className="resume-action-button" onClick={handleResumeEdit} type="button">
                      <i className="bi bi-pencil-square" aria-hidden="true"></i>
                      Edit
                    </button>
                    <button className="resume-action-button danger" onClick={handleResumeDelete} type="button">
                      <i className="bi bi-trash3" aria-hidden="true"></i>
                      Delete
                    </button>
                  </div>
                )}
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

              <button className="apply-btn" disabled={submitting || (!formData.jobId && !formData.jobTitle)} type="submit">
                <i className="bi bi-send-fill" aria-hidden="true"></i>
                {submitting ? "Submitting..." : "Apply for this Job"}
              </button>
            </form>
          </section>
        </section>
      </main>

      {successMessage && (
        <div
          className="application-success-popup"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSuccessMessage("");
          }}
          role="presentation"
        >
          <section
            aria-labelledby="application-success-title"
            aria-modal="true"
            className="application-success-dialog"
            role="dialog"
          >
            <button
              aria-label="Close confirmation"
              className="application-popup-close"
              onClick={() => setSuccessMessage("")}
              ref={successCloseRef}
              type="button"
            >
              <i className="bi bi-x-lg" aria-hidden="true"></i>
            </button>
            <div className="application-success-icon">
              <i className="bi bi-check2-circle" aria-hidden="true"></i>
            </div>
            <h2 id="application-success-title">Application Submitted!</h2>
            <p>{successMessage}</p>
            <button className="application-popup-done" onClick={() => setSuccessMessage("")} type="button">
              Done
            </button>
          </section>
        </div>
      )}
    </>
  );
}

export default Register;
