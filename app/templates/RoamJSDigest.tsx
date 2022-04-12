import React from "react";
import dateFnsFormat from "date-fns/format";
import Markdown from "markdown-to-jsx";

const Update = ({ message, date }: { message: string; date: Date }) => {
  return (
    <li>
      <Markdown
        options={{
          overrides: {
            a: {
              props: { className: "keychainify-checked" },
            },
          },
        }}
      >
        {`${message} (${dateFnsFormat(date, "MM/dd")})`}
      </Markdown>
    </li>
  );
};

const ignored = ["roamjs-base", "roamjs-components", "roamjs-scripts"];

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
  const updatesByExtension = data
    .filter((s) => !ignored.includes(s.repo))
    .reduce((p, { repo, ...c }) => {
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
          style={{ display: "inline-block", width: "64px", height: "64px" }}
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
                    <Update key={url} message={message} date={date} />
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
        {(updatesByExtension["roam-js-extensions"] || []).map((upd) => (
          <Update key={upd.url} message={upd.message} date={upd.date} />
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
