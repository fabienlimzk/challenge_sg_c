const mongoose = require("mongoose");

var listSchema = new mongoose.Schema(
  {
    items: [
      {
        name: String,
        quantity: Number
      }
    ],
    deliveryDate: Date,
    status: {
      type: String,
      enum: ["free", "inProgress", "fulfilled"],
      default: "free"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

const List = mongoose.model("List", listSchema);

module.exports = List;