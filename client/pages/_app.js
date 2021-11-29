import 'bootstrap/dist/css/bootstrap.css'

import React from 'react'
//This is way for importing global styles
function _app({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default _app
