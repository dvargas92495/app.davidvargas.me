import { useFetcher } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import Button from "~/package/components/Button";
import TextInput from "~/package/components/TextInput";
import { downloadFileContent } from "~/package/backend/downloadFile.server";

const UploadFile = () => {
  const fetcher = useFetcher();
  return (
    <>
      <fetcher.Form>
        <TextInput label={"Id"} name={"id"} />
        <Button>Download</Button>
      </fetcher.Form>
      <pre>{fetcher.data}</pre>
    </>
  );
};

export const loader: LoaderFunction = async ({ request }) => {
  const data = new URL(request.url).searchParams;
  const id = data.get("id");
  if (id)
    return downloadFileContent({
      Key: `/data/examples/${id}`,
    });
  else return "No content for id " + id;
};

export default UploadFile;
