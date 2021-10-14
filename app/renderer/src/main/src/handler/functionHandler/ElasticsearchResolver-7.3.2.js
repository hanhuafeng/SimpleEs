import ProxyRestResolver from "../ProxyRestResolver";
import {getCookie} from "@/util/Cookie";


export default class RiskRes extends ProxyRestResolver {
    constructor() {
        super();
    }

    /**
     * 测试登录es
     * @param callback
     * @param error
     */
    loginToEs(callback, error) {
        let url = getCookie('baseUrl')
        const api = this.resolve(url);
        this.get(api, callback, error);
    }

    /**
     * 获取es的集群状态
     * @param callback
     * @param error
     */
    getEsClusterStatus(callback, error) {
        let url = getCookie('baseUrl') + '_cluster/health?pretty'
        const api = this.resolve(url);
        this.get(api, callback, error);
    }

    /**
     * 获取所有的索引信息
     * @param callback
     * @param error
     */
    getAllIndex(callback, error) {
        let url = getCookie('baseUrl') + '_cat/indices?format=json'
        const api = this.resolve(url);
        this.get(api, callback, error);
    }

    /**
     * 获取每个节点分片数量、占用空间
     * @param callback
     * @param error
     */
    getAllocationInfo(callback, error) {
        let url = getCookie('baseUrl') + '_cat/allocation?v&format=json'
        const api = this.resolve(url);
        this.get(api, callback, error);
    }

    /**
     * 获取所有节点的信息
     * @param callback
     * @param error
     */
    getAllNodesInfo(callback, error) {
        let url = getCookie('baseUrl') + '_cat/nodes?v&format=json&h=' +
            'http,version,jdk,disk.total,disk.used,disk.avail,disk.used_percent,heap.current,heap.percent,heap.max,ram.current,ram.percent,ram.max,master,name,cpu,load_1m,load_5m,load_15m'
        const api = this.resolve(url);
        this.get(api, callback, error);
    }

    /**
     * 获得索引的列名
     * @param indexName
     * @param callback
     * @param error
     */
    getIndexColumnHeads(indexName, callback, error) {
        let url = getCookie('baseUrl') + indexName + '/_mapping'
        const api = this.resolve(url);
        this.get(api, callback, error);
    }

    /**
     * 获取索引数据
     * @param indexName
     * @param callback
     * @param error
     */
    getIndexData(indexName, callback, error) {
        let url = getCookie('baseUrl') + indexName + '/_search'
        const api = this.resolve(url);
        this.get(api, callback, error);
    }
}
