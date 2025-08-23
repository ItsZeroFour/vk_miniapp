import React, { Suspense, useEffect, useState } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";

import useUser from "./hooks/useUser";
import useVKAuth from "./hooks/useVKAuth";
import useCommentStatus from "./hooks/useCommentStatus";
import useSubscriptionStatus from "./hooks/useSubscriptionStatus";
import useRepostStatus from "./hooks/useRepostStatus";

import Header from "./components/header/Header";
import ToggleVolume from "./components/toggle_volume/ToggleVolume";
import axios from "./utils/axios";

const FaceRecognition = React.lazy(() =>
  import("./pages/face-recognition/FaceRecognition")
);
const FaceRecognitionHome = React.lazy(() =>
  import("./pages/face-recognition/FaceRecognitionHome")
);
const FaceRecognitionFinal = React.lazy(() =>
  import("./pages/face-recognition/FaceRecognitionFinal")
);

const FriendOrFoe = React.lazy(() =>
  import("./pages/friend-or-foe/FriendOrFoe")
);
const FriendOrFoeGame = React.lazy(() =>
  import("./pages/friend-or-foe/FriendOrFoeGame")
);
const FriendOrFoeEnd = React.lazy(() =>
  import("./pages/friend-or-foe/FriendOrFoeEnd")
);

const ContactDots = React.lazy(() =>
  import("./pages/contact-dots/ContactDots")
);
const ContactDotsGame = React.lazy(() =>
  import("./pages/contact-dots/ContactDotsGame")
);
const ContactDotsEnd = React.lazy(() =>
  import("./pages/contact-dots/ContactDotsEnd")
);

const Main = React.lazy(() => import("./pages/main/Main"));

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
      <Suspense fallback={<p>Загрузка...</p>}>
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
                      element={
                        <FaceRecognitionFinal finalUserId={finalUserId} />
                      }
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
      </Suspense>
    </div>
  );
}

export default App;
