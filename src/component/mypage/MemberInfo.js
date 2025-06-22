import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트

const MemberInfo = () => {
    // --- 상태 및 컨텍스트 ---
    const { user, setUser } = useContext(UserContext); // setUser 함수도 가져옴
    const [memberInfo, setMemberInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // 리디렉션을 위한 navigate 함수

    // --- 데이터 페칭 ---
    useEffect(() => {
        if (!user || !user.id) {
            setError("로그인 정보가 없습니다.");
            setLoading(false);
            return;
        }

        const fetchMemberData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/members/${user.id}`, {
                    headers: { 'Authorization': `Bearer ${user.accessToken}` }
                });
                if (!response.ok) throw new Error("회원 정보를 불러오는 데 실패했습니다.");
                const responseData = await response.json();
                setMemberInfo(responseData.data);
            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch member info:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMemberData();
    }, [user]);

    // --- 회원탈퇴 핸들러 추가 ---
    const handleWithdraw = async () => {
        // 1. 비밀번호 입력받기
        const password = prompt("회원 탈퇴를 위해 비밀번호를 입력해주세요. 모든 정보가 삭제되며 되돌릴 수 없습니다.");

        if (!password) {
            alert("회원 탈퇴가 취소되었습니다.");
            return;
        }

        // 2. DELETE API 요청 보내기
        try {
            const response = await fetch(`/members/${user.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: password }),
            });

            // 3. 응답 처리
            if (response.ok) {
                alert("회원 탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.");
                // 로그아웃 처리
                setUser(null);
                localStorage.removeItem('accessToken');
                // 메인 페이지로 이동
                navigate('/');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || '탈퇴 처리 중 오류가 발생했습니다.');
            }

        } catch (err) {
            console.error("Withdrawal error:", err);
            alert(err.message);
        }
    };


    // --- 렌더링 로직 ---
    if (loading) return <StatusText>회원 정보를 불러오는 중...</StatusText>;
    if (error) return <StatusText error>{error}</StatusText>;
    if (!memberInfo) return <StatusText>회원 정보가 없습니다.</StatusText>;

    return (
        <Wrapper>
            <Title>회원정보 수정</Title>
            <Container>
                <ProfileSection>
                    <ProfileImage src={memberInfo.profileImageUrl || `https://placehold.co/150x150/EBF2FF/1E6DFF?text=${memberInfo.name.charAt(0)}`} />
                    <ProfileChangeButton>프로필 사진 변경</ProfileChangeButton>
                </ProfileSection>
                <InfoSection>
                    <InfoRow>
                        <Label>이름</Label>
                        <Value>{memberInfo.name}</Value>
                    </InfoRow>
                    <InfoRow>
                        <Label>아이디</Label>
                        <Value>{memberInfo.username}</Value>
                    </InfoRow>
                    <InfoRow>
                        <Label>생년월일</Label>
                        <Value>{memberInfo.birthDate}</Value>
                    </InfoRow>
                    <InfoRow>
                        <Label>휴대폰 번호</Label>
                        <Value>{memberInfo.phone} <ChangeButton>변경</ChangeButton></Value>
                    </InfoRow>
                     <InfoRow>
                        <Label>비밀번호</Label>
                        <Value>******** <ChangeButton>변경</ChangeButton></Value>
                    </InfoRow>
                </InfoSection>
            </Container>
            <Footer>
                {/* 버튼에 onClick 이벤트 핸들러 연결 */}
                <WithdrawButton onClick={handleWithdraw}>회원탈퇴</WithdrawButton>
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
const StatusText = styled.div`
    padding: 40px;
    text-align: center;
    font-size: 18px;
    color: ${props => props.error ? red : textGray};
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
  background-color: #f1f3f5;
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