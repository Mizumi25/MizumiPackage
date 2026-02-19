// test.js
const Mizumi = require('./packages/core/index.js');

// Sample config
const config = {
  tokens: {
    colors: {
      primary: '#3B82F6',
      surface: '#FFFFFF'
    },
    spacing: {
      sm: '8px',
      md: '16px',
      lg: '24px'
    },
    radius: {
      md: '8px',
      lg: '16px'
    },
    shadows: {
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }
  },
  patterns: {
    card: 'bg-surface pad-md rounded-lg shadow-md',
    'btn-primary': 'bg-primary color-white pad-sm rounded-md'
  }
};

const mizumi = new Mizumi(config);

// Generate CSS
console.log('=== GENERATED CSS ===\n');
console.log(mizumi.generateCSS());

// Test pattern expansion
console.log('\n=== PATTERN EXPANSION ===\n');
console.log('Input: "card"');
console.log('Output:', mizumi.expandClassName('card'));

console.log('\nInput: "btn-primary hover-lift"');
console.log('Output:', mizumi.expandClassName('btn-primary hover-lift'));