import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import Navbar from "../component/common/NavBar";
import { UserContext } from "../context/UserContext";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

// --- 목업 데이터 ---
const MockUserProvider = ({ children }) => {
    const [user, setUser] = useState({ role: 'admin' });
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
// --- 목업 데이터 끝 ---


const DirectorDetailPage = () => {
    const { user } = useContext(UserContext) || { user: { role: null } };
    const { id } = useParams();
    const location = useLocation();
    const { name, photoUrl } = location.state || { name: '정보 없음', photoUrl: '' };

    const [filmography, setFilmography] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 컴포넌트가 마운트되거나 id가 변경될 때 필모그래피 API를 호출합니다.
    useEffect(() => {
        const fetchFilmography = async () => {
            if (!id) return;

            setLoading(true);
            setError(null);
            try {
                // 1단계: 감독의 필모그래피에 포함된 영화 ID 목록을 가져옵니다.
                console.log(id);
                const idListResponse = await fetch(`/directors/${id}/movies`);
                if (!idListResponse.ok) {
                    throw new Error('영화 목록을 불러오는 데 실패했습니다.');
                }
                const idListData = await idListResponse.json();
                const movieIds = idListData.data?.movieIds;
                console.log(movieIds);
                if (!movieIds || movieIds.length === 0) {
                    setFilmography([]); // 영화가 없으면 빈 배열로 설정하고 종료
                    return;
                }

                // 2단계: 각 영화 ID에 대해 상세 정보를 병렬로 요청합니다.
                const movieDetailPromises = movieIds.map(movieId =>
                    fetch(`/movies/${movieId}/simple`).then(res => {
                        if (res.ok) {
                            return res.json();
                        }
                        // 개별 요청 실패 시 에러를 로그에 남기고 null을 반환하여 전체가 중단되지 않게 함
                        console.error(`영화 정보 로딩 실패 (ID: ${movieId})`);
                        return null;
                    })
                );
                
                // 모든 상세 정보 요청이 완료될 때까지 기다립니다.
                const movieDetailResults = await Promise.all(movieDetailPromises);

                // 성공한 요청들만 필터링하고, 실제 데이터(data 프로퍼티)를 추출합니다.
                const validMovieDetails = movieDetailResults
                    .filter(result => result !== null)
                    .map(result => result.data);
                
                setFilmography(validMovieDetails);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFilmography();
    }, [id]);

    return (
        <>
            <GlobalStyle />
            <MockUserProvider>
                <Navbar underline={true} />
                <Container>
                    <LeftSection>
                        <ProfileImage src={photoUrl || 'https://placehold.co/300x450/e2e8f0/e2e8f0?text=Image'} alt={name} />
                        <DirectorName>{name}</DirectorName>
                        {user.role === "admin" && (
                            <ActionButtons>
                                <EditButton to={`/edit-director/${id}`} state={{ name, photoUrl }}><FaEdit /> 수정하기</EditButton>
                                <DeleteButton><FaTrashAlt /> 삭제하기</DeleteButton>
                            </ActionButtons>
                        )}
                    </LeftSection>
                    <RightSection>
                        <SectionTitle>필모그래피</SectionTitle>
                        {loading && <StatusText>필모그래피를 불러오는 중...</StatusText>}
                        {error && <StatusText error>{error}</StatusText>}
                        {!loading && !error && (
                            <FilmographyGrid>
                                {filmography.length > 0 ? (
                                    filmography.map((film, index) => (
                                        <FilmCard key={film.id} delay={index}>
                                            <PosterLink to={`/movie/${film.id}`}>
                                                {/* API 응답의 posterUrls를 사용합니다. */}
                                                <FilmPoster src={film.posterUrls} alt={film.title} />
                                                <HoverOverlay>
                                                    <DetailButton>상세보기</DetailButton>
                                                </HoverOverlay>
                                            </PosterLink>
                                            <FilmInfo>
                                                <FilmTitle>{film.title}</FilmTitle>
                                                {/* API 응답의 releaseDate 배열에서 연도를 추출합니다. */}
                                                <FilmYear>{film.releaseDate[0]}</FilmYear>
                                            </FilmInfo>
                                        </FilmCard>
                                    ))
                                ) : (
                                    <StatusText>등록된 필모그래피가 없습니다.</StatusText>
                                )}
                            </FilmographyGrid>
                        )}
                    </RightSection>
                </Container>
            </MockUserProvider>
        </>
    );
};

export default DirectorDetailPage;

// --- STYLED COMPONENTS (이하 동일) ---

const primaryBlue = '#1E6DFF';
const darkGray = '#212529';
const mediumGray = '#adb5bd';
const lightGray = '#f8f9fa';
const red = '#e03131';

const GlobalStyle = createGlobalStyle`
  body, html {
    background-color: ${lightGray};
    margin: 0;
    font-family: 'Noto Sans KR', sans-serif;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
  display: flex;
  gap: 50px;
  padding: 40px;
  max-width: 1400px;
  margin: 40px auto;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
`;

const LeftSection = styled.div`
  flex-basis: 300px;
  flex-shrink: 0;
  text-align: center;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 450px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  background-color: ${lightGray};
`;

const DirectorName = styled.h2`
  margin-top: 20px;
  font-size: 28px;
  font-weight: 900;
  color: ${darkGray};
`;

const ActionButtons = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
`;

const ButtonBase = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: 1;
  text-decoration: none;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const EditButton = styled(ButtonBase)`
  background-color: ${primaryBlue};
  color: white;
  &:hover { background-color: #0056b3; }
`;

const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: 1;
  text-decoration: none;
  border: 1px solid ${mediumGray};
  padding: 12px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: transparent;
  color: ${darkGray};
  
  &:hover {
    background-color: ${red};
    border-color: ${red};
    color: white;
  }
`;

const RightSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const SectionTitle = styled.h3`
  font-size: 24px;
  font-weight: 900;
  margin: 0 0 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${mediumGray};
  color: ${darkGray};
`;

const StatusText = styled.p`
    text-align: center;
    padding: 50px;
    font-size: 18px;
    color: ${props => props.error ? red : mediumGray};
    grid-column: 1 / -1; /* 그리드 전체 영역을 차지하도록 설정 */
`;

const FilmographyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 24px;
`;

const HoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const DetailButton = styled.div`
  padding: 10px 20px;
  border-radius: 6px;
  background-color: white;
  color: ${darkGray};
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  width: 80%;
`;

const PosterLink = styled(Link)`
  display: block;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  
  &:hover ${HoverOverlay} {
    opacity: 1;
  }
`;

const FilmPoster = styled.img`
  width: 100%;
  height: 240px;
  object-fit: cover;
  display: block;
  background-color: ${lightGray};
`;

const FilmInfo = styled.div`
  padding: 12px 0;
`;

const FilmCard = styled.div`
  text-decoration: none;
  color: black;
  border-radius: 10px;
  /* overflow: hidden; */ /* 제목이 길 경우 잘리는 문제로 주석 처리 */
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  background-color: #fff;
  opacity: 0;
  transform: translateY(20px);
  animation: ${slideUp} 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: ${props => props.delay * 0.07}s;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
  }
`;

const FilmTitle = styled.div`
  font-weight: 700;
  font-size: 15px;
  color: ${darkGray};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 12px; /* FilmInfo 패딩을 이쪽으로 이동 */
`;

const FilmYear = styled.div`
  font-size: 13px;
  color: #868e96;
  padding: 0 12px; /* FilmInfo 패딩을 이쪽으로 이동 */
`;