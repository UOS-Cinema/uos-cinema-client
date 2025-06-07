import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Navbar from '../../component/common/NavBar'; // 경로 확인 필요
import { FaPlus, FaSave, FaTrashAlt, FaEdit } from "react-icons/fa";

// --- 목업 데이터 ---
const defaultScreenTypes = [
  { id: 1, name: '2D', price: 10000 },
  { id: 2, name: '3D', price: 13000 },
  { id: 3, name: '4D', price: 15000 }
];
const defaultCustomerTypes = [
  { id: 1, name: '청소년', price: 8000 },
  { id: 2, name: '성인', price: 10000 },
  { id: 3, name: '경로', price: 7000 },
  { id: 4, name: '우대', price: 6000 }
];
const defaultPartners = {
  card: [
    { id: 1, name: '카카오페이', discount: 10 },
    { id: 2, name: '네이버페이', discount: 5 },
    { id: 3, name: '토스페이', discount: 7 }
  ],
  bank: [
    { id: 4, name: '국민은행', discount: 3 }
  ]
};
// --- 목업 데이터 끝 ---


const PaymentPolicyPage = () => {
  const [newItem, setNewItem] = useState({ name: '', price: '', discount: '' });
  const [activeTab, setActiveTab] = useState('screen');
  const [screenTypes, setScreenTypes] = useState(defaultScreenTypes);
  const [customerTypes, setCustomerTypes] = useState(defaultCustomerTypes);
  const [partners, setPartners] = useState(defaultPartners);
  const [partnerSubTab, setPartnerSubTab] = useState('card');
  const [editItem, setEditItem] = useState({ tab: '', subTab: '', id: null });

  const handleEdit = (tab, subTab, id) => setEditItem({ tab, subTab, id });
  
  const handleValueChange = (tab, id, field, value) => {
    const isPartner = tab === 'partner';
    const list = isPartner ? partners[partnerSubTab] : tab === 'screen' ? screenTypes : customerTypes;
    const updater = isPartner ? (newList) => setPartners(p => ({...p, [partnerSubTab]: newList})) : tab === 'screen' ? setScreenTypes : setCustomerTypes;
    
    const updatedList = list.map(item => {
        if (item.id === id) {
            return { ...item, [field]: value };
        }
        return item;
    });
    updater(updatedList);
  };

  const handleDelete = (tab, id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
        if (tab === 'screen') setScreenTypes(p => p.filter(i => i.id !== id));
        else if (tab === 'customer') setCustomerTypes(p => p.filter(i => i.id !== id));
        else if (tab === 'partner') setPartners(p => ({...p, [partnerSubTab]: p[partnerSubTab].filter(i => i.id !== id)}));
    }
  };

  const handleAdd = (tab) => {
    if (!newItem.name.trim()) return;
    const isPartner = tab === 'partner';
    const value = isPartner ? (parseInt(newItem.discount) || 0) : (parseInt(newItem.price) || 0);

    const list = isPartner ? partners[partnerSubTab] : tab === 'screen' ? screenTypes : customerTypes;
    const updater = isPartner ? (newList) => setPartners(p => ({...p, [partnerSubTab]: newList})) : tab === 'screen' ? setScreenTypes : setCustomerTypes;
    
    const newId = list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1;
    const newItemObject = { id: newId, name: newItem.name };
    if(isPartner) newItemObject.discount = value;
    else newItemObject.price = value;

    updater([...list, newItemObject]);
    setNewItem({ name: '', price: '', discount: '' });
  };
  
  const renderList = (items, tabKey, subTabKey = '') => (
    <DataTable>
      <THead>
        <TR>
          <TH>이름</TH>
          <TH>{tabKey === 'partner' ? '할인율' : '가격'}</TH>
          <TH>관리</TH>
        </TR>
      </THead>
      <TBody>
        {items.map(item => (
          <TR key={item.id}>
            {editItem.tab === tabKey && editItem.subTab === subTabKey && editItem.id === item.id ? (
              <>
                <TD><Input value={item.name} onChange={e => handleValueChange(tabKey, item.id, 'name', e.target.value)} /></TD>
                <TD><Input type="number" value={tabKey === 'partner' ? item.discount : item.price} onChange={e => handleValueChange(tabKey, item.id, tabKey === 'partner' ? 'discount' : 'price', e.target.value)} /></TD>
                <TD>
                  <Button onClick={() => setEditItem({ tab: '', subTab:'', id: null })}><FaSave /> 저장</Button>
                </TD>
              </>
            ) : (
              <>
                <TD>{item.name}</TD>
                <TD>{tabKey === 'partner' ? `${item.discount}%` : `${item.price.toLocaleString()}원`}</TD>
                <TD>
                  <Button.Group>
                    <Button onClick={() => handleEdit(tabKey, subTabKey, item.id)}><FaEdit /> 수정</Button>
                    <Button.Danger onClick={() => handleDelete(tabKey, item.id)}><FaTrashAlt /> 삭제</Button.Danger>
                  </Button.Group>
                </TD>
              </>
            )}
          </TR>
        ))}
         <TR isAddForm>
            <TD><Input placeholder="이름" value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}/></TD>
            <TD>
                 {tabKey === 'partner' ? 
                    <Input type="number" placeholder="할인율(%)" value={newItem.discount} onChange={e => setNewItem(p => ({ ...p, discount: e.target.value }))}/> :
                    <Input type="number" placeholder="가격(원)" value={newItem.price} onChange={e => setNewItem(p => ({ ...p, price: e.target.value }))}/>
                 }
            </TD>
            <TD><Button onClick={() => handleAdd(tabKey)}><FaPlus /> 추가</Button></TD>
        </TR>
      </TBody>
    </DataTable>
  );

  return (
    <>
        <GlobalStyle />
        <Navbar underline={true} />
        <Container>
            <Title>가격 정책 관리</Title>
            <TabButtons>
                <Tab active={activeTab === 'screen'} onClick={() => setActiveTab('screen')}>상영유형별 가격</Tab>
                <Tab active={activeTab === 'customer'} onClick={() => setActiveTab('customer')}>고객유형별 가격</Tab>
                <Tab active={activeTab === 'partner'} onClick={() => setActiveTab('partner')}>제휴사별 할인</Tab>
            </TabButtons>

            <ContentWrapper>
                {activeTab === 'screen' && <PolicySection>{renderList(screenTypes, 'screen')}</PolicySection>}
                {activeTab === 'customer' && <PolicySection>{renderList(customerTypes, 'customer')}</PolicySection>}
                {activeTab === 'partner' && (
                    <PolicySection>
                        <SubTabButtons>
                            <SubTab active={partnerSubTab === 'card'} onClick={() => setPartnerSubTab('card')}>카드사</SubTab>
                            <SubTab active={partnerSubTab === 'bank'} onClick={() => setPartnerSubTab('bank')}>은행</SubTab>
                        </SubTabButtons>
                        {renderList(partners[partnerSubTab], 'partner', partnerSubTab)}
                    </PolicySection>
                )}
            </ContentWrapper>
        </Container>
    </>
  );
};

