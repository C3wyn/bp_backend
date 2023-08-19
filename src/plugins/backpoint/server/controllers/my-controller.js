'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('backpoint')
      .service('myService')
      .getWelcomeMessage();
  },
});
