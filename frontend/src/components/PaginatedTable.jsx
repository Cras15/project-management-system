import { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { usePaginatedQuery } from '../hooks/usePaginatedQuery';
import CustomTable from './CustomTable';
import { useDebounce } from '../hooks/useDebounce';

const PaginatedTable = ({
    queryKey,
    fetchFn,
    columns,
    initialPageSize = 10,
    pageSizeOptions,
    renderSearch,
    ...customTableProps
}) => {
    const token = useAuthStore((state) => state.token);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 1000);

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        page,
        setPage,
        totalPages,
        pageSize,
        setPageSize,
        refetch,
    } = usePaginatedQuery(
        queryKey,
        (params) => fetchFn({ ...params, token }),
        { initialPageSize, searchTerm: debouncedSearchTerm }
    );

    const enhancedProps = { ...customTableProps };
    if (enhancedProps.handleDelete) {
        const originalHandleDelete = enhancedProps.handleDelete;
        enhancedProps.handleDelete = async (...args) => {
            await originalHandleDelete(...args);
            refetch();
        };
    }

    if (isLoading && !data) return <div>Tablo Yükleniyor...</div>;
    if (isError) return <div>Hata oluştu: {error.message}</div>;

    return (
        <CustomTable
            columns={columns}
            data={data?.content}
            maxPage={totalPages}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            pageSizeOptions={pageSizeOptions}
            renderSearch={renderSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isFetching={isFetching}
            {...enhancedProps}
        />
    );
};

export default PaginatedTable;