import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Saida from "./pages/Saida";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/Saida" element={<Saida />} />
      </Routes>
    </Router>
  );
}

export default App;
