export const ProductLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="text-center">
        <div
          className="w-20 h-20 border-4 border-dashed rounded-full animate-spin border-[#002752] mx-auto"
        ></div>
        <p className="text-white mt-3">
          상품을 불러오고 있어요
        </p>
      </div>
    </div>
  );
};