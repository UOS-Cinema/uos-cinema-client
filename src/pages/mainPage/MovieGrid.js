// 기존 import들 유지
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { movies } from '../../example_data/movies';

// 스타일 컴포넌트
const Grid = styled.div`
  display: grid;
  width: 80%;
  margin-left: 10%;
  gap: 20px;
  padding: 20px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;

const MovieCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Poster = styled.img`
  width: 100%;
  height: 330px;
  object-fit: cover;
`;

const Info = styled.div`
  padding: 12px;

  h2 {
    font-size: 18px;
    margin-bottom: 8px;
  }

  p {
    margin: 4px 0;
    font-size: 14px;
    color: #555;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:visited {
    color: inherit;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 12px;
  background-color: #f9f9f9;
`;

const ReservationBtn = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  background-color: #0077cc;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #005fa3;
  }

  &:active {
    background-color: #004f8a;
  }
`;

const MovieGrid = () => {
  return (
    <Grid>
      {movies.map((movie) => (
        <MovieCard key={movie.id}>
          <StyledLink to={`/movie/${movie.id}`}>
            <Poster src={movie.poster} alt={movie.title} />
            <Info>
              <h2>{movie.title}</h2>
              <p>예매율: {movie.reservation_rate}%</p>
              <p>감독: {movie.director}</p>
              <p>배우: {movie.actors}</p>
            </Info>
          </StyledLink>
          <ButtonGroup>
          <StyledLink to={`/reservation/${movie.id}`}>
              <ReservationBtn>예매하기</ReservationBtn>
            </StyledLink>
            <StyledLink to={`/movie/${movie.id}`}>
              <ReservationBtn>상세보기</ReservationBtn>
            </StyledLink>
            
          </ButtonGroup>
        </MovieCard>
      ))}
    </Grid>
  );
};

export default MovieGrid;
