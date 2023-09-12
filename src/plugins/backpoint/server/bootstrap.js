'use strict';

module.exports = ({ strapi }) => {
  // bootstrap phase
  process.nextTick(() =>{
    const { Server } = require('socket.io');
    var io = new Server(strapi.server.httpServer, {
      perMessageDeflate: false,
      
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    // @ts-ignore
    strapi.io = io;
  });
};
