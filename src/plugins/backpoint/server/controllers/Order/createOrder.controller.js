module.exports = ({ strapi }) => ({
    async createOrder(ctx) {
        try {
            var requestedOrder = ctx.request.body['data'];
            var validate = this.validateBody(requestedOrder);
            console.log(validate);
            if(validate!=null) throw Error(validate);
            
            var result = await strapi.entityService.create('api::order.order', {
                data: {
                    items: await this.convertProducts(requestedOrder['items']),
                    deliveryType: requestedOrder['deliveryType']==1? "Take Away": "Eat here",
                    pickUpDate: requestedOrder['pickUpDate'],
                }
            });
            
            
            strapi.io.emit('openOrders', JSON.stringify({action: 'New Order', result}));

            ctx.body = result;
        }catch(err){
            console.log(err);
            ctx.status = 400;
            ctx.response.message = JSON.stringify({
                "error": {
                    "message": err.message
                }
            });
        }
    },
    
    async checkProductValidity(product){
        var result = await strapi.entityService.findOne(
            'api::product.product', 
            product.productID,
            {
                select: ["ID", "Name", "Status", "Price","Description"]
            }
        );
        if(result==null) throw Error('Product not found');
        if(result['Status']!="Available") throw Error('Product not available');
        return result;  
    },

    validateBody(input) {
        // Check if the input is an object
        if (typeof input !== 'object' || input === null) {
          return 'Input must be an object.';
        }
      
        // Validate the 'items' property
        if (!Array.isArray(input.items) || input.items.length === 0) {
          return 'The "items" property must be a non-empty array.';
        }
      
        // Validate each item in the 'items' array
        for (let i = 0; i < input.items.length; i++) {
          const item = input.items[i];
          if (
            typeof item !== 'object' ||
            !item.productID ||
            !Array.isArray(item.selectedIngredients) ||
            !Array.isArray(item.selectedExtras)
          ) {
            return `Item at index ${i} in the "items" array has an invalid structure.`;
          }
      
          // Validate 'selectedIngredients' array
          for (let j = 0; j < item.selectedIngredients.length; j++) {
            const ingredient = item.selectedIngredients[j];
            if (
              typeof ingredient !== 'object' ||
              typeof ingredient.Name !== 'string' ||
              typeof ingredient.Selected !== 'boolean' ||
              typeof ingredient.Default !== 'boolean'
            ) {
              return `Ingredient at index ${j} in the "selectedIngredients" array of item at index ${i} has an invalid structure.`;
            }
          }
      
          // Validate 'selectedExtras' array
          for (let k = 0; k < item.selectedExtras.length; k++) {
            const extra = item.selectedExtras[k];
            if (typeof extra !== 'object' || typeof extra.Name !== 'string') {
              return `Extra at index ${k} in the "selectedExtras" array of item at index ${i} has an invalid structure.`;
            }
          }
        }
      
        // Validate 'deliveryType', 'pickUpDate', and 'orderDescription'
        if (
          input.deliveryType !== 1 &&
          input.deliveryType !== 2 &&
          !(input.pickUpDate instanceof Date) ||
          (typeof input.orderDescription !== 'string'&& input.orderDescription!=null)
        ) {
          return 'The "deliveryType", "pickUpDate", or "orderDescription" properties are invalid.';
        }
      
        // If all checks pass, the input is valid
        return null; // No error message
      },

    async convertProducts(json){
        var result = [];
        for(var product of json){
            var obj = await this.checkProductValidity(product);
            if(product==null) throw Error('Product not found');
            result.push(
                {
                    product: obj,
                    selectedIngredients: product['selectedIngredients'],
                    selectedExtras: product['selectedExtras'],
                    customerDescription: product['customerDescription']
                }
            );
        }
        return result;
    }
  });