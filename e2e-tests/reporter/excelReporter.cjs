const mocha = require('mocha');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

class ExcelReporter extends mocha.reporters.Base {
  constructor(runner, options) {
    super(runner, options);
    this.results = [];

    runner.on('pass', (test) => {
      this.results.push({
        title: test.title,
        state: 'Passed',
        duration: test.duration,
        error: ''
      });
    });

    runner.on('fail', (test, err) => {
      this.results.push({
        title: test.title,
        state: 'Failed',
        duration: test.duration,
        error: err.message
      });
    });

    runner.on('end', async () => {
      console.log('Generating Excel Report...');
      await this.generateReport();
    });
  }

  async generateReport() {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Test Results');

    sheet.columns = [
      { header: 'Test Case', key: 'title', width: 50 },
      { header: 'Status', key: 'state', width: 15 },
      { header: 'Duration (ms)', key: 'duration', width: 15 },
      { header: 'Error', key: 'error', width: 50 }
    ];

    // Style headers
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    this.results.forEach(res => {
      const row = sheet.addRow(res);
      row.getCell('state').font = {
        color: { argb: res.state === 'Passed' ? 'FF008000' : 'FFFF0000' }
      };
    });

    const reportDir = process.env.REPORT_DIR
      ? path.resolve(process.cwd(), process.env.REPORT_DIR)
      : path.join(__dirname, '..', 'reports');
      
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportPath = path.join(reportDir, `test-results-${Date.now()}.xlsx`);
    await workbook.xlsx.writeFile(reportPath);
    console.log(`Excel report saved to: ${reportPath}`);
  }
}

module.exports = ExcelReporter;
