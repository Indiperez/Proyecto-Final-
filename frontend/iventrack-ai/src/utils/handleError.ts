import { isAxiosError } from "axios";

export function handleError(error: unknown) {
  if (isAxiosError(error) && error.response?.data) {
    const message = error.response.data.message || error.response.data.error;
    if (message) throw new Error(message);
  }

  throw new Error(`${error}`);
}
