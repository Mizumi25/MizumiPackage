import React from 'react'

function App() {
  return (
    <div style={{fontFamily: 'sans-serif', background: '#F9FAFB', minHeight: '100vh'}}>
      
      {/* Entrance animation */}
      <div className="card animate-fade-in" style={{margin: '40px auto', maxWidth: '400px'}}>
        <h2 className="text-h2">Fade In Card</h2>
        <p>Using: card + animate-fade-in</p>
      </div>

      {/* Hover animation */}
      <div className="card hover-lift active-press" style={{margin: '20px auto', maxWidth: '400px', cursor: 'pointer'}}>
        <h2 className="text-h2">Hover Me!</h2>
        <p>Using: card + hover-lift + active-press</p>
      </div>

      {/* With modifiers */}
      <div className="card animate-slide-up duration-1000 ease-bouncy" style={{margin: '20px auto', maxWidth: '400px'}}>
        <h2 className="text-h2">Bouncy Slide Up</h2>
        <p>Using: animate-slide-up + duration-1000 + ease-bouncy</p>
      </div>

      {/* Data attribute override */}
      <div 
        className="card animate-scale-in"
        data-gsap-duration="2000"
        data-gsap-ease="elastic.out(1, 0.3)"
        style={{margin: '20px auto', maxWidth: '400px'}}
      >
        <h2 className="text-h2">Custom Data Attrs</h2>
        <p>2000ms + elastic ease via data-gsap-*</p>
      </div>

      {/* Stagger */}
      <div className="stagger-children-100" style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', maxWidth: '700px', margin: '20px auto'}}>
        <div className="card">Item 1</div>
        <div className="card">Item 2</div>
        <div className="card">Item 3</div>
      </div>

      {/* Buttons */}
      <div className="flex-center" style={{gap: '16px', margin: '40px auto'}}>
        <button className="btn-primary hover-lift active-press">Primary</button>
        <button className="btn-secondary hover-scale active-press">Secondary</button>
        <button className="btn-ghost hover-glow">Ghost Glow</button>
      </div>

      {/* RESPONSIVE TEST */}
      <div className="flex-col md:flex-between" style={{gap:'16px', maxWidth:'700px', margin:'20px auto'}}>
        <div className="card">Stacks mobile → row on md+</div>
        <div className="card">Card 2</div>
      </div>

      {/* STATE VARIANT TEST */}
      <button className="btn-primary hover:bg-primary-600 active:bg-primary-900"
        style={{display:'block', margin:'20px auto'}}>
        Hover and Click Me
      </button>

      {/* DARK MODE TEST */}
      <button
        onClick={() => document.documentElement.classList.toggle('dark')}
        className="btn-secondary"
        style={{display:'block', margin:'20px auto'}}>
        Toggle Dark Mode
      </button>

      <div className="card dark:bg-neutral-900 dark:color-neutral-50"
        style={{maxWidth:'400px', margin:'20px auto'}}>
        I change in dark mode!
      </div>

      {/* Shows/hides based on screen size */}
      <div className="card" style={{maxWidth:'400px', margin:'20px auto'}}>
        <p>This text is: 
          <span className="block md:hidden" style={{color:'red'}}>MOBILE (below 768px)</span>
          <span className="hidden md:block" style={{color:'green'}}>DESKTOP (768px+)</span>
        </p>
      </div>

    </div>
  )
}

export default App