import React, { useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Navbar from "../../component/common/NavBar";
import { FaPlus, FaTimes, FaTrashAlt } from "react-icons/fa";

const EditMoviePage = () => {
    const [title, setTitle] = useState("");
    const [posters, setPosters] = useState([]);
    const [directors, setDirectors] = useState([]);
    const [actors, setActors] = useState([]);
    const [selectedDirector, setSelectedDirector] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [cast, setCast] = useState([]);
    const [synopsis, setSynopsis] = useState("");
    const [duration, setDuration] = useState("");
    const [distributor, setDistributor] = useState("");
    const [genres, setGenres] = useState([]);
    const [screeningTypes, setScreeningTypes] = useState([]);

    const genreOptions = ["드라마", "스릴러", "SF", "로맨스", "공포", "판타지", "역사"];
    const screeningTypeOptions = ["2D", "3D", "4D", "IMAX"];
    const castTypes = ["주연", "조연", "특별출연"];

    useEffect(() => {
        setDirectors(["봉준호", "박찬욱", "이병헌"]);
        setActors(["송강호", "최민식", "류승룡", "박해일"]);
    }, []);

    const handleAddPoster = (e) => {
        if (e.target.files && e.target.files[0] && posters.length < 3) {
            const file = e.target.files[0];
            setPosters([...posters, { file, preview: URL.createObjectURL(file) }]);
        }
    };
    
    const handleRemovePoster = (index) => setPosters(posters.filter((_, i) => i !== index));
    const handleAddCast = () => setCast([...cast, { type: "주연", role: "", actor: "" }]);
    const handleRemoveCast = (index) => setCast(cast.filter((_, i) => i !== index));

    const handleCastChange = (index, field, value) => {
        const updatedCast = cast.map((item, i) => i === index ? { ...item, [field]: value } : item);
        setCast(updatedCast);
    };

    const handleToggle = (setter, state, value) => {
        setter(state.includes(value) ? state.filter(v => v !== value) : [...state, value]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 실제 데이터 처리 로직
        alert("영화가 수정되었습니다.");
        // 상태 초기화
        setTitle("");
        setPosters([]);
        setSelectedDirector("");
        setReleaseDate("");
        setCast([]);
        setSynopsis("");
        setDuration("");
        setDistributor("");
        setGenres([]);
        setScreeningTypes([]);
    };


    return (
        <>
            <GlobalStyle />
            <Navbar underline={true} />
            <FormContainer onSubmit={handleSubmit}>
                <Title>영화 수정</Title>

                <Section>
                    <Label>영화명</Label>
                    <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="영화 제목" required />
                </Section>
                
                <Section>
                    <Label>포스터 (최대 3장)</Label>
                    <PosterInputContainer>
                         {posters.map((poster, index) => (
                            <PosterPreview key={index}>
                                <img src={poster.preview} alt={`poster-${index}`} />
                                <RemoveButton type="button" onClick={() => handleRemovePoster(index)}><FaTimes /></RemoveButton>
                            </PosterPreview>
                        ))}
                        {posters.length < 3 && (
                            <PosterUploadLabel htmlFor="poster-upload">+</PosterUploadLabel>
                        )}
                        <input id="poster-upload" type="file" accept="image/*" onChange={handleAddPoster} style={{ display: 'none' }} />
                    </PosterInputContainer>
                </Section>

                <Row>
                    <Section>
                        <Label>감독</Label>
                        <Select value={selectedDirector} onChange={(e) => setSelectedDirector(e.target.value)} required>
                            <option value="">감독 선택</option>
                            {directors.map((d, i) => <option key={i} value={d}>{d}</option>)}
                        </Select>
                    </Section>
                    <Section>
                        <Label>개봉일</Label>
                        <Input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} required />
                    </Section>
                </Row>
                <Row>
                    <Section>
                        <Label>상영 시간 (분)</Label>
                        <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="예: 135" required />
                    </Section>
                    <Section>
                        <Label>배급사</Label>
                        <Input type="text" value={distributor} onChange={(e) => setDistributor(e.target.value)} placeholder="배급사명" required />
                    </Section>
                </Row>

                <Section>
                     <Label>출연진</Label>
                     {cast.map((member, index) => (
                         <CastContainer key={index}>
                            <Select value={member.type} onChange={(e) => handleCastChange(index, "type", e.target.value)} >
                                {castTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </Select>
                            <Input type="text" value={member.actor} onChange={(e) => handleCastChange(index, "actor", e.target.value)} placeholder="배우명 (검색)" />
                            <Input type="text" value={member.role} onChange={(e) => handleCastChange(index, "role", e.target.value)} placeholder="역할명" />
                            <ActionButton type="button" onClick={() => handleRemoveCast(index)}><FaTrashAlt/></ActionButton>
                         </CastContainer>
                     ))}
                     <AddButton type="button" onClick={handleAddCast}><FaPlus /> 출연진 추가</AddButton>
                </Section>

                <Section>
                    <Label>영화 소개</Label>
                    <Textarea value={synopsis} onChange={(e) => setSynopsis(e.target.value)} placeholder="영화 줄거리" required />
                </Section>
                
                <Section><Label>장르</Label><ButtonGroup>{genreOptions.map(g => <ToggleButton key={g} type="button" active={genres.includes(g)} onClick={() => handleToggle(setGenres, genres, g)}>{g}</ToggleButton>)}</ButtonGroup></Section>
                <Section><Label>상영 유형</Label><ButtonGroup>{screeningTypeOptions.map(t => <ToggleButton key={t} type="button" active={screeningTypes.includes(t)} onClick={() => handleToggle(setScreeningTypes, screeningTypes, t)}>{t}</ToggleButton>)}</ButtonGroup></Section>
                
                <SubmitButton type="submit">영화 등록하기</SubmitButton>
            </FormContainer>
        </>
    );
};

export default EditMoviePage;

// --- STYLED COMPONENTS ---
const primaryBlue = '#1E6DFF';
const darkGray = '#343a40';
const mediumGray = '#dee2e6';
const lightGray = '#f8f9fa';
const red = '#e03131';

const GlobalStyle = createGlobalStyle`body, html { background-color: ${lightGray}; }`;

const FormContainer = styled.form`
  max-width: 800px;
  margin: 40px auto;
  padding: 40px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.07);
`;

const Title = styled.h2`
  text-align: center;
  margin: 0 0 40px;
  font-size: 28px;
  font-weight: 900;
  color: ${darkGray};
`;

const Section = styled.div`
  margin-bottom: 24px;
  flex: 1;
`;

const Row = styled.div`
    display: flex;
    gap: 24px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: 700;
  font-size: 16px;
`;

const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid ${mediumGray};
  border-radius: 8px;
  font-size: 15px;
  box-sizing: border-box;
  &:focus { border-color: ${primaryBlue}; outline: none; }
`;

const Select = styled.select`
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid ${mediumGray};
  border-radius: 8px;
  font-size: 15px;
  box-sizing: border-box;
  &:focus { border-color: ${primaryBlue}; outline: none; }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  height: 120px;
  border: 1px solid ${mediumGray};
  border-radius: 8px;
  font-size: 15px;
  resize: vertical;
  box-sizing: border-box;
  &:focus { border-color: ${primaryBlue}; outline: none; }
`;

const PosterInputContainer = styled.div`
  display: flex;
  gap: 16px;
`;

const PosterUploadLabel = styled.label`
    width: 150px;
    height: 225px;
    border: 2px dashed ${mediumGray};
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    color: ${mediumGray};
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover { border-color: ${primaryBlue}; color: ${primaryBlue}; }
`;

const PosterPreview = styled.div`
  position: relative;
  img {
    width: 150px;
    height: 225px;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  background: ${darkGray};
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CastContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
`;

const AddButton = styled.button`
  margin-top: 10px;
  padding: 10px 16px;
  background-color: ${lightGray};
  color: ${darkGray};
  border: 1px solid ${mediumGray};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  &:hover { background-color: #e9ecef; }
`;

const ActionButton = styled(AddButton)`
    background-color: #fff2f2;
    color: ${red};
    border-color: #ffc9c9;
    padding: 0;
    width: 42px;
    height: 42px;
    justify-content: center;
    &:hover { background-color: #ffe3e3; }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ToggleButton = styled.button`
  padding: 8px 16px;
  background-color: ${({ active }) => (active ? primaryBlue : "#fff")};
  color: ${({ active }) => (active ? "white" : darkGray)};
  border: 1px solid ${({ active }) => (active ? primaryBlue : mediumGray)};
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
`;

const SubmitButton = styled.button`
  margin-top: 40px;
  width: 100%;
  padding: 14px;
  background-color: ${primaryBlue};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  &:hover { background-color: #0056b3; }
`;
