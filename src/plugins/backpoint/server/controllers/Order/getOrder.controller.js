module.exports = ({ strapi }) => ({
    async getOpenOrders(ctx) {
        const orderEntries = await strapi.entityService.findMany('api::order.order', {
            
            
            filters: {
                $not: {
                    status: "Done"
                }
            }
        });
        ctx.body = orderEntries;
    }
})