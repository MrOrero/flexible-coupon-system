class format {
    static formatCartItems = products => {
        const p = JSON.stringify(products, null, 2);
        const formatedProducts = JSON.parse(p);
        let total_price = 0;
        formatedProducts.forEach(product => {
            total_price += product.item_price;
        });
        return [...formatedProducts, { total_price }];
    };

    static calculateTotalPrice = cart => {
        let total_price = 0;
        cart.forEach(item => {
            total_price += item.item_price;
        });
        return total_price;
    };

    static formatQuery = args => {
        const p = JSON.stringify(args, null, 2);
        const result = JSON.parse(p);
        return result;
    };
}

module.exports = format;
