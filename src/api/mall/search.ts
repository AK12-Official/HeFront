// 导入专门用于搜索功能的请求实例
import { searchRequest } from "@/utils/mallRequest";
import type { ProductSearchParams } from "./types";

// 高级搜索功能API
export const esProductSearchSimple = (keyword: string) => {
  return searchRequest.get('/esProduct/search/simple', {
    params: { keyword }
  });
};

export const esProductSearch = (params: ProductSearchParams) => {
  return searchRequest.get('/esProduct/search', { params });
};

export const esProductRecommend = (id: number) => {
  return searchRequest.get(`/esProduct/recommend/${id}`);
};

export default {
  esProductSearchSimple,
  esProductSearch,
  esProductRecommend
};
