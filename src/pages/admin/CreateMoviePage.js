import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Navbar from "../../component/common/NavBar";

const CreateMoviePage = () => {
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
    const screeningTypeOptions = ["2D", "3D", "4D"];
    const castTypes = ["주연", "조연", "특별출연"];

    useEffect(() => {
        // 예시: API를 통해 감독 및 배우 목록을 가져옵니다.
        // 실제 API 호출로 대체하세요.
        setDirectors(["감독 A", "감독 B", "감독 C"]);
        setActors(["배우 X", "배우 Y", "배우 Z"]);
    }, []);


    const handleAddPoster = (e) => {
        const file = e.target.files[0];
        if (file && posters.length < 3) {
            setPosters([...posters, file]);
            console.log(posters);
        } else if (posters.length >= 3) {
            alert("포스터는 최대 3개까지 등록할 수 있습니다.");
        }
    };
    const handleRemovePoster = (index) => {
        setPosters(posters.filter((_, i) => i !== index));
    };
    const handleAddCast = () => {
        setCast([...cast, { type: "주연", role: "", actor: "" }]);
    };

    const handleCastChange = (index, field, value) => {
        const updatedCast = [...cast];
        updatedCast[index][field] = value;
        setCast(updatedCast);
    };

    const handleGenreToggle = (genre) => {
        setGenres((prev) =>
            prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
        );
    };

    const handleScreeningTypeToggle = (type) => {
        setScreeningTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("poster", posters);
        formData.append("director", selectedDirector);
        formData.append("releaseDate", releaseDate);
        formData.append("cast", JSON.stringify(cast));
        formData.append("synopsis", synopsis);
        formData.append("duration", duration);
        formData.append("distributor", distributor);
        formData.append("genres", JSON.stringify(genres));
        formData.append("screeningTypes", JSON.stringify(screeningTypes));

        // 실제 API 요청으로 대체하세요.
        console.log("영화 생성 데이터:", {
            title,
            posters,
            selectedDirector,
            releaseDate,
            cast,
            synopsis,
            duration,
            distributor,
            genres,
            screeningTypes,
        });

        alert("영화가 생성되었습니다!");

        // 폼 초기화
        setTitle("");
        setPosters(null);
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
        <div>
            <Navbar underline={true} />
            <FormContainer onSubmit={handleSubmit}>
                <Title>영화 생성</Title>

                <Label>영화명</Label>
                <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="영화 제목을 입력하세요"
                    required
                />

                <Label>포스터 업로드 (최대 3장)</Label>
                <PosterInputContainer>
                    {posters.map((poster, index) => (
                        <PosterPreview key={index}>
                            <img src={URL.createObjectURL(poster)} alt={`poster-${index}`} />
                            <RemoveButton type="button" onClick={() => handleRemovePoster(index)}>제거</RemoveButton>
                        </PosterPreview>
                    ))}
                    {posters.length < 3 && (
                        <PosterInput
                            type="file"
                            accept="image/*"
                            onChange={handleAddPoster}
                        />
                    )}
                </PosterInputContainer>


                <Label>감독명</Label>
                <Select
                    value={selectedDirector}
                    onChange={(e) => setSelectedDirector(e.target.value)}
                    required
                >
                    <option value="">감독을 선택하세요</option>
                    {directors.map((director, index) => (
                        <option key={index} value={director}>
                            {director}
                        </option>
                    ))}
                </Select>

                <Label>개봉일</Label>
                <Input
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    required
                />

                <Label>출연진</Label>
                {cast.map((member, index) => (
                    <CastContainer key={index}>
                        <Select
                            value={member.type}
                            onChange={(e) => handleCastChange(index, "type", e.target.value)}
                            required
                        >
                            {castTypes.map((type, idx) => (
                                <option key={idx} value={type}>
                                    {type}
                                </option>
                            ))}
                        </Select>
                        <Input
                            type="text"
                            value={member.role}
                            onChange={(e) => handleCastChange(index, "role", e.target.value)}
                            placeholder="역할명을 입력하세요"
                            required
                        />
                        <Select
                            value={member.actor}
                            onChange={(e) => handleCastChange(index, "actor", e.target.value)}
                            required
                        >
                            <option value="">배우를 선택하세요</option>
                            {actors.map((actor, idx) => (
                                <option key={idx} value={actor}>
                                    {actor}
                                </option>
                            ))}
                        </Select>
                    </CastContainer>
                ))}
                <AddButton type="button" onClick={handleAddCast}>
                    출연진 추가
                </AddButton>

                <Label>영화 소개</Label>
                <Textarea
                    value={synopsis}
                    onChange={(e) => setSynopsis(e.target.value)}
                    placeholder="영화 줄거리를 입력하세요"
                    required
                />

                <Label>상영 시간 (분)</Label>
                <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="상영 시간을 입력하세요"
                    required
                />

                <Label>배급사</Label>
                <Input
                    type="text"
                    value={distributor}
                    onChange={(e) => setDistributor(e.target.value)}
                    placeholder="배급사를 입력하세요"
                    required
                />

                <Label>장르</Label>
                <ButtonGroup>
                    {genreOptions.map((genre, index) => (
                        <ToggleButton
                            key={index}
                            type="button"
                            active={genres.includes(genre)}
                            onClick={() => handleGenreToggle(genre)}
                        >
                            {genre}
                        </ToggleButton>
                    ))}
                </ButtonGroup>

                <Label>상영 유형</Label>
                <ButtonGroup>
                    {screeningTypeOptions.map((type, index) => (
                        <ToggleButton
                            key={index}
                            type="button"
                            active={screeningTypes.includes(type)}
                            onClick={() => handleScreeningTypeToggle(type)}
                        >
                            {type}
                        </ToggleButton>
                    ))}
                </ButtonGroup>

                <SubmitButton type="submit">등록 완료</SubmitButton>
            </FormContainer>
        </div>
    );
};

export default CreateMoviePage;

const PosterInputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const PosterPreview = styled.div`
  position: relative;

  img {
    width: 200px;
    height: 300px;
    
    border-radius: 6px;
  }
`;

const PosterInput = styled.input`
  padding: 10px 0;

`;

const RemoveButton = styled.button`
  position: absolute;
  top: -5px;
  right: -5px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  cursor: pointer;
`;

// Styled-components
const FormContainer = styled.form`
  max-width: 600px;
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

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  resize: vertical;
`;

const SubmitButton = styled.button`
  margin-top: 25px;
  width: 100%;
  padding: 12px;
  background-color: #1e6dff;
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

const CastContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const AddButton = styled.button`
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #eee;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const ToggleButton = styled.button`
  padding: 8px 14px;
  background-color: ${({ active }) => (active ? "#1e6dff" : "#f0f0f0")};
  color: ${({ active }) => (active ? "white" : "#333")};
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: ${({ active }) => (active ? "#357ab8" : "#e0e0e0")};
  }
`;
