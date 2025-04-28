import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "../component/common/NavBar";

const SignUpPage = () => {
    const [id, setId] = useState("");

    const handleDuplicateCheck = () => {
        // TODO: 아이디 중복 확인 로직
        alert("중복 확인 기능은 아직 구현되지 않았습니다.");
    };

    return (
        <Container>
            <Navbar underline={true} />
            <SignUpContainer>
                <Title>회원가입</Title>
                <Form>
                    <InputWrapper>
                        <Input 
                            type="text" 
                            placeholder="아이디" 
                            value={id} 
                            onChange={(e) => setId(e.target.value)} 
                        />
                        <CheckButton onClick={handleDuplicateCheck}>중복확인</CheckButton>
                    </InputWrapper>

                    <Input type="password" placeholder="비밀번호" />
                    <Input type="password" placeholder="비밀번호 확인" />
                    <Input type="text" placeholder="이름" />
                    <Input type="tel" placeholder="전화번호" />

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

                    <SignUpButton>회원가입 완료</SignUpButton>
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

const Form = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 14px;
`;

const CheckButton = styled.button`
  padding: 10px 16px;
  margin-left: 8px;
  background-color: #007BFF;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;
    margin-bottom:16px;
  &:hover {
    background-color: #0056b3;
  }
`;

const DateSelectWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
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

const SignUpButton = styled.button`
  padding: 12px;
  background-color: #007BFF;
  border: none;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }
`;
