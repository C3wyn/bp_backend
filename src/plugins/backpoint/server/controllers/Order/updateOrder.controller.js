'use strict';

const OrderStatus = [
    "Created",
    "Accepted",
    "In Progress",
    "Done"
]

module.exports = ({ strapi }) => ({
  async updateOrder(ctx) {
    try {
      if(await this.validateRequest(ctx)){
          var result = await strapi.entityService.update('api::order.order', ctx.request.query['id'], {
              data: await this.createUpdateBody(ctx.request.query['id'], ctx.request.body['status'])
          });
      }
      strapi.io.emit('openOrders', JSON.stringify({action: 'Updated Order', result}));
      ctx.body = result;
    }catch(err){
        console.log(err);
        ctx.status = 400;
        ctx.response.message = err.message;
    }
  },

  async createUpdateBody(id, status){
    var updateBody = {};
    var order = await strapi.entityService.findOne('api::order.order', id);
    if(OrderStatus.indexOf(status)==-1) throw Error('Invalid Status was tried to set');
    switch(status) {
        case "Accepted": updateBody['acceptedTime']=Date.now();
        break;
        case "Done": updateBody['finishedTime']=Date.now();
        break;
    }
    updateBody['status']=status;
    console.log(updateBody);
    return updateBody;
  },

  async validateRequest(ctx){
    var id = ctx.request.query['id'];
    var status = ctx.request.body['status'];
    if(id==null) throw Error('No ID given');
    var order = await strapi.entityService.findOne('api::order.order', id);
    if(order == null) throw Error(`No Order with ID: ${id} found.`);
    if(status==null) throw Error('No status given');
    if(OrderStatus.find( x => x === status)) {
        return true;
    }
    throw Error('Invalid format');
  }
});
