import { createRequestHandler } from "remix-lambda-at-edge";

const getRemixHandler = ({
  originPaths = [],
}: {
  originPaths?: Parameters<typeof createRequestHandler>[0]["originPaths"];
} = {}) =>
  createRequestHandler({
    // this looks really bad but is actually okay. Current project standards guarantee this file and build file's location
    // and we need a hardcoded file path for esbuild to be able to do it's bundling
    getBuild: () => require("~/server/build"),
    originPaths: [
      "favicon.ico",
      /^\/build\/.*/,
      /^\/data\/.*/,
      /^\/images\/.*/,
      /^\/videos\/.*/,
      /^\/svgs\/.*/,
      ...originPaths,
    ],
    onError: (e) => console.log("Send email to me", e),
  });

export default getRemixHandler;
