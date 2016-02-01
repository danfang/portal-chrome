export function authenticatedRequest(method, body, credentials) {
  return {
    method: method,
    headers: {
      'Content-type': 'application/json;',
      'X-USER-ID': credentials.userID,
      'X-USER-TOKEN': credentials.userToken,
    },
    body: JSON.stringify(body)
  }
}

export function checkResponse(response) {
  if (response.status >= 400) {
    var error = new Error(response.statusText)
    error.body = response.json()
    throw error
  }
  return response.json()
}
