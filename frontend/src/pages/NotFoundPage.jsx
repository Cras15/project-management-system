import { Box, Button, Typography } from '@mui/joy';
import { ReportProblemOutlined } from '@mui/icons-material';

export default function NotFoundPage() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '90vh',
            }}
        >
            <ReportProblemOutlined sx={{ fontSize: '4rem', color: 'primary.main' }} />
            <Typography level="h1" component="h1" sx={{ mt: 2, fontSize: '6rem' }}>
                404
            </Typography>
            <Typography level="h4" component="h2" sx={{ mt: 1, color: 'text.secondary' }}>
                Sayfa Bulunamadı
            </Typography>
            <Typography sx={{ mt: 2, textAlign: 'center', maxWidth: '400px', color: 'text.tertiary' }}>
                Aradığınız sayfa mevcut değil. Ana sayfaya dönerek keşfetmeye devam edebilirsiniz.
            </Typography>
            <Button component="a" href="/" sx={{ mt: 4 }}>
                Ana Sayfaya Dön
            </Button>
        </Box>
    );
}