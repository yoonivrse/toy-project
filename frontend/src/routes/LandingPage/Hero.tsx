import {Link} from 'react-router-dom'
import {Div, Title} from '../../components'
import { useAuth } from '../../contexts'

export default function Hero() {
  const {loggedUser} = useAuth();
  return (
    <div className="flex-col justify-center items-center p-4">
      <Title>Welcome Page</Title>
      {loggedUser &&(
        <Div className='flex justify-center items-center'>
          <Link to='/board' className="btn btn-link ml-4 items-center">go to board</Link>
        </Div>
      )}
    </div>
  )
}
