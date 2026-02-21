// mizumi.config.js
export default {
  tokens: {
    colors: {
      primary: {
        DEFAULT: '#3B82F6',
        50: '#EFF6FF',
        600: '#2563EB',
        900: '#1E3A8A'
      },
      secondary: '#8B5CF6',
      neutral: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        500: '#6B7280',
        900: '#111827'
      },
      surface: '#FFFFFF',
      text: '#111827',
      success: '#10B981',
      error: '#EF4444'
    },

    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px',
      '3xl': '64px'
    },

    typography: {
      h1: { size: '48px', weight: 700, line: 1.2 },
      h2: { size: '36px', weight: 600, line: 1.3 },
      h3: { size: '24px', weight: 600, line: 1.4 },
      body: { size: '16px', weight: 400, line: 1.6 },
      small: { size: '14px', weight: 400, line: 1.5 }
    },

    radius: {
      none: '0',
      sm: '4px',
      md: '8px',
      lg: '16px',
      full: '9999px'
    },

    shadows: {
      none: 'none',
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    },

    animations: {
      duration: {
        fast: 150,
        normal: 300,
        slow: 500
      },
      easing: {
        smooth: 'power2.out',
        bouncy: 'elastic.out(1, 0.5)',
        sharp: 'power4.inOut'
      }
    }
  },

  patterns: {
    // Layout
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'flex-col-center': 'flex flex-col items-center justify-center',

    // Containers
    container: 'max-w-6xl mx-auto pad-x-md',
    section: 'pad-y-2xl',

    // Cards
    card: 'bg-surface pad-md rounded-lg shadow-md',
    'card-elevated': 'card shadow-xl',
    'card-flat': 'card shadow-sm',
    'card-hover': 'card transition cursor-pointer',

    // Buttons
    button: 'pad-sm pad-x-lg rounded-md cursor-pointer transition inline-flex items-center justify-center',
    'btn-primary': 'button bg-primary color-white',
    'btn-secondary': 'button bg-secondary color-white',
    'btn-ghost': 'button bg-transparent color-primary',
    'btn-outline': 'button border border-primary color-primary',

    // Inputs
    input: 'pad-sm rounded-md border border-neutral-200 transition',
    
    'test-watch': 'bg-primary pad-lg rounded-full',
    

    // Text
    heading: 'text-h1 color-text',
    subheading: 'text-h3 color-neutral-500',
    'text-muted': 'color-neutral-500'
  },

  animations: {
    // Entrance
    'animate-fade-in': {
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: 1.0,
      ease: 'power2.out'
    },
    'animate-slide-up': {
      from: { y: 100, opacity: 0 },
      to: { y: 0, opacity: 1 },
      duration: 0.3,
      ease: 'power2.out'
    },
    'animate-scale-in': {
      from: { scale: 0, opacity: 0 },
      to: { scale: 1, opacity: 1 },
      duration: 0.3,
      ease: 'back.out'
    },

    // Scroll
    'scroll-trigger': {
      scrollTrigger: {
        trigger: 'self',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    },

    // Hover
    'hover-lift': {
      hover: { y: -8, duration: 0.15 }
    },
    'hover-scale': {
      hover: { scale: 1.05, duration: 0.15 }
    },
    'hover-glow': {
      hover: {
        boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
        duration: 0.15
      }
    },

    // Click
    'active-press': {
      active: { scale: 0.95, duration: 0.1 }
    },

    // Stagger
    'stagger-children-100': {
      targets: 'children',
      stagger: 0.1,
      from: { opacity: 0, y: 20 },
      to: { opacity: 1, y: 0 }
    }
  },

  rules: {
    responsive:  true,
    darkMode:    'class',
    print:       true,
    motion:      true,
    orientation: false,
  
    breakpoints: {
      sm:  '640px',
      md:  '768px',
      lg:  '1024px',
      xl:  '1280px',
      '2xl': '1536px'
    },
  
    // Container queries — frame-name:card frame-type:inline on parent
    containers: {
      card:    { sm: '300px', md: '500px' },
      sidebar: { collapsed: '200px', expanded: '320px' },
    }
  }
};
