const mongoose = require("mongoose");

const adminNotificationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["created"], required: true },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    // A notification is read independently by each admin account.
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

module.exports = mongoose.model("AdminNotification", adminNotificationSchema);
