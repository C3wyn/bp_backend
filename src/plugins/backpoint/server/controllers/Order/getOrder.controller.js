module.exports = ({ strapi }) => ({
    async getOpenOrders(ctx) {
        const orderEntries = await strapi.entityService.findMany('api::order.order', {
            filters: {
                $not: {
                    status: "Done"
                }
            }
        });

        for(var order of orderEntries){
            console.log(order);
            for(var item of order['items']){
                console.log(item);
                let product = await strapi.entityService.findOne('api::product.product');
            }
        }

        ctx.body = orderEntries;
    }
})