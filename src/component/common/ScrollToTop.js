import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation(); // 현재 경로 가져옴

  useEffect(() => {
    window.scrollTo(0, 0); // 페이지가 바뀔 때마다 최상단으로
  }, [pathname]); // 경로가 바뀔 때마다 실행

  return null; // 렌더링은 안함
};

export default ScrollToTop;
