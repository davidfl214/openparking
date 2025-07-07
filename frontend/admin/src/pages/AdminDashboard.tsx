import { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import UsersCRUD from '../components/UsersCRUD.jsx';
import ParkingsCRUD from '../components/ParkingsCRUD.jsx';
import PlazasCRUD from '../components/PlazasCRUD.jsx';

function TabPanel({ children, value, index }) {
    return (
        value === index && (
            <Box sx={{ py: 3 }}>
                {children}
            </Box>
        )
    );
}

const AdminDashboard = () => {
    const [tabIndex, setTabIndex] = useState(0);

    const handleChange = (_, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#000',
                color: '#FFD700',
                px: 4,
                py: 3
            }}
        >
            <Typography
                variant="h4"
                sx={{ fontWeight: 'bold', mb: 4, color: '#FFD700' }}
            >
                PANEL DE ADMINISTRACIÓN
            </Typography>

            <Tabs
                value={tabIndex}
                onChange={handleChange}
                textColor="inherit"
                TabIndicatorProps={{ style: { backgroundColor: '#FFD700' } }}
                variant="fullWidth"
                sx={{
                    borderBottom: '1px solid #FFD700',
                    mb: 3
                }}
            >
                <Tab label="Usuarios" sx={{ color: '#FFD700' }} />
                <Tab label="Parkings" sx={{ color: '#FFD700' }} />
                <Tab label="Plazas" sx={{ color: '#FFD700' }} />
            </Tabs>

            <TabPanel value={tabIndex} index={0}>
                <UsersCRUD />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <ParkingsCRUD />
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                <PlazasCRUD />
            </TabPanel>
        </Box>
    );
};

export default AdminDashboard;
