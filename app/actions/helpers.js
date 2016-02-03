export function authenticatedRequest(credentials, method, body) {
  const request = {
    method,
    headers: {
      'X-USER-ID': credentials.userID,
      'X-USER-TOKEN': credentials.userToken,
    },
  };
  if (method === 'POST') {
    request.headers['Content-type'] = 'application/json;';
    request.body = JSON.stringify(body);
  }
  return request;
}

export function checkResponse(response) {
  if (response.status >= 400) {
    const error = new Error(response.statusText);
    error.body = response.json();
    throw error;
  }
  return response.json();
}
