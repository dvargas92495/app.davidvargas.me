import { S3, PutObjectCommandInput } from "@aws-sdk/client-s3";
import fs from "fs";
import { domain } from "./constants.server";

const removeFile = ({
  Key = "",
}: Partial<Pick<PutObjectCommandInput, "Key">>) => {
  if (process.env.NODE_ENV === "development") {
    const path = `public/${Key}`;
    if (fs.existsSync(path)) fs.rmSync(path);
    return Promise.resolve(true);
  } else {
    const s3 = new S3({ region: "us-east-1" });
    return s3
      .deleteObject({
        Bucket: domain,
        Key,
      })
      .then(() => true);
  }
};

export default removeFile;
