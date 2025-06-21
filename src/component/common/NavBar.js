import React, { useContext } from 'react';
import styled from 'styled-components';
import logo from '../../asset/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { FaSearch } from "react-icons/fa";

const primaryBlue = '#1E6DFF';
const lightGray = '#eee';
const mediumGray = '#ccc';
const darkGray = '#333';
const textGray = '#555';
const LogoutButton = styled.button`
    /* 1. StyledLink와 똑같이 보이도록 스타일을 복사해옵니다. */
    padding: 10px 15px;
    color: #333;
    text-decoration: none;
    font-weight: bold;
    display: block;
    
    &:hover {
        color: #1E6DFF; /* primaryBlue */
    }

    /* 2. <button>의 기본 스타일을 모두 초기화합니다. */
    background: none;
    border: none;
    font: inherit; /* 부모의 폰트를 그대로 사용 */
    cursor: pointer;
    text-align: inherit; /* 부모의 정렬을 그대로 사용 */
`;
const NavbarContainer = styled.nav`
  padding: 15px 10%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: ${({ underline }) => (underline ? `3px solid ${primaryBlue}` : 'none')};
  position: relative;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05); /* Subtle shadow for depth */
`;

const Menu = styled.ul`
  display: flex;
  list-style: none;
  align-items: center;
  margin: 0;
  padding: 0;
`;

const MenuItem = styled.li`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  height: 40px; /* Slightly taller for better touch targets */
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease; /* Smoother transitions */
  border-right: 1px solid ${mediumGray};
  font-size: 16px; /* Increased font size */

  &:first-child {
    border-left: 1px solid ${mediumGray};
  }

  &:hover {
    color: ${primaryBlue};
    background-color: ${lightGray}; /* Slight background change on hover */
  }

  &:hover > ul {
    display: block;
  }
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: inherit;
  width: 100%; /* Make link fill the MenuItem */
  height: 100%;

  &:visited {
    color: inherit;
  }
`;

const DropdownMenu = styled.ul`
  display: none;
  position: absolute;
  top: 100%;
  left: -1px; /* Adjust to align with parent's left border */
  min-width: calc(100% + 2px); /* Match parent width + borders */
  background: white;
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 1000;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* Shadow for dropdown */
  border: 1px solid ${mediumGray}; /* Consistent border */

  li {
    width: 100%;
    padding: 10px 12px; /* Increased padding */
    text-align: center;
    cursor: pointer;
    background-color: white;
    font-size: 15px; /* Consistent font size */
    border-bottom: 1px solid ${lightGray}; /* Separator for list items */

    &:last-child {
        border-bottom: none;
    }

    &:hover {
      background-color: ${lightGray};
      color: ${primaryBlue};
    }
  }
`;

const SearchBar = styled.input`
  width: 250px; /* Slightly smaller for better balance */
  height: 38px; /* Taller for better input experience */
  padding: 0 15px;
  border: none; /* Remove default border */
  border-radius: 19px; /* Half of height for perfect pill shape */
  font-size: 15px;
  outline: none;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;


`;

const Button = styled.button`
  padding: 0 15px; /* Adjust padding */
  background-color: white; /* Match SearchContainer background */
  color: ${textGray};
  border: none;
  border-radius: 0 19px 19px 0; /* Only right side rounded */
  font-size: 18px; /* Larger icon */
  cursor: pointer;
  height: 38px;
  transition: color 0.2s ease; /* Smooth color transition */

  &:hover {
    color: ${primaryBlue}; /* Blue on hover */
  }
`;

const SearchContainer = styled.div`
  border: 1px solid ${mediumGray};
  border-radius: 20px; /* Rounded search container */
  display: flex;
  align-items: center;
  max-width: 400px;
  background-color: white;
  overflow: hidden; /* Ensures content respects border-radius */
`;

