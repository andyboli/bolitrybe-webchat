import { request } from '../../service';

async function handleClick({ setMessage, event, user, history }) {
  const { error } = await request.patchData({
    endpoint: `/user/${user._id}`,
    body: { isOnline: false },
  });

  if (error) {
    return setMessage({ value: error.message, type: 'ALERT' });
  }

  event.on('connect', () => {
    event.broadcast.emit('logout');
  });

  history.push('/');

  localStorage.removeItem('token');
}

export default handleClick;
