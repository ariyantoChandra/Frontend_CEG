import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import * as API from "@/core/services/api";

export function useCheckAcc() {
  const router = useRouter();

  const { data, error, mutate } = useSWR(
    "check-acc",
    async () => {
      try {
        const response = await API.rally.checkAcc();
        return response?.data;
      } catch (err) {
        clearGameLocalStorage();
        throw err;
      }
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
    }
  );

  useEffect(() => {
    if (error) {
      clearGameLocalStorage();
      router.push("/rally");
    }
  }, [error, router]);

  return { data, error, mutate };
}

function clearGameLocalStorage() {
  try {
    const keysToKeep = ["user", "role", "token", "user_id"];
    const allKeys = Object.keys(localStorage);

    allKeys.forEach((key) => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  } catch (err) {
    console.error("Error clearing localStorage:", err);
  }
}
