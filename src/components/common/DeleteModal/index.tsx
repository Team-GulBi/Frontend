interface DeleteModalProps {
  title1: string;
  title2: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteModal = ({ title1, title2, onClose, onConfirm }: DeleteModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-[330px]">
        <p className="text-medium18 font-semibold mt-4 mb-1">정말로 {title1} 삭제하시겠습니까?</p>
        <p className="text-xsmall14 text-neutral-40 mb-4">삭제된 {title2} 복구할 수 없습니다.
            </p>
        <div className="flex justify-center gap-2">
          <button
            className="px-10 py-2 bg-neutral-80 text-xsmall14 rounded-md"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-8 py-2 bg-[#002752] text-xsmall14 text-white rounded-md"
            onClick={onConfirm}
          >
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
};