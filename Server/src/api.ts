import z from "zod";
import { endpoint } from "./api_lib";

let userIdAcc = 1;
interface User {
  id: number;
  name: string;
}
const userDb: User[] = [];

export const userListAll = endpoint({
  method: "GET",
  url: "/users",
  headers: z.object({}),
  reqBody: z.object({}),
  pathParams: z.object({}),
  searchParams: z.object({}),
  handler: async (payload) => {
    if (Date.now() < 5000) {
      return { error: "past is gone" } as const;
    }

    return userDb;
  },
});

export const userCreate = endpoint({
  method: "POST",
  url: "/users",
  headers: z.object({
    "Content-Type": z.literal("application/json"),
  }),
  pathParams: z.object({}),
  searchParams: z.object({}),
  reqBody: z.object({
    name: z.string(),
  }),
  async handler(payload) {
    const user: User = {
      id: ++userIdAcc,
      name: payload.reqBody.name,
    };

    userDb.push(user);

    return user;
  },
});
