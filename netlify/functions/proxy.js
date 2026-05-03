exports.handler = async (event) => {
  // Extract full URL after /api/proxy/
  const fullPath = event.path; // /.netlify/functions/proxy/https://ucdn...
  const targetUrl = fullPath.replace('/.netlify/functions/proxy/', '');

  if (!targetUrl.startsWith('http')) {
    return { statusCode: 400, body: 'Invalid URL' };
  }

  try {
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': '*/*',
        'Origin': 'https://ucdn.starhubgo.com',
        'Referer': 'https://ucdn.starhubgo.com',
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
