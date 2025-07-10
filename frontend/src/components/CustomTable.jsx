import { GroupRounded, SearchRounded } from '@mui/icons-material';
import { Box, Button, IconButton, Input, Option, Select, Sheet, Table, ToggleButtonGroup, Typography } from '@mui/joy'
import { Link } from 'react-router';
import { generatePagination, DOTS } from '../utils/generatePagination';
import React from 'react';

const CustomTable = ({
    data = [],
    columns = [],
    renderActions,
    actionColumnHeader = 'İşlemler',
    handleDelete,
    editLink,
    createLink,
    viewLink,
    createText = "Yeni",
    page = 0,
    setPage,
    maxPage,
    pageSize,
    setPageSize,
    pageSizeOptions = [5, 10, 25, 50],
    renderSearch,
    searchTerm,
    setSearchTerm,
    isFetching,
}) => {
    if (!data) { return <div>Veri yükleniyor...</div>; }

    const paginationItems = generatePagination({
        currentPage: page,
        totalPages: maxPage,
        siblingCount: 1,
    });
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                {renderSearch &&
                    <Input value={searchTerm} onChange={(e, value) => setSearchTerm(e.target.value)}
                        size='sm' variant='outlined' placeholder='Ara...' startDecorator={<SearchRounded />} />
                }
                {createLink && (
                    <Button
                        variant="solid"
                        color="primary"
                        size="sm"
                        component={Link}
                        to={createLink || '#'}
                    >
                        <GroupRounded sx={{ mr: 1 }} />
                        {createText}
                    </Button>
                )}
            </Box>
            <Sheet
                variant="outlined"
                sx={{
                    width: '100%',
                    borderRadius: 'sm',
                    boxShadow: 'sm',
                    overflow: 'auto',
                }}
            >
                <Table stripe="odd" hoverRow>
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.header} style={col.style || {}}>
                                    {col.header}
                                </th>
                            ))}
                            {renderActions && <th style={{ textAlign: 'right', paddingRight: '32px' }}>{actionColumnHeader}</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 && data.map((row) => (
                            <tr key={row.id}>
                                {columns.map((col) => (
                                    <td key={col.header}>
                                        {col.render(row)}
                                    </td>
                                ))}
                                {renderActions && <td style={{ textAlign: 'right', paddingRight: '32px' }}>
                                    <Box>
                                        {viewLink &&
                                            <Button variant="plain" color="primary" size="sm" component={Link} to={`${viewLink}/${row.id}` || '#'}>
                                                Görüntüle
                                            </Button>
                                        }
                                        <Button variant="plain" color="primary" size="sm" component={Link} to={`${editLink}/${row.id}` || '#'}>
                                            Düzenle
                                        </Button>
                                        <Button variant="plain" color="danger" size="sm" onClick={() => handleDelete(row.id)}>
                                            Sil
                                        </Button>
                                    </Box></td>}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Sheet>
            {maxPage > 0 &&
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography level="body-sm">Sayfa başına:</Typography>
                        <Select value={pageSize} onChange={(e, newValue) => setPageSize(newValue)} size="sm" variant="outlined">
                            {pageSizeOptions.map((size) => (
                                <Option key={size} value={size}>{size}</Option>
                            ))}
                        </Select>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
                        <IconButton
                            sx={{ borderRadius: 128 }}
                            color='primary'
                            variant='soft'
                            onClick={() => setPage(p => p - 1)}
                            disabled={page === 0}
                        >
                            {'<'}
                        </IconButton>
                        {paginationItems.map((item, index) => {
                            if (item === DOTS) {
                                return <Typography key={`${item}-${index}`} sx={{ mx: 0.5 }}>...</Typography>;
                            }
                            return (
                                <IconButton
                                    key={item}
                                    color="primary"
                                    variant={page === item - 1 ? "solid" : "outlined"}
                                    onClick={() => setPage(item - 1)}
                                    sx={{ borderRadius: 128 }}
                                >
                                    {item}
                                </IconButton>
                            );
                        })}
                        <IconButton
                            sx={{ borderRadius: 128 }}
                            color='primary'
                            variant='soft'
                            onClick={() => setPage(p => p + 1)}
                            disabled={page === maxPage - 1}
                        >
                            {'>'}
                        </IconButton>
                    </Box>
                    <Box sx={{ mr: 2 }}>
                        <Typography>{page + 1}/{maxPage}</Typography>
                    </Box>
                </Box>
            }
        </>
    )
}

export default React.memo(CustomTable);