import multer from 'multer';
import crypto from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import { config } from '../config.js';

const MIME_MAP = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  pdf: 'application/pdf',
};

export function createUploader(subdir, allowedExt, maxBytes) {
  const dir = path.join(config.rootPath, 'public_assets', 'uploads', subdir);
  fs.mkdirSync(dir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).slice(1).toLowerCase();
      cb(null, `${crypto.randomBytes(16).toString('hex')}.${ext}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: maxBytes },
    fileFilter: (_req, file, cb) => {
      const ext = path.extname(file.originalname).slice(1).toLowerCase();
      if (!allowedExt.includes(ext)) return cb(null, false);
      if (MIME_MAP[ext] && file.mimetype !== MIME_MAP[ext]) return cb(null, false);
      cb(null, true);
    },
  });
}

export function storedPath(subdir, filename) {
  return `public_assets/uploads/${subdir}/${filename}`;
}

export function createFieldUploader(fieldsConfig, maxBytes) {
  const storage = multer.diskStorage({
    destination: (_req, file, cb) => {
      const subdir = fieldsConfig[file.fieldname].subdir;
      const dir = path.join(config.rootPath, 'public_assets', 'uploads', subdir);
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).slice(1).toLowerCase();
      cb(null, `${crypto.randomBytes(16).toString('hex')}.${ext}`);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: maxBytes },
    fileFilter: (_req, file, cb) => {
      const fieldConfig = fieldsConfig[file.fieldname];
      if (!fieldConfig) return cb(null, false);
      const ext = path.extname(file.originalname).slice(1).toLowerCase();
      if (!fieldConfig.allowedExt.includes(ext)) return cb(null, false);
      if (MIME_MAP[ext] && file.mimetype !== MIME_MAP[ext]) return cb(null, false);
      cb(null, true);
    },
  });

  return upload.fields(Object.keys(fieldsConfig).map((name) => ({ name, maxCount: 1 })));
}
