import CodeInput from "~/package/components/CodeInput";

const CodeInputPage = () => {
  return (
    <>
      <CodeInput label={"Label"} language={"js"} />
    </>
  );
};

export function links() {
  return [CodeInput.link];
}

export default CodeInputPage;
