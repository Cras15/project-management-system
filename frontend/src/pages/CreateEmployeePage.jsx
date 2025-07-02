import { Button, FormControl, FormLabel, Input, Link, Sheet, Typography } from "@mui/joy"
import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router";

const CreateEmployeePage = () => {
  const token = useAuthStore((state) => state.token);
  const navigation = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
    axios.post('http://localhost:8080/employee/add', {
      firstName: data.firstname,
      lastName: data.lastname,
      email: data.email,
      password: data.password
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        console.log('Çalışan eklendi:', response.data);
        navigation('/employees');
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
          <FormLabel>Ad</FormLabel>
          <Input
            name="firstname"
            placeholder="ad"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Soyad</FormLabel>
          <Input
            name="lastname"
            placeholder="soyad"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            placeholder="mail@pms.com"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Şifre</FormLabel>
          <Input
            name="password"
            type="password"
            placeholder="şifre"
          />
        </FormControl>
        <Button sx={{ mt: 1 }} type="submit">Kaydet</Button>
      </form>
    </Sheet>
  )
}

export default CreateEmployeePage