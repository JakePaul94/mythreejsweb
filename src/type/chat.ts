export interface ChatProps {
  roomId: string;
  roomName?: string;
  onLeave: () => void;
}