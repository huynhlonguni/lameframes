import axios from "axios";
import { SearchType } from "./SearchType";

export const CheckImageServer = async (url) => {
	return axios.get(`${url}/L01_V001/1.jpg`);
}

export const CheckSearchServer = async (url) => {
	return axios.post(`${url}/api/data`, {
		message: "Test"
	});
}

export const SingleSearch = async (url, query, translate, k, black_list) => {
	return axios.post(`${url}/api/single-search`, {
		query: query,
		translate: translate,
		k: k,
		black_list: black_list,
	});
}

export const FusionSearch = async (url, queries, translate, k) => {
	let tmp = {

	}
	tmp[queries] = 1;
	return axios.post(`${url}/api/fusion-search`, {
		queries: tmp,
		translate: translate,
		k: k
	});
}

export const LocalSearch = async (url, query, translate, video_name, k, use_with_fusion, fact_queries) => {
	return axios.post(`${url}/api/local-search`, {
		query: query,
		translate: translate,
		video_name: video_name,
		k: k,
		use_with_fusion: use_with_fusion,
		fact_queries: fact_queries
	});
}

export const GroupSearch = async (url, query, translate, step, k, sort, black_list) => {
	return axios.post(`${url}/api/multi-scene-search`, {
		queries: [query],
		translate: translate,
		step: step,
		k: k,
		black_list: black_list,
		sort_by: sort
	});
}

export const HierarchySearch = async (url, query, translate, k1, k2, use_with_fusion, fact_queries, sort) => {
	return axios.post(`${url}/api/hierarchical-search`, {
		query: query,
		translate: translate,
		k1: k1,
		k2: k2,
		use_with_fusion: use_with_fusion,
		fact_queries: fact_queries,
		sort_by: sort
	});
}

export const SubtitleMatch = async (url, query) => {
	return axios.get(`${url}/api/match-sub-es`, {
		params: {
			query: query
		}
	});
}

export const OCRMatch = async (url, query) => {
	return axios.get(`${url}/api/match-ocr-es`, {
		params: {
			query: query
		}
	});
}

export const SubtitleIndexDrop = async (url) => {
	return axios.delete(`${url}/api/drop-index-es`);
}

export const RelatedFrameSearch = async (url, video, frame, k) => {
	return axios.post(`${url}/api/related-frame-search`, {
		video: video,
		frame: frame,
		k: k,
	});
}

export const RelatedImageSearch = async (url, image) => {
	return axios.post(`${url}/api/related-img-search`, {
	});
}

export const SearchHelper = async (type, url, content) => {
	const query = content["Query"];
	const translate = content["Translate"];
	const k = content["K"];
	const k1 = content["K1"];
	const k2 = content["K2"];
	const step = content["Step"];
	const video_name = content["Video"];
	const frame = content["Frame"];
	const use_with_fusion = content["Fusion"];
	const fact_queries = content["Queries"];
	const sort = content["Sort"];
	const black_list = content["Blacklist"];

	switch (type) {
		case SearchType.SINGLE_SEARCH:
			return SingleSearch(url, query, translate, k, black_list);
		case SearchType.FUSION_SEARCH:
			return FusionSearch(url, query, translate, k);
		case SearchType.LOCAL_SEARCH:
			return LocalSearch(url, query, translate, video_name, k, use_with_fusion, fact_queries);
		case SearchType.GROUP_SEARCH:
			return GroupSearch(url, query, translate, step, k, sort, black_list);
		case SearchType.HIERARCHY_SEARCH:
			return HierarchySearch(url, query, translate, k1, k2, use_with_fusion, fact_queries, sort);
		case SearchType.SUBTITLE_MATCH:
			return SubtitleMatch(url, query);
		case SearchType.FRAME_RELATED_SEARCH:
			return OCRMatch(url, video_name, frame, k);
		case SearchType.IMAGE_RELATED_SEARCH:
			return OCRMatch(url, query);
		default:
			return null;
	}
}