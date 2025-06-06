import React from 'react';
import styled from 'styled-components';
import { movies } from '../../example_data/movies';

const primaryBlue = '#1E6DFF';
const white = '#fff';
const blackTransparent = 'rgba(0, 0, 0, 0.6)';

// 예매율이 가장 높은 영화 찾기
const topMovie = movies.reduce((prev, curr) =>
  curr.reservation_rate > prev.reservation_rate ? curr : prev
);

const BannerContainer = styled.div`
  width: 80%; /* Adjusted width to match other sections */
  margin: 30px auto; /* Centered with more vertical margin */
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25); /* More prominent shadow */
`;

const PosterImage = styled.img`
  width: 100%;
  max-height: 450px; /* Slightly reduced max height */
  height: auto; /* Maintain aspect ratio */
  object-fit: cover;
  display: block;
`;

const BannerText = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 25px; /* Increased padding */
  background: linear-gradient(to top, ${blackTransparent} 10%, transparent 100%);
  color: ${white};
  width: 100%;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 36px; /* Larger title font */
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.5); /* Subtle text shadow */
`;

const Rate = styled.p`
  margin: 8px 0 0; /* More margin */
  font-size: 20px; /* Larger rate font */
  font-weight: 500;
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