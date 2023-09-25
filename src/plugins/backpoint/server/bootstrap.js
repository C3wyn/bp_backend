'use strict';

const { getOrderController } = require('./controllers');

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

    io.on('connection', async (socket) => {
      console.log('a user connected');
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });

    // @ts-ignore
    strapi.io = io;
  });
};
