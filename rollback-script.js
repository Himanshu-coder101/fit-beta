// rollback-script.js
// Run with: node rollback-script.js backup_1234567890


const fs = require('fs');
const path = require('path');

const backupPath = process.argv[2];

if (!backupPath) {
  console.error('❌ Please provide backup directory path');
  console.log('Usage: node rollback-script.js backup_1234567890');
  process.exit(1);
}

const fullBackupPath = path.join(__dirname, backupPath);

if (!fs.existsSync(fullBackupPath)) {
 console.error(`❌ Backup directory not found: ${fullBackupPath}`);
  process.exit(1);
}

console.log('🔄 Rolling back changes...\n');

function rollback(dir, basePath = '') {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(basePath, item);
    const targetPath = path.join(__dirname, relativePath);
    
    if (fs.statSync(fullPath).isDirectory()) {
      rollback(fullPath, relativePath);
    } else {
      const targetDir = path.dirname(targetPath);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      fs.copyFileSync(fullPath, targetPath);
      console.log(`  ✅ Restored: ${relativePath}`);
    }
  });
}

try {
  rollback(fullBackupPath);
  console.log('\\n✅ Rollback successful!');
  console.log('Your files have been restored to their previous state.\\n');
} catch (error) {
  console.error('❌ Rollback failed:', error.message);
  process.exit(1);
}