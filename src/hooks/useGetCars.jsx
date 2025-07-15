import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import autoService, { queryKeys } from "../service/service";

export const useGetCars = (filters = {}) => {
    // Generar queryKey dinámica basada en filtros
    const queryKey = [queryKeys.autos, filters];
    
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch
    } = useInfiniteQuery({
        queryKey,
        queryFn: async ({ pageParam = 1 }) => {
            console.log('Fetching page:', pageParam, 'with filters:', filters);
            
            // Convertir filtros a query params
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== '') {
                    queryParams.append(key, value);
                }
            });
            
            const result = await autoService.getAutos({ 
                pageParam,
                filters: queryParams.toString()
            });
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
        keepPreviousData: true, // Mantener datos anteriores mientras carga
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
        isFetchingNextPage,
        refetch
    };
};
