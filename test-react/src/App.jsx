import React from 'react'

const depths = [
  { label: 'Base',  layer: 'layer:base',  z: 0   },
  { label: 'Modal', layer: 'layer:modal', z: 100 },
  { label: 'Top',   layer: 'layer:top',   z: 999 },
]

export default function App() {
  return (
    <div className="canvas-h:screen pad:2xl display:flex flex-dir:col gap:2xl align-yi:center align-x:center">

      <div className="display:flex flex-dir:col gap:xs align-yi:center">
        <h1 className="text:h2 ink:white type-face:sans tracking:tight">Mizumi Depth</h1>
        <p className="text:small ink:neutral-500 type-face:sans">Same white. Different depth.</p>
      </div>

      <div className="display:grid grid-cols:repeat(3,1fr) gap:xl canvas-w:min(100%,800px)">
        {depths.map(({ label, layer, z }) => (
          <div
            key={label}
            className={`${layer} pos:relative pad:xl curve:lg display:flex flex-dir:col gap:sm align-yi:center gesture-press animate-pulse`}
            style={{ zIndex: z, backgroundColor: '#ffffff' }}
          >
            <span className="text:h3 type-weight:semi ink:neutral-900">{label}</span>
            <span className="text:xs ink:neutral-500">z={z}</span>
          </div>
        ))}
      </div>

    </div>
  )
}