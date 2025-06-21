import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled, { css, createGlobalStyle } from 'styled-components';
import Navbar from '../component/common/NavBar';
import ReviewsList from '../component/review/ReviewList';

const MovieDetailPage = () => {
    const { id } = useParams(); // URL에서 영화 ID를 가져옵니다.
    const [activeTab, setActiveTab] = useState('cast');

    // API로부터 받아온 데이터를 저장할 상태 변수들
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 컴포넌트가 마운트되거나 영화 id가 변경될 때 API 호출
    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. 영화 상세 정보 가져오기
                const movieResponse = await fetch(`/movies/${id}`);
                console.log(movieResponse);
                if (!movieResponse.ok) {
                    throw new Error('영화 정보를 불러오는 데 실패했습니다.');
                }
                const movieData = await movieResponse.json();
                console.log(movieData);
                setMovie(movieData.data);
                console.log(movie);


            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieData();
    }, [id]); // id가 바뀔 때마다 다시 데이터를 가져옵니다.

    // 로딩 중일 때 표시할 UI
    if (loading) {
        return <LoadingContainer>로딩 중...</LoadingContainer>;
    }

    // 에러 발생 시 표시할 UI
    if (error) {
        return <ErrorContainer>오류: {error}</ErrorContainer>;
    }

    // 영화 데이터가 없을 때 표시할 UI
    if (!movie) {
        return <p>영화를 찾을 수 없습니다.</p>;
    }

    // 배우들을 역할(castType)에 따라 필터링 (API 응답에 castType이 있다고 가정)
    const mainActors = movie.actors?.filter(actor => actor.castingType === 'LEAD') || [];
    const supportingActors = movie.actors?.filter(actor => actor.castType === '조연') || [];
    const specialActors = movie.actors?.filter(actor => actor.castType === '특별출연') || [];

    return (
        <>
            <GlobalStyle />
            <Navbar underline={true} />
            <PageContainer>
                <InfoSection>
                    <PosterAndButtonContainer>
                        {/* API 응답에 posterUrl 필드가 있다고 가정 */}
                        <Poster src={movie.posterUrls} alt={movie.title} />
                        <ReservationLinkButton to={`/reservation?movie_id=${movie.id}`}>예매하기</ReservationLinkButton>
                    </PosterAndButtonContainer>
                    <MovieDetailsText>
                        <TitleLine>
                            {/* API 응답에 ageRating 필드가 있다고 가정 */}
                            {movie.ageRating && <AgeImg src={`https://placehold.co/36x36/E8A2A2/FFFFFF?text=${movie.ageRating}`} alt={`${movie.ageRating}세 이용가`} />}
                            {movie.title}
                        </TitleLine>
                        <SubInfo>{movie.genres?.join(' · ') || '장르 정보 없음'}</SubInfo>
                        <SubInfo>{movie.runningTime}분 · {movie.distributorName}</SubInfo>
                        <SubInfo>개봉일: {movie.releaseDate[0]}.{movie.releaseDate[1]}.{movie.releaseDate[2]}</SubInfo>
                        <PlotText>{movie.synopsis}</PlotText>
                    </MovieDetailsText>
                </InfoSection>

                <TabContainer>
                    <TabButton active={activeTab === 'cast'} onClick={() => setActiveTab('cast')}>출연/제작</TabButton>
                    <TabButton active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')}>관람평 ({reviews.length})</TabButton>
                </TabContainer>

                {activeTab === 'cast' ? (
                    <>
                        {/* API 응답에 director 객체가 있다고 가정 */}
                        {movie.director && (
                            <>
                                <SectionTitle>감독</SectionTitle>
                                <CardContainer>
                                    <Card to={`/director/${movie.director.id}`}
                                        state={{
                                            name: movie.director.name,
                                            photoUrl: movie.director.photoUrl
                                        }}>
                                        <CardImg src={movie.director.photoUrl} alt={movie.director.name} />
                                        <div>{movie.director.name}</div>
                                        <div>감독</div>
                                    </Card>
                                </CardContainer>
                            </>
                        )}

                        {mainActors.length > 0 && (
                            <>
                                <SectionTitle>주연</SectionTitle>
                                <CardContainer>
                                    {mainActors.map((actor) => (
                                        // API 응답에 배우 id와 imageUrl 필드가 있다고 가정
                                        <Card key={actor.actorId} to={`/actor/${actor.actorId}`}>
                                            <CardImg src={actor.actorPhotoUrl} alt={actor.actorName} />
                                            <div>{actor.actorName}</div>
                                            <div>{actor.role} 역</div>
                                        </Card>
                                    ))}
                                </CardContainer>
                            </>
                        )}

                        {supportingActors.length > 0 && (
                            <>
                                <SectionTitle>조연</SectionTitle>
                                <CardContainer>
                                    {supportingActors.map((actor) => (
                                        <Card key={actor.id} to={`/actor/${actor.id}`}>
                                            <CardImg src={actor.imageUrl} alt={actor.name} />
                                            <div>{actor.name}</div>
                                            <div>{actor.role} 역</div>
                                        </Card>
                                    ))}
                                </CardContainer>
                            </>
                        )}

                        {specialActors.length > 0 && (
                            <>
                                <SectionTitle>특별출연</SectionTitle>
                                <CardContainer>
                                    {specialActors.map((actor) => (
                                        <Card key={actor.id} to={`/actor/${actor.id}`}>
                                            <CardImg src={actor.imageUrl} alt={actor.name} />
                                            <div>{actor.name}</div>
                                            <div>{actor.role} 역</div>
                                        </Card>
                                    ))}
                                </CardContainer>
                            </>
                        )}
                    </>
                ) : (
                    <ReviewsList reviews={reviews} />
                )}
            </PageContainer>
        </>
    );
};

