const OrderDataAccess = require("../dataAccess/order");

class Order {
  constructor({ id, createdAt, total = 0 }) {
    this.id = id;
    this.createdAt = createdAt;
    this.total = Number(total);
  }
  incrementTotal(delta) {
    this.total += delta;
  }
  calculateDiscount() {
    let discount = 0;
    if (this.total > 200) {
      discount = 0.2;
    } else if (this.total > 150) {
      discount = 0.15;
    } else if (this.total > 100) {
      discount = 0.1;
    } else if (this.total > 50) {
      discount = 0.05;
    }
    return discount;
  }
  calculateDiscountedTotal() {
    return Math.trunc(100 * this.total * (1 - this.calculateDiscount())) / 100;
  }
  async remove() {
    await OrderDataAccess.delete(this.id);
  }

  static async create() {
    const orderData = await OrderDataAccess.create();
    return new Order(orderData);
  }

  static async getAll() {
    const ordersData = await OrderDataAccess.getAll();
    return ordersData.map((order) => new Order(order));
  }
}

module.exports = Order;
