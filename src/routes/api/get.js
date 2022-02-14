// src/routes/api/get.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const hash = require('../../hash');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    res.status(200).json(
      createSuccessResponse({
        status: 'ok',
        fragments: await Fragment.byUser(hash(req.user)),
      })
    );
  } catch (error) {
    res.status(401).json(createErrorResponse(401, error));
  }
};
