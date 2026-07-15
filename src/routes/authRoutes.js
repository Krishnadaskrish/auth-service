import { Router } from "express";
import { login, registerCredentials, deleteCredentials } from "../controllers/authController.js";

const router = Router();

router.post("/login", login);
router.post("/register", registerCredentials);
router.delete("/credentials/:email", deleteCredentials);

export default router;
