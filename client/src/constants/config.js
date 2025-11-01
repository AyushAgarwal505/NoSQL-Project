export const API_NOTIFICATION_MESSAGES = {
    loading: {
        title: 'Loading...',
        message: 'Data is being loaded, please wait',
        type: 'info',
    },
    success: {
        title: 'Success',
        message: 'Data successfully loaded',
        type: 'success',
    },
    responseFailure: {
        title: 'Error!',
        message: 'Something went wrong while fetching response from server. Please try again.',
        type: 'error',
    },
    requestFailure: {
        title: 'Error!',
        message: 'Something went wrong while parsing request data. Please try again.',
        type: 'error',
    },
    error: {
        title: 'Error!',
        message: 'Something went wrong',
        type: 'error',
    },
    networkError: {
        title: 'Network Error',
        message: 'Unable to connect to the server, please check your internet connection',
        type: 'error',
    },
};

//API Service Calls
export const SERVICE_URLS = {
    userSignup: { url: '/signup', method: 'POST' },
    userLogin: { url: '/login', method: 'POST' },
    uploadFile: { url: '/file/upload', method: 'POST' },
    createPost: { url: 'create', method: 'POST' }, 
    getAllPosts: { url: '/posts', method: 'GET', params: true },
    getPostById: { url: 'post', method: 'GET', query: true },
    updatePost: { url: 'update', method: 'PUT', query: true },
    deletePost: { url: 'delete', method: 'DELETE', query: true },
}