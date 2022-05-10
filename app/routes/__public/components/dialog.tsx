import React, { useState } from "react";
import DefaultErrorBoundary from "~/package/components/DefaultErrorBoundary";
import Dialog from "~/package/components/Dialog";

const DialogPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <Dialog
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setTimeout(() => setIsOpen(true), 5000);
        }}
        title={"Title of Dialog"}
      />
    </>
  );
};

export const ErrorBoundary = DefaultErrorBoundary;

export default DialogPage;
