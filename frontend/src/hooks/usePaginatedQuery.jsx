import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export const usePaginatedQuery = (queryKey, fetchFn, options = {}) => {
    const { initialPage = 0, initialPageSize = 10, searchTerm='' } = options;

    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSizeState] = useState(initialPageSize);

    useEffect(() => {
        setPage(0);
    }, [searchTerm]);

    const setPageSize = (newPageSize) => {
        setPageSizeState(newPageSize);
        setPage(0);
    };

    const queryResult = useQuery({
        queryKey: [...queryKey, page, pageSize, searchTerm],
        queryFn: () => fetchFn({ page, pageSize, searchTerm }),
        keepPreviousData: true, 
    });

    return {
        ...queryResult,
        page,
        setPage,
        pageSize,
        setPageSize,
        totalPages: queryResult.data?.totalPages || 1,
    };
};