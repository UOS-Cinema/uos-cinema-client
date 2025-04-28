import { Link, useParams } from 'react-router-dom';
import Navbar from '../component/common/NavBar';
import styled from 'styled-components';
import { movies } from '../example_data/movies';
import SearchBar from '../component/common/SearchBar';
import age15 from '../asset/age15.png';
import director from '../asset/director.jpg';
import actor1 from '../asset/actor1.jpg';
import actor2 from '../asset/actor2.jpg';
import actor3 from '../asset/actor3.jpg';

const Poster = styled.img`
    width: 300px;
    height: 500px;
    margin:30px;
`;

const CardImg = styled.img`
    width:100px;
    height:130px;
    border-radius:10px;
`;
const AgeImg = styled.img`
    width: 40px;
    height: 40px;
`;

const StyledLine = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    text-align: center;
    font-size: 32px;
`;

const Info = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: row;
    width: 70%;
    margin-left: 15%;
    margin-top: 30px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;   // 밑줄 제거
  color: inherit;          // 부모 요소의 글자색 상속

  &:visited {
    color: inherit;        // 방문한 링크도 동일한 색
  }
`;

const Container = styled.div``;
const CardContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  width: 100%;
  flex-wrap: wrap;
  justify-content: flex-start; /* 왼쪽 정렬 */
`;

const Card = styled.div`
    background-color: #fff;
    border-radius: 8px;
    border:1px solid rgba(0, 0, 0, 0.1);    
    padding-top: 10px;
    width: 120px;
    height:170px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
`;

const MovieDetailPage = () => {
    const { id } = useParams();
    const movie = movies.find((movie) => movie.id === parseInt(id));
    if (!movie) {
        return <p>영화를 찾을 수 없습니다.</p>;
    }

    return (
        <Container>
            <Navbar underline={true} />
            <SearchBar />
            <Info>
                <Poster src={movie.poster} alt={movie.title} />
                <div>
                    <StyledLine>
                        <AgeImg src={age15} /> {movie.title}
                    </StyledLine>
                    <p>{movie.genre} · {movie.runningTime}분 · {movie.distributor}</p>
                    <p>개봉일: {movie.releaseDate}</p>
                    <p>{movie.plot}</p>
                    <h3>감독</h3>
                    <CardContainer>

                        <Card>
                            <CardImg src={director} alt="director" />
                            <div>{movie.director}</div>
                            <div>감독</div>
                        </Card>
                    </CardContainer>
                    <h3>주연</h3>
                    <CardContainer>

                        <Card>
                            <CardImg src={actor1} />
                            <div>{movie.actors[0]}</div>
                            <div>오대수 역</div>
                        </Card>
                        <Card>
                            <CardImg src={actor2} />
                            <div>{movie.actors[1]}</div>
                            <div>이우진 역</div>
                        </Card>
                    </CardContainer>
                    <h3>조연</h3>
                    <CardContainer>

                        <Card>
                            <CardImg src={actor3} />
                            <div>{movie.actors[2]}</div>
                            <div>미도 역</div>
                        </Card>
                    </CardContainer>
                </div>
            </Info>
            <StyledLink to={`/reservation/${movie.id}`}>
                <p>예매하기</p>
            </StyledLink>
        </Container>
    );
};

export default MovieDetailPage;
