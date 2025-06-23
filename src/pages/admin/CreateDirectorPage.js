import React, { useState, useContext } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Navbar from "../../component/common/NavBar";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const CreateDirectorPage = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [photoUrl, setPhotoUrl] = useState(""); // 이미지 URL을 위한 상태

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("감독 이름을 입력해주세요.");
            return;
        }

        // 1. 전송할 데이터를 JSON 객체로 생성
        const payload = {
            name: name,
            photoUrl: photoUrl || null, // 비어있으면 null
        };

        try {
            // 2. fetch 요청을 JSON 형식으로 수정
            const response = await fetch('/admin/directors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Content-Type 명시
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: JSON.stringify(payload) // body를 JSON 문자열로 변환
            });

            if (response.ok) {
                alert(`감독 '${name}' 정보가 성공적으로 등록되었습니다.`);
                navigate('/movieManage');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "감독 등록에 실패했습니다.");
            }
        } catch (err) {
            console.error("Failed to create director:", err);
            alert(err.message);
        }
    };

    return (
        <>
            <GlobalStyle />
            <Navbar underline={true} />
            <FormContainer onSubmit={handleSubmit}>
                <Title>감독 등록</Title>
                
                {/* 이미지 미리보기 */}
                <ImagePreview src={photoUrl || 'https://placehold.co/150x150/e9ecef/adb5bd?text=Image'} alt="감독 사진" />

                <Label htmlFor="director-photo-url">프로필 사진 URL</Label>
                <Input
                    id="director-photo-url"
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="이미지 URL을 입력하세요"
                />

                <Label htmlFor="director-name">이름</Label>
                <Input
                    id="director-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="감독 이름"
                    required
                />
                <SubmitButton type="submit"><FaUserPlus /> 감독 등록하기</SubmitButton>
            </FormContainer>
        </>
    );
};

export default CreateDirectorPage;

// --- STYLED COMPONENTS ---
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

const ImagePreview = styled.img`
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 20px;
    border: 3px solid ${mediumGray};
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
    transition: background-color 0.2s;

    &:hover {
        background-color: #0056b3;
    }
`;
