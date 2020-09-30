const db = require("../db");

/** The data access layer relating to pizza queries */
class Pizza {
  /** Returns list of basic pizza info:
   *
   * [{id, name, price}, ...]
   * */
  static async getAll() {
    const results = await db.query(`SELECT id, name, price FROM pizzas`);
    return results.rows;
  }

  /** Creates a pizza and returns pizza info: {id, name, price} **/
  static async create({ name, price }) {
    const result = await db.query(
      `INSERT INTO pizzas (name, price) VALUES ($1, $2) RETURNING id, name, price`,
      [name, price]
    );
    const pizza = result.rows[0];
    return pizza;
  }

  /** Returns pizza info: {id, name, price} **/

  static async getOne(id) {
    const result = await db.query(
      `SELECT id, name, price FROM pizzas
        WHERE id = $1`,
      [id]
    );
    const pizza = result.rows[0];
    return pizza;
  }

  static async update(id, name, price) {
    const result = await db.query(
      `UPDATE pizzas
            SET name = $2 AND price = $3
            WHERE id = $1`,
      [id, name, price]
    );

    const pizza = result.rows[0];
    return pizza;
  }

  /** Deletes pizza. Returns true.  **/
  static async delete(id) {
    const result = await db.query(
      `DELETE FROM pizzas 
        WHERE id = $1
        RETURNING id`,
      [id]
    );
    return true;
  }
}

module.exports = Pizza;
