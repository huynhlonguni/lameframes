import { cn } from "@/lib/utils";
import { Search, View, Blend, Locate, Group, Layers, TextSearch, Regex, ScanSearch, Images } from "lucide-react";

export const SearchType = Object.freeze({
	NONE: 0,
	SINGLE_SEARCH: 1,
	FUSION_SEARCH: 2,
	LOCAL_SEARCH: 3,
	GROUP_SEARCH: 4,
	HIERARCHY_SEARCH: 5,
	SUBTITLE_MATCH: 6,
	OCR_MATCH: 7,
	FRAME_RELATED_SEARCH: 8,
	IMAGE_RELATED_SEARCH: 9,
});

export const SearchTypeName = (type) => {
	switch (type) {
		case SearchType.NONE: return 'Search';
		case SearchType.SINGLE_SEARCH: return 'Single Search';
		case SearchType.FUSION_SEARCH: return 'Fusion Search';
		case SearchType.LOCAL_SEARCH: return 'Local Search';
		case SearchType.GROUP_SEARCH: return 'Group Search';
		case SearchType.HIERARCHY_SEARCH: return 'Hierarchy Search';
		case SearchType.SUBTITLE_MATCH: return 'Subtitle Match';
		case SearchType.OCR_MATCH: return 'OCR Match';
		case SearchType.FRAME_RELATED_SEARCH: return 'Similar Frame Search';
		case SearchType.IMAGE_RELATED_SEARCH: return 'Similar Image Search';
	}
}

export const SearchTypeIcon = ({type, className}) => {
	switch (type) {
		case SearchType.NONE: return <Search className={className}/>;
		case SearchType.SINGLE_SEARCH: return <View className={className}/>;
		case SearchType.FUSION_SEARCH: return <Blend className={className}/>;
		case SearchType.LOCAL_SEARCH: return <Locate className={className}/>;
		case SearchType.GROUP_SEARCH: return <Group className={className}/>;
		case SearchType.HIERARCHY_SEARCH: return <Layers className={className}/>;
		case SearchType.SUBTITLE_MATCH: return <TextSearch className={className}/>;
		case SearchType.OCR_MATCH: return <Regex className={className}/>;
		case SearchType.FRAME_RELATED_SEARCH: return <ScanSearch className={className}/>;
		case SearchType.IMAGE_RELATED_SEARCH: return <Images className={className}/>;
	}
}

export const SearchTypeRenderer = ({type, className}) => {
	if (type == null) type = SearchType.NONE;

	return(
		<div className={cn("flex place-items-center gap-2 h-full", className)}>
			<SearchTypeIcon type={type} className="size-5"/>
			<div>{SearchTypeName(type)}</div>
		</div>
	)
}

export const SearchArguments = {};
SearchArguments[SearchType.SINGLE_SEARCH] = {
	query: 'one',
	blacklist: true,
	args: [
		{ name: 'K', type: 'number' },
		{ name: 'Translate', type: 'checkbox' }
	]
};

SearchArguments[SearchType.FUSION_SEARCH] = {
	query: 'multiple',
	weight: true,
	args: [
		{ name: 'K', type: 'number' },
		{ name: 'Translate', type: 'checkbox' }
	]
};

SearchArguments[SearchType.LOCAL_SEARCH] = {
	query: 'one',
	args: [
		{ name: 'K', type: 'number' },
		{ name: 'Video', type: 'text' },
		{ name: 'Translate', type: 'checkbox' }
		// { name: 'Fusion', type: 'checkbox' }
	]
};

SearchArguments[SearchType.GROUP_SEARCH] = {
	query: 'multiple',
	blacklist: true,
	args: [
		{ name: 'K', type: 'number' },
		{ name: 'Step', type: 'number' },
		{ name: 'Sort', type: 'select', required: true, value: [
			{ name: 'Length', value: 'length'},
			{ name: 'Average', value: 'average'},
			{ name: 'Max', value: 'max'},
		]},
		{ name: 'Translate', type: 'checkbox' },
	]
};

SearchArguments[SearchType.HIERARCHY_SEARCH] = {
	query: 'one',
	args: [
		{ name: 'K1', type: 'number' },
		{ name: 'K2', type: 'number' },
		{ name: 'Sort', type: 'select', required: true, value: [
			{ name: 'Sum', value: 'sum'},
			{ name: 'Average', value: 'average'},
			{ name: 'Max', value: 'max'},
		]},
		{ name: 'Translate', type: 'checkbox' }
	]
};

SearchArguments[SearchType.SUBTITLE_MATCH] = {
	query: 'one',
	args: [
		{ name: 'Limit', type: 'number' },
	]
};

SearchArguments[SearchType.OCR_MATCH] = {
	query: 'one',
	args: [
		{ name: 'Limit', type: 'number' },
	]
};

SearchArguments[SearchType.FRAME_RELATED_SEARCH] = {
	query: 'preview',
	args: [
		{ name: 'K', type: 'number' },
		{ name: 'Video', type: 'text' },
		{ name: 'Frame', type: 'number' }
	]
};

SearchArguments[SearchType.IMAGE_RELATED_SEARCH] = {
	query: 'file',
	args: [
		{ name: 'K', type: 'number' },
		// { name: 'Image', type: 'file' }
	]
};
