import getMysqlConnection from "fuegojs/utils/mysql";
import { z } from "zod";
import { v4 } from "uuid";

const schema = z.object({
  label: z
    .string()
    .array()
    .refine((s) => s.length === 1)
    .transform((s) => s[0]),
  snapshot: z
    .string()
    .array()
    .refine((s) => s.length === 1)
    .transform((s) => s[0]),
  feed: z
    .string()
    .array()
    .refine((s) => s.length === 1)
    .transform((s) => s[0]),
  credential: z
    .string()
    .array()
    .refine((s) => s.length === 1)
    .transform((s) => s[0]),
});

const createSource = ({
  userId,
  data,
}: {
  userId: string;
  data: Record<string, string[]>;
}) => {
  const source = schema.parse(data);
  const sourceUuid = v4();
  return getMysqlConnection()
    .then((cxn) =>
      cxn
        .execute(
          `INSERT INTO sources (uuid, user_id, label, snapshot_url, feed_url, credential) 
      VALUES (?,?,?,?,?,?,?)`,
          [
            sourceUuid,
            userId,
            source.label,
            source.snapshot,
            source.feed,
            source.credential,
          ]
        )
        .then(() => cxn.destroy())
    )
    .then(() => ({
      uuid: sourceUuid,
      success: true,
      message: `Successfully created source ${source.label}`,
    }));
};

export default createSource;
