import { SearchType } from "../SearchType";

const TranslatedQueryRenderer = ({type, data}) => {
	if (type == SearchType.SINGLE_SEARCH || type == SearchType.LOCAL_SEARCH || type == SearchType.HIERARCHY_SEARCH)
		return(
			<div className="flex flex-col gap-1 pt-2">
				<div className="font-bold">
					Processed Query
				</div>
				<div>
					{data?.query}
				</div>
			</div>
		)
	
	if (type == SearchType.FUSION_SEARCH || type == SearchType.GROUP_SEARCH) 
		return(
			<div className="flex flex-col gap-1 pt-2">
				<div className="font-bold">
					Processed Query
				</div>
				<div>
					{Object.keys(data?.query)[0]}
				</div>
			</div>
		)

	return(
		<div></div>
	)
}

export default TranslatedQueryRenderer;