const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const uuid = require('uuid').v4;
const fse = require('fs-extra');

const { AppError } = require('../utils');

/**
 * Image service class.
 */
class ImageService {
  /**
   * Initialize express middleware.
   * @param {string} name
   * @returns {Object}
   */
  static initUploadMiddleware(name) {
    const multerStorage = multer.memoryStorage();

    const multerFilter = (req, file, cbk) => {
      if (file.mimetype.startsWith('image/')) {
        cbk(null, true);
      } else {
        cbk(new AppError(400, 'Please, upload images only!'), false);
      }
    };

    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
    }).single(name);
  }

  /**
   * Save file to local machine and return link.
   * @param {Object} file - multer file object
   * @param {Object} options - settings object
   * @param  {...string} pathSegments - path segments
   * @returns {string}
   */
  static async save(file, options, ...pathSegments) {
    if (file.size > (options?.maxSize || 1 * 1024 * 1024)) throw new AppError(400, 'File is too large..');

    const fileName = `${uuid()}.jpeg`;
    const fullFilePath = path.join(process.cwd(), 'statics', ...pathSegments);

    await fse.ensureDir(fullFilePath);
    await sharp(file.buffer)
      .resize(options || { height: 300, width: 300 })
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(path.join(fullFilePath, fileName));

    return path.join(...pathSegments, fileName);
  }
}

module.exports = ImageService;

/* OPTIONAL Jimp example
const avatar = await jimp.read(file.buffer);
await avatar
  .cover(options.width || 500, options.height || 500)
  .quality(90)
  .writeAsync(path.join(fullFilePath, fileName));
*/
