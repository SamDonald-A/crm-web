const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add the username"]
    },
    email: {
        type: String,
        required: [true, "Please add the user email"],
        unique: [true, "Email address already registered"]
    },
    password: {
        type: String,
        required: [true, "Please add the user password"],
    },
    profilePicture: {
        type: String,
        default: "",
    }
},
{
    timeStamps: true,
}
);

module.exports = mongoose.model("User", userSchema);