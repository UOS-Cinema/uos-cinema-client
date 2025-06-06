import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { movies } from '../../example_data/movies';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

const primaryBlue = '#1E6DFF';
const darkBlue = '#005fa3';
const white = '#fff';
const lightGray = '#eee';
const textGray = '#555';
const darkGray = '#333';

const Grid = styled.div`
  display: grid;
  /* width: 80%; 이 속성을 제거하거나 100%로 변경합니다. */
  /* margin: 0 auto 50px; 이 속성을 제거합니다. */
  gap: 30px;
  padding: 20px 0;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); /* 현재는 220px로 유지하되, 필요시 조정 */
`;

const MovieCard = styled.div`
  background-color: ${white};
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
`;

const Poster = styled.img`
  width: 100%;
  height: 350px;
  object-fit: cover;
  display: block;
`;

const Info = styled.div`
  padding: 15px;
  color: ${darkGray};

  h2 {
    font-size: 20px;
    margin-bottom: 8px;
    font-weight: 600;
  }

  p {
    margin: 6px 0;
    font-size: 15px;
    color: ${textGray};
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
  padding: 10px;

`;

const ActionButton = styled.button`
  padding: 10px 20px;
  font-size: 15px;
  border: none;
  border-radius: 6px;
  background-color: ${primaryBlue};
  color: ${white};
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${darkBlue};
    transform: translateY(-2px);
  }

  &:active {
    background-color: #004f8a;
    transform: translateY(0);
  }
`;

const MovieGrid = ({ type, sortOrder, genres, screenTypes, searchTerm }) => {
  // Filter movies based on the applied filters
  const filteredMovies = movies.filter(movie => {
    const matchesGenre = genres.length === 0 || genres.some(genre => movie.genres.includes(genre));
    const matchesScreenType = screenTypes.length === 0 || screenTypes.some(type => movie.screen_types.includes(type));
    const matchesSearchTerm = movie.title.toLowerCase().includes(searchTerm.toLowerCase()); // 검색어 필터링 활성화
    // Add logic for 'upcoming' and 'chart' based on movie data if available
    // For now, let's assume all movies are relevant to 'chart' and 'upcoming' is a separate list
    const matchesTab = type === 'chart' ? true : false; // Placeholder, adjust based on your actual movie data

    return matchesGenre && matchesScreenType && matchesSearchTerm && matchesTab;
  });

  // Sort movies based on sortOrder
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortOrder === 'popularity') {
      return b.reservation_rate - a.reservation_rate;
    } else if (sortOrder === 'release') {
      // Assuming 'release_date' exists in your movie object and is comparable
      return new Date(b.release_date) - new Date(a.release_date);
    }
    return 0;
  });

  // Display a limited number of movies for the main page preview
  const displayedMovies = sortedMovies.slice(0, 5);
  const { user } = useContext(UserContext);

  return (
    <Grid>
      {displayedMovies.map((movie) => (
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
          {user.role === "admin" ? (
            <ButtonGroup>
              <StyledLink to={`/CreateMovie`}>
                <ActionButton>수정하기</ActionButton>
              </StyledLink>
              <StyledLink to={`/movieDelete`}>
                <ActionButton>삭제하기</ActionButton>
              </StyledLink>
            </ButtonGroup>
          ) : (
            <ButtonGroup>
              <StyledLink to={`/reservation`}>
                <ActionButton>예매하기</ActionButton>
              </StyledLink>
              <StyledLink to={`/movie/${movie.id}`}>
                <ActionButton>상세보기</ActionButton>
              </StyledLink>
            </ButtonGroup>
          )}
        </MovieCard>
      ))}
    </Grid>
  );
};

export default MovieGrid;