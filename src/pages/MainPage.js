import { useContext } from "react";
import Navbar from "../component/common/NavBar";
import SearchBar from "../component/common/SearchBar";
import MovieTabSection from "../component/mainpage/MovieTapSection";
import TopReservationBanner from "../component/mainpage/TopReservationBanner";
import { UserContext } from "../context/UserContext";

const MainPage = () => {
    const { user } = useContext(UserContext);

    return (
        <div>
            <Navbar underline={true} />
            <TopReservationBanner />
            <SearchBar />
            <MovieTabSection />
        </div>
    );


};

export default MainPage;
