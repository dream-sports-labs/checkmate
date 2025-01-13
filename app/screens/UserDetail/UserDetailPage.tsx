import {useFetcher, useLoaderData} from '@remix-run/react'
import {Separator} from '@ui/separator'
import {UserDetailsResponseType} from 'app/routes/api/v1/userDetails'
import {useEffect, useState} from 'react'
import {API} from '~/routes/utilities/api'
import {TOKEN_DELETED_SUCCESSFULLY} from '~/routes/utilities/constants'
import UserInfoItem from './UserInfoItem'
import {styles} from './style'
import {Button} from '@ui/button'
import {useCustomNavigate} from '@hooks/useCustomNavigate'

export default function UserDetailsPage() {
  const data = useLoaderData<{data: UserDetailsResponseType}>()
  const userDetails = data?.data
  const [token, setToken] = useState(userDetails.token)
  const tokenGenrateFetcher = useFetcher<any>()
  const tokenDeleteFetcher = useFetcher<any>()

  const userId = userDetails?.userId ?? 0

  const generateToken = () => {
    tokenGenrateFetcher.submit(
      {userId},
      {
        method: 'POST',
        action: `/${API.AddToken}`,
        encType: 'application/json',
      },
    )
  }
  const navigate = useCustomNavigate()

  const deleteToken = () => {
    tokenDeleteFetcher.submit(
      {userId},
      {
        method: 'POST',
        action: `/${API.DeleteToken}`,
        encType: 'application/json',
      },
    )
  }

  useEffect(() => {
    if (tokenGenrateFetcher.data && tokenGenrateFetcher.data?.data) {
      setToken(tokenGenrateFetcher.data?.data)
    }
  }, [tokenGenrateFetcher.data])

  useEffect(() => {
    if (
      tokenDeleteFetcher.data &&
      tokenDeleteFetcher.data?.data &&
      tokenDeleteFetcher.data?.data.message === TOKEN_DELETED_SUCCESSFULLY
    ) {
      setToken(null)
    }
  }, [tokenDeleteFetcher.data])

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.nameContainer}>
            <h2 style={styles.userName}>{userDetails.userName}</h2>
            <span
              style={
                userDetails.role === 'admin'
                  ? styles.admin
                  : userDetails.role === 'user'
                  ? styles.user
                  : styles.reader
              }>
              {userDetails.role}
            </span>
          </div>
        </div>
        <div>
          <UserInfoItem title={'Email'} value={userDetails?.email} />
          <Separator />
          <UserInfoItem
            title={'User Id'}
            value={userDetails?.userId?.toString()}
          />
          <Separator />

          {token ? (
            <div>
              <UserInfoItem
                title={'Token'}
                value={userDetails?.token ?? undefined}
              />

              <div style={styles.deleteContainor}>
                <Button onClick={generateToken} size={'sm'}>
                  {tokenGenrateFetcher.state === 'idle'
                    ? 'Generate'
                    : 'Genera...'}
                </Button>

                <Button
                  variant={'destructive'}
                  onClick={deleteToken}
                  size={'sm'}>
                  {tokenDeleteFetcher.state === 'idle'
                    ? 'Delete'
                    : 'Deleting...'}
                </Button>
              </div>
            </div>
          ) : (
            <div style={styles.infoItem}>
              <strong>Token</strong>
              <div style={styles.tokenContainer}>
                <Button onClick={generateToken} size={'sm'}>
                  {tokenGenrateFetcher.state === 'idle'
                    ? 'Generate'
                    : 'Generating...'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {userDetails?.role === 'admin' && (
        <div style={styles.adminPanelCont}>
          <Button
            onClick={(e) => {
              navigate('/adminPanel', {}, e)
            }}>
            Admin Panel
          </Button>
        </div>
      )}
    </div>
  )
}
