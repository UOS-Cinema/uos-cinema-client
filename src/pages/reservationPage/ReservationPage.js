import { useParams } from 'react-router-dom';
import Navbar from '../../component/NavBar';
// 샘플 데이터
const movies = [
    {
        id: 1,
        title: '기생충',
        director: '봉준호',
        actors: '송강호, 이선균, 조여정',
        poster: 'https://upload.wikimedia.org/wikipedia/en/5/53/Parasite_%282019_film%29.png',
    },
    {
        id: 2,
        title: '괴물',
        director: '봉준호',
        actors: '송강호, 변희봉, 박해일',
        poster: 'https://upload.wikimedia.org/wikipedia/en/0/05/The_Host_poster.jpg',
    },
    {
        id: 3,
        title: '헤어질 결심',
        director: '박찬욱',
        actors: '박해일, 탕웨이',
        poster: 'https://upload.wikimedia.org/wikipedia/en/e/e6/Decision_to_Leave.jpg',
    },
    {
        id: 4,
        title: '올드보이',
        director: '박찬욱',
        actors: '최민식, 유지태',
        poster: 'https://upload.wikimedia.org/wikipedia/en/6/67/Oldboykoreanposter.jpg',
    },
    {
        id: 5,
        title: '살인의 추억',
        director: '봉준호',
        actors: '송강호, 김상경',
        poster: 'https://upload.wikimedia.org/wikipedia/en/7/7e/Memories_of_Murder_poster.jpg',
    },
    {
        id: 6,
        title: '타짜',
        director: '최동훈',
        actors: '조승우, 김혜수, 유해진',
        poster: 'https://upload.wikimedia.org/wikipedia/en/f/f7/Tazza_%282006%29_poster.jpg',
    },
];





const ReservationPage = () => {
    const { id } = useParams(); // URL에서 id 파라미터를 추출
    // movies 배열에서 해당 영화 정보를 찾기
    const movie = movies.find((movie) => movie.id === parseInt(id));
    if (!movie) {
        return <p>영화를 찾을 수 없습니다.</p>;
    }
    return (
        <div>
            <Navbar></Navbar>
            <h1>{movie.title}</h1>
            <p>예매페이지</p>
            <img src={movie.poster} alt={movie.title} />
            <p>🎬 감독: {movie.director}</p>
            <p>🎭 배우: {movie.actors}</p>
            <p>영화 설명 (추가 정보)</p>
        </div>
    );

}
export default ReservationPage;