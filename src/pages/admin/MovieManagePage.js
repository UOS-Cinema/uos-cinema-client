import { Link } from "react-router-dom";
import Navbar from "../../component/common/NavBar";
import SearchBar from "../../component/common/SearchBar";
// FaFilm, FaUserEdit, FaUserCog 아이콘을 추가로 import 합니다.
import { FaVideo, FaUserTie, FaUserFriends, FaFilm, FaUserEdit, FaUserCog } from 'react-icons/fa';
import styled, { createGlobalStyle } from "styled-components";
import { UserContext } from "../../context/UserContext";
import { useContext } from "react";

const MovieManagePage = () => {
    const { user } = useContext(UserContext);
    return (
        <>
            <GlobalStyle />
            <Container>
                <Navbar underline={true} />
                <MainContent>
                    {user.role === "admin" && (
                        <AdminSection>
                            <SectionTitle>생성 메뉴</SectionTitle>
                            <MenuGrid>
                                <StyledLink to="/createMovie">
                                    <FaVideo />
                                    <span>영화 생성</span>
                                </StyledLink>
                                <StyledLink to="/createDirector">
                                    <FaUserTie />
                                    <span>감독 생성</span>
                                </StyledLink>
                                <StyledLink to="/createActor">
                                    <FaUserFriends />
                                    <span>배우 생성</span>
                                </StyledLink>
                            </MenuGrid>
                            
                            {/* --- 수정 메뉴 섹션 추가 --- */}
                            <SectionTitle>수정/삭제 메뉴</SectionTitle>
                            <MenuGrid>
                                <StyledLink to="/editMovie">
                                    <FaFilm />
                                    <span>영화 수정/삭제</span>
                                </StyledLink>
                                <StyledLink to="/editDirector">
                                    <FaUserCog />
                                    <span>감독 수정/삭제</span>
                                </StyledLink>
                                <StyledLink to="/editActor">
                                    <FaUserEdit />
                                    <span>배우 수정/삭제</span>
                                </StyledLink>
                            </MenuGrid>
                        </AdminSection>
                    )}
                </MainContent>
            </Container>

        </>
    );
};

export default MovieManagePage;

// --- STYLED COMPONENTS ---

const primaryBlue = '#1E6DFF';
const lightGray = '#f8f9fa';
const mediumGray = '#e9ecef';
const darkGray = '#343a40';

const GlobalStyle = createGlobalStyle`
  body, html {
    background-color: ${lightGray};
    margin: 0;
    font-family: 'Noto Sans KR', sans-serif;
  }
`;

const Container = styled.div``;

const MainContent = styled.main`
  width: 85%;
  max-width: 1200px;
  margin: 30px auto;
`;

const SearchBarWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 60px;
  margin-bottom: 60px;
`;

const AdminSection = styled.div`
  padding: 40px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 900;
  color: ${darkGray};
  margin: 40px 0 30px 0;
  padding-bottom: 20px;
  border-bottom: 1px solid ${mediumGray};

  /* 첫 번째 SectionTitle에는 상단 마진을 주지 않음 */
  &:first-of-type {
    margin-top: 0;
  }
`;

const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 30px;
  background-color: ${lightGray};
  color: ${darkGray};
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  border: 1px solid ${mediumGray};
  transition: all 0.3s ease;

  svg {
    font-size: 48px;
    color: ${primaryBlue};
    transition: all 0.3s ease;
  }

  &:hover {
    transform: translateY(-5px);
    background-color: ${primaryBlue};
    color: white;
    box-shadow: 0 8px 20px rgba(30, 109, 255, 0.25);
    
    svg {
        color: white;
    }
  }
`;