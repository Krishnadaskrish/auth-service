import { dbGet, dbRun } from "../config/db.js";
import * as queries from "../queries/authQueries.js";

export class AuthRepository {
  static async findByEmail(email) {
    return dbGet(queries.FIND_BY_EMAIL, [email]);
  }

  static async create(email, passwordHash) {
    return dbRun(queries.CREATE_CREDENTIALS, [email, passwordHash]);
  }

  static async deleteByEmail(email) {
    return dbRun(queries.DELETE_BY_EMAIL, [email]);
  }
}
