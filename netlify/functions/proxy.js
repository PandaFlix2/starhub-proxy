exports.handler = async (event) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      status: 'Function is working!',
      path: event.path,
      rawUrl: event.rawUrl,
    }),
  };
};
