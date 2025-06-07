import React from "react";
import styled from "styled-components";
// import { movies } from "../../example_data/movies";

// --- 목업 데이터 ---
const movies = [
    {id: 1, title: '기생충', poster: 'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20190528_36%2F1559024198386YVTEw_JPEG%2Fmovie_image.jpg', reservation_rate: 17.5, director: '봉준호', actors: '송강호, 이선균, 조여정', genres: ['드라마', '스릴러'], screen_types: ['2D'], release_date: '2019-05-30'},
    {id: 2, title: '올드보이', poster: 'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20111222_177%2F1324537084439rmrVk_JPEG%2Fmovie_image.jpg', reservation_rate: 14.6, director: '박찬욱', actors: '최민식, 유지태, 강혜정', genres: ['스릴러', '액션'], screen_types: ['2D', 'IMAX'], release_date: '2003-11-21'},
    {id: 3, title: '부산행', poster: 'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20200612_248%2F1591937633750Vvyr6_JPEG%2Fmovie_image.jpg', reservation_rate: 12.1, director: '연상호', actors: '공유, 정유미, 마동석', genres: ['액션', '공포'], screen_types: ['2D', '4DX'], release_date: '2016-07-20'},
    {id: 4, title: '극한직업', poster: 'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20190116_206%2F1547615429111dINWj_JPEG%2Fmovie_image.jpg', reservation_rate: 18.2, director: '이병헌', actors: '류승룡, 이하늬, 진선규', genres: ['코미디', '액션'], screen_types: ['2D'], release_date: '2019-01-23'},
    {id: 5, title: '헤어질 결심', poster: 'https://search.pstatic.net/common?quality=75&direct=true&src=https%3A%2F%2Fmovie-phinf.pstatic.net%2F20220607_129%2F16545872892918GA4h_JPEG%2Fmovie_image.jpg', reservation_rate: 9.8, director: '박찬욱', actors: '박해일, 탕웨이', genres: ['로맨스', '드라마'], screen_types: ['2D'], release_date: '2022-06-29'},
];
// --- 목업 데이터 끝 ---

const PaymentList = () => {
    return (
        <Wrapper>
            <Title>결제내역</Title>
            <ListContainer>
                {movies.map((movie) => (
                    <PaymentItem key={movie.id}>
                        <Poster src={movie.poster} alt={movie.title} />
                        <PaymentDetails>
                            <h3>{movie.title}</h3>
                            <p className="date">2025.03.15</p>
                            <p className="theater">미키17(2D)</p>
                            <Divider />
                            <InfoGrid>
                                <span>총가격</span><p>30,000원</p>
                                <span>할인금액</span><p>-2,000원</p>
                                <span>사용포인트</span><p>-2,000원</p>
                                <span className="final-price-label">최종가격</span><p className="final-price">26,000원</p>
                            </InfoGrid>
                        </PaymentDetails>
                        <ReferenceDetails>
                             <InfoGrid>
                                <span>예매번호</span><p>45321312</p>
                                <span>결제번호</span><p>12321132</p>
                                <span>적립포인트</span><p>+2,800 P</p>
                            </InfoGrid>
                        </ReferenceDetails>
                    </PaymentItem>
                ))}
            </ListContainer>
        </Wrapper>
    );
};
export default PaymentList;

// --- STYLED COMPONENTS ---

const darkGray = '#343a40';
const textGray = '#868e96';
const mediumGray = '#dee2e6';

const Wrapper = styled.div`
  width: 100%;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 900;
  color: ${darkGray};
  margin: 0 0 30px 0;
  padding-bottom: 20px;
  border-bottom: 1px solid ${mediumGray};
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PaymentItem = styled.div`
  display: flex;
  gap: 24px;
  background: #fff;
  border: 1px solid ${mediumGray};
  padding: 24px;
  border-radius: 12px;
`;

const Poster = styled.img`
  width: 100px;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
`;

const PaymentDetails = styled.div`
  flex: 2;
  h3 {
    margin: 0;
    font-size: 20px;
  }
  .date {
    font-size: 14px;
    color: ${textGray};
    margin: 4px 0 0;
  }
  .theater {
      font-size: 15px;
      margin: 10px 0;
  }
`;

const ReferenceDetails = styled.div`
    flex: 1.5;
    padding-left: 24px;
    border-left: 1px dashed ${mediumGray};
`;

const Divider = styled.hr`
    border: none;
    border-top: 1px solid ${mediumGray};
    margin: 16px 0;
`;

const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 10px;
    
    span {
        font-weight: 500;
        color: ${textGray};
        font-size: 14px;
    }
    p {
        margin: 0;
        font-size: 15px;
        color: ${darkGray};
    }
    .final-price-label {
        font-weight: 700;
    }
    .final-price {
        font-weight: 700;
        color: #1E6DFF;
    }
`;
