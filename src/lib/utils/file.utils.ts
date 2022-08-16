import { NextFunction } from 'express';
import fs from 'fs';
import os from 'os';

const getTempDir = (): string => {
  try {
    return os.tmpdir();
  } catch (error) {
    console.log('Error creating tmp directory');
  }
};

const readFile = async (fileName: string, next: NextFunction): Promise<any> => {
  try {
    console.log('fileName readFile::', fileName);
    console.log('dir name:', getTempDir() + fileName);
    fs.readFile(`${getTempDir()}/${fileName}`, 'utf8', (err, data) => {
      if (err) {
        next(err);
      }
      next(data);
    });
  } catch (error) {
    next(error);
  }
};

const removeFile = async (fileName: string): Promise<void> => {
  fs.unlinkSync(`${getTempDir()}/${fileName}`);
};

export { getTempDir, readFile, removeFile };
