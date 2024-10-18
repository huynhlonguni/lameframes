import { cn } from "@/lib/utils";
import { SearchType } from "../SearchType";

const TranslatedQueryRenderer = ({type, data, className}) => {
	if (type == SearchType.SINGLE_SEARCH || type == SearchType.LOCAL_SEARCH || type == SearchType.HIERARCHY_SEARCH)
		return(
			<div className={cn("flex flex-col gap-1", className)}>
				<div>
					{data?.query}
				</div>
			</div>
		)
	
	if (type == SearchType.FUSION_SEARCH) 
		return(
			<div className={cn("flex flex-col gap-1", className)}>
				<div>
					{Object.keys(data?.query)[0]}
				</div>
			</div>
		)

	if (type == SearchType.GROUP_SEARCH) 
		return(
			<div className={cn("flex flex-col gap-1", className)}>
				<div>
					{(data?.query)[0]}
				</div>
			</div>
		)
	

	return(
		<div></div>
	)
}

export default TranslatedQueryRenderer;