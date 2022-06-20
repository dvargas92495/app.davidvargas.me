import React, { ChangeEvent, useState } from "react";
import { useMemo } from "react";
import { useTransition } from "@remix-run/react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

type Option = { id: string | number; label: string };

const AutoCompleteInput = ({
  name,
  disabled,
  options = [],
  label,
  className = "",
  labelClassName = "",
  inputClassname = "",
  optionsClassName = "",
  optionClassName = "",
  onChange,
  defaultValue = options[0]?.id,
}: {
  name?: string;
  disabled?: boolean;
  options?: Option[];
  label?: string;
  className?: string;
  labelClassName?: string;
  inputClassname?: string;
  optionsClassName?: string;
  optionClassName?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string | number;
}) => {
  const transition = useTransition();
  const loading = useMemo(() => transition.state !== "idle", [transition]);
  const [selectedOption, setSelectedOption] = useState(defaultValue);
  const labelById = useMemo(
    () => Object.fromEntries(options.map((o) => [o.id, o.label])),
    []
  );
  const [query, setQuery] = useState("");
  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.label
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );
  return (
    <div className={`mb-6 ${className}`}>
      <label
        htmlFor={name}
        className={`block mb-2 text-sm font-medium text-gray-900 ${labelClassName}`}
      >
        {label}
      </label>
      <Combobox
        onChange={(e) => {
          setSelectedOption(e);
        }}
        value={selectedOption}
        disabled={typeof disabled === "undefined" ? loading : disabled}
      >
        <input
          name={name}
          type={"hidden"}
          value={selectedOption}
          onChange={onChange}
        />
        <div
          className={`bg-gray-50 border border-gray-300 text-gray-900 cursor-default text-sm rounded-lg block w-full disabled:opacity-25 disabled:cursor-not-allowed shadow-md relative text-left ${inputClassname}`}
        >
          <Combobox.Input
            className={`block border-none bg-transparent py-2 pl-4 pr-10 w-full relative text-left focus:ring-0 ${inputClassname}`}
            displayValue={(id) => labelById[id as string]}
            onChange={(e) => {
              setQuery(e.target.value);
              e.stopPropagation();
            }}
            autoComplete={"off"}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer">
            <SelectorIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        <Transition
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className={"relative z-10"}
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options
            className={`rounded-md bg-white max-h-64 py-0.5 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none absolute left-0 right-0 overflow-scroll scrollbar-thin ${optionsClassName}`}
          >
            {filteredOptions.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <Combobox.Option
                  key={option.id}
                  value={option.id}
                  className={({ active }) =>
                    `cursor-pointer relative select-none pl-10 pr-4 py-2 ${
                      active ? "bg-sky-100 text-sky-900" : ""
                    } ${optionClassName}`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {" "}
                        {option.label}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-800">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </div>
  );
};

export default AutoCompleteInput;
