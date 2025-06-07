import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
// import { movies } from '../../example_data/movies'; // 실제 데이터 경로 확인

// --- 목업 데이터 (실제 프로젝트에서는 제거) ---
const topMovie = {
    id: 1,
    title: '기생충',
    poster: 'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20190528_36%2F1559024198386YVTEw_JPEG%2Fmovie_image.jpg',
    reservation_rate: 17.5,
};
// --- 목업 데이터 끝 ---

const BannerContainer = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  height: 500px; /* 고정 높이 설정 */
`;

const PosterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
`;

const BannerContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 40px;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 20%, transparent 80%);
  color: #fff;
  box-sizing: border-box; /* 패딩이 크기에 포함되도록 설정 */
`;

const Title = styled.h2`
  margin: 0;
  font-size: 48px;
  font-weight: 900;
  text-shadow: 0 2px 5px rgba(0,0,0,0.5);
`;

const Rate = styled.p`
  margin: 10px 0 20px;
  font-size: 22px;
  font-weight: 500;
  opacity: 0.9;
`;

const ReserveButton = styled(Link)`
  background-color: #1E6DFF;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px 28px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  align-self: flex-start; /* 버튼이 왼쪽 정렬되도록 설정 */

  &:hover {
    background-color: #0056e0;
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(30, 109, 255, 0.4);
  }
`;

function TopReservationBanner() {
  return (
    <BannerContainer>
      <PosterImage src={topMovie.poster} alt={topMovie.title} />
      <BannerContent>
        <Title>{topMovie.title}</Title>
        <Rate>예매율: {topMovie.reservation_rate}%</Rate>
        <ReserveButton to={`/reservation?movie=${topMovie.id}`}>
          바로 예매하기
        </ReserveButton>
      </BannerContent>
    </BannerContainer>
  );
}

export default TopReservationBanner;
