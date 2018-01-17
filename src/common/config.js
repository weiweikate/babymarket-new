/**
 * Created by lenovo on 2017/11/21.
 */
import axios from 'axios'
import { _baseUrl } from './request.js'
// ����axiosʵ��
if(process.env.NODE_ENV === 'production'){
    //������������
    axios.defaults.baseURL = _baseUrl
}else if(process.env.NODE_ENV === 'development'){
    //������������
    //�ƽܽӿ�http://192.168.1.122:8884
    axios.defaults.baseURL = 'api'
    //summer�ӿ� 192.168.1.113:8884
    // axios.defaults.baseURL = 'http://106.14.44.87:8884'
}else if(process.env.NODE_ENV === 'test'){
    //���Ի�������
    axios.defaults.baseURL = 'api'
}
// axios.defaults.timeout = 80000 // ����ʱʱ��
// ����ȫ�ֵ��������������ļ�϶
axios.defaults.retry = 4
axios.defaults.retryDelay = 1000

axios.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    var config = err.config
    // If config does not exist or the retry option is not set, reject
    if(!config || !config.retry) return Promise.reject(err)

    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0

    // Check if we've maxed out the total number of retries
    if(config.__retryCount >= config.retry) {
        // Reject with the error
        return Promise.reject(err)
    }

    // Increase the retry count
    config.__retryCount += 1

    // Create new promise to handle exponential backoff
    var backoff = new Promise(function(resolve) {
        setTimeout(function() {
            resolve()
        }, config.retryDelay || 1)
    });

    // Return the promise in which recalls axios to retry the request
    return backoff.then(function() {
        return axios(config)
    })
})
export default axios
