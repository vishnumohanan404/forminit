import React from "react";

export const Footer = () => {
  return (
    <footer className="border-t fixed bottom-0 inset-x-0 bg-white">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} forminit. All rights reserved.
      </div>
    </footer>
  );
};
