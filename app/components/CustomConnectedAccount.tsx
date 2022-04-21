import { Dialog, Transition } from "@headlessui/react";
import { useUser } from "@clerk/remix";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Form, useActionData, useLocation } from "@remix-run/react";
import Button from "@dvargas92495/ui/components/Button";
import TextInput from "./TextInput";
import Toast from "./Toast";

const CustomConnectedAccount = ({
  svgSrc,
  name,
  fields = [],
}: {
  svgSrc: string;
  name: string;
  fields?: string[];
}) => {
  const { hash } = useLocation();
  const { user } = useUser();
  const actionData = useActionData();
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  useEffect(() => {
    if (actionData?.success) {
      setIsOpen(false);
      setToastMessage(`Successfully updated ${name}!`);
    }
  }, [actionData, name]);
  if (!user) return <></>;
  const accountData = user.publicMetadata[name] as {
    username: string;
    [k: string]: string;
  };
  const isAccountPage = hash === "#/account/connected-accounts";
  if (!isAccountPage) return <></>;
  const container = document.querySelector(".cl-main .cl-list-card div");
  if (!container) return <></>;
  return ReactDOM.createPortal(
    <>
      <button
        className="cl-list-item tdcLsvPUy6va12fjbWeoaA== lDcSm5zthgXvDREoOppm+A== YQaXxv5CXpWrIgz9wCpq2g=="
        onClick={() => setIsOpen(true)}
      >
        <div className="+UDTovkDwHUg+nhZxGd0rQ== ydTkYqSHdXIQOM237Tl+rw==">
          <div className="xFJ5rpwkVmYhgKY1beHGww==">
            <div>
              <img
                alt={`${name} Account`}
                src={svgSrc}
                className="cl-left-icon-wrapper"
              />
              {!accountData?.username ? (
                <>Connect {name} account</>
              ) : (
                <>
                  {accountData.username}
                  <span className="xIfe81g7bxnYh7II+U+INQ== PHUYG8tgJCvzTS4RQKgF0A== owokVE4af9Dx8YVVeVBhCg== cl-tag">
                    Verified
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="FGGy9tUNWYQHk9j-GFOTcA==">
            <svg
              width="1.25em"
              height="1.25em"
              viewBox="0 0 20 20"
              stroke="currentColor"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="BDtAtmtXoCNTIj5cJWZplQ=="
            >
              <path
                d="M3.333 10h13.332M11.666 5l5 5-5 5"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </button>
      <Transition show={isOpen} appear>
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          as={"div"}
          className={"fixed inset-0 z-10 overflow-y-auto"}
        >
          <div className="min-h-screen px-4 text-center flex justify-center items-center">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-50" />
            </Transition.Child>
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-96 max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Connect {name} Account
                </Dialog.Title>
                <Form method={"put"}>
                  <TextInput
                    name={"account"}
                    defaultValue={name}
                    className="invisible h-0"
                  />
                  <TextInput
                    label={"Username"}
                    name={"username"}
                    defaultValue={accountData?.username || ""}
                  />
                  {fields.map((f) => {
                    const fieldName = f
                      .split(" ")
                      .map((k) => k.toLowerCase())
                      .map((s, i) =>
                        i === 0
                          ? s
                          : `${s.slice(0, 1).toUpperCase()}${s.slice(1)}`
                      )
                      .join("");
                    return (
                      <TextInput
                        key={f}
                        label={f}
                        name={fieldName}
                        defaultValue={accountData?.[fieldName] || ""}
                      />
                    );
                  })}

                  <Button>Save</Button>
                </Form>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      <Toast
        isOpen={!!toastMessage}
        onClose={() => setToastMessage("")}
        message={toastMessage}
        intent="success"
      />
    </>,
    container
  );
};

export default CustomConnectedAccount;
