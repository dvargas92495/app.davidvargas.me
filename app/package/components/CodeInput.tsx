import { Controlled as CodeMirror } from "@dvargas92495/react-codemirror2";
import "@dvargas92495/codemirror/mode/xml/xml";
import "@dvargas92495/codemirror/mode/javascript/javascript";
import codemirrorStyles from "@dvargas92495/codemirror/lib/codemirror.css";
import { useState } from "react";

const CodeInput = ({
  defaultValue = "",
  name,
  className = "",
  labelClassName = "",
  label = "",
  onChange,
  language = "html",
}: {
  name?: string;
  defaultValue?: string;
  className?: string;
  labelClassName?: string;
  label?: string;
  onChange?: (s: string) => void;
  language: "html" | "js";
}) => {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className={`mb-6 ${className}`}>
      <label
        htmlFor={name}
        className={`block mb-2 text-sm font-medium text-gray-900 ${labelClassName}`}
      >
        {label}
      </label>
      <input name={name} value={value} type={"hidden"} />
      <CodeMirror
        value={value}
        options={{
          mode:
            language === "html"
              ? { name: "xml", htmlMode: true }
              : language === "js"
              ? { name: "javascript" }
              : { name: "plain" },
          lineNumbers: true,
          lineWrapping: true,
        }}
        onBeforeChange={(_, __, v) => {
          setValue(v);
          onChange?.(v);
        }}
        className={"border border-black border-opacity-50"}
      />
    </div>
  );
};

CodeInput.link = { rel: "stylesheet", href: codemirrorStyles };

export default CodeInput;
