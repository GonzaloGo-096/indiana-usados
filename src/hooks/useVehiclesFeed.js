import { useInfiniteQuery } from '@tanstack/react-query';
import { getMainVehicles } from '@services/vehiclesApi';
import { hasAnyFilter, filtersKey } from '@utils/filters';

const lastId = (arr = []) =>
  arr.length ? (arr[arr.length - 1]._id || arr[arr.length - 1].id) : undefined;

export const useVehiclesFeed = (filters = {}) => {
  const filtered = hasAnyFilter(filters);
  const key = ['vehicles','feed', filtered ? filtersKey(filters) : 'main'];

  const query = useInfiniteQuery({
    queryKey: key,
    queryFn: async ({ pageParam }) => {
      const cursor = (typeof pageParam === 'string' || pageParam == null) ? (pageParam || null) : null;
      return getMainVehicles({ limit: filters.limit ?? 12, cursor, filters });
    },
    getNextPageParam: (lastPage) => {
      const ap = lastPage?.allPhotos;
      if (ap?.hasNextPage) return lastId(ap.docs);
      return undefined;
    },
    select: (data) => {
      const pages = data.pages || [];
      const docs = pages.flatMap(p => p?.allPhotos?.docs || []);
      const last = pages.at(-1)?.allPhotos;
      return { docs, hasNextPage: !!last?.hasNextPage, totalDocs: last?.totalDocs ?? docs.length };
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 2,
  });

  return {
    vehicles: query.data?.docs || [],
    total: query.data?.totalDocs || 0,
    hasNextPage: query.data?.hasNextPage || false,
    isLoading: query.isLoading,
    isLoadingMore: query.isFetchingNextPage,
    loadMore: query.fetchNextPage,
    refetch: query.refetch,
  };
};
