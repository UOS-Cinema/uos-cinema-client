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
import HomePage from "./pages/HomePage";
import CreateActorPage from "./pages/admin/CreateActorPage";
import TheaterListPage from "./pages/admin/TheaterListPage";
import TheaterDetailPage from "./pages/admin/TheaterDetailPage";
import TheaterEditPage from "./pages/admin/TheaterEditPage";
import ScheduleManagePage from "./pages/admin/ScheduleManagePage";
import PaymentPolicyPage from "./pages/admin/PaymentPolicyPage";
import SchedulePage from "./pages/SchedulePage";
import CreateDirectorPage from "./pages/admin/CreateDirectorPage";

import CreateMoviePage from "./pages/admin/CreateMoviePage";
import DirectorDetailPage from "./pages/DirectorDetailPage";
import ActorDetailPage from "./pages/ActorDetailPage";
import AdminManagePage from "./pages/admin/AdminManagePage";
import MovieManagePage from "./pages/admin/MovieManagePage";
import EditMoviePage from "./pages/admin/EditMovePAge";
import CreateTheaterPage from "./pages/admin/CreateTheaterPage";
import { GenreProvider } from "./context/GenreContext";
import { CardCompanyProvider } from "./context/CardCompanyContext";
import { BankProvider } from "./context/BankContext";
import { ScreenTypeProvider } from "./context/ScreenTypeContext";
import { CustomerTypeProvider } from "./context/CustomerTypeContext";
import { ReservationProvider } from "./context/ReservationContext";
import CreateGenrePage from "./pages/admin/CreateGenrePage";
import EditGenrePage from "./pages/admin/EditGenrePage";
import EditDirectorPage from "./pages/admin/EditDirectorPage";
import EditActorPage from "./pages/admin/EditActorPage";
function App() {
  return (
    <UserProvider>
      <GenreProvider>
        <CardCompanyProvider>
          <BankProvider>
            <ScreenTypeProvider>
              <CustomerTypeProvider>
                <ReservationProvider>



                  <Router>
                    <ScrollToTop />
                    <Routes>
                      <Route path="/" element={<MainPage />} />
                      <Route path="/movie/:id" element={<MovieDetailPage />} />
                      <Route path="/reservation" element={<ReservationPage />} />
                      <Route path="/movieChart" element={<MovieChartPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignUpPage />} />
                      <Route path="/mypage" element={<MyPage />} />
                      <Route path="/home" element={<HomePage />} />
                      <Route path="/schedule" element={<SchedulePage />} />
                      <Route path="/director/:id" element={<DirectorDetailPage />} />
                      <Route path="/actor" element={<ActorDetailPage />} />

                      <Route path="/movieManage" element={<MovieManagePage />} />
                      <Route path="/theaterList" element={<TheaterListPage />} />
                      <Route path="/theaterDetail/:id" element={<TheaterDetailPage />} />
                      <Route path="/theaterEdit/:id" element={<TheaterEditPage />} />
                      <Route path="/theater/create" element={<CreateTheaterPage />} />
                      <Route path="/scheduleManage" element={<ScheduleManagePage />} />
                      <Route path="/paymentPolicy" element={<PaymentPolicyPage />} />
                      <Route path="/createDirector" element={<CreateDirectorPage />} />
                      <Route path="/createActor" element={<CreateActorPage />} />
                      <Route path="/createMovie" element={<CreateMoviePage />} />
                      <Route path="/adminManage" element={<AdminManagePage />} />
                      <Route path="/editMovie" element={<EditMoviePage />} />
                      <Route path="/createGenre" element={<CreateGenrePage />} />
                      <Route path="/editGenre" element={<EditGenrePage />} />
                      <Route path="/editDirector" element={<EditDirectorPage/>}/>
                      <Route path="/editActor" element={<EditActorPage/>}/>
                    </Routes>
                  </Router>
                </ReservationProvider>
              </CustomerTypeProvider>
            </ScreenTypeProvider>
          </BankProvider>
        </CardCompanyProvider>
      </GenreProvider>
    </UserProvider>
  );
}

export default App;
