import React, { useContext, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Navbar from "../component/common/NavBar"; // 경로 확인 필요
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";



const LoginPage = () => {
    const [activeMainTab, setActiveMainTab] = useState("member");
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    
    // 회원, 관리자 폼 상태
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    // 비회원 폼 상태
    const [guestInfo, setGuestInfo] = useState({
        name: '',
        phone: '',
        birthYear: '',
        birthMonth: '',
        birthDay: '',
        password: '',
        passwordConfirm: ''
    });

    // 각 폼의 입력값 변경을 처리하는 핸들러
    const handleCredentialChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleGuestInfoChange = (e) => {
        const { name, value } = e.target;
        setGuestInfo(prev => ({ ...prev, [name]: value }));
    };
    
    // --- 통합 로그인 핸들러 ---
    const handleLogin = async (e) => {
        e.preventDefault();

        let endpoint = '';
        let payload = {};
        let loginType = '';

        // 현재 활성화된 탭에 따라 요청 정보 설정
        switch(activeMainTab) {
            case 'admin':
            case 'member':
                if (!credentials.username || !credentials.password) {
                    alert("아이디와 비밀번호를 입력해주세요.");
                    return;
                }
                endpoint = activeMainTab === 'admin' ? '/admins/login' : '/members/login';
                payload = { username: credentials.username, password: credentials.password };
                loginType = activeMainTab;
                break;
            
            case 'guest':
                if (!guestInfo.name || !guestInfo.phone || !guestInfo.birthYear || !guestInfo.password) {
                    alert("모든 정보를 입력해주세요.");
                    return;
                }
                if (guestInfo.password !== guestInfo.passwordConfirm) {
                    alert("예매 비밀번호가 일치하지 않습니다.");
                    return;
                }
                endpoint = '/guests/login';
                payload = {
                    name: guestInfo.name,
                    phone: guestInfo.phone,
                    birthDate: `${guestInfo.birthYear}-${guestInfo.birthMonth.padStart(2, '0')}-${guestInfo.birthDay.padStart(2, '0')}`,
                    password: guestInfo.password
                };
                loginType = 'guest';
                break;
            
            default:
                return;
        }

        // API 요청
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || '로그인에 실패했습니다.');
            }

            const accessToken = data.data.accessToken;
            localStorage.setItem('accessToken', accessToken);

            // 로그인 유형에 따라 UserContext 상태 설정
            const loggedInUser = {
                id: loginType === 'guest' ? guestInfo.name : credentials.username,
                role: loginType,
                accessToken: accessToken,
            };
            setUser(loggedInUser);

            alert(`${loginType === 'guest' ? '비회원 예매조회에' : '로그인에'} 성공했습니다.`);
            navigate("/");

        } catch (error) {
            console.error(`${loginType} login error:`, error);
            alert(error.message || "로그인 중 오류가 발생했습니다.");
        }
    };
    
    return (
        <>
            <GlobalStyle />
            <Container>
                <Navbar underline={true} />
                <LoginContainer>
                    <TabMenu>
                        <Tab active={activeMainTab === "member"} onClick={() => setActiveMainTab("member")}>회원</Tab>
                        <Tab active={activeMainTab === "admin"} onClick={() => setActiveMainTab("admin")}>관리자</Tab>
                        <Tab active={activeMainTab === "guest"} onClick={() => setActiveMainTab("guest")}>비회원</Tab>
                    </TabMenu>
                    <Form onSubmit={handleLogin}>
                        {activeMainTab === "member" && (
                            <>
                                <Input type="text" name="username" placeholder="아이디" value={credentials.username} onChange={handleCredentialChange} />
                                <Input type="password" name="password" placeholder="비밀번호" value={credentials.password} onChange={handleCredentialChange} />
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
                                <Input type="text" name="username" placeholder="관리자 아이디" value={credentials.username} onChange={handleCredentialChange} />
                                <Input type="password" name="password" placeholder="비밀번호" value={credentials.password} onChange={handleCredentialChange} />
                                <LoginButton type="submit">로그인</LoginButton>
                            </>
                        )}
                        {activeMainTab === "guest" && (
                            <>
                                <Input type="text" name="name" placeholder="이름" value={guestInfo.name} onChange={handleGuestInfoChange} />
                                <Input type="tel" name="phone" placeholder="휴대폰 번호" value={guestInfo.phone} onChange={handleGuestInfoChange} />
                                <DateSelectWrapper>
                                    <Select name="birthYear" value={guestInfo.birthYear} onChange={handleGuestInfoChange}>
                                        <option value="">년</option>
                                        {Array.from({ length: 100 }, (_, i) => <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>)}
                                    </Select>
                                    <Select name="birthMonth" value={guestInfo.birthMonth} onChange={handleGuestInfoChange}>
                                        <option value="">월</option>
                                        {[...Array(12)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
                                    </Select>
                                    <Select name="birthDay" value={guestInfo.birthDay} onChange={handleGuestInfoChange}>
                                        <option value="">일</option>
                                        {[...Array(31)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
                                    </Select>
                                </DateSelectWrapper>
                                <Input type="password" name="password" placeholder="예매 비밀번호 (숫자 4자리)" value={guestInfo.password} onChange={handleGuestInfoChange} />
                                <Input type="password" name="passwordConfirm" placeholder="예매 비밀번호 확인" value={guestInfo.passwordConfirm} onChange={handleGuestInfoChange} />
                                <LoginButton type="submit">비회원 예매 확인</LoginButton>
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