import type { z } from "zod";

type HTTPMethods = "GET" | "POST" | "PUT" | "DELETE";

interface EndpointSkel<
  Method extends HTTPMethods,
  Url extends string,
  PathParams extends z.Schema,
  SearchParams extends z.Schema,
  ReqBody extends z.Schema,
  Headers extends z.Schema,
  Response extends object
> {
  method: Method;
  url: Url;
  pathParams: PathParams;
  searchParams: SearchParams;
  reqBody: ReqBody;
  headers: Headers;
  handler: (payload: {
    pathParams: z.infer<PathParams>;
    searchParams: z.infer<SearchParams>;
    reqBody: z.infer<ReqBody>;
    headers: z.infer<Headers>;
  }) => Promise<Response>;
}

type EndpointResponse<
  E extends EndpointSkel<
    HTTPMethods,
    string,
    z.Schema,
    z.Schema,
    z.Schema,
    z.Schema,
    object
  >
> = Awaited<ReturnType<E["handler"]>>;

export const endpoints: EndpointSkel<
  HTTPMethods,
  string,
  z.ZodSchema,
  z.ZodSchema,
  z.ZodSchema,
  z.ZodSchema,
  object
>[] = [];

function endpoint<
  Method extends HTTPMethods,
  Url extends string,
  PathParams extends z.ZodSchema,
  SearchParams extends z.ZodSchema,
  ReqBody extends z.ZodSchema,
  Headers extends z.ZodSchema,
  Response extends object
>(
  schema: EndpointSkel<
    Method,
    Url,
    PathParams,
    SearchParams,
    ReqBody,
    Headers,
    Response
  >
) {
  // Register it with your favorite framework
  endpoints.push(schema as unknown as (typeof endpoints)[number]);

  return schema;
}

export { endpoint, type EndpointResponse, type EndpointSkel, type HTTPMethods };
