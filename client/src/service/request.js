import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

function handleError({ error = {} }) {
  console.error(error);

  if (error.response) {
    return { error: { ...error.response.data.error, status: error.message } };
  }
  if (error.request || !error.message) {
    return {
      error: { message: 'Server internal error', status: error.message },
    };
  }
  return { error: { status: error.message } };
}

function headers() {
  return { Authorization: localStorage.getItem('token') };
}

async function getData({ endpoint }) {
  return axios
    .get(`${BASE_URL}${endpoint}`, { headers: headers() })
    .catch((error) => handleError({ error }));
}

async function patchData({ body, endpoint }) {
  return axios
    .patch(`${BASE_URL}${endpoint}`, body, { headers: headers() })
    .catch((error) => handleError({ error }));
}

async function patchImage({ form, endpoint }) {
  return axios
    .patch(`${BASE_URL}${endpoint}`, form, { headers: headers() })
    .catch((error) => handleError({ error }));
}

async function postData({ body, endpoint }) {
  return axios
    .post(`${BASE_URL}${endpoint}`, body, { headers: headers() })
    .catch((error) => handleError({ error }));
}

async function validToken({ endpoint }) {
  return axios
    .get(`${BASE_URL}${endpoint}`, {
      headers: headers(),
    })
    .catch((error) => handleError({ error }));
}

const request = { getData, patchData, patchImage, postData, validToken };

export default request;
