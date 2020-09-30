const db = require("../db");

/** The data access layer relating to pizza queries */
class OrderItem {
  /** Returns list of basic order item info:
   *
   * [{order_id, pizza_id, quantity}, ...]
   * */
  static async getAll({ orderId }) {
    const results = await db.query(
      `SELECT order_id, pizza_id, quantity FROM orderitems`
    );
    return results.rows;
  }

  static async getAll({ orderId, pizzaId }) {
    let baseQuery = `SELECT order_id, pizza_id, quantity FROM orderitems`;
    const whereExpressions = [];
    const queryValues = [];
    if (orderId && orderId.length > 0) {
      queryValues.push(orderId);
      whereExpressions.push(`order_id = $${queryValues.length}`);
    }
    if (pizzaId && pizzaId.length > 0) {
      queryValues.push(pizzaId);
      whereExpressions.push(`pizza_id = $${queryValues.length}`);
    }
    if (whereExpressions.length > 0) {
      baseQuery += " WHERE ";
    }
    const finalQuery = baseQuery + whereExpressions.join(" AND ");
    const results = await db.query(finalQuery, queryValues);
    return results.rows.map(({ order_id, pizza_id, quantity }) => ({
      orderId: order_id,
      pizzaId: pizza_id,
      quantity,
    }));
  }

  /** Creates an order item and returns order item info: {order_id, pizza_id, quantity} **/
  static async create({ orderId, pizzaId, quantity = 1 }) {
    const result = await db.query(
      `INSERT INTO orderitems (order_id, pizza_id, quantity) 
        VALUES ($1, $2, $3) 
        RETURNING order_id, pizza_id, quantity`,
      [orderId, pizzaId, quantity]
    );
    const orderItem = result.rows[0];
    OrderItem.deserialize(orderItem);
    return orderItem;
  }

  /** Returns pizza info: {id, name, price} **/

  static async getOne(orderId, pizzaId) {
    const result = await db.query(
      `SELECT order_id, pizza_id, quantity FROM orderitems
        WHERE order_id = $1 AND pizzaId = $2`,
      [orderId, pizzaId]
    );
    const orderItem = result.rows[0];
    if (orderItem) {
      OrderItem.deserialize(orderItem);
    }
    return orderItem;
  }

  static async update(orderId, pizzaId, quantity) {
    console.log(orderId, pizzaId, quantity);
    const result = await db.query(
      `UPDATE orderitems
            SET quantity = $3
            WHERE order_id = $1 AND pizza_id = $2
            RETURNING order_id, pizza_id, quantity`,
      [orderId, pizzaId, quantity]
    );

    const orderItem = result.rows[0];
    if (orderItem) {
      OrderItem.deserialize(orderItem);
    }
    return orderItem;
  }

  /** Deletes pizza. Returns true.  **/
  static async delete(orderId, pizzaId) {
    const result = await db.query(
      `DELETE FROM orderitems 
        WHERE order_id = $1 AND pizza_id = $2
        RETURNING order_id, pizza_id`,
      [orderId, pizzaId]
    );
    return true;
  }
  static deserialize(orderItem) {
    orderItem.orderId = orderItem.order_id;
    orderItem.pizzaId = orderItem.pizza_id;
    delete orderItem.order_id;
    delete orderItem.pizza_id;
  }
}

module.exports = OrderItem;
