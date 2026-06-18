import { Link } from 'react-router-dom'

function FlipCard({ badge, image, title, front, back, details = [], slug, to }) {
  const target = to || (slug ? `/services/${slug}` : '/services')

  return (
    <Link className="flip-card" to={target}>
      <div className="flip-card-inner">
        <div className="flip-face flip-front">
          {image ? (
            <div className="flip-image">
              <img src={image} alt="" />
              <span>{badge}</span>
            </div>
          ) : (
            <span>{badge}</span>
          )}
          <h3>{title}</h3>
          <p>{front}</p>
        </div>
        <div className="flip-face flip-back">
          <h3>{title}</h3>
          <p>{back}</p>
          {details.length > 0 && (
            <ul className="flip-details" aria-label={`${title} details`}>
              {details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          )}
          <strong className="view-more">View {badge} details</strong>
        </div>
      </div>
    </Link>
  )
}

export default FlipCard
