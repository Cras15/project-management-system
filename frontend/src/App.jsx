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
import RolePage from './pages/RolePage'
import PermissionPage from './pages/PermissionPage'
import EditRole from './pages/EditRole'
import EditPermission from './pages/EditPermission'
import ViewProjectPage from './pages/ViewProjectPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <Routes>
      {token != null ?
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="project/:id" element={<EditProject />} />
          <Route path="project/create" element={<CreateProjectPage />} />
          <Route path="project/view/:id" element={<ViewProjectPage />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="employee/:id" element={<EditEmployeePage />} />
          <Route path="employee/create" element={<CreateEmployeePage />} />
          <Route path="role" element={<RolePage />} />
          <Route path="permission" element={<PermissionPage />} />
          <Route path='role/edit/:id' element={<EditRole />} />
          <Route path='role/edit' element={<EditRole />} />
          <Route path='permission/edit/:id' element={<EditPermission />} />
          <Route path='permission/edit' element={<EditPermission />} />
          <Route path="*" element={<NotFoundPage/>} />
        </Route>
        : <>
          <Route index element={<LoginPage />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </>
      }
    </Routes>
  )
}

export default App
