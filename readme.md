## Flexible Coupon System API

### Introduction

This API implements a new feature for an e-commerce website: flexible coupon system APIs that allow for different discount strategies without requiring major rewrites in the future.

A coupon may have many RULES (conditions to be met) and many DISCOUNT TYPES (benefits). If one rule is not met, the system must reject the coupon. And only one coupon may be applied at any given time.

You can view the live API [here](https://flexible-coupon-system.herokuapp.com/api/).

This api was developed using

-   NodeJs (LTS version 18.3.0)
-   Sequelize ORM (MySQL database)
-   Express
-   JavaScript

## Getting Started

### Prerequisites

The tools listed below are needed to run this application to run effectively:

-   Node (LTS Version)
-   Npm v8.3.1 or above

You can check the Node.js and npm versions by running the following commands.

### Check node.js version

`node -v`

### Check npm version

`npm -v`

## Installation

-   Install project dependencies by running `npm install`.

-   Start the server with `npm start`

-   Access endpoints on your desired localhost set port

## Run the tests

```shell
npm run test
```

All tests are written in the `src/test` directory.

# REST API

The REST API to the _lendsqr app_ is described below.
The base URL is

    http://localhost/api/

The base URL for the live version is

    https://flexible-coupon-system.herokuapp.com/api/

The application comes with 4 coupon codes:

-   FIXED10:
    -   Rules:
        -   cart total price must be greater than $50 before discounts
        -   cart must contain at least 1 item
    -   Discounts: - $10 off total (fixed amount off)
-   PERCENT10:
    -   Rules: - cart total price must be greater than $100 before discounts - cart must contain at least 2 items
    -   Discounts: - %10 off total (percent off)
-   MIXED10
    -   Rules:
        -   cart total price must be greater than $200 before discounts
        -   cart must contain at least 3 items
    -   Discounts:
        -   %10 or $10 (whichever is greatest)
-   REJECTED10
    -   Rules:
        -   cart total price must be greater than $1000 before discounts
    -   Discounts:
        -   $10 off total (fixed amount off)
        -   %10 off total (percent off)

| Method | Description                  | Endpoints          |
| :----- | :--------------------------- | :----------------- |
| GET    | Get cart items               | /api/cart          |
| POST   | Add item to cart             | /api/cart          |
| DELETE | Delete item from cart        | /api/cart          |
| GET    | Get all coupons              | /api/coupon        |
| POST   | Use coupon(applies discount) | /api/coupon        |
| DELETE | Deletes coupon               | /api/coupon        |
| POST   | Creates a new coupon         | /api/coupon/create |

## API documentation

https://documenter.getpostman.com/view/19573425/2s8YeixbJ9

## Postman collection

https://www.getpostman.com/collections/85b764cb19ba4f1262e0

#### Deployed Link

You can [click here](https://flexible-coupon-system.herokuapp.com/api/) to test the api
