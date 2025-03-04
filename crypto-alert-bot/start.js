#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('🚀 Starting Cryptocurrency Price Alert Bot...');

// Check if Node.js version is adequate
const nodeVersion = process.version;
const versionMatch = nodeVersion.match(/^v(\d+)/);
const majorVersion = versionMatch ? parseInt(versionMatch[1], 10) : 0;

if (majorVersion < 14) {
  console.error(`❌ Your Node.js version (${nodeVersion}) is too old.`);
  console.error('Please install Node.js v14 or newer from https://nodejs.org/');
  process.exit(1);
}

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ Missing .env file!');
  console.error('Please create a .env file based on the .env.example template.');
  process.exit(1);
}

// Check if dependencies are installed
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Node modules not found. Installing dependencies...');
  
  exec('npm install', (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Failed to install dependencies:');
      console.error(error.message);
      console.error('Please run "npm install" manually.');
      process.exit(1);
    }
    
    console.log('✅ Dependencies installed successfully.');
    startMainProgram();
  });
} else {
  startMainProgram();
}

function startMainProgram() {
  console.log('🔄 Starting the main application...');
  
  // Run the main program
  try {
    require('./index.js');
  } catch (error) {
    console.error('❌ Failed to start the application:');
    console.error(error.message);
    process.exit(1);
  }
} 