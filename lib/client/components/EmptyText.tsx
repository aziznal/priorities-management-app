import { PropsWithChildren } from "react";

export const EmptyText: React.FC<PropsWithChildren> = ({ children }) => {
  return <p className="opacity-60">{children}</p>;
};
