import { Routes, Route } from "react-router-dom";
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
import Test from "./pages/main/face-recognition/Test";

function App() {
  const { userId, userData } = useUser();
  const { accessToken } = useVKAuth(userId);
  const isCommented = useCommentStatus(accessToken, userId, userData);
  const isSubscribe = useSubscriptionStatus(accessToken, userId, userData);
  const isShared = useRepostStatus(userId, userData);

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
              </Routes>
            </div>
          }
        />

        <Route path="/main" element={<Main />} />
        <Route path="/main/face-recognition" element={<Test />} />
      </Routes>
    </div>
  );
}

export default App;
