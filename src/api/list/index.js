import Router from 'koa-router';

import checkLoggedIn from '../../lib/checkLoggedIn';
import * as listCtrl from './list.ctrl';

const list = new Router();

list.get('/', checkLoggedIn, listCtrl.makeList);

export default list;
