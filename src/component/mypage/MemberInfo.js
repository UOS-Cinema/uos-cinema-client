import React, { useState, useEffect, useContext, useRef } from "react";
import styled from "styled-components";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const MemberInfo = () => {
    // --- 상태 및 컨텍스트 ---
    const { user, setUser } = useContext(UserContext);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // --- 수정 관련 상태 추가 ---
    const [isPasswordChanging, setIsPasswordChanging] = useState(false);
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [profileImageFile, setProfileImageFile] = useState(null); // 프로필 이미지 파일 상태
    const fileInputRef = useRef(null); // 파일 입력을 위한 ref

    // --- 데이터 페칭 ---
    useEffect(() => {
        if (!user || !user.id || !user.role) {
            setError("로그인 정보가 없습니다.");
            setLoading(false);
            return;
        }
        
        if (user.role === 'admin') {
            setUserInfo({ username: user.id });
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            const endpoint = user.role === 'member' ? `/members/${user.id}` : `/guests/${user.id}`;
            console.log(endpoint);
            console.log(user);
            try {
                const response = await fetch(endpoint, {
                    headers: { 'Authorization': `Bearer ${user.accessToken}` }
                });
                if (!response.ok) throw new Error("정보를 불러오는 데 실패했습니다.");
                
                const responseData = await response.json();
                setUserInfo(responseData.data);
            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch user info:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // --- 핸들러 함수들 ---
    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    // 프로필 사진 변경 버튼 클릭 시 파일 입력창 열기
    const handleProfileButtonClick = () => {
        fileInputRef.current.click();
    };

    // 파일 선택 시 상태 업데이트
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImageFile(file);
            // 미리보기 기능 (선택사항)
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserInfo(prev => ({...prev, profileImageUrl: reader.result}));
            };
            reader.readAsDataURL(file);
        }
    };
    
    // --- 비밀번호 변경 제출 (form-data 사용) ---
    const handlePasswordChangeSubmit = async () => {
        if (!passwords.currentPassword || !passwords.newPassword) {
            alert("현재 비밀번호와 새 비밀번호를 모두 입력해주세요.");
            return;
        }
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            alert("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        // 1. FormData 객체 생성
        const formData = new FormData();

        let formattedBirthDate;
        if (Array.isArray(userInfo.birthDate)) {
            // [YYYY, M, D] 배열 형식을 'YYYY-MM-DD' 문자열로 변환
            formattedBirthDate = `${userInfo.birthDate[0]}-${String(userInfo.birthDate[1]).padStart(2, '0')}-${String(userInfo.birthDate[2]).padStart(2, '0')}`;
        } else {
            // 이미 문자열 형식이면 그대로 사용
            formattedBirthDate = userInfo.birthDate;
        }

        formData.append('name', userInfo.name);
        formData.append('phone', userInfo.phone);
        formData.append('birthDate', formattedBirthDate); // 변환된 날짜 사용
        formData.append('password', passwords.currentPassword);
        formData.append('newPassword', passwords.newPassword);
        
        // 3. 새로운 프로필 이미지 파일이 있으면 append
        if (profileImageFile) {
            formData.append('profileImage', profileImageFile);
        }

        try {
            // 4. fetch 요청 수정 (headers의 Content-Type 제거)
            const response = await fetch(`/members/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`,
                },
                body: formData
            });

            if(response.ok) {
                alert("비밀번호가 성공적으로 변경되었습니다.");
                setIsPasswordChanging(false);
                setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
                setProfileImageFile(null); // 파일 상태 초기화
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "비밀번호 변경에 실패했습니다.");
            }
        } catch (err) {
            console.error("Password change error:", err);
            alert(err.message);
        }
    };
    
    const handleAccountDelete = async () => {
        // ... (이전과 동일)
    };

    // --- 렌더링 로직 ---
    if (loading) return <StatusText>정보를 불러오는 중...</StatusText>;
    if (error) return <StatusText error>{error}</StatusText>;
    if (!userInfo) return <StatusText>사용자 정보를 찾을 수 없습니다.</StatusText>;

    if (user.role === 'admin') {
        return (
            <Wrapper>
                <Title>관리자 계정</Title>
                <AdminContainer>
                    <p><strong>{userInfo.username}</strong> 계정으로 로그인되어 있습니다.</p>
                    <WithdrawButton onClick={handleAccountDelete}>관리자 계정 삭제</WithdrawButton>
                </AdminContainer>
            </Wrapper>
        )
    }

    return (
        <Wrapper>
            <Title>{user.role === 'member' ? '회원정보 수정' : '비회원 예매 정보'}</Title>
            <Container>
                {user.role === 'member' && (
                    <ProfileSection>
                        <ProfileImage src={userInfo.profileImageUrl || `https://placehold.co/150x150/EBF2FF/1E6DFF?text=${userInfo.name.charAt(0)}`} />
                        {/* 숨겨진 파일 입력 필드 */}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            accept="image/*" 
                            onChange={handleFileChange}
                        />
                        <ProfileChangeButton onClick={handleProfileButtonClick}>프로필 사진 변경</ProfileChangeButton>
                    </ProfileSection>
                )}
                <InfoSection isGuest={user.role === 'guest'}>
                    <InfoRow><Label>이름</Label><Value>{userInfo.name}</Value></InfoRow>
                    {user.role === 'member' && <InfoRow><Label>아이디</Label><Value>{userInfo.username}</Value></InfoRow>}
                    <InfoRow><Label>생년월일</Label><Value>{userInfo.birthDate}</Value></InfoRow>
                    <InfoRow>
                        <Label>휴대폰 번호</Label>
                        {user.role === 'member' ? (<Value>{userInfo.phone} <ChangeButton>변경</ChangeButton></Value>) : (<Value>{userInfo.phone}</Value>)}
                    </InfoRow>
                    {user.role === 'member' && (
                        isPasswordChanging ? (
                            <PasswordChangeSection>
                                <InputGroup>
                                    <Label>현재 비밀번호</Label>
                                    <Input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordInputChange} />
                                </InputGroup>
                                <InputGroup>
                                    <Label>새 비밀번호</Label>
                                    <Input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordInputChange} />
                                </InputGroup>
                                <InputGroup>
                                    <Label>새 비밀번호 확인</Label>
                                    <Input type="password" name="confirmNewPassword" value={passwords.confirmNewPassword} onChange={handlePasswordInputChange} />
                                </InputGroup>
                                <ButtonContainer>
                                    <ChangeButton onClick={handlePasswordChangeSubmit}>저장</ChangeButton>
                                    <CancelButton onClick={() => setIsPasswordChanging(false)}>취소</CancelButton>
                                </ButtonContainer>
                            </PasswordChangeSection>
                        ) : (
                            <InfoRow>
                                <Label>비밀번호</Label>
                                <Value>******** <ChangeButton onClick={() => setIsPasswordChanging(true)}>변경</ChangeButton></Value>
                            </InfoRow>
                        )
                    )}
                </InfoSection>
            </Container>
            {user.role === 'member' && (
                <Footer>
                    <WithdrawButton onClick={handleAccountDelete}>회원탈퇴</WithdrawButton>
                </Footer>
            )}
        </Wrapper>
    );
};