export default MovieDetailPage;


// --- Styled Components ---
const primaryBlue = '#1E6DFF';
const darkBlue = '#0056b3';
const lightGray = '#f8f9fa';
const mediumGray = '#dee2e6';
const darkGray = '#212529';

// 로딩 및 에러 표시를 위한 간단한 스타일 추가
const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
    font-size: 24px;
`;
const ErrorContainer = styled(LoadingContainer)`
    color: #e03131;
`;

const GlobalStyle = createGlobalStyle`body, html { background-color: #fff; }`;

const PageContainer = styled.div`
    width: 85%;
    max-width: 1200px;
    margin: 40px auto;
    padding-bottom: 80px;
`;

const InfoSection = styled.section`
    display: flex;
    gap: 50px;
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
    }
`;

const PosterAndButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
    flex-shrink: 0;
`;

const Poster = styled.img`
    width: 300px;
    height: 430px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    background-color: ${lightGray}; // 이미지가 로드되기 전 배경색
`;

const ReservationLinkButton = styled(Link)`
    width: 100%;
    padding: 16px;
    background-color: ${primaryBlue};
    color: #fff;
    font-size: 18px;
    font-weight: 700;
    border-radius: 8px;
    text-align: center;
    text-decoration: none;
    transition: all 0.2s ease;
    &:hover { background-color: ${darkBlue}; transform: translateY(-2px); }
`;

const MovieDetailsText = styled.div`
    flex: 1;
`;

const TitleLine = styled.h1`
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 36px;
    font-weight: 900;
    margin: 0 0 10px;
`;

const AgeImg = styled.img`
    width: 36px;
    height: 36px;
    border-radius: 4px;
`;

const SubInfo = styled.p`
    font-size: 16px;
    color: #868e96;
    margin: 4px 0;
`;

const PlotText = styled.p`
    font-size: 16px;
    line-height: 1.7;
    margin-top: 30px;
    padding-top: 30px;
    border-top: 1px solid ${mediumGray};
`;

const TabContainer = styled.div`
    display: flex;
    border-bottom: 1px solid ${mediumGray};
    margin-top: 50px;
`;

const TabButton = styled.button`
    padding: 16px 20px;
    font-size: 18px;
    cursor: pointer;
    border: none;
    background-color: transparent;
    color: #868e96;
    position: relative;
    font-weight: 700;
    transition: color 0.3s ease;

    &:hover { color: ${darkGray}; }

    ${({ active }) => active && css`
        color: ${primaryBlue};
        &::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 3px;
            background-color: ${primaryBlue};
        }
    `}
`;

const SectionTitle = styled.h3`
    font-size: 22px;
    font-weight: 700;
    margin: 40px 0 20px;
`;

const CardContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 20px;
`;

const Card = styled(Link)`
    text-decoration: none;
    color: ${darkGray};
    text-align: center;
    
    div {
        margin-top: 8px;
        font-weight: 700;
        font-size: 15px;
    }
    div:last-child {
        font-size: 14px;
        color: #868e96;
        font-weight: 500;
        margin-top: 2px;
    }
`;

const CardImg = styled.img`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    background-color: ${lightGray};
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    }
`;