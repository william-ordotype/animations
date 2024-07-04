export const axiosSuccessTemplate = {
  data: {},
  status: 200,
  statusText: "OK",
  headers: {},
  config: {},
  request: {},
};

export const axiosNotFoundTemplate = {
  data: {},
  status: 404,
  statusText: "Not found",
  headers: {
    "cache-control": "private",
    "content-type": "application/json; charset=utf-8",
  },
  config: {
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false,
    },
    adapter: ["xhr", "http"],
    transformRequest: [null],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {},
    headers: {
      Accept: "application/json, text/plain, */*",
      Authorization:
        "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjZmNjU3ZGRiYWJmYmZkOTVhNGVkNjZjMjMyNDExZWFhNjE5OGQ4NGMxYmJkOGEyYTI5M2I4MTVmYjRhOTlhYjEifQ.eyJpZCI6Im1lbV9zYl9jbGoyOHZiZ2swMTFvMHRremI0OHJld3poIiwidHlwZSI6Im1lbWJlciIsImlhdCI6MTcxNDYxODc1MiwiZXhwIjoxNzE3MjEwNzUyLCJhdWQiOiJhcHBfY2wycjYycm52MDAwdzB1aHkxbnN0ZmMzciIsImlzcyI6Imh0dHBzOi8vYXBpLm1lbWJlcnN0YWNrLmNvbSJ9.JS_r-STwG4AUtkN8iyqLvrKr955FVbwnC4tSp567lr3lAM6a-lbAl4Q8vCKPhy3524yCvQvCglax7Ffnrzaz2v0YOKB88nmB9eptUImaAzJloJfbKB6sigrgcR_R-slELtwG7T0dfcQQPCy3bBjEtkmVQqnIx-0t2QGgYwVskAXCnRtVa_RnI87b7eWJRiexkmdNGY9aA0U4OOUKK8k9_9aDNyHSLXGBz_1DVJxlz81Ro-uG9UUjBcQBla77EVgviQI05Ro1W8PSNlUTJzybY2g_7HpBCYMOFEDLcj2nFSQrpFzX0AiXc5xN-svEI-3ukwJqI3kWQ45QKLlo8EOdVA",
    },
    baseURL: "https://squid-app-tldac.ondigitalocean.app/v1.0.0",
    method: "get",
    url: "",
    params: {},
    responseType: "json",
  },
  request: {},
};
