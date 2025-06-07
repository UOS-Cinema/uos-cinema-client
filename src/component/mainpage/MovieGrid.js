import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
// import { movies } from '../../example_data/movies'; // 실제 데이터 경로 확인
// import { UserContext } from '../../context/UserContext'; // 필요 시 사용

// --- 목업 데이터 (실제 프로젝트에서는 제거) ---
const movies = [
    {id: 1, title: '기생충', poster: 'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20190528_36%2F1559024198386YVTEw_JPEG%2Fmovie_image.jpg', reservation_rate: 17.5, director: '봉준호', actors: '송강호, 이선균, 조여정', genres: ['드라마', '스릴러'], screen_types: ['2D'], release_date: '2019-05-30'},
    {id: 2, title: '올드보이', poster: 'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20111222_177%2F1324537084439rmrVk_JPEG%2Fmovie_image.jpg', reservation_rate: 14.6, director: '박찬욱', actors: '최민식, 유지태, 강혜정', genres: ['스릴러', '액션'], screen_types: ['2D', 'IMAX'], release_date: '2003-11-21'},
    {id: 3, title: '부산행', poster: 'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20200612_248%2F1591937633750Vvyr6_JPEG%2Fmovie_image.jpg', reservation_rate: 12.1, director: '연상호', actors: '공유, 정유미, 마동석', genres: ['액션', '공포'], screen_types: ['2D', '4DX'], release_date: '2016-07-20'},
    {id: 4, title: '극한직업', poster: 'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20190116_206%2F1547615429111dINWj_JPEG%2Fmovie_image.jpg', reservation_rate: 18.2, director: '이병헌', actors: '류승룡, 이하늬, 진선규', genres: ['코미디', '액션'], screen_types: ['2D'], release_date: '2019-01-23'},
    {id: 5, title: '헤어질 결심', poster: 'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20220607_129%2F16545872892918GA4h_JPEG%2Fmovie_image.jpg', reservation_rate: 9.8, director: '박찬욱', actors: '박해일, 탕웨이', genres: ['로맨스', '드라마'], screen_types: ['2D'], release_date: '2022-06-29'},
];
const UserContext = React.createContext({ user: { role: 'user' } });
// --- 목업 데이터 끝 ---


const MovieGrid = ({ type, filters }) => {
    // const { user } = useContext(UserContext); // 실제 UserContext 사용 시 활성화

    // 필터링 및 정렬 로직
    const displayedMovies = movies
        .filter(movie => {
            const { genres, screenTypes, searchTerm } = filters;
            const matchesGenre = genres.length === 0 || genres.some(g => movie.genres.includes(g));
            const matchesScreenType = screenTypes.length === 0 || screenTypes.some(t => movie.screen_types.includes(t));
            const matchesSearch = searchTerm === '' || movie.title.toLowerCase().includes(searchTerm.toLowerCase());
            // 'chart' vs 'upcoming' 로직 추가 필요
            return matchesGenre && matchesScreenType && matchesSearch;
        })
        .sort((a, b) => {
            return filters.sortOrder === 'popularity'
                ? b.reservation_rate - a.reservation_rate
                : new Date(b.release_date) - new Date(a.release_date);
        })
        .slice(0, 5); // 메인 페이지에서는 5개만 표시

    return (
        <Grid>
            {displayedMovies.map((movie) => (
                <MovieCard key={movie.id}>
                    <PosterContainer>
                        <Poster src={movie.poster} alt={movie.title} />
                        <HoverOverlay>
                            <ButtonGroup>
                                <ActionButton as={Link} to={`/movie/${movie.id}`} className="secondary">상세보기</ActionButton>
                                <ActionButton as={Link} to={`/reservation?movie=${movie.id}`}>예매하기</ActionButton>
                            </ButtonGroup>
                        </HoverOverlay>
                    </PosterContainer>
                    <Info>
                        <h3>{movie.title}</h3>
                        <p>예매율 {movie.reservation_rate}%</p>
                    </Info>
                </MovieCard>
            ))}
        </Grid>
    );
};

// --- STYLED COMPONENTS ---

const Grid = styled.div`
  display: grid;
  gap: 30px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
`;

const ButtonGroup = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 75%; /* 버튼 그룹의 너비 설정 */
  display: flex;
  flex-direction: column; /* 버튼을 세로로 나열 */
  align-items: center; /* 버튼을 가운데 정렬 */
  gap: 12px; /* 버튼 사이의 간격 */
  opacity: 0;
  transform: translate(-50%, -45%); /* 시작 위치 (약간 아래) */
  transition: all 0.3s ease;
`;

const HoverOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6); /* 포스터를 어둡게 만드는 효과 */
    opacity: 0;
    transition: opacity 0.3s ease;
`;

const MovieCard = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    
    ${HoverOverlay} {
        opacity: 1;
    }
    ${ButtonGroup} {
        opacity: 1;
        transform: translate(-50%, -50%); /* 최종 위치 (정중앙) */
    }
  }
`;

const PosterContainer = styled.div`
    position: relative;
    width: 100%;
    height: 360px; /* 고정된 높이 */
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const Info = styled.div`
  padding: 16px;
  
  h3 {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    margin: 0;
    font-size: 15px;
    color: #555;
  }
`;

const ActionButton = styled.button`
  width: 100%; /* 버튼 너비를 부모(ButtonGroup)에 맞춤 */
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  background-color: #1E6DFF; /* 예매하기 버튼 색 (분홍색 계열) */
  color: #fff;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  transition: all 0.2s ease;

  &.secondary {
    background-color: #fff; /* 상세보기 버튼 색 (흰색) */
    color: #333;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

export default MovieGrid;
