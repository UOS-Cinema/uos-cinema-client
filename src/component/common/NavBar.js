import React, { useContext } from 'react';
import styled from 'styled-components';
import logo from '../../asset/logo.svg';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

const NavbarContainer = styled.nav`
  padding: 10px 10%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: ${({ underline }) => (underline ? '2px solid #1E6DFF' : 'none')};
  position: relative;
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
  height: 30px;
  text-align: center;
  cursor: pointer;
  transition: color 0.2s ease;
  border-right: 1px solid #ccc;

  &:first-child {
    border-left: 1px solid #ccc;
  }

  &:hover {
    color: #1D79F2;
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

  &:visited {
    color: inherit;
  }
`;

// 드롭다운 메뉴
const DropdownMenu = styled.ul`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 80px;
  background: white;
 
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 1000;

  li {
    width: 100%;
    padding: 8px 12px;
    text-align: center;
    cursor: pointer;
   
    background-color: white;
    border:1px solid #ccc;
    &:hover {
      background-color: #f1f1f1;
      
    }
  }

  li:last-child {
   
  }
`;

const Navbar = ({ underline }) => {
  const { user } = useContext(UserContext);
  return (
    <NavbarContainer underline={underline}>
      <Link to="/">
        <img src={logo} alt="logo" />
      </Link>
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
            <StyledLink>영화관 관리</StyledLink>
            <DropdownMenu>
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
          <MenuItem>
            <StyledLink to="/login">로그인</StyledLink>
          </MenuItem>
          <MenuItem>
            <StyledLink to="/mypage">마이페이지</StyledLink>
          </MenuItem>
        </Menu>
      }

    </NavbarContainer>
  );
};

export default Navbar;
