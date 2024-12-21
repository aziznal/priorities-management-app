export type Priority = {
  id: string;
  body: string;
  order: number;
};

export type NewPriority = {
  body?: string;
};

export type UpdatedPriority = {
  body?: string;
};
