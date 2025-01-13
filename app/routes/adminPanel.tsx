import {loader as getAlluser} from 'app/routes/api/v1/getAllUser'
import AdminPanelPage from '~/screens/AdminPanel/AdminPanelPage'

export const loader = getAlluser

export default function AdminPanel() {
  return <AdminPanelPage />
}
