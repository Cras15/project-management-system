import React, { useState } from 'react'
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemDecorator,
    Typography,
    Sheet,
    CssVarsProvider,
    IconButton,
    CssBaseline
} from '@mui/joy';
import { AssignmentTurnedInRounded, DashboardRounded, LogoutRounded, Menu, PeopleRounded, SettingsRounded, ShoppingCartRounded } from '@mui/icons-material';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { useAuthStore } from '../stores/useAuthStore';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const { pathname } = location;
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const Logout = () => {
        if (window.confirm('Çıkış yapmak istediğinize emin misiniz?')) {
            logout();
            navigate('/', { replace: true });
        }
    }

    return (
        <CssVarsProvider>
            <CssBaseline />
            <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
                <Box sx={{ display: { xs: 'block', md: 'none' }, p: 1 }}>
                    <IconButton
                        variant="outlined"
                        color="neutral"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu />
                    </IconButton>
                </Box>
                <Box
                    component="nav"
                    sx={{
                        '--Sidebar-width': '260px',
                        '--SideNavigation-slideIn': sidebarOpen ? 1 : 0,
                    }}
                >
                    <Sheet
                        className="Sidebar"
                        sx={{
                            position: { xs: 'fixed', md: 'sticky' },
                            transform: {
                                xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
                                md: 'none',
                            },
                            transition: 'transform 0.4s, width 0.4s',
                            zIndex: 10000,
                            height: '100dvh',
                            width: 200,
                            top: 0,
                            p: 2,
                            flexShrink: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            left: 0,
                            borderRight: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <AssignmentTurnedInRounded color="primary" />
                            <Typography level="title-lg">Proje Yönetimi</Typography>
                        </Box>

                        <List
                            size="sm"
                            sx={{
                                '--ListItem-radius': '6px',
                                '--List-gap': '8px',
                            }}
                        >
                            <ListItem>
                                <ListItemButton selected={pathname === '/'} component={Link} to="/">
                                    <ListItemDecorator><DashboardRounded /></ListItemDecorator>
                                    Projeler
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton selected={pathname === '/employees'} component={Link} to="/employees">
                                    <ListItemDecorator><PeopleRounded /></ListItemDecorator>
                                    Çalışanlar
                                </ListItemButton>
                            </ListItem>
                        </List>
                        <List
                            size="sm"
                            sx={{
                                '--ListItem-radius': '6px',
                                '--List-gap': '8px',
                                mt: 'auto',
                            }}
                        >
                            <ListItem sx={{ mt: 'auto' }}>
                                <ListItemButton onClick={Logout}>
                                    <ListItemDecorator><LogoutRounded /></ListItemDecorator>
                                    Çıkış Yap
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Sheet>
                </Box>
                {sidebarOpen && (
                    <Box
                        role="button"
                        onClick={() => setSidebarOpen(false)}
                        sx={{
                            position: 'fixed',
                            zIndex: 9999,
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: { xs: 'block', md: 'none' },
                        }}
                    />
                )}
                <Box
                    component="main"
                    className="MainContent"
                    sx={{
                        flex: 1,
                        p: { xs: 2, md: 3 },
                        mx: 'auto'
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </CssVarsProvider>
    )
}

export default Layout