import User from "../models/User.js";

export const authUser = async (req, res) => {
  try {
    const user_id = req.userId || req.body.user_id;
    const sessionUserId = req.session.userId;

    if (!user_id) {
      return res.status(404).json({
        message: "Поле user_id обязательно",
      });
    }

    if (!user_id || isNaN(parseInt(user_id))) {
      return res.status(400).json({
        message: "Некорректный user_id",
      });
    }

    if (sessionUserId && user_id !== sessionUserId.toString()) {
      return res.status(403).json({
        message: "Доступ запрещен. Нельзя получить данные другого пользователя",
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
    const user_id = req.userId;
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

export const completeFirstGame = async (req, res) => {
  async function checkIfUserWon(current_item_count, isWon) {
    if (current_item_count === 3 && isWon) {
      return true;
    }

    return false;
  }

  try {
    const userId = req.userId;
    const { current_item_count, isWon } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const isWin = await checkIfUserWon(current_item_count, isWon);

    if (!isWin) {
      return res.status(403).json({ message: "Условия победы не выполнены." });
    }

    const updatedUser = await User.findOneAndUpdate(
      { user_id: userId },
      { $set: { "gamesComplete.first_game": true } },
      { new: true }
    );

    res.json({
      success: true,
      message: `Игра first_game успешно завершена!`,
      gamesComplete: updatedUser.gamesComplete,
    });
  } catch (error) {
    console.error("Ошибка при завершении first_game:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const completeSecondGame = async (req, res) => {
  async function checkIfUserWon(friendCount, isEnd) {
    if (friendCount === 7 && isEnd) {
      return true;
    }

    return false;
  }

  try {
    const userId = req.userId;
    const { friendCount, isEnd } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const isWin = await checkIfUserWon(friendCount, isEnd);

    if (!isWin) {
      return res.status(403).json({ message: "Условия победы не выполнены." });
    }

    const updatedUser = await User.findOneAndUpdate(
      { user_id: userId },
      { $set: { "gamesComplete.second_game": true } },
      { new: true }
    );

    res.json({
      success: true,
      message: `Игра second_game успешно завершена!`,
      gamesComplete: updatedUser.gamesComplete,
    });
  } catch (error) {
    console.error("Ошибка при завершении second_game:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const completeThirdGame = async (req, res) => {
  async function checkIfUserWon(isCompleted) {
    if (isCompleted) {
      return true;
    }

    return false;
  }

  try {
    const userId = req.userId;
    const { isCompleted } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    const isWin = await checkIfUserWon(isCompleted);

    if (!isWin) {
      return res.status(403).json({ message: "Условия победы не выполнены." });
    }

    const updatedUser = await User.findOneAndUpdate(
      { user_id: userId },
      { $set: { "gamesComplete.third_game": true } },
      { new: true }
    );

    res.json({
      success: true,
      message: `Игра third_game успешно завершена!`,
      gamesComplete: updatedUser.gamesComplete,
    });
  } catch (error) {
    console.error("Ошибка при завершении third_game:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user_id = req.userId;

    if (!user_id) {
      return res.status(401).json({
        message: "Пользователь не авторизован",
      });
    }

    const user = await User.findOne({ user_id });

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Не удалось получить пользователя",
    });
  }
};
