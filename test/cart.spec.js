const { expect } = require("chai");
const sinon = require("sinon");
const Cart = require("../models/cart");
const { addtoCart, deleteCartItem, getCart } = require("../controllers/cart");

describe("Cart controller - getCart", function () {
    this.afterEach(function () {
        Cart.findAll.restore();
    });

    it("should throw an error with 404 status code if there are no products in cart", function (done) {
        sinon.stub(Cart, "findAll");
        Cart.findAll.resolves([]);
        getCart({}, {}, () => {}).then(result => {
            expect(result).to.be.an("error");
            expect(result).to.have.property("statusCode", 404);
            done();
        });
    });

    it("should return a 200 status code if there are products in cart", function (done) {
        sinon.stub(Cart, "findAll");
        Cart.findAll.returns(["book", "john"]);

        const res = {
            statusCode: 500,
            userStatus: null,
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                this.userStatus = data.status;
            },
        };
        getCart({}, res, () => {}).then(() => {
            expect(res.statusCode).to.be.equal(200);
            done();
        });
    });
});

describe("Cart controller - addtoCart", function () {
    this.afterEach(function () {
        Cart.findOne.restore();
    });

    this.afterAll(function () {
        Cart.findAll.restore();
        Cart.create.restore();
    });

    it("should throw an error with 403 status code if item already exists", function (done) {
        sinon.stub(Cart, "findOne");
        Cart.findOne.resolves([]);

        const req = {
            body: {
                itemName: "paper",
                itemPrice: "5",
            },
        };
        addtoCart(req, {}, () => {}).then(result => {
            expect(result).to.be.an("error");
            expect(result).to.have.property("statusCode", 403);
            done();
        });
    });

    it("should return a 201 status code if item does not exist already and is created successfully", function (done) {
        sinon.stub(Cart, "findOne");
        sinon.stub(Cart, "create");
        sinon.stub(Cart, "findAll");
        Cart.findOne.returns(null);
        Cart.create.resolves();
        Cart.findAll.returns(["book", "john"]);

        const req = {
            body: {
                itemName: "paper",
                itemPrice: "5",
            },
        };

        const res = {
            statusCode: 500,
            userStatus: null,
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                this.userStatus = data.status;
            },
        };
        addtoCart(req, res, () => {}).then(result => {
            expect(res.statusCode).to.be.equal(201);
            done();
        });
    });
});

describe("Cart controller - deleteCartItem", function () {
    this.afterEach(function () {
        Cart.findOne.restore();
    });

    this.afterAll(function () {
        Cart.findAll.restore();
        Cart.destroy.restore();
    });

    it("should throw an error with 404 status code if item doesn't exist", function (done) {
        sinon.stub(Cart, "findOne");
        Cart.findOne.resolves(null);

        const req = {
            params: {
                itemName: "paper",
            },
        };
        deleteCartItem(req, {}, () => {}).then(result => {
            expect(result).to.be.an("error");
            expect(result).to.have.property("statusCode", 404);
            done();
        });
    });

    it("should return a 200 status code if item exists and is deleted successfully", function (done) {
        sinon.stub(Cart, "findOne");
        sinon.stub(Cart, "destroy");
        sinon.stub(Cart, "findAll");
        Cart.findOne.returns(["book"]);
        Cart.destroy.resolves();
        Cart.findAll.returns(["book", "john"]);

        const req = {
            params: {
                itemName: "paper",
            },
        };

        const res = {
            statusCode: 500,
            userStatus: null,
            status: function (code) {
                this.statusCode = code;
                return this;
            },
            json: function (data) {
                this.userStatus = data.status;
            },
        };
        deleteCartItem(req, res, () => {}).then(result => {
            expect(res.statusCode).to.be.equal(200);
            done();
        });
    });
});
