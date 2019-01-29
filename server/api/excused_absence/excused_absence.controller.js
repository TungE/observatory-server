import _ from 'lodash'
import { handleError } from '../lib/helpers'
import { STATUS_PENDING, STATUS_APPROVED, STATUS_DENIED } from './constants'
import User from '../user/user.model'
import ExcusedAbsence from './excused_absence.model'

/**
* @api {get} /api/excused_absences Index
* @apiName index
* @apiGroup Excused Absence
* @apiDescription Get list of Excused Absences for the requesting user
* @apiPermission private
* @apiSuccess {Collection} root Collection of all the user's Excused Absences.
* @apiError (500) UnknownException Could not retrieve ExcusedAbsence collection
*/
exports.index = (req, res) => {
  return ExcusedAbsence.find({ user: req.user._id })
  .then((collection) => {
    return res.json(200, collection).end()
  })
  .catch((err) => {
    return handleError(res, err)
  })
}

/**
* @api {get} /api/excused_absences/admin Admin
* @apiName admin
* @apiGroup Excused Absence
* @apiDescription Get list of Excused Absences for all users
* @apiPermission private
* @apiSuccess {Collection} root Collection of all Excused Absences.
* @apiError (500) UnknownException Could not retrieve ExcusedAbsence collection
*/
exports.admin = (req, res) => {
  return ExcusedAbsence.find()
  .then((collection) => {
    return res.json(200, collection).end()
  })
  .catch((err) => {
    return handleError(res, err)
  })
}

/**
* @api {post} /api/excused_absences/:id Create
* @apiName create
* @apiGroup Excused Absence
* @apiDescription Create a new ExcusedAbsence record
* @apiPermission private
* @apiSuccess {Model} root A single ExcusedAbsence model
* @apiError (500) UnknownException Could not create ExcusedAbsence model
*/
exports.create = (req, res) => {

  // Isolates ExcusedAbsence attributes
  let user = req.user._id
  let status = STATUS_PENDING
  let { excuse, date } = req.body

  return ExcusedAbsence.create({ excuse, date, user, status })
  .then((model) => {
    return res.json(201, model)
  })
  .catch((err) => {
    return handleError(res, err)
  })

}

/**
* @api {put} /api/excused_absences/:id Update
* @apiName update
* @apiGroup Excused Absence
* @apiDescription Update a new ExcusedAbsence record
* @apiPermission private
* @apiSuccess {Model} root The updated ExcusedAbsence model
* @apiError (500) UnknownException Could not update ExcusedAbsence model
*/
exports.update = (req, res) => {


  if(req.user.isAdmin) {
  //if(auth.hasRole('admin')) {
    return Excused.findById(req.params.id)
    .then((excusedAbsence) => {
        excusedAbsence.reviewer_note = req.body.reviewer_note || excusedAbsence.reviewer_note
        excusedAbsence.date = req.body.date || excusedAbsence.date
        excusedAbsence.save().then((response) => {
            return res.status(200).send(response).end()
        })
    })

  } else {//if(auth.isAuthenticated === ExcusedAbsence.findById(req.params.id).user ) { //if the user owns the excused absence
    return ExcusedAbsence.findById(req.params.id)
    .then((excusedAbsence) => {
      if(req.user._id === excusedAbsence.user) {
          excusedAbsence.excuse = req.body.excuse || excusedAbsence.excuse
          excusedAbsence.date = req.body.date || excusedAbsence.date
          excusedAbsence.save().then((response) => {
            return res.status(200).send(response).end()
        })
      } else {
        return res.status(401).json({error: 'you do not have permission to edit this excused absence'})
      }
    })
  }
}

/*
  return ExcusedAbsence.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
  .then((response) => {
      return res.status(200).send(response).end()
  }).catch(next)
*/



/**
* @api {approve} /api/excused_absences/:id Approve
* @apiName approve
* @apiGroup Excused Absence
* @apiDescription Changes an ExcusedAbsence's status to STATUS_APPROVED
* @apiPermission private
* @apiSuccess {Model} root The approved ExcusedAbsence model
* @apiError (500) UnknownException Could not approve ExcusedAbsence model
*/
exports.approve = (req, res) => {
  return ExcusedAbsence.findById(req.params.id)
  .then((excusedAbsence) => {
      excusedAbsence.status = STATUS_APPROVED
      excusedAbsence.reviewed_by = req.user._id
      excusedAbsence.reviewer_note = req.body.reviewer_note || excusedAbsence.reviewer_note
      excusedAbsence.save().then((response) => {
        return res.status(200).send(response).end()
      })
  }).catch(next)
}

/**
* @api {deny} /api/excused_absences/:id Deny
* @apiName deny
* @apiGroup Excused Absence
* @apiDescription Changes an ExcusedAbsence's status to STATUS_DENIED
* @apiPermission private
* @apiSuccess {Model} root The denied ExcusedAbsence model
* @apiError (500) UnknownException Could not deny ExcusedAbsence model
*/
exports.deny = (req, res) => {
  return ExcusedAbsence.findById(req.params.id)
  .then((excusedAbsence) => {
    excusedAbsence.status = STATUS_DENIED
    excusedAbsence.reviewed_by = req.user._id
    excusedAbsence.reviewer_note = req.body.reviewer_note || excusedAbsence.reviewer_note
    excusedAbsence.save().then((response) => {
      return res.status(200).send(response).end()
    })
  }).catch(next)
}

/**
* @api {delete} /api/excused_absences/:id Delete
* @apiName delete
* @apiGroup Excused Absence
* @apiDescription Deletes an ExcusedAbsence record
* @apiPermission private
* @apiSuccess {Model} root The destroyed ExcusedAbsence model
* @apiError (500) UnknownException Could not destroy ExcusedAbsence model
*/
exports.destroy = (req, res, next) => {
    
  //if(auth.hasRole('admin') || (auth.isAuthenticated === ExcusedAbsence.findById(req.params.id).user )) {
  if(req.user.isAdmin) {
      return ExcusedAbsence.remove({ _id: req.params.id })
      .then((response) => {
          return res.status(200).send(response).end()
      })
  } else {

    ExcusedAbsence.findById(req.params.id).then((found) => {
        if (found.user_id === req.user._id) {
            return ExcusedAbsence.remove({ _id: req.params.id })
            .then((response) => {
                return res.status(200).send(response).end()
            })
        } else res.status(401).json({error: 'you do not have permission to delete this excused absence'})
    }) 
  }
}

