module.exports = [
  {
    method: 'GET',
    path: '/openOrders',
    handler: 'getOrderController.getOpenOrders',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'POST',
    path: '/createOrder',
    handler: 'createOrderController.createOrder',
    config: {
      policies: [],
      auth: false
    },
  },
  {
    method: 'PUT',
    path: '/updateOrder',
    handler: 'updateOrderController.updateOrder',
    config: {
      policies: [],
      auth: false
    },
  },
];
