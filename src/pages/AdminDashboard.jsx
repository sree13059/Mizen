import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { apiRequest, authStorage } from '../api'
import logo from '../assets/images/logo.jpg'

const sidebarItems = [
  ['dashboard', 'bi-grid-1x2-fill', 'Dashboard'],
  ['registers', 'bi-people-fill', 'Registers'],
  ['employees', 'bi-person-badge-fill', 'Employees'],
  ['leaves', 'bi-calendar2-check-fill', 'Leaves'],
  ['attendance', 'bi-clock-history', 'Attendance'],
  ['jobs', 'bi-briefcase-fill', 'Jobs'],
  ['applications', 'bi-file-earmark-person-fill', 'Applications'],
  ['projects', 'bi-kanban-fill', 'Projects'],
  ['company', 'bi-building-fill', 'Company Data'],
  ['departments', 'bi-diagram-3-fill', 'Departments'],
  ['services', 'bi-layers-fill', 'Services'],
  ['reports', 'bi-graph-up-arrow', 'Reports'],
  ['settings', 'bi-gear-fill', 'Settings'],
]

const emptySummary = {
  totalRegisters: 0,
  employees: 0,
  admins: 0,
  openJobs: 0,
  activeProjects: 0,
  completedProjects: 0,
  jobApplications: 0,
  pendingLeaves: 0,
  todayAttendance: 0,
}

