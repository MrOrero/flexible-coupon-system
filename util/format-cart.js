exports.formatCartItems = products => {
    const p = JSON.stringify(products, null, 2);
    const formatedProducts = JSON.parse(p);
    let total_price = 0;
    formatedProducts.forEach(product => {
        total_price += product.item_price;
    });
    return [...formatedProducts, { total_price }];
};

exports.calculateTotalPrice = cart => {
    let total_price = 0;
    cart.forEach(item => {
        total_price += item.item_price;
    });
    return total_price;
};
