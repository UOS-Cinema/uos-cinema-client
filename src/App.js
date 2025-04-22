import UserProvider from "./context/UserContext";
import MainPage from "./pages/mainPage/MainPage";
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieDetail from "./component/MovieDetail";
import ReservationPage from "./pages/reservationPage/ReservationPage";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/reservation/:id" element={<ReservationPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
