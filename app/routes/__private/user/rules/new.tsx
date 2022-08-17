export { default as CatchBoundary } from "~/package/components/DefaultCatchBoundary";
export { default as ErrorBoundary } from "~/package/components/DefaultErrorBoundary";
import { ActionFunction, redirect } from "@remix-run/node";
import remixAppAction from "~/package/backend/remixAppAction.server";
import { Form, Link } from "@remix-run/react";
import Button from "~/package/components/Button";
import createRule from "~/data/createRule.server";
import TextInput from "~/package/components/TextInput";
import { useState } from "react";
import { v4 } from "uuid";
import Select from "~/package/components/Select";
import {
  RULE_CONDITION_OPERATIONS,
  TRANSFORM_AMOUNT_OPERATION,
} from "~/enums/rules";
import CODES from "~/enums/taxCodes";

const NewRulePage = () => {
  const [conditionIds, setConditionIds] = useState<string[]>([]);
  return (
    <>
      <Link to={"/user/rules"}>
        <span className="absolute right-4 top-4 px-4 py-2 bg-orange-400 rounded-md cursor-pointer">
          {"<- Back"}
        </span>
      </Link>
      <Form method={"post"}>
        <TextInput name={"label"} label={"Label"} />
        <h2 className="font-semibold text-lg">Transforms</h2>
        <div className={"flex gap-4"}>
          <Select
            name={"transformAmountOperation"}
            label={"Amount Operation"}
            options={TRANSFORM_AMOUNT_OPERATION.map((label, id) => ({
              id,
              label,
            }))}
          />
          <TextInput label={"Amount Operand"} name={"transformAmountOperand"} />
          <Select name={"transformCode"} label={"Code"} options={CODES} />
          <TextInput label={"Description"} name={"transformDescription"} />
        </div>
        <h2 className="font-semibold text-lg">Conditions</h2>
        <div className="mb-4">
          {conditionIds.map((c) => (
            <div key={c} className={"flex gap-4 items-center"}>
              <TextInput name={"conditionKeys"} label={"Key"} />
              <Select
                name={"conditionOperations"}
                label={"Operation"}
                options={RULE_CONDITION_OPERATIONS.map((label, id) => ({
                  id,
                  label,
                }))}
              />
              <TextInput name={"conditionValues"} label={"Value"} />
              <Button
                type={"button"}
                className={"p-2"}
                onClick={() =>
                  setConditionIds(conditionIds.filter((id) => id !== c))
                }
              >
                X
              </Button>
            </div>
          ))}
          <Button
            type={"button"}
            onClick={() => setConditionIds([...conditionIds, v4()])}
          >
            Add Condition
          </Button>
        </div>
        <Button>Create</Button>
      </Form>
    </>
  );
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, {
    POST: ({ userId, data, searchParams }) =>
      createRule({ userId, data }).then(({ uuid }) => {
        return redirect(
          `/user/rules/${uuid}${
            Object.keys(searchParams).length
              ? ""
              : `?${new URLSearchParams(searchParams).toString()}`
          }`
        );
      }),
  });
};

export default NewRulePage;
