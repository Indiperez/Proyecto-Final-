import { handleError } from "@/utils/handleError";

export async function request<T>(
  callback: () => Promise<any>,
): Promise<T | null> {
  try {
    const { data } = await callback();

    console.log(data);

    return data;
  } catch (error) {
    handleError(error);
    return null;
  }
}
