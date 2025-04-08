import { useEffect, useState, useRef } from 'react';

export function useAuthToken() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('token'));
  const hasRefreshed = useRef(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!accessToken) return;

      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const exp = payload.exp * 1000; 
        const now = Date.now();
        const timeLeft = exp - now;

        console.log(`⏱ Token expires in ${Math.floor(timeLeft / 1000)}s`);

        if (timeLeft < 60 * 1000 && !hasRefreshed.current) {
          console.log('🔁 Token sắp hết hạn → gọi refresh...');
          const res = await fetch('https://localhost:7044/api/auth/refresh-token', {
            method: 'POST',
            credentials: 'include',
          });

          const data = await res.json();
          console.log('🧾 Server trả về:', data);

          if (data.code === 200 && data.data.token) {
            setAccessToken(data.data.token);
            localStorage.setItem('token', data.data.token);
            hasRefreshed.current = true;
            console.log('✅ Token đã được refresh!');
          } else {
            console.warn('❌ Refresh thất bại:', data.message);
          }
        }

        if (timeLeft > 60 * 1000) {
          hasRefreshed.current = false;
        }

      } catch (err) {
        console.error('Lỗi khi kiểm tra / refresh token:', err);
      }
    }, 30 * 1000); 

    return () => clearInterval(interval);
  }, [accessToken]);

  return { accessToken, setAccessToken };
}
