const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function generateLoadExcelReport(data) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ResQNet High-Concurrency Load Testing Engine';
  workbook.created = new Date();

  // --- SHEET 1: EXECUTIVE SUMMARY ---
  const summarySheet = workbook.addWorksheet('Load Test Summary');
  summarySheet.views = [{ showGridLines: true }];

  // Title Banner
  summarySheet.mergeCells('A1:E1');
  const titleCell = summarySheet.getCell('A1');
  titleCell.value = 'ResQNet 300 Load Test Cases Performance Report (300 VUs / 60s)';
  titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  summarySheet.getRow(1).height = 35;

  // Subtitle
  summarySheet.mergeCells('A2:E2');
  const subTitle = summarySheet.getCell('A2');
  subTitle.value = `Execution Date: ${new Date().toLocaleString()} | Target URL: ${data.targetUrl}`;
  subTitle.font = { name: 'Calibri', size: 11, italic: true, color: { argb: 'FF595959' } };
  subTitle.alignment = { horizontal: 'center', vertical: 'middle' };
  summarySheet.getRow(2).height = 20;

  summarySheet.addRow([]); // Blank row

  // Metric Headers
  const metricHeaderRow = summarySheet.addRow(['Performance Metric', 'Value', '', 'SLA Parameter', 'Target Status']);
  metricHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  metricHeaderRow.eachCell((cell, colNumber) => {
    if (colNumber === 1 || colNumber === 2 || colNumber === 4 || colNumber === 5) {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5597' } };
      cell.alignment = { horizontal: 'left', vertical: 'middle' };
    }
  });

  const metrics = [
    ['Total Load Test Cases', '300 Distinct Scenarios', '', 'Load Target', '300 VUs Active'],
    ['Concurrent Virtual Users (VUs)', `${data.concurrentVUs} Users`, '', 'RPS (Requests/Sec)', `${data.rps} req/sec`],
    ['Test Duration', `${data.durationSeconds} Seconds`, '', 'Success Rate', `${data.successRate}%`],
    ['Total Requests Processed', `${data.totalRequests} Requests`, '', 'HTTP Errors Count', `${data.errorCount} Errors`],
    ['Fastest Response (Min)', `${data.minLatencyMs} ms`, '', 'Fast SLA (< 100ms)', data.minLatencyMs < 100 ? 'PASSED' : 'ATTENTION'],
    ['Average Response (Avg)', `${data.avgLatencyMs} ms`, '', 'Avg SLA (< 500ms)', data.avgLatencyMs < 500 ? 'PASSED' : 'ATTENTION'],
    ['Slowest Response (Max)', `${data.maxLatencyMs} ms`, '', 'Max SLA (< 3000ms)', data.maxLatencyMs < 3000 ? 'PASSED' : 'ATTENTION'],
    ['95th Percentile (p95)', `${data.p95LatencyMs} ms`, '', 'Overall Load Status', data.errorCount === 0 ? 'PASSED' : 'COMPLETED WITH ERRORS']
  ];

  metrics.forEach(m => {
    const row = summarySheet.addRow(m);
    row.getCell(1).font = { bold: true };
    row.getCell(4).font = { bold: true };

    if (m[4] === 'PASSED') {
      row.getCell(5).font = { bold: true, color: { argb: 'FF008000' } };
    } else if (m[4] === 'COMPLETED WITH ERRORS' || m[4] === 'ATTENTION') {
      row.getCell(5).font = { bold: true, color: { argb: 'FFC00000' } };
    }
  });

  summarySheet.getColumn(1).width = 30;
  summarySheet.getColumn(2).width = 25;
  summarySheet.getColumn(3).width = 5;
  summarySheet.getColumn(4).width = 25;
  summarySheet.getColumn(5).width = 25;


  // --- SHEET 2: ENDPOINT PERFORMANCE BREAKDOWN (300 ROWS) ---
  const detailsSheet = workbook.addWorksheet('Endpoint Performance Breakdown');
  detailsSheet.views = [{ showGridLines: true }];

  detailsSheet.columns = [
    { header: '#', key: 'id', width: 8 },
    { header: 'Endpoint / Route Path', key: 'endpoint', width: 75 },
    { header: 'Total Requests', key: 'total', width: 18 },
    { header: 'Throughput (RPS)', key: 'rps', width: 18 },
    { header: 'Min Latency (ms)', key: 'min', width: 18 },
    { header: 'Avg Latency (ms)', key: 'avg', width: 18 },
    { header: 'Max Latency (ms)', key: 'max', width: 18 },
    { header: 'p95 Latency (ms)', key: 'p95', width: 18 },
    { header: 'HTTP Errors', key: 'errors', width: 15 }
  ];

  const headerRow = detailsSheet.getRow(1);
  headerRow.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.height = 25;
  headerRow.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  data.endpointBreakdown.forEach((ep, index) => {
    const row = detailsSheet.addRow({
      id: index + 1,
      endpoint: ep.endpoint,
      total: ep.totalRequests,
      rps: ep.rps,
      min: ep.minMs,
      avg: ep.avgMs,
      max: ep.maxMs,
      p95: ep.p95Ms,
      errors: ep.errors
    });

    row.getCell('id').alignment = { horizontal: 'center' };
    row.getCell('total').alignment = { horizontal: 'right' };
    row.getCell('rps').alignment = { horizontal: 'right' };
    row.getCell('min').alignment = { horizontal: 'right' };
    row.getCell('avg').alignment = { horizontal: 'right' };
    row.getCell('max').alignment = { horizontal: 'right' };
    row.getCell('p95').alignment = { horizontal: 'right' };
    row.getCell('errors').alignment = { horizontal: 'center' };

    if (ep.errors > 0) {
      row.getCell('errors').font = { bold: true, color: { argb: 'FFC00000' } };
    } else {
      row.getCell('errors').font = { color: { argb: 'FF008000' } };
    }
  });

  const reportDir = process.env.REPORT_DIR
    ? path.resolve(process.cwd(), process.env.REPORT_DIR)
    : path.join(__dirname, '..', 'reports', 'load');

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(reportDir, `ResQNet_Load_Test_Report_${timestamp}.xlsx`);

  await workbook.xlsx.writeFile(reportPath);
  console.log(`\n========================================`);
  console.log(`Load Test Excel Report successfully saved at:\n--> ${reportPath}`);
  console.log(`========================================\n`);

  return reportPath;
}

module.exports = { generateLoadExcelReport };
