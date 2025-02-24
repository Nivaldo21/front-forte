import {axiosClients} from '../utils/axios';

export function getClients() {
    return axiosClients({
      url: '/clientes',
      method: 'get'
    });
  }