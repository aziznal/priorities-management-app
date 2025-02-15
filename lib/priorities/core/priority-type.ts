export type Priority = {
  id: string;
  body: string;
  order: number;
  createdAt: string;
};

export type NewPriority = {
  body?: string;
};

export type UpdatedPriority = {
  body?: string;
};
