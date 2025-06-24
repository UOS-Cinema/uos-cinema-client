import React, { useState, useEffect, useRef, useContext } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Navbar from "../../component/common/NavBar";
import { FaPlus, FaTimes, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { useGenres } from '../../context/GenreContext';
import { useScreenTypes } from '../../context/ScreenTypeContext';

// --- 재사용 가능한 검색 선택(Searchable Select) 컴포넌트 ---
const SearchableSelect = ({ options, value, onChange, placeholder }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    // 1. ref 변수를 'wrapperRef'로 선언합니다.
    const wrapperRef = useRef(null);

    const validOptions = Array.isArray(options) ? options : [];
    const filteredOptions = validOptions.filter(option => 
        option && typeof option.name === 'string' &&
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
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
        // 2. JSX에서도 동일한 'wrapperRef' 변수를 사용합니다.
        <SelectWrapper ref={wrapperRef}>
            <SelectInput 
                type="text"
                placeholder={placeholder}
                value={searchTerm || (value ? value.name : '')}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
            />
            {isOpen && (
                <DropdownList>
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(option => (
                            <DropdownItem key={option.id} onClick={() => handleSelect(option)}>
                                {option.name}
                            </DropdownItem>
                        ))
                    ) : (
                        <DropdownItem disabled>검색 결과 없음</DropdownItem>
                    )}
                </DropdownList>
            )}
        </SelectWrapper>
    );
};


