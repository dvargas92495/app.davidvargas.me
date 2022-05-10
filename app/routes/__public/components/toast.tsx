import React, { useState, useRef, useEffect } from "react";
import Toast from "~/package/components/Toast";

const ToastPage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const timeoutRef = useRef(0);
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, [timeoutRef]);
  return (
    <>
      <Toast
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          timeoutRef.current = window.setTimeout(() => setIsOpen(true), 5000);
        }}
        message={"A toasty notification!"}
      />
    </>
  );
};

export default ToastPage;
