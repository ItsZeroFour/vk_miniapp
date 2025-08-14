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

function App() {
  const { userId, userData } = useUser();
  const { accessToken } = useVKAuth(userId);
  const isCommented = useCommentStatus(accessToken, userId, userData);
  const isSubscribe = useSubscriptionStatus(accessToken, userId, userData);
  const isShared = useRepostStatus(userId, userData);

  return (
    <div className="App">
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

          <Route path="/face-recognition" element={<FaceRecognitionHome />} />
          <Route path="/face-recognition/game" element={<FaceRecognition />} />
          <Route path="/face-recognition/final" element={<FaceRecognitionFinal />} />
        </Routes>
      </div>

      {/* {userData && JSON.stringify(userData?.targeted_actions)} */}
    </div>
  );
}

export default App;
