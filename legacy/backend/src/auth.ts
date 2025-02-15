import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      console.error(err)
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
