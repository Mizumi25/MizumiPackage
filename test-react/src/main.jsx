import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../.mizumi/mizumi.css'
import './main.css'

// Make gsap global so mizumi-runtime can find it
window.gsap = gsap
window.ScrollTrigger = ScrollTrigger

import('../.mizumi/mizumi-runtime.js')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)