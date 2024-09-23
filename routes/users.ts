import express from 'express'
var route = express.Router();

/* GET users listing. */
route.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

export const router = route;