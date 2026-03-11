const express = require('express');
const router = express.Router();
const User = require('../schemas/users'); // Import model User

// 1. GET ALL: Có query theo username (includes) và lọc xóa mềm
router.get('/', async (req, res) => {
    try {
        const { username } = req.query;
        let query = { isDeleted: false };

        if (username) {
            // Sử dụng Regex để tìm kiếm "includes" (không phân biệt hoa thường)
            query.username = { $regex: username, $options: 'i' };
        }

        const users = await User.find(query).populate('role');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. GET BY ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
        if (!user) return res.status(404).send("User không tồn tại");
        res.json(user);
    } catch (err) {
        res.status(500).send("ID không hợp lệ");
    }
});

// 3. CREATE (POST)
router.post('/', async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// 4. DELETE (Xóa mềm - Soft Delete)
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { isDeleted: true }, 
            { new: true }
        );
        if (!deletedUser) return res.status(404).send("User không tồn tại");
        res.send("Đã xóa mềm người dùng thành công");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. POST /enable: Kích hoạt user (status -> true)
router.post('/enable', async (req, res) => {
    try {
        const { email, username } = req.body;
        
        // Tìm user khớp cả email và username
        const user = await User.findOneAndUpdate(
            { email: email, username: username, isDeleted: false },
            { status: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "Thông tin email hoặc username không chính xác" });
        }

        res.status(200).json({ message: "Đã kích hoạt trạng thái thành true", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. POST /disable: Vô hiệu hóa user (status -> false)
router.post('/disable', async (req, res) => {
    try {
        const { email, username } = req.body;

        const user = await User.findOneAndUpdate(
            { email: email, username: username, isDeleted: false },
            { status: false },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "Thông tin email hoặc username không chính xác" });
        }

        res.status(200).json({ message: "Đã vô hiệu hóa trạng thái thành false", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = router;