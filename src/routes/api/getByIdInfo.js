// src/routes/api/getById.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
//const hash = require('../../hash');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    res.status(200).json(
      createSuccessResponse({
        status: 'ok',
        fragments: fragment,
      })
    );
  } catch (error) {
    res.status(404).json(createErrorResponse(404, error));
  }
};
