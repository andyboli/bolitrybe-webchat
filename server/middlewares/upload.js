const Boom = require('@hapi/boom');

const multer = require('multer');

const util = require('util');

function uploadMiddleware({ dest, field }) {
  return async (req, res, next) => {
    try {
      const contype = req.headers['content-type'];

      if (!contype) throw Boom.badRequest('File not received');

      const storage = multer.diskStorage({
        destination: (_req, _file, callback) => {
          callback(null, dest);
        },
        filename: (_req, file, callback) => {
          callback(null, file.originalname);
        },
      });

      const upload = multer({ storage });

      const uploadPromisse = util.promisify(upload.single(field));

      await uploadPromisse(req, res);

      req.body.image = `${req.protocol}://${req.get('host')}/${dest}/${req.file.originalname}`;

      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = uploadMiddleware;
