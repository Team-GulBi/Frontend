import logo from '@/assets/images/logo.png';
import { Button } from '@/components/ui/button';
import { ReactComponent as Dropdown } from '@/assets/svgs/dropdown.svg';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useActiveLink } from '@/hooks/utils/useActiveLink';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const handleRedirect = (url: string) => {
  const isLoggedIn = Boolean(localStorage.getItem('token')); // 버튼 클릭시 token 유무로 로그인 상태 확인
  if (isLoggedIn) {
    window.location.href = url; // 로그인 상태면 해당 URL로 이동
  } else {
    window.location.href = '/login'; // 로그아웃 상태면 /login으로 이동
  }
};
export const HeaderWithSearch = () => {
  const isProductPage = useActiveLink('/product');
  const isChatPage = useActiveLink('/chat');
  const isMypage = useActiveLink('/profile');
  const [selectedFilter, setSelectedFilter] = useState('상품명');

  const navigate = useNavigate();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const keyword = e.currentTarget.value.trim();
      // 필터링 된 값 추후에 쿼리로 보낼 예정
      if (keyword) {
        navigate('/search');
      }
    }
  };

  return (
    <div className="bg-static-100 fixed top-0 z-30 w-screen border-b border-neutral-80 bg-primary-0 px-10 shadow-[2px_0px_2px_1px_rgba(0,0,0,0.05)]">
      <div className="flex h-[4.8rem] items-center justify-between">
        <div className="flex items-center gap-[2rem]">
          <a className="h-[2.2rem] w-full" href="/">
            <img className="h-full" src={logo} alt="야줘바 로고" />
          </a>

          <div className="flex items-center gap-[20px]">
            <div className="mt-2 flex items-center gap-1 rounded-sm border border-neutral-75 px-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 19 19"
                fill="none"
              >
                <path
                  d="M12.3333 12.3333L18 18M7.61111 14.2222C3.9599 14.2222 1 11.2623 1 7.61111C1 3.9599 3.9599 1 7.61111 1C11.2623 1 14.2222 3.9599 14.2222 7.61111C14.2222 11.2623 11.2623 14.2222 7.61111 14.2222Z"
                  stroke="black"
                  stroke-opacity="0.5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <input
                type="text"
                placeholder="원하시는 상품을 입력해주세요"
                className="h-1/2 w-[33rem] border-none px-3 py-[12px] text-small17 text-neutral-10 placeholder-neutral-50 outline-none"
                onKeyDown={handleKeyDown}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="mt-2 flex h-full min-w-[110px] items-center justify-between rounded-sm border border-neutral-75 bg-white py-[12px] text-medium20 text-neutral-30">
                  <span>{selectedFilter}</span>
                  <Dropdown className="self-center pt-[3px]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white py-2 text-medium18 font-medium text-neutral-40">
                <DropdownMenuItem onClick={() => setSelectedFilter('상품명')}>
                  상품명
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter('카테고리')}>
                  카테고리
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedFilter('장소')}>
                  장소
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center justify-center gap-[1.75rem]">
          <a
            className={`flex cursor-pointer items-center gap-2 text-medium18 font-semibold ${isProductPage ? 'text-primary-dark' : 'text-neutral-10'}`}
            onClick={() => handleRedirect('/product')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              className={`${isProductPage ? 'stroke-primary-dark' : 'stroke-neutral-10'} `}
            >
              <path
                d="M6 10H10M10 10H14M10 10V14M10 10V6M10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="mt-0.5 flex">상품 등록하기</span>
          </a>

          <a
            className={`flex cursor-pointer items-center gap-2 text-medium18 font-semibold ${isChatPage ? 'text-primary-dark' : 'text-neutral-10'}`}
            onClick={() => handleRedirect('/chat')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              className={`${isChatPage ? 'stroke-primary-dark' : 'stroke-neutral-10'}`}
            >
              <path
                d="M5.50977 17.8018C6.83126 18.5639 8.36453 19 9.99964 19C14.9702 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 11.6351 1.43604 13.1684 2.19819 14.4899L2.20114 14.495C2.27448 14.6221 2.31146 14.6863 2.32821 14.7469C2.34401 14.804 2.34842 14.8554 2.34437 14.9146C2.34003 14.9781 2.3186 15.044 2.27468 15.1758L1.50586 17.4823L1.50489 17.4853C1.34268 17.9719 1.26157 18.2152 1.31938 18.3774C1.36979 18.5187 1.48169 18.6303 1.62305 18.6807C1.78482 18.7384 2.02705 18.6577 2.51155 18.4962L2.51758 18.4939L4.82405 17.7251C4.95537 17.6813 5.02214 17.6591 5.08559 17.6548C5.14475 17.6507 5.19578 17.6561 5.25293 17.6719C5.31368 17.6887 5.37783 17.7257 5.50563 17.7994L5.50977 17.8018Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="mt-0.5 flex">채팅방</span>
          </a>

          <a
            className={`flex cursor-pointer items-center gap-2 text-medium18 font-semibold ${isMypage ? 'text-primary-dark' : 'text-neutral-10'}`}
            onClick={() => handleRedirect('/profile')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="18"
              viewBox="0 0 16 20"
              fill="none"
              className={`${isMypage ? 'stroke-primary-dark' : 'stroke-neutral-10'}`}
            >
              <path
                d="M15 19C15 15.134 11.866 12 8 12C4.13401 12 1 15.134 1 19M8 9C5.79086 9 4 7.20914 4 5C4 2.79086 5.79086 1 8 1C10.2091 1 12 2.79086 12 5C12 7.20914 10.2091 9 8 9Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="mt-0.5 flex">마이페이지</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export const HeaderWithoutSearch = () => {
  const isProductPage = useActiveLink('/product');
  const isChatPage = useActiveLink('/chat');
  const isMypage = useActiveLink('/profile');

  return (
    <div className="bg-static-100 fixed top-0 z-30 w-screen border-b border-neutral-80 bg-primary-0 px-10 shadow-[2px_0px_2px_1px_rgba(0,0,0,0.05)]">
      <div className="flex h-[4.85rem] items-center justify-between">
        <div className="flex items-center gap-4">
          <a className="h-[2.2rem] w-full" href="/">
            <img className="h-full" src={logo} alt="야줘바 로고" />
          </a>
        </div>
        <div className="flex items-center justify-center gap-[1.75rem]">
          <a
            className={`flex cursor-pointer items-center gap-2 text-medium18 font-semibold ${isProductPage ? 'text-primary-dark' : 'text-neutral-10'}`}
            onClick={() => handleRedirect('/product')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              className={`${isProductPage ? 'stroke-primary-dark' : 'stroke-neutral-10'} `}
            >
              <path
                d="M6 10H10M10 10H14M10 10V14M10 10V6M10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="mt-0.5 flex">상품 등록하기</span>
          </a>

          <a
            className={`flex cursor-pointer items-center gap-2 text-medium18 font-semibold ${isChatPage ? 'text-primary-dark' : 'text-neutral-10'}`}
            onClick={() => handleRedirect('/chat')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              className={`${isChatPage ? 'stroke-primary-dark' : 'stroke-neutral-10'}`}
            >
              <path
                d="M5.50977 17.8018C6.83126 18.5639 8.36453 19 9.99964 19C14.9702 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 11.6351 1.43604 13.1684 2.19819 14.4899L2.20114 14.495C2.27448 14.6221 2.31146 14.6863 2.32821 14.7469C2.34401 14.804 2.34842 14.8554 2.34437 14.9146C2.34003 14.9781 2.3186 15.044 2.27468 15.1758L1.50586 17.4823L1.50489 17.4853C1.34268 17.9719 1.26157 18.2152 1.31938 18.3774C1.36979 18.5187 1.48169 18.6303 1.62305 18.6807C1.78482 18.7384 2.02705 18.6577 2.51155 18.4962L2.51758 18.4939L4.82405 17.7251C4.95537 17.6813 5.02214 17.6591 5.08559 17.6548C5.14475 17.6507 5.19578 17.6561 5.25293 17.6719C5.31368 17.6887 5.37783 17.7257 5.50563 17.7994L5.50977 17.8018Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="mt-0.5 flex">채팅방</span>
          </a>

          <a
            className={`flex cursor-pointer items-center gap-2 text-medium18 font-semibold ${isMypage ? 'text-primary-dark' : 'text-neutral-10'}`}
            onClick={() => handleRedirect('/profile')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="18"
              viewBox="0 0 16 20"
              fill="none"
              className={`${isMypage ? 'stroke-primary-dark' : 'stroke-neutral-10'}`}
            >
              <path
                d="M15 19C15 15.134 11.866 12 8 12C4.13401 12 1 15.134 1 19M8 9C5.79086 9 4 7.20914 4 5C4 2.79086 5.79086 1 8 1C10.2091 1 12 2.79086 12 5C12 7.20914 10.2091 9 8 9Z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="mt-0.5 flex">마이페이지</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export const LoginHeader = () => {
  return (
    <div className="bg-static-100 fixed top-0 z-30 w-screen border-b border-neutral-80 bg-primary-0 px-10 shadow-[2px_0px_2px_1px_rgba(0,0,0,0.05)]">
      <div className="flex h-[4.85rem] items-center justify-between">
        <div className="flex items-center gap-4">
          <a className="h-[2.2rem] w-full" href="/">
            <img className="h-full" src={logo} alt="야줘바 로고" />
          </a>
        </div>

        <div className="flex items-center justify-center gap-[2.5rem]">
          <a
            className="flex cursor-pointer items-center gap-2 text-medium18 font-semibold text-neutral-10"
            href="/login"
          >
            로그인
          </a>
          <a
            className="flex cursor-pointer items-center gap-2 text-medium18 font-semibold text-neutral-10"
            href="/signup"
          >
            회원가입
          </a>
        </div>
      </div>
    </div>
  );
};
