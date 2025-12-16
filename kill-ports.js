#!/usr/bin/env node

const { exec } = require('child_process');

const ports = process.argv.slice(2);

if (ports.length === 0) {
    console.log('Usage: node kill-ports.js <port1> <port2> ...');
    process.exit(1);
}

function killPort(port) {
    return new Promise((resolve, reject) => {
        exec(`netstat -ano | findstr :${port}`, (error, stdout, stderr) => {
            if (stdout) {
                const lines = stdout.trim().split('\n');
                for (const line of lines) {
                    const parts = line.trim().split(/\s+/);
                    const pid = parts[parts.length - 1];

                    if (pid && pid !== 'PID') {
                        exec(`taskkill /F /PID ${pid}`, (killError, killStdout, killStderr) => {
                            if (!killError) {
                                console.log(`✅ Killed process ${pid} on port ${port}`);
                            }
                        });
                    }
                }
            } else {
                console.log(`✅ Port ${port} is already free`);
            }
            resolve();
        });
    });
}

async function killAllPorts() {
    for (const port of ports) {
        await killPort(port);
    }
    console.log('🎉 All ports cleared!');
}

killAllPorts().catch(console.error);