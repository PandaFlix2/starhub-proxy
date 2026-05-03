exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  let targetUrl = params.url;

  if (!targetUrl) {
    const match = event.rawUrl.match(/\/api\/proxy\/(https?:\/\/.+)/);
    if (match) targetUrl = match[1];
  }

  if (!targetUrl || !targetUrl.startsWith('http')) {
    return {
      statusCode: 400,
      body: 'Invalid URL: ' + event.rawUrl,
    };
  }

  try {
    const response = await fetch(targetUrl, {
      method: event.httpMethod,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
        'Referer': 'https://ucdn.starhubgo.com',
      },
    });

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    let body = await response.text();

    // Rewrite URLs dalam MPD supaya guna proxy kita
    if (contentType.includes('dash') || targetUrl.endsWith('.mpd')) {
      const proxyBase = 'https://starhub-01.netlify.app/api/proxy/';
      body = body.replace(/https:\/\/ucdn\.starhubgo\.com/g, proxyBase + 'https://ucdn.starhubgo.com');
    }

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
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
