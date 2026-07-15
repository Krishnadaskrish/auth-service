import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../repositories/authRepository.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-super-secret-key-999";

export class AuthService {
  static async login(email, password) {
    const cred = await AuthRepository.findByEmail(email);
    if (!cred) throw { status: 401, message: "Invalid credentials" };

    const match = await bcrypt.compare(password, cred.password_hash);
    if (!match) throw { status: 401, message: "Invalid credentials" };

    const token = jwt.sign(
      { userId: cred.id, email: cred.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { token, user: { id: cred.id, email: cred.email } };
  }

  static async registerCredentials(email, password) {
    const existing = await AuthRepository.findByEmail(email);
    if (existing) throw { status: 409, message: "Credentials already exist" };

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await AuthRepository.create(email, hash);
    return { message: "Credentials registered successfully" };
  }

  static async deleteCredentials(email) {
    const existing = await AuthRepository.findByEmail(email);
    if (!existing) throw { status: 404, message: "Credentials not found" };

    await AuthRepository.deleteByEmail(email);
    return { message: "Credentials deleted successfully" };
  }
}
