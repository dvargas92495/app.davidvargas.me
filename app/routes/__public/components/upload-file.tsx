import { Form } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import Textarea from "~/package/components/Textarea";
import Button from "~/package/components/Button";
import TextInput from "~/package/components/TextInput";
import uploadFile from "~/package/backend/uploadFile.server";

const UploadFile = () => {
  return (
    <Form method={"put"}>
      <TextInput label={"Id"} name={"id"} />
      <Textarea label={"Data"} name={"data"} />
      <Button>Upload</Button>
    </Form>
  );
};

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  return uploadFile({
    Key: `/data/examples/${data.get("id")}`,
    Body: data.get("data") as string,
  });
};

export default UploadFile;
