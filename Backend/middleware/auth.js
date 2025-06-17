const jwt = require("jsonwebtoken");
const NhanVien = require("../model/NhanVien");
require("dotenv").config();

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const nhanVien = await NhanVien.findById(decoded.payload._id).select(
      "-matKhau -createdAt -updateAt"
    );

    if (!nhanVien || !nhanVien.trangThai) {
      return res.status(401).json({
        success: false,
        message: "NhanVien not found or inactive",
      });
    }

    req.NhanVien = nhanVien;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = {
  authenticateToken,
};