export default PaymentPolicyPage;

// --- STYLED COMPONENTS ---
const primaryBlue = '#1E6DFF';
const darkGray = '#343a40';
const mediumGray = '#dee2e6';
const lightGray = '#f8f9fa';
const red = '#e03131';

const GlobalStyle = createGlobalStyle`body, html { background-color: ${lightGray}; }`;

const Container = styled.div`
  width: 85%;
  max-width: 1200px;
  margin: 40px auto;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 900;
  color: ${darkGray};
  margin-bottom: 20px;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 700;
  background-color: ${({ active }) => (active ? primaryBlue : '#fff')};
  color: ${({ active }) => (active ? '#fff' : darkGray)};
  border: 1px solid ${({ active }) => (active ? primaryBlue : mediumGray)};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
      background-color: ${({ active }) => (active ? '#0056b3' : lightGray)};
  }
`;

const ContentWrapper = styled.div``;

const PolicySection = styled.div`
    background-color: #fff;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.06);
`;

const SubTabButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${mediumGray};
  padding-bottom: 20px;
`;

const SubTab = styled.button`
  padding: 8px 16px;
  background-color: transparent;
  color: ${({ active }) => (active ? primaryBlue : darkGray)};
  border: none;
  border-bottom: 2px solid ${({ active }) => (active ? primaryBlue : 'transparent')};
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
`;

const DataTable = styled.div`
    width: 100%;
    display: table;
    border-collapse: collapse;
`;
const THead = styled.div`
    display: table-header-group;
    background-color: ${lightGray};
`;
const TBody = styled.div`
    display: table-row-group;
`;
const TR = styled.div`
    display: table-row;
    border-bottom: 1px solid ${mediumGray};

    &:last-child {
        border-bottom: none;
    }
    
    ${({ isAddForm }) => isAddForm && `
        background-color: #f1f3f5;
    `}
`;
const TH = styled.div`
    display: table-cell;
    padding: 12px 16px;
    font-weight: 700;
    text-align: left;
    color: #495057;
`;
const TD = styled.div`
    display: table-cell;
    padding: 12px 16px;
    vertical-align: middle;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  font-size: 15px;
  border: 1px solid ${mediumGray};
  border-radius: 6px;
  box-sizing: border-box;
  
  &:focus {
      border-color: ${primaryBlue};
      outline: none;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 700;
  background: ${primaryBlue};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
      background: #0056b3;
  }
`;

Button.Group = styled.div`
    display: flex;
    gap: 8px;
`;

Button.Danger = styled(Button)`
    background: #e9ecef;
    color: ${darkGray};
    
    &:hover {
        background: ${red};
        color: white;
    }
`;
