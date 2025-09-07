"use client";
import { fetchMe } from '../lib/fetchers';
import { useQuery } from '@tanstack/react-query';

export function useUser() {
  return useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });
}
