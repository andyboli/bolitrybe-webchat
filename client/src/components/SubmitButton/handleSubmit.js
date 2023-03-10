import { request } from '../../service';

async function handleSubmit({ body, e, endpoint, history, setMessage, setUser }) {
  e.preventDefault();

  const { data, error } = await request.postData({ body, endpoint });

  if (error) {
    return setMessage({ value: error.message, type: 'ALERT' });
  }

  const { token, ...user } = data;

  localStorage.setItem('token', token);

  const { error: errorUpdate } = await request.patchData({
    endpoint: `/user/${data._id}`,
    body: { isOnline: true },
  });

  if (errorUpdate) {
    setMessage({ value: errorUpdate.message, type: 'ALERT' });

    return history.push('/');
  }

  setUser(user);

  history.push('/chat/bolichat');
}

export default handleSubmit;
