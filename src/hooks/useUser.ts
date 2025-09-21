"use client";
import { useEffect, useState, useCallback } from "react";
import { fetchMe } from "../lib/fetchers";

// Minimal user shape used across the app. Add fields here if backend returns more.
export type User = {
  id?: string;
  name?: string;
  lastname?: string;
  email?: string;
  dni?: string | number;
  phone?: string;
  available_amount?: number;
  cvu?: string | number;
  alias?: string | number;
};

export function useUser() {
  const [data, setData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | null>(null);

  const fetchData = useCallback(async (): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = (await fetchMe()) as User | null;
      setData(res);
      setIsLoading(false);
      return res;
    } catch (err) {
      setError(err);
      setIsLoading(false);
      throw err;
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
