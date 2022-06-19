const handleAsResponse = <T>(output: T, prefix?: string) =>
  Promise.resolve(output).catch((e) => {
    if (e instanceof Response) throw e;
    throw new Response(prefix ? `${prefix}:\n${e.message}` : e.message, {
      status: e.status || e.code || 500,
    });
  });

export default handleAsResponse;
