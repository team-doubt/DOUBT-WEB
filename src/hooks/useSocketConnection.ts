import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "../stores/chatStore";

// 소켓 연결을 관리하는 커스텀 훅
export const useSocketConnection = () => {
  useEffect(() => {
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, []);
};
