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
        queryFn: ({ pageParam = 1 }) => autoService.getAutos({ pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => lastPage?.nextPage,
        staleTime: 1000 * 60 * 5, // 5 minutos
        cacheTime: 1000 * 60 * 30, // 30 minutos
        refetchOnWindowFocus: false,
        retry: 1,
        select: (data) => ({
            ...data,
            autos: data.pages.flatMap(page => page?.items || [])
        })
    });

    const loadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
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
