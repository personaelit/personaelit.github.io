#!/usr/bin/env node

// Simple script to sync version across files
// Run with: node update-version.js

const fs = require('fs');
const path = require('path');

const versionFile = path.join(__dirname, 'version.js');
const manifestFile = path.join(__dirname, 'manifest.json');
const indexFile = path.join(__dirname, 'index.html');

const versionContent = fs.readFileSync(versionFile, 'utf8');
const versionMatch = versionContent.match(/export const VERSION = '([^']+)'/);
if (!versionMatch) {
  console.error('Could not find VERSION in version.js');
  process.exit(1);
}

const version = versionMatch[1];

let manifest = fs.readFileSync(manifestFile, 'utf8');
manifest = manifest.replace(/"version": "[^"]+"/, `"version": "${version}"`);
fs.writeFileSync(manifestFile, manifest);

let index = fs.readFileSync(indexFile, 'utf8');
index = index.replace(/app\.js\?version=[^"]+/, `app.js?version=${version}`);
fs.writeFileSync(indexFile, index);

console.log(`Updated manifest.json and index.html to version ${version}`);