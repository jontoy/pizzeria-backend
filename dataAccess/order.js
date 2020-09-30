const db = require("../db");

/** The data access layer relating to order queries */
class Order {
  /** Returns list of basic order info:
   *
   * [{id, createdAt, total}, ...]
   * */
  static async getAll() {
    const results = await db.query(`SELECT o.id, o.created_at, SUM(oi.quantity*p.price) AS total 
    FROM orders o 
    LEFT JOIN orderitems oi ON o.id = oi.order_id
    LEFT JOIN pizzas p ON oi.pizza_id = p.id
    GROUP BY o.id
    ORDER BY created_at DESC`);

    return results.rows.map(({ id, created_at, total }) => ({
      id,
      createdAt: created_at,
      total,
    }));
  }

  /** Creates a order and returns order info: {id, createdAt, total} **/
  static async create() {
    const result = await db.query(
      `INSERT INTO orders 
            DEFAULT VALUES 
            RETURNING
            id, created_at`
    );
    const order = result.rows[0];
    Order.deserialize(order);
    order.total = 0;
    return order;
  }

  /** Returns order info: {id, name}
   *
   * If order cannot be found, raises a 404 error.
   *
   **/
  static async getOne(id) {
    const result = await db.query(
      `SELECT o.id, o.created_at, 
            SUM(oi.quantity*p.price) AS total, 
            JSON_AGG((p.id, p.name, p.price, oi.quantity)) AS items 
        FROM orders o 
        LEFT JOIN orderitems oi ON o.id = oi.order_id
        LEFT JOIN pizzas p ON oi.pizza_id = p.id
        WHERE o.id = $1
        GROUP BY o.id`,
      [id]
    );
    const order = result.rows[0];

    if (order) {
      Order.deserialize(order);
      order.items = order.total
        ? order.items.map(({ f1, f2, f3, f4 }) => ({
            id: f1,
            name: f2,
            price: f3,
            quantity: f4,
          }))
        : [];
    }
    return order;
  }

  /** Deletes order. Returns true.
   *
   * If order cannot be found, raises a 404 error.
   *
   **/
  static async delete(id) {
    const result = await db.query(
      `DELETE FROM orders 
        WHERE id = $1
        RETURNING id`,
      [id]
    );
    return true;
  }
  static deserialize(order) {
    order.createdAt = order.created_at;
    delete order.created_at;
  }
}

module.exports = Order;
