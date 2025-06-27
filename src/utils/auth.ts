// 定义 token 类型
type TokenType = 'ACCESS_TOKEN' | 'REFRESH_TOKEN' | 'expiresIn';

// 定义值类型映射
type TokenValueType<T extends TokenType> =
  T extends 'expiresIn' ? number : string;

/**
 * 设置令牌到本地存储
 * @param type 令牌类型
 * @param value 令牌值
 */
export function setToken<T extends TokenType>(type: T, value: TokenValueType<T>): void {
  // 对于 expiresIn，需要将 number 转为 string 再存储
  const stringValue = typeof value === 'number' ? value.toString() : value as string;
  localStorage.setItem(type, stringValue);
}

/**
 * 从本地存储获取令牌
 * @param type 令牌类型
 * @returns 令牌值或 null
 */
export function getToken<T extends TokenType>(type: T): TokenValueType<T> | null {
  const value = localStorage.getItem(type);

  // 如果没有值，返回 null
  if (value === null) return null;

  // 如果是 expiresIn，将 string 转换回 number
  if (type === 'expiresIn') {
    return parseInt(value, 10) as TokenValueType<T>;
  }

  return value as TokenValueType<T>;
}

/**
 * 从本地存储删除令牌
 * @param type 令牌类型
 */
export const removeToken = (type: TokenType) => {
  localStorage.removeItem(type);
};

/**
 * 清除所有令牌
 */
export const clearAllTokens = () => {
  removeToken('ACCESS_TOKEN');
  removeToken('REFRESH_TOKEN');
  removeToken('expiresIn');
};

// 保留原来的函数名做参考
// export const SET_ACCESS_TOKEN = (token: string) => setToken('ACCESS_TOKEN', token);
// export const GET_ACCESS_TOKEN = () => getToken('ACCESS_TOKEN');
// export const REMOVE_ACCESS_TOKEN = () => removeToken('ACCESS_TOKEN');

// export const SET_REFRESH_TOKEN = (token: string) => setToken('REFRESH_TOKEN', token);
// export const GET_REFRESH_TOKEN = () => getToken('REFRESH_TOKEN');
// export const REMOVE_REFRESH_TOKEN = () => removeToken('REFRESH_TOKEN');

// export const SET_expiresIn = (expiresIn: number) => setToken('expiresIn', expiresIn);
// export const GET_expiresIn = () => getToken('expiresIn');
// export const REMOVE_expiresIn = () => removeToken('expiresIn');
