import { S3, PutObjectCommandInput } from "@aws-sdk/client-s3";
import fs from "fs";
import { Readable } from "stream";

const uploadFile = ({
  Key = "",
  Body = "",
}: Partial<Pick<PutObjectCommandInput, "Body" | "Key">>) => {
  if (process.env.NODE_ENV === "development") {
    const path = `public/${Key}`;
    if (typeof Body === "string") fs.writeFileSync(path, Body);
    else if (
      Body instanceof Buffer ||
      Body instanceof Blob ||
      Body instanceof Uint8Array
    )
      fs.writeFileSync(path, Body.toString());
    else if (Body instanceof Readable) Body.pipe(fs.createWriteStream(path));
    return true;
  } else {
    const s3 = new S3({ region: "us-east-1" });
    return s3
      .putObject({
        Bucket: (process.env.ORIGIN || "").replace(/^https:\/\//, ""),
        Key,
        Body,
      })
      .then(() => true);
  }
};

export default uploadFile;
