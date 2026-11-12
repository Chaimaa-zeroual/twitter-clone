import mongoose, { Schema, model, models } from "mongoose";

const notificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post" }, // ✅ Post lié
    type: { type: String, required: true }, // ✅ Type de notification (comment, like, follow)
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Notification = models.Notification || model("Notification", notificationSchema);
export default Notification;
