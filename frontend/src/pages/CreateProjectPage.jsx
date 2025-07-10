import { Button, FormControl, FormLabel, Input, Option, Select, Sheet, Typography } from "@mui/joy"
import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router";
import { useNotification } from "../contexts/NotificationContext";

const CreateProjectPage = () => {
    const token = useAuthStore((state) => state.token);
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        console.log(data);
        axios.post('http://localhost:8080/project/add', {
            projectName: data.projectname,
            status: data.status
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                addNotification('Proje başarıyla eklendi', { type: 'success' });
                navigate('/');
            })
            .catch(error => {
                addNotification(error.response.data || 'Proje eklenirken bir hata oluştu', { type: 'danger' });
            });
    }
    return (
        <Sheet
            sx={{
                width: 300,
                mx: 'auto',
                my: 4,
                py: 3,
                px: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRadius: 'sm',
                boxShadow: 'md',
            }}
            variant="outlined"
        >
            <div>
                <Typography level="h4" component="h1">
                    <b>Çalışan Ekle</b>
                </Typography>
            </div>
            <form onSubmit={handleSubmit}>
                <FormControl>
                    <FormLabel>Proje Adı</FormLabel>
                    <Input
                        name="projectname"
                        placeholder="Proje Adı"
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Proje Durumu</FormLabel>
                    <Select
                        placeholder="Proje Durumu"
                        name="status"
                        id="status-select"
                        sx={{ minWidth: 200 }}
                    >
                        <Option value="NEW">Yeni</Option>
                        <Option value="IN_PROGRESS">Devam Ediyor</Option>
                        <Option value="COMPLETED">Tamamlandı</Option>
                    </Select>
                </FormControl>
                <Button sx={{ mt: 1 }} type="submit">Kaydet</Button>
            </form>
        </Sheet>
    )
}

export default CreateProjectPage