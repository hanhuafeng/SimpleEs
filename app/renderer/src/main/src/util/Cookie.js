import './LocalStorageUtil'
import {getItem, removeItem, setItem} from "@/util/LocalStorageUtil";
/**
 * 读取Cookie值
 * @author Qicheng Peng
 * @param name cookie 的 key
 * @returns {*}
 */
export function getCookie(name) {
    // let arr
    // const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    // if ((arr = document.cookie.match(reg))) {
    //     return unescape(arr[2])
    // } else {
    //     return null
    // }
    let item = getItem(name)
    if (item != null && typeof item !== 'undefined'){
        return getItem(name).value
    }
    return null
}

/**
 * 设置cookie
 * @param cname
 * @param cvalue
 * @param exdays
 */
export function setCookie(cname, cvalue, exdays) {
    // const d = new Date();
    // d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    // const expires = "expires=" + d.toUTCString();
    // document.cookie = cname + "=" + cvalue + "; " + expires;
    setItem(cname,cvalue)
}

/**
 * 删除cookie
 * @param c_name
 */
export function delCookie(c_name) {
    // setCookie(c_name, "", -1)
    removeItem(c_name)
}
