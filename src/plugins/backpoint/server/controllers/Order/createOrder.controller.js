module.exports = ({ strapi }) => ({
    async createOrder(ctx) {
        try {
            var requestedOrder = ctx.request.body['data'];
            if(await this.checkBodyValidity(requestedOrder)){

                var products = await this.convertProducts(requestedOrder['items']);

                var result = await strapi.entityService.create('api::order.order', {
                    data: {
                        items: products,
                        deliveryType: requestedOrder['deliveryType']==1? "Take Away": "Eat here",
                        pickUpDate: requestedOrder['pickUpDate'],
                    }
                });
            }
            
            

            ctx.body = result;
        }catch(err){
            console.log(err);
            ctx.status = 400;
            ctx.response.message = err.message;
            
        }
    },

    async checkBodyValidity(json){
        if(json['items']==null) throw Error('No Items given');
        if(json['items'].length<=0) throw Error('No Products given');
        for(var product of json['items']){
            if(product['productID']==null) throw Error('No Product ID given');
            var result = await strapi.entityService.findOne('api::product.product', product['productID']);
            if(result==null) throw Error('Product not found');
        }
        if(json['deliveryType']!=1 && json['deliveryType']!=2) throw Error('Invalid Delivery Type given');
        if(json['pickUpDate']==null) throw Error('Invalid Pick Up Date');
        return true;  
    },

    async convertProducts(json){
        var result = [];
        for(var product of json){
            var obj =  await strapi.entityService.findOne('api::product.product', product['productID']);
            result.push(
                {
                    product: obj,
                    customerDescription: product['customerDescription']
                }
            );
        }
        return result;
    }
  });