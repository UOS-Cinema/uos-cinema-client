import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../../component/common/NavBar';

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


const PaymentPolicyPage = () => {
  const [newItem, setNewItem] = useState({ name: '', price: '', discount: '' });
  const [activeTab, setActiveTab] = useState('screen');
  const [screenTypes, setScreenTypes] = useState(defaultScreenTypes);
  const [customerTypes, setCustomerTypes] = useState(defaultCustomerTypes);
  const [partners, setPartners] = useState(defaultPartners);
  const [partnerSubTab, setPartnerSubTab] = useState('card');
  const [editItem, setEditItem] = useState({ tab: '', id: null });

  const handleEdit = (tab, id) => setEditItem({ tab, id });
  const renderAddForm = (tabKey) => (
    <AddForm>
      <Input
        placeholder="이름"
        value={newItem.name}
        onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
      />
      {tabKey === 'partner' ? (
        <Input
          type="number"
          placeholder="할인율(%)"
          value={newItem.discount}
          onChange={e => setNewItem(prev => ({ ...prev, discount: e.target.value }))}
        />
      ) : (
        <Input
          type="number"
          placeholder="가격"
          value={newItem.price}
          onChange={e => setNewItem(prev => ({ ...prev, price: e.target.value }))}
        />
      )}
      <Button onClick={() => handleAdd(tabKey)}>추가</Button>
    </AddForm>
  );
  const handleChange = (tab, id, field, value) => {
    if (tab === 'screen' || tab === 'customer') {
      const current = tab === 'screen' ? [...screenTypes] : [...customerTypes];
      const updater = tab === 'screen' ? setScreenTypes : setCustomerTypes;
      const index = current.findIndex(item => item.id === id);
      current[index][field] = field === 'price' ? parseInt(value) : value;
      updater(current);
    } else if (tab === 'partner') {
      const current = [...partners[partnerSubTab]];
      const index = current.findIndex(item => item.id === id);
      current[index][field] = field === 'discount' ? parseInt(value) : value;
      setPartners(prev => ({ ...prev, [partnerSubTab]: current }));
    }
  };

  const handleDelete = (tab, id) => {
    if (tab === 'screen') {
      setScreenTypes(prev => prev.filter(item => item.id !== id));
    } else if (tab === 'customer') {
      setCustomerTypes(prev => prev.filter(item => item.id !== id));
    } else if (tab === 'partner') {
      setPartners(prev => ({
        ...prev,
        [partnerSubTab]: prev[partnerSubTab].filter(item => item.id !== id)
      }));
    }
  };
  const handleAdd = (tab) => {
    if (!newItem.name.trim()) return;

    if (tab === 'screen') {
      const newId = screenTypes.length ? Math.max(...screenTypes.map(i => i.id)) + 1 : 1;
      setScreenTypes([...screenTypes, { id: newId, name: newItem.name, price: parseInt(newItem.price) || 0 }]);
    } else if (tab === 'customer') {
      const newId = customerTypes.length ? Math.max(...customerTypes.map(i => i.id)) + 1 : 1;
      setCustomerTypes([...customerTypes, { id: newId, name: newItem.name, price: parseInt(newItem.price) || 0 }]);
    } else if (tab === 'partner') {
      const newId = partners[partnerSubTab].length ? Math.max(...partners[partnerSubTab].map(i => i.id)) + 1 : 1;
      const updatedList = [...partners[partnerSubTab], {
        id: newId,
        name: newItem.name,
        discount: parseInt(newItem.discount) || 0
      }];
      setPartners(prev => ({ ...prev, [partnerSubTab]: updatedList }));
    }

    // 초기화
    setNewItem({ name: '', price: '', discount: '' });
  };

  const renderList = (items, tabKey) => (
    <List>
      {items.map(item => (
        <ListItem key={item.id}>
          {editItem.tab === tabKey && editItem.id === item.id ? (
            <>
              <Input
                value={item.name}
                onChange={e => handleChange(tabKey, item.id, 'name', e.target.value)}
              />
              <Input
                type="number"
                value={tabKey === 'partner' ? item.discount : item.price}
                onChange={e => handleChange(tabKey, item.id, tabKey === 'partner' ? 'discount' : 'price', e.target.value)}
              />
              <Button onClick={() => setEditItem({ tab: '', id: null })}>저장</Button>
            </>
          ) : (
            <>
              <span>{item.name}</span>
              <span>
                {tabKey === 'partner'
                  ? `${item.discount}% 할인`
                  : `${item.price.toLocaleString()}원`}
              </span>
              <Button onClick={() => handleEdit(tabKey, item.id)}>수정</Button>
              <Button onClick={() => handleDelete(tabKey, item.id)}>삭제</Button>
            </>
          )}
        </ListItem>
      ))}
    </List>
  );

  return (
    <Container>
      <Navbar underline={true} />
      <Wrapper>
        <Title>가격정책관리</Title>
        <TabButtons>
          <Tab active={activeTab === 'screen'} onClick={() => setActiveTab('screen')}>상영유형</Tab>
          <Tab active={activeTab === 'customer'} onClick={() => setActiveTab('customer')}>고객유형</Tab>
          <Tab active={activeTab === 'partner'} onClick={() => setActiveTab('partner')}>제휴사</Tab>
        </TabButtons>
        {activeTab === 'screen' && (
          <>
            {renderList(screenTypes, 'screen')}
            {renderAddForm('screen')}
          </>
        )}
        {activeTab === 'customer' && (
          <>
            {renderList(customerTypes, 'customer')}
            {renderAddForm('customer')}
          </>
        )}
        {activeTab === 'partner' && (
          <>
            <SubTabButtons>
              <SubTab active={partnerSubTab === 'card'} onClick={() => setPartnerSubTab('card')}>카드</SubTab>
              <SubTab active={partnerSubTab === 'bank'} onClick={() => setPartnerSubTab('bank')}>은행</SubTab>
            </SubTabButtons>
            {renderList(partners[partnerSubTab], 'partner')}
            {renderAddForm('partner')}
          </>
        )}
      </Wrapper>
    </Container>

  );
};

const Container = styled.div`
  
`;
const Wrapper = styled.div`
  padding: 20px;
  margin-left:10%;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;
const AddForm = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;
const TabButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Tab = styled.button`
  padding: 10px 20px;
  background-color: ${({ active }) => (active ? '#1E6DFF' : '#eee')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const SubTabButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const SubTab = styled.button`
  padding: 6px 14px;
  background-color: ${({ active }) => (active ? '#555' : '#ccc')};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Input = styled.input`
  padding: 6px;
  font-size: 14px;
`;

const Button = styled.button`
  padding: 5px 10px;
  font-size: 13px;
  background: #ddd;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;


export default PaymentPolicyPage;
