import React from "react";
import styled from "styled-components";

const MemberInfo = () => {
  // 샘플 데이터
  const memberData = {
    name: "홍길동",
    id: "hong123",
    phone: "010-1234-5678",
    birth: "1990-01-01",
  };

  return (
    <Container>
      <ProfileSection>
        <ProfileImage src="https://via.placeholder.com/120" />
        <ProfileChangeButton>변경</ProfileChangeButton>
      </ProfileSection>
      <InfoSection>
        <InfoRow>
          <Label>이름</Label>
          <Value>
            {memberData.name}
            <ChangeButton>변경</ChangeButton>
          </Value>
        </InfoRow>
        <InfoRow>
          <Label>아이디</Label>
          <Value>{memberData.id}</Value>
        </InfoRow>
        <InfoRow>
          <Label>생년월일</Label>
          <Value>
            {memberData.birth}
            <ChangeButton>변경</ChangeButton>
          </Value>
        </InfoRow>
        <InfoRow>
          <Label>휴대폰 번호</Label>
          <Value>{memberData.phone}</Value>
        </InfoRow>
        <InfoRow>
          <Label>비밀번호</Label>
          <Value>********</Value>
        </InfoRow>
      </InfoSection>
      <WithdrawButton>회원탈퇴</WithdrawButton>
    </Container>
  );
};

export default MemberInfo;
const WithdrawButton = styled.button`
  padding: 10px 20px;
  font-size: 15px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background-color: #c82333;
  }
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  background-color: #f0f0f0;
`;

const ProfileChangeButton = styled.button`
  padding: 6px 12px;
  font-size: 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const InfoSection = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled.div`
  width: 120px;
  font-weight: bold;
  font-size: 16px;
`;

const Value = styled.div`
  flex: 1;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChangeButton = styled.button`
  padding: 5px 10px;
  font-size: 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;
