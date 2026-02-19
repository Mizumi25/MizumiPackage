import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-neutral-50 pad-xl">
      <div className="container">
        <h1 className="heading animate-fade-in">
          🌊 Mizumi + React
        </h1>
        
        <p className="text-muted animate-fade-in delay-200" style={{marginTop:'16px'}}>
          Testing Vite plugin integration
        </p>

        <div className="flex gap-md" style={{marginTop:'32px'}}>
          <button className="btn-primary hover-lift active-press">
            Primary
          </button>
          <button className="btn-secondary hover-lift active-press">
            Secondary
          </button>
          <button className="btn-ghost hover-scale">
            Ghost
          </button>
        </div>

        <div className="grid" style={{
          marginTop:'48px',
          gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',
          gap:'16px'
        }}>
          <div className="card animate-scale-in scroll-trigger">
            <h3 className="text-h3" style={{marginBottom:'8px'}}>Card 1</h3>
            <p className="text-muted">With animations</p>
          </div>
          <div className="card animate-scale-in scroll-trigger delay-100">
            <h3 className="text-h3" style={{marginBottom:'8px'}}>Card 2</h3>
            <p className="text-muted">Staggered entrance</p>
          </div>
          <div className="card animate-scale-in scroll-trigger delay-200">
            <h3 className="text-h3" style={{marginBottom:'8px'}}>Card 3</h3>
            <p className="text-muted">Pure Mizumi classes</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
