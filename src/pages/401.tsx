import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

const HttpPage401 = () => {
  const navigate = useNavigate()

  return (
    <Result
      status="403"
      title="401"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button type="primary" onClick={() => navigate('/login')}>
          Back Login
        </Button>
      }
    />
  )
}

export default HttpPage401
