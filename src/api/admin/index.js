import Router from 'koa-router';
import * as adminCtrl from './admin.ctrl';

const admin = new Router();

admin.post('/register', adminCtrl.register);
admin.post('/login', adminCtrl.login);

export default admin;
