import type { IncomingMessage, ServerResponse } from 'node:http';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CONFIG_FILE = path.join(ROOT_DIR, 'nova-tv-config.json');

// Find ADB path
function getAdbPath(): string {
  const localAppData = process.env.LOCALAPPDATA || '';
  const sdkAdb = path.join(localAppData, 'Android', 'Sdk', 'platform-tools', 'adb.exe');
  if (fs.existsSync(sdkAdb)) {
    return sdkAdb;
  }
  return 'adb';
}

const ADB_CMD = getAdbPath();

interface ExecResult {
  success: boolean;
  stdout: string;
  stderr: string;
  error: string | null;
}

// Execute shell command with promise
function runExec(cmd: string, timeout = 10000): Promise<ExecResult> {
  return new Promise((resolve) => {
    exec(cmd, { timeout }, (error, stdout, stderr) => {
      resolve({
        success: !error,
        stdout: stdout ? stdout.trim() : '',
        stderr: stderr ? stderr.trim() : '',
        error: error ? error.message : null,
      });
    });
  });
}

// Packages for Hisense A4 series debloat
export const HISENSE_DEBLOAT_PACKAGES = [
  // Group 1: telemetry & analytics
  'com.hisense.app.logreport',
  'com.google.android.feedback',
  'com.google.android.tv.bugreportsender',
  // Group 2: recommendation rows, retail demo
  'com.google.android.tvrecommendations',
  'com.google.android.leanbacklauncher.recommendations',
  'com.google.android.leanbacklauncher',
  'com.hisense.storemode',
  'fusion.android.tv.demo',
  'com.mstar.android.tv.disclaimercustomization',
  'android.autoinstalls.config.hisense.xiaoyushan',
  // Group 3: preloaded bloatware
  'com.seraphic.browser',
  'com.google.android.music',
  'com.google.android.videos',
  'com.google.android.play.games',
  'com.google.android.apps.nbu.smartconnect.tv',
];

export async function handleApiRequest(
  req: IncomingMessage,
  res: ServerResponse
): Promise<boolean> {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return true;
  }

  // Parse JSON body for POST
  let body: Record<string, unknown> = {};
  if (req.method === 'POST') {
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(chunk as Buffer);
      const raw = Buffer.concat(chunks).toString();
      if (raw) body = JSON.parse(raw);
    } catch {
      body = {};
    }
  }

  // 1. GET /api/status - Device status
  if (pathname === '/api/status' && req.method === 'GET') {
    const devicesRes = await runExec(`"${ADB_CMD}" devices`);
    let connected = false;
    let tvIp = '';
    const lines = devicesRes.stdout.split('\n').slice(1);
    const devices: string[] = [];

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 2 && parts[1] === 'device') {
        connected = true;
        devices.push(parts[0]);
        if (parts[0].includes(':') || parts[0].includes('.')) {
          tvIp = parts[0].split(':')[0];
        }
      }
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: connected ? 'connected' : 'disconnected',
      connected,
      tvIp,
      devices,
      model: 'Hisense 32A4200G Android TV',
      adbPath: ADB_CMD,
    }));
    return true;
  }

  // 2. POST /api/tv/connect - Connect to TV over Wi-Fi ADB
  if (pathname === '/api/tv/connect' && req.method === 'POST') {
    const ip = (body.ip as string) || '192.168.1.100';
    const target = ip.includes(':') ? ip : `${ip}:5555`;
    const connectRes = await runExec(`"${ADB_CMD}" connect ${target}`);
    const isSuccess = connectRes.stdout.includes('connected to');

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: isSuccess,
      output: connectRes.stdout || connectRes.stderr,
      connected: isSuccess,
      tvIp: ip,
    }));
    return true;
  }

  // 3. GET /api/config - Get current saved config
  if (pathname === '/api/config' && req.method === 'GET') {
    if (fs.existsSync(CONFIG_FILE)) {
      const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(content);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Config not found' }));
    }
    return true;
  }

  // 4. POST /api/config/publish - Publish & save config
  if (pathname === '/api/config/publish' && req.method === 'POST') {
    try {
      const configData = {
        ...body,
        publishedAt: new Date().toISOString(),
      };
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(configData, null, 2), 'utf-8');

      // Attempt pushing to TV via ADB if device is connected
      let pushedToDevice = false;
      const devCheck = await runExec(`"${ADB_CMD}" devices`);
      if (devCheck.stdout.includes('\tdevice')) {
        await runExec(`"${ADB_CMD}" shell mkdir -p /sdcard/nova-tv`);
        const pushRes = await runExec(`"${ADB_CMD}" push "${CONFIG_FILE}" /sdcard/nova-tv/config.json`);
        pushedToDevice = pushRes.success;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        publishedAt: configData.publishedAt,
        pushedToDevice,
        savedPath: CONFIG_FILE,
      }));
    } catch (err: unknown) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }));
    }
    return true;
  }

  // 5. POST /api/tv/screen-share - Launch Screen Share receiver
  if (pathname === '/api/tv/screen-share' && req.method === 'POST') {
    // For Hisense 32A4200G (MediaTek), the native receiver is com.mediatek.androidbox
    const cmd1 = `"${ADB_CMD}" shell am start -n com.mediatek.androidbox/.MainActivity`;
    const res1 = await runExec(cmd1);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: res1.success,
      output: res1.stdout || res1.stderr,
      package: 'com.mediatek.androidbox',
    }));
    return true;
  }

  // 6. POST /api/tv/debloat - Safe debloat for Hisense 32A4200G
  if (pathname === '/api/tv/debloat' && req.method === 'POST') {
    const results = [];
    for (const pkg of HISENSE_DEBLOAT_PACKAGES) {
      const disableRes = await runExec(`"${ADB_CMD}" shell pm disable-user --user 0 ${pkg}`);
      results.push({
        package: pkg,
        success: disableRes.success,
        output: disableRes.stdout,
      });
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      results,
    }));
    return true;
  }

  // 7. POST /api/tv/restore - Re-enable all packages
  if (pathname === '/api/tv/restore' && req.method === 'POST') {
    const results = [];
    for (const pkg of HISENSE_DEBLOAT_PACKAGES) {
      const enableRes = await runExec(`"${ADB_CMD}" shell pm enable ${pkg}`);
      results.push({
        package: pkg,
        success: enableRes.success,
        output: enableRes.stdout,
      });
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      results,
    }));
    return true;
  }

  return false;
}

// Standalone runner
export function startStandaloneServer(port = 3001) {
  const server = http.createServer(async (req, res) => {
    const handled = await handleApiRequest(req, res);
    if (!handled) {
      const distDir = path.join(ROOT_DIR, 'dist');
      const reqUrl = req.url || '/';
      const filePath = path.join(distDir, reqUrl === '/' ? 'index.html' : reqUrl.split('?')[0]);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        const mimeTypes: Record<string, string> = {
          '.html': 'text/html',
          '.js': 'application/javascript',
          '.css': 'text/css',
          '.svg': 'image/svg+xml',
          '.json': 'application/json',
          '.png': 'image/png',
        };
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
      } else {
        const indexHtml = path.join(distDir, 'index.html');
        if (fs.existsSync(indexHtml)) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          fs.createReadStream(indexHtml).pipe(res);
        } else {
          res.writeHead(404);
          res.end('Not Found');
        }
      }
    }
  });

  server.listen(port, () => {
    console.log(`[NOVA TV Server] Running at http://localhost:${port}`);
    console.log(`[NOVA TV Server] ADB Bridge using: ${ADB_CMD}`);
  });
}
