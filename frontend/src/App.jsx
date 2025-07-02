import './App.css'
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import { useAuthStore } from './stores/useAuthStore'
import Layout from './components/Layout'
import EditProject from './pages/EditProject'
import EmployeesPage from './pages/EmployeesPage'
import CreateEmployeePage from './pages/CreateEmployeePage'
import CreateProjectPage from './pages/CreateProjectPage'
import EditEmployeePage from './pages/EditEmployeePage'

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <Routes>
      {token != undefined ?
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="project/:id" element={<EditProject />} />
          <Route path="project/create" element={<CreateProjectPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="employee/:id" element={<EditEmployeePage />} />
          <Route path="employee/create" element={<CreateEmployeePage />} />
        </Route>
        : <>
          <Route index element={<LoginPage />} />
        </>
      }
    </Routes>
  )
}

export default App
