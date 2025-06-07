import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import Navbar from "../component/common/NavBar";
import TicketList from "../component/mypage/TicketList";
import PointInfo from "../component/mypage/PointInfo";
import MemberInfo from "../component/mypage/MemberInfo";
import PaymentList from "../component/mypage/PaymentList";
import { FaTicketAlt, FaCreditCard, FaCoins, FaUserEdit } from 'react-icons/fa';

const MyPage = () => {
    const [tab, setTab] = useState("ticket");

    const renderContent = () => {
        switch (tab) {
            case "ticket":
                return <TicketList />;
            case "payment":
                return <PaymentList />;
            case "point":
                return <PointInfo />;
            case "info":
                return <MemberInfo />;
            default:
                return null;
        }
    };

    return (
        <>
            <GlobalStyle />
            <PageWrapper>
                <Navbar underline={true} />
                <MainContainer>
                    <Sidebar>
                        <Tab selected={tab === "ticket"} onClick={() => setTab("ticket")}>
                            <FaTicketAlt /> MY 티켓
                        </Tab>
                        <Tab selected={tab === "payment"} onClick={() => setTab("payment")}>
                            <FaCreditCard /> 결제내역
                        </Tab>
                        <Tab selected={tab === "point"} onClick={() => setTab("point")}>
                            <FaCoins /> 포인트
                        </Tab>
                        <Tab selected={tab === "info"} onClick={() => setTab("info")}>
                            <FaUserEdit /> 회원정보 수정
                        </Tab>
                    </Sidebar>
                    <ContentArea>{renderContent()}</ContentArea>
                </MainContainer>
            </PageWrapper>
        </>
    );
};

export default MyPage;

// --- STYLED COMPONENTS ---

const primaryBlue = '#1E6DFF';
const lightGray = '#f8f9fa';
const mediumGray = '#e9ecef';
const darkGray = '#343a40';
const textGray = '#868e96';

const GlobalStyle = createGlobalStyle`
  body, html {
    background-color: ${lightGray};
    height: 100%;
    margin: 0;
  }
`;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  width: 85%;
  max-width: 1600px;
  margin: 40px auto;
  gap: 40px;
`;

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  width: 240px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  padding: 16px;
  align-self: flex-start; /* 사이드바가 위쪽에 고정되도록 */
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 24px;
  font-size: 17px;
  font-weight: 700;
  background: ${({ selected }) => (selected ? lightGray : "transparent")};
  color: ${({ selected }) => (selected ? primaryBlue : darkGray)};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;
  
  svg {
    font-size: 20px;
  }

  &:hover {
    background: ${lightGray};
    color: ${primaryBlue};
  }
`;

const ContentArea = styled.main`
  flex: 1;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  padding: 40px;
`;
