import React from "react";
import AutoCompleteInput from "~/package/components/AutoCompleteInput";

const AutoCompleteInputPage = () => {
  return (
    <div className="w-96">
      <AutoCompleteInput
        label={"Pick an Option"}
        options={[
          { id: "1", label: "First Option" },
          { id: "2", label: "Second Guess" },
          {
            id: "3",
            label: (
              <>
                <img
                  src={"/images/logo.png"}
                  width={16}
                  height={16}
                  className={"inline-block"}
                />{" "}
                With a logo
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default AutoCompleteInputPage;
