const express = require('express');
const router = express.Router();
const Role = require('../schemas/roles');

// 1. GET ALL: Lấy danh sách Role (loại bỏ các role đã xóa mềm)
router.get('/', async (req, res) => {
    try {
        const roles = await Role.find({ isDeleted: false });
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. GET BY ID: Lấy chi tiết 1 Role
router.get('/:id', async (req, res) => {
    try {
        const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) return res.status(404).json({ message: "Role không tồn tại" });
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ message: "ID không hợp lệ" });
    }
});

// 3. CREATE: Tạo mới Role
router.post('/', async (req, res) => {
    try {
        const newRole = new Role({
            name: req.body.name,
            description: req.body.description
        });
        const savedRole = await newRole.save();
        res.status(201).json(savedRole);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 4. UPDATE: Cập nhật thông tin Role
router.put('/:id', async (req, res) => {
    try {
        const updatedRole = await Role.findByIdAndUpdate(
            req.params.id, 
            { ...req.body }, 
            { new: true }
        );
        if (!updatedRole) return res.status(404).json({ message: "Role không tồn tại" });
        res.status(200).json(updatedRole);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 5. DELETE (Xóa mềm): Update isDeleted thành true
router.delete('/:id', async (req, res) => {
    try {
        const deletedRole = await Role.findByIdAndUpdate(
            req.params.id, 
            { isDeleted: true }, 
            { new: true }
        );
        if (!deletedRole) return res.status(404).json({ message: "Role không tồn tại" });
        res.status(200).json({ message: "Đã xóa mềm Role thành công" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// 4. GET /roles/:id/users: Lấy tất cả user thuộc về một Role ID cụ thể
router.get('/:id/users', async (req, res) => {
    try {
        const roleId = req.params.id;
        const User = require('../schemas/users'); // Import schema User để truy vấn

        // Tìm tất cả user có field role khớp với roleId và chưa bị xóa mềm
        const users = await User.find({ role: roleId, isDeleted: false });

        if (users.length === 0) {
            return res.status(200).json({ message: "Không có user nào thuộc role này", data: [] });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "ID Role không hợp lệ hoặc lỗi server" });
    }
});
module.exports = router;