import UserProvider from "./context/UserContext";
import MainPage from "./pages/MainPage";
import './index.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieDetailPage from "./pages/MovieDetailPage";
import ReservationPage from "./pages/ReservationPage";
import MovieChartPage from "./pages/MovieChartPage";
import LoginPage from "./pages/LoginPage";
import MyPage from "./pages/MyPage";
import ScrollToTop from "./component/common/ScrollToTop";
import SignUpPage from "./pages/SignupPage";
function App() {
  return (
    <UserProvider>
      <Router>
        <ScrollToTop /> {/* ★ 여기에 추가 ★ */}
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/movieChart" element={<MovieChartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
