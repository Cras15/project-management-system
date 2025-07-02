import { Button, FormControl, FormLabel, Input, Link, Option, Select, Sheet, Typography } from "@mui/joy"
import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";
import { Navigate, useNavigate } from "react-router";

const CreateProjectPage = () => {
    const token = useAuthStore((state) => state.token);
    const navigate = useNavigate();

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
                console.log('Proje eklendi:', response.data);
                navigate('/');
            })
            .catch(error => {
                console.error(error);
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