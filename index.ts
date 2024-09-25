import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { router as indexRouter } from './routes/index'
import { router as usersRouter } from './routes/users'
import { PrismaClient } from '@prisma/client'

let apps = express();
const prisma = new PrismaClient()

// view engine setup
apps.set('views', path.join(__dirname, 'views'));
apps.set('view engine', 'ejs');

apps.use(logger('dev'));
apps.use(express.json());
apps.use(express.urlencoded({ extended: false }));
apps.use(cookieParser());
apps.use(express.static(path.join(__dirname, 'public')));

apps.use('/', indexRouter);
apps.use('/users', usersRouter);

// catch 404 and forward to error handler
apps.use(function(req, res, next) {
  next(createError(404));
});


// error handler
apps.use((err: any, req: any, res: any, next: any) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  try {
    res.locals.error = req.apps.get('env') === 'development' ? err : {};
  } catch (error) {
    
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export const app = apps