import { Link, useParams } from 'react-router-dom';
import Navbar from './NavBar';
import styled from 'styled-components';
import { movies } from '../example_data/movies';

const Info = styled.div`
    display: flex;
    flex: 1;
    justify-content: center;
    flex-direction: row;
    width:70%;
    margin-left:15%;
    margin-top:30px;
`;
const StyledLink = styled(Link)`
  text-decoration: none;   // 밑줄 제거
  color: inherit;          // 부모 요소의 글자색 상속

  &:visited {
    color: inherit;        // 방문한 링크도 동일한 색
  }
`;
const Container = styled.div`
    
`;
const MovieDetail = () => {
    const { id } = useParams();
    const movie = movies.find((movie) => movie.id === parseInt(id));
    if (!movie) {
        return <p>영화를 찾을 수 없습니다.</p>;
    }
    return (
        <Container>
            <Navbar></Navbar>
            <Info>
                <img src={movie.poster} alt={movie.title} />
                <div>
                    <h1>{movie.title}</h1>
                    <p>감독: {movie.director}</p>
                    <p>배우: {movie.actors}</p>
                    <p>영화등급: {movie.class}</p>
                    <p>러닝 타임: {movie.runningTime}분</p>
                    <p>개봉일: {movie.releaseDate}</p>
                    <p>장르: {movie.genre}</p>
                    <p>배급사: {movie.distributor}</p>
                    <p>줄거리: {movie.plot}</p>
                </div>
            </Info>
            <StyledLink to={`/reservation/${movie.id}`}>
                <p>예매하기</p>
            </StyledLink>
        </Container>
    );
};

export default MovieDetail;
