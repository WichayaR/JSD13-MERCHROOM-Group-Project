const express = require("express");
const { authUser } = require("../middleware/auth");
const { adminOnly } = require("../middleware/adminOnly");
const controller = require("../controllers/order.controller");
const router = express.Router();
router.post("/", authUser, controller.createOrder);
router.post("/manual", authUser, adminOnly, controller.createManualOrder);
router.get("/me/events", authUser, controller.streamMyOrders);
router.get("/me", authUser, controller.getMyOrders);
router.get("/", authUser, adminOnly, controller.getAllOrders);
router.get("/stats", authUser, adminOnly, controller.getOrderStats);
router.get("/events", authUser, adminOnly, controller.stream);
router.get("/notifications", authUser, adminOnly, controller.getUnreadNotifications);
router.patch(
  "/notifications/read-all",
  authUser,
  adminOnly,
  controller.markAllNotificationsRead,
);
router.patch(
  "/notifications/:notificationId/read",
  authUser,
  adminOnly,
  controller.markNotificationRead,
);
router.get("/:id", authUser, controller.getOrderById);
router.patch("/:id/status", authUser, adminOnly, controller.updateStatus);
router.patch("/:id/cancel", authUser, controller.cancelOrder);
module.exports = router;
