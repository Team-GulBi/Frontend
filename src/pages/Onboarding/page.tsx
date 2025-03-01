import { useRef, useState } from 'react';
import { ReactComponent as DefaultProfile } from '@/assets/svgs/defaultProfile.svg';
import { LoginHeader } from '@/components/common/Header';
import SignatureCanvas from 'react-signature-canvas';

const OnboardingPage = () => {
  const [introduction, setIntroduction] = useState<string>('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [sido, setSido] = useState<string>('');
  const [sigungu, setSigungu] = useState<string>('');
  const [bname, setBname] = useState<string>('');
  const [showError, setShowError] = useState<boolean>(false);

  const sigCanvas = useRef<SignatureCanvas>(null);

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setProfileImage(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'sido') setSido(value);
    else if (name === 'sigungu') setSigungu(value);
    else if (name === 'bname') setBname(value);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!sido || !sigungu || !bname || sigCanvas.current?.isEmpty()) {
      setShowError(true);
      e.preventDefault();
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <LoginHeader />
      <div className="mt-8 flex w-full items-center gap-[10rem] p-[18rem]">
        <div className="flex w-full flex-col gap-[2rem]">
          <div className="mt-6 flex flex-col gap-[0.5rem]">
            <span className="font-heavy text-large24 text-neutral-0">
              프로필
            </span>
            <span className="text-medium20 font-light text-neutral-0">
              회원님의 프로필을 작성해주세요
            </span>
          </div>
          <div className="flex gap-10">
            <div className="mt-3 flex flex-col items-center justify-start">
              <div className="flex h-[250px] max-h-[250px] w-[250px] max-w-[250px] items-center justify-center rounded-full border border-neutral-70">
                {profileImage ? (
                  <img
                    src={URL.createObjectURL(profileImage)}
                    alt="profile"
                    className="rounded-full object-cover"
                  />
                ) : (
                  <DefaultProfile
                    width="100"
                    height="102"
                    viewBox="0 0 18 20"
                    className="self-center text-neutral-0"
                  />
                )}
              </div>
              <label className="border-neutral-70 mb-2 mt-3 flex w-fit cursor-pointer items-center justify-center self-center rounded-[5px] border px-[14px] py-[6px] text-center">
                <span className="text-xsmall14 text-neutral-20">
                  프로필 이미지 업로드
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex flex-col gap-6 w-full">
              <div className="flex-col">
                <span className="text-medium18 text-neutral-0">소개글</span>
                <textarea
                  name="introduction"
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  className="mt-2 w-full resize-none rounded-xs border border-neutral-70 bg-primary-0 p-3 text-small16 text-neutral-0"
                />
              </div>

              <div className="flex-col w-full">
                <span className="mt-2 text-medium18 text-neutral-0">주소</span>
                <div className="mt-2 flex gap-2">
                  <input
                    name="sido"
                    value={sido}
                    onChange={handleChange}
                    placeholder="시/도"
                    className="rounded-xs border border-neutral-70 bg-primary-0 p-3 text-small16 text-neutral-0"
                  />
                  <input
                    name="sigungu"
                    value={sigungu}
                    onChange={handleChange}
                    placeholder="시/군/구"
                    className="rounded-xs border border-neutral-70 bg-primary-0 p-3 text-small16 text-neutral-0"
                  />
                  <input
                    name="bname"
                    value={bname}
                    onChange={handleChange}
                    placeholder="읍/면/동"
                    className="rounded-xs border border-neutral-70 bg-primary-0 p-3 text-small16 text-neutral-0"
                  />
                </div>

                {showError && (!sido || !sigungu || !bname) && (
                  <span className="mt-[0.4rem] text-xxsmall12 text-error">
                    * 시/도, 시/군/구, 읍/면/동을 모두 입력해 주세요.
                  </span>
                )}
              </div>

              <div className="mt-2 flex-col w-full">
                <span className="text-medium18 text-neutral-0">전자 서명</span>
                <button
                  onClick={clearSignature}
                  className="ml-3 text-xxsmall12 text-neutral-30 underline"
                >
                  서명 지우기
                </button>
                <div className="mt-2 w-full rounded-xs border border-neutral-70 bg-primary-0 p-3">
                  <SignatureCanvas
                    ref={sigCanvas}
                    penColor="black"
                    canvasProps={{
                      width: 730,
                      height: 120,
                      className: 'signatureCanvas',
                      style: { width: '100%' },
                    }}
                  />
                </div>
                {showError && sigCanvas.current?.isEmpty() && (
                  <span className="mt-[0.4rem] text-xxsmall12 text-error">
                    * 서명을 입력해 주세요.
                  </span>
                )}
              </div>
            </div>
          </div>
          <a
            className="flex w-full items-center justify-center rounded-xs border border-neutral-70 bg-secondary-dark px-5 py-[10px]"
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
