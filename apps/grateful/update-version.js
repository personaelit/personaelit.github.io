#!/usr/bin/env node

// Simple script to sync version across files
// Run with: node update-version.js

const fs = require('fs');
const path = require('path');

const versionFile = path.join(__dirname, 'version.js');
const manifestFile = path.join(__dirname, 'manifest.json');
const indexFile = path.join(__dirname, 'index.html');

const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
const version = manifest.version;
if (!version) {
  console.error('Could not find version in manifest.json');
  process.exit(1);
}

fs.writeFileSync(versionFile, `export const VERSION = '${version}';\n`);

let index = fs.readFileSync(indexFile, 'utf8');
index = index.replace(/app\.js\?version=[^"]+/, `app.js?version=${version}`);
fs.writeFileSync(indexFile, index);

console.log(`Updated version.js and index.html to version ${version}`);