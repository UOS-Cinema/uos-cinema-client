import React from 'react';
import styled from 'styled-components';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
    }

    if (totalPages <= 1) {
        return null; // 페이지가 1개 이하면 페이지네이션을 표시하지 않음
    }

    return (
        <Nav>
            <PageButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 0}>
                &lt;
            </PageButton>
            {pageNumbers.map(number => (
                <PageButton key={number} active={currentPage === number} onClick={() => onPageChange(number)}>
                    {number + 1}
                </PageButton>
            ))}
            <PageButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages - 1}>
                &gt;
            </PageButton>
        </Nav>
    );
};

const Nav = styled.nav`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin: 40px 0;
`;

const PageButton = styled.button`
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 8px 12px;
    margin: 0;
    background-color: ${({ active }) => (active ? '#1E6DFF' : '#fff')};
    color: ${({ active }) => (active ? '#fff' : '#343a40')};
    font-size: 16px;
    font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
        background-color: #f1f3f5;
        border-color: #ced4da;
    }

    &:disabled {
        background-color: #f8f9fa;
        color: #ced4da;
        cursor: not-allowed;
    }
`;

export default Pagination;