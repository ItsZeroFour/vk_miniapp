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

    console.log(targetName, acceptTarget.includes(targetName));

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
