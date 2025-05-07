import { useState } from "react";
import styled from "styled-components";
import Navbar from "../../component/common/NavBar";

const CreateActorPage = () => {
    const [name, setName] = useState("");
    const [profileImage, setProfileImage] = useState(null); // 파일 객체 저장
    const [previewUrl, setPreviewUrl] = useState(null); // 이미지 미리보기용

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!profileImage) {
            alert("프로필 사진을 선택해주세요.");
            return;
        }

        // 서버 전송 예시 (FormData 이용)
        const formData = new FormData();
        formData.append("name", name);
        formData.append("profileImage", profileImage);

        // 실제 API 요청은 주석 처리
        console.log("배우 생성:", { name, profileImage });
        alert("배우가 생성되었습니다!");

        // 초기화
        setName("");
        setProfileImage(null);
        setPreviewUrl(null);
    };

    return (
        <div>
            <Navbar underline={true} />
            <FormContainer onSubmit={handleSubmit}>
                <Title>배우 생성</Title>
                <Label>이름</Label>
                <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="배우 이름을 입력하세요"
                    required
                />
                <Label>프로필 사진</Label>
                <Input type="file" accept="image/*" onChange={handleFileChange} required />

                {previewUrl && <ImagePreview src={previewUrl} alt="미리보기" />}

                <SubmitButton type="submit">생성하기</SubmitButton>
            </FormContainer>
        </div>
    );
};

export default CreateActorPage;

// Styled-components
const FormContainer = styled.form`
    max-width: 500px;
    margin: 50px auto;
    padding: 30px;
    background: #f8f9fb;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
    text-align: center;
    margin-bottom: 20px;
    color: #333;
`;

const Label = styled.label`
    display: block;
    margin-top: 15px;
    font-weight: 600;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 16px;
`;

const SubmitButton = styled.button`
    margin-top: 25px;
    width: 100%;
    padding: 12px;
    background-color: #1E6DFF;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;

    &:hover {
        background-color: #357ab8;
    }
`;

const ImagePreview = styled.img`
    margin-top: 15px;
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
`;

