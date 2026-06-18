function TestimonialCard({ item }) {
  const rating = Number(item.rating)
  const stars = Array.from({ length: 5 }, (_, index) => {
    const value = index + 1

    if (rating >= value) {
      return 'bi-star-fill'
    }

    if (rating >= value - 0.5) {
      return 'bi-star-half'
    }

    return 'bi-star'
  })

  return (
    <article className="testimonial-card">
      <div className="testimonial-photo">
        <img src={item.photo} alt={`${item.name} profile`} />
      </div>

      <div className="testimonial-meta">
        <span>Employee Rating</span>
        <strong>{item.rating} / 5</strong>
      </div>

      <div className="testimonial-stars" aria-label={`${item.rating} out of 5 star rating`}>
        {stars.map((icon, index) => (
          <i className={`bi ${icon}`} aria-hidden="true" key={`${item.name}-star-${index}`} />
        ))}
      </div>

      <p>{item.quote}</p>
      <h3>{item.name}</h3>
      <small>{item.role}</small>
    </article>
  )
}

export default TestimonialCard
