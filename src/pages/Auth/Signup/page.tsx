import { useState } from 'react';
import { LoginHeader } from '@/components/common/Header';
import { AllCheckbox, Checkbox } from '@/components/Auth/SignupCheckbox';
import { useCheckboxGroup } from '@/hooks/utils/useCheckboxGroup';
import { useSignupValidation } from '@/hooks/utils/useSignupValidation';

const SignupPage = () => {
  const { checkboxes, toggleAll, toggleCheckbox, allChecked } =
    useCheckboxGroup([
      { label: '[필수] 개인회원 약관에 동의', checked: false, required: true },
      {
        label: '[필수] 개인정보 수집 및 이용에 동의',
        checked: false,
        required: true,
      },
      {
        label: '[선택] 위치기반 서비스 이용약관에 동의',
        checked: false,
        required: false,
      },
    ]);

  const [fields, setFields] = useState({
    name: '',
    id: '',
    password: '',
    phone: '',
  });

  const { showError, validateCheckboxes } = useSignupValidation(
    checkboxes,
    fields,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!validateCheckboxes()) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <LoginHeader />
      <div className="flex w-full items-center justify-center gap-[10rem] px-[18rem]">
        <div className="mt-[3rem] flex w-1/2 flex-col gap-[1.5rem]">
          <div className="flex flex-col gap-[0.5rem]">
            <span className="font-heavy text-large24 text-neutral-0">
              회원가입
            </span>
            <span className="text-medium20 font-light text-neutral-0">
              Yajoba에 오신 것을 환영해요!
            </span>
          </div>
          <div className={`flex w-4/5 flex-col ${showError.nameError && showError.idError && showError.passwordError && showError.phoneError === true ? "gap-[0.1rem]" : "gap-[0.8rem]"}`}> 
          {/* 이름~전화번호 모두 에러뜨면 에러메시지 아래 gap을 0.1rem으로 줄이고, 나머지 경우에는 gap이 추가로 각각 적용되어있기 때문에 거기서 따로 에러메시지 위 gap을 0.3rem으로 컨트롤함(그럴경우 자동으로 아래 gap은 0.8rem 됨)->나중에 봐서 수정하든지 하면 좋을듯*/}
            <div className={`flex flex-col  ${showError.nameError === true ? "gap-[0.3rem]" : ""}`}>
              <input
                name="name"
                value={fields.name}
                onChange={handleChange}
                placeholder="이름을 입력해주세요"
                className="rounded-xs border border-neutral-80 bg-primary-0 p-1.5 text-small16 text-neutral-0 placeholder:text-sm"
              />
              {showError.nameError && (
                <span className="text-xxsmall12 text-error">
                  * 이름은 2자 이상이어야 합니다.
                </span>
              )}
            </div>

            <div className={`flex flex-col  ${showError.idError === true ? "gap-[0.3rem]" : ""}`}>
              <input
                name="id"
                value={fields.id}
                onChange={handleChange}
                placeholder="아이디를 입력해주세요"
                className="rounded-xs border border-neutral-80 bg-primary-0 p-1.5 text-small16 text-neutral-0 placeholder:text-sm"
              />
              {showError.idError && (
                <span className="text-xxsmall12 text-error">
                  * 아이디는 8자 이상이어야 합니다.
                </span>
              )}
            </div>

            <div className={`flex flex-col  ${showError.passwordError === true ? "gap-[0.3rem]" : ""}`}>
              <input
                name="password"
                value={fields.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력해주세요"
                className="rounded-xs border border-neutral-80 bg-primary-0 p-1.5 text-small16 text-neutral-0 placeholder:text-sm"
              />
              {showError.passwordError && (
                <span className="text-xxsmall12 text-error">
                  * 비밀번호는 영문과 숫자를 포함하여 8자 이상이어야 합니다.
                </span>
              )}
            </div>
            <div className={`flex flex-col  ${showError.phoneError === true ? "gap-[0.3rem]" : ""}`}>
            <input
              name="phone"
              type="tel"
              value={fields.phone}
              onChange={handleChange}
              placeholder="휴대폰 번호 입력 ('-' 제외 11자리 입력)"
              className=" rounded-xs border border-neutral-80 bg-primary-0 p-1.5 text-small16 text-neutral-0 placeholder:text-sm"
            />
            {showError.phoneError && (
              <span className="text-xxsmall12 text-error">
                * 전화번호는 11자리 숫자로 입력해 주세요.
              </span>
            )}
            </div>
          </div>
          <div className="flex flex-col gap-[1rem]">
            <AllCheckbox allChecked={allChecked} toggleAll={toggleAll} />
            <div className={`flex flex-col  ${showError.checkboxError === true ? "gap-[0.3rem]" : "gap-[0.5rem"}`}>
              {checkboxes.map((checkbox, index) => (
                <Checkbox
                  key={index}
                  labelText={checkbox.label}
                  checked={checkbox.checked}
                  onChange={() => toggleCheckbox(index)}
                />
              ))}
              {showError.checkboxError && (
                <span className="text-xxsmall12 text-error">
                  * 필수 항목에 동의해 주세요.
                </span>
              )}
            </div>
          </div>
          <div className="flex w-4/5 flex-col gap-3">
            <a
              className="flex w-full items-center justify-center rounded-xs border border-neutral-80 bg-secondary-dark p-2"
              href="/signup/profile"
              onClick={handleSignup}
            >
              <span className="text-small16 text-primary-0">회원가입</span>
            </a>
          </div>
        </div>
        <div className="flex w-1/3 flex-col gap-[2rem]">
          <div className="flex flex-col gap-[0.5rem]">
            <span className="font-heavy text-large24 text-neutral-0">
              로그인
            </span>
            <span className="text-medium20 font-light text-neutral-0">
              이미 가입하셨나요?
            </span>
          </div>
          <a
            className="justify-center rounded-xs bg-secondary-dark p-2 text-center text-primary-0"
            href="/login"
          >
            로그인 하러 가기
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;