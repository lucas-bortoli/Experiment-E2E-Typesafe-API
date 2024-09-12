import fastify from "fastify";
import { endpoints } from "./api_lib";

const server = fastify();

async function main() {
  for (const endpoint of endpoints) {
    server.route({
      method: endpoint.method,
      url: endpoint.url,
      handler: async (request, reply) => {
        const pathParams = endpoint.pathParams.parse(request.params);
        const searchParams = endpoint.searchParams.parse(request.query);
        const reqBody = endpoint.reqBody.parse(request.body);
        const headers = endpoint.headers.parse(request.headers);

        const response = await endpoint.handler({
          pathParams,
          searchParams,
          reqBody,
          headers,
        });

        if (response instanceof Error) {
          reply.status(500);
          return response;
        }

        return response;
      },
    });
  }
}

await main();
