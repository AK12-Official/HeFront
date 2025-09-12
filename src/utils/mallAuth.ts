/**
 * 电商系统专用认证工具
 * 与原有认证系统分离，独立管理电商token
 */

type MallTokenType = 'MALL_ACCESS_TOKEN' | 'MALL_REFRESH_TOKEN' | 'MALL_EXPIRES_IN';

type MallTokenValueType<T extends MallTokenType> =
    T extends 'MALL_EXPIRES_IN' ? number : string;

/**
 * 设置电商系统令牌
 * @param type 令牌类型
 * @param value 令牌值
 */
export function setMallToken<T extends MallTokenType>(type: T, value: MallTokenValueType<T>): void {
    const stringValue = type === 'MALL_EXPIRES_IN' ? value.toString() : value as string;
    localStorage.setItem(type, stringValue);
}

/**
 * 从本地存储获取电商系统令牌
 * @param type 令牌类型
 * @returns 令牌值或 null
 */
export function getMallToken<T extends MallTokenType>(type: T): MallTokenValueType<T> | null {
    const value = localStorage.getItem(type);

    // 如果没有值，返回 null
    if (value === null) return null;

    // 如果是 MALL_EXPIRES_IN，将 string 转换回 number
    if (type === 'MALL_EXPIRES_IN') {
        return parseInt(value, 10) as MallTokenValueType<T>;
    }

    return value as MallTokenValueType<T>;
}

/**
 * 从本地存储删除电商系统令牌
 * @param type 令牌类型
 */
export const removeMallToken = (type: MallTokenType) => {
    localStorage.removeItem(type);
};

/**
 * 清除所有电商系统令牌
 */
export const clearAllMallTokens = () => {
    removeMallToken('MALL_ACCESS_TOKEN');
    removeMallToken('MALL_REFRESH_TOKEN');
    removeMallToken('MALL_EXPIRES_IN');
};

/**
 * 检查电商系统是否已登录
 * @returns 是否已登录
 */
export const isMallLoggedIn = (): boolean => {
    const accessToken = getMallToken('MALL_ACCESS_TOKEN');
    const expiresIn = getMallToken('MALL_EXPIRES_IN');

    // 检查是否有访问令牌
    if (!accessToken) {
        return false;
    }

    // 检查令牌是否过期
    if (expiresIn) {
        // 获取当前时间戳（秒）
        const now = Math.floor(Date.now() / 1000);

        // 如果当前时间超过过期时间，则令牌已过期
        if (now >= expiresIn) {
            return false;
        }
    }

    return true;
};

/**
 * 获取电商系统认证头
 * @returns 认证头字符串或null
 */
export const getMallAuthHeader = (): string | null => {
    const token = getMallToken('MALL_ACCESS_TOKEN');
    return token ? `Bearer ${token}` : null;
};
