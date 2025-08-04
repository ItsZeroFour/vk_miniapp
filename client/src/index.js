import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import bridge from "@vkontakte/vk-bridge";
import { BrowserRouter } from "react-router-dom";
import "./styles/index.scss";

bridge.send("VKWebAppInit");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
