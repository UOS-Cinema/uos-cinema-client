import { Link, useParams } from 'react-router-dom';
import Navbar from '../component/common/NavBar';
import styled, { css } from 'styled-components';
import { movies } from '../example_data/movies'; // 영화 데이터
import age15 from '../asset/age15.png'; // 연령 등급 이미지 (예시)

// 배우/감독 이미지 (예시 - 실제 데이터에 따라 경로 변경 필요)
import directorImg from '../asset/director.jpg';
import actor1Img from '../asset/actor1.jpg'; // 최민식
import actor2Img from '../asset/actor2.jpg'; // 유지태
import actor3Img from '../asset/actor3.jpg'; // 강혜정 (조연 예시)

import React, { useState } from 'react';
import ReviewsList from '../component/review/ReviewList'; // 관람평 리스트 컴포넌트

// src/example_data/reviews.js 에서 가져온 예시 리뷰 데이터
const sampleReviews = [
    {
        id: 1,
        movieId: 1,
        user: '영화광팬123',
        timestamp: '2024-03-14T10:30:00Z',
        comment: '정말 충격적이고 대단한 영화입니다. 최민식 배우의 연기는 압권!',
        rating: 5,
    },
    {
        id: 2,
        movieId: 1,
        user: '시네필B',
        timestamp: '2024-03-15T14:20:00Z',
        comment: '미장센과 스토리가 완벽하게 어우러진 작품. 다시 봐도 새롭다.',
        rating: 5,
    },
    {
        id: 3,
        movieId: 1,
        user: '무비러버7',
        timestamp: '2024-03-13T09:00:00Z',
        comment: '조금 보기 힘들었지만, 영화가 주는 메시지는 강렬했어요.',
        rating: 4,
    },
    {
        id: 4,
        movieId: 2,
        user: 'PopcornLover',
        timestamp: '2024-03-10T18:00:00Z',
        comment: '생각보다 평범했어요. 기대에는 못 미쳤네요.',
        rating: 3,
    },
    {
        id: 5,
        movieId: 2,
        user: '익명관람객',
        timestamp: '2024-03-12T22:15:00Z',
        comment: '킬링타임용으로는 괜찮습니다.',
        rating: 3,
    }
];

// --- Styled Components ---
const primaryBlue = '#1E6DFF';
const darkBlue = '#005fa3';
const lightGray = '#eee';
const mediumGray = '#ccc';
const darkGray = '#333';
const white = '#fff';
const textGray = '#555';

const PageContainer = styled.div`
    width: 80%; // 중앙 정렬된 콘텐츠 영역
    max-width: 1200px; // 최대 너비 지정
    margin: 0 auto; // 중앙 정렬
    padding-bottom: 80px; // 페이지 하단 여백
`;

const InfoSection = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: row;
    padding: 40px 0; // 상하 여백 추가
    gap: 50px; // 포스터와 텍스트 사이 간격 늘림

    @media (max-width: 768px) {
        flex-direction: column; // 작은 화면에서 세로로 정렬
        align-items: center;
        gap: 30px;
    }
`;

const Poster = styled.img`
    width: 300px;
    height: 450px; // 포스터 높이 조정
    object-fit: cover;
    border-radius: 10px; // 둥근 모서리
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); // 그림자 효과 강화
`;

const MovieDetailsText = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start; // 텍스트를 위에서부터 시작
`;

const TitleLine = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 15px; // 제목 아래 간격
    font-size: 42px; // 제목 글꼴 크기 크게
    font-weight: 700; // 제목 글꼴 굵게
    color: ${darkGray};
    line-height: 1.2; // 줄 간격 조정
`;

const AgeImg = styled.img`
    width: 36px; // 크기 조정
    height: 36px;
    margin-right: 15px; // 제목과의 간격
    vertical-align: middle; // 텍스트와 세로 중앙 정렬
`;

const SubInfo = styled.p`
    font-size: 17px;
    color: ${textGray};
    margin: 5px 0; // 정보 라인별 간격
