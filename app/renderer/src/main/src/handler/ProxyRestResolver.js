import RestResolver from './BaseRestResolver'
import {isEmpty} from '@/util/WonderfulUtils'

/**
 * 可代理分页的RestResolver
 * 抽离是为了让RestResolver继续适配之前的代码
 * @author Qicheng Peng
 */
export default class ProxyRestResolver extends RestResolver {
    constructor() {
        super()
        // 缓存回调处理
        this.cachedCallback = null
        // 缓存分页大小
        this.cachedPageSize = 0
        // 异常处理
        this.handler = null
        // 请求之前的回调
        this.preReq = null
    }

    /**
     * 更新缓存分页大小
     * @param size 新的大小
     * @returns {ProxyRestResolver}
     */
    cacheSize(size) {
        this.cachedPageSize = size
        return this
    }

    /**
     * 当后端放回空数据集时的回调
     * @param callback
     * @returns {ProxyRestResolver}
     */
    empty(callback) {
        this.emptyCallback = callback
        return this
    }

    /**
     * 可用于通知加载状态开始
     * @param previous
     * @returns {ProxyRestResolver}
     */
    previous(previous) {
        this.preReq = previous
        return this
    }

    /**
     * 请求回调设置
     * @param callback
     */
    response(callback) {
        this.cachedCallback = callback
        return this
    }

    error(callback) {
        this.handler = callback
        return this
    }

    /**
     * 代理分页请求
     * @param api
     */
    proxy(api) {
        if (this.cachedCallback !== null) {
            if (this.preReq !== null) {
                this.preReq()
            }
            // 采用POST请求，后端接口必须要支持POST
            super.post(api, resp => {
                if (resp.code === 200) {
                    if (!isEmpty(this.cachedCallback)) {
                        this.cachedCallback(resp)
                    }
                } else if (resp.code === 402) {
                    if (!isEmpty(this.emptyCallback)) {
                        this.emptyCallback(resp)
                    }
                }
            }, this.handler)
        } else {
            throw Error('You should set response callback before request')
        }
        return this
    }
}
