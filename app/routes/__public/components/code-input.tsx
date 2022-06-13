import CodeInput from "~/package/components/CodeInput";
import codemirrorStyles from "@dvargas92495/codemirror/lib/codemirror.css";

const CodeInputPage = () => {
  return (
    <>
      <CodeInput label={"Label"} language={"js"} />
    </>
  );
};

export function links() {
  return [{ rel: "stylesheet", href: codemirrorStyles }];
}

export default CodeInputPage;
