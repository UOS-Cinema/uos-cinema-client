import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "../component/common/NavBar";
import TicketList from "../component/mypage/TicketList";
import PointInfo from "../component/mypage/PointInfo";
import MemberInfo from "../component/mypage/MemberInfo";
import PaymentList from "../component/mypage/PaymentList";
const MyPage = () => {
  const [tab, setTab] = useState("ticket");


  const renderContent = () => {
    if (tab === "ticket") {
      return (<TicketList />);
    }
    else if (tab === "payment") {
      return (<PaymentList />)
    }
    else if (tab === "point") {
      return (<PointInfo />)
    }
    else if (tab === "info") {
      return (<MemberInfo />)
    }
    
    return null;
  };

  return (
    <div>
      <Navbar underline={true}/>
      <Container>
        <TabContainer>
          <Tab selected={tab === "ticket"} onClick={() => setTab("ticket")}>MY 티켓</Tab>
          <Tab selected={tab === "payment"} onClick={() => setTab("payment")}>결제내역</Tab>
          <Tab selected={tab === "point"} onClick={() => setTab("point")}>포인트</Tab>
          <Tab selected={tab === "info"} onClick={() => setTab("info")}>회원정보 수정</Tab>
        </TabContainer>
        <Content>{renderContent()}</Content>
      </Container>
    </div>
  );
};

export default MyPage;

const Container = styled.div`
  display: flex;
  padding: 30px;
`;

const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
`;

const Tab = styled.button`
  padding: 15px;
  font-size: 16px;
  background: ${({ selected }) => (selected ? "#222" : "#eee")};
  color: ${({ selected }) => (selected ? "#fff" : "#000")};
  border: none;
  border-left: 4px solid ${({ selected }) => (selected ? "#1D79F2" : "transparent")};
  cursor: pointer;
  text-align: left;
  &:hover {
    background: #ccc;
  }
`;

const Content = styled.div`
  flex: 1;
  padding-left: 40px;
`;
