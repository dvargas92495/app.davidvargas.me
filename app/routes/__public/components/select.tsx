import React from "react";
import Select from "~/package/components/Select";

const SelectPage = () => {
  return (
    <div className="w-96">
      <Select
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
      <span>Content underneath.</span>
    </div>
  );
};

export default SelectPage;
