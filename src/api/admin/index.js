import Router from 'koa-router';
import checkLoggedIn from '../../lib/checkLoggedIn';
import * as adminCtrl from './admin.ctrl';

const admin = new Router();

admin.post('/register', checkLoggedIn, adminCtrl.register);
admin.post('/login', adminCtrl.login);
admin.get('/user', checkLoggedIn, adminCtrl.getUserList);
admin.delete('/user', checkLoggedIn, adminCtrl.deleteUser);
admin.get('/check', adminCtrl.check);

export default admin;
