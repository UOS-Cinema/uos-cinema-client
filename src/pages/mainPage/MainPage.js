import Navbar from "../../component/NavBar";
import SearchBar from "../../component/SearchBar";
import TopReservationBanner from "../../component/TopReservationBanner";
import MovieTabSection from "../../component/MovieTapSection";
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

