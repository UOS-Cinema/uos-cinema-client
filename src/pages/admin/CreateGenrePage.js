import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import Navbar from '../../component/common/NavBar';
import { FaPlus } from 'react-icons/fa';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useGenres } from '../../context/GenreContext';

const CreateGenrePage = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { refresh: refreshGenres } = useGenres();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !description.trim()) {
            alert("장르 이름과 설명을 모두 입력해주세요.");
            return;
        }

        const payload = {
            name: name,
            description: description,
            imageUrl: null, // 이미지 기능이 없으므로 null로 전송
        };

        try {
            const response = await fetch('/admin/genres', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert('새로운 장르가 성공적으로 등록되었습니다.');
                refreshGenres?.(); // Context의 데이터 새로고침
                navigate('/movieManage'); 
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || '장르 등록에 실패했습니다.');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <>
            <Navbar underline={true} />
            <Container>
                <Form onSubmit={handleSubmit}>
                    <Title>새 장르 등록</Title>
                    {/* 이미지 관련 UI가 모두 제거되었습니다. */}
                    <InputGroup>
                        <Label htmlFor="name">장르 이름</Label>
                        <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor="description">장르 설명</Label>
                        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </InputGroup>
                    <SubmitButton type="submit"><FaPlus /> 등록하기</SubmitButton>
                </Form>
            </Container>
        </>
    );
};

export default CreateGenrePage;

// --- STYLED COMPONENTS ---
const primaryBlue = '#1E6DFF';
const darkGray = '#343a40';
const mediumGray = '#dee2e6';

const Container = styled.div` max-width: 600px; margin: 50px auto; `;
const Form = styled.form`
    background-color: #fff; padding: 40px; border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.07);
`;
const Title = styled.h2` font-size: 28px; font-weight: 900; color: ${darkGray}; text-align: center; margin-bottom: 30px; `;
const InputGroup = styled.div` margin-bottom: 20px; `;
const Label = styled.label` display: block; font-weight: 700; margin-bottom: 8px; color: ${darkGray}; `;
const Input = styled.input`
    width: 100%; padding: 12px; border: 1px solid ${mediumGray};
    border-radius: 8px; font-size: 16px; box-sizing: border-box;
`;
const Textarea = styled.textarea`
    width: 100%; padding: 12px; border: 1px solid ${mediumGray};
    border-radius: 8px; font-size: 16px; box-sizing: border-box;
    resize: vertical; min-height: 100px;
`;
const SubmitButton = styled.button`
    width: 100%; display: inline-flex; align-items: center; justify-content: center;
    gap: 8px; padding: 14px; background-color: ${primaryBlue};
    color: white; border: none; border-radius: 8px; font-size: 18px;
    font-weight: 700; cursor: pointer; transition: background-color 0.2s;
    &:hover { background-color: #0056b3; }
`;
