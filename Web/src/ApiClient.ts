import z from "zod";
import type * as Server from "../../Server/src/api";
import type {
  EndpointResponse,
  EndpointSkel,
  HTTPMethods,
} from "../../Server/src/api_lib";

async function through<
  Endpoint extends EndpointSkel<HTTPMethods, string, any, any, any, any, object>
>(requestData: {
  method: Endpoint["method"];
  url: Endpoint["url"];
  headers: z.infer<Endpoint["headers"]>;
  reqBody: z.infer<Endpoint["reqBody"]>;
  pathParams: z.infer<Endpoint["pathParams"]>;
  searchParams: z.infer<Endpoint["searchParams"]>;
}) {
  let rawUrl: string = requestData.url;
  Object.keys(requestData.pathParams).forEach((key) => {
    rawUrl = rawUrl.replace(`:${key}`, requestData.pathParams[key]);
  });

  const url = new URL(rawUrl);
  Object.keys(requestData.searchParams).forEach((key) => {
    url.searchParams.set(key, requestData.searchParams[key]);
  });

  const response = await fetch(url, {
    method: requestData.method,
    headers: requestData.headers,
    body:
      requestData.method === "GET"
        ? undefined
        : JSON.stringify(requestData.reqBody),
  });

  const responseBody = (await response.json()) as EndpointResponse<Endpoint>;

  return responseBody;
}

export const fetchAllUsers = () =>
  through<typeof Server.userListAll>({
    method: "GET",
    url: "/users",
    headers: {},
    pathParams: {},
    searchParams: {},
    reqBody: {},
  });

export const mutateCreateUser = (name: string) =>
  through<typeof Server.userCreate>({
    method: "POST",
    url: "/users",
    headers: {
      "Content-Type": "application/json",
    },
    pathParams: {},
    searchParams: {},
    reqBody: {
      name,
    },
  });
