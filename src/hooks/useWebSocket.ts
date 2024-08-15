import { ConnectionStatus } from '@/constants';
import usePersistentCallback from '@/hooks/usePersistentCallback';
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

interface UseWebSocketParams {
  url: string;
  onMessage: (event: MessageEvent) => void;
  reconnectEnabled?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onError?: (event: Event) => void;
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
}

interface UseWebSocketReturn {
  connect: () => void;
  disconnect: () => void;
  sendMessage: (message: string) => void;
  status: ConnectionStatus
}

export const useWebSocket = ({
  url,
  onMessage,
  reconnectEnabled = true,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
  onError,
  onOpen,
  onClose,
}: UseWebSocketParams): UseWebSocketReturn => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.CLOSED)
  const attemptCount = useRef(0);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const clearReconnectTimeout = () => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }
  };

  const reconnect = () => {
    if (wsRef.current?.readyState !== ConnectionStatus.OPEN) {
      clearReconnectTimeout()
      if (reconnectEnabled && attemptCount.current < maxReconnectAttempts) {
        reconnectTimeout.current = setTimeout(() => {
          attemptCount.current++
          connect();
        }, reconnectInterval);
      }
    }
  }

  const connect = usePersistentCallback((): void => {
    attemptCount.current = 0
    clearReconnectTimeout()
    if (wsRef.current) {
      wsRef.current.close();
    }

    wsRef.current = new WebSocket(url);
    setConnectionStatus(ConnectionStatus.CONNECTING)

    wsRef.current.onopen = (event) => {
      flushSync(() => {
        setConnectionStatus(ConnectionStatus.OPEN)
      })
      attemptCount.current = 0
      if (onOpen) onOpen(event);
    };

    wsRef.current.onmessage = (event: WebSocketEventMap['message']) => {
      onMessage(event);
    };

    wsRef.current.onerror = (event) => {
      reconnect()
      if (onError) onError(event);
    };

    wsRef.current.onclose = (event) => {
      if (onClose) onClose(event);

      if (attemptCount.current >= maxReconnectAttempts) {
        console.error(`Maximum Attempts on Reconnection, Reconnecting times: ${maxReconnectAttempts - 1}`)
      }

      reconnect()
    };
  });

  const disconnect = usePersistentCallback((): void => {
    clearReconnectTimeout();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setConnectionStatus(ConnectionStatus.CLOSED)
    }
  });

  const sendMessage = usePersistentCallback((message: string): void => {
    if (connectionStatus === ConnectionStatus.OPEN) {
      wsRef.current?.send(message);
    } else {
      console.warn('WebSocket is not connected, unable to send message.');
    }
  });

  return {
    connect,
    disconnect,
    sendMessage,
    status: connectionStatus
  };
};
