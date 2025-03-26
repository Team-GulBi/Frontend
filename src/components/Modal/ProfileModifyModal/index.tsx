import { ReactComponent as DefaultProfile } from '@/assets/svgs/defaultProfile.svg';
import { useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { usePatchProfile, usePatchProfileImage, usePatchProfileSignature } from '@/hooks/mutations';
import { useGetProfile } from '@/hooks/queries';
import { ReactComponent as XIcon } from "@/assets/svgs/XIcon.svg";

type ModalProps = {
  setIsModalOpen: (isOpen: boolean) => void;
  userId: number;
};

export const ProfileModifyModal = ({ setIsModalOpen, userId }: ModalProps) => {
  const { data: profileData, isLoading } = useGetProfile(userId);
  const { mutate: updateProfileSignature } = usePatchProfileSignature();
  const { mutate: updateProfileImage } = usePatchProfileImage();
  const { mutate: updateProfile } = usePatchProfile();

  const [nickname, setNickname] = useState<string>('');
  const [intro, setIntro] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [signature, setSignature] = useState<string | null>(null);
  const [sido, setSido] = useState<string>('');
  const [sigungu, setSigungu] = useState<string>('');
  const [bname, setBname] = useState<string>('');
  const [profileImage, setProfileImage] = useState<File | string | null>(null);

  const sigCanvas = useRef<SignatureCanvas>(null);

  useEffect(() => {
    if (profileData) {
      setNickname("지니핑");
      setProfileImage(profileData.image);
      setIntro(profileData.intro);
      setPhone(profileData.phone);
      setSido(profileData.sido);
      setSigungu(profileData.sigungu);
      setBname(profileData.bname);

      if (profileData.signature) {
        setSignature(profileData.signature);
      }
    }
  }, [profileData]);

  useEffect(() => {
    if (signature && sigCanvas.current) {
      const canvas = sigCanvas.current.getCanvas();
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const img = new Image();
        img.src = signature;
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
      }
    }
  }, [signature]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) {
      setProfileImage(file);
    }
  };

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };
  
  const handleSubmit = () => {
    if (!nickname || !intro || !phone || !sido || !sigungu || !bname) {
      return;
    }

    const signatureData = sigCanvas.current?.toDataURL("image/png");
    
    if (signatureData) {
      fetch(signatureData)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], "signature.png", { type: "image/png" });
          updateProfileSignature(file, {
            onSuccess: () => console.log("서명 업데이트 완료"),
          });
        });
    }

    if (profileImage && typeof profileImage !== "string") {
      updateProfileImage(profileImage, {
        onSuccess: () => console.log("프로필 이미지 업데이트 완료"),
      });
    }

    updateProfile(
      { intro, phone, sido, sigungu, bname },
      {
        onSuccess: () => {
          setIsModalOpen(false);
        },
        onError: (error) => {
          console.error(error);
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 mt-20 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="flex flex-col max-h-[640px] w-[600px] rounded-[12px] bg-white px-[30px] py-[30px] shadow-lg">
        <div className='flex items-center justify-between mb-4'>
          <p className='text-large22 text-neutral-10 font-bold'>프로필 수정하기</p>
          <XIcon onClick={() => setIsModalOpen(false)} />
        </div>
        <div className="flex px-[10px]">
          <div className="mr-10 flex flex-col">
            <div className="flex self-center h-[120px] max-h-[120px] w-[120px] max-w-[120px] rounded-full border shadow-md">
              {profileImage ? (
                typeof profileImage === 'string' ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="rounded-full object-cover"
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(profileImage)}
                    alt="Profile"
                    className="rounded-full object-cover"
                  />
                )
              ) : (
                <DefaultProfile
                  width="80"
                  height="82"
                  viewBox="0 0 18 20"
                  className="m-[40px] self-center text-neutral-0"
                />
              )}
            </div>
            <label className="border-grayscale-70 mt-3 self-center mb-6 flex w-fit cursor-pointer hover:bg-neutral-90 rounded-[6px] border p-2 text-center">
              <span className="text-xxsmall12 text-neutral-20">
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

          <div className="flex flex-col gap-3">
            <div className="space-y-1">
              <label className="text-xsmall14 font-bold text-neutral-10">
                닉네임
              </label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="text-xxsmall12 w-full rounded-[6px] focus:ring focus:ring-primary-100 border bg-white p-[10px] font-regular text-neutral-10 outline-none"
              />
              <p className="text-xxsmall10 text-secondary-90 mt-[6px]">※ 닉네임은 2자 이상입니다</p>
            </div>

            <div className="space-y-1">
              <label className="text-xsmall14 font-bold text-neutral-10">
                전화번호
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-xxsmall12 w-full focus:ring focus:ring-primary-100 rounded-[6px] border bg-white p-[10px] font-regular text-neutral-10 outline-none"
              />
              <p className="text-xxsmall10 text-secondary-90 mt-[6px]">※ 전화번호는 -제외 11자리 숫자를 입력해주세요</p>
            </div>

            <div className='space-y-1'>
              <label className="text-sm font-bold text-neutral-10">위치</label>
              <div className="flex gap-2 mt-1">
                <input value={sido} onChange={(e) => setSido(e.target.value)}
                  className="w-1/3 text-xxsmall12 w-full focus:ring focus:ring-primary-100 rounded-[6px] border bg-white p-[10px] font-regular text-neutral-10 outline-none"
                />
                <input value={sigungu} onChange={(e) => setSigungu(e.target.value)}
                  className="w-1/3 text-xxsmall12 w-full focus:ring focus:ring-primary-100 rounded-[6px] border bg-white p-[10px] font-regular text-neutral-10 outline-none"
                />
                <input value={bname} onChange={(e) => setBname(e.target.value)}
                  className="w-1/3 text-xxsmall12 w-full focus:ring focus:ring-primary-100 rounded-[6px] border bg-white p-[10px] font-regular text-neutral-10 outline-none"
                />
              </div>
              <p className="text-xxsmall10 text-secondary-90 mt-[6px]">※ 시도, 시군구, 동을 다 입력해주세요</p>
            </div>


            <div className="mb-[20px] flex-col">
            <label className="text-xsmall14 font-bold text-neutral-10">
            전자 서명
          </label>
          <button
            onClick={clearSignature}
            className="ml-3 text-xxsmall12 text-neutral-30 underline"
          >
            서명 지우기
          </button>
          <div className="mt-2 w-full rounded-[6px] border">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{
                width: 400,
                height: 110,
                className: 'signatureCanvas',
                style: { width: "100%" },
              }}
            />
          </div>
        </div>
          </div>
        </div>

        <div
          className="text-medium16 w-full cursor-pointer rounded-[6px] bg-primary-100 p-2 text-center text-neutral-100"
          onClick={handleSubmit}
        >
          완료
        </div>
      </div>
    </div>
  );
};
