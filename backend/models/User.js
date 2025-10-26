const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    balance: {
        type: Number,
        default: 100000.00,
        min: 0,
        validate: {
            validator: function(value) {
                return !isNaN(value) && isFinite(value);
            },
            message: 'Balance must be a valid number'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add pre-save middleware to handle balance validation
userSchema.pre('save', function(next) {
    // Ensure balance is a valid number
    if (isNaN(this.balance) || !isFinite(this.balance)) {
        this.balance = 100000.00; // Reset to default if invalid
    }
    next();
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);