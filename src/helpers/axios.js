import axios from "axios";
import { Token } from "./Token";

const instance = axios.create({ baseURL: process.env.REACT_APP_API_URL });
const token = new Token();
token.initAuthenticationToken();

export default function axiosConfig() {
    instance.defaults.headers.common['Authorization'] = token.getAuthenticationToken();
    instance.defaults.headers.post['Content-Type'] = 'application/json';
    instance.defaults.headers.post['Accept'] = 'application/json';
    return instance;
}