const fs = require('fs');
const env = process.env.ENV || 'dev';
const envConfig = require(`./environments/${env}.json`);

const url = envConfig.baseURL;

const { spawn } = require('child_process');
const child = spawn('npx', ['playwright', 'codegen', url], { stdio: 'inherit' });
child.on('exit', code => process.exit(code));
