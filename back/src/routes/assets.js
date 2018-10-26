module.exports = ctx => {
  const token = ctx.header.authorization;
  jwt.verify(token, 'shhhhh', function(err, decoded) {
    if (err) {
      ctx.body = JSON.stringify(err);
    } else {
      ctx.body = JSON.stringify(decoded);
    }
  });
}