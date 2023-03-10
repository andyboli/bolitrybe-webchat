import { request } from '../../service';

async function handleClick({ e, content, id, setMessage, setUpdate }) {
  e.preventDefault();

  const body = {
    content,
    chatId: id,
  };

  const { error } = await request.postData({ body, endpoint: '/message' });
  console.log(error);
  if (error) {
    return setMessage({ value: error.message, type: 'ALERT' });
  }

  document.getElementById('ChatForm').reset();

  setUpdate((state) => !state);
}

export default handleClick;
