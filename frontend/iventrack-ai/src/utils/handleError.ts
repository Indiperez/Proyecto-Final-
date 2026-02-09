import { isAxiosError } from "axios";

export function handleError(error: unknown) {
  if (isAxiosError(error) && error.response?.data.error) {
    throw new Error(error.response.data.error);
  }

  throw new Error(`${error}`);
}
