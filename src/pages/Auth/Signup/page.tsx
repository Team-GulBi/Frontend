import { useRef, useState } from 'react';
import { LoginHeader } from '@/components/common/Header';
import { AllCheckbox, Checkbox } from '@/components/Auth/SignupCheckbox';
import { useCheckboxGroup } from '@/hooks/utils/useCheckboxGroup';
import { useSignupValidation } from '@/hooks/utils/useSignupValidation';
import signup from '@/apis/signup';
import { useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';

const SignupPage = () => {
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    name: '',
    id: '',
    password: '',
    phone: '',
    signature: false,
  });

  const sigCanvas = useRef<SignatureCanvas>(null);
  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const isSigned = !(sigCanvas.current?.isEmpty() ?? true);

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

  const { showError, validateCheckboxes } = useSignupValidation(
    checkboxes,
    fields,
    isSigned,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.preventDefault();

    const isSigned = !(sigCanvas.current?.isEmpty() ?? true);
    setFields((prev) => ({ ...prev, signature: isSigned }));

    const valid = validateCheckboxes();
    if (!valid) return;

    try {
      const signatureData = sigCanvas.current?.toDataURL('image/png');
      if (!signatureData) return;

      const blob = await fetch(signatureData).then((res) => res.blob());
      const signatureFile = new File([blob], 'signature.png', {
        type: 'image/png',
      });

      const requestData = {
        nickname: fields.name,
        email: fields.id,
        password: fields.password,
        phoneNumber: fields.phone,
        signature: signatureFile,
      };

      await signup(requestData);
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패', error);
    }
  };

  return (
    <div className="min-h-screen flex w-screen">
      <LoginHeader />
      <div className="flex w-full items-center justify-center gap-[10rem] px-[18rem]">
        <div className="my-[8rem] flex flex-col gap-[1.5rem]">
          <div className="flex flex-col gap-[0.5rem]">
            <span className="text-xlarge28 font-semibold text-neutral-0">
              회원가입
            </span>
            <span className="text-large24 font-light text-neutral-0">
              Yajoba에 오신 것을 환영해요!
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <div
              className={`flex flex-col ${showError.nameError === true ? 'gap-1' : ''}`}
            >
              <span className="mb-1 text-medium18">이름</span>
              <input
                name="name"
                value={fields.name}
                onChange={handleChange}
                className="rounded-md border border-neutral-60 bg-secondary-0 p-2 text-small16 text-neutral-0 outline-none focus:border-secondary-100 focus:ring-0"
              />
              {showError.nameError && (
                <span className="text-xsmall14 text-error">
                  * 이름은 2자 이상이어야 합니다.
                </span>
              )}
            </div>

            <div
              className={`flex flex-col ${showError.idError === true ? 'gap-1' : ''}`}
            >
              <span className="mb-[6px] mt-3 text-medium18 text-neutral-0">
                아이디
              </span>
              <input
                name="id"
                value={fields.id}
                onChange={handleChange}
                className="rounded-md border border-neutral-60 bg-secondary-0 p-2 text-small16 text-neutral-0 outline-none focus:border-secondary-100 focus:ring-0"
              />
              {showError.idError && (
                <span className="text-xsmall14 text-error">
                  * 아이디는 8자 이상이어야 합니다.
                </span>
              )}
            </div>

            <div
              className={`flex flex-col ${showError.passwordError === true ? 'gap-1' : ''}`}
            >
              <span className="mb-[6px] mt-3 text-medium18 text-neutral-0">
                비밀번호
              </span>
              <input
                type="password"
                name="password"
                value={fields.password}
                onChange={handleChange}
                className="rounded-md border border-neutral-60 bg-secondary-0 p-2 text-small16 text-neutral-0 outline-none focus:border-secondary-100 focus:ring-0"
              />
              {showError.passwordError && (
                <span className="text-xsmall14 text-error">
                  * 비밀번호는 영문과 숫자를 포함하여 8자 이상이어야 합니다.
                </span>
              )}
            </div>
            <div
              className={`flex flex-col ${showError.phoneError === true ? 'gap-1' : ''}`}
            >
              <span className="mb-[6px] mt-3 text-medium18 text-neutral-0">
                전화번호 (- 제외 11자리 입력)
              </span>
              <input
                name="phone"
                type="tel"
                value={fields.phone}
                onChange={handleChange}
                className="rounded-md border border-neutral-60 bg-secondary-0 p-2 text-small16 text-neutral-0 outline-none focus:border-secondary-100 focus:ring-0"
              />
              {showError.phoneError && (
                <span className="text-xsmall14 text-error">
                  * 전화번호는 11자리 숫자로 입력해 주세요.
                </span>
              )}
            </div>

            <div
              className={`flex flex-col ${sigCanvas.current?.isEmpty() === true ? 'gap-1' : ''}`}
            >
              <div className="mb-[6px] mt-3 h-full w-full flex-col">
                <span className="text-medium18 text-neutral-0">전자 서명</span>
                <button
                  onClick={clearSignature}
                  className="ml-3 text-xsmall14 text-neutral-30 underline"
                >
                  서명 지우기
                </button>
                <div className="mt-2 w-full rounded-md border border-neutral-60 bg-secondary-0">
                  <SignatureCanvas
                    ref={sigCanvas}
                    penColor="black"
                    canvasProps={{
                      width: 300,
                      height: 100,
                      className: 'signatureCanvas',
                      style: { width: '100%' },
                    }}
                  />
                </div>
                {showError.signatureError && (
                  <span className="text-xsmall14 text-error">
                    * 서명을 입력해 주세요.
                  </span>
                )}
              </div>
            </div>
          </div>
          <div
            className={`flex flex-col ${showError.checkboxError === true ? 'gap-1' : ''}`}
          >
            <AllCheckbox allChecked={allChecked} toggleAll={toggleAll} />
            <div className="flex flex-col">
              {checkboxes.map((checkbox, index) => (
                <Checkbox
                  key={index}
                  labelText={checkbox.label}
                  checked={checkbox.checked}
                  onChange={() => toggleCheckbox(index)}
                />
              ))}
              {showError.checkboxError && (
                <span className="mt-[0.3rem] text-xsmall14 text-error">
                  * 필수 항목에 동의해 주세요.
                </span>
              )}
            </div>
          </div>
          <div className="flex w-full cursor-pointer flex-col gap-3">
            <a
              className="flex items-center justify-center rounded-lg border border-neutral-80 bg-secondary-100 p-2"
              href="/signup/profile"
              onClick={handleSignup}
            >
              <span className="text-medium20 text-secondary-0">회원가입</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
