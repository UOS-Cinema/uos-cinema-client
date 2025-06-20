import React, { useContext, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Navbar from "../component/common/NavBar"; // 경로 확인 필요
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";



const LoginPage = () => {
    const [activeMainTab, setActiveMainTab] = useState("member");
    const { setUser } = useContext(UserContext);
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
   
    // handleLogin 함수를 async/await를 사용하도록 변경
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!id || !password) {
            alert("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        // 관리자 탭에서 로그인 시도
        if (activeMainTab === "admin") {
            try {
                // 참고: 요청하신 'amins'는 'admins'의 오타일 가능성이 높아 'admins'로 수정했습니다.
                console.log(id);
                console.log(password);
                const response = await fetch('/admins/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: id,
                        password: password,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    // 서버가 에러 메시지를 보내는 경우, 해당 메시지를 띄움
                    throw new Error(data.message || '로그인에 실패했습니다.');
                }
                console.log(data.data.accessToken);
                // accessToken을 정상적으로 받아온 경우
                const  accessToken  = data.data.accessToken;
                console.log(accessToken);
                // 받아온 accessToken을 localStorage에 저장 (웹 세션 유지용)
                localStorage.setItem('accessToken', accessToken);

                setUser({ id: id, role: "admin", accessToken:accessToken });
                alert("관리자로 로그인되었습니다.");
                navigate("/"); // 관리자 페이지 또는 메인 페이지로 이동

            } catch (error) {
                console.error("Admin login error:", error);
                alert(error.message || "로그인 중 오류가 발생했습니다.");
            }

        // 회원 탭에서 로그인 시도 (기존 로직 유지)
        } else if (activeMainTab === "member") {
            // 여기는 실제 회원 로그인 API 연동 로직으로 대체될 수 있습니다.
            setUser({ id: id, role: "member" });
            alert("로그인 성공!");
            navigate("/");
        }
    };
    
    return (
        <>
            <GlobalStyle />

                <Container>
                    <Navbar underline={true} />
                    <LoginContainer>
                        <TabMenu>
                            <Tab active={activeMainTab === "member"} onClick={() => setActiveMainTab("member")}>
                                회원
                            </Tab>
                            <Tab active={activeMainTab === "admin"} onClick={() => setActiveMainTab("admin")}>
                                관리자
                            </Tab>
                            <Tab active={activeMainTab === "guest"} onClick={() => setActiveMainTab("guest")}>
                                비회원
                            </Tab>
                        </TabMenu>
                        <Form onSubmit={handleLogin}>
                            {activeMainTab === "member" && (
                                <>
                                    <Input type="text" placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)} />
                                    <Input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <LoginButton type="submit">로그인</LoginButton>
                                    <LinkButtonWrapper>
                                        <StyledLink to="/signup">회원가입</StyledLink>
                                        <span>|</span>
                                        <StyledLink to="/find-credentials">아이디/비밀번호 찾기</StyledLink>
                                    </LinkButtonWrapper>
                                </>
                            )}
                            {activeMainTab === "admin" && (
                                <>
                                    <Input type="text" placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)} />
                                    <Input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <LoginButton type="submit">로그인</LoginButton>
                                </>
                            )}
                            {activeMainTab === "guest" && (
                                <>
                                    <Input type="text" placeholder="이름" />
                                    <Input type="tel" placeholder="휴대폰 번호" />
                                    <DateSelectWrapper>
                                        <Select>
                                            <option>년</option>
                                            {Array.from({ length: 100 }, (_, i) => <option key={i}>{new Date().getFullYear() - i}</option>)}
                                        </Select>
                                        <Select>
                                            <option>월</option>
                                            {[...Array(12)].map((_, i) => <option key={i}>{i + 1}</option>)}
                                        </Select>
                                        <Select>
                                            <option>일</option>
                                            {[...Array(31)].map((_, i) => <option key={i}>{i + 1}</option>)}
                                        </Select>
                                    </DateSelectWrapper>
                                    <Input type="password" placeholder="예매 비밀번호 (숫자 4자리)" />
                                    <Input type="password" placeholder="예매 비밀번호 확인" />
                                    <LoginButton type="button">비회원 예매 확인</LoginButton>
                                </>
                            )}
                        </Form>
                    </LoginContainer>
                </Container>

        </>
    );
};

export default LoginPage;

// --- STYLED COMPONENTS (이하 동일) ---
// (스타일 코드는 변경사항이 없으므로 생략합니다)

const primaryBlue = '#1E6DFF';
const darkBlue = '#0056b3';
const lightGray = '#f1f3f5';
const mediumGray = '#dee2e6';
const darkGray = '#495057';
const textGray = '#868e96';

const GlobalStyle = createGlobalStyle`
  body, html {
    background-color: ${lightGray};
    height: 100%;
    margin: 0;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const LoginContainer = styled.div`
  width: 450px;
  margin: 80px auto;
  padding: 40px;
  border-radius: 16px;
  background-color: #fff;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
`;

const TabMenu = styled.div`
  display: flex;
  margin-bottom: 30px;
  border-bottom: 1px solid ${mediumGray};
`;

const Tab = styled.div`
  flex: 1;
  text-align: center;
  padding-bottom: 16px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  color: ${({ active }) => (active ? primaryBlue : textGray)};
  border-bottom: 3px solid ${({ active }) => (active ? primaryBlue : "transparent")};
  transition: all 0.3s ease;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  height: 50px;
  padding: 0 16px;
  margin-bottom: 16px;
  border: 1px solid ${mediumGray};
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;

  &::placeholder {
    color: ${textGray};
  }

  &:focus {
    outline: none;
    border-color: ${primaryBlue};
    box-shadow: 0 0 0 2px rgba(30, 109, 255, 0.2);
  }
`;

const LoginButton = styled.button`
  height: 52px;
  padding: 0 16px;
  margin-top: 10px;
  background-color: ${primaryBlue};
  border: none;
  color: white;
  font-weight: 700;
  font-size: 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${darkBlue};
  }
`;

const DateSelectWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
`;

const Select = styled.select`
  flex: 1;
  height: 50px;
  padding: 0 16px;
  border: 1px solid ${mediumGray};
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23868e96' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;

  &:focus {
    outline: none;
    border-color: ${primaryBlue};
    box-shadow: 0 0 0 2px rgba(30, 109, 255, 0.2);
  }
`;

const LinkButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  gap: 12px;
  font-size: 14px;
  color: ${textGray};
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${darkGray};
  transition: color 0.2s ease;

  &:hover {
    color: ${primaryBlue};
    text-decoration: underline;
  }
`;