const fs = require('fs');

const csvFile = fs.readFileSync('shipping.csv');
const csvData = csvFile.toString();
const lines = csvData.split('\n');
const headers = lines[0].split(',');

const records = lines.slice(1).map(line => {
    const values = line.split(',');
    const record = {};
    headers.forEach((header, index) => {
        record[header] = values[index];
    });
    return record;
});

const locations = [...new Set(records.map(record => record.location))];
const jsonData = locations.map(location => {
    const options = records
        .filter(record => record.location === location)
        .map(record => ({
            name: record.name,
            cost: parseFloat(record.cost),
            estimated_delivery_time: record.estimated_delivery_time
        }));
    return { location, options };
});

const jsonStr = JSON.stringify(jsonData, null, 2);
fs.writeFileSync('shipping.json', jsonStr);