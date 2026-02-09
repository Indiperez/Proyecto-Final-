import type { ReactNode } from "react";

type ErrorMessageProps = {
  children: ReactNode;
};

export const ErrorMessage = ({ children }: ErrorMessageProps) => {
  return <div className="text-red-600 text-sm">{children}</div>;
};
