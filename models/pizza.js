const PizzaDataAccess = require("../dataAccess/pizza");
const ExpressError = require("../helpers/expressError");

class Pizza {
  constructor({ id, name, price }) {
    this.id = id;
    this.name = name;
    this.price = Number(price);
  }

  async sync() {
    await PizzaDataAccess.update(this.id, this.name, this.price);
  }
  async remove() {
    await PizzaDataAccess.delete(this.id);
  }

  static async create({ name, price }) {
    const pizzaData = await PizzaDataAccess.create({ name, price });
    return new Pizza(pizzaData);
  }
  static async getById(id) {
    const pizzaData = await PizzaDataAccess.getOne(id);
    if (!pizzaData)
      throw new ExpressError(`No pizza exists with id ${id}`, 404);
    return new Pizza(pizzaData);
  }
  static async getAll() {
    const pizzasData = await PizzaDataAccess.getAll();
    return pizzasData.map((pizza) => new Pizza(pizza));
  }
}

module.exports = Pizza;
