exports.handler = async (event) => {
  // Ambik dari querystring parameter instead
  const params = event.queryStringParameters || {};
  let targetUrl = params.url;

  // Kalau takde query param, cuba dari path
  if (!targetUrl) {
    const pathParts = event.rawUrl.split('/api/proxy/');
    if (pathParts.length > 1) {
      targetUrl = pathParts[1];
    }
  }

  if (!targetUrl || !targetUrl.startsWith('http')) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Invalid URL',
        rawUrl: event.rawUrl,
        path: event.path,
        params: params
      }),
    };
  }

  try {
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': '*/*',
      },
    });

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const body = await response.text();

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
      },
      body: body,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: 'Proxy error: ' + err.message,
    };
  }
};
