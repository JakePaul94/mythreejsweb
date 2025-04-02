import React from 'react';

const MobileOnlyMessage = () => {
  return (
    <div className=" hidden md:flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 p-5">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full animate-fadeIn opacity-0 animate-fadeInActive">
        <div className="text-5xl mb-5">📱</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Nội dung chỉ xem được trên điện thoại
        </h1>
        <p className="text-gray-600 text-base mb-6 leading-relaxed">
          Vui lòng truy cập bằng thiết bị di động để trải nghiệm tốt nhất. Cảm ơn bạn!
        </p>
        <div className="mt-5">
         
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeInActive {
            animation: fadeIn 1s ease-in-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default MobileOnlyMessage;