import AutoCompleteInput from "~/package/components/AutoCompleteInput";

const AutoCompleteInputPage = () => {
  return (
    <div className="w-96">
      <AutoCompleteInput
        label={"Pick an Option"}
        options={[
          { id: "1", label: "Alpha" },
          { id: "2", label: "Beta" },
          {
            id: "3",
            label: "Gamma",
          },
          {
            id: "4",
            label: "Delta",
          },
          {
            id: "5",
            label: "Epsilon",
          },
          {
            id: "6",
            label: "Zeta",
          },
          {
            id: "7",
            label: "Eta",
          },
          {
            id: "8",
            label: "Theta",
          },
          {
            id: "9",
            label: "Iota",
          },
        ]}
      />
    </div>
  );
};

export default AutoCompleteInputPage;
