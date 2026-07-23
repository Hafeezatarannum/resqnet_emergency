const mocha = require('mocha');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

class FieldValidationExcelReporter extends mocha.reporters.Base {
  constructor(runner, options) {
    super(runner, options);
    this.results = [];
    this.startTime = Date.now();

    runner.on('pass', (test) => {
      this.results.push({
        suite: test.parent ? test.parent.title : 'Field Validation',
        title: test.title,
        state: 'Passed',
        duration: test.duration || 0,
        error: ''
      });
    });

    runner.on('fail', (test, err) => {
      this.results.push({
        suite: test.parent ? test.parent.title : 'Field Validation',
        title: test.title,
        state: 'Failed',
        duration: test.duration || 0,
        error: err ? (err.message || String(err)) : 'Field validation failure'
      });
    });

    runner.on('end', async () => {
      console.log('\n========================================');
      console.log('Generating Field Validation Excel Report...');
      await this.generateReport();
      console.log('========================================\n');
    });
  }

  async generateReport() {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'ResQNet Field Validation Automation Suite';
    workbook.created = new Date();

    const endTime = Date.now();
    const totalTimeMs = endTime - this.startTime;
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.state === 'Passed').length;
    const failedTests = this.results.filter(r => r.state === 'Failed').length;
    const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) + '%' : '0%';

    // --- SHEET 1: EXECUTIVE SUMMARY ---
    const summarySheet = workbook.addWorksheet('Field Validation Summary');
    summarySheet.views = [{ showGridLines: true }];

    summarySheet.mergeCells('A1:E1');
    const titleCell = summarySheet.getCell('A1');
    titleCell.value = 'ResQNet Field & Input Validation Test Execution Report';
    titleCell.font = { name: 'Calibri', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF548235' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    summarySheet.getRow(1).height = 35;

    summarySheet.mergeCells('A2:E2');
    const subTitle = summarySheet.getCell('A2');
    subTitle.value = `Execution Date: ${new Date().toLocaleString()} | Target URL: ${process.env.TEST_URL || 'http://127.0.0.1:5173'}`;
    subTitle.font = { name: 'Calibri', size: 11, italic: true, color: { argb: 'FF595959' } };
    subTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    summarySheet.getRow(2).height = 20;

    summarySheet.addRow([]); // Blank row

    const metricHeaderRow = summarySheet.addRow(['Validation Category', 'Details', '', 'Status Summary', 'Count']);
    metricHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    metricHeaderRow.eachCell((cell, colNumber) => {
      if (colNumber === 1 || colNumber === 2 || colNumber === 4 || colNumber === 5) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF375623' } };
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }
    });

    const metrics = [
      ['Target Form Modules', 'Login, Signup, Medical, Contacts, SOS, Profile, Feedback', '', 'Total Validation Cases', totalTests],
      ['Validation Scope', 'Email, Phone, Password, Length, XSS Injections, Boundary Values', '', 'Passed Validation Cases', passedTests],
      ['Total Execution Duration', `${(totalTimeMs / 1000).toFixed(2)} seconds`, '', 'Failed Validation Cases', failedTests],
      ['Pass Rate Percentage', passRate, '', 'Overall Status', failedTests === 0 ? 'PASSED' : 'FAILED WITH ERRORS']
    ];

    metrics.forEach(m => {
      const row = summarySheet.addRow(m);
      row.getCell(1).font = { bold: true };
      row.getCell(4).font = { bold: true };

      if (m[3] === 'Passed Validation Cases') {
        row.getCell(5).font = { bold: true, color: { argb: 'FF008000' } };
      } else if (m[3] === 'Failed Validation Cases') {
        row.getCell(5).font = { bold: true, color: { argb: 'FFC00000' } };
      } else if (m[3] === 'Overall Status') {
        row.getCell(5).font = { bold: true, color: { argb: failedTests === 0 ? 'FF008000' : 'FFC00000' } };
      }
    });

    summarySheet.getColumn(1).width = 28;
    summarySheet.getColumn(2).width = 45;
    summarySheet.getColumn(3).width = 5;
    summarySheet.getColumn(4).width = 25;
    summarySheet.getColumn(5).width = 25;

    // --- SHEET 2: DETAILED FIELD VALIDATION RESULTS ---
    const detailsSheet = workbook.addWorksheet('Detailed Field Validation Cases');
    detailsSheet.views = [{ showGridLines: true }];

    detailsSheet.columns = [
      { header: '#', key: 'id', width: 8 },
      { header: 'Form Module / Component', key: 'suite', width: 35 },
      { header: 'Test Case ID & Title', key: 'title', width: 75 },
      { header: 'Status', key: 'state', width: 15 },
      { header: 'Duration (ms)', key: 'duration', width: 15 },
      { header: 'Error Trace / Details', key: 'error', width: 55 }
    ];

    const headerRow = detailsSheet.getRow(1);
    headerRow.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.height = 25;
    headerRow.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF548235' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    this.results.forEach((res, index) => {
      const row = detailsSheet.addRow({
        id: index + 1,
        suite: res.suite,
        title: res.title,
        state: res.state,
        duration: res.duration,
        error: res.error || '-'
      });

      row.getCell('id').alignment = { horizontal: 'center' };
      row.getCell('state').alignment = { horizontal: 'center' };
      row.getCell('duration').alignment = { horizontal: 'right' };

      if (res.state === 'Passed') {
        row.getCell('state').font = { bold: true, color: { argb: 'FF008000' } };
      } else {
        row.getCell('state').font = { bold: true, color: { argb: 'FFC00000' } };
        row.getCell('error').font = { color: { argb: 'FFC00000' } };
      }
    });

    const reportDir = process.env.REPORT_DIR
      ? path.resolve(process.cwd(), process.env.REPORT_DIR)
      : path.join(__dirname, '..', 'reports', 'field-validation');

    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(reportDir, `ResQNet_Field_Validation_Report_${timestamp}.xlsx`);

    await workbook.xlsx.writeFile(reportPath);
    console.log(`Field Validation Excel Report saved at:\n--> ${reportPath}`);
  }
}

module.exports = FieldValidationExcelReporter;
