import React from 'react';
import styled from 'styled-components';
import logo from '../asset/logo.svg';
import { Link } from 'react-router-dom';

const NavbarContainer = styled.nav`
  
  padding: 10px 10%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom:2px solid #1E6DFF;
`;
const Menu = styled.ul`
  display: flex;
  list-style: none;
  align-items: center;
  margin: 0;
  padding: 0;
`;

const MenuItem = styled.li`
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
    color: #ff4757;
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

const Navbar = () => {
  return (
    <NavbarContainer>
      <Link to="/">
        <img src={logo} alt="logo" />
      </Link>


      <Menu>
        <MenuItem>
          <StyledLink to="/movieChart">영화</StyledLink>
        </MenuItem>
        <MenuItem>
          <StyledLink to="/reservation">예매</StyledLink>
        </MenuItem>
        <MenuItem>
          <StyledLink to="/login">로그인</StyledLink>
        </MenuItem>
        <MenuItem>
          <StyledLink to="/signup">회원가입</StyledLink>
        </MenuItem>
        <MenuItem>
          <StyledLink to="/mypage">마이페이지</StyledLink>
        </MenuItem>
      </Menu>
    </NavbarContainer>
  );
};

export default Navbar;
