function BackToTopButton() {
  const handleClick = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  return (
    <button
      aria-label="Back to top"
      className="back-to-top"
      onClick={handleClick}
      type="button"
    >
      <i className="bi bi-arrow-up-short" aria-hidden="true"></i>
    </button>
  )
}

export default BackToTopButton
