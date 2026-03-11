const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    fullName: { type: String, default: "" },
    avatarUrl: { type: String, default: "https://i.sstatic.net/l60Hf.png" },
    status: { type: Boolean, default: false },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }, // Tham chiếu tới Role
    loginCount: { type: Number, default: 0, min: 0 },
    isDeleted: { type: Boolean, default: false } // Phục vụ xóa mềm
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);