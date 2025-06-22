import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "../component/common/NavBar";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        passwordConfirm: '',
        name: '',
        phone: '',
        birthYear: '',
        birthMonth: '',
        birthDay: '',
    });
    // 파일 입력을 위한 별도 상태
    const [profileImageFile, setProfileImageFile] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setProfileImageFile(e.target.files[0]);
    };

    // --- 회원가입 제출 핸들러 수정 ---
    const handleSignUp = async (e) => {
        e.preventDefault();

        // 유효성 검사
        if (formData.password !== formData.passwordConfirm) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (!formData.username || !formData.name || !formData.phone || !formData.birthYear || !formData.birthMonth || !formData.birthDay) {
            alert("모든 필수 항목을 입력해주세요.");
            return;
        }

        // 1. FormData 객체 생성
        const submissionData = new FormData();

        // 2. 각 데이터를 key-value 형태로 append
        submissionData.append('username', formData.username);
        submissionData.append('password', formData.password);
        submissionData.append('name', formData.name);
        submissionData.append('phone', formData.phone);
        
        const birthDate = `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`;
        submissionData.append('birthDate', birthDate);

        // 프로필 이미지 파일이 있으면 추가
        if (profileImageFile) {
            submissionData.append('profileImage', profileImageFile);
        }

        try {
            // 3. fetch 요청 수정
            const response = await fetch('/members/signup', {
                method: 'POST',
                // Content-Type 헤더를 명시적으로 설정하지 않습니다.
                // 브라우저가 FormData에 맞춰 자동으로 설정합니다.
                body: submissionData, 
            });

            if (response.ok) {
                alert("회원가입이 성공적으로 완료되었습니다. 로그인 페이지로 이동합니다.");
                navigate('/login');
            } else {
                // form-data 실패 시 응답은 json이 아닐 수 있음
                const errorText = await response.text();
                alert(`회원가입 실패: ${errorText}`);
            }
        } catch (error) {
            console.error("Sign up error:", error);
            alert("회원가입 중 오류가 발생했습니다.");
        }
    };

    return (
        <Container>
            <Navbar underline={true} />
            <SignUpContainer>
                <Title>회원가입</Title>
                <Form onSubmit={handleSignUp}>
                    <Input name="username" placeholder="아이디" value={formData.username} onChange={handleChange} required />
                    <Input type="password" name="password" placeholder="비밀번호" value={formData.password} onChange={handleChange} required />
                    <Input type="password" name="passwordConfirm" placeholder="비밀번호 확인" value={formData.passwordConfirm} onChange={handleChange} required />
                    <Input type="text" name="name" placeholder="이름" value={formData.name} onChange={handleChange} required />
                    <Input type="tel" name="phone" placeholder="전화번호 (예: 010-1234-5678)" value={formData.phone} onChange={handleChange} required />
                    
                    <DateSelectWrapper>
                        <Select name="birthYear" value={formData.birthYear} onChange={handleChange} required>
                            <option value="">년</option>
                            {Array.from({ length: 100 }, (_, i) => (<option key={i} value={2025 - i}>{2025 - i}</option>))}
                        </Select>
                        <Select name="birthMonth" value={formData.birthMonth} onChange={handleChange} required>
                            <option value="">월</option>
                            {[...Array(12)].map((_, i) => (<option key={i} value={i + 1}>{i + 1}</option>))}
                        </Select>
                        <Select name="birthDay" value={formData.birthDay} onChange={handleChange} required>
                            <option value="">일</option>
                            {[...Array(31)].map((_, i) => (<option key={i} value={i + 1}>{i + 1}</option>))}
                        </Select>
                    </DateSelectWrapper>

                    <SignUpButton type="submit">회원가입 완료</SignUpButton>
                </Form>
            </SignUpContainer>
        </Container>
    );
};

export default SignUpPage;

// styled-components
const Container = styled.div`
  font-family: sans-serif;
`;

const SignUpContainer = styled.div`
  width: 400px;
  margin: 50px auto;
  padding: 40px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: #fff;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 12px;
  margin-bottom: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
`;

// InputWrapper, CheckButton, IdCheckMessage 스타일 제거

const DateSelectWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
`;

const Select = styled.select`
  flex: 1;
  padding: 12px;
  margin-right: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;

  &:last-child {
    margin-right: 0;
  }
`;

const SignUpButton = styled.button`
  padding: 14px;
  background-color: #007BFF;
  border: none;
  color: white;
  font-weight: bold;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;