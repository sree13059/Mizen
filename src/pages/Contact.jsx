import PageHero from '../components/PageHero'
import { images } from '../content'

const googleFormUrl = ''

function Contact() {
  return (
    <main>
      <PageHero
        eyebrow="Contact Us"
        image={images.contact}
        title="Tell us what you want to build."
        text="Whether you need a new product, a business automation, a cloud deployment, or technical consulting, Mizen Tech Solutions can help you plan the next step."
      />

      <section className="contact-section">
        <div className="contact-panel reveal">
          <p className="eyebrow">Start a Project</p>
          <h2>Send your requirement</h2>
          <form>
            <label>
              Name
              <input type="text" placeholder="Your name" />
            </label>
            <label>
              Email
              <input type="email" placeholder="you@example.com" />
            </label>
            <label>
              Project Type
              <select defaultValue="">
                <option disabled value="">
                  Select a service
                </option>
                <option>Custom Software Development</option>
                <option>Web Application Development</option>
                <option>Mobile App Development</option>
                <option>Cloud Solutions</option>
                <option>IT Consulting & Support</option>
              </select>
            </label>
            <label>
              Message
              <textarea placeholder="Share your goals, timeline, or idea" rows="5" />
            </label>
            <button type="button">Submit Request</button>
          </form>
        </div>

        <div className="contact-info reveal delay-1">
          <article>
            <span>Mail</span>
            <a href="mailto:Mizentechsolutions@gmail.com">
              Mizentechsolutions@gmail.com
            </a>
          </article>
          <article>
            <span>Phone</span>
            <a href="tel:+919480949103">+91 94809 49103</a>
          </article>
          <article>
            <span>Location</span>
            <p>Bangalore, Karnataka</p>
          </article>
          <article>
            <span>Response</span>
            <p>We review new project requests and respond with next steps.</p>
          </article>
        </div>
      </section>

      <section className="google-form-section">
        <div className="section-heading reveal">
          <p className="eyebrow">Google Form</p>
          <h2>Submit your project details directly.</h2>
          <p>
            Use the embedded request form to share your business goals,
            preferred service, and project timeline.
          </p>
        </div>
        <div className="google-form-card reveal">
          {googleFormUrl ? (
            <iframe
              src={googleFormUrl}
              title="Mizen Tech Solutions Google Form"
            >
              Loading...
            </iframe>
          ) : (
            <div className="google-form-placeholder">
              <span>Google Form</span>
              <h3>Project Enquiry Form</h3>
              <p>
                Your Google Form embed will display here after the live form URL
                is added.
              </p>
              <a href="https://forms.google.com" rel="noreferrer" target="_blank">
                Open Google Forms
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default Contact
