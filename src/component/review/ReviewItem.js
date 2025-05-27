// src/component/movie/ReviewItem.js
import React from 'react';
import styled from 'styled-components';

const ReviewItemContainer = styled.div`
    border-bottom: 1px solid #eee;
    padding: 15px 0;
    &:last-child {s
        border-bottom: none;
    }
`;

const ReviewHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
`;

const ReviewUser = styled.span`
    font-weight: bold;
    font-size: 16px;
`;

const ReviewTimestamp = styled.span`
    color: #888;
    font-size: 12px;
`;

const ReviewRating = styled.div`
    margin-bottom: 8px;
    color: #f5c518; // IMDB yellow for stars
    font-size: 18px;
`;

const ReviewComment = styled.p`
    font-size: 14px;
    line-height: 1.6;
    color: #333;
    margin: 0;
`;

const Star = styled.span`
    color: #f5c518;
`;

const EmptyStar = styled.span`
    color: #ddd;
`;


const ReviewItem = ({ review }) => {
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderStars = (rating) => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(i <= rating ? <Star key={i}>★</Star> : <EmptyStar key={i}>☆</EmptyStar>);
        }
        return stars;
    };

    return (
        <ReviewItemContainer>
            <ReviewHeader>
                <ReviewUser>{review.user || '익명'}</ReviewUser>
                <ReviewTimestamp>{formatDate(review.timestamp)}</ReviewTimestamp>
            </ReviewHeader>
            <ReviewRating>{renderStars(review.rating)} ({review.rating}/5)</ReviewRating>
            <ReviewComment>{review.comment}</ReviewComment>
        </ReviewItemContainer>
    );
};

export default ReviewItem;