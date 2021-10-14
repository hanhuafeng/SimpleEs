import {CONTEXT_PATH} from '@/config'
import axios from 'axios'
import {getCookie} from '@/util/Cookie'


// axios.defaults.withCredentials = true;//让ajax携带cookie，本地调试可以去掉

/**
 * 接口请求字符串拼接工具类
 * 整合了响应后端接口的一些常用功能
 * 如上一页、下一页，都通过这个工具类的缓存进行请求拼接
 * 如需要将分页全部由RestResolver进行代理可使用ProxyRestResolver
 * @author Qicheng Peng
 */
export default class RestResolver {
    constructor() {
        // 接口基础地址统一管理，便于后期接口的变化
        this.context = CONTEXT_PATH;
        // 对上一次请求的接口进行缓存
        this.lastApi = null;
        // 参数缓存
        this.lastArgs = null;
        // 当前页码
        this.currentIndex = null;
        // 上一页
        this.lastRequestIndex = null;
        // 下一页
        this.nextRequestIndex = null;
        // requestBody缓存
        this.body = null;
        // 请求头集合
        this.headers = {}
    }

    /**
     * 为请求增加头
     * @param key 字面意思
     * @param val 值
     * @returns {RestResolver}
     */
    header(key, val) {
        this.headers[key] = val
        return this
    }

    getBaseHeader(){
        delete this.headers['Authorization']
        if (getCookie('Authorization')!=null){
            this.headers['Authorization'] = "Basic " + getCookie('Authorization')
        }
        return this
    }


    newResolve(context, api, args = {}, index = -1) {
        // 只有当前请求为分页请求时才对参数进行缓存
        if (index !== -1) {
            this.lastApi = api
            this.lastArgs = args
            this.lastRequestIndex = index - 1
            this.nextRequestIndex = index + 1
            this.currentIndex = index
        }
        // 占位符替换
        api = context + api.replace('{index}', index)
        // 处理对象过滤对象中的key
        const keys = Object.keys(args)
        // URL 参数拼接
        let param = ''
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            // 拼接时要排除第一个key就是body的情况
            if (i === 0 && key !== 'body') {
                param += `?${key}=${args[key]}`
                continue
            }
            // 为了下一次请求能够获得正确的数据
            // 如果用户设置了request body那么将进行缓存
            if (key === 'body') {
                this.body = args[key]
            } else {
                param += `&${key}=${args[key]}`
            }
        }
        api += param
        return api
    }

    /**
     * 拼接请求接口
     * 其中{index}为占位符 会被替换为对应的分页请求页码
     * @param api 目标API /a/b/c/{index}
     * @param args URL参数列表 参数列表中key为body的字段将会被特殊处理
     * @param index 如果有分页带入参数
     */
    resolve(api, args = {}, index = -1) {
        // 只有当前请求为分页请求时才对参数进行缓存
        if (index !== -1) {
            this.lastApi = api
            this.lastArgs = args
            this.lastRequestIndex = index - 1
            this.nextRequestIndex = index + 1
            this.currentIndex = index
        }
        // 占位符替换
        api = this.context + api.replace('{index}', index)
        const keys = Object.keys(args)
        // URL 参数拼接
        let param = ''
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            // 拼接时要排除第一个key就是body的情况
            if (i === 0 && key !== 'body') {
                param += `?${key}=${args[key]}`
                continue
            }
            // 为了下一次请求能够获得正确的数据
            // 如果用户设置了request body那么将进行缓存
            if (key === 'body') {
                this.body = args[key]
            } else {
                param += `&${key}=${args[key]}`
            }
        }
        api += param
        return api
    }

    /**
     * 在缓存的基础上进行接口拼接
     * @param index
     * @returns {null}
     */
    index(index) {
        // 如果上一次请求的api缓存不为空并且参数不为空
        if (this.lastApi !== null && this.lastArgs !== null) {
            return this.resolve(this.lastApi, this.lastArgs, index)
        }
        return null
    }

    /**
     * 上一页
     * @returns {null}
     */
    last() {
        if (this.lastRequestIndex !== null) {
            return this.index(this.lastRequestIndex)
        }
    }

    /**
     * 下一页
     * @returns {null}
     */
    next() {
        if (this.nextRequestIndex !== null) {
            return this.index(this.nextRequestIndex)
        }
    }

    /**
     * 简单封装请求
     * @param api 通过resolve得到接口地址
     * @param success 成功的接口回调
     * @param fail 遇到错误后的接口回调
     */
    post(api, success, fail) {
        axios.post(api, this.body)
            .then(resp => {
                if (success) {
                    success(resp.data)
                }
            })
            .catch(error => {
                if (fail) {
                    fail(error)
                }
            })
    }

    /**
     * 简单封装请求
     * @param api 通过resolve得到接口地址
     * @param success 成功的接口回调
     * @param fail 遇到错误后的接口回调
     */
    get(api, success, fail) {
        // console.log(api)
        // console.log(this.headers)
        this.getBaseHeader()
        axios({
            method: 'get',
            url: api,
            responseType: 'json',
            headers: this.headers
        })
            .then(resp => {
                if (success !== undefined) {
                    success(resp.data)
                }
            })
            .catch(error => {
                if (fail !== undefined) {
                    fail(error)
                }
            })
    }

    /**
     * 简单封装请求
     * @param api 通过resolve得到接口地址
     * @param success 成功的接口回调
     * @param fail 遇到错误后的接口回调
     */
    put(api, success, fail) {
        axios.put(api, this.body)
            .then(resp => {
                if (success) {
                    success(resp.data)
                }
            })
            .catch(error => {
                if (fail) {
                    fail(error)
                }
            })
    }

    /**
     * 简单封装请求
     * @param api 通过resolve得到接口地址
     * @param success 成功的接口回调
     * @param fail 遇到错误后的接口回调
     */
    delete(api, success, fail) {
        axios.delete(api)
            .then(resp => {
                if (success !== undefined) {
                    success(resp.data)
                }
            })
            .catch(error => {
                if (fail !== undefined) {
                    fail(error)
                }
            })
    }

    deleteData(api, success, fail) {
        axios.delete(api, {data: this.body})
            .then(resp => {
                if (success !== undefined) {
                    success(resp.data)
                }
            })
            .catch(error => {
                if (fail !== undefined) {
                    fail(error)
                }
            })
    }

    // 取根目录
    getContext() {
        return this.context;
    }
}
