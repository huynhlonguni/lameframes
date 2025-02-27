import Thumbnail from "./Thumbnail";
import { ChevronsUpDown } from "lucide-react";
import { SearchType } from "../SearchType";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils";
  

const QueryResult = ({result, type, setViewer, className, onFrameSearch}) => {
	if (type == SearchType.SINGLE_SEARCH
		|| type == SearchType.FUSION_SEARCH
		|| type == SearchType.LOCAL_SEARCH
		|| type == SearchType.IMAGE_RELATED_SEARCH
		|| type == SearchType.FRAME_RELATED_SEARCH)
		return(
			<div className={cn("grid grid-cols-6 gap-1 p-2", className)}>
				{result.result.map((r, i) => 
					<Thumbnail onFrameSearch={onFrameSearch} key={i} video={r.video} keyframe={r.frameid} onClick={() => setViewer([r.video, r.frameid])}/>
				)}
			</div>
		)

	if (type == SearchType.OCR_MATCH)
		return(
			<div className={cn("grid grid-cols-6 gap-1 p-2", className)}>
				{result.map((r, i) =>
					<div key={i} className="">
						<Thumbnail onFrameSearch={onFrameSearch} video={r.video} keyframe={r.frameid} onClick={() => setViewer([r.video, r.frameid])}>
							{r.text}
						</Thumbnail>
					</div>
				)}
			</div>
		)	

	if (type == SearchType.GROUP_SEARCH || type == SearchType.HIERARCHY_SEARCH) {
		return(
			<div className={cn("grid grid-cols-6 gap-1 p-2", className)}>
				{result.result.map((r, i) => 
					r.results.map((r2, i2) => 
						<Thumbnail onFrameSearch={onFrameSearch} key={i2} video={r2.video} keyframe={r2.frameid} colorId={i}
									onClick={() => setViewer([r2.video, r2.frameid])}/>
					)
				)}
			</div>
		)
	}

	if (type == SearchType.SUBTITLE_MATCH)
		return(
			<div className={cn("p-4 space-y-2", className)}>
				{result.map((r, i) =>
					<Collapsible key={i} defaultOpen={true} className="p-2 space-y-2 border-2 rounded-xl">
						<CollapsibleTrigger className="w-full">
							<div className="flex gap-2 font-bold place-items-center">
								<ChevronsUpDown className="size-3"/>
								<div>{r.video}:</div>
								<div className="text-left">{r.text}</div>
							</div>
						</CollapsibleTrigger>
						<CollapsibleContent className="grid grid-cols-6 gap-2 min-w-0">
							{r.frameid.map((f, i2) => 
								<Thumbnail onFrameSearch={onFrameSearch} key={i2} video={r.video} keyframe={f}
											onClick={() => setViewer([r.video, f])}/>
							)}
						</CollapsibleContent>
					</Collapsible>)
				}
				{/* {result.map((r, i) =>
					<Collapsible key={i} defaultOpen={true} className="max-w-max p-2 space-y-2 border-2 rounded-xl">
						<CollapsibleTrigger className="">
							<div className="flex gap-2 font-bold place-items-center">
								<ChevronsUpDown className="size-3"/>
								<div>{r.video}:</div>
								<div className="text-left">{r.text}</div>
							</div>
						</CollapsibleTrigger>
						<CollapsibleContent className="flex flex-wrap gap-2 min-w-0 max-w-max">
							{r.frameid.map((f, i2) => 
								<Thumbnail onFrameSearch={onFrameSearch} key={i2} video={r.video} keyframe={f} hideText={true}
											onClick={() => setViewer([r.video, f])}/>
							)}
						</CollapsibleContent>
					</Collapsible>)
				} */}
				
			</div>
		)

	return(
		<div className={cn("", className)}>
			
		</div>
	)
};

export default QueryResult;