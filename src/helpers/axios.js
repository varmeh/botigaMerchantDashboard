import axios from "axios";

const instance = axios.create({ baseURL: 'https://dev.botiga.app' });

instance.defaults.headers.common['Authorization'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZmMxOGU0YmIxOWRjNDliM2RmODQ3ZSIsImlhdCI6MTYxMjA0NTQ2NywiZXhwIjoxNjE0NjM3NDY3fQ.yixJsoKZjwaC9elFqvh3srdyyjb1S_DIIcx_NMNPoIw';
instance.defaults.headers.post['Content-Type'] = 'application/json';
instance.defaults.headers.post['Accept'] = 'application/json';

export default function() { return instance; }