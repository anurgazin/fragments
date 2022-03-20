// src/routes/api/getById.js
const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const hash = require('../../hash');
var md = require('markdown-it')();
/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  try {
    var id = req.params.id;
    if (req.params.id.includes('.html')) {
      id = req.params.id.split('.').slice(0, -1).join('.');
    }
    const fragment = await Fragment.byId(hash(req.user), id);
    var fragmentData = await fragment.getData();
    if (req.params.id.includes('.html') && fragment.type == 'text/markdown') {
      res.setHeader('Content-type', 'text/html');
      res.status(200).send(md.render(fragmentData.toString()));
    } else {
      res.setHeader('Content-type', fragment.type);
      res.status(200).send(fragmentData);
    }
  } catch (error) {
    console.log(error);
    res.status(404).json(createErrorResponse(404, error));
  }
};
