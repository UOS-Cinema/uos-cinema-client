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
        <Wrapper>
            <Title>회원정보 수정</Title>
            <Container>
                <ProfileSection>
                    <ProfileImage src="https://placehold.co/150x150/EBF2FF/1E6DFF?text=H" />
                    <ProfileChangeButton>프로필 사진 변경</ProfileChangeButton>
                </ProfileSection>
                <InfoSection>
                    <InfoRow>
                        <Label>이름</Label>
                        <Value>{memberData.name}</Value>
                    </InfoRow>
                    <InfoRow>
                        <Label>아이디</Label>
                        <Value>{memberData.id}</Value>
                    </InfoRow>
                    <InfoRow>
                        <Label>생년월일</Label>
                        <Value>{memberData.birth}</Value>
                    </InfoRow>
                    <InfoRow>
                        <Label>휴대폰 번호</Label>
                        <Value>{memberData.phone} <ChangeButton>변경</ChangeButton></Value>
                    </InfoRow>
                     <InfoRow>
                        <Label>비밀번호</Label>
                        <Value>******** <ChangeButton>변경</ChangeButton></Value>
                    </InfoRow>
                </InfoSection>
            </Container>
             <Footer>
                <WithdrawButton>회원탈퇴</WithdrawButton>
             </Footer>
        </Wrapper>
    );
};

export default MemberInfo;

// --- STYLED COMPONENTS ---

const primaryBlue = '#1E6DFF';
const darkGray = '#343a40';
const textGray = '#868e96';
const mediumGray = '#dee2e6';
const red = '#e03131';

const Wrapper = styled.div`
  width: 100%;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 900;
  color: ${darkGray};
  margin: 0 0 30px 0;
  padding-bottom: 20px;
  border-bottom: 1px solid ${mediumGray};
`;

const Container = styled.div`
  display: flex;
  gap: 50px;
  align-items: flex-start;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 150px;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
`;

const ProfileChangeButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${mediumGray};
  color: ${darkGray};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background-color: #ced4da;
  }
`;

const InfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #f1f3f5;
  &:last-child {
      border-bottom: none;
  }
`;

const Label = styled.div`
  width: 120px;
  font-weight: 700;
  font-size: 16px;
  color: ${darkGray};
`;

const Value = styled.div`
  flex: 1;
  font-size: 16px;
  color: ${textGray};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChangeButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 700;
  background-color: ${primaryBlue};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const Footer = styled.div`
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid ${mediumGray};
    text-align: right;
`;

const WithdrawButton = styled.button`
  padding: 10px 20px;
  font-size: 15px;
  background-color: transparent;
  color: ${red};
  border: 1px solid ${red};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${red};
    color: white;
  }
`;
