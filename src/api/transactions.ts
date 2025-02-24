import type Transaccion from '../models/Transaccion';
import {axiosTransactions} from '../utils/axios';

export function getTransactions(filters = {}) {
  return axiosTransactions({
    url: '/transacciones',
    method: 'get',
    params: filters
  });
}

export function addTransaction(data:Transaccion) {
  return axiosTransactions({
    url: '/transacciones',
    method: 'post',
    data
  });
}

export function updateTransaction(data:Transaccion) {
  return axiosTransactions({
    url: `/transacciones/${data._id}`,
    method: 'put',
    data
  });
}

export function _deleteTransaction(transactionId:string|number) {
  return axiosTransactions({
    url: `/transacciones/${transactionId}`,
    method: 'delete'
  });
}