import { Link } from 'react-router-dom'
import logo from '../assets/images/logo.jpg'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <img src={logo} alt="Mizen Tech Solutions logo" />
          <h2>Mizen Tech Solutions</h2>
          <p>
            Empowering businesses through smart software solutions, modern
            digital products, and dependable technology support.
          </p>


        </div>

        <div>
          <h3>Company</h3>
          <Link to="/about">About Us</Link>
          <Link to="/why-us">Why Choose Us</Link>
          <Link to="/testimonials">Testimonials</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div>
          <h3>Services</h3>
          <Link to="/services/custom-software-development">Custom Software</Link>
          <Link to="/services/web-application-development">Web Applications</Link>
          <Link to="/services/mobile-app-development">Mobile Apps</Link>
          <Link to="/services/cloud-solutions">Cloud Solutions</Link>
          <Link to="/services/it-consulting-support">IT Consulting</Link>
          <Link to="/services/automation-ai-enablement">Automation & AI</Link>
        </div>

        <div>
          <h3>Contact</h3>
          <a href="mailto:Mizen@gmail.com">Mizen@gmail.com</a>
          <a href="tel:+917795811110">+91 77958 11101</a>

          <div className="footer-location">
            <i className="bi bi-geo-alt-fill" aria-hidden="true"></i>
            <p>
              <strong>Bangalore, Karnataka</strong>
              <span>India | Serving businesses worldwide</span>
            </p>
          </div>

          <div className="footer-social" aria-label="Social media links">
            <a href="https://www.linkedin.com" rel="noreferrer" target="_blank" aria-label="LinkedIn">
              <i className="bi bi-linkedin" aria-hidden="true"></i>
            </a>
            <a href="https://www.instagram.com" rel="noreferrer" target="_blank" aria-label="Instagram">
              <i className="bi bi-instagram" aria-hidden="true"></i>
            </a>
            <a href="https://www.facebook.com" rel="noreferrer" target="_blank" aria-label="Facebook">
              <i className="bi bi-facebook" aria-hidden="true"></i>
            </a>
            <a href="https://x.com" rel="noreferrer" target="_blank" aria-label="X">
              <i className="bi bi-twitter-x" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>Copyright 2026 Mizen Tech Solutions Pvt Ltd.</span>
        <span>Smart software. Clear delivery. Real growth.</span>
      </div>
    </footer>
  )
}

export default Footer
