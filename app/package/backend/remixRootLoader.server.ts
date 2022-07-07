import { rootAuthLoader } from "@clerk/remix/ssr.server";
import type { LoaderFunction } from "@remix-run/node";
import type { Context } from "aws-lambda";

const remixRootLoader = (
  args: Parameters<LoaderFunction>[0] & {
    env: Record<string, string>;
    data: Record<string, unknown>;
  }
): ReturnType<LoaderFunction> =>
  rootAuthLoader(
    args,
    () => {
      const lambdaContext = (
        args.context || {
          lambdaContext: {
            invokedFunctionArn: "",
            logGroupName: "",
          },
        }
      ).lambdaContext as Context;
      const region = lambdaContext.invokedFunctionArn.match(
        /^arn:aws:lambda:([a-z0-9-]+):/
      )?.[1];
      return {
        ENV: {
          API_URL: process.env.API_URL,
          CLERK_FRONTEND_API: process.env.CLERK_FRONTEND_API,
          ORIGIN: process.env.ORIGIN,
          NODE_ENV: process.env.NODE_ENV,
          STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
          ...args.env,
        },
        logUrl: `https://${region}.console.aws.amazon.com/cloudwatch/home?region=${region}#logsV2:log-groups/log-group/${encodeURIComponent(
          lambdaContext.logGroupName
        )}/log-events/${encodeURIComponent(lambdaContext.logStreamName)}`,
        ...args.data,
      };
    },
    { loadUser: true }
  );

export default remixRootLoader;
