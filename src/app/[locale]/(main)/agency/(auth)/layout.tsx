import React from "react";

type Props = {
  children: React.ReactNode;
};

/**
 * Layout component for the authorization pages
 * @component
 * @version 1.0.0
 *
 * @param {React.ReactNode} children - The children to render
 * @returns The layout component
 */
const AuthLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
};

export default AuthLayout;
