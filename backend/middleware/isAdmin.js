const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Adminrechte erforderlich" });
  }
  next();
};

module.exports = isAdmin;
