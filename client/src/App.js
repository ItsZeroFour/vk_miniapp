import { Routes, Route, useSearchParams } from "react-router-dom";
import Home from "./pages/home/Home";
import useUser from "./hooks/useUser";
import useVKAuth from "./hooks/useVKAuth";
import useCommentStatus from "./hooks/useCommentStatus";
import useSubscriptionStatus from "./hooks/useSubscriptionStatus";
import useRepostStatus from "./hooks/useRepostStatus";
import FaceRecognition from "./pages/face-recognition/FaceRecognition";
import Header from "./components/header/Header";
import FaceRecognitionHome from "./pages/face-recognition/FaceRecognitionHome";
import FaceRecognitionFinal from "./pages/face-recognition/FaceRecognitionFinal";
import Main from "./pages/main/Main";
import FriendOrFoe from "./pages/friend-or-foe/FriendOrFoe";
import FriendOrFoeGame from "./pages/friend-or-foe/FriendOrFoeGame";
import FriendOrFoeEnd from "./pages/friend-or-foe/FriendOrFoeEnd";
import ContactDots from "./pages/contact-dots/ContactDots";
import ContactDotsGame from "./pages/contact-dots/ContactDotsGame";
import { useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";

function App() {
  const { userId, userData } = useUser();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    localStorage.setItem("user_id", searchParams.get("userId"));
  }, [searchParams.get("userId")]);

  useEffect(() => {
    localStorage.setItem("token", searchParams.get("token"));
  }, [searchParams.get("token")]);

  const token = searchParams.get("token") || localStorage.getItem("token");
  const user_id = searchParams.get("userId") || localStorage.getItem("user_id");

  const finalUserId = user_id || userId;

  const { accessToken } = useVKAuth(finalUserId);
  const isCommented = useCommentStatus(
    accessToken || token,
    finalUserId,
    userData
  );
  const isSubscribe = useSubscriptionStatus(
    accessToken || token,
    finalUserId,
    userData
  );
  const isShared = useRepostStatus(finalUserId, userData);

  console.log(isSubscribe);

  async function checkGroupMembership(userId, accessToken) {
    try {
      const res = await bridge.send("VKWebAppCallAPIMethod", {
        method: "groups.isMember",
        params: {
          group_id: process.env.REACT_APP_GROUP_ID,
          user_id: userId,
          v: "5.131",
          access_token: accessToken,
        },
      });

      console.log(res.response);
    } catch (err) {
      if (err?.error_data?.error_code === 15) {
        console.error("⚠️ У токена нет scope=groups");
      } else {
        console.error("Ошибка VK API:", err);
      }
    }
  }

  checkGroupMembership(user_id, token);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/*"
          element={
            <div className="wrapper-container">
              <Header />
              <Routes>
                <Route
                  path="/"
                  element={
                    <Home
                      isCommented={isCommented}
                      isSubscribe={isSubscribe}
                      isShared={isShared}
                    />
                  }
                />

                {/* РАСПОЗНАВАНИЕ ЛИЦ */}
                <Route
                  path="/face-recognition"
                  element={<FaceRecognitionHome />}
                />
                <Route
                  path="/face-recognition/game"
                  element={<FaceRecognition />}
                />
                <Route
                  path="/face-recognition/final"
                  element={<FaceRecognitionFinal />}
                />

                {/* СВОЙ-ЧУЖОЙ */}
                <Route path="/friend-or-foe" element={<FriendOrFoe />} />
                <Route
                  path="/friend-or-foe/start"
                  element={<FriendOrFoeGame />}
                />
                <Route path="/friend-or-foe/end" element={<FriendOrFoeEnd />} />

                {/* ТОЧКИ КОНТАКТА */}
                <Route path="/contact-dots" element={<ContactDots />} />
                <Route
                  path="/contact-dots/game"
                  element={<ContactDotsGame />}
                />
              </Routes>
            </div>
          }
        />

        <Route
          path="/main"
          element={
            <Main isSubscribe={isSubscribe} token={token} user_id={user_id} />
          }
        />
        {/* <Route path="/tasks" /> */}
      </Routes>
    </div>
  );
}

export default App;
