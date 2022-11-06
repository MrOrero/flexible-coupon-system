exports.formatCartItems = products => {
    const p = JSON.stringify(products, null, 2);
    const formatedProducts = JSON.parse(p);
    let total_price = 0;
    formatedProducts.forEach(product => {
        total_price += product.item_price;
    });
    return [...formatedProducts, { total_price }];
};
