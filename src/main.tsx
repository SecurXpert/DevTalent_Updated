import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { setupInterceptors } from "./pages/Services/api/setupInterceptors";

setupInterceptors();

<BrowserRouter>
  <App />
</BrowserRouter>;

createRoot(document.getElementById("root")!).render(<App />);
