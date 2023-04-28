export interface SessionPayload {
  userId: string;
  lastActivityTs: number;
  firstActivityTs: number;
  createdTs: number;
  status: SessionStatus;
}

export enum SessionStatus {
  Active = 'active',
  Blocked = 'blocked',
}
