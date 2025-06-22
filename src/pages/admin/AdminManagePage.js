import React, { useContext, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Navbar from "../../component/common/NavBar";
import { UserContext } from '../../context/UserContext';

const AdminManagePage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const{user}= useContext(UserContext);
    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

        if (!username || !password) {
            alert('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        setIsLoading(true);

        try {
            // 서버에 새로운 관리자 생성을 요청합니다.
            console.log(user.accessToken);  
            const response = await fetch('/admins/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 실제 애플리케이션에서는 인증 토큰을 함께 보내야 할 수 있습니다.
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                // 서버에서 보낸 에러 메시지가 있다면 사용합니다.
                const errorData = await response.json();
                throw new Error(errorData.message || '관리자 추가에 실패했습니다.');
            }

            alert('새로운 관리자가 성공적으로 추가되었습니다.');
            setUsername(''); // 입력 필드 초기화
            setPassword(''); // 입력 필드 초기화

        } catch (error) {
            alert(error.message);
            console.error('관리자 추가 오류:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <GlobalStyle />
            <Navbar underline={true}/>
            <Container>
                <Form onSubmit={handleSubmit}>
                    <Title>새 관리자 추가</Title>
                    <Input
                        type="text"
                        placeholder="새 관리자 아이디"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading}
                    />
                    <Input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                    <SubmitButton type="submit" disabled={isLoading}>
                        {isLoading ? '추가하는 중...' : '관리자 추가하기'}
                    </SubmitButton>
                </Form>
            </Container>
        </>
    );
};

export default AdminManagePage;

// --- STYLED COMPONENTS ---

const primaryBlue = '#1E6DFF';
const darkBlue = '#0056b3';
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

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start; /* 상단에 정렬 */
  padding-top: 80px;
  height: calc(100vh - 80px); /* Navbar 높이를 제외한 전체 높이 */
`;

const Form = styled.form`
  width: 100%;
  max-width: 450px;
  padding: 40px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 900;
  color: ${darkGray};
  text-align: center;
  margin: 0 0 20px 0;
`;

const Input = styled.input`
  height: 50px;
  padding: 0 16px;
  border: 1px solid ${mediumGray};
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${primaryBlue};
    box-shadow: 0 0 0 3px rgba(30, 109, 255, 0.2);
  }
`;

const SubmitButton = styled.button`
  height: 52px;
  background-color: ${primaryBlue};
  color: white;
  font-size: 18px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 10px;

  &:hover {
    background-color: ${darkBlue};
  }

  &:disabled {
    background-color: #a5d8ff;
    cursor: not-allowed;
  }
`;