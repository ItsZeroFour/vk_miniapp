import { Routes, Route, useSearchParams } from "react-router-dom";
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
import { useEffect, useState } from "react";
import axios from "./utils/axios";
import ContactDotsEnd from "./pages/contact-dots/ContactDotsEnd";
import ToggleVolume from "./components/toggle_volume/ToggleVolume";

function App() {
  const [user, setUser] = useState(null);
  const { userId, userData } = useUser();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("userId")) {
      localStorage.setItem("user_id", searchParams.get("userId"));
    }
  }, [searchParams]);

  const user_id = searchParams.get("userId") || localStorage.getItem("user_id");

  const finalUserId = user_id || userId;

  const { accessToken } = useVKAuth(finalUserId);

  const isCommented = useCommentStatus(accessToken, finalUserId, userData);
  const isSubscribe = useSubscriptionStatus(accessToken, finalUserId, userData);
  const isShared = useRepostStatus(accessToken, finalUserId, userData);

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(`/user/get/${finalUserId}`);

      if (response.status === 200) {
        setUser(response.data);
      }
    };

    getUser();
  }, [finalUserId]);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/*"
          element={
            <div className="game-content">
              <Header />

              <div className="wrapper-container">
                <Routes>
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
                    element={<FaceRecognitionFinal finalUserId={finalUserId} />}
                  />

                  {/* СВОЙ-ЧУЖОЙ */}
                  <Route path="/friend-or-foe" element={<FriendOrFoe />} />
                  <Route
                    path="/friend-or-foe/start"
                    element={<FriendOrFoeGame />}
                  />
                  <Route
                    path="/friend-or-foe/end"
                    element={<FriendOrFoeEnd finalUserId={finalUserId} />}
                  />

                  {/* ТОЧКИ КОНТАКТА */}
                  <Route path="/contact-dots" element={<ContactDots />} />
                  <Route
                    path="/contact-dots/game"
                    element={<ContactDotsGame />}
                  />
                  <Route
                    path="/contact-dots/end"
                    element={<ContactDotsEnd finalUserId={finalUserId} />}
                  />
                </Routes>
              </div>

              <div className="volume">
                <ToggleVolume />
                <p>ВЫКЛЮЧИТЬ ЗВУК</p>
              </div>
            </div>
          }
        />

        {/* Основная страница */}
        <Route
          path="/"
          element={
            <Main
              isCommented={isCommented}
              isSubscribe={isSubscribe}
              isShared={isShared}
              user_id={user_id}
              user={user}
              finalUserId={finalUserId}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
