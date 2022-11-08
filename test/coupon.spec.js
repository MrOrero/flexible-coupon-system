const { expect } = require("chai");
const sinon = require("sinon");
const Cart = require("../models/cart");
const Coupon = require("../models/coupon");
const { addCoupon, deleteCoupon, getCoupon, useCoupon } = require("../controllers/coupon");
const format = require("../util/format");

describe("Coupon controller - getCoupon", function () {
    this.afterEach(function () {
        Coupon.findAll.restore();
    });

    it("should throw an error with 404 status code if there are no coupons", function (done) {
        sinon.stub(Coupon, "findAll");
        Coupon.findAll.resolves([]);
        getCoupon({}, {}, () => {}).then(result => {
            expect(result).to.be.an("error");
            expect(result).to.have.property("statusCode", 404);
            done();
        });
    });

    it("should return a 200 status code if there are coupons", function (done) {
        sinon.stub(Coupon, "findAll");
        Coupon.findAll.returns(["percent10", "fixed10"]);

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
        getCoupon({}, res, () => {}).then(() => {
            expect(res.statusCode).to.be.equal(200);
            done();
        });
    });
});

describe("Coupon controller - addCoupon", function () {
    this.afterEach(function () {
        Coupon.findOne.restore();
    });

    this.afterAll(function () {
        Coupon.create.restore();
    });

    it("should throw an error with 403 status code if coupon already exists", function (done) {
        sinon.stub(Coupon, "findOne");
        Coupon.findOne.resolves([]);

        const req = {
            body: {},
        };
        addCoupon(req, {}, () => {}).then(result => {
            expect(result).to.be.an("error");
            expect(result).to.have.property("statusCode", 403);
            done();
        });
    });

    it("should return a 201 status code if coupon does not exist already and is created successfully", function (done) {
        sinon.stub(Coupon, "findOne");
        sinon.stub(Coupon, "create");
        Coupon.findOne.returns(null);
        Coupon.create.resolves();

        const req = {
            body: {
                couponName: "percent20",
                rules: {
                    totalPriceLimit: "200",
                    totalItemLimit: "3",
                },
                discount: {
                    type: "percent",
                    amount: "20",
                },
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
        addCoupon(req, res, () => {}).then(result => {
            expect(res.statusCode).to.be.equal(201);
            done();
        });
    });
});

describe("Coupon controller - deleteCoupon", function () {
    this.afterEach(function () {
        Coupon.findOne.restore();
    });

    this.afterAll(function () {
        Coupon.findAll.restore();
        Coupon.destroy.restore();
    });

    it("should throw an error with 404 status code if coupon doesn't exist", function (done) {
        sinon.stub(Coupon, "findOne");
        Coupon.findOne.resolves(null);

        const req = {
            params: {
                couponName: "NOEXIST",
            },
        };
        deleteCoupon(req, {}, () => {}).then(result => {
            expect(result).to.be.an("error");
            expect(result).to.have.property("statusCode", 404);
            done();
        });
    });

    it("should return a 200 status code if coupon exists and is deleted successfully", function (done) {
        sinon.stub(Coupon, "findOne");
        sinon.stub(Coupon, "destroy");
        sinon.stub(Coupon, "findAll");
        Coupon.findOne.returns(["book"]);
        Coupon.destroy.resolves();
        Coupon.findAll.returns(["book", "john"]);

        const req = {
            params: {
                couponName: "PERCENT10",
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
        deleteCoupon(req, res, () => {}).then(result => {
            expect(res.statusCode).to.be.equal(200);
            done();
        });
    });
});

describe("Coupon controller - useCoupon", function () {
    this.afterAll(function () {
        Coupon.findOne.restore();
    });

    it("should throw an error with 404 status code if coupon doesn't exist", function (done) {
        sinon.stub(Coupon, "findOne");
        Coupon.findOne.resolves(null);

        const req = {
            body: {
                couponName: "NOEXIST",
            },
        };
        useCoupon(req, {}, () => {}).then(result => {
            expect(result).to.be.an("error");
            expect(result).to.have.property("statusCode", 404);
            done();
        });
    });
});
