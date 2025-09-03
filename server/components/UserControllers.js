import User from "../models/User.js";

export const authUser = async (req, res) => {
  try {
    const user_id = req.body.user_id;

    if (!user_id) {
      return res.status(404).json({
        message: "Поле user_id обязательно",
      });
    }

    const findUser = await User.findOne({ user_id });

    if (!findUser) {
      const doc = new User({
        user_id,
      });

      const user = await doc.save();
      const userData = user._doc;
      return res.status(200).json({ ...userData });
    } else {
      return res.status(200).json(findUser);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось аутентифицировать пользователя",
    });
  }
};

export const updateTargetStatus = async (req, res) => {
  try {
    const targetName = req.body.target_name;
    const user_id = req.body.user_id;
    const targetValue = req.body.target_value;

    const acceptTarget = ["subscribe", "comment", "share"];

    if (!targetName || !acceptTarget.includes(targetName)) {
      return res.status(401).json({
        message: "Некорректное имя целевого действия",
      });
    }

    if (!user_id) {
      return res.status(404).json({
        message: "Поле user_id обязательно",
      });
    }

    const updateUserTargets = await User.findOneAndUpdate(
      { user_id },
      {
        $set: {
          [`targeted_actions.${targetName}`]: targetValue,
        },
      },
      { new: true }
    );

    if (!updateUserTargets) {
      return res.status(501).json({
        message: "Не удалось обновить состояние целевого действия",
      });
    }

    return res.status(200).json({
      message: "Успешно!",
      data: updateUserTargets,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Не удалось обновить статус выполненных целей",
    });
  }
};

export const completeGame = async (req, res) => {
  try {
    const { userId, gameName } = req.body;

    if (!["first_game", "second_game", "third_game"].includes(gameName)) {
      return res.status(400).json({ message: "Некорректное название игры" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { user_id: userId },
      { $set: { [`gamesComplete.${gameName}`]: true } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    res.json({
      message: `Игра ${gameName} успешно завершена`,
      gamesComplete: updatedUser.gamesComplete,
    });
  } catch (error) {
    console.error("Ошибка при обновлении игры:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user_id = req.params.userId;

    if (!user_id) {
      return res.status(404).json({
        message: "Поле user_id обязательно",
      });
    }

    const user = await User.findOne({ user_id });

    if (!user) {
      return res.status(404).json({
        message: "Не удалось получить пользователя",
      });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Не удалось пролучить пользователя",
    });
  }
};
