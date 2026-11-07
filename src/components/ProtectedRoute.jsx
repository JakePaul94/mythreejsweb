import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, initializing } = useAuth();
  const location = useLocation();

  // Đang hỏi backend xem cookie phiên còn hiệu lực không: chưa vội đẩy đi đâu
  if (initializing) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        Đang tải...
      </div>
    );
  }

  // Chưa đăng nhập: quay về trang chủ (nơi có nút đăng nhập Google)
  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;