import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import Navbar from '../../component/common/NavBar';
import { FaSave, FaTrashAlt, FaEdit } from "react-icons/fa";
import { useGenres } from '../../context/GenreContext';
import { UserContext } from '../../context/UserContext';

const EditGenrePage = () => {
    const { genres: initialGenres, loading, error, refresh } = useGenres();
    const { user } = useContext(UserContext);
    const [genres, setGenres] = useState([]);
    const [editItem, setEditItem] = useState({ id: null, name: '', description: '' });

    useEffect(() => {
        setGenres(initialGenres);
    }, [initialGenres]);

    const handleEditClick = (genre) => {
        setEditItem({ id: genre.name, name: genre.name, description: genre.description });
    };

    const handleCancelEdit = () => {
        setEditItem({ id: null, name: '', description: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditItem(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        const payload = {
            name: editItem.name,
            description: editItem.description,
            imageUrl: null,
        };

        try {
            await fetch(`/admin/genres/${editItem.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            alert('성공적으로 수정되었습니다.');
            handleCancelEdit();
            refresh?.();
        } catch (err) {
            alert('수정에 실패했습니다: ' + err.message);
        }
    };

    const handleDelete = async (genreName) => {
        if (!window.confirm(`'${genreName}' 장르를 정말 삭제하시겠습니까?`)) return;
        try {
            await fetch(`/admin/genres/${genreName}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.accessToken}` },
            });
            alert('성공적으로 삭제되었습니다.');
            refresh?.();
        } catch (err) {
            alert('삭제에 실패했습니다: ' + err.message);
        }
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>오류: {error}</div>;

    return (
        <>
            <Navbar underline={true} />
            <Container>
                <Title>장르 수정/삭제</Title>
                <Table>
                    <thead>
                        <tr>
                            <Th>이름</Th>
                            <Th>설명</Th>
                            {/* 이미지 열 제거 */}
                            <Th>관리</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {genres.map(genre => (
                            <tr key={genre.name}>
                                {editItem.id === genre.name ? (
                                    <>
                                        <Td><Input name="name" value={editItem.name} onChange={handleInputChange} /></Td>
                                        <Td><Input name="description" value={editItem.description} onChange={handleInputChange} /></Td>
                                        {/* 이미지 수정 UI 제거 */}
                                        <Td>
                                            <Button onClick={handleUpdate}><FaSave /> 저장</Button>
                                            <CancelButton onClick={handleCancelEdit}>취소</CancelButton>
                                        </Td>
                                    </>
                                ) : (
                                    <>
                                        <Td>{genre.name}</Td>
                                        <Td>{genre.description}</Td>
                                        {/* 이미지 표시 UI 제거 */}
                                        <Td>
                                            <Button onClick={() => handleEditClick(genre)}><FaEdit /> 수정</Button>
                                            <DangerButton onClick={() => handleDelete(genre.name)}><FaTrashAlt /> 삭제</DangerButton>
                                        </Td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    );
};

export default EditGenrePage;

// --- STYLED COMPONENTS ---
const primaryBlue = '#1E6DFF';
const darkGray = '#343a40';
const mediumGray = '#dee2e6';
const red = '#e03131';

const Container = styled.div` max-width: 1000px; margin: 50px auto; `;
const Title = styled.h2` font-size: 28px; font-weight: 900; color: ${darkGray}; margin-bottom: 30px; `;
const Table = styled.table`
    width: 100%; border-collapse: collapse; background-color: #fff;
    box-shadow: 0 4px 15px rgba(0,0,0,0.06);
`;
const Th = styled.th`
    background-color: #f8f9fa; padding: 12px 16px; text-align: left;
    border-bottom: 1px solid ${mediumGray}; font-weight: 700;
`;
const Td = styled.td` padding: 12px 16px; border-bottom: 1px solid ${mediumGray}; vertical-align: middle; `;
const Input = styled.input` width: 100%; padding: 8px; box-sizing: border-box; `;
const Button = styled.button`
    display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px;
    font-weight: 700; background: ${primaryBlue}; color: white;
    border: none; border-radius: 6px; cursor: pointer; margin-right: 8px;
`;
const DangerButton = styled(Button)` background: ${red}; `;
const CancelButton = styled(Button)` background: ${darkGray}; `;
