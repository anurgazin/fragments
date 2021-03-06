// src/routes/api/getById.js
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const mime = require('mime-types');
const logger = require('../../logger');
//var md = require('markdown-it')();
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  var id = req.params.id;
  var extension = mime.lookup(id);
  if (req.params.id.includes('.')) {
    id = req.params.id.split('.').slice(0, -1).join('.');
  }
  try {
    logger.info('GETBYID STARTS');
    const fragment = await Fragment.byId(req.user, id);
    logger.info('AFTER BY ID');
    var fragmentData = await fragment.getData();
    var type;
    try {
      if (fragment.formats.includes(extension)) {
        logger.info(extension);
        type = extension;
      } else if (extension == false) {
        logger.info('NO EXTENSION');

        type = fragment.mimeType;
        //logger.info(type);
      }
      var data = fragment.convertData(fragmentData, type);
      //logger.info(md.render(data.toString()));
      res.setHeader('Content-type', type);
      logger.info('BEFORE SEND');
      res.status(200).send(data);
    } catch (error) {
      res
        .status(415)
        .json(createErrorResponse(415, 'Can not convert fragment to the required extension'));
    }
  } catch (error) {
    res.status(404).json(createErrorResponse(404, error));
  }
};
