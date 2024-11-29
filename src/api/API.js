import axios from 'axios';
import {interceptorsRequest, interceptorsRequestError, interceptorsResponse, interceptorsResponseError} from './interceptors.js';

let API = axios.create({
      // baseURL: 'http://192.168.43.147:5000/api',
      baseURL: 'https://node-dk-product-xi.vercel.app/api',
      responseType: 'json',
});

API.defaults.headers.post['content-type'] = 'application/json';

API.defaults.headers.get.Accept = 'application/json';

API.interceptors.request.use(
      request => {
            const interceptorsReq = interceptorsRequest(request);
            return interceptorsReq;
      },

      error => {
            const promiseError = interceptorsRequestError(error);
            throw promiseError;
      },
);

API.interceptors.response.use(
      response => {
            const interceptorsRes = interceptorsResponse(response);
            return interceptorsRes;
      },

      error => {
            const responseError = interceptorsResponseError(error);
            throw responseError;
      },
);

export default API;
