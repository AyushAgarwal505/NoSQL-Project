import axios from 'axios';
import { API_NOTIFICATION_MESSAGES, SERVICE_URLS } from '../constants/config';
import { getAccessToken } from '../utils/common-utils.js';
import { getType } from '../utils/common-utils.js';

const API_URL = 'http://localhost:8000';

const axiosInstance = axios.create({ 
    baseURL: API_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }, // default for JSON requests
});

// Request interceptor
axiosInstance.interceptors.request.use(
    function (config) {
        if (config.TYPE.params){
            config.params = config.TYPE.params;
        } else if (config.TYPE.query){
            config.url = config.url + '/' + config.TYPE.query;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    function (response) {
        return processResponse(response);
    },
    function (error) {
        return Promise.reject(processError(error));
    }
);

// Process success response
const processResponse = (response) => {
    if (response?.status === 200) {
        return { isSuccess: true, data: response.data };
    } else {
        return {
            isFailure: true,
            status: response?.status,
            msg: response?.msg,
            code: response?.code,
        };
    }
};

// Process error response
const processError = (error) => {
    if (error.response) {
        console.log('error in response', error.toJSON());
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.responseFailure,
            code: error.response.status
        };
    } else if (error.request) {
        console.log('error in request', error.toJSON());
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.requestFailure,
            code: ""
        };
    } else {
        console.log('error in network', error.toJSON());
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.networkError,   
            code: ""
        };
    }
};

// API object
const API = {};

// Dynamically create API methods
for (const [key, value] of Object.entries(SERVICE_URLS)) {
    API[key] = (body, showUploadProgress, showDownloadProgress, isMultipart = false) =>
        axiosInstance({
            url: value.url,
            method: value.method,
            data: value.method === 'DELETE' ? {}:body,
            responseType: value.responseType,
            headers: {
                ...(isMultipart ? { 'Content-Type': 'multipart/form-data' } : {}),
                Authorization: getAccessToken(),
            },
            TYPE: getType(value, body),
            onUploadProgress: function (progressEvent) {
                if (showUploadProgress && progressEvent.total) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    showUploadProgress(percentCompleted);
                }
            },
            onDownloadProgress: function (progressEvent) {
                if (showDownloadProgress && progressEvent.total) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    showDownloadProgress(percentCompleted);
                }
            }
        });
};

export { API };