`;

const PlotText = styled.p`
    font-size: 16px;
    color: #444;
    line-height: 1.8; // 줄 간격 늘림
    margin-top: 25px; // 줄거리 위 간격
    margin-bottom: 30px; // 줄거리 아래 간격
    border-top: 1px solid ${lightGray}; // 줄거리 위 구분선
    padding-top: 20px;
`;

const TabContainer = styled.div`
    display: flex;
    border-bottom: 2px solid ${lightGray};
    margin-top: 40px; // 탭 위 간격
    margin-bottom: 30px; // 탭 아래 간격
    width: 100%; // 너비를 꽉 채우도록
`;

const TabButton = styled.button`
    padding: 12px 25px; // 패딩 조정
    font-size: 19px; // 글꼴 크기 조정
    cursor: pointer;
    border: none;
    background-color: transparent;
    color: #888;
    position: relative;
    transition: color 0.3s ease; // 색상 전환 부드럽게

    &:hover {
        color: ${darkGray};
    }

    ${({ active }) =>
        active &&
        css`
            color: ${darkGray};
            font-weight: bold;
            &::after {
                content: '';
                position: absolute;
                bottom: -2px;
                left: 0;
                width: 100%;
                height: 3px; // 활성 탭 밑줄 두께
                background-color: ${primaryBlue};
                transition: width 0.3s ease; // 너비 전환 애니메이션
            }
        `}
`;

const SectionTitle = styled.h3`
    font-size: 22px; // 섹션 제목 크기
    font-weight: 600;
    margin-top: 30px; // 섹션 위 간격
    margin-bottom: 20px; // 섹션 아래 간격
    color: ${darkGray};
`;

const CardContainer = styled.div`
    display: flex;
    gap: 20px; // 카드 사이 간격
    margin-bottom: 30px; // 카드 컨테이너 아래 간격
    width: 100%;
    flex-wrap: wrap; // 반응형을 위해 줄바꿈 허용
    justify-content: flex-start;
`;

const Card = styled(Link)`
    text-decoration: none;
    color: black;
    background-color: ${white};
    border-radius: 10px; // 더 둥근 모서리
    border: 1px solid ${lightGray};
    padding-top: 10px;
    width: 120px;
    min-height: 180px; // 최소 높이 설정
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-size: 14px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08); // 그림자 강화
    transition: transform 0.2s ease, box-shadow 0.2s ease; // 호버 애니메이션

    &:hover {
        transform: translateY(-5px); // 살짝 뜨는 효과
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15); // 그림자 진해짐
    }

    div {
        margin-top: 5px;
        color: ${darkGray};
        font-weight: 500;
    }

    div:last-child { // 역할 텍스트 스타일
        font-size: 13px;
        color: ${textGray};
        font-weight: normal;
        margin-top: 2px;
    }
`;

const CardImg = styled.img`
    width: 100px;
    height: 130px;
    border-radius: 8px; // 카드 모서리와 조화롭게
    object-fit: cover;
`;

const ReservationLinkButton = styled(Link)`
    align-self: center; // 왼쪽 정렬
    padding: 15px 30px; // 패딩 늘림
    background-color: ${primaryBlue};
    color: ${white};
    font-size: 20px; // 글꼴 크기 크게
    font-weight: bold;
    border-radius: 8px; // 둥근 모서리
    text-align: center;
    margin-top: 40px; // 상단 여백
    transition: background-color 0.3s ease-in-out, transform 0.2s ease;
    text-decoration:none;
    &:hover {
        background-color: ${darkBlue};
        transform: translateY(-2px); // 살짝 뜨는 효과
        box-shadow: 0 4px 8px rgba(0,0,0,0.2); // 그림자 추가
    }

    &:active {
        transform: translateY(0);
        background-color: #004f8a;
    }
`;

const PosterAndButtonContainer = styled.div`
    display: flex;
    flex-direction: column; 기본은 세로로 유지 */
    align-items: center; /* 아이템들을 중앙 정렬 */
   
