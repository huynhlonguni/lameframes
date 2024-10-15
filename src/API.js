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

export const SingleSearch = async (url, query, k) => {
	return axios.post(`${url}/api/single-search`, {
		query: query,
		k: k,
		black_list: [],
	});
}

export const FusionSearch = async (url, queries, k) => {
	return axios.post(`${url}/api/fusion-search`, {
		queries: queries,
		k: k
	});
}

export const LocalSearch = async (url, query, video_name, k, use_with_fusion, fact_queries) => {
	return axios.post(`${url}/api/local-search`, {
		query: query,
		video_name: video_name,
		k: k,
		use_with_fusion: use_with_fusion,
		fact_queries: fact_queries
	});
}

export const MultiSceneSearch = async (url, query, step, k) => {
	return axios.post(`${url}/api/multi-scene-search`, {
		queries: [query],
		step: step,
		k: k,
		black_list: [],
	});
}

export const HierarchicalSearch = async (url, query, k1, k2, use_with_fusion, fact_queries) => {
	return axios.post(`${url}/api/hierarchical-search`, {
		query: query,
		k1: k1,
		k2: k2,
		use_with_fusion: use_with_fusion,
		fact_queries: fact_queries
	});
}

export const SubtitleMatch = async (url, query) => {
	return axios.get(`${url}/api/match-sub-es`, {
		params: {
			query: query
		}
	});
}

export const SubtitleFuzz = async (url, query) => {
	return axios.get(`${url}/api/fuzzy-sub-es`, {
		params: {
			query: query
		}
	});
}

export const SubtitleIndexDrop = async (url) => {
	return axios.delete(`${url}/api/drop-index-es`);
}

export const SearchHelper = async (type, url, content) => {
	const query = content["Query"];
	const k = content["K"];
	const k1 = content["K1"];
	const k2 = content["K2"];
	const step = content["Step"];
	const video_name = content["Video"];
	const use_with_fusion = content["Fusion"];
	const fact_queries = content["Queries"];

	switch (type) {
		case SearchType.SINGLE_SEARCH:
			return SingleSearch(url, query, k);
		case SearchType.FUSION_SEARCH:
			return FusionSearch(url, query, k);
		case SearchType.LOCAL_SEARCH:
			return LocalSearch(url, query, video_name, k, use_with_fusion, fact_queries);
		case SearchType.MULTI_SCENE_SEARCH:
			return MultiSceneSearch(url, query, step, k);
		case SearchType.HIERACHICAL_SEARCH:
			return HierarchicalSearch(url, query, k1, k2, use_with_fusion, fact_queries);
		case SearchType.SUBTITLE_MATCH:
			return SubtitleMatch(url, query);
		case SearchType.SUBTITLE_FUZZ:
			return SubtitleFuzz(url, query);
		default:
			return null;
	}
}