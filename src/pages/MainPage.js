import Navbar from "../component/common/NavBar";
import SearchBar from "../component/common/SearchBar";
import MovieTabSection from "../component/mainpage/MovieTapSection";
import TopReservationBanner from "../component/mainpage/TopReservationBanner";
const MainPage = () => {
    return (
        <div>
            <Navbar></Navbar>
            <TopReservationBanner/>
            
            <SearchBar></SearchBar>
            <MovieTabSection/>
        </div>
    )
}
export default MainPage

