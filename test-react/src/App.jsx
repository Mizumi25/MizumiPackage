import React from 'react'

const depths = [
  { label: 'Base',  layer: 'layer:base',  z: 0   },
  { label: 'Modal', layer: 'layer:modal', z: 100 },
  { label: 'Top',   layer: 'layer:top',   z: 999 },
]

export default function App() {
  return (
    <div className="canvas-h:screen pad:2xl display:flex flex-dir:col gap:2xl align-yi:center align-x:center">

      {/* Basic Spline-style tilt on mouse move */}
<div className="dimension card">
  <h2>Hover me</h2>
  <img className="dimension-layer" data-depth="2" src="..." />
  <span className="dimension-layer" data-depth="4">floating text</span>
</div>


    </div>
  )
}