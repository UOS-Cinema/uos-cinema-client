import React, { useState, useEffect, useRef, useContext } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Navbar from '../../component/common/NavBar';
import { FaSave, FaTrashAlt, FaEdit, FaTimes } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';

// 재사용 가능한 검색 선택 컴포넌트
const SearchableSelect = ({ options, value, onChange, placeholder }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        // value가 바뀌면(예: 항목 삭제 후 초기화) searchTerm도 초기화
        if (!value) setSearchTerm("");
    }, [value]);

    const filteredOptions = Array.isArray(options) ? options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const handleSelect = (option) => {
        onChange(option);
        setSearchTerm(option.name);
        setIsOpen(false);
    };

    return (
        <SelectWrapper ref={wrapperRef}>
            <SelectInput 
                type="text"
                placeholder={placeholder}
                value={searchTerm || (value ? value.name : '')}
                onChange={(e) => { setSearchTerm(e.target.value); setIsOpen(true); }}
                onFocus={() => setIsOpen(true)}
            />
            {isOpen && (
                <DropdownList>
                    {filteredOptions.length > 0 ? filteredOptions.map(option => (
                        <DropdownItem key={option.id} onClick={() => handleSelect(option)}>{option.name}</DropdownItem>
                    )) : <DropdownItem disabled>검색 결과 없음</DropdownItem>}
                </DropdownList>
            )}
        </SelectWrapper>
    );
};

// 메인 페이지 컴포넌트
const EditDirectorPage = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [directors, setDirectors] = useState([]);
    const [selectedDirector, setSelectedDirector] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedPhotoUrl, setEditedPhotoUrl] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchDirectors = async () => {
        try {
            const response = await fetch('/directors?page=0&size=100');
            const data = await response.json();
            setDirectors(data.data?.content || []);
        } catch (error) {
            console.error("감독 목록 로딩 실패:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDirectors();
    }, []);

    const handleSelectDirector = (director) => {
        setSelectedDirector(director);
        setIsEditing(false); // 다른 감독 선택 시 수정 모드 해제
        console.log(selectedDirector);
    };

    const handleEditClick = () => {
        if (!selectedDirector) return;
        setEditedPhotoUrl(selectedDirector.photoUrl || '');
        setIsEditing(true);
    };

    const handleUpdate = async () => {
        if (!selectedDirector) return;
        const payload = {
            name: selectedDirector.name,
            photoUrl: editedPhotoUrl,
        };

        try {
            const response = await fetch(`/admin/directors/${selectedDirector.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error("수정에 실패했습니다.");
            alert("성공적으로 수정되었습니다.");
            setIsEditing(false);
            fetchDirectors(); // 목록 새로고침
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async () => {
        if (!selectedDirector || !window.confirm(`'${selectedDirector.name}' 감독을 정말 삭제하시겠습니까?`)) return;
        
        try {
            const response = await fetch(`/admin/directors/${selectedDirector.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${user.accessToken}` },
            });
            if (!response.ok) throw new Error("삭제에 실패했습니다.");
            alert("성공적으로 삭제되었습니다.");
            setSelectedDirector(null); // 선택 초기화
            fetchDirectors(); // 목록 새로고침
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <>
            <GlobalStyle />
            <Navbar underline={true} />
            <Container>
                <Title>감독 수정/삭제</Title>
                <ContentWrapper>
                    <SearchableSelect
                        options={directors}
                        value={selectedDirector}
                        onChange={handleSelectDirector}
                        placeholder="수정할 감독을 검색하세요..."
                    />
                    {selectedDirector && (
                        <Card>
                            <CardImage src={isEditing ? editedPhotoUrl || 'https://placehold.co/150x150/e9ecef/adb5bd?text=Image' : selectedDirector.photoUrl || 'https://placehold.co/150x150/e9ecef/adb5bd?text=Image'} alt={selectedDirector.name} />
                            <CardBody>
                                <CardTitle>{selectedDirector.name}</CardTitle>
                                {isEditing ? (
                                    <>
                                        <Input
                                            type="text"
                                            value={editedPhotoUrl}
                                            onChange={(e) => setEditedPhotoUrl(e.target.value)}
                                            placeholder="새 이미지 URL 입력"
                                        />
                                        <ButtonGroup>
                                            <Button onClick={handleUpdate}><FaSave /> 저장</Button>
                                            <CancelButton onClick={() => setIsEditing(false)}><FaTimes /> 취소</CancelButton>
                                        </ButtonGroup>
                                    </>
                                ) : (
                                    <ButtonGroup>
                                        <Button onClick={handleEditClick}><FaEdit /> 수정</Button>
                                        <DangerButton onClick={handleDelete}><FaTrashAlt /> 삭제</DangerButton>
                                    </ButtonGroup>
                                )}
                            </CardBody>
                        </Card>
                    )}
                </ContentWrapper>
            </Container>
        </>
    );
};

export default EditDirectorPage;

// --- STYLED COMPONENTS ---
const primaryBlue = '#1E6DFF';
const darkGray = '#343a40';
const mediumGray = '#dee2e6';
const lightGray = '#f8f9fa';
const red = '#e03131';

const GlobalStyle = createGlobalStyle`body, html { background-color: ${lightGray}; }`;
const Container = styled.div` max-width: 800px; margin: 50px auto; padding: 0 20px;`;
const Title = styled.h2` font-size: 28px; font-weight: 900; color: ${darkGray}; text-align: center; margin-bottom: 40px; `;
const ContentWrapper = styled.div`
    background-color: #fff; padding: 40px; border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.07); display: flex; flex-direction: column; align-items: center; gap: 30px;
`;
const Card = styled.div`
    display: flex; gap: 30px; align-items: center; width: 100%;
    max-width: 600px; border: 1px solid ${mediumGray}; padding: 20px; border-radius: 12px;
`;
const CardImage = styled.img` width: 100px; height: 100px; border-radius: 50%; object-fit: cover; `;
const CardBody = styled.div` flex: 1; display: flex; flex-direction: column; gap: 15px; `;
const CardTitle = styled.h3` font-size: 20px; font-weight: 700; margin: 0; `;
const ButtonGroup = styled.div` display: flex; gap: 10px; `;
const Button = styled.button`
    display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; font-weight: 700;
    background: ${primaryBlue}; color: white; border: none; border-radius: 6px; cursor: pointer;
`;
const DangerButton = styled(Button)` background: ${red}; `;
const CancelButton = styled(Button)` background: ${darkGray}; `;
const Input = styled.input` width: 100%; padding: 10px; border: 1px solid ${mediumGray}; border-radius: 6px; `;

const SelectWrapper = styled.div` position: relative; width: 100%; max-width: 400px;`;
const SelectInput = styled.input`
  width: 100%; height: 45px; padding: 0 16px; border-radius: 8px;
  border: 1px solid ${mediumGray}; font-size: 16px; box-sizing: border-box;
`;
const DropdownList = styled.ul`
  position: absolute; top: 100%; left: 0; right: 0; background: white;
  border: 1px solid ${mediumGray}; border-radius: 8px; list-style: none;
  padding: 4px; margin-top: 4px; max-height: 200px; overflow-y: auto; z-index: 10;
`;
const DropdownItem = styled.li`
  padding: 10px 12px; cursor: pointer; border-radius: 6px;
  &:hover { background-color: ${lightGray}; }
  ${({ disabled }) => disabled && ` color: #adb5bd; cursor: not-allowed; `}
`;
