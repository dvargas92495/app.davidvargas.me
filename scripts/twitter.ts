import axios from "axios";
import randomString from "../app/data/randomString.server";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const bearerToken = process.env.TWITTER_TOKEN;

const gather = (
  cursor?: string
): Promise<
  {
    url: string;
    count: number;
    bio: string;
    name: string;
  }[]
> =>
  axios
    .get<{
      users: {
        screen_name: string;
        followers_count: number;
        description: string;
        name: string;
      }[];
      next_cursor: string;
    }>(
      `https://api.twitter.com/1.1/followers/list.json?screen_name=dvargas92495&count=200${
        cursor ? `&cursor=${cursor}` : ""
      }`,
      {
        headers: {
          "User-Agent": "v2FollowingJS",
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    )
    .then((r) => {
      const res = r.data.users.map((u) => ({
        url: `https://twitter.com/${u.screen_name}`,
        count: u.followers_count,
        bio: u.description.replace(/\n/g, ". "),
        name: u.name,
      }));
      return res.length === 200
        ? gather(r.data.next_cursor).then((u) => u.concat(res))
        : res;
    });

gather()
  .then(async (u) => {
    const filename = `/tmp/${await randomString({
      length: 8,
      encoding: "hex",
    })}.txt`;
    const interestedFollowers = u.filter((a) => /(genc)/i.test(a.bio));
    fs.writeFileSync(
      filename,
      interestedFollowers
        .sort((a, b) => b.count - a.count)
        .map((a) => `${a.name} (${a.url}) - ${a.bio} (${a.count} followers)`)
        .join("\n")
    );
    console.log(
      interestedFollowers.length,
      "followers of",
      u.length,
      "outputted at",
      filename
    );
  })
  .catch((r) => console.log(r.response.config.url, r.response.data.errors));
