import mongoose from "mongoose";

const User = new mongoose.Schema({
  user_id: {
    type: Number,
    required: true,
    unique: true,
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

  gamesComplete: {
    first_game: {
      type: Boolean,
      default: false,
    },

    second_game: {
      type: Boolean,
      default: false,
    },

    third_game: {
      type: Boolean,
      default: false,
    },
  },

  prize: {
    type: Boolean,
    default: false,
  },
});

User.index({ user_id: 1 }, { unique: true });

export default mongoose.model("User", User);
