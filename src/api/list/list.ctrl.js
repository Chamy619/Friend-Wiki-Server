import User from '../../models/users';
import Post from '../../models/post';

export const makeList = async (ctx) => {
  const [users, posts] = await Promise.all([User.find().exec(), Post.find().exec()]);

  const userPostList = {};

  users.forEach((user) => {
    userPostList[user.username] = [];
  });

  posts.forEach((post) => {
    const userPost = {
      id: post._id,
      title: post.title,
    };

    if (userPostList[post.owner]) {
      userPostList[post.owner].push(userPost);
    }
  });

  ctx.body = userPostList;
};
