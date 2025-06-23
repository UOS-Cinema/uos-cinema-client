import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const MovieGrid = ({ results }) => {
    // --- 렌더링 로직 ---
    // 로딩, 에러, 데이터 없음 처리는 부모 컴포넌트에서 하므로 여기서는 받은 데이터가 있다고 가정
    if (!results || results.length === 0) {
        // 부모 컴포넌트에서 이미 이 경우를 처리하지만, 안전장치로 추가
        return <StatusText>조회된 영화가 없습니다.</StatusText>;
    }
    else{
      console.log(results);
    }
    
    return (
        <Grid>
            {results.map((movie) => (
                <MovieCard key={movie.id}>
                    <PosterContainer>
                        {/* API 응답 키에 맞춰 posterUrl로 변경될 수 있음 */}
                        <Poster src={movie.posterUrls[0]} alt={movie.title} />
                        {/* <Poster src="https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20250514_116%2F17471898410878x4Ud_JPEG%2Fmovie_image.jpg"/> */}
                        
                        <HoverOverlay>
                            <ButtonGroup>
                                <ActionButton as={Link} to={`/movie/${movie.id}`} className="secondary">상세보기</ActionButton>
                                <ActionButton as={Link} to={`/reservation?movie=${movie.id}`}>예매하기</ActionButton>
                            </ButtonGroup>
                        </HoverOverlay>
                    </PosterContainer>
                    <Info>
                        <h3>{movie.title}</h3>
                        {/* API 응답 키에 맞춰 reservationRate로 변경될 수 있음 */}
                        <p>예매수{movie.cumulativeBookings}</p>
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

const StatusText = styled.p`
    text-align: center;
    font-size: 18px;
    color: #868e96;
    padding: 50px;
`;

const ButtonGroup = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 75%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  opacity: 0;
  transform: translate(-50%, -45%);
  transition: all 0.3s ease;
`;

const HoverOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
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
        transform: translate(-50%, -50%);
    }
  }
`;

const PosterContainer = styled.div`
    position: relative;
    width: 100%;
    height: 360px;
`;

const Poster = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  
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
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  background-color: #1E6DFF;
  color: #fff;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  transition: all 0.2s ease;

  &.secondary {
    background-color: #fff;
    color: #333;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

export default MovieGrid;