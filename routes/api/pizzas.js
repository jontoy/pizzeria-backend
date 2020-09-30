/** API routes for pizzas. */

const express = require("express");
const ExpressError = require("../../helpers/expressError");
const router = express.Router();
const Pizza = require("../../models/pizza");

/** GET / => {orders: [{id, createdAt, total}, ...]} */

router.get("/", async function (req, res, next) {
  try {
    const pizzas = await Pizza.getAll();
    return res.json({ pizzas });
  } catch (err) {
    return next(err);
  }
});

/** POST / => {tag: newOrderData} */

router.post("/", async function (req, res, next) {
  try {
    const { name, price } = req.body;
    if (!(Number(price) > 0))
      throw new ExpressError("Price must be positive", 400);
    const pizza = await Pizza.create({ name, price });
    return res.status(201).json({ pizza });
  } catch (err) {
    return next(err);
  }
});

/** GET /[pizzaId] => {pizza: {id, name, price}} */

router.get("/:pizzaId", async function (req, res, next) {
  try {
    const pizza = await Pizza.getById(req.params.pizzaId);
    return res.json({ pizza });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[pizzaId] => {pizza: {id, name, price}} */

router.patch("/:pizzaId", async function (req, res, next) {
  try {
    const pizza = await Pizza.getById(req.params.pizzaId);
    const { name, price } = req.body;
    if (!(Number(price) > 0))
      throw new ExpressError("Price must be positive", 400);
    pizza.name = name || pizza.name;
    pizza.price = price || pizza.price;
    await pizza.sync();
    return res.json({ pizza });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[pizzaId]  =>  {message: "Pizza [pizzaId] deleted"}  */

router.delete("/:pizzaId", async function (req, res, next) {
  try {
    const pizza = await Pizza.getById(req.params.pizzaId);
    await pizza.remove();
    return res.json({ message: `Pizza ${pizza.id} deleted.` });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
