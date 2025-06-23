import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Navbar from '../component/common/NavBar';

const MovieDetailPage = () => {
    const { id } = useParams();
    
    // 관람평 관련 상태 및 탭 상태 제거
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                setLoading(true);
                setError(null);

                const movieResponse = await fetch(`/movies/${id}`);
                if (!movieResponse.ok) {
                    throw new Error('영화 정보를 불러오는 데 실패했습니다.');
                }
                const movieData = await movieResponse.json();
                console.log(movieData);
                setMovie(movieData.data);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieData();
    }, [id]);

    const getPosterUrl = (posterUrls) => {
        if (!posterUrls) {
            return 'https://placehold.co/300x430/e9ecef/adb5bd?text=No+Image';
        }
        try {
            if (Array.isArray(posterUrls) && posterUrls.length > 0) {
                return posterUrls[0];
            }
            const parsedUrls = JSON.parse(posterUrls);
            if (Array.isArray(parsedUrls) && parsedUrls.length > 0) {
                return parsedUrls[0];
            }
        } catch (e) {
            if (typeof posterUrls === 'string') return posterUrls;
        }
        return 'https://placehold.co/300x430/e9ecef/adb5bd?text=No+Image';
    };

    if (loading) return <LoadingContainer>로딩 중...</LoadingContainer>;
    if (error) return <ErrorContainer>오류: {error}</ErrorContainer>;
    if (!movie) return <p>영화를 찾을 수 없습니다.</p>;

    // 역할별 배우 목록을 더 효율적으로 구성
    const castByType = movie.actors?.reduce((acc, actor) => {
        const type = actor.castingType || 'UNKNOWN';
        if (!acc[type]) acc[type] = [];
        acc[type].push(actor);
        return acc;
    }, {}) || {};

    const castTypesInOrder = [
        { key: 'LEAD', title: '주연' },
        { key: 'SUPPORTING', title: '조연' },
        { key: 'SPECIAL_APPEARANCE', title: '특별출연' }
    ];

    return (
        <>
            <GlobalStyle />
            <Navbar underline={true} />
            
            <PageContainer>
                <InfoSection>
                    <PosterAndButtonContainer>
                        <Poster 
                            src={getPosterUrl(movie.posterUrls)} 
                            alt={`${movie.title} 포스터`}
                            referrerPolicy="no-referrer"
                            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x430/e9ecef/adb5bd?text=Image+Load+Failed'; }}
                        />
                        <ReservationLinkButton to={`/reservation?movie_id=${movie.id}`}>예매하기</ReservationLinkButton>
                    </PosterAndButtonContainer>

                    <MovieDetailsText>
                        <TitleLine>
                            {movie.rating && <AgeImg src={`https://placehold.co/36x36/E8A2A2/FFFFFF?text=${movie.rating}`} alt={`${movie.rating}세 이용가`} />}
                            {movie.title}
                        </TitleLine>
                        <SubInfo>{movie.genres?.join(' · ') || '장르 정보 없음'}</SubInfo>
                        <SubInfo>{movie.runningTime}분 · {movie.distributorName}</SubInfo>
                        <SubInfo>개봉일: {movie.releaseDate?.join('.')}</SubInfo>
                        <PlotText>{movie.synopsis}</PlotText>
                        
                        {/* === 출연/제작 정보 섹션을 이곳으로 이동 === */}
                        <CastSection>
                            {movie.director && (
                                <>
                                    <SectionTitle>감독</SectionTitle>
                                    <CardContainer>
                                        <Card to={`/director/${movie.director.id}`} state={{ name: movie.director.name, photoUrl: movie.director.photoUrl }}>
                                            <CardImg src={movie.director.photoUrl} alt={movie.director.name} referrerPolicy="no-referrer" />
                                            <div>{movie.director.name}</div>
                                            <div>감독</div>
                                        </Card>
                                    </CardContainer>
                                </>
                            )}
                            
                            {castTypesInOrder.map(cast => (
                                castByType[cast.key] && castByType[cast.key].length > 0 && (
                                    <div key={cast.key}>
                                        <SectionTitle>{cast.title}</SectionTitle>
                                        <CardContainer>
                                            {castByType[cast.key].map((actor) => (
                                                <Card key={actor.actorId} to={`/actor/${actor.actorId}`}>
                                                    <CardImg src={actor.actorPhotoUrl} alt={actor.actorName} referrerPolicy="no-referrer" />
                                                    <div>{actor.actorName}</div>
                                                    <div>{actor.role} 역</div>
                                                </Card>
                                            ))}
                                        </CardContainer>
                                    </div>
                                )
                            ))}
                        </CastSection>
                    </MovieDetailsText>
                </InfoSection>

                {/* TabContainer와 관련 로직 전체 제거 */}
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
    background-color: ${lightGray};
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
    padding-bottom: 30px;
    border-bottom: 1px solid ${mediumGray};
`;
// 출연/제작 정보 섹션을 위한 스타일
const CastSection = styled.div`
    margin-top: 30px;
`;
const SectionTitle = styled.h3`
    font-size: 22px;
    font-weight: 700;
    margin: 40px 0 20px;
    
    &:first-child {
        margin-top: 0; /* 첫 번째 제목의 상단 마진 제거 */
    }
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
