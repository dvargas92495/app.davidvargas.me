import { S3, PutObjectCommandInput } from "@aws-sdk/client-s3";
import fs from "fs";

const downloadFile = ({
  Key = "",
}: Partial<Pick<PutObjectCommandInput, "Key">>) => {
  if (process.env.NODE_ENV === "development") {
    const path = `public/${Key}`;
    if (!fs.existsSync(path)) return "";
    return Promise.resolve(fs.readFileSync(path).toString());
  } else {
    const s3 = new S3({ region: "us-east-1" });
    const Bucket = (process.env.ORIGIN || "").replace(/^https:\/\//, "");
    return s3.listObjectsV2({ Bucket, Prefix: Key }).then((r) => {
      if (r.KeyCount === 0) return new Blob();
      return s3
        .getObject({
          Bucket,
          Key,
        })
        .then((r) => r.Body);
    });
  }
};

export default downloadFile;
