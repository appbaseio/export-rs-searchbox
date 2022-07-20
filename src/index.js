import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { isIdAvailble } from "./utils/helper";

const renderById = (id) => {
  const container = isIdAvailble(id);
  const root = ReactDOM.createRoot(document.getElementById(id));
  if (container) {
    root.render(<div>HEY</div>, root);
  }
};

renderById("searchbox-root");
