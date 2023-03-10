import { request } from '../../service';

async function handleClick({ event, body, history, endpoint, setMessage }) {
  event.preventDefault();

  const { error } = await request.patchData({ body, endpoint });

  if (error) {
    return setMessage({ value: error.message, type: 'ALERT' });
  }

  history.push('/people');
}

async function handleSubmit({ event, image, history, endpoint, setMessage }) {
  event.preventDefault();

  const form = new FormData();

  form.append('image', image);

  const { error } = await request.patchImage({ form, endpoint });

  if (error) {
    return setMessage({ value: error.message, type: 'ALERT' });
  }

  history.push('/people');
}

export { handleClick, handleSubmit };
