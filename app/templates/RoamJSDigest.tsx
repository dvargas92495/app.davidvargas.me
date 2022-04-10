import React from "react";
import dateFnsFormat from "date-fns/format";

const RoamJSDigest = ({
  data,
  date,
}: {
  data: {
    message: string;
    repo: string;
    date: Date;
    url: string;
  }[];
  date: Date;
}) => {
  console.log("Found", data.length, "commits");
  const updatesByExtension = data.reduce((p, { repo, ...c }) => {
    if (p[repo]) {
      p[repo].push(c);
    } else {
      p[repo] = [c];
    }
    return p;
  }, {} as Record<string, { message: string; date: Date; url: string }[]>);
  return (
    <>
      <p style={{ textAlign: "center" }}>
        <img
          src="https://roamjs.com/images/logo-low-res.png"
          width={64}
          height={64}
          style={{ display: "inline-block" }}
        />
      </p>
      <p style={{ textAlign: "center" }}>
        <span style={{ fontSize: 30 }}>
          Digest for {dateFnsFormat(date, "MMMM do, yyyy")}
        </span>
      </p>
      <p>
        <strong>
          <span style={{ fontSize: 24 }}>Extension Updates</span>
        </strong>
      </p>
      <ul>
        {Object.entries(updatesByExtension)
          .filter(([r]) => r.startsWith("roamjs-"))
          .map(([ext, upd]) => {
            const name = ext.replace(/^roamjs-/, "");
            return (
              <li key={ext}>
                <a
                  href={`https://roamjs.com/extensions/${name}`}
                  style={{
                    textTransform: "capitalize",
                  }}
                  className="keychainify-checked"
                >
                  {name.replace(/-/g, " ")}
                </a>
                :
                <ul>
                  {upd.map(({ message, url, date }) => (
                    <li key={url}>
                      {message} ({dateFnsFormat(date, "MM/dd")})
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
      </ul>
      <h2>
        <strong>Site News</strong>
      </h2>
      <ul>
        {updatesByExtension["roam-js-extensions"].map((upd) => (
          <li key={upd.url}>
            {upd.message} ({upd.date})
          </li>
        ))}
      </ul>
      <p>
        Be sure to follow us on Twitter{" "}
        <a href="https://twitter.com/roam_js" className="keychainify-checked">
          @roam_js
        </a>{" "}
        for more frequent updates!
      </p>
      <p style={{ textAlign: "center" }}>
        <a href="https://roamjs.com" className="keychainify-checked">
          https://roamjs.com
        </a>
      </p>
    </>
  );
};

export default RoamJSDigest;
