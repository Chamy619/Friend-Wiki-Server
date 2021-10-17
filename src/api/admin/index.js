import Router from 'koa-router';
import * as adminCtrl from './adminCtrl';

const admin = new Router();

admin.post('/register', adminCtrl.register);
admin.post('/login', adminCtrl.login);

export default admin;