`;
const MovieDetailPage = () => {
    const { id } = useParams();
    const movie = movies.find((movie) => movie.id === parseInt(id));
    const [activeTab, setActiveTab] = useState('cast'); // 'cast' 또는 'reviews'

    if (!movie) {
        return <p>영화를 찾을 수 없습니다.</p>;
    }

    // 예시 데이터에 실제 이미지 경로와 역할을 매핑
    const getActorImage = (actorName) => {
        if (actorName === '최민식') return actor1Img;
        if (actorName === '유지태') return actor2Img;
        if (actorName === '강혜정') return actor3Img; // 조연 예시
        // 더 많은 배우 이미지가 있다면 여기에 추가
        return 'https://via.placeholder.com/100x130?text=Actor'; // 기본 플레이스홀더 이미지
    };

    const getActorRole = (actorName) => {
        if (actorName === '최민식') return '오대수 역';
        if (actorName === '유지태') return '이우진 역';
        if (actorName === '강혜정') return '미도 역';
        return '배우';
    };


    const reviewsForMovie = sampleReviews.filter(r => r.movieId === movie.id);

    return (
        <>
            <Navbar underline={true} />
            <PageContainer> {/* 전체 페이지 컨테이너 */}
                <InfoSection> {/* 포스터와 상세 정보 섹션 */}
                    <PosterAndButtonContainer>
                        <Poster src={movie.poster} alt={movie.title} />
                        <ReservationLinkButton to={`/reservation/${movie.id}`}>
                            예매하기
                        </ReservationLinkButton>
                    </PosterAndButtonContainer>
                    <MovieDetailsText>
                        <TitleLine>
                            {movie.ageRating && <AgeImg src={age15} alt={`Rated ${movie.ageRating}`} />}
                            {movie.title}
                        </TitleLine>
                        <SubInfo>{movie.genre} · {movie.runningTime}분 · {movie.distributor}</SubInfo>
                        <SubInfo>개봉일: {movie.releaseDate}</SubInfo>
                        <PlotText>{movie.plot}</PlotText>

                        {/* 탭 섹션 */}
                        <TabContainer>
                            <TabButton
                                active={activeTab === 'cast'}
                                onClick={() => setActiveTab('cast')}
                            >
                                출연/제작
                            </TabButton>
                            <TabButton
                                active={activeTab === 'reviews'}
                                onClick={() => setActiveTab('reviews')}
                            >
                                관람평 ({reviewsForMovie.length})
                            </TabButton>
                        </TabContainer>

                        {/* 탭 내용 */}
                        {activeTab === 'cast' && (
                            <>
                                <SectionTitle>감독</SectionTitle>
                                <CardContainer>
                                    <Card to={`/director/${movie.director}`}>
                                        <CardImg src={directorImg} alt={movie.director} />
                                        <div>{movie.director}</div>
                                        <div>감독</div>
                                    </Card>
                                </CardContainer>

                                <SectionTitle>주연</SectionTitle>
                                <CardContainer>
                                    {movie.actors.slice(0, 2).map((actor, index) => (
                                        <Card key={actor} to={`/actor/${actor}`}>
                                            <CardImg src={getActorImage(actor)} alt={actor} />
                                            <div>{actor}</div>
                                            <div>{getActorRole(actor)}</div>
                                        </Card>
                                    ))}
                                </CardContainer>

                                {movie.actors.length > 2 && (
                                    <>
                                        <SectionTitle>조연</SectionTitle>
                                        <CardContainer>
                                            {movie.actors.slice(2).map((actor, index) => (
                                                <Card key={actor} to={`/actor/${actor}`}>
                                                    <CardImg src={getActorImage(actor)} alt={actor} />
                                                    <div>{actor}</div>
                                                    <div>{getActorRole(actor)}</div>
                                                </Card>
                                            ))}
                                        </CardContainer>
                                    </>
                                )}
                            </>
                        )}

                        {activeTab === 'reviews' && (
                            <ReviewsList movieId={movie.id} reviews={reviewsForMovie} />
                        )}


                    </MovieDetailsText>
                </InfoSection>
            </PageContainer>
        </>
    );
};

export default MovieDetailPage;