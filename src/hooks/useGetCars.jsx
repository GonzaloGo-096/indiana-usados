import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import autoService, { queryKeys } from "../service/service";

export const useGetCars = () => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error
    } = useInfiniteQuery({
        queryKey: [queryKeys.autos],
        queryFn: async ({ pageParam = 1 }) => {
            console.log('Fetching page:', pageParam);
            const result = await autoService.getAutos({ pageParam });
            console.log('API Response:', result);
            return result;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            console.log('Last page:', lastPage);
            return lastPage?.nextPage;
        },
        staleTime: 1000 * 60 * 5, // 5 minutos
        cacheTime: 1000 * 60 * 30, // 30 minutos
        refetchOnWindowFocus: false,
        retry: 1,
        select: (data) => {
            console.log('Select data:', data);
            const result = {
                ...data,
                autos: data.pages.flatMap(page => page?.items || [])
            };
            console.log('Transformed data:', result);
            return result;
        }
    });

    const loadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            console.log('Loading more...');
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    return {
        autos: data?.autos || [],
        loadMore,
        hasNextPage,
        isLoading,
        isError,
        error,
        isFetchingNextPage
    };
};
