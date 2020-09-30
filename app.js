/** Express app for the Pizzaria API. */

const express = require("express");

const ExpressError = require("./helpers/expressError");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// Parse body for urlencoded (non-JSON) data
app.use(bodyParser.urlencoded({ extended: false }));

nunjucks.configure("templates", {
  autoescape: true,
  express: app,
});

const ordersApiRoutes = require("./routes/api/orders");
const pizzasApiRoutes = require("./routes/api/pizzas");
const ordersViewRoutes = require("./routes/orders");

app.use("/api/orders", ordersApiRoutes);
app.use("/api/pizzas", pizzasApiRoutes);
app.use("/", ordersViewRoutes);

app.get("/", (req, res, next) => {
  return res.json({ message: "Welcome to the Pizzaria API" });
});

/** 404 handler */

app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);

  // pass the error to the next piece of middleware
  return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  console.error(err.stack);
  return res.json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
