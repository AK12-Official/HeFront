/**
 * 统一登出工具函数
 * 清除所有可能的token和用户数据
 */

import { clearAllTokens } from './auth';
import { clearAllMallTokens } from './mallAuth';

/**
 * 清除所有用户相关的localStorage数据
 */
export const clearAllUserData = () => {
    // 清除普通用户token
    clearAllTokens();

    // 清除电商用户token
    clearAllMallTokens();

    // 清除管理员token
    localStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_info');

    // 清除用户信息
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userId');
    localStorage.removeItem('userNickname');
    localStorage.removeItem('userDesc');
    localStorage.removeItem('userScore');

    // 清除其他可能的用户数据
    localStorage.removeItem('userAvatar');
    localStorage.removeItem('userGender');
    localStorage.removeItem('userBirthday');
    localStorage.removeItem('userCity');
    localStorage.removeItem('userJob');
    localStorage.removeItem('userSignature');
    localStorage.removeItem('userIntegration');
    localStorage.removeItem('userGrowth');
    localStorage.removeItem('userMemberLevelId');

    // 清除可能的缓存数据
    localStorage.removeItem('cartData');
    localStorage.removeItem('favoriteData');
    localStorage.removeItem('recentProducts');
    localStorage.removeItem('searchHistory');

    console.log('所有用户数据已清除');
};

/**
 * 清除所有token数据（不包含用户信息）
 */
export const clearAllTokensOnly = () => {
    // 清除普通用户token
    clearAllTokens();

    // 清除电商用户token
    clearAllMallTokens();

    // 清除管理员token
    localStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_info');

    console.log('所有token数据已清除');
};

/**
 * 清除特定类型的token
 * @param type 要清除的token类型
 */
export const clearTokensByType = (type: 'user' | 'mall' | 'admin' | 'all') => {
    switch (type) {
        case 'user':
            clearAllTokens();
            break;
        case 'mall':
            clearAllMallTokens();
            break;
        case 'admin':
            localStorage.removeItem('admin_token');
            sessionStorage.removeItem('admin_info');
            break;
        case 'all':
            clearAllUserData();
            break;
        default:
            console.warn('未知的token类型:', type);
    }
};
