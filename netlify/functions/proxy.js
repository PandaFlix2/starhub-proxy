exports.handler = async (event) => {
  const path = event.path.replace('/proxy/', '');
  
  let targetUrl = '';
  if (path.startsWith('starhub/')) {
    targetUrl = 'https://ucdn.starhubgo.com/' + path.replace('starhub/', '');
  } else if (path.startsWith('poster/')) {
    targetUrl = 'https://poster.starhubgo.com/' + path.replace('poster/', '');
  } else {
    return { statusCode: 400, body: 'Invalid proxy path' };
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