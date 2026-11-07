export type UserRole = "client" | "owner";
export type MessageType = "text" | "image" | "file";

export interface UserDTO {
  id: string;
  email: string | null;
  name: string | null;
  picture: string | null;
  role: UserRole;
}

export interface RoomDTO {
  id: string;
  clientId: string;
  createdAt: string;
}

export interface JoinRoomResponseDTO {
  roomId: string;
  room: RoomDTO;
}

export interface MediaDTO {
  id: string;
  url: string;
  mimeType: string | null;
  fileName: string | null;
  size: number | null;
}

export interface MessageDTO {
  id: string;
  roomId: string;
  type: MessageType;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    picture: string | null;
    role: UserRole;
  };
  media?: MediaDTO | null;
}