import Navbar from "../component/common/NavBar";
import SearchBar from "../component/common/SearchBar";
import MovieGrid from "../component/mainpage/MovieGrid";
const MovieChartPage = () => {
    return (
        <div>
            <Navbar underline={true}></Navbar>
            <SearchBar></SearchBar>
            <MovieGrid></MovieGrid>
        </div>
    )
}
export default MovieChartPage