const getErrorMessage = (error) => error?.message || 'Request failed'
const emptyServiceForm = {
  title: '',
  badge: '',
  image: '',
  front: '',
  back: '',
  details: '',
  status: 'active',
  order: 0,
}

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : 'Not added')
const formatTime = (value) => (value ? new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending')

function AdminDashboard() {
  const navigate = useNavigate()
  const storedUser = authStorage.getUser()
  const isAdmin = authStorage.getToken() && (storedUser?.role === 'admin' || localStorage.getItem('mizenRole') === 'admin')

  const [activeView, setActiveView] = useState('dashboard')
  const [adminUser, setAdminUser] = useState(storedUser)
  const [summary, setSummary] = useState(emptySummary)
  const [registers, setRegisters] = useState([])
  const [employees, setEmployees] = useState([])
  const [jobs, setJobs] = useState([])
  const [applications, setApplications] = useState([])
  const [leaves, setLeaves] = useState([])
  const [attendance, setAttendance] = useState([])
  const [projects, setProjects] = useState([])
  const [departments, setDepartments] = useState([])
  const [services, setServices] = useState([])
  const [company, setCompany] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(Boolean(isAdmin))
  const [savingProfilePhoto, setSavingProfilePhoto] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [error, setError] = useState('')
  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full Time',
    salary: '',
    experience: '',
    skills: '',
    openings: 1,
    description: '',
    applicationEmail: 'Mizentechsolutions@gmail.com',
  })
  const [projectForm, setProjectForm] = useState({
    name: '',
    client: '',
    status: 'active',
    progress: 0,
    budget: '',
    deadline: '',
    description: '',
  })
  const [companyForm, setCompanyForm] = useState({
    name: 'Mizen Tech Solutions',
    email: 'Mizentechsolutions@gmail.com',
    phone: '+91 94809 49103',
    address: '',
    website: '',
    industry: 'Technology Services',
    description: '',
  })
  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    description: '',
  })
  const [serviceForm, setServiceForm] = useState(emptyServiceForm)
  const [editingServiceId, setEditingServiceId] = useState('')

  const fetchAdminData = async () => {
    const requests = [
      ['summary', 'Summary', apiRequest('/admin/summary')],
      ['registers', 'Registers', apiRequest('/admin/users')],
      ['employees', 'Employees', apiRequest('/admin/employees')],
      ['jobs', 'Jobs', apiRequest('/admin/jobs')],
      ['applications', 'Applications', apiRequest('/admin/applications')],
      ['leaves', 'Leaves', apiRequest('/admin/leaves')],
      ['attendance', 'Attendance', apiRequest('/admin/attendance')],
      ['projects', 'Projects', apiRequest('/admin/projects')],
      ['departments', 'Departments', apiRequest('/admin/departments')],
      ['services', 'Services', apiRequest('/admin/services')],
      ['company', 'Company', apiRequest('/admin/company')],
    ]

    const results = await Promise.allSettled(requests.map(([, , request]) => request))
    const failed = []
    const data = {
      summary: emptySummary,
      registers: [],
      employees: [],
      jobs: [],
      applications: [],
      leaves: [],
      attendance: [],
      projects: [],
      departments: [],
      services: [],
      company: null,
      error: '',
    }

    results.forEach((result, index) => {
      const [key, label] = requests[index]

      if (result.status === 'rejected') {
        failed.push(`${label}: ${getErrorMessage(result.reason)}`)
        return
      }

      const value = result.value

      if (key === 'summary') data.summary = value.summary || emptySummary
      if (key === 'registers') data.registers = value.users || []
      if (key === 'employees') data.employees = value.employees || []
      if (key === 'jobs') data.jobs = value.jobs || []
      if (key === 'applications') data.applications = value.applications || []
      if (key === 'leaves') data.leaves = value.leaves || []
      if (key === 'attendance') data.attendance = value.attendance || []
      if (key === 'projects') data.projects = value.projects || []
      if (key === 'departments') data.departments = value.departments || []
      if (key === 'services') data.services = value.services || []
      if (key === 'company') data.company = value.company || null
    })

    if (failed.length === requests.length) {
      throw new Error(failed[0] || 'Failed to load admin dashboard')
    }

    data.error = failed.length ? `Some dashboard data could not load. ${failed.join('; ')}` : ''
    return data
  }

  const applyAdminData = (data) => {
    setSummary(data.summary)
    setRegisters(data.registers)
    setEmployees(data.employees)
    setJobs(data.jobs)
    setApplications(data.applications)
    setLeaves(data.leaves)
    setAttendance(data.attendance)
    setProjects(data.projects)
    setDepartments(data.departments)
    setServices(data.services)
    setCompany(data.company)
    if (data.company) {
      setCompanyForm({
        name: data.company.name || '',
        email: data.company.email || '',
        phone: data.company.phone || '',
        address: data.company.address || '',
        website: data.company.website || '',
        industry: data.company.industry || '',
        description: data.company.description || '',
      })
    }
  }

  const loadAdminData = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await fetchAdminData()
      applyAdminData(data)
      setError(data.error)
    } catch (err) {
      setError(err.message || 'Failed to load admin dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isAdmin) return undefined

    let isActive = true

    fetchAdminData()
      .then((data) => {
        if (isActive) {
          applyAdminData(data)
          setError(data.error)
        }
      })
      .catch((err) => {
        if (isActive) {
          setError(err.message || 'Failed to load admin dashboard')
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false)
        }
      })

    return () => {
      isActive = false
    }
  }, [isAdmin])

  const filteredRegisters = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return registers

    return registers.filter((item) =>
      [item.fullName, item.email, item.phone, item.role, item.department, item.designation, item.employeeId]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    )
  }, [registers, search])

  const registerDepartmentCounts = useMemo(() => {
    const counts = registers.reduce((acc, item) => {
      const department = item.department || item.industry || 'Unassigned'
      acc[department] = (acc[department] || 0) + 1
      return acc
    }, {})

    return counts
  }, [registers])

  const handleLogout = () => {
    authStorage.clearSession()
    navigate('/login')
  }

  const handleJobChange = (event) => {
    setJobForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleProjectChange = (event) => {
    setProjectForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleCompanyChange = (event) => {
    setCompanyForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleDepartmentChange = (event) => {
    setDepartmentForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleServiceChange = (event) => {
    setServiceForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  const handleProfilePhotoSelect = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      setSavingProfilePhoto(true)
      setError('')
      const profilePhoto = await readFileAsDataUrl(file)
      const data = await apiRequest('/auth/me', {
        method: 'PUT',
        body: JSON.stringify({ profilePhoto }),
      })
      setAdminUser(data.user)
      authStorage.setSession(authStorage.getToken(), data.user)
      setProfileMenuOpen(false)
    } catch (err) {
      setError(err.message || 'Failed to update profile photo')
    } finally {
      setSavingProfilePhoto(false)
    }
  }

  const handleApplicationStatus = async (applicationId, status) => {
    try {
      setError('')
      await apiRequest(`/admin/applications/${applicationId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      })
      await loadAdminData()
    } catch (err) {
      setError(err.message || 'Failed to update application')
    }
  }

  const handleLeaveStatus = async (leaveId, status) => {
    try {
      setError('')
      await apiRequest(`/admin/leaves/${leaveId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      })
      await loadAdminData()
    } catch (err) {
      setError(err.message || 'Failed to update leave request')
    }
  }

  const handleCreateDepartment = async (event) => {
    event.preventDefault()

    try {
      setError('')
      await apiRequest('/admin/departments', {
        method: 'POST',
        body: JSON.stringify(departmentForm),
      })
      setDepartmentForm({ name: '', description: '' })
      await loadAdminData()
    } catch (err) {
      setError(err.message || 'Failed to create department')
    }
  }

  const handleDeleteDepartment = async (departmentId) => {
    if (String(departmentId).startsWith('derived-')) return

    try {
      setError('')
      await apiRequest(`/admin/departments/${departmentId}`, {
        method: 'DELETE',
      })
      await loadAdminData()
    } catch (err) {
      setError(err.message || 'Failed to delete department')
    }
  }

  const handleEditService = (service) => {
    setEditingServiceId(service._id)
    setServiceForm({
      title: service.title || '',
      badge: service.badge || '',
      image: service.image || '',
      front: service.front || '',
      back: service.back || '',
      details: (service.details || []).join(', '),
      status: service.status || 'active',
      order: service.order || 0,
    })
    setActiveView('services')
  }

  const handleCancelServiceEdit = () => {
    setEditingServiceId('')
    setServiceForm(emptyServiceForm)
  }

  const handleSaveService = async (event) => {
    event.preventDefault()

    try {
      setError('')
      await apiRequest(editingServiceId ? `/admin/services/${editingServiceId}` : '/admin/services', {
        method: editingServiceId ? 'PUT' : 'POST',
        body: JSON.stringify({
          ...serviceForm,
          order: Number(serviceForm.order) || 0,
        }),
      })
      handleCancelServiceEdit()
      await loadAdminData()
    } catch (err) {
      setError(err.message || 'Failed to save service')
    }
  }

  const handleDeleteService = async (serviceId) => {
    try {
      setError('')
      await apiRequest(`/admin/services/${serviceId}`, {
        method: 'DELETE',
      })
      if (editingServiceId === serviceId) {
        handleCancelServiceEdit()
      }
      await loadAdminData()
    } catch (err) {
      setError(err.message || 'Failed to delete service')
    }
  }

  const handleCreateJob = async (event) => {
    event.preventDefault()

    try {
      setError('')
      await apiRequest('/admin/jobs', {
        method: 'POST',
        body: JSON.stringify({
          ...jobForm,
          openings: Number(jobForm.openings) || 1,
        }),
      })
      setJobForm({
        title: '',
        department: '',
          location: '',
          type: 'Full Time',
          salary: '',
          experience: '',
          skills: '',
          openings: 1,
          description: '',
          applicationEmail: 'Mizentechsolutions@gmail.com',
        })
      await loadAdminData()
      setActiveView('jobs')
    } catch (err) {
      setError(err.message || 'Failed to create job')
    }
  }

  const handleCreateProject = async (event) => {
    event.preventDefault()

    try {
      setError('')
      await apiRequest('/admin/projects', {
        method: 'POST',
        body: JSON.stringify({
          ...projectForm,
          progress: Number(projectForm.progress) || 0,
        }),
      })
      setProjectForm({
        name: '',
        client: '',
        status: 'active',
        progress: 0,
        budget: '',
        deadline: '',
        description: '',
      })
      await loadAdminData()
      setActiveView('projects')
    } catch (err) {
      setError(err.message || 'Failed to create project')
    }
  }

  const handleUpdateCompany = async (event) => {
    event.preventDefault()

    try {
      setError('')
      const data = await apiRequest('/admin/company', {
        method: 'PUT',
        body: JSON.stringify(companyForm),
      })
      setCompany(data.company)
    } catch (err) {
      setError(err.message || 'Failed to update company data')
    }
  }

  if (!isAdmin) {
    return (
      <main className="admin-locked">
        <section>
          <p className="eyebrow">Protected</p>
          <h1>Admin access required</h1>
          <p>Please login with admin credentials to open the dashboard.</p>
          <Link className="primary-btn" to="/login">
            Go to Login
          </Link>
        </section>
      </main>
    )
  }

  const stats = [
    ['Total Registers', summary.totalRegisters, loading ? 'Loading current data' : 'All registered accounts'],
    ['Employees', summary.employees, 'Employee registrations'],
    ['Admins', summary.admins, 'Admin accounts'],
    ['Pending Leaves', summary.pendingLeaves ?? leaves.filter((leave) => leave.status === 'pending').length, 'Employee leave requests'],
    ['Today Attendance', summary.todayAttendance ?? attendance.length, 'Attendance records today'],
    ['Open Jobs', summary.openJobs, 'Active job postings'],
    ['Applications', summary.jobApplications || applications.length, 'Career form submissions'],
    ['Active Projects', summary.activeProjects, 'Planning, active, or review'],
    ['Completed Projects', summary.completedProjects, 'Delivered projects'],
  ]

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" to="/">
          <img src={logo} alt="Mizen Tech Solutions logo" />
          <span>
            <strong>Mizen</strong>
            <small>Admin Panel</small>
          </span>
        </Link>

        <nav className="admin-nav" aria-label="Admin navigation">
          {sidebarItems.map(([id, icon, label]) => (
            <button
              className={activeView === id ? 'active' : undefined}
              key={id}
              onClick={() => setActiveView(id)}
              type="button"
            >
              <i className={`bi ${icon}`} aria-hidden="true"></i>
              <span>{label}</span>
            </button>
          ))}
        </nav>

      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">{activeView}</p>
            <h1>Admin Dashboard</h1>
          </div>
          <div className="dashboard-top-actions">
            <div className="admin-search">
              <i className="bi bi-search" aria-hidden="true"></i>
              <input
                type="search"
                placeholder="Search registers"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="dashboard-profile-menu">
              <button
                className="dashboard-avatar-button"
                type="button"
                aria-expanded={profileMenuOpen}
                onClick={() => setProfileMenuOpen((current) => !current)}
              >
                {adminUser?.profilePhoto ? (
                  <img src={adminUser.profilePhoto} alt="" />
                ) : (
                  <span>{(adminUser?.fullName || 'A').slice(0, 1).toUpperCase()}</span>
                )}
                <i className="bi bi-chevron-down" aria-hidden="true"></i>
              </button>
              {profileMenuOpen && (
                <div className="dashboard-profile-dropdown">
                  <div className="dropdown-profile-head">
                    <div className="dropdown-avatar">
                      {adminUser?.profilePhoto ? (
                        <img src={adminUser.profilePhoto} alt="" />
                      ) : (
                        <span>{(adminUser?.fullName || 'A').slice(0, 1).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <strong>{adminUser?.fullName || 'Admin'}</strong>
                      <span>{adminUser?.email || 'admin@mizentech.com'}</span>
                    </div>
                  </div>
                  <button
                    className="dropdown-command"
                    onClick={() => {
                      setActiveView('settings')
                      setProfileMenuOpen(false)
                    }}
                    type="button"
                  >
                    <i className="bi bi-pencil-square" aria-hidden="true"></i>
                    Edit Profile
                  </button>
                  <div className="dropdown-upload-group">
                    <span>Edit photo</span>
                    <div className="profile-photo-actions" aria-label="Profile photo options">
                      <label title="Camera">
                        <i className="bi bi-camera-fill" aria-hidden="true"></i>
                        <input accept="image/*" capture="environment" type="file" onChange={handleProfilePhotoSelect} />
                      </label>
                      <label title="Gallery">
                        <i className="bi bi-images" aria-hidden="true"></i>
                        <input accept="image/*" type="file" onChange={handleProfilePhotoSelect} />
                      </label>
                      <label title="Files">
                        <i className="bi bi-folder2-open" aria-hidden="true"></i>
                        <input type="file" onChange={handleProfilePhotoSelect} />
                      </label>
                    </div>
                  </div>
                  <button className="dropdown-command danger" onClick={handleLogout} type="button">
                    <i className="bi bi-box-arrow-right" aria-hidden="true"></i>
                    Logout
                  </button>
                  {savingProfilePhoto && <small>Uploading photo...</small>}
                </div>
              )}
            </div>
          </div>
        </header>

        {error && <p className="admin-error">{error}</p>}

        {activeView === 'dashboard' && (
          <>
            <div className="admin-stat-grid">
              {stats.map(([label, value, detail]) => (
                <article className="admin-stat-card" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                  <p>{detail}</p>
                </article>
              ))}
            </div>

            <section className="admin-content-grid">
              <article className="admin-panel wide">
                <div className="panel-heading">
                  <h2>Current Registers</h2>
                  <span>{filteredRegisters.length} Records</span>
                </div>
                <div className="register-list compact">
                  {filteredRegisters.slice(0, 6).map((user) => (
                    <div className="register-row" key={user._id}>
                      <b>{user.fullName}</b>
                      <span>{user.email}</span>
                      <em>{user.role}</em>
                    </div>
                  ))}
                </div>
              </article>

              <article className="admin-panel">
                <div className="panel-heading">
                  <h2>Quick Actions</h2>
                </div>
                <div className="quick-actions">
                  <button onClick={() => setActiveView('jobs')} type="button">
                    <i className="bi bi-plus-circle-fill" aria-hidden="true"></i>
                    Add Job
                  </button>
                  <button onClick={() => setActiveView('applications')} type="button">
                    <i className="bi bi-file-earmark-person-fill" aria-hidden="true"></i>
                    View Applications
                  </button>
                  <button onClick={() => setActiveView('leaves')} type="button">
                    <i className="bi bi-calendar2-check-fill" aria-hidden="true"></i>
                    Review Leaves
                  </button>
                  <button onClick={() => setActiveView('attendance')} type="button">
                    <i className="bi bi-clock-history" aria-hidden="true"></i>
                    Attendance
                  </button>
                  <button onClick={() => setActiveView('projects')} type="button">
                    <i className="bi bi-kanban-fill" aria-hidden="true"></i>
                    Add Project
                  </button>
                  <button onClick={() => setActiveView('services')} type="button">
                    <i className="bi bi-layers-fill" aria-hidden="true"></i>
                    Manage Services
                  </button>
                  <button onClick={() => setActiveView('registers')} type="button">
                    <i className="bi bi-person-lines-fill" aria-hidden="true"></i>
                    View Registers
                  </button>
                  <button onClick={loadAdminData} type="button">
                    <i className="bi bi-arrow-clockwise" aria-hidden="true"></i>
                    Refresh Data
                  </button>
                </div>
              </article>
            </section>
          </>
        )}

        {activeView === 'registers' && (
          <article className="admin-panel">
            <div className="panel-heading">
              <h2>Current Registers Data</h2>
              <span>{filteredRegisters.length} Users</span>
            </div>
            <div className="register-table">
              <div className="register-table-head">
                <span>Name</span>
                <span>Role</span>
                <span>Contact</span>
                <span>Department</span>
                <span>Joined</span>
              </div>
              {filteredRegisters.map((user) => (
                <div className="register-table-row" key={user._id}>
                  <strong>{user.fullName}</strong>
                  <span>{user.role}</span>
                  <span>{user.email || user.phone}</span>
                  <span>{user.department || user.industry || 'Unassigned'}</span>
                  <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'New'}</span>
                </div>
              ))}
            </div>
          </article>
        )}

        {activeView === 'employees' && (
          <article className="admin-panel">
            <div className="panel-heading">
              <h2>Employees</h2>
              <span>{employees.length} Team Members</span>
            </div>
            <div className="employee-admin-grid">
              {employees.map((employee) => (
                <article className="employee-admin-card" key={employee._id}>
                  <div className="employee-admin-avatar">
                    {employee.profilePhoto ? (
                      <img src={employee.profilePhoto} alt="" />
                    ) : (
                      (employee.fullName || 'E').slice(0, 1).toUpperCase()
                    )}
                  </div>
                  <div>
                    <strong>{employee.fullName}</strong>
                    <span>{employee.designation || 'Team Member'}</span>
                    <p>{employee.department || 'Unassigned'} · {employee.email}</p>
                  </div>
                  <em>{employee.employeeId || 'No ID'}</em>
                </article>
              ))}
            </div>
          </article>
        )}

        {activeView === 'leaves' && (
          <article className="admin-panel">
            <div className="panel-heading">
              <h2>Employee Leaves</h2>
              <span>{leaves.length} Requests</span>
            </div>
            <div className="leave-admin-list">
              {leaves.map((leave) => (
                <div className="leave-admin-card" key={leave._id}>
                  <i className="bi bi-calendar-event-fill" aria-hidden="true"></i>
                  <div>
                    <strong>{leave.employee?.fullName || 'Employee'}</strong>
                    <span>{leave.employee?.department || 'Unassigned'} | {leave.employee?.employeeId || 'No ID'}</span>
                    <p>{leave.type} leave from {formatDate(leave.fromDate)} to {formatDate(leave.toDate)}</p>
                    {leave.reason && <small>{leave.reason}</small>}
                  </div>
                  <select value={leave.status} onChange={(event) => handleLeaveStatus(leave._id, event.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              ))}
              {!leaves.length && <p className="empty-state">Employee leave requests will appear here.</p>}
            </div>
          </article>
        )}

        {activeView === 'attendance' && (
          <article className="admin-panel">
            <div className="panel-heading">
              <h2>Employee Attendance</h2>
              <span>{attendance.length} Records</span>
            </div>
            <div className="attendance-list admin-attendance-list">
              {attendance.map((entry) => (
                <div className="attendance-row" key={entry._id}>
                  <div>
                    <strong>{entry.employee?.fullName || 'Employee'}</strong>
                    <span>{entry.employee?.department || 'Unassigned'} | {formatDate(entry.loginAt)}</span>
                  </div>
                  <div>
                    <strong>{formatTime(entry.loginAt)}</strong>
                    <span>Login</span>
                  </div>
                  <div>
                    <strong>{formatTime(entry.logoutAt)}</strong>
                    <span>Logout</span>
                  </div>
                  <b>{entry.status}</b>
                </div>
              ))}
              {!attendance.length && <p className="empty-state">Employee attendance records will appear here.</p>}
            </div>
          </article>
        )}

        {activeView === 'jobs' && (
          <section className="admin-content-grid">
            <article className="admin-panel">
              <div className="panel-heading">
                <h2>Create Job</h2>
                <span>Admin</span>
              </div>
              <form className="job-form" onSubmit={handleCreateJob}>
                <input name="title" placeholder="Job title" value={jobForm.title} onChange={handleJobChange} required />
                <input name="department" placeholder="Department" value={jobForm.department} onChange={handleJobChange} required />
                <input name="location" placeholder="Location" value={jobForm.location} onChange={handleJobChange} />
                <select name="type" value={jobForm.type} onChange={handleJobChange}>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Internship</option>
                  <option>Contract</option>
                </select>
                <input name="salary" placeholder="Salary package, e.g. 4 LPA - 8 LPA" value={jobForm.salary} onChange={handleJobChange} />
                <input name="experience" placeholder="Experience, e.g. 2+ years" value={jobForm.experience} onChange={handleJobChange} />
                <input name="skills" placeholder="Skills, e.g. React, Node, MongoDB" value={jobForm.skills} onChange={handleJobChange} />
                <input name="openings" min="1" type="number" value={jobForm.openings} onChange={handleJobChange} />
                <input name="applicationEmail" placeholder="Application email" value={jobForm.applicationEmail} onChange={handleJobChange} />
                <textarea name="description" placeholder="Short description" value={jobForm.description} onChange={handleJobChange}></textarea>
                <button className="primary-btn" type="submit">Publish Job</button>
              </form>
            </article>

            <article className="admin-panel">
              <div className="panel-heading">
                <h2>Jobs</h2>
                <span>{jobs.length} Total</span>
              </div>
              <div className="job-list">
                {jobs.map((job) => (
                  <div className="job-row" key={job._id}>
                    <i className="bi bi-briefcase-fill" aria-hidden="true"></i>
                    <div>
                      <strong>{job.title}</strong>
                      <span>{job.department} · {job.location || 'Remote'} · {job.type}</span>
                      <small>{job.experience || 'Experience open'} · {job.salary || 'Salary not listed'}</small>
                    </div>
                    <em>{job.status}</em>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {activeView === 'applications' && (
          <article className="admin-panel">
            <div className="panel-heading">
              <h2>Job Applications</h2>
              <span>{applications.length} Submitted</span>
            </div>
            <div className="application-list">
              {applications.map((application) => (
                <div className="application-card" key={application._id}>
                  <div>
                    <strong>{application.fullName}</strong>
                    <span>{application.jobTitle}</span>
                    <p>{application.email} | {application.phone}</p>
                    {application.coverLetter && <small>{application.coverLetter}</small>}
                  </div>
                  <div className="application-meta">
                    <b>{application.experience || 'Experience not added'}</b>
                    {application.resumeFile && (
                      <a href={application.resumeFile} download={application.resumeFileName || 'resume'}>
                        Resume
                      </a>
                    )}
                    {application.portfolio && (
                      <a href={application.portfolio} rel="noreferrer" target="_blank">
                        Portfolio
                      </a>
                    )}
                  </div>
                  <select
                    value={application.status}
                    onChange={(event) => handleApplicationStatus(application._id, event.target.value)}
                  >
                    <option value="new">New</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              ))}
              {!applications.length && <p className="empty-state">Applications from the Careers page will appear here.</p>}
            </div>
          </article>
        )}

        {activeView === 'projects' && (
          <section className="admin-content-grid">
            <article className="admin-panel">
              <div className="panel-heading">
                <h2>Create Project</h2>
                <span>Company</span>
              </div>
              <form className="job-form" onSubmit={handleCreateProject}>
                <input name="name" placeholder="Project name" value={projectForm.name} onChange={handleProjectChange} required />
                <input name="client" placeholder="Client or owner" value={projectForm.client} onChange={handleProjectChange} />
                <select name="status" value={projectForm.status} onChange={handleProjectChange}>
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                  <option value="on hold">On Hold</option>
                </select>
                <input name="progress" min="0" max="100" type="number" placeholder="Progress %" value={projectForm.progress} onChange={handleProjectChange} />
                <input name="budget" placeholder="Budget" value={projectForm.budget} onChange={handleProjectChange} />
                <input name="deadline" placeholder="Deadline" value={projectForm.deadline} onChange={handleProjectChange} />
                <textarea name="description" placeholder="Project notes" value={projectForm.description} onChange={handleProjectChange}></textarea>
                <button className="primary-btn" type="submit">Save Project</button>
              </form>
            </article>

            <article className="admin-panel">
              <div className="panel-heading">
                <h2>Projects</h2>
                <span>{projects.length} Total</span>
              </div>
              <div className="project-list">
                {projects.map((project) => (
                  <div className="project-row" key={project._id}>
                    <div>
                      <strong>{project.name}</strong>
                      <span>{project.client || 'Internal'} · {project.status}</span>
                    </div>
                    <div className="project-progress">
                      <i style={{ width: `${project.progress || 0}%` }}></i>
                    </div>
                    <b>{project.progress || 0}%</b>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {activeView === 'company' && (
          <section className="admin-content-grid">
            <article className="admin-panel">
              <div className="panel-heading">
                <h2>Company Data</h2>
                <span>Editable</span>
              </div>
              <form className="job-form" onSubmit={handleUpdateCompany}>
                <input name="name" placeholder="Company name" value={companyForm.name} onChange={handleCompanyChange} />
                <input name="email" placeholder="Company email" value={companyForm.email} onChange={handleCompanyChange} />
                <input name="phone" placeholder="Phone" value={companyForm.phone} onChange={handleCompanyChange} />
                <input name="website" placeholder="Website" value={companyForm.website} onChange={handleCompanyChange} />
                <input name="industry" placeholder="Industry" value={companyForm.industry} onChange={handleCompanyChange} />
                <textarea name="address" placeholder="Address" value={companyForm.address} onChange={handleCompanyChange}></textarea>
                <textarea name="description" placeholder="Company description" value={companyForm.description} onChange={handleCompanyChange}></textarea>
                <button className="primary-btn" type="submit">Update Company</button>
              </form>
            </article>

            <article className="admin-panel company-preview">
              <div className="panel-heading">
                <h2>Preview</h2>
                <span>Live</span>
              </div>
              <i className="bi bi-building-fill" aria-hidden="true"></i>
              <h3>{company?.name || companyForm.name}</h3>
              <p>{company?.description || companyForm.description || 'Add company details to show here.'}</p>
              <div>
                <span>{company?.email || companyForm.email}</span>
                <span>{company?.phone || companyForm.phone || '+91 94809 49103'}</span>
                <span>{company?.industry || companyForm.industry}</span>
              </div>
            </article>
          </section>
        )}

        {activeView === 'departments' && (
          <section className="admin-content-grid">
            <article className="admin-panel">
              <div className="panel-heading">
                <h2>Add Department</h2>
                <span>Admin</span>
              </div>
              <form className="job-form" onSubmit={handleCreateDepartment}>
                <input name="name" placeholder="Department name, e.g. Accountant, Sales" value={departmentForm.name} onChange={handleDepartmentChange} required />
                <textarea name="description" placeholder="Department notes" value={departmentForm.description} onChange={handleDepartmentChange}></textarea>
                <button className="primary-btn" type="submit">Add Department</button>
              </form>
            </article>

            <article className="admin-panel">
              <div className="panel-heading">
                <h2>Departments</h2>
                <span>{departments.length} Groups</span>
              </div>
              <div className="department-grid compact-departments">
                {departments.map((department) => (
                  <div className="department-card" key={department._id || department.name}>
                    <i className="bi bi-diagram-3-fill" aria-hidden="true"></i>
                    <strong>{department.name}</strong>
                    <span>{department.employeeCount ?? registerDepartmentCounts[department.name] ?? 0} registered</span>
                    {department.description && <p>{department.description}</p>}
                    {!department.derived && (
                      <button onClick={() => handleDeleteDepartment(department._id)} type="button">
                        <i className="bi bi-trash3" aria-hidden="true"></i>
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {activeView === 'services' && (
          <section className="admin-content-grid">
            <article className="admin-panel">
              <div className="panel-heading">
                <h2>{editingServiceId ? 'Edit Service' : 'Add Service'}</h2>
                <span>{editingServiceId ? 'Editing' : 'Home Page'}</span>
              </div>
              <form className="job-form service-form" onSubmit={handleSaveService}>
                <input name="title" placeholder="Service title" value={serviceForm.title} onChange={handleServiceChange} required />
                <input name="badge" placeholder="Badge" value={serviceForm.badge} onChange={handleServiceChange} />
                <input name="image" placeholder="Image URL" value={serviceForm.image} onChange={handleServiceChange} />
                <input name="order" type="number" placeholder="Display order" value={serviceForm.order} onChange={handleServiceChange} />
                <select name="status" value={serviceForm.status} onChange={handleServiceChange}>
                  <option value="active">Active</option>
                  <option value="hidden">Hidden</option>
                </select>
                <textarea name="front" placeholder="Front card text" value={serviceForm.front} onChange={handleServiceChange}></textarea>
                <textarea name="back" placeholder="Back card text" value={serviceForm.back} onChange={handleServiceChange}></textarea>
                <textarea name="details" placeholder="Details, comma separated" value={serviceForm.details} onChange={handleServiceChange}></textarea>
                <button className="primary-btn" type="submit">{editingServiceId ? 'Update Service' : 'Create Service'}</button>
                {editingServiceId && (
                  <button className="secondary-btn" onClick={handleCancelServiceEdit} type="button">
                    Cancel Edit
                  </button>
                )}
              </form>
            </article>

            <article className="admin-panel">
              <div className="panel-heading">
                <h2>Popular Services</h2>
                <span>{services.length} Total</span>
              </div>
              <div className="service-admin-list">
                {services.map((service) => (
                  <div className="service-admin-card" key={service._id}>
                    {service.image && <img src={service.image} alt="" />}
                    <div>
                      <strong>{service.title}</strong>
                      <span>{service.badge} | {service.status}</span>
                      <p>{service.front}</p>
                    </div>
                    <div className="admin-row-actions">
                      <button onClick={() => handleEditService(service)} type="button">
                        <i className="bi bi-pencil-square" aria-hidden="true"></i>
                      </button>
                      <button onClick={() => handleDeleteService(service._id)} type="button">
                        <i className="bi bi-trash3" aria-hidden="true"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}

        {['reports', 'settings'].includes(activeView) && (
          <article className="admin-panel">
            <div className="panel-heading">
              <h2>{activeView === 'reports' ? 'Reports' : 'Settings'}</h2>
              <span>Connected</span>
            </div>
            <p className="empty-state">
              {activeView === 'reports'
                ? `Registers: ${summary.totalRegisters}, Employees: ${summary.employees}, Open jobs: ${summary.openJobs}.`
                : 'Profile, permissions, and company settings are ready for your next admin controls.'}
            </p>
          </article>
        )}
      </section>
    </main>
  )
}

export default AdminDashboard
