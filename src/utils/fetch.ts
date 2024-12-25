interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any; 
  queryParams?: Record<string, string | number>;
  timeout?: number; 
}

export default async function fetchWrapper(
	url: string,
  options: FetchOptions = {}
): Promise<any> {
	const { method = 'GET', headers, body, queryParams, timeout = 10000 } = options;
  
  // let fullUrl = 'https://api.hyperindex.trade' + url;
  let fullUrl = 'http://localhost:3001' + url;
  if (queryParams) {
    const params = new URLSearchParams(queryParams as any).toString();
    fullUrl += `?${params}`;
  }

 
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}