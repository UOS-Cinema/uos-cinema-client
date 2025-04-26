import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "../component/common/NavBar";
import TicketList from "../component/mypage/TicketList";
import PointInfo from "../component/mypage/PointInfo";
import MemberInfo from "../component/mypage/MemberInfo";
const MyPage = () => {
  const [tab, setTab] = useState("ticket");
  

  const renderContent = () => {
    if (tab === "ticket") {
      return (<TicketList/>);
    }
    else if (tab === "point"){
        return (<PointInfo/>)
    }
    else if (tab === "info"){
        return (<MemberInfo/>)
    }
    return null;
  };

  return (
    <div>
      <Navbar />
      <Container>
        <TabContainer>
          <Tab selected={tab === "ticket"} onClick={() => setTab("ticket")}>MY 티켓</Tab>
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
  border-left: 4px solid ${({ selected }) => (selected ? "#f00" : "transparent")};
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

// const TicketList = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 20px;
// `;

// const Ticket = styled.div`
//   display: flex;
//   background: #fafafa;
//   border: 1px solid #ddd;
//   padding: 15px;
//   border-radius: 8px;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

//   img {
//     width: 100px;
//     height: 140px;
//     object-fit: cover;
//     border-radius: 4px;
//     margin-right: 20px;
//   }
// `;

// const TicketInfo = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;

//   h3 {
//     margin: 0 0 10px;
//   }

//   p {
//     margin: 2px 0;
//     font-size: 14px;
//     color: #333;
//   }
// `
