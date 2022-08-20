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
     * @param queryData
     * @param callback
     * @param error
     */
    getIndexData(indexName, queryData, callback, error) {
        let url = getCookie('baseUrl') + indexName + '/_search'
        const api = this.resolve(url, {body: queryData});
        this.post(api, callback, error);
    }

    /**
     * 删除索引
     * @param indexName 索引名称
     * @param callback  成功回调
     * @param error     失败回调
     */
    deleteIndex(indexName, callback, error) {
        let url = getCookie('baseUrl') + indexName
        const api = this.resolve(url);
        this.delete(api, callback, error);
    }

    /**
     * 删除索引下的某个文档
     * @param indexName
     * @param docId
     * @param callback
     * @param error
     */
    deleteIndexItem(indexName, docId, callback, error) {
        let url = getCookie('baseUrl') + indexName + '/_doc/' + docId
        const api = this.resolve(url);
        this.delete(api, callback, error);
    }

    /**
     * 重设索引的只读问题
     * @param indexName 索引名称
     * @param callback  成功回调
     * @param error     失败回调
     */
    resetIndexReadOnly(indexName, callback, error) {
        let url = getCookie('baseUrl') + indexName + '/_settings'
        const api = this.resolve(url, {body: {"index.blocks.read_only_allow_delete": null}});
        this.put(api, callback, error)
    }

    /**
     * 删除所有的文档
     * @param indexName
     * @param callback
     * @param error
     */
    deleteAllDocs(indexName, callback, error) {
        let url = getCookie('baseUrl') + indexName + '/docs/_delete_by_query'
        const api = this.resolve(url, {
            body: {
                "query": {
                    "match_all": {}
                }
            }
        })
        this.post(api, callback, error)
    }


    /**
     * 批量删除文档
     * @param indexName
     * @param data
     * @param callback
     * @param error
     */
    deleteManyDocs(indexName, data, callback, error) {
        let url = getCookie('baseUrl') + indexName + '/_delete_by_query'
        const api = this.resolve(url, {body: {
                "query": {
                    "terms": {
                        "_id": data
                    }
                }
            }})
        this.post(api, callback, error)
    }
}
