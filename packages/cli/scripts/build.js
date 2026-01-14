const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building VeloKit...');

// 1. Run tsc
try {
    execSync('npx tsc', { stdio: 'inherit' });
} catch (e) {
    process.exit(1);
}

// 2. Copy templates
const srcTemplates = path.join(__dirname, '../src/core/templates');
const distTemplates = path.join(__dirname, '../dist/core/templates');

fs.ensureDirSync(distTemplates);
fs.copySync(srcTemplates, distTemplates);
console.log('Templates copied to dist/');
