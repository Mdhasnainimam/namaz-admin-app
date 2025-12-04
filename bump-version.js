const fs = require('fs');
const path = require('path');

const appJsonPath = path.join(__dirname, 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

// Bump versionCode
appJson.expo.android.versionCode += 1;

// Optional: Bump versionName
const version = appJson.expo.version.split('.');
version[2] = parseInt(version[2]) + 1;
appJson.expo.version = version.join('.');

fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
console.log(`Version bumped to: ${appJson.expo.version} (versionCode: ${appJson.expo.android.versionCode})`);