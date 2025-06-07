import React from 'react';
import styled from 'styled-components';
import { FaStar } from 'react-icons/fa';

// 별점 표시를 위한 컴포넌트
const StarRating = ({ rating }) => {
    return (
        <StarContainer>
            {[...Array(5)].map((_, index) => (
                <FaStar key={index} color={index < rating ? '#ffc107' : '#e4e5e9'} />
            ))}
        </StarContainer>
    );
};

const ReviewsList = ({ reviews }) => {
    return (
        <ReviewContainer>
            {reviews.length > 0 ? (
                reviews.map(review => (
                    <ReviewItem key={review.id}>
                        <ReviewHeader>
                            <UserInfo>
                                <strong>{review.user}</strong>
                                <StarRating rating={review.rating} />
                            </UserInfo>
                            <Timestamp>{new Date(review.timestamp).toLocaleDateString()}</Timestamp>
                        </ReviewHeader>
                        <Comment>{review.comment}</Comment>
                    </ReviewItem>
                ))
            ) : (
                <p>작성된 관람평이 없습니다.</p>
            )}
        </ReviewContainer>
    );
};

export default ReviewsList;

// --- Styled Components ---

const ReviewContainer = styled.div`
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const ReviewItem = styled.div`
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 20px;
`;

const ReviewHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;

    strong {
        font-size: 16px;
        font-weight: 700;
    }
`;

const Timestamp = styled.span`
    font-size: 14px;
    color: #868e96;
`;

const Comment = styled.p`
    font-size: 15px;
    line-height: 1.6;
    margin: 0;
`;

const StarContainer = styled.div`
    display: flex;
    gap: 2px;
    svg {
        font-size: 16px;
    }
`;
