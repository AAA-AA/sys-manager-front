import axios from 'axios';

let base = 'http://localhost:8085/security';

/**用户管理相关接口**/
let user = "user";
export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/${user}/getAll`, { params: params }); };

export const getUserListPage = params => { return axios.post(`${base}/${user}/list`, params).then(res => res.data); };

export const removeUser = params => { return axios.get(`${base}/${user}/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/${user}/batchremove`, { params: params }); };

export const updateUser = params => { return axios.post(`${base}/${user}/update`,  params ).then(res => res.data)};

export const addUser = params => { return axios.post(`${base}/${user}/add`, params).then(res => res.data)};


/**角色管理相关接口**/
let role = "role";
export const getRoleList = params => { return axios.get(`${base}/${role}/getAll`, { params: params }); };

export const getRoleListPage = params => { return axios.post(`${base}/${role}/list`, params).then(res => res.data); };

export const removeRole = params => { return axios.get(`${base}/${role}/remove`, { params: params }); };

export const updateRole = params => { return axios.post(`${base}/${role}/update`,  params ).then(res => res.data)};

export const addRole = params => { return axios.post(`${base}/${role}/add`, params).then(res => res.data)};


/**角色管理相关接口**/
let menu = "menu";
export const getMenuList = params => { return axios.get(`${base}/${menu}/getAll`, { params: params }); };

export const getMenuListPage = params => { return axios.post(`${base}/${menu}/list`, params).then(res => res.data); };

export const removeMenu = params => { return axios.get(`${base}/${menu}/remove`, { params: params }); };

export const updateMenu = params => { return axios.post(`${base}/${menu}/update`,  params ).then(res => res.data)};

export const addMenu = params => { return axios.post(`${base}/${menu}/add`, params).then(res => res.data)};

