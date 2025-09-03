import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ContractStatus = "IN_PROGRESS" | "COMPLETED";
type UserRole = "lender" | "borrower";

interface ContractItem {
  id: number;
  title: string;        // 계약/상품 제목
  counterpart: string;  // 상대방 이름
  role: UserRole;       // 내 역할
  startedAt: string;    // 생성일
  updatedAt: string;    // 최근 업데이트
  status: ContractStatus;
}

interface MyContractModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DUMMY_CONTRACTS: ContractItem[] = [
  { id: 1, title: "캠핑 텐트 대여", counterpart: "김민수", role: "lender", startedAt: "2025-08-10", updatedAt: "2025-08-28", status: "IN_PROGRESS" },
  { id: 2, title: "빔프로젝터 대여", counterpart: "Lee David", role: "borrower", startedAt: "2025-07-02", updatedAt: "2025-07-30", status: "COMPLETED" },
  { id: 3, title: "전동킥보드", counterpart: "박서윤", role: "lender", startedAt: "2025-08-20", updatedAt: "2025-09-01", status: "IN_PROGRESS" },
  { id: 4, title: "DSLR 카메라", counterpart: "Yamada", role: "borrower", startedAt: "2025-06-10", updatedAt: "2025-06-25", status: "COMPLETED" },
  { id: 5, title: "보드게임 세트", counterpart: "정지원", role: "lender", startedAt: "2025-08-01", updatedAt: "2025-08-21", status: "IN_PROGRESS" },
  { id: 6, title: "스탠딩 데스크", counterpart: "Chen", role: "borrower", startedAt: "2025-05-18", updatedAt: "2025-05-28", status: "COMPLETED" },
];

const tabs = [
  { key: "ALL", label: "전체" },
  { key: "IN_PROGRESS", label: "진행중" },
  { key: "COMPLETED", label: "완료" },
] as const;

type TabKey = typeof tabs[number]["key"];

export default function MyContractModal({ isOpen, onClose }: MyContractModalProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("ALL");
  const [query, setQuery] = useState("");

  // ESC로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  const counts = useMemo(() => {
    const inProgress = DUMMY_CONTRACTS.filter((c) => c.status === "IN_PROGRESS").length;
    const completed = DUMMY_CONTRACTS.filter((c) => c.status === "COMPLETED").length;
    return { all: DUMMY_CONTRACTS.length, inProgress, completed };
  }, []);

  const filtered = useMemo(() => {
    const base =
      activeTab === "ALL"
        ? DUMMY_CONTRACTS
        : DUMMY_CONTRACTS.filter((c) => c.status === activeTab);
    if (!query.trim()) return base;
    const q = query.trim().toLowerCase();
    return base.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.counterpart.toLowerCase().includes(q)
    );
  }, [activeTab, query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dimmed overlay */}
          <motion.div
            className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            <div
              className="w-full max-w-5xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div className="space-y-0.5">
                  <h3 className="text-2xl font-bold text-gray-900">내 계약</h3>
                  <p className="text-sm text-gray-500">
                    진행중 · 완료된 계약을 한 곳에서 확인하세요
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg px-3 py-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                  aria-label="닫기"
                  title="닫기"
                >
                  ✕
                </button>
              </div>

              {/* Tabs & Search */}
              <div className="flex flex-col gap-4 px-6 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1">
                    {tabs.map((t) => {
                      const isActive = activeTab === t.key;
                      const count =
                        t.key === "ALL"
                          ? counts.all
                          : t.key === "IN_PROGRESS"
                          ? counts.inProgress
                          : counts.completed;
                      return (
                        <button
                          key={t.key}
                          onClick={() => setActiveTab(t.key)}
                          className={[
                            "relative rounded-lg px-4 py-2 text-sm font-medium transition",
                            isActive
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-600 hover:text-gray-800",
                          ].join(" ")}
                        >
                          {t.label}
                          <span
                            className={[
                              "ml-2 rounded-full px-2 py-0.5 text-xs",
                              isActive
                                ? "bg-primary-100 text-white"
                                : "bg-gray-200 text-gray-600",
                            ].join(" ")}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative w-64">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="제목·상대방 검색"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none ring-primary-100/30 transition focus:ring-4"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      🔍
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="max-h-[70vh] overflow-y-auto px-6 pb-6 pt-4">
                {filtered.length === 0 ? (
                  <EmptyState />
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((c) => (
                      <ContractCard key={c.id} item={c} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ContractCard({ item }: { item: ContractItem }) {
  const statusStyle =
    item.status === "IN_PROGRESS"
      ? "bg-amber-100 text-amber-700"
      : "bg-emerald-100 text-emerald-700";

  const roleBadge =
    item.role === "lender"
      ? "bg-secondary-90 text-white"
      : "bg-primary-100 text-white";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle}`}>
          {item.status === "IN_PROGRESS" ? "진행중" : "완료"}
        </span>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${roleBadge}`}>
          {item.role === "lender" ? "대여자(판매자)" : "차용자(구매자)"}
        </span>
      </div>

      <h4 className="line-clamp-1 text-lg font-semibold text-gray-900">
        {item.title}
      </h4>
      <p className="mt-1 text-sm text-gray-600">상대방: {item.counterpart}</p>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
        <div className="rounded-lg bg-gray-50 px-3 py-2">
          시작일
          <div className="mt-0.5 font-medium text-gray-800">{item.startedAt}</div>
        </div>
        <div className="rounded-lg bg-gray-50 px-3 py-2">
          업데이트
          <div className="mt-0.5 font-medium text-gray-800">{item.updatedAt}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          className="flex-1 rounded-xl bg-secondary-90 px-3 py-2 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-secondary-80"
          // 퍼블리싱 단계: 아직 기능 없음
          onClick={() => {}}
        >
          계약서 확인
        </button>
        <button
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          onClick={() => {}}
        >
          상세
        </button>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
      <div className="mb-4 text-5xl">📄</div>
      <h3 className="text-xl font-bold text-gray-900">표시할 계약이 없어요</h3>
      <p className="mt-2 text-sm text-gray-500">
        진행중/완료 탭을 바꾸거나 검색어를 조정해보세요.
      </p>
    </div>
  );
}
