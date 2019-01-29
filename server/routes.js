/**
 * Main application routes
 */

'use strict';

var express = require('express');
var config = require('./config/environment');
import errors from './components/errors';
import path from 'path';

export default function(app) {

  // Insert routes below
  app.use('/api/achievements', require('./api/achievement'));
  app.use('/api/posts', require('./api/post'));
  app.use('/api/projects', require('./api/project'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/classyear', require('./api/classyear'));
  app.use('/api/smallgroup', require('./api/smallgroup'));
  app.use('/api/attendance', require('./api/attendance'));
  app.use('/api/excused_absences', require('./api/excused_absence'));
  app.use('/api/rooms', require('./api/room'));
  app.use('/api/static', require('./api/static'));
  app.use('/api/urp_forms', require('./api/urp_form'));
  app.use('/api/teams', require('./api/team'));
  app.use('/api/notifications', require('./api/notification'));
  app.use('/api/user_registrations', require('./api/user_registration'));

  app.use('/uploads', express.static(config.imageUploadPath));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets|uploads)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}
