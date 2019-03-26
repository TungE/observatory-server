/**
* Calendar Controller
*/

'use strict';

import { handleError, validationError, generateCode, uniqueDayCode } from '../lib/helpers'

const Calendar = require('./calendar.model');

// Get all smallgroups
// Restricted to authenticated users
// router.get('/', auth.isAuthenticated(), controller.index);
// TODO: only return smallgroups for this year
/**
* @api {GET} /api/smallgroup Index
* @APIname index
* @APIgroup SmallGroup Controller
* @apidescription Get list of smallgroups
* @apiSuccess {Collection} index List of smallgroups
* @apiError (Error) 500 Unable to get list
*/
exports.index = async (req, res) => {
  try {
    const calendar = await Calendar.find({})
    return res.status(200).json(calendar)
  } catch (err) {
    return handleError(res, err)
  }
};