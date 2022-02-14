const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const hash = require('../../hash');
const logger = require('../../logger');
const apiURL = process.env.API_URL || process;

module.exports = async (req, res) => {
  try {
    const fragment = new Fragment({ ownerId: hash(req.user), type: req.get('Content-Type') });
    await fragment.setData(req.body);
    const newFragment = Fragment.byUser(fragment.ownerId);
    logger.debug({ newFragment }, `Created new fragment`);
    res.setHeader('Content-type', fragment.type);
    res.setHeader('Location', apiURL + 'fragments' + fragment.id);
    res.status(201).json(
      createSuccessResponse({
        status: 'ok',
        fragments: [fragment],
      })
    );
  } catch (error) {
    res.status(415).json(createErrorResponse(415, error));
  }
};
