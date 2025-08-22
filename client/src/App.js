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

function App() {
  const { userId, userData } = useUser();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    localStorage.setItem("user_id", searchParams.get("userId"));
  }, [searchParams.get("userId")]);

  const token = searchParams.get("token");
  const user_id = searchParams.get("userId") || localStorage.getItem("user_id");

  const finalUserId = user_id || userId;

  const { accessToken } = useVKAuth(finalUserId);
  const isCommented = useCommentStatus(accessToken, finalUserId, userData);
  const isSubscribe = useSubscriptionStatus(accessToken, finalUserId, userData);
  const isShared = useRepostStatus(finalUserId, userData);

  console.log(accessToken);
  console.log(finalUserId);
  console.log(isSubscribe, isCommented, isShared);

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
