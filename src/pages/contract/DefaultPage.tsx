import { HeaderWithoutSearch } from "@/components/common/Header";
import { ContractInput } from "./components/ContractInput";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProductTemplate,
  postBorrowerApplication,
  ProductTemplateDTO,
} from "@/apis/contract";

type ReservationData = {
  productId: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

function readReservation(): ReservationData | null {
  try {
    const raw = localStorage.getItem("reservation");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed?.productId === "number" &&
      typeof parsed?.startDate === "string" &&
      typeof parsed?.startTime === "string" &&
      typeof parsed?.endDate === "string" &&
      typeof parsed?.endTime === "string"
    ) {
      return parsed as ReservationData;
    }
    return null;
  } catch {
    return null;
  }
}

function toApiDateTime(date: string, time: string) {
  const [hh, mm] = time.split(":");
  const safeHH = hh?.padStart(2, "0") ?? "00";
  const safeMM = mm?.padStart(2, "0") ?? "00";
  return `${date}T${safeHH}:${safeMM}:00`;
}

export default function DefaultContractPage() {
  const navigate = useNavigate();
  const { productId: productIdParam } = useParams();
  const productIdFromUrl = productIdParam ? Number(productIdParam) : undefined;

  const [isChecked, setIsChecked] = useState(false);
  const [template, setTemplate] = useState<ProductTemplateDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const reservation = useMemo(() => readReservation(), []);
  const productId = productIdFromUrl ?? reservation?.productId;

  const startDateTime = useMemo(
    () =>
      reservation
        ? toApiDateTime(reservation.startDate, reservation.startTime)
        : "",
    [reservation]
  );
  const endDateTime = useMemo(
    () =>
      reservation
        ? toApiDateTime(reservation.endDate, reservation.endTime)
        : "",
    [reservation]
  );

  useEffect(() => {
    (async () => {
      if (!productId) {
        setLoading(false);
        alert("예약 정보가 없습니다. 상품 상세에서 다시 예약을 진행해 주세요.");
        navigate(-1);
        return;
      }
      try {
        const res = await getProductTemplate(productId);
        setTemplate(res.data);
      } catch (e) {
        console.error("템플릿 조회 실패:", e);
        alert("계약 템플릿을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [productId, navigate]);

  const handleCompleteClick = async () => {
    if (!reservation || !productId) {
      alert("예약 정보가 없습니다. 상품 상세에서 다시 예약을 진행해 주세요.");
      return;
    }
    if (
      reservation.startDate === reservation.endDate &&
      reservation.startTime === reservation.endTime
    ) {
      alert("시작과 종료가 같으면 예약할 수 없습니다.");
      return;
    }
    if (!isChecked) {
      alert("계약 내용에 동의해 주세요.");
      return;
    }

    try {
      await postBorrowerApplication({
        productId,
        startDate: startDateTime,
        endDate: endDateTime,
      });
      localStorage.removeItem("reservation");
      alert("예약(동의)이 완료되었습니다.");
      navigate(`/product/${productId}`);
    } catch (error) {
      console.error("예약 처리 중 오류:", error);
      alert("예약 처리 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center w-screen h-screen">
      <div className="fixed top-0 left-0 w-full h-screen bg-cover" />
      <div className="relative flex -ml-[100%]">
        <HeaderWithoutSearch />
      </div>

      <div className="flex flex-col w-[65%] h-[83.7%] justify-end items-center font-extrabold">
        <div
          className="flex w-full max-w-[82%] max-h-[84%] overflow-y-auto overflow-x-hidden rounded-[27.42px] transform transition duration-170 hover:scale-[1.01] z-0 p-10"
          style={{ boxShadow: "0px 3.8px 10.5px 0 rgba(0,0,0,0.35)" }}
        >
          {loading ? (
            <div className="flex w-full min-h-[84%] items-center justify-center">
              템플릿을 불러오는 중...
            </div>
          ) : (
            <ContractInput template={template} startDate={startDateTime} endDate={endDateTime} />
          )}
        </div>
      </div>

      <div className="flex flex-col items-center justify-start pt-4 z-50 h-[16.3%]">
        <label className="flex items-center cursor-pointer">
          <span className="text-lg hover:scale-[101%]">계약서의 내용을 동의하시겠습니까?</span>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="w-5 h-5 ml-2 border-2 border-gray-400 rounded-lg text-[#357fff] hover:scale-[105%] cursor-pointer"
          />
        </label>
        {isChecked && (
          <button
            className="mt-4 px-6 py-2 bg-[#357fff] text-white rounded-lg hover:scale-[105%]"
            onClick={handleCompleteClick}
          >
            <span className="text-[17px]">예약(동의) 완료</span>
          </button>
        )}
      </div>
    </div>
  );
}
