import {Link} from 'react-router-dom'
import {Div, Title} from '../../components'
import { useAuth } from '../../contexts'

export default function Hero() {
  const {loggedUser} = useAuth();
  return (
    <div className="flex-col items-center justify-center p-4 ">
      <Title>Welcome Page</Title>
      {loggedUser &&(
        <Div className='flex items-center justify-center'>
          <Link to='/room' className="items-center ml-4 btn btn-link">go to chat</Link>
        </Div>
      )}
    </div>
  )
}
