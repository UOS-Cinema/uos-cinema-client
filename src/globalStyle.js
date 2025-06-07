import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* Noto Sans KR 폰트 불러오기 */
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap');

  /* 기본적인 스타일 리셋 및 폰트 설정 */
  body {
    margin: 0;
    font-family: 'Noto Sans KR', sans-serif;
    background-color: #f8f9fa;
  }
`;

export default GlobalStyle;
