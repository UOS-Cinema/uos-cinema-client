import React, { useEffect, useState, useContext } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Navbar from '../../component/common/NavBar';
import { FaPlus, FaSave, FaTrashAlt, FaEdit } from "react-icons/fa";
import { useScreenTypes } from '../../context/ScreenTypeContext';
import { useCustomerTypes } from '../../context/CustomerTypeContext';
import { useCardCompanies } from '../../context/CardCompanyContext';
import { useBanks } from '../../context/BankContext';
import { UserContext } from '../../context/UserContext';

/*
 * [개발자 노트]
 * '... is not a function' 오류 해결 및 데이터 자동 새로고침 가이드
 *
 * 이 컴포넌트는 수정/추가/삭제 후 데이터를 다시 불러오기 위해 각 Context로부터 'refresh' 함수를
 * 호출하도록 설계되었습니다 (예: refreshScreenTypes?.()).
 *
 * 만약 'refresh... is not a function' 오류가 발생한다면, 각 Context 파일
 * (예: ScreenTypeContext.js)이 'refresh' 함수를 제공하고 있지 않기 때문입니다.
 *
 * 아래 예시와 같이 각 Context 파일을 수정하여 'refresh' 함수를 추가해주세요.
 *
 * --- 예시: src/context/ScreenTypeContext.js 수정 방법 ---
 *
 * import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
 *
 * export const ScreenTypeContext = createContext();
 * export const useScreenTypes = () => useContext(ScreenTypeContext);
 *
 * export const ScreenTypeProvider = ({ children }) => {
 * const [screenTypes, setScreenTypes] = useState([]);
 * const [loading, setLoading] = useState(true);
 * const [error, setError] = useState(null);
 *
 * // 1. fetch 로직을 useCallback으로 감싸 재사용 가능하게 만듭니다.
 * const fetchScreenTypes = useCallback(async () => {
 * setLoading(true);
 * setError(null);
 * try {
 * const response = await fetch('/admin/screen-types');
 * if (!response.ok) throw new Error('상영 유형 정보 로딩 실패');
 * const responseData = await response.json();
 * setScreenTypes(responseData.data || []);
 * } catch (err) {
 * setError(err.message);
 * } finally {
 * setLoading(false);
 * }
 * }, []); // 의존성 배열이 비어있으므로 함수는 재생성되지 않습니다.
 *
 * // 2. 컴포넌트 마운트 시 한 번만 호출합니다.
 * useEffect(() => {
 * fetchScreenTypes();
 * }, [fetchScreenTypes]);
 *
 * // 3. value 객체에 'refresh'라는 이름으로 fetch 함수를 포함하여 전달합니다.
 * //    이것이 바로 자식 컴포넌트에서 호출할 새로고침 함수입니다.
 * const value = {
 * screenTypes,
 * loading,
 * error,
 * refresh: fetchScreenTypes // 'refresh' 함수 제공
 * };
 *
 * return (
 * <ScreenTypeContext.Provider value={value}>
 * {children}
 * </ScreenTypeContext.Provider>
 * );
 * };
 *
 * // CustomerTypeContext, CardCompanyContext, BankContext도 위와 동일한 패턴으로 수정해주세요.
 */


// API 요청을 위한 헬퍼 함수
const apiRequest = async (endpoint, method, body = null, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };
    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(endpoint, config);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `${endpoint} 요청 실패`);
    }
    
    if (response.status === 204 || response.headers.get("Content-Length") === "0") {
        return null;
    }

    return response.json();
};


const PaymentPolicyPage = () => {
    const { user } = useContext(UserContext);
    const { screenTypes: initialScreenTypes, loading: screenTypesLoading, refresh: refreshScreenTypes } = useScreenTypes();
    const { customerTypes: initialCustomerTypes, loading: customerTypesLoading, refresh: refreshCustomerTypes } = useCustomerTypes();
    const { cardCompanies, loading: cardCompaniesLoading, refresh: refreshCardCompanies } = useCardCompanies();
    const { banks, loading: banksLoading, refresh: refreshBanks } = useBanks();

    const [newItem, setNewItem] = useState({ name: '', price: '', discount: '' });
    const [activeTab, setActiveTab] = useState('screen');
    const [screenTypes, setScreenTypes] = useState([]);
    const [customerTypes, setCustomerTypes] = useState([]);
    const [partners, setPartners] = useState({ card: [], bank: [] });
    const [partnerSubTab, setPartnerSubTab] = useState('card');
    const [editItem, setEditItem] = useState({ tab: '', subTab: '', id: null, currentData: {} });

    useEffect(() => {
        if (!screenTypesLoading) setScreenTypes(initialScreenTypes.map(st => ({ ...st, id: st.type, name: st.type })));
    }, [initialScreenTypes, screenTypesLoading]);
    useEffect(() => {
        if (!customerTypesLoading) setCustomerTypes(initialCustomerTypes.map(ct => ({ ...ct, id: ct.type, name: ct.type, discount: ct.discountAmount })));
    }, [initialCustomerTypes, customerTypesLoading]);
    useEffect(() => {
        if (!cardCompaniesLoading && !banksLoading) setPartners({
            card: cardCompanies.map(c => ({...c, id: c.name, discount: c.discountAmount})),
            bank: banks.map(b => ({...b, id: b.name, discount: b.discountAmount}))
        });
    }, [cardCompanies, banks, cardCompaniesLoading, banksLoading]);

    const handleEdit = (tab, subTab, item) => setEditItem({ tab, subTab, id: item.id, currentData: { ...item } });
    
    const handleValueChange = (field, value) => {
        setEditItem(prev => ({
            ...prev,
            currentData: { ...prev.currentData, [field]: value }
        }));
    };
    
    const handleSave = async (tab, subTab, item) => {
        const { id, name, price, discount } = item;
        let endpoint = '';
        let payload = {};

        switch(tab) {
            case 'screen':
                endpoint = `/admin/screen-types/${id}`;
                payload = { type: name, price: Number(price || 0), iconUrl: "" };
                break;
            case 'customer':
                endpoint = `/admin/customer-types/${id}`;
                payload = { type: name, discountAmount: Number(discount || 0) };
                break;
            case 'partner':
                if (subTab === 'card') {
                    endpoint = `/admin/card-companies/${id}`;
                    payload = { name: name, discountAmount: Number(discount || 0), logoUrl: "" };
                } else {
                    endpoint = `/admin/banks/${id}`;
                    payload = { name: name, discountAmount: Number(discount || 0), logoUrl: "" };
                }
                break;
            default: return;
        }
        
        try {
            await apiRequest(endpoint, 'PUT', payload, user?.accessToken);
            alert("성공적으로 수정되었습니다.");
            if (tab === 'screen') refreshScreenTypes?.();
            if (tab === 'customer') refreshCustomerTypes?.();
            if (tab === 'partner' && subTab === 'card') refreshCardCompanies?.();
            if (tab === 'partner' && subTab === 'bank') refreshBanks?.();
            setEditItem({ tab: '', subTab: '', id: null }); 
        } catch(err) {
            alert(err.message);
        }
    };


    const handleDelete = async (tab, item) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        let endpoint = '';
        const id = item.id || item.type || item.name;

        switch(tab) {
            case 'screen': endpoint = `/admin/screen-types/${id}`; break;
            case 'customer': endpoint = `/admin/customer-types/${id}`; break;
            case 'partner':
                endpoint = partnerSubTab === 'card' ? `/admin/card-companies/${id}` : `/admin/banks/${id}`;
                break;
            default: return;
        }

        try {
            await apiRequest(endpoint, 'DELETE', null, user?.accessToken);
            alert("성공적으로 삭제되었습니다.");
            if (tab === 'screen') refreshScreenTypes?.();
            if (tab === 'customer') refreshCustomerTypes?.();
            if (tab === 'partner' && partnerSubTab === 'card') refreshCardCompanies?.();
            if (tab === 'partner' && partnerSubTab === 'bank') refreshBanks?.();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleAdd = async (tab) => {
        if (!newItem.name.trim()) return alert("이름을 입력해주세요.");
        
        let endpoint = '';
        let payload = {};

        switch(tab) {
            case 'screen':
                endpoint = '/admin/screen-types';
                payload = { type: newItem.name, price: Number(newItem.price || 0), iconUrl: "" };
                break;
            case 'customer':
                endpoint = '/admin/customer-types';
                payload = { type: newItem.name, discountAmount: Number(newItem.discount || 0) };
                break;
            case 'partner':
                endpoint = partnerSubTab === 'card' ? '/admin/card-companies' : '/admin/banks';
                payload = { name: newItem.name, discountAmount: Number(newItem.discount || 0), logoUrl: "" };
                break;
            default: return;
        }

        try {
            await apiRequest(endpoint, 'POST', payload, user?.accessToken);
            alert("성공적으로 추가되었습니다.");
            if (tab === 'screen') refreshScreenTypes?.();
            if (tab === 'customer') refreshCustomerTypes?.();
            if (tab === 'partner' && partnerSubTab === 'card') refreshCardCompanies?.();
            if (tab === 'partner' && partnerSubTab === 'bank') refreshBanks?.();
            setNewItem({ name: '', price: '', discount: '' });
        } catch (err) {
            alert(err.message);
        }
    };
    
    const renderList = (items, tabKey, subTabKey = '') => {
        const isPartner = tabKey === 'partner';
        const isCustomer = tabKey === 'customer';
        const valueHeader = isPartner || isCustomer ? '할인액(원)' : '가격(원)';
        const valueField = isPartner || isCustomer ? 'discount' : 'price';

        return (
            <DataTable>
                <THead>
                    <TR><TH>이름</TH><TH>{valueHeader}</TH><TH>관리</TH></TR>
                </THead>
                <TBody>
                    {items.map(item => (
                        <TR key={item.id}>
                            {editItem.id === item.id && editItem.tab === tabKey && editItem.subTab === subTabKey ? (
                                <>
                                    <TD><Input value={editItem.currentData.name} onChange={e => handleValueChange('name', e.target.value)} /></TD>
                                    <TD><Input type="number" value={editItem.currentData[valueField]} onChange={e => handleValueChange(valueField, Number(e.target.value))} /></TD>
                                    <TD>
                                        <Button onClick={() => handleSave(tabKey, subTabKey, editItem.currentData)}><FaSave /> 저장</Button>
                                    </TD>
                                </>
                            ) : (
                                <>
                                    <TD>{item.name}</TD>
                                    <TD>{`${Number(item[valueField] || 0).toLocaleString()}원`}</TD>
                                    <TD>
                                        <Button.Group>
                                            <Button onClick={() => handleEdit(tabKey, subTabKey, item)}><FaEdit /> 수정</Button>
                                            <Button.Danger onClick={() => handleDelete(tabKey, item)}><FaTrashAlt /> 삭제</Button.Danger>
                                        </Button.Group>
                                    </TD>
                                </>
                            )}
                        </TR>
                    ))}
                    <TR isAddForm>
                        <TD><Input placeholder="이름" value={newItem.name} onChange={e => setNewItem(p => ({ ...p, name: e.target.value }))}/></TD>
                        <TD>
                             <Input type="number" placeholder={valueHeader} value={isPartner || isCustomer ? newItem.discount : newItem.price} onChange={e => setNewItem(p => ({ ...p, [valueField]: e.target.value }))}/>
                        </TD>
                        <TD><Button onClick={() => handleAdd(tabKey)}><FaPlus /> 추가</Button></TD>
                    </TR>
                </TBody>
            </DataTable>
        )
    };
    
    const isLoading = screenTypesLoading || customerTypesLoading || cardCompaniesLoading || banksLoading;

    return (
        <>
            <GlobalStyle />
            <Navbar underline={true} />
            <Container>
                <Title>가격 정책 관리</Title>
                <TabButtons>
                    <Tab active={activeTab === 'screen'} onClick={() => setActiveTab('screen')}>상영유형별 가격</Tab>
                    <Tab active={activeTab === 'customer'} onClick={() => setActiveTab('customer')}>고객유형별 할인</Tab>
                    <Tab active={activeTab === 'partner'} onClick={() => setActiveTab('partner')}>제휴사별 할인</Tab>
                </TabButtons>
                <ContentWrapper>
                    {isLoading ? <div>로딩 중...</div> : (
                        <>
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
                        </>
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