const CreateMoviePage = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const { genres: genreOptions, loading: genresLoading } = useGenres();
    const { screenTypes: screeningTypeOptions, loading: screenTypesLoading } = useScreenTypes();

    // --- 폼 상태 관리 ---
    const [formData, setFormData] = useState({
        title: "", releaseDate: "", synopsis: "",
        duration: "", distributor: "", rating: "ALL",
    });
    const [posters, setPosters] = useState([]);
    const [posterUrlInput, setPosterUrlInput] = useState("");
    const [selectedDirector, setSelectedDirector] = useState(null);
    const [cast, setCast] = useState([]);
    const [genres, setGenres] = useState([]);
    const [screeningTypes, setScreeningTypes] = useState([]);

    const [directorOptions, setDirectorOptions] = useState([]);
    const [actorOptions, setActorOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [directorsRes, actorsRes] = await Promise.all([
                    fetch('/directors?size=100'),
                    fetch('/actors?size=100')
                ]);
                const directorsData = await directorsRes.json();
                const actorsData = await actorsRes.json();
                
                setDirectorOptions(directorsData.data?.content || []);
                setActorOptions(actorsData.data?.content || []);

            } catch (error) {
                console.error("Failed to fetch directors or actors:", error);
                alert("감독 또는 배우 목록을 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- UI 핸들러 ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleAddPoster = () => {
        if (posterUrlInput && posters.length < 3) {
            setPosters([...posters, posterUrlInput]);
            setPosterUrlInput("");
        }
    };
    const handleRemovePoster = (index) => setPosters(posters.filter((_, i) => i !== index));
    const handleAddCast = () => setCast([...cast, { type: "LEAD", role: "", actor: null }]);
    const handleRemoveCast = (index) => setCast(cast.filter((_, i) => i !== index));
    const handleCastChange = (index, field, value) => {
        const updatedCast = cast.map((item, i) => i === index ? { ...item, [field]: value } : item);
        setCast(updatedCast);
    };
    const handleToggle = (setter, state, value) => {
        setter(state.includes(value) ? state.filter(v => v !== value) : [...state, value]);
    };

    // --- 데이터 제출 핸들러 ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedDirector) return alert("감독을 선택해주세요.");
        console.log(cast);
        if (cast.some(c => !c.actor || !c.role)) return alert("출연진 정보를 모두 입력해주세요.");

        const payload = {
            title: formData.title,
            synopsis: formData.synopsis,
            runningTime: Number(formData.duration),
            rating: formData.rating,
            posterUrls: posters,
            releaseDate: formData.releaseDate,
            distributor: formData.distributor,
            directorId: selectedDirector.id,
            screenTypes: screeningTypes,
            actors: cast.map(c => ({
                actorId: c.actor.id,
                role: c.role,
                castingType: c.type,
            })),
            genres: genres,
        };

        try {
            const response = await fetch('/admin/movies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.accessToken}`
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("영화가 성공적으로 등록되었습니다.");
                navigate('/movieManage');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || '영화 등록에 실패했습니다.');
            }
        } catch (err) {
            console.error("Failed to create movie:", err);
            alert(err.message);
        }
    };

    const ratingOptions = ["ALL", "TWELVE", "FIFTEEN", "NINETEEN"];
    const castTypes = [{label: "주연", value: "LEAD"}, {label: "조연", value: "SUPPORTING"}, {label: "특별출연", value: "SPECIAL_APPEARANCE"}];

    const isLoading = loading || genresLoading || screenTypesLoading;
    if (isLoading) return <div>데이터를 불러오는 중...</div>;

    return (
        <>
            <GlobalStyle />
            <Navbar underline={true} />
            <FormContainer onSubmit={handleSubmit}>
                <Title>영화 등록</Title>
                <Section><Label htmlFor="title">영화명</Label><Input id="title" name="title" type="text" value={formData.title} onChange={handleInputChange} placeholder="영화 제목" required /></Section>
                <Section>
                    <Label>포스터 URL (최대 3개)</Label>
                    <PosterInputContainer>
                        <Input value={posterUrlInput} onChange={(e) => setPosterUrlInput(e.target.value)} placeholder="이미지 URL 입력"/>
                        <AddButton type="button" onClick={handleAddPoster} disabled={posters.length >= 3}>URL 추가</AddButton>
                    </PosterInputContainer>
                    <PosterPreviewContainer>
                        {posters.map((url, index) => (
                            <PosterPreview key={index}>
                                <img src={url} alt={`poster-${index}`} referrerPolicy="no-referrer" />
                                <RemoveButton type="button" onClick={() => handleRemovePoster(index)}><FaTimes /></RemoveButton>
                            </PosterPreview>
                        ))}
                    </PosterPreviewContainer>
                </Section>
                <Row>
                    <Section>
                        <Label>감독</Label>
                        <SearchableSelect options={directorOptions} value={selectedDirector} onChange={setSelectedDirector} placeholder="감독 검색" />
                    </Section>
                    <Section>
                        <Label>개봉일</Label>
                        <Input name="releaseDate" type="date" value={formData.releaseDate} onChange={handleInputChange} required />
                    </Section>
                </Row>
                <Row>
                    <Section><Label>상영 시간 (분)</Label><Input name="duration" type="number" value={formData.duration} onChange={handleInputChange} placeholder="예: 135" required /></Section>
                    <Section><Label>배급사</Label><Input name="distributor" type="text" value={formData.distributor} onChange={handleInputChange} placeholder="배급사명" required /></Section>
                </Row>
                <Section><Label>관람 등급</Label><ButtonGroup>{ratingOptions.map(r => <ToggleButton key={r} type="button" active={formData.rating === r} onClick={() => setFormData(prev => ({...prev, rating: r}))}>{r}</ToggleButton>)}</ButtonGroup></Section>
                <Section>
                    <Label>출연진</Label>
                    {cast.map((member, index) => (
                        <CastContainer key={index}>
                            <Select value={member.type} onChange={(e) => handleCastChange(index, "type", e.target.value)} >
                                {castTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </Select>
                            <SearchableSelect options={actorOptions} value={member.actor} onChange={(val) => handleCastChange(index, "actor", val)} placeholder="배우 검색"/>
                            <Input type="text" value={member.role} onChange={(e) => handleCastChange(index, "role", e.target.value)} placeholder="역할명" />
                            <ActionButton type="button" onClick={() => handleRemoveCast(index)}><FaTrashAlt/></ActionButton>
                        </CastContainer>
                    ))}
                    <AddButton type="button" onClick={handleAddCast}><FaPlus /> 출연진 추가</AddButton>
                </Section>
                <Section><Label>영화 소개</Label><Textarea name="synopsis" value={formData.synopsis} onChange={handleInputChange} placeholder="영화 줄거리" required /></Section>
                
                <Section>
                    <Label>장르</Label>
                    <ButtonGroup>
                        {genreOptions.map(g => (
                            <ToggleButton 
                                key={g.name} 
                                type="button" 
                                active={genres.includes(g.name)} 
                                onClick={() => handleToggle(setGenres, genres, g.name)}
                            >
                                {g.name}
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                </Section>
                <Section>
                    <Label>상영 유형</Label>
                    <ButtonGroup>
                        {screeningTypeOptions.map(t => (
                            <ToggleButton 
                                key={t.type} 
                                type="button" 
                                active={screeningTypes.includes(t.type)} 
                                onClick={() => handleToggle(setScreeningTypes, screeningTypes, t.type)}
                            >
                                {t.type}
                            </ToggleButton>
                        ))}
                    </ButtonGroup>
                </Section>
                
                <SubmitButton type="submit">영화 등록하기</SubmitButton>
            </FormContainer>
        </>
    );
};

export default CreateMoviePage;

// --- STYLED COMPONENTS ---
const primaryBlue = '#1E6DFF';
const darkGray = '#343a40';
const mediumGray = '#dee2e6';
const lightGray = '#f8f9fa';
const red = '#e03131';

const GlobalStyle = createGlobalStyle`body, html { background-color: ${lightGray}; }`;
const FormContainer = styled.form`
  max-width: 800px; margin: 40px auto; padding: 40px;
  background: #fff; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.07);
`;
const Title = styled.h2`
  text-align: center; margin: 0 0 40px; font-size: 28px;
  font-weight: 900; color: ${darkGray};
`;
const Section = styled.div` margin-bottom: 24px; flex: 1; `;
const Row = styled.div` display: flex; gap: 24px; `;
const Label = styled.label` display: block; margin-bottom: 10px; font-weight: 700; font-size: 16px; `;
const Input = styled.input`
  width: 100%; height: 42px; padding: 0 12px;
  border: 1px solid ${mediumGray}; border-radius: 8px; font-size: 15px;
  box-sizing: border-box; &:focus { border-color: ${primaryBlue}; outline: none; }
`;
const Select = styled.select`
  width: 100%; height: 42px; padding: 0 12px;
  border: 1px solid ${mediumGray}; border-radius: 8px; font-size: 15px;
  box-sizing: border-box; &:focus { border-color: ${primaryBlue}; outline: none; }
`;
const Textarea = styled.textarea`
  width: 100%; padding: 12px; height: 120px;
  border: 1px solid ${mediumGray}; border-radius: 8px; font-size: 15px;
  resize: vertical; box-sizing: border-box; &:focus { border-color: ${primaryBlue}; outline: none; }
`;
const PosterInputContainer = styled.div` display: flex; gap: 10px; align-items: center;`;
const PosterPreviewContainer = styled.div` display: flex; gap: 16px; margin-top: 10px; flex-wrap: wrap; `;
const PosterPreview = styled.div`
  position: relative;
  img { width: 100px; height: 150px; object-fit: cover; border-radius: 8px; }
`;
const RemoveButton = styled.button`
  position: absolute; top: -10px; right: -10px; background: ${darkGray};
  color: white; border: none; border-radius: 50%; width: 24px; height: 24px;
  font-size: 12px; cursor: pointer; display: flex;
  justify-content: center; align-items: center;
`;
const CastContainer = styled.div`
  display: grid; grid-template-columns: 1fr 2fr 2fr auto;
  gap: 10px; align-items: center; margin-bottom: 10px;
`;
const AddButton = styled.button`
  margin-top: 10px; padding: 10px 16px; background-color: ${lightGray};
  color: ${darkGray}; border: 1px solid ${mediumGray}; border-radius: 8px;
  font-size: 14px; font-weight: 700; cursor: pointer;
  display: inline-flex; align-items: center; gap: 6px;
  &:hover { background-color: #e9ecef; }
`;
const ActionButton = styled(AddButton)`
    background-color: #fff2f2; color: ${red}; border-color: #ffc9c9;
    padding: 0; width: 42px; height: 42px; justify-content: center;
    &:hover { background-color: #ffe3e3; }
`;
const ButtonGroup = styled.div` display: flex; flex-wrap: wrap; gap: 10px; `;
const ToggleButton = styled.button`
  padding: 8px 16px;
  background-color: ${({ active }) => (active ? primaryBlue : "#fff")};
  color: ${({ active }) => (active ? "white" : darkGray)};
  border: 1px solid ${({ active }) => (active ? primaryBlue : mediumGray)};
  border-radius: 20px; cursor: pointer; font-size: 14px; font-weight: 500;
`;
const SubmitButton = styled.button`
  margin-top: 40px; width: 100%; padding: 14px; background-color: ${primaryBlue};
  color: white; border: none; border-radius: 8px; font-size: 18px;
  font-weight: 700; cursor: pointer;
  &:hover { background-color: #0056b3; }
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;
const SelectInput = styled(Input)``;
const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid ${mediumGray};
  border-radius: 8px;
  list-style: none;
  padding: 4px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
`;
const DropdownItem = styled.li`
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 6px;
  &:hover { background-color: ${lightGray}; }
  ${({ disabled }) => disabled && `
    color: #adb5bd;
    cursor: not-allowed;
  `}
`;
