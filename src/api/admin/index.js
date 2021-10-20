import Router from 'koa-router';
import checkLoggedIn from '../../lib/checkLoggedIn';
import checkObjectId from '../../lib/checkObjectId';
import * as adminCtrl from './admin.ctrl';
import * as genealogyCtrl from './genealogy.ctrl';

const admin = new Router();

admin.post('/register', checkLoggedIn, adminCtrl.register);
admin.post('/login', adminCtrl.login);
admin.get('/user', checkLoggedIn, adminCtrl.getUserList);
admin.delete('/user', checkLoggedIn, adminCtrl.deleteUser);
admin.get('/check', adminCtrl.check);
admin.get('/genealogy', checkLoggedIn, genealogyCtrl.getGenealogy);
admin.post('/genealogy', checkLoggedIn, genealogyCtrl.write);
admin.get('/genealogy/:id', checkLoggedIn, checkObjectId, genealogyCtrl.readOne);
admin.patch('/genealogy/:id', checkLoggedIn, checkObjectId, genealogyCtrl.update);
admin.delete('/genealogy/:id', checkLoggedIn, checkObjectId, genealogyCtrl.remove);

export default admin;
