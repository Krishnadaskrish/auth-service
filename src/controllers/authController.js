import { AuthService } from "../services/authService.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    const data = await AuthService.login(email, password);
    res.json({
      message: "Login successful",
      ...data,
    });
  } catch (error) {
    console.error("[AUTH CONTROLLER] Login error:", error.message || error);
    const status = error.status || 500;
    const message = error.message || "Internal server error";
    res.status(status).json({ error: message });
  }
};

// Internal API: Register new credentials
export const registerCredentials = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    const result = await AuthService.registerCredentials(email, password);
    res.status(201).json(result);
  } catch (error) {
    console.error("[AUTH CONTROLLER] Internal registration error:", error.message || error);
    const status = error.status || 500;
    const message = error.message || "Internal server error";
    res.status(status).json({ error: message });
  }
};

// Internal API: Delete credentials
export const deleteCredentials = async (req, res) => {
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  try {
    const result = await AuthService.deleteCredentials(email);
    res.json(result);
  } catch (error) {
    console.error("[AUTH CONTROLLER] Internal delete error:", error.message || error);
    const status = error.status || 500;
    const message = error.message || "Internal server error";
    res.status(status).json({ error: message });
  }
};
