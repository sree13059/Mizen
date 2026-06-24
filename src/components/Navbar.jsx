import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/images/logo.jpg'

const navItems = [
  ['Home', '/'],
  ['About Us', '/about'],
  ['Services', '/services'],
  ['Careers', '/careers'],
  ['Why Us', '/why-us'],
  ['Contact', '/contact'],
  ['Apply', '/apply'],
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const closeMenu = () => setIsOpen(false)

  return (
    <header className={`navbar ${isOpen ? 'is-open' : ''}`}>
      <div className="nav-inner">
        <Link className="brand" to="/" aria-label="Mizen Tech Solutions home" onClick={closeMenu}>
          <img src={logo} alt="Mizen Tech Solutions logo" />
        </Link>

        <button
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          className="menu-toggle"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map(([label, path]) => (
            <NavLink
              className={({ isActive }) => (isActive ? 'active' : undefined)}
              end={path === '/'}
              key={path}
              onClick={closeMenu}
              to={path}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions" aria-label="Navbar actions">
          <Link className="get-in-touch-btn primary-btn" to="/contact" onClick={closeMenu}>
            Get in touch
          </Link>
        </div>

      </div>
    </header>
  )
}

export default Navbar
