import Router from 'koa-router';

import checkLoggedIn from '../../lib/checkLoggedIn';
import * as postsCtrl from './posts.ctrl';

const posts = new Router();

posts.get('/', checkLoggedIn, postsCtrl.list);
posts.post('/', checkLoggedIn, postsCtrl.write);
posts.get('/:id', checkLoggedIn, postsCtrl.checkObjectId, postsCtrl.read);
posts.delete('/:id', checkLoggedIn, postsCtrl.checkObjectId, postsCtrl.remove);
// posts.put('/:id', postsCtrl.replace);
posts.patch('/:id', checkLoggedIn, postsCtrl.checkObjectId, postsCtrl.update);

export default posts;
