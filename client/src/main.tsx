import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add global styles from external sources
const linkElement = document.createElement('link');
linkElement.rel = 'stylesheet';
linkElement.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap';
document.head.appendChild(linkElement);

const boxiconsLink = document.createElement('link');
boxiconsLink.rel = 'stylesheet';
boxiconsLink.href = 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';
document.head.appendChild(boxiconsLink);

createRoot(document.getElementById("root")!).render(<App />);
