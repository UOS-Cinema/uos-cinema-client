// src/component/movie/ReviewsList.js
import React from 'react';
import styled from 'styled-components';

import ReviewItem from './ReviewItem';
const sampleReviews = [
    // Reviews for movie with id 1 (e.g., 올드보이)
    {
        id: 1,
        movieId: 1,
        user: '영화광팬123',
        timestamp: '2024-03-14T10:30:00Z',
        comment: '정말 충격적이고 대단한 영화입니다. 최민식 배우의 연기는 압권!',
        rating: 5,
    },
    {
        id: 2,
        movieId: 1,
        user: '시네필B',
        timestamp: '2024-03-15T14:20:00Z',
        comment: '미장센과 스토리가 완벽하게 어우러진 작품. 다시 봐도 새롭다.',
        rating: 5,
    },
    {
        id: 3,
        movieId: 1,
        user: '무비러버7',
        timestamp: '2024-03-13T09:00:00Z',
        comment: '조금 보기 힘들었지만, 영화가 주는 메시지는 강렬했어요.',
        rating: 4,
    },
    // Reviews for another movie (if you have one with id 2 in movies.js)
    {
        id: 4,
        movieId: 2, // Assuming you have a movie with id 2
        user: 'PopcornLover',
        timestamp: '2024-03-10T18:00:00Z',
        comment: '생각보다 평범했어요. 기대에는 못 미쳤네요.',
        rating: 3,
    },
    {
        id: 5,
        movieId: 2,
        user: '익명관람객',
        timestamp: '2024-03-12T22:15:00Z',
        comment: '킬링타임용으로는 괜찮습니다.',
        rating: 3,
    }
];
const ReviewsContainer = styled.div`
    margin-top: 20px;
    padding: 10px;
    background-color: #f9f9f9;
    border-radius: 8px;
`;

const NoReviewsText = styled.p`
    text-align: center;
    color: #777;
    padding: 20px;
`;

const ReviewsList = ({ movieId }) => {
    // Filter reviews for the current movie
    const movieReviews = sampleReviews.filter(review => review.movieId === movieId);

    // Sort reviews by timestamp (latest first)
    const sortedReviews = [...movieReviews].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (sortedReviews.length === 0) {
        return <NoReviewsText>아직 등록된 관람평이 없습니다.</NoReviewsText>;
    }

    return (
        <ReviewsContainer>
            {sortedReviews.map(review => (
                <ReviewItem key={review.id} review={review} />
            ))}
        </ReviewsContainer>
    );
};

export default ReviewsList;