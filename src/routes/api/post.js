const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const hash = require('../../hash');
const apiURL = 'http://localhost:8080/v1';
module.exports = async (req, res) => {
  if (Fragment.isSupportedType(req.get('Content-Type'))) {
    try {
      const fragment = new Fragment({ ownerId: hash(req.user), type: req.get('Content-Type') });
      await fragment.setData(req.body);
      res.setHeader('Content-type', fragment.type);
      res.setHeader('Location', apiURL + '/fragments/' + fragment.id);
      res.status(201).json(
        createSuccessResponse({
          status: 'ok',
          fragment: fragment,
        })
      );
    } catch (error) {
      res.status(401).json(createErrorResponse(401, error));
    }
  } else {
    res.status(415).json(createErrorResponse(415, 'Unsupported Content Type'));
  }
};
