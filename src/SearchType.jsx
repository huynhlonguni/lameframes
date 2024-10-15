import { cn } from "@/lib/utils";
import { Search, View, Blend, Locate, Images, Layers, TextSearch, Regex } from "lucide-react";

export const SearchType = Object.freeze({
	NONE: 0,
	SINGLE_SEARCH: 1,
	FUSION_SEARCH: 2,
	LOCAL_SEARCH: 3,
	MULTI_SCENE_SEARCH: 4,
	HIERACHICAL_SEARCH: 5,
	SUBTITLE_MATCH: 6,
	SUBTITLE_FUZZ: 7,
});

export const SearchTypeName = (type) => {
	switch (type) {
		case SearchType.NONE: return 'Search';
		case SearchType.SINGLE_SEARCH: return 'Single Search';
		case SearchType.FUSION_SEARCH: return 'Fusion Search';
		case SearchType.LOCAL_SEARCH: return 'Local Search';
		case SearchType.MULTI_SCENE_SEARCH: return 'Multi Scene Search';
		case SearchType.HIERACHICAL_SEARCH: return 'Hierachical Search';
		case SearchType.SUBTITLE_MATCH: return 'Subtitle Match';
		case SearchType.SUBTITLE_FUZZ: return 'Subtitle Fuzz';
	}
}

export const SearchTypeIcon = ({type, className}) => {
	switch (type) {
		case SearchType.NONE: return <Search className={className}/>;
		case SearchType.SINGLE_SEARCH: return <View className={className}/>;
		case SearchType.FUSION_SEARCH: return <Blend className={className}/>;
		case SearchType.LOCAL_SEARCH: return <Locate className={className}/>;
		case SearchType.MULTI_SCENE_SEARCH: return <Images className={className}/>;
		case SearchType.HIERACHICAL_SEARCH: return <Layers className={className}/>;
		case SearchType.SUBTITLE_MATCH: return <TextSearch className={className}/>;
		case SearchType.SUBTITLE_FUZZ: return <Regex className={className}/>;
	}
}

export const SearchTypeRenderer = ({type, className}) => {
	if (type == null) type = SearchType.NONE;

	return(
		<div className={cn("flex place-items-center gap-2", className)}>
			<SearchTypeIcon type={type} className="size-5"/>
			<div>{SearchTypeName(type)}</div>
		</div>
	)
}