import React from 'react';
import styled from 'styled-components';
import { movies } from '../../example_data/movies';

// 예매율이 가장 높은 영화 찾기
const topMovie = movies.reduce((prev, curr) =>
  curr.reservation_rate > prev.reservation_rate ? curr : prev
);

const BannerContainer = styled.div`
  width: 100%;
  
  margin: 0 auto;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const PosterImage = styled.img`
  width: 100%;
  max-height: 500px;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const BannerText = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  color: white;
  width: 100%;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 32px;
  font-weight: bold;
`;

const Rate = styled.p`
  margin: 6px 0 0;
  font-size: 18px;
`;

function TopReservationBanner() {
  return (
    <BannerContainer>
      <PosterImage src={topMovie.poster} alt={topMovie.title} />
      <BannerText>
        <Title>{topMovie.title}</Title>
        <Rate>예매율: {topMovie.reservation_rate}%</Rate>
      </BannerText>
    </BannerContainer>
  );
}


export default TopReservationBanner;
