import mongoose from "mongoose";

const User = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
  },

  targeted_actions: {
    subscribe: {
      type: Boolean,
      default: false,
    },

    comment: {
      type: Boolean,
      default: false,
    },

    share: {
      type: Boolean,
      default: false,
    },
  },

  game_complete_count: {
    type: Number,
    default: 0,
  },

  prize: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("User", User);
