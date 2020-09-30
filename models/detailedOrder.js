const OrderDataAccess = require("../dataAccess/order");
const OrderItemsDataAccess = require("../dataAccess/orderItem");
const ExpressError = require("../helpers/expressError");
const Order = require("./order");

class DetailedOrder extends Order {
  constructor({ id, createdAt, total = 0, items = [] }) {
    super({ id, createdAt, total });
    this.items = items;
  }
  updateTotal() {
    let total = 0;
    for (let i = 0; i < this.items.length; i++) {
      const { price, quantity } = this.items[i];
      total += price * quantity;
    }
    this.total = total;
  }
  async setPizzaQuantity(pizza, quantity) {
    const item = this.items.find((item) => item.id === pizza.id);
    if (!item) {
      await OrderItemsDataAccess.create({
        orderId: this.id,
        pizzaId: pizza.id,
        quantity,
      });
      this.items.push({ ...pizza, quantity });
    } else if (quantity === 0) {
      await OrderItemsDataAccess.delete(this.id, item.id);
      this.items = this.items.filter((item) => item.id !== pizza.id);
    } else {
      console.log(
        await OrderItemsDataAccess.update(this.id, item.id, quantity),
        "response"
      );
      this.items = this.items.map((item) =>
        item.id === pizza.id ? { ...item, quantity } : item
      );
    }
    this.updateTotal();
    return this;
  }
  static async create() {
    const orderData = await OrderDataAccess.create();
    return new DetailedOrder(orderData);
  }
  static async getById(id) {
    const orderData = await OrderDataAccess.getOne(id);
    if (!orderData)
      throw new ExpressError(`No order exists with id ${id}`, 404);
    return new DetailedOrder(orderData);
  }
}

module.exports = DetailedOrder;
