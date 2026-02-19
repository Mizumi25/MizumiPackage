// packages/core/writer.js
const fs = require('fs');
const path = require('path');

export class CSSWriter {
  constructor(outputPath = '.mizumi/mizumi.css') {
    this.outputPath = outputPath;
  }

  /**
   * Write CSS to file
   */
  write(css) {
    // Create directory if it doesn't exist
    const dir = path.dirname(this.outputPath);
    
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write CSS file
    fs.writeFileSync(this.outputPath, css, 'utf8');
    
    console.log(`✅ Mizumi CSS generated: ${this.outputPath}`);
    console.log(`📦 Size: ${(Buffer.byteLength(css) / 1024).toFixed(2)} KB`);
  }
}

