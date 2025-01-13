import {loader as getUserDetailsApi} from 'app/routes/api/v1/userDetails'
import UserDetailsPage from '~/screens/UserDetail/UserDetailPage'

export const loader = getUserDetailsApi

export default function UserDetails() {
  return <UserDetailsPage />
}
