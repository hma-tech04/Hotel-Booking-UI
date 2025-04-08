import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/PaymentResult.css";
import axios from "axios";

function PaymentResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState({
    status: "",
    orderId: "",
    paymentId: "",
    amount: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSignatureValid, setIsSignatureValid] = useState(false); // Thêm state để kiểm tra chữ ký

  useEffect(() => {
    const verifyPaymentResult = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(location.search);
        const paymentStatus = queryParams.get("paymentStatus");
        const signature = queryParams.get("signature");
        const orderId = queryParams.get("orderId") || "";
        const paymentId = queryParams.get("paymentId") || "";
        const amount = queryParams.get("amount") || "";

        // Log dữ liệu từ backend qua URL
        console.log("Data from backend (URL params):", {
          paymentStatus,
          signature,
          orderId,
          paymentId,
          amount,
        });

        if (!paymentStatus || !signature) {
          throw new Error("Thiếu thông tin trạng thái thanh toán hoặc chữ ký.");
        }

        const response = await axios.post(
          "http://localhost:5053/api/vnpay/verify-signature",
          { data: paymentStatus, Signature: signature },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Log phản hồi từ API verify-signature
        console.log("Verify-signature response from backend:", response.data);

        if (response.data.code !== 200 || !response.data.data) {
          throw new Error("Chữ ký không hợp lệ.");
        }

        // Lưu trạng thái chữ ký
        setIsSignatureValid(response.data.data);

        const updatedPaymentInfo = {
          status: paymentStatus,
          orderId,
          paymentId,
          amount: amount ? (parseInt(amount) / 100).toFixed(2) : "",
        };
        setPaymentInfo(updatedPaymentInfo);
      } catch (err) {
        setError(err.message || "Đã xảy ra lỗi khi xử lý kết quả thanh toán.");
      } finally {
        setLoading(false);
      }
    };

    verifyPaymentResult();
  }, [location]);

  const handleReturnHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="payment-result-container">
        <h2>Đang xử lý kết quả thanh toán...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-result-container">
        <h2>Lỗi</h2>
        <p>{error}</p>
        <button className="return-button" onClick={handleReturnHome}>
          Về trang chủ
        </button>
      </div>
    );
  }

  // Logic hiển thị: dựa trên paymentStatus và chữ ký
  const isSuccess = paymentInfo.status === "Payment successfully";
  const isUnclear = isSignatureValid && paymentInfo.status === "Payment Failed";

  return (
    <div className="payment-result-container">
      <h2>Kết quả thanh toán</h2>
      <div
        className={`status-message ${
          isSuccess ? "success" : isUnclear ? "warning" : "failure"
        }`}
      >
        <span className="icon">{isSuccess ? "✓" : isUnclear ? "⚠" : "✗"}</span>
        <span className="text">
          {isSuccess
            ? "Thanh toán thành công!"
            : isUnclear
            ? "Kết quả không rõ ràng, vui lòng kiểm tra lại trạng thái giao dịch"
            : "Thanh toán thất bại"}
        </span>
      </div>
      {paymentInfo.orderId && (
        <p>
          <strong>Mã đặt phòng:</strong> {paymentInfo.orderId}
        </p>
      )}
      {paymentInfo.paymentId && (
        <p>
          <strong>Mã thanh toán:</strong> {paymentInfo.paymentId}
        </p>
      )}
      {paymentInfo.amount && (
        <p>
          <strong>Số tiền:</strong> {paymentInfo.amount} VNĐ
        </p>
      )}
      <p>
        <strong>Trạng thái từ hệ thống:</strong> {paymentInfo.status}
      </p>
      {isUnclear && (
        <p className="note">
          Giao dịch có thể đã thành công, nhưng hệ thống báo thất bại. Vui lòng
          liên hệ hỗ trợ nếu cần.
        </p>
      )}
      <button className="return-button" onClick={handleReturnHome}>
        Về trang chủ
      </button>
    </div>
  );
}

export default PaymentResult;