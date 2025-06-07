// pages/admin/CreateActorPage.js

import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Navbar from "../../component/common/NavBar"; // 경로 확인 필요
import { FaUserPlus, FaCamera } from "react-icons/fa";

const CreateActorPage = () => {
    const [name, setName] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !profileImage) {
            alert("이름과 프로필 사진을 모두 입력해주세요.");
            return;
        }
        alert(`배우 '${name}' 생성 완료!`);
        // Reset form
        setName("");
        setProfileImage(null);
        setPreviewUrl(null);
    };

    return (
        <>
            <GlobalStyle />
            <Navbar underline={true} />
            <FormContainer onSubmit={handleSubmit}>
                <Title>배우 등록</Title>
                <ProfileUploader htmlFor="profile-upload">
                    {previewUrl ? <ImagePreview src={previewUrl} alt="미리보기" /> : <FaCamera />}
                </ProfileUploader>
                <Input 
                    type="file" 
                    id="profile-upload" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    style={{display: 'none'}} 
                />
                
                <Label>이름</Label>
                <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="배우 이름"
                    required
                />
                <SubmitButton type="submit"><FaUserPlus /> 배우 등록하기</SubmitButton>
            </FormContainer>
        </>
    );
};

export default CreateActorPage;


// --- STYLED COMPONENTS ---
// 이 스타일은 CreateDirectorPage.js에서도 재사용될 수 있습니다.

const primaryBlue = '#1E6DFF';
const darkGray = '#343a40';
const mediumGray = '#dee2e6';
const lightGray = '#f8f9fa';

const GlobalStyle = createGlobalStyle`body, html { background-color: ${lightGray}; }`;

const FormContainer = styled.form`
    width: 100%;
    max-width: 500px;
    margin: 60px auto;
    padding: 40px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.07);
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Title = styled.h2`
    text-align: center;
    margin: 0 0 30px;
    font-size: 24px;
    font-weight: 900;
    color: ${darkGray};
`;

const ProfileUploader = styled.label`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 3px dashed ${mediumGray};
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: ${lightGray};
    margin-bottom: 30px;
    overflow: hidden;

    svg {
        font-size: 40px;
        color: ${mediumGray};
    }
`;

const ImagePreview = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const Label = styled.label`
    align-self: flex-start;
    margin-bottom: 8px;
    font-weight: 700;
`;

const Input = styled.input`
    width: 100%;
    height: 45px;
    padding: 0 16px;
    margin-bottom: 20px;
    border: 1px solid ${mediumGray};
    border-radius: 8px;
    font-size: 16px;
    box-sizing: border-box;

    &:focus {
        border-color: ${primaryBlue};
        outline: none;
    }
`;

const SubmitButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
    width: 100%;
    height: 50px;
    padding: 0 12px;
    background-color: ${primaryBlue};
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
`;

// ==========================================================
// pages/admin/CreateDirectorPage.js
// CreateActorPage.js와 거의 동일하므로, 컴포넌트를 재사용하거나 복사하여 사용하세요.
// 아래는 CreateDirectorPage의 예시입니다.

/*
import React, { useState } from "react";
// 위에서 정의한 동일한 styled-components를 import하여 사용합니다.
// import { FormContainer, Title, ... } from './CreateActorPageStyles'; 

const CreateDirectorPage = () => {
    // 로직은 CreateActorPage와 동일
    return (
        <>
            <GlobalStyle />
            <Navbar underline={true} />
            <FormContainer>
                <Title>감독 등록</Title>
                // ... 나머지 폼 요소들
            </FormContainer>
        </>
    )
}
export default CreateDirectorPage;
*/
