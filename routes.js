const express = require('express');
const routes = express.Router();

routes.get('/', (req, res) => {
  return res.redirect('/teachers');
});

routes.get('/teachers', (req, res) => {
  return res.render('teachers/index');
});

routes.get('/students', (req, res) => {
  return res.render('students');
});

routes.use((req, res) => res.status(404).render('not-found'));

module.exports = routes;
