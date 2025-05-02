import Navbar from "../component/common/NavBar"
import SearchBar from "../component/common/SearchBar"
const HomePage = () => {
    return (
        <div>
            <Navbar underline={true}/>
            <SearchBar/>
        </div>
    )
}
export default HomePage;