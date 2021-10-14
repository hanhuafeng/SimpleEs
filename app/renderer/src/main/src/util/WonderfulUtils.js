
/**
 * 判断字符串、数组、对象是否空
 * @param target
 * @returns {boolean}
 */
export function isEmpty (target) {
  if (target instanceof Array) {
    return target.length === 0
  }
  return target === undefined || target === null || target === '' || target === 'null' || target === 'undefined'
}

/**
 * 如果一个对象在逻辑上是不为空的，
 * 则需要判断他是否所有的key都不为空
 * @param target
 * @returns {boolean}
 */
export function isEmptyObject (target) {
  const keys = Object.keys(target)
  for (let key of keys) {
    if (isEmpty(target[key])) {
      return false
    }
  }
  return true
}

export function replacePxInteger (target) {
  return parseInt(target.replace('px', ''))
}

export function replacePxFloat (target) {
  return parseFloat(target.replace('px', ''))
}

/**
 * 清空一个对象
 * @param target
 */
export function clearObject (...target) {
  for (let item of target) {
    const keys = Object.keys(target)
    for (let key of keys) {
      item[key] = {}
    }
  }
}

/**
 * 判断一个布尔数组是否全部为真
 * @param target
 * @returns {boolean}
 */
export function accord (...target) {
  for (let item of target) {
    if (item === false) {
      return false
    }
  }
  return true
}

/**
 * 深度拷贝一个对象 (不受指针影响)
 * @param target
 * @returns {any}
 */
export function clone (target) {
  return JSON.parse(JSON.stringify(target))
}

/**
 * 判断对象是否相等
 * @param a
 * @param b
 * @returns {boolean}
 */
export function equals (a, b) {
  if (a instanceof Object && b instanceof Object) {
    let keys = Object.keys(a)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const dataA = a[key]
      const dataB = b[key]
      if (!(dataA instanceof Array) && !(dataB instanceof Array)) {
        if (dataB !== dataA) {
          return false
        }
      } else {
        if (!equals(dataA, dataB)) {
          return false
        }
      }
    }
  } else {
    return a === b
  }
  return true
}

/**
 * base64转二进制
 * @param urlData
 * @returns {Blob}
 */
export function base64ToImage (urlData) {
  const bytes = window.atob(urlData.split(',')[1])

  // 处理异常,将ascii码小于0的转换为大于0
  const ab = new ArrayBuffer(bytes.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }

  return new Blob([ab], {type: 'image/jpeg'})
}

export function emptyIfUndefined (target) {
  if (isEmpty(target)) {
    return ''
  }
  return target
}
