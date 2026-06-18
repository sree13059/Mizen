import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import logo from '../assets/images/logo.jpg'


const sidebarItems = [
  ['bi-grid-1x2-fill', 'Dashboard'],
  ['bi-people-fill', 'Users'],
  ['bi-briefcase-fill', 'Projects'],
  ['bi-chat-dots-fill', 'Messages'],
  ['bi-graph-up-arrow', 'Reports'],
  ['bi-gear-fill', 'Settings'],
]

const stats = [
  ['Active Projects', '18', '+4 this month'],
  ['New Enquiries', '42', '12 pending review'],
  ['Team Members', '26', '8 departments'],
  ['Delivery Score', '96%', 'Strong progress'],
]

function AdminDashboard() {
  const navigate = useNavigate()
  const isLoggedIn = localStorage.getItem('mizenAdminLoggedIn') === 'true'

  // Loaded from backend for admin dashboard
  const [users, setUsers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [usersError, setUsersError] = useState('')

  useEffect(() => {
    if (!isLoggedIn) return


    const fetchUsers = async () => {
      try {
        setLoadingUsers(true)
        setUsersError('')

        const res = await fetch('http://localhost:5000/api/admin/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        })

        const data = await res.json()

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to load users')
        }

        setUsers(data.users || [])
      } catch (err) {
        setUsersError(err.message || 'Failed to load users')
      } finally {
        setLoadingUsers(false)
      }
    }

    fetchUsers()
  }, [isLoggedIn])



  const handleLogout = () => {
    localStorage.removeItem('mizenAdminLoggedIn')
    navigate('/login')
  }

  if (!isLoggedIn) {
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
          {sidebarItems.map(([icon, label], index) => (
            <button className={index === 0 ? 'active' : undefined} key={label} type="button">
              <i className={`bi ${icon}`} aria-hidden="true"></i>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-profile">
          <div>
            <strong>Admin</strong>
            <span>admin@mizentech.com</span>
          </div>
          <button onClick={handleLogout} type="button">
            <i className="bi bi-box-arrow-right" aria-hidden="true"></i>
            Logout
          </button>
        </div>
      </aside>

      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">Overview</p>
            <h1>Admin Dashboard</h1>
          </div>
          <div className="admin-search">
            <i className="bi bi-search" aria-hidden="true"></i>
            <input type="search" placeholder="Search dashboard" />
          </div>
        </header>

        <div className="admin-stat-grid">
          {stats.map(([label, value, detail]) => (
            <article className="admin-stat-card" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <p>{detail}</p>
            </article>
          ))}

          <article className="admin-stat-card" key="RegisteredUsers">
            <span>Registered Users</span>
            <strong>{users.length}</strong>
            <p>{loadingUsers ? 'Loading...' : usersError ? usersError : 'Total accounts in system'}</p>
          </article>
        </div>


        <section className="admin-content-grid">
          <article className="admin-panel wide">
            <div className="panel-heading">
              <h2>Project Pipeline</h2>
              <span>Live</span>
            </div>
            <div className="pipeline-list">
              {['Website Redesign', 'Cloud Migration', 'CRM Automation'].map((item, index) => (
                <div className="pipeline-row" key={item}>
                  <span>{item}</span>
                  <div>
                    <i style={{ width: `${72 + index * 8}%` }}></i>
                  </div>
                  <strong>{72 + index * 8}%</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="admin-panel">
            <div className="panel-heading">
              <h2>Quick Actions</h2>
            </div>
            <div className="quick-actions">
              <button type="button">
                <i className="bi bi-plus-circle-fill" aria-hidden="true"></i>
                Add Project
              </button>
              <button type="button">
                <i className="bi bi-person-plus-fill" aria-hidden="true"></i>
                Invite User
              </button>
              <button type="button">
                <i className="bi bi-file-earmark-text-fill" aria-hidden="true"></i>
                New Report
              </button>
            </div>
          </article>
        </section>
      </section>
    </main>
  )
}

export default AdminDashboard
