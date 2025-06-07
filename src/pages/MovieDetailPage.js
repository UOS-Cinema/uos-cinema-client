import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled, { css, createGlobalStyle } from 'styled-components';
import Navbar from '../component/common/NavBar';
import ReviewsList from '../component/review/ReviewList'; 

// --- 목업 데이터 ---
// 실제 앱에서는 API를 통해 가져와야 합니다.
// 배우 데이터에 castType ('주연', '조연', '특별출연')을 추가하여 역할을 구분합니다.
const movies = [
    {
        id: 1,
        title: '기생충',
        poster: 'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20190528_36%2F1559024198386YVTEw_JPEG%2Fmovie_image.jpg',
        ageRating: '15',
        genres: ['드라마', '스릴러', '코미디'],
        runningTime: 132,
        distributor: 'CJ ENM',
        releaseDate: '2019.05.30',
        plot: '전원백수로 살 길 막막하지만 사이는 좋은 기택(송강호) 가족. 장남 기우(최우식)에게 명문대생 친구가 연결시켜 준 고액 과외 자리는 모처럼 싹튼 고정수입의 희망이다. 온 가족의 도움과 기대 속에 박사장(이선균) 집으로 향하는 기우. 글로벌 IT기업 CEO인 박사장의 저택에 도착하자 젊고 아름다운 사모님 연교(조여정)가 기우를 맞이한다. 그러나 이렇게 시작된 두 가족의 만남 뒤로, 걷잡을 수 없는 사건이 기다리고 있었으니…',
        director: '봉준호',
        actors: [
            { name: '송강호', role: '기택', castType: '주연' },
            { name: '이선균', role: '동익', castType: '주연' },
            { name: '조여정', role: '연교', castType: '조연' },
            { name: '최우식', role: '기우', castType: '조연' },
            { name: '박서준', role: '민혁', castType: '특별출연' },
        ]
    }
];
const sampleReviews = [
    { id: 1, movieId: 1, user: '영화광팬123', timestamp: '2024-03-14T10:30:00Z', comment: '정말 충격적이고 대단한 영화입니다. 배우들의 연기는 압권!', rating: 5 },
    { id: 2, movieId: 1, user: '시네필B', timestamp: '2024-03-15T14:20:00Z', comment: '미장센과 스토리가 완벽하게 어우러진 작품. 다시 봐도 새롭다.', rating: 5 },
];
const directorImg = 'https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2F189%2F201710111116464471.jpg';
const actorImages = {
    '송강호': 'https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2FprofileImg%2F5fd23496-f8c7-4ca2-ac04-666bf3fdb6b8.jpg',
    '이선균': 'https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202212%2F20221228153818248.jpg',
    '조여정': 'https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F201408%2F2014081216530934-7249138.jpg',
    '최우식': 'https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2FprofileImg%2F90d9b04b-3ebf-41c0-82da-f1b554be1ad2.jpg',
    '박서준': 'https://search.pstatic.net/common?type=b&size=3000&quality=100&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202211%2F20221117110551896.jpg',
};
// --- 목업 데이터 끝 ---

const MovieDetailPage = () => {
    const { id } = useParams();
    const movie = movies.find((m) => m.id === parseInt(id));
    const [activeTab, setActiveTab] = useState('cast');

    if (!movie) {
        return <p>영화를 찾을 수 없습니다.</p>;
    }

    // 배우들을 역할(castType)에 따라 필터링
    const mainActors = movie.actors.filter(actor => actor.castType === '주연');
    const supportingActors = movie.actors.filter(actor => actor.castType === '조연');
    const specialActors = movie.actors.filter(actor => actor.castType === '특별출연');

    const reviewsForMovie = sampleReviews.filter(r => r.movieId === movie.id);

    return (
        <>
            <GlobalStyle />
            <Navbar underline={true} />
            <PageContainer>
                <InfoSection>
                    <PosterAndButtonContainer>
                        <Poster src={movie.poster} alt={movie.title} />
                        <ReservationLinkButton to={`/reservation?movie_id=${movie.id}`}>예매하기</ReservationLinkButton>
                    </PosterAndButtonContainer>
                    <MovieDetailsText>
                        <TitleLine>
                            {movie.ageRating && <AgeImg src={`https://placehold.co/36x36/E8A2A2/FFFFFF?text=${movie.ageRating}`} alt={`${movie.ageRating}세 이용가`} />}
                            {movie.title}
                        </TitleLine>
                        <SubInfo>{movie.genres.join(' · ')}</SubInfo>
                        <SubInfo>{movie.runningTime}분 · {movie.distributor}</SubInfo>
                        <SubInfo>개봉일: {movie.releaseDate}</SubInfo>
                        <PlotText>{movie.plot}</PlotText>
                    </MovieDetailsText>
                </InfoSection>

                <TabContainer>
                    <TabButton active={activeTab === 'cast'} onClick={() => setActiveTab('cast')}>출연/제작</TabButton>
                    <TabButton active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')}>관람평 ({reviewsForMovie.length})</TabButton>
                </TabContainer>

                {activeTab === 'cast' ? (
                    <>
                        <SectionTitle>감독</SectionTitle>
                        <CardContainer>
                            <Card to={`/director`}>
                            {/* <Card to={`/director/${movie.director}`}></Card> */}
                                <CardImg src={directorImg} alt={movie.director} />
                                <div>{movie.director}</div>
                                <div>감독</div>
                            </Card>
                        </CardContainer>

                        {/* 주연 배우 섹션 (배우가 있을 경우에만 렌더링) */}
                        {mainActors.length > 0 && (
                             <>
                                <SectionTitle>주연</SectionTitle>
                                <CardContainer>
                                    {mainActors.map((actor) => (
                                        <Card key={actor.name} to={`/actor`}>
                                            {/* <Card key={actor.name} to={`/actor/${actor.name}`}></Card> */}
                                            <CardImg src={actorImages[actor.name]} alt={actor.name} />
                                            <div>{actor.name}</div>
                                            <div>{actor.role} 역</div>
                                        </Card>
                                    ))}
                                </CardContainer>
                            </>
                        )}
                       
                        {/* 조연 배우 섹션 (배우가 있을 경우에만 렌더링) */}
                        {supportingActors.length > 0 && (
                            <>
                                <SectionTitle>조연</SectionTitle>
                                <CardContainer>
                                    {supportingActors.map((actor) => (
                                        <Card key={actor.name} to={`/actor/${actor.name}`}>
                                            <CardImg src={actorImages[actor.name]} alt={actor.name} />
                                            <div>{actor.name}</div>
                                            <div>{actor.role} 역</div>
                                        </Card>
                                    ))}
                                </CardContainer>
                            </>
                        )}

                        {/* 특별출연 배우 섹션 (배우가 있을 경우에만 렌더링) */}
                        {specialActors.length > 0 && (
                             <>
                                <SectionTitle>특별출연</SectionTitle>
                                <CardContainer>
                                    {specialActors.map((actor) => (
                                        <Card key={actor.name} to={`/actor/${actor.name}`}>
                                            <CardImg src={actorImages[actor.name]} alt={actor.name} />
                                            <div>{actor.name}</div>
                                            <div>{actor.role} 역</div>
                                        </Card>
                                    ))}
                                </CardContainer>
                            </>
                        )}
                    </>
                ) : (
                    <ReviewsList reviews={reviewsForMovie} />
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
