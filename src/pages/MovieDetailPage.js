import { Link, useParams } from 'react-router-dom';
import Navbar from '../component/common/NavBar';
import styled, { css } from 'styled-components'; // Import css
import { movies } from '../example_data/movies';
// import SearchBar from '../component/common/SearchBar'; // Not used in this snippet
import age15 from '../asset/age15.png';
import director from '../asset/director.jpg';
import actor1 from '../asset/actor1.jpg';
import actor2 from '../asset/actor2.jpg';
import actor3 from '../asset/actor3.jpg';
import React, { useState } from 'react'; // Import useState
import ReviewsList from '../component/review/ReviewList'; // Import ReviewsList

// src/example_data/reviews.js
const sampleReviews = [
    // Reviews for movie with id 1 (e.g., 올드보이)
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
    // Reviews for another movie (if you have one with id 2 in movies.js)
    {
        id: 4,
        movieId: 2, // Assuming you have a movie with id 2
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

const Poster = styled.img`
    width: 300px;
    height: 500px;
    margin:30px;
    object-fit: cover; // To prevent image stretching
`;

const CardImg = styled.img`
    width:100px;
    height:130px;
    border-radius:10px;
    object-fit: cover; // To prevent image stretching
`;
const AgeImg = styled.img`
    width: 40px;
    height: 40px;
    margin-right:10px;
`;

const StyledLine = styled.div`
    display: flex;
    margin-top:40px;
    justify-content: start;
    align-items: center;
    text-align: center;
    font-size: 32px;
    font-weight: bold; // Make title bolder
`;

const Info = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: row;
    width: 70%;
    margin-left: 15%;
    margin-top: 30px;
    gap: 40px; // Add gap between poster and info
`;

const MovieDetailsText = styled.div` // Wrapper for text details
    flex: 1; // Allow this to take up remaining space
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:visited {
    color: inherit;
  }
`;

const ReservationLinkButton = styled(StyledLink)`
    display: inline-block;
    padding: 12px 25px;
    background-color: #1E6DFF; 
    color: white;
    font-size: 18px;
    font-weight: bold;
    border-radius: 5px;
    text-align: center;
    margin-top: 30px;
    transition: background-color 0.2s ease-in-out;

    &:hover {
        background-color: #005fa3;
    }
`;

const Container = styled.div``;

const CardContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px; // Reduced margin
  margin-bottom: 20px; // Added margin bottom
  width: 100%;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

const Card = styled(Link)`
    text-decoration: none;
    color:black;
    background-color: #fff;
    border-radius: 8px;
    border:1px solid rgba(0, 0, 0, 0.1);    
    padding-top: 10px;
    width: 120px;
    min-height:170px; // Use min-height
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-size: 14px; // Consistent font size
    box-shadow: 0 2px 4px rgba(0,0,0,0.05); // Subtle shadow

    div {
        margin-top: 5px;
    }
`;

// Tab Styles
const TabContainer = styled.div`
    display: flex;
    border-bottom: 2px solid #eee;
    margin-top: 30px;
    margin-bottom: 20px;
`;

const TabButton = styled.button`
    padding: 10px 20px;
    font-size: 18px;
    cursor: pointer;
    border: none;
    background-color: transparent;
    color: #888;
    position: relative; // For the active indicator line

    ${({ active }) =>
        active &&
        css`
            color: #333;
            font-weight: bold;
            &::after {
                content: '';
                position: absolute;
                bottom: -2px; // Align with TabContainer's border
                left: 0;
                width: 100%;
                height: 2px;
                background-color: #1E6DFF; // Netflix red or your theme color
            }
        `}
`;

const SectionTitle = styled.h3`
    font-size: 20px;
    margin-top: 20px;
    margin-bottom: 10px;
`;


const MovieDetailPage = () => {
    const { id } = useParams();
    const movie = movies.find((movie) => movie.id === parseInt(id));
    const [activeTab, setActiveTab] = useState('cast'); // 'cast' or 'reviews'

    if (!movie) {
        return <p>영화를 찾을 수 없습니다.</p>;
    }

    return (
        <Container>
            <Navbar underline={true} />

            <Info>
                <Poster src={movie.poster} alt={movie.title} />
                <MovieDetailsText> {/* Wrap text details */}
                    <StyledLine>
                        {movie.ageRating && <AgeImg src={age15} alt={`Rated ${movie.ageRating}`} />} {/* Conditionally render age rating */}
                        {movie.title}
                    </StyledLine>
                    <p>{movie.genre} · {movie.runningTime}분 · {movie.distributor}</p>
                    <p>개봉일: {movie.releaseDate}</p>
                    <p style={{ lineHeight: 1.6, marginBottom: '20px' }}>{movie.plot}</p>

                    {/* Tabs */}
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
                            관람평 ({sampleReviews.filter(r => r.movieId === movie.id).length})
                        </TabButton>
                    </TabContainer>

                    {/* Tab Content */}
                    {activeTab === 'cast' && (
                        <>
                            <SectionTitle>감독</SectionTitle>
                            <CardContainer>
                                <Card to={`/director/${movie.director}`}> {/* Make director link dynamic if you plan this page */}
                                    <CardImg src={director} alt={movie.director} />
                                    <div>{movie.director}</div>
                                    <div>감독</div>
                                </Card>
                            </CardContainer>

                            <SectionTitle>주연</SectionTitle>
                            <CardContainer>
                                {movie.actors.slice(0, 2).map((actor, index) => ( // Assuming first 2 are main actors
                                    <Card key={actor} to={`/actor/${actor}`}> {/* Make actor link dynamic */}
                                        <CardImg src={index === 0 ? actor1 : actor2} alt={actor} />
                                        <div>{actor}</div>
                                        {/* You might need more structured data for roles */}
                                        <div>{index === 0 ? '오대수 역' : '이우진 역'}</div>
                                    </Card>
                                ))}
                            </CardContainer>

                            {movie.actors.length > 2 && (
                                <>
                                    <SectionTitle>조연</SectionTitle>
                                    <CardContainer>
                                        {movie.actors.slice(2).map((actor, index) => (
                                            <Card key={actor} to={`/actor/${actor}`}>
                                                {/* You'll need more actor images or a placeholder */}
                                                <CardImg src={actor3} alt={actor} />
                                                <div>{actor}</div>
                                                {/* Placeholder for role */}
                                                <div>{index === 0 ? '미도 역' : '조연'}</div>
                                            </Card>
                                        ))}
                                    </CardContainer>
                                </>
                            )}
                        </>
                    )}

                    {activeTab === 'reviews' && (
                        <ReviewsList movieId={movie.id} />
                    )}
                     <ReservationLinkButton to={`/reservation/${movie.id}`}>
                        예매하기
                    </ReservationLinkButton>
                </MovieDetailsText>
            </Info>
        </Container>
    );
};

export default MovieDetailPage;