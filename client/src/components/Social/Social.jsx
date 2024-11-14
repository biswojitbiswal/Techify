import React from 'react'

function Social() {
  return (
    <>
    <section>
    <h2>Follow Us on Instagram</h2>
    {/* Embed the Instagram feed widget */}
    <iframe
      src="https://snapwidget.com/embed/your-widget-id"
      frameBorder="0"
      scrolling="no"
      allowTransparency="true"
      className="w-full h-auto"
    ></iframe>
  </section>
    </>
  )
}

export default Social
