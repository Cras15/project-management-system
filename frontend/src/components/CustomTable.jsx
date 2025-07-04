import { Group } from '@mui/icons-material';
import { Box, Button, Sheet, Table } from '@mui/joy'
import { Link } from 'react-router';

const CustomTable = ({ data = [], columns = [], renderActions, actionColumnHeader = 'İşlemler', handleDelete, editLink, createLink, createText = "Yeni" }) => {
    if (!data) { return <div>Veri yükleniyor...</div>; }
    return (
        <>
            {createLink && (
                <Button
                    variant="solid"
                    color="primary"
                    size="sm"
                    sx={{ mb: 2 }}
                    component={Link}
                    to={createLink || '#'}
                >
                    <Group sx={{ mr: 1 }} />
                    {createText}
                </Button>
            )}
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
                        {data.map((row) => (
                            <tr key={row.id}>
                                {columns.map((col) => (
                                    <td key={col.header}>
                                        {col.render(row)}
                                    </td>
                                ))}
                                {renderActions && <td style={{ textAlign: 'right', paddingRight: '32px' }}>
                                    <Box>
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
        </>
    )
}

export default CustomTable