import { request } from '../../service';

async function handleClick({ e, friend, user, setMessage, history }) {
  e.preventDefault();

  const { data, error } = await request.postData({
    body: { users: [friend, user] },
    endpoint: `/chat/user`,
  });

  if (error) {
    return setMessage({ value: error.message, type: 'ALERT' });
  }

  if (data.length === 0) {
    const { data: createdData, error: createdError } = await request.postData({
      body: { isPrivate: true, users: [friend, user] },
      endpoint: '/chat',
    });

    if (createdError) {
      return setMessage({ value: error.message, type: 'ALERT' });
    }

    return history.push(`/chat/${createdData._id}`);
  }

  return history.push(`/chat/${data[0]._id}`);
}

export default handleClick;
