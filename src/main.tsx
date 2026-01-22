import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Restore deep-link route after 404.html fallback redirect (Cloudflare Pages / static hosts)
const redirect = sessionStorage.getItem("spa:redirect");
if (redirect) {
  sessionStorage.removeItem("spa:redirect");
  window.history.replaceState(null, "", redirect);
}

createRoot(document.getElementById("root")!).render(<App />);
