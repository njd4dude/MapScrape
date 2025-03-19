import { createRoot } from "react-dom/client";
import App from "./components/JSX/App.jsx";
import "../styles.css";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
