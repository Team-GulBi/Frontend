import { useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import usePatchProfile from '@/hooks/mutations/usePatchProfile';
import { useGetProfile } from '@/hooks/queries';
import { ReactComponent as XIcon } from '@/assets/svgs/XIcon.svg';

type ModalProps = { setIsModalOpen: (isOpen: boolean) => void; userId: number };

export const ProfileModifyModal = ({ setIsModalOpen, userId }: ModalProps) => {
  const { data: profileData, isLoading } = useGetProfile(userId);
  const { mutateAsync: updateProfile, isPending } = usePatchProfile();

  const [phone, setPhone] = useState('');
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const sigRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    if (profileData) {
      setPhone(profileData.phone ?? '');
      setSignatureUrl(profileData.signature ?? null);
    }
  }, [profileData]);

  useEffect(() => {
    if (!signatureUrl || !sigRef.current) return;
    const canvas = sigRef.current.getCanvas();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = signatureUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width,
        h = canvas.height;
      const ratio = Math.min(w / img.width, h / img.height);
      const dw = img.width * ratio,
        dh = img.height * ratio;
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    };
  }, [signatureUrl]);

  const clearSignature = () => sigRef.current?.clear();

  const canvasToFile = (
    canvas: HTMLCanvasElement,
    filename: string,
  ): Promise<File> =>
    new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('toBlob failed'));
        resolve(new File([blob], filename, { type: blob.type || 'image/png' }));
      }, 'image/png');
    });

  const urlToFile = async (url: string, filename: string): Promise<File> => {
    const res = await fetch(url, { credentials: 'omit' });
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || 'image/png' });
  };

  const makeBlankPngFile = (): File => {
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    const url = c.toDataURL('image/png');
    const bin = atob(url.split(',')[1]);
    const u8 = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    return new File([u8], 'blank.png', { type: 'image/png' });
  };

  const handleSubmit = async () => {
    setErrorMsg(null);

    if (!/^\d{11}$/.test(phone)) {
      setErrorMsg('전화번호는 - 없이 11자리여야 합니다.');
      return;
    }
    if (!sigRef.current) return;

    if (sigRef.current.isEmpty()) {
      setErrorMsg('서명을 입력해주세요.');
      return;
    }

    let file: File | undefined;
    try {
      file = await canvasToFile(sigRef.current.getCanvas(), 'signature.png');
    } catch {
      file = undefined;
    }

    if (!file && signatureUrl) {
      try {
        file = await urlToFile(signatureUrl, 'signature.png');
      } catch {
        file = undefined;
      }
    }

    if (!file) file = makeBlankPngFile();

    try {
      await updateProfile({ profileId: userId, phone, file });
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      setErrorMsg('잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 mt-20 flex items-center justify-center bg-black/30">
      <div className="flex min-w-[300px] flex-col rounded-[12px] bg-white px-[30px] py-[30px] shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-large22 font-bold text-neutral-10">
            프로필 수정하기
          </p>
          <XIcon
            onClick={() => setIsModalOpen(false)}
            className="cursor-pointer"
          />
        </div>

        <div className="flex flex-col px-[10px]">
          <div className="flex-col space-y-1">
            <label className="text-xsmall14 font-bold text-neutral-10">
              전화번호
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="font-regular w-full rounded-[6px] border bg-white p-[10px] text-xxsmall12 text-neutral-10 outline-none focus:ring focus:ring-primary-100"
              inputMode="numeric"
              placeholder="01012345678"
            />
            <p className="mt-[6px] text-xxsmall10 text-neutral-40">
              ※ 전화번호는 -제외 11자리 숫자를 입력해주세요
            </p>
          </div>

          <div className="mb-4 mt-3">
            <div className="flex items-center">
              <span className="text-xsmall14 font-bold text-neutral-10">
                전자 서명
              </span>
              <button
                onClick={clearSignature}
                className="ml-3 text-xxsmall12 text-neutral-30 underline"
                type="button"
              >
                서명 지우기
              </button>
            </div>
            <div className="mt-2 w-full rounded-[6px] border">
              <SignatureCanvas
                ref={sigRef}
                penColor="black"
                canvasProps={{
                  width: 300,
                  height: 100,
                  className: 'signatureCanvas',
                  style: { width: '100%' },
                }}
              />
            </div>
          </div>

          {errorMsg && (
            <p className="mb-2 text-xxsmall12 text-red-500">{errorMsg}</p>
          )}

          <button
            className="text-medium16 w-full cursor-pointer rounded-[6px] bg-primary-100 p-2 text-center text-neutral-100 disabled:opacity-60"
            onClick={handleSubmit}
            disabled={isLoading || isPending}
            type="button"
          >
            {isPending ? '저장 중…' : '완료'}
          </button>
        </div>
      </div>
    </div>
  );
};
