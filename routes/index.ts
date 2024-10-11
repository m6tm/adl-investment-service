import express from 'express';

var route = express.Router();

/* GET home page. */
route.get('/', function(req, res, next) {
  res.render('index', {
    title: 'My Website',
    message: 'Welcome to my website!',
    items: ['Item 1', 'Item 2', 'Item 3']
  });
})
.get('/winwheel', function(req, res, next) {
  res.render('winwheel', {
    title: 'Winwheel',
  });
})

export const router = route;
