export const FIND_BY_EMAIL = `
  SELECT * FROM credentials WHERE email = ?
`;

export const CREATE_CREDENTIALS = `
  INSERT INTO credentials (email, password_hash) VALUES (?, ?)
`;

export const DELETE_BY_EMAIL = `
  DELETE FROM credentials WHERE email = ?
`;
