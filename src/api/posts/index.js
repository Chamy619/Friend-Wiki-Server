import Router from 'koa-router';

import checkLoggedIn from '../../lib/checkLoggedIn';
import checkObjectId from '../../lib/checkObjectId';
import * as postsCtrl from './posts.ctrl';

const posts = new Router();

posts.get('/', checkLoggedIn, postsCtrl.list);
posts.post('/', checkLoggedIn, postsCtrl.write);
posts.get('/:id', checkLoggedIn, checkObjectId, postsCtrl.read);
posts.delete('/:id', checkLoggedIn, checkObjectId, postsCtrl.remove);
// posts.put('/:id', postsCtrl.replace);
posts.patch('/:id', checkLoggedIn, checkObjectId, postsCtrl.update);

export default posts;
