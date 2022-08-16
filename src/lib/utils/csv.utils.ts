import csv from 'csv-parser';
import { Parser } from 'json2csv';
import fs from 'fs';

import { getTempDir } from 'lib/utils/file.utils';

const localFileCSVparser = async (fileName: string, callback) => {
  const data = [];
  fs.createReadStream(`${getTempDir()}/${fileName}`)
    .pipe(csv())
    .on('data', row => {
      data.push(row);
    })
    .on('finish', () => {
      callback(null, data);
    });
};

const CreateCSVFile = (headers: string[], data: any[]) => {
  const json2csv = new Parser({ headers });
  return json2csv.parse(data);
};

export { localFileCSVparser, CreateCSVFile };
