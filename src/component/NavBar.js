import React from 'react';
import styled from 'styled-components';
import logo from '../asset/logo.svg';
const NavbarContainer = styled.nav`
  border-bottom: 1px solid #ccc;
  padding: 10px;
  display: flex;
  flex-direction:column;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    color: #ff4757;
    
    width:500px;
    text-align: center;
`;

const Menu = styled.ul`
    width:500px;
    display: flex;
    justify-content:space-between;
    list-style: none;
    align-items: center;
    border-top: 2px solid #ccc;
    padding-top:10px;

`;

const MenuItem = styled.li`
    width:100%;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #ff4757;
  }
`;
const Header = styled.div`
  justify-content:row;
`;
const Navbar = () => {
  return (
    <NavbarContainer>
      <Header>
        <img src={logo} />
      </Header>

      <Menu>
        <MenuItem>영화</MenuItem>
        <MenuItem>예매</MenuItem>
        <MenuItem>로그인</MenuItem>
        <MenuItem>회원가입</MenuItem>
        <MenuItem>마이페이지</MenuItem>
      </Menu>
    </NavbarContainer>
  );
};

export default Navbar;
