import { S3, PutObjectCommandInput } from "@aws-sdk/client-s3";
import fs from "fs";
import nodepath from "path";
import { Readable } from "stream";
import { domain } from "./constants.server";

const uploadFile = ({
  Key = "",
  Body = "",
  Metadata,
}: Partial<Pick<PutObjectCommandInput, "Body" | "Key" | "Metadata">>) => {
  if (process.env.NODE_ENV === "development") {
    const path = `public/${Key}`;
    const dir = nodepath.dirname(path);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (typeof Body === "string") fs.writeFileSync(path, Body);
    else if (Body instanceof Buffer || Body instanceof Uint8Array)
      fs.writeFileSync(path, Buffer.from(Body).toString());
    else if (Body instanceof Readable) Body.pipe(fs.createWriteStream(path));
    else if (Body instanceof Blob)
      Body.stream().pipe(fs.createWriteStream(path));
    // else if (Body instanceof ReadableStream) Body.pipeTo(fs.createWriteStream(path));
    return Promise.resolve(true);
  } else {
    const s3 = new S3({ region: "us-east-1" });
    return s3
      .putObject({
        Bucket: domain,
        Key,
        Body,
        Metadata,
      })
      .then(() => true);
  }
};

export default uploadFile;
