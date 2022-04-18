const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');
//const hash = require('../../hash');
//const apiURL = process.env.API_URL;
module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    logger.info('I am here');
    if (fragment.mimeType == req.get('Content-Type')) {
      await fragment.setData(req.body);
      res.status(200).json(
        createSuccessResponse({
          status: 'ok',
          fragment: fragment,
        })
      );
    } else {
      logger.info('ERROR IS HERE');
      res
        .status(406)
        .json(createErrorResponse(406, "A fragment's type can not be changed after it is created"));
    }
  } catch (error) {
    res.status(404).json(createErrorResponse(404, error));
  }
};
