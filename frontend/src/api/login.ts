import http from '../utils/http';

interface PostLoginParams {
  username: string;
  password: string;
}

interface PostLoginResponse {
  token: string;
}

async function postLogin(params: PostLoginParams) {
  try {
    const { data } = await http.post<PostLoginResponse>('/login', params);
    return {
      error: false,
      data,
    };
  } catch (error) {
    return {
      error: true,
      data: null,
    };
  }
}

export default postLogin;
