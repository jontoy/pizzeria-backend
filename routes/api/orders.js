/** API routes for orders. */

const express = require("express");
const router = express.Router();
const Order = require("../../models/order");
const DetailedOrder = require("../../models/detailedOrder");

/** GET / => {orders: [{id, createdAt, total}, ...]} */

router.get("/", async function (req, res, next) {
  try {
    const orders = await Order.getAll();
    return res.json({ orders });
  } catch (err) {
    return next(err);
  }
});

/** POST / => {tag: newOrderData} */

router.post("/", async function (req, res, next) {
  try {
    const order = await DetailedOrder.create();
    return res.status(201).json({ order });
  } catch (err) {
    return next(err);
  }
});

/** GET /[orderId] => {order: {orderId, createdAt, total, items:[{pizzaId, name, price, quantity}]}} */

router.get("/:orderId", async function (req, res, next) {
  try {
    const order = await DetailedOrder.getById(req.params.orderId);
    return res.json({ order });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[orderId]  =>  {message: "Order [orderId] deleted"}  */

router.delete("/:orderId", async function (req, res, next) {
  try {
    const order = await DetailedOrder.getById(req.params.orderId);
    await order.remove();
    return res.json({ message: `Order ${order.id} deleted.` });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
