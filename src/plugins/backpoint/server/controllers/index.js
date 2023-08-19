'use strict';

const myController = require('./my-controller');
const createOrderController = require('./Order/createOrder.controller');
const updateOrderController = require('./Order/updateOrder.controller');
const getOrderController = require('./Order/getOrder.controller');
module.exports = {
  myController,
  createOrderController,
  updateOrderController,
  getOrderController
};
