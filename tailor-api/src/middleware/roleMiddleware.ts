export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req, res, next) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (!allowedRoles.includes(user.role)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
};