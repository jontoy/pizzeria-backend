/** View routes for orders. */

const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const DetailedOrder = require("../models/detailedOrder");
const Pizza = require("../models/pizza");

/** Display list of existing orders */
router.get("/", async function (req, res, next) {
  try {
    const orders = await Order.getAll();
    return res.render("order_list.html", { orders });
  } catch (err) {
    return next(err);
  }
});

/** Handle adding a new order. */

router.post("/new/", async function (req, res, next) {
  try {
    const order = await Order.create();
    return res.redirect(`/${order.id}/`);
  } catch (err) {
    return next(err);
  }
});

/** Show an order, given its ID. */

router.get("/:id/", async function (req, res, next) {
  try {
    const order = await DetailedOrder.getById(req.params.id);
    const pizzas = await Pizza.getAll();
    return res.render("order_detail.html", { order, pizzas });
  } catch (err) {
    return next(err);
  }
});

/** Handle editing an order. */

router.post("/:id/edit/", async function (req, res, next) {
  try {
    const order = await DetailedOrder.getById(req.params.id);
    const pizza = await Pizza.getById(req.body.pizzaId);
    const result = await order.setPizzaQuantity(
      pizza,
      Number(req.body.quantity)
    );
    return res.redirect(`/${order.id}/`);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
