import { GET_API_URL, POST_API_URL } from './constants';

export const getScoreFromApi = () => fetch(GET_API_URL)
    .then((data) => data.json())
    .then((data) => data);


export const addScoreToApi = (score) => fetch(POST_API_URL, {
    method: 'post',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(score),
});


export default getScoreFromApi;