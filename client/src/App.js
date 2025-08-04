import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";

import useUser from "./hooks/useUser";
import useVKAuth from "./hooks/useVKAuth";
import useCommentStatus from "./hooks/useCommentStatus";
import useSubscriptionStatus from "./hooks/useSubscriptionStatus";
import useRepostStatus from "./hooks/useRepostStatus";

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
          path="/"
          element={
            <Home
              isCommented={isCommented}
              isSubscribe={isSubscribe}
              isShared={isShared}
            />
          }
        />
      </Routes>

      {userData && JSON.stringify(userData?.targeted_actions)}
    </div>
  );
}

export default App;
