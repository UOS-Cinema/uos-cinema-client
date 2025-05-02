import React, { useContext, useState } from "react";
import styled from "styled-components";
import Navbar from "../component/common/NavBar";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
const LoginPage = () => {
  const [activeMainTab, setActiveMainTab] = useState("member");
  const { user, setUser } = useContext(UserContext);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (id === "admin" && password === "admin") {
      setUser({ id: "admin", role: "admin" });
      alert("관리자로 로그인되었습니다.");
      navigate("/");
    } else {
      setUser({ id: id, role: "member" })
      alert("로그인 성공");
      navigate("/");
    }
  };
  return (
    <Container>
      <Navbar underline={true} />
      <LoginContainer>
        {/* 메인 탭 */}
        <TabMenu>
          <Tab active={activeMainTab === "member"} onClick={() => setActiveMainTab("member")}>
            회원
          </Tab>
          <Tab active={activeMainTab === "guest"} onClick={() => setActiveMainTab("guest")}>
            비회원
          </Tab>
        </TabMenu>


        {/* 폼 */}
        <Form onSubmit={handleLogin}>
          {activeMainTab === "member" && (
            <>
              {/* ✅ 입력값 상태 연결 */}
              <Input
                type="text"
                placeholder="아이디"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
              <Input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {/* ✅ handleLogin 연결 */}
              <LoginButton type="submit" >로그인</LoginButton>

              <LinkButtonWrapper>
                <LinkButton>
                  <StyledLink to="/signup">회원가입하기</StyledLink>
                </LinkButton>
                <LinkButton>아이디/비밀번호 찾기</LinkButton>
              </LinkButtonWrapper>
            </>
          )}

          {activeMainTab === "guest" && (
            <>
              <Input type="text" placeholder="이름" />
              <Input type="tel" placeholder="휴대폰 번호" />
              <DateSelectWrapper>
                <Select>
                  <option>년</option>
                  {Array.from({ length: 100 }, (_, i) => (
                    <option key={i}>{2025 - i}</option>
                  ))}
                </Select>
                <Select>
                  <option>월</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i}>{i + 1}</option>
                  ))}
                </Select>
                <Select>
                  <option>일</option>
                  {[...Array(31)].map((_, i) => (
                    <option key={i}>{i + 1}</option>
                  ))}
                </Select>
              </DateSelectWrapper>
              <Input type="password" placeholder="예매 비밀번호" />
              <Input type="password" placeholder="예매 비밀번호 확인" />
              <LoginButton>비회원 로그인</LoginButton>
            </>
          )}

        </Form>
      </LoginContainer>
    </Container>
  );
};

export default LoginPage;

// styled-components
const Container = styled.div`
  font-family: sans-serif;
`;

const LoginContainer = styled.div`
  width: 400px;
  margin: 50px auto;
  padding: 40px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: #fff;
`;

const TabMenu = styled.div`
  display: flex;
  margin-bottom: 10px;
`;


const Tab = styled.div`
  flex: 1;
  text-align: center;
  padding: 12px;
  cursor: pointer;
  font-weight: bold;
  border-bottom: 2px solid ${(props) => (props.active ? "#007BFF" : "#ccc")};
  color: ${(props) => (props.active ? "#007BFF" : "#666")};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
`;

const LoginButton = styled.button`
  padding: 12px;
  background-color: #007BFF;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const DateSelectWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit; /* 글자 색도 기본 상속받게 */
`;
const Select = styled.select`
  flex: 1;
  padding: 10px;
  margin-right: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;

  &:last-child {
    margin-right: 0;
  }
`;
const LinkButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  color: #007BFF;
  font-size: 14px;
  cursor: pointer;
  margin: 0 8px;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;
