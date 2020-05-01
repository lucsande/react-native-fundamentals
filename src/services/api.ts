import axios from 'axios';

const api = axios.create({
  //10.0.2.2 is an alias to my machine's localhost
  //localhost would refer to the virtual machine (android emulator) localhost
  baseURL: 'http://10.0.2.2:3333',
});

export default api;
