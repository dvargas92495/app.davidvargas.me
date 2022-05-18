import BaseInput, { InputProps } from "./BaseInput";

const Checkbox = ({
  className,
  inputClassname,
  ...inputProps
}: Omit<InputProps, "type">) => {
  return (
    <>
      <BaseInput
        {...inputProps}
        type={"checkbox"}
        inputClassname={inputClassname || "w-6 h-6 mb-2 cursor-pointer"}
        className={className || "flex flex-row-reverse gap-2 justify-end"}
      />
    </>
  );
};

export default Checkbox;
