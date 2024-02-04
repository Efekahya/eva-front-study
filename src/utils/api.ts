import { Api } from "@/generated/types";

const createApiClient = () => {
  if (Object.hasOwn(global, "api") === false) {
    const api = new Api({
      baseUrl: process.env.BASE_URL ?? "",
      baseApiParams: {
        headers: {
          "Content-Type": "application/json",
        },
      },
      securityWorker: (token: string | null) => ({
        headers: { Authorization: token ?? "" },
      }),
    });
    Object.defineProperty(global, "api", {
      value: api,
      writable: false,
    });
  }
};
export default createApiClient;
