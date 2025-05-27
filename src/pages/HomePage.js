import { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../component/common/NavBar";
import SearchBar from "../component/common/SearchBar";
import { UserContext } from "../context/UserContext";


const SerachBarWrapper = styled.div`
    display:flex;
    flex-direciton:row;
    justify-content: center;
    margin-top:50px;
`;
const HomePage = () => {
    const { user } = useContext(UserContext);
    return (
        <Container>
            <Navbar underline={true} />
            <SerachBarWrapper>

                <SearchBar />
            </SerachBarWrapper>
            {user.role === "admin" && (
                <AdminSection>
                    <SectionTitle>관리자 메뉴</SectionTitle>
                    <LinkList>
                        <StyledLink to="/createMovie">영화 생성</StyledLink>
                        <StyledLink to="/createDirector">감독 생성</StyledLink>
                        <StyledLink to="/createActor">배우 생성</StyledLink>
                    </LinkList>
                </AdminSection>
            )}
        </Container>
    );
};

export default HomePage;

// styled-components
const Container = styled.div`
   
`;

const AdminSection = styled.div`
    margin-top: 40px;
    padding: 20px;
    margin:40px;
    background-color: #f4f6fa;
    border: 1px solid #ccc;
    border-radius: 10px;
`;

const SectionTitle = styled.h2`
    margin-bottom: 15px;
    color: #333;
`;

const LinkList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const StyledLink = styled(Link)`
    padding: 10px 15px;
    background-color: #4a90e2;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 500;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #357ab8;
    }
`;
