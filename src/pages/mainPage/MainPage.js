import Navbar from "../../component/NavBar";
import SearchBar from "../../component/SearchBar";
import MovieGrid from "./MovieGrid";
import TopReservationBanner from "../../component/TopReservationBanner";
const MainPage = () => {
    return (
        <div>
            <Navbar></Navbar>
            <TopReservationBanner/>
            <SearchBar></SearchBar>
            <MovieGrid></MovieGrid>
        </div>
    )
}
export default MainPage

