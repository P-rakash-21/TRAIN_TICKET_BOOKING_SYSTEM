const { Parser } = require('json2csv');
const fs = require('fs');

function exportBookingsToCSV(bookings, filePath = 'bookings.csv') {
  const parser = new Parser();
  const csv = parser.parse(bookings);
  fs.writeFileSync(filePath, csv);
}

module.exports = exportBookingsToCSV;
