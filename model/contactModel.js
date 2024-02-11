const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users",
    },
    name: {
        type: String,
        required: [true, "Please Fill this Filed"]
    },
    phone: {
        type: String,
        required: [true, "Please Fill this Filed"]
    },
    place: {
        type: String,
    },
    email: {
        type: String,
    },
    note: {
        type: String,
      },
    status: {
        type: String,
        enum: ['all', 'inactive', 'follow-up', 'closed', 'today'],
        default: 'all',
      },
    createdDate: {
        type: Date,
      }
},{
    timestamps: true,
});

module.exports = mongoose.model("Contact", contactSchema);