import { useState } from 'react';
import { useGetProductCalendar } from '@/hooks/queries/useGetProductCalendar';
import { useGetProductDate } from '@/hooks/queries/useGetProductDate';
import { useNavigate } from 'react-router-dom';
import XIcon from '@/assets/svgs/XIcon.svg';

interface ReserveModalProps {
  productId: number;
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
  onClose: () => void;
}

export const ReserveModal = ({
  productId,
  onClose,
  selectedDate: initialSelectedDate,
  onSelectDate,
}: ReserveModalProps) => {
  const navigate = useNavigate();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    initialSelectedDate ?? undefined,
  );

  const { data: calendarData } = useGetProductCalendar(
    productId,
    currentYear,
    currentMonth + 1,
  );

  const { data: dateData } = useGetProductDate(
    productId,
    selectedDate ? selectedDate.toISOString().split('T')[0] : '',
    !!selectedDate,
  );

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const dates: (Date | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      dates.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i, 12, 0, 0, 0);
      dates.push(date);
    }

    const totalCells = 42;
    while (dates.length < totalCells) {
      dates.push(null);
    }

    return dates;
  };

  const isSameDate = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const calendarDates = generateCalendar();

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onSelectDate?.(date);
  };

  const handleReserve = () => {
    if (!selectedDate) return;
    // 계약서 템플릿으로 이동
  };

  const handleContractClick = (applicationId: number) => {
    navigate(`/contract/${applicationId}`);
  };

  const sortedApplications =
    dateData?.data?.status?.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    ) || [];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="relative flex h-full max-h-[600px] w-full max-w-4xl overflow-hidden rounded-lg border bg-white shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-secondary-20"
        >
          <img src={XIcon} />
        </button>

        <div className="flex h-full w-1/2 flex-col bg-secondary-10 p-6">
          <div className="mb-6 flex w-full items-center justify-between">
            <button
              onClick={handlePrevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full text-secondary-80 transition-colors hover:bg-secondary-20"
            >
              &lt;
            </button>
            <div className="text-large22 font-semibold text-secondary-100">
              {currentYear}년 {currentMonth + 1}월
            </div>
            <button
              onClick={handleNextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full text-secondary-80 transition-colors hover:bg-secondary-20"
            >
              &gt;
            </button>
          </div>

          <div className="mb-2 grid w-full grid-cols-7 text-center text-small16 font-medium text-secondary-60">
            {daysOfWeek.map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid w-full grid-cols-7 overflow-hidden rounded-lg border border-secondary-30 bg-white text-center">
            {calendarDates.map((date, idx) => {
              const isToday = date && isSameDate(date, today);
              const isSelected =
                date && selectedDate && isSameDate(date, selectedDate);

              const dateStatus = date
                ? calendarData?.data?.status?.find(
                    (status: any) =>
                      status.reservationDate ===
                      date.toISOString().split('T')[0],
                  )
                : null;

              const dateApplications = date
                ? dateData?.data?.status?.filter((app) =>
                    app.startDate.startsWith(date.toISOString().split('T')[0]),
                  )
                : [];

              const hasReserving =
                dateStatus?.hasReserving ||
                dateApplications?.some((app) => app.status === 'RESERVING') ||
                false;
              const hasUsing =
                dateStatus?.hasReservingOrUsing ||
                dateApplications?.some(
                  (app) => app.status === 'USING' || app.status === 'REJECTED',
                ) ||
                false;

              const shouldShowIndicator =
                dateStatus?.hasReserving ||
                dateStatus?.hasReservingOrUsing ||
                (dateData &&
                  selectedDate &&
                  date &&
                  isSameDate(date, selectedDate) &&
                  (hasReserving || hasUsing));

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-center border-secondary-20 ${
                    idx % 7 !== 6 ? 'border-r' : ''
                  } ${idx < 35 ? 'border-b' : ''}`}
                >
                  {date ? (
                    <button
                      onClick={() => handleDateClick(date)}
                      className={`relative flex h-16 w-full items-center justify-center text-medium18 font-medium transition-all duration-200 ${
                        isSelected
                          ? 'bg-secondary-100 text-white shadow-lg'
                          : isToday
                            ? 'bg-secondary-20 text-secondary-80'
                            : 'text-secondary-80 hover:bg-secondary-20 hover:text-secondary-100'
                      }`}
                    >
                      <div
                        className={`text-xsmall12 absolute left-1 top-1 ${
                          isSelected ? 'text-white' : 'text-secondary-60'
                        }`}
                      >
                        {date.getDate()}
                      </div>

                      {shouldShowIndicator && (
                        <div className="absolute right-1 top-1 h-3 w-3 rounded-full border-2 border-white">
                          {hasUsing ? (
                            <div className="h-full w-full rounded-full bg-secondary-100"></div>
                          ) : hasReserving ? (
                            <div className="h-full w-full rounded-full bg-primary-100"></div>
                          ) : null}
                        </div>
                      )}
                    </button>
                  ) : (
                    <div className="h-16 w-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-1/2 overflow-y-auto bg-white p-8">
          <div className="mb-6">
            <h3 className="mb-2 text-large22 font-semibold text-secondary-100">
              {selectedDate
                ? `${selectedDate.getFullYear()}년 ${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일`
                : '날짜를 선택해주세요'}
            </h3>
            <div className="h-1 w-16 rounded-full bg-secondary-80"></div>
          </div>

          {selectedDate ? (
            <div className="space-y-6">
              <div className="rounded-lg border border-secondary-20 bg-secondary-10 p-4">
                <h4 className="mb-4 text-medium18 font-bold text-secondary-100">
                  예약 현황
                </h4>
                {sortedApplications.length > 0 ? (
                  <div className="space-y-3">
                    {sortedApplications.map((app, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-secondary-20 bg-white p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-small16 font-medium text-secondary-100">
                            {new Date(app.startDate).toLocaleTimeString(
                              'ko-KR',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              },
                            )}{' '}
                            -{' '}
                            {new Date(app.endDate).toLocaleTimeString('ko-KR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span
                            className={`rounded px-2 py-1 text-xsmall14 font-medium ${
                              app.status === 'USING'
                                ? 'bg-primary-100 text-white'
                                : app.status === 'RESERVING'
                                  ? 'bg-secondary-100 text-white'
                                  : app.status === 'REJECTED'
                                    ? 'bg-error text-white'
                                    : 'bg-secondary-50 text-white'
                            }`}
                          >
                            {app.status === 'USING'
                              ? '예약완료'
                              : app.status === 'RESERVING'
                                ? '예약중'
                                : app.status === 'REJECTED'
                                  ? '거절됨'
                                  : '사용완료'}
                          </span>
                        </div>

                        {dateData?.data?.owner === true &&
                          app.status === 'RESERVING' && (
                            <button
                              onClick={() =>
                                handleContractClick(app.applicationId)
                              }
                              className="text-small14 mt-3 w-full rounded-lg bg-neutral-0 px-4 py-2 font-medium text-white transition-colors hover:bg-black"
                            >
                              계약서 작성하기
                            </button>
                          )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center">
                    <span className="text-secondary-60">
                      해당 날짜에 예약이 없습니다.
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-8"></div>
          )}

          {dateData?.data?.owner === false && selectedDate && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleReserve}
                disabled={!selectedDate}
                className={`text-medium16 rounded-lg px-8 py-3 font-medium transition-colors ${
                  !selectedDate
                    ? 'cursor-not-allowed bg-secondary-30 text-secondary-60'
                    : 'bg-secondary-100 text-white hover:bg-secondary-90'
                }`}
              >
                예약하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
