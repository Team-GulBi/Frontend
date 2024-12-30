import { useState } from 'react';
import { LoginHeader } from '@/components/common/Header';
import { useProfileValidation } from '@/hooks/utils/useProfileValidation';

const OnboardingPage = () => {
  const [fields, setFields] = useState({
    nickname: '',
    phone: '',
    email: '',
    domain: '',
    address: '',
  });

  const { showError, validateProfile } = useProfileValidation(fields);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!validateProfile()) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <LoginHeader />
      <div className="flex w-full items-center gap-[10rem] p-[18rem] mt-8">
        <div className="flex w-full flex-col gap-[2rem]">
          <div className="flex flex-col gap-[0.5rem]">
            <span className="font-heavy text-large24 text-neutral-0">
              프로필
            </span>
            <span className="text-medium20 font-light text-neutral-0">
              회원님의 프로필을 작성해주세요
            </span>
          </div>
          <div className="flex flex-col gap-[1rem]">
            <div className="flex flex-col gap-[0.4rem]">
            <input
              name="nickname"
              value={fields.nickname}
              onChange={handleChange}
              placeholder="닉네임"
              className="w-1/3 rounded-xs border border-neutral-80 bg-primary-0 p-3 text-small16 text-neutral-0"
            />
            {showError.nicknameError && (
              <span className="text-xxsmall12 text-error">
                * 닉네임을 입력해 주세요.
              </span>
            )}
            </div>


            <div className="flex flex-col gap-[0.4rem]">
            <div className="flex items-center gap-[0.75rem]">
              <input
                name="email"
                value={fields.email}
                onChange={handleChange}
                placeholder="이메일 주소"
                className="w-1/3 rounded-xs border border-neutral-80 bg-primary-0 p-3 text-small16 text-neutral-0"
              />
              <span className="">@</span>
              <input
                name="domain"
                value={fields.domain}
                onChange={handleChange}
                placeholder="example.com"
                className="w-1/3 rounded-xs border border-neutral-80 bg-primary-0 p-3 text-small16 text-neutral-0"
              />
            </div>
            {showError.emailError && (
              <span className="text-xxsmall12 text-error">
                * 유효한 이메일 주소를 입력해 주세요.
              </span>
            )}
            </div>

            <div className="flex flex-col gap-[0.4rem]">
            <input 
              name="address"
              value={fields.address}
              onChange={handleChange}
              placeholder="주소"
              className="w-4/5 rounded-xs border border-neutral-80 bg-primary-0 p-3 text-small16 text-neutral-0"
            />
            {showError.addressError && (
              <span className="text-xxsmall12 text-error">
                * 주소를 입력해 주세요.
              </span>
            )}
            </div>
          </div>
          <a
            className="flex w-4/5 items-center justify-center rounded-xs border border-neutral-80 bg-secondary-dark px-5 py-2"
            href="/"
            onClick={handleSubmit}
          >
            <span className="text-small16 text-primary-0">회원가입 완료</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;