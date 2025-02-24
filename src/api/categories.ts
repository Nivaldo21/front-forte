import { axiosCategories } from '../utils/axios';

export function getCategories() {
  return axiosCategories({
    url: '/categorias',
    method: 'get'
  });
}