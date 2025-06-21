import React, { useState, createContext, useEffect } from 'react';

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
    // 1. 컴포넌트가 처음 로드될 때, 로컬 스토리지에서 사용자 정보를 가져와 초기 상태로 설정합니다.
    //    저장된 정보가 없으면 기본값(null)으로 설정됩니다.
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        try {
            return storedUser ? JSON.parse(storedUser) : { id: null, role: null };
        } catch (error) {
            console.error("로컬 스토리지에서 user 정보를 파싱하는 데 실패했습니다:", error);
            return { id: null, role: null };
        }
    });

    // 2. user 상태가 변경될 때마다 (로그인 또는 로그아웃 시)
    //    변경된 정보를 로컬 스토리지에 자동으로 저장하거나 삭제합니다.
    useEffect(() => {
        try {
            if (user && user.id) {
                // 사용자가 로그인 상태이면 로컬 스토리지에 저장
                localStorage.setItem('user', JSON.stringify(user));
            } else {
                // 사용자가 로그아웃 상태이면 로컬 스토리지에서 삭제
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.error("로컬 스토리지에 user 정보를 저장하는 데 실패했습니다:", error);
        }
    }, [user]); // user 상태가 바뀔 때마다 이 코드가 실행됩니다.

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;