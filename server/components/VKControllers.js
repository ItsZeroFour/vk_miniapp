import axios from "axios";

export async function checkSubscribe(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const response = await axios.get(
      "https://api.vk.com/method/groups.isMember",
      {
        params: {
          group_id: process.env.VK_GROUP_ID,
          user_id: userId,
          access_token: process.env.VK_SERVICE_TOKEN_AUTH,
          v: "5.131",
        },
      }
    );
    res.json({ isMember: response.data.response });
  } catch (err) {
    console.error("Ошибка проверки подписки:", err.message);
    res.status(500).json({ error: "Ошибка проверки подписки" });
  }
}

export async function checkComment(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const response = await axios.get(
      "https://api.vk.com/method/wall.getComments",
      {
        params: {
          owner_id: -Number(process.env.VK_GROUP_ID),
          post_id: Number(process.env.POST_ID_COMMENT),
          count: 100,
          v: "5.131",
          access_token: process.env.VK_SERVICE_TOKEN_AUTH,
        },
      }
    );

    const comments = response.data?.response?.items || [];
    const hasCommented = comments.some((c) => c.from_id === Number(userId));

    res.json({ hasCommented });
  } catch (err) {
    console.error("Ошибка проверки комментариев:", err.message);
    res.status(500).json({ error: "Ошибка проверки комментариев" });
  }
}

export async function checkRepost(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const response = await axios.get("https://api.vk.com/method/wall.get", {
      params: {
        owner_id: userId,
        count: 100,
        filter: "owner",
        v: "5.131",
        access_token: process.env.VK_SERVICE_TOKEN_AUTH,
      },
    });

    const posts = response.data?.response?.items || [];
    const groupId = -Number(process.env.VK_GROUP_ID);
    const postId = Number(process.env.VK_POST_ID);

    const reposted = posts.some((item) => {
      const original = item.copy_history?.[0];
      return original && original.from_id === groupId && original.id === postId;
    });

    res.json({ shared: reposted });
  } catch (err) {
    console.error("Ошибка проверки репоста:", err.message);
    res.status(500).json({ error: "Ошибка проверки репоста" });
  }
}

export async function getToken(req, res) {
  try {
    const userId = req.userId;

    console.log(`==========${req.session.userId}===========`);
    

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const response = await axios.get("https://api.vk.com/method/users.get", {
      params: {
        user_ids: userId,
        access_token: process.env.VK_SERVICE_TOKEN_AUTH,
        v: "5.131",
      },
    });

    res.json({
      // token: process.env.process.env.VK_SERVICE_TOKEN_AUTH,
      user: response.data,
    });
  } catch (err) {
    console.error("Ошибка получения токена:", err.message);
    res.status(500).json({ error: "Ошибка получения токена" });
  }
}
