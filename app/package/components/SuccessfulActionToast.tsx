import { useEffect, useMemo, useState } from "react";
import { useActionData, useFetchers } from "@remix-run/react";
import Toast from "./Toast";

const SuccessfulActionToast = ({
  message = "Successfully submitted action!",
}: {
  message?: string;
}) => {
  const data = useActionData();
  const fetchers = useFetchers();
  const [isOpen, setIsOpen] = useState(false);
  const [errReason, setErrReason] = useState("");
  const triggerSuccess = useMemo(
    () => data?.success || fetchers.some((f) => f.data?.success),
    [data, fetchers]
  );
  const triggerErrorReason = useMemo(() => {
    if (data?.success === false) return data.reason;
    else {
      const reason = fetchers.find((f) => f.data?.success === false)?.data
        ?.reason;
      if (reason) return reason;
      else return "";
    }
  }, [data, fetchers]);
  useEffect(() => {
    if (triggerSuccess) setIsOpen(true);
    else setErrReason(triggerErrorReason);
  }, [triggerSuccess, triggerErrorReason, setErrReason, setIsOpen]);
  return (
    <>
      <Toast
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        message={message}
      />
      <Toast
        isOpen={!!errReason}
        onClose={() => setErrReason("")}
        message={errReason}
        intent={"error"}
      />
    </>
  );
};

export default SuccessfulActionToast;