export default MemberInfo;

// --- STYLED COMPONENTS ---
const primaryBlue = '#1E6DFF';
const darkGray = '#343a40';
const textGray = '#868e96';
const mediumGray = '#dee2e6';
const lightGray = '#f1f3f5';
const red = '#e03131';

const Wrapper = styled.div` width: 100%; `;
const Title = styled.h2`
  font-size: 28px; font-weight: 900; color: ${darkGray};
  margin: 0 0 30px 0; padding-bottom: 20px; border-bottom: 1px solid ${mediumGray};
`;
const StatusText = styled.div`
    padding: 40px; text-align: center; font-size: 18px;
    color: ${props => props.error ? red : textGray};
`;
const Container = styled.div` display: flex; gap: 50px; align-items: flex-start; `;
const AdminContainer = styled.div` padding: 20px; text-align: center; `;
const ProfileSection = styled.div`
  display: flex; flex-direction: column; align-items: center;
  gap: 16px; width: 150px;
`;
const ProfileImage = styled.img`
  width: 150px; height: 150px; border-radius: 50%;
  object-fit: cover; border: 4px solid #fff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1); background-color: #f1f3f5;
`;
const ProfileChangeButton = styled.button`
  padding: 8px 16px; font-size: 14px; font-weight: 500;
  background-color: ${mediumGray}; color: ${darkGray};
  border: none; border-radius: 6px; cursor: pointer;
  &:hover { background-color: #ced4da; }
`;
const InfoSection = styled.div`
  flex: 1; display: flex; flex-direction: column; gap: 10px;
  margin-left: ${({ isGuest }) => (isGuest ? '170px' : '0')}; 
`;
const InfoRow = styled.div`
  display: flex; align-items: center; padding: 10px 0;
  border-bottom: 1px solid ${lightGray};
  &:last-child { border-bottom: none; }
`;
const Label = styled.div`
  width: 120px; font-weight: 700; font-size: 16px; color: ${darkGray};
`;
const Value = styled.div`
  flex: 1; font-size: 16px; color: ${textGray};
  display: flex; align-items: center; justify-content: space-between;
`;
const ChangeButton = styled.button`
  padding: 8px 16px; font-size: 14px; font-weight: 700;
  background-color: ${primaryBlue}; color: white;
  border: none; border-radius: 6px; cursor: pointer;
  &:hover { background-color: #0056b3; }
`;
const Footer = styled.div`
    margin-top: 40px; padding-top: 20px;
    border-top: 1px solid ${mediumGray}; text-align: right;
`;
const WithdrawButton = styled.button`
  padding: 10px 20px; font-size: 15px; background-color: transparent;
  color: ${red}; border: 1px solid ${red}; border-radius: 6px;
  cursor: pointer; transition: all 0.2s ease;
  &:hover { background-color: ${red}; color: white; }
`;

const PasswordChangeSection = styled.div`
    padding: 20px 0;
    border-bottom: 1px solid ${lightGray};
`;
const InputGroup = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 15px;
`;
const Input = styled.input`
    flex: 1;
    height: 42px;
    padding: 0 12px;
    border-radius: 6px;
    border: 1px solid ${mediumGray};
    font-size: 15px;
`;
const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;
const CancelButton = styled(ChangeButton)`
    background-color: ${textGray};
    &:hover {
        background-color: ${darkGray};
    }
`;