const Navbar = ({ underline }) => {
  const { user,setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogout = () => {
        // 1. UserContext의 상태를 초기화합니다.
        setUser({ id: null, role: null });

        // 2. 로컬 스토리지에 저장된 사용자 정보와 토큰을 삭제합니다.
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken'); // accessToken도 함께 삭제

        // 3. 로그아웃 후 홈으로 이동합니다.
        alert('로그아웃되었습니다.');
        navigate('/'); 
    };
  return (
    <NavbarContainer underline={underline}>
      <Link to="/">
        <img src={logo} alt="logo" style={{ height: '40px' }} /> {/* Adjust logo size */}
      </Link>
      <SearchContainer>
        <SearchBar type="text" placeholder="영화 제목을 검색하세요" />
        <Button><FaSearch /></Button>
      </SearchContainer>

      {user.role === "admin" &&
        <Menu>
          <MenuItem>
            <StyledLink>영화</StyledLink>
            <DropdownMenu>
              <li>
                <StyledLink to="/home">홈</StyledLink>
              </li>
              <li>
                <StyledLink to="/movieChart">무비차트</StyledLink>
              </li>
              <li>
                <StyledLink to="/movieChart">상영예정작</StyledLink>
              </li>
            </DropdownMenu>
          </MenuItem>

          <MenuItem>
            <StyledLink>예매</StyledLink>
            <DropdownMenu>
              <li>
                <StyledLink to="/reservation">예매하기</StyledLink>
              </li>
              <li>
                <StyledLink to="/schedule">상영일정</StyledLink>
              </li>
            </DropdownMenu>
          </MenuItem>
          <MenuItem>
            <StyledLink>관리자 도구</StyledLink>
            <DropdownMenu>
              <li>
                <StyledLink to="/adminManage">어드민 관리</StyledLink>
              </li>
              <li>
                <StyledLink to="/movieManage">영화/배우/감독 관리</StyledLink>
              </li>
              <li>
                <StyledLink to="/theaterList">상영관 관리</StyledLink>
              </li>
              <li>
                <StyledLink to="/scheduleManage">상영일정 관리</StyledLink>
              </li>
              <li>
                <StyledLink to="/paymentPolicy">가격정책 관리</StyledLink>
              </li>
            </DropdownMenu>
          </MenuItem>
          <MenuItem>
            <StyledLink to="/mypage">마이페이지</StyledLink>
          </MenuItem>
          <MenuItem>
            <LogoutButton as="button" onClick={handleLogout}>로그아웃</LogoutButton>

          </MenuItem>
        </Menu>
      }
      {user.role !== "admin" &&
        <Menu>
          <MenuItem>
            <StyledLink>영화</StyledLink>
            <DropdownMenu>
              <li>
                <StyledLink to="/home">홈</StyledLink>
              </li>
              <li>
                <StyledLink to="/movieChart">무비차트</StyledLink>
              </li>
              <li>
                <StyledLink to="/movieChart">상영예정작</StyledLink>
              </li>
            </DropdownMenu>
          </MenuItem>
          <MenuItem>
            <StyledLink>예매</StyledLink>
            <DropdownMenu>
              <li>
                <StyledLink to="/reservation">예매하기</StyledLink>
              </li>
              <li>
                <StyledLink to="/schedule">상영일정</StyledLink>
              </li>
            </DropdownMenu>
          </MenuItem>
          {user && user.id ? (
            // 1. 로그인된 경우: 로그아웃과 마이페이지 버튼 표시
            <>
              <MenuItem>
                {/* a태그나 Link가 아닌 button으로 동작하도록 as="button"을 사용 */}
                <LogoutButton as="button" onClick={handleLogout}>로그아웃</LogoutButton>
              </MenuItem>
              <MenuItem>
                <StyledLink to="/mypage">마이페이지</StyledLink>
              </MenuItem>
            </>
          ) : (
            // 2. 로그아웃된 경우: 로그인 버튼 표시
            <MenuItem>
              <StyledLink to="/login">로그인</StyledLink>
            </MenuItem>
          )}

          <MenuItem>
            <StyledLink to="/mypage">마이페이지</StyledLink>
          </MenuItem>
        </Menu>
      }
    </NavbarContainer>
  );
};

export default Navbar;