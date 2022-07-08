import { getAuth } from "@clerk/remix/ssr.server";

const getUserId = (request: Request) => {
  request.headers.get("x-offline-userId");
  const get = () => getAuth(request).then((authData) => authData.userId);
  return Promise.resolve(
    process.env.NODE_ENV === "development"
      ? request.headers.get("x-offline-userId") || get()
      : get()
  );
};

export default getUserId;
