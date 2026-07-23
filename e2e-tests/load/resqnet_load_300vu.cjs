const http = require('http');
const https = require('https');
const { URL } = require('url');
const { generateLoadExcelReport } = require('../reporter/loadExcelReporter.cjs');

const targetUrl = process.env.TEST_URL || 'http://127.0.0.1:5173';
const CONCURRENT_VUS = parseInt(process.env.VUS || '300', 10);
const DURATION_SECONDS = parseInt(process.env.DURATION || '60', 10);

const routes = [
  '/',
  '/login',
  '/signup',
  '/home',
  '/chatbot',
  '/alerts',
  '/hospitals',
  '/live-tracking',
  '/settings',
  '/profile'
];

async function runLoadTest() {
  console.log(`\n=================================================`);
  console.log(`  RESQNET BASELINE & LOAD TESTING ENGINE`);
  console.log(`=================================================`);
  console.log(`Target URL:        ${targetUrl}`);
  console.log(`Concurrent VUs:    ${CONCURRENT_VUS} Virtual Users`);
  console.log(`Test Duration:     ${DURATION_SECONDS} Seconds (1 Minute)`);
  console.log(`Endpoints Target:  ${routes.length} Core App Routes`);
  console.log(`-------------------------------------------------\n`);

  const startTime = Date.now();
  const endTime = startTime + (DURATION_SECONDS * 1000);
  
  const allLatencies = [];
  const endpointData = {};

  routes.forEach(r => {
    endpointData[r] = { latencies: [], errors: 0 };
  });

  let totalRequests = 0;
  let totalErrors = 0;
  let activeWorkers = 0;

  // Single HTTP Request helper using native http/https module for ultra-fast, low-overhead load generation
  function sendRequest(route) {
    return new Promise((resolve) => {
      const fullUrl = new URL(route, targetUrl);
      const client = fullUrl.protocol === 'https:' ? https : http;
      const reqStart = process.hrtime.bigint();

      const req = client.get(fullUrl, {
        headers: {
          'User-Agent': 'ResQNet-Load-Tester/1.0 (300-VU-Engine)',
          'Accept': 'text/html,application/json'
        },
        timeout: 5000
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          const reqEnd = process.hrtime.bigint();
          const latencyMs = Number(reqEnd - reqStart) / 1e6; // Convert nanoseconds to milliseconds

          resolve({
            route,
            statusCode: res.statusCode,
            latencyMs,
            error: res.statusCode >= 400 ? `HTTP ${res.statusCode}` : null
          });
        });
      });

      req.on('error', (err) => {
        const reqEnd = process.hrtime.bigint();
        const latencyMs = Number(reqEnd - reqStart) / 1e6;
        resolve({
          route,
          statusCode: 0,
          latencyMs,
          error: err.message
        });
      });

      req.on('timeout', () => {
        req.destroy();
        const reqEnd = process.hrtime.bigint();
        const latencyMs = Number(reqEnd - reqStart) / 1e6;
        resolve({
          route,
          statusCode: 0,
          latencyMs,
          error: 'Request Timeout'
        });
      });
    });
  }

  // Worker loop for a single Virtual User (VU)
  async function worker(vuId) {
    activeWorkers++;
    let routeIndex = vuId % routes.length;

    while (Date.now() < endTime) {
      const route = routes[routeIndex];
      routeIndex = (routeIndex + 1) % routes.length;

      const result = await sendRequest(route);
      totalRequests++;

      allLatencies.push(result.latencyMs);
      endpointData[route].latencies.push(result.latencyMs);

      if (result.error) {
        totalErrors++;
        endpointData[route].errors++;
      }

      // Small 10ms micro-pause to simulate realistic user interaction intervals
      await new Promise(res => setTimeout(res, 10));
    }
    activeWorkers--;
  }

  console.log(`Launching ${CONCURRENT_VUS} Virtual User worker threads...`);
  
  // Progress tracker interval every 10 seconds
  const tracker = setInterval(() => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const currentRps = elapsed > 0 ? (totalRequests / elapsed).toFixed(1) : 0;
    console.log(`[Progress] Elapsed: ${elapsed}s / ${DURATION_SECONDS}s | Total Requests: ${totalRequests} | Current RPS: ${currentRps} req/sec | Active VUs: ${activeWorkers}`);
  }, 10000);

  // Launch all 300 VU workers concurrently
  const workerPromises = [];
  for (let i = 0; i < CONCURRENT_VUS; i++) {
    workerPromises.push(worker(i));
  }

  await Promise.all(workerPromises);
  clearInterval(tracker);

  const actualDurationMs = Date.now() - startTime;
  const actualDurationSec = actualDurationMs / 1000;
  const rps = (totalRequests / actualDurationSec).toFixed(2);
  const successRate = totalRequests > 0 ? (((totalRequests - totalErrors) / totalRequests) * 100).toFixed(2) : 0;

  // Latency metrics calculation
  allLatencies.sort((a, b) => a - b);
  const minLatencyMs = allLatencies.length > 0 ? Math.round(allLatencies[0]) : 0;
  const maxLatencyMs = allLatencies.length > 0 ? Math.round(allLatencies[allLatencies.length - 1]) : 0;
  const avgLatencyMs = allLatencies.length > 0 ? Math.round(allLatencies.reduce((a, b) => a + b, 0) / allLatencies.length) : 0;
  
  const p95Index = Math.floor(allLatencies.length * 0.95);
  const p95LatencyMs = allLatencies.length > 0 ? Math.round(allLatencies[p95Index] || maxLatencyMs) : 0;

  console.log(`\n=================================================`);
  console.log(`        LOAD TEST RESULTS SUMMARY`);
  console.log(`=================================================`);
  console.log(`Total Duration:       ${actualDurationSec.toFixed(2)} seconds`);
  console.log(`Total Requests:       ${totalRequests} Requests`);
  console.log(`Requests Per Second:  ${rps} req/sec`);
  console.log(`Success Rate:         ${successRate}%`);
  console.log(`-------------------------------------------------`);
  console.log(`Response Times:`);
  console.log(`  Fastest (Min):      ${minLatencyMs} ms`);
  console.log(`  Average (Avg):      ${avgLatencyMs} ms`);
  console.log(`  Slowest (Max):      ${maxLatencyMs} ms (${(maxLatencyMs / 1000).toFixed(2)}s)`);
  console.log(`  95th Percentile:    ${p95LatencyMs} ms`);
  console.log(`=================================================\n`);

  // Compute breakdown per endpoint
  const endpointBreakdown = routes.map(r => {
    const lats = endpointData[r].latencies;
    lats.sort((a, b) => a - b);
    const epTotal = lats.length;
    const epRps = (epTotal / actualDurationSec).toFixed(2);
    const epMin = epTotal > 0 ? Math.round(lats[0]) : 0;
    const epMax = epTotal > 0 ? Math.round(lats[lats.length - 1]) : 0;
    const epAvg = epTotal > 0 ? Math.round(lats.reduce((a, b) => a + b, 0) / epTotal) : 0;
    const epP95Index = Math.floor(epTotal * 0.95);
    const epP95 = epTotal > 0 ? Math.round(lats[epP95Index] || epMax) : 0;

    return {
      endpoint: r,
      totalRequests: epTotal,
      rps: parseFloat(epRps),
      minMs: epMin,
      avgMs: epAvg,
      maxMs: epMax,
      p95Ms: epP95,
      errors: endpointData[r].errors
    };
  });

  // Generate Excel Report
  await generateLoadExcelReport({
    targetUrl,
    concurrentVUs: CONCURRENT_VUS,
    durationSeconds: Math.round(actualDurationSec),
    totalRequests,
    errorCount: totalErrors,
    rps: parseFloat(rps),
    successRate: parseFloat(successRate),
    minLatencyMs,
    avgLatencyMs,
    maxLatencyMs,
    p95LatencyMs,
    endpointBreakdown
  });
}

runLoadTest().catch(err => {
  console.error('Load test execution failed:', err);
  process.exit(1);
});
