export function expectFetchMock(fetchMock, endpoint, credentials, requestBody) {
  fetchMock.called(endpoint).should.be.true;

  const options = fetchMock.lastOptions(endpoint);

  if (credentials) {
    options.headers['X-USER-ID'].should.equal(credentials.userID);
    options.headers['X-USER-TOKEN'].should.equal(credentials.userToken);
  }

  if (requestBody) JSON.parse(options.body).should.deep.equal(requestBody);
}
