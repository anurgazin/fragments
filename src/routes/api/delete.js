// src/routes/api/getById.js
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const hash = require('../../hash');
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    var id = req.params.id;
    await Fragment.delete(hash(req.user), id);
    res.status(200).json(createSuccessResponse(200));
  } catch (error) {
    res.status(404).json(createErrorResponse(404, error));
  }
};