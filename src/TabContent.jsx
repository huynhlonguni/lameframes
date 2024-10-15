import { useAppContext } from "./Context";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectLabel,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import TextareaAutosize from 'react-textarea-autosize';
import Thumbnail from "./Thumbnail";
import { SearchType, SearchTypeRenderer } from "./SearchType";
import { SearchHelper } from "./API";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import useLocalStorage from "use-local-storage";
import VideoViewer from "./VideoViewer";

const SearchOptions = [
	{name: "Image Search", options: [
		SearchType.SINGLE_SEARCH,
		SearchType.FUSION_SEARCH,
		SearchType.LOCAL_SEARCH,
		SearchType.MULTI_SCENE_SEARCH,
		SearchType.HIERACHICAL_SEARCH,
	]},
	{name: "Text Search", options: [
		SearchType.SUBTITLE_MATCH,
		SearchType.SUBTITLE_FUZZ,
	]}
]

const SearchArguments = {};
SearchArguments[SearchType.SINGLE_SEARCH] = ["Query", "K"];
SearchArguments[SearchType.FUSION_SEARCH] = ["Query", "K"];
SearchArguments[SearchType.LOCAL_SEARCH] = ["Query", "K", "Video"];
SearchArguments[SearchType.MULTI_SCENE_SEARCH] = ["Query", "K", "Step"];
SearchArguments[SearchType.HIERACHICAL_SEARCH] = ["Query", "K1", "K2"];
SearchArguments[SearchType.SUBTITLE_MATCH] = ["Query"];
SearchArguments[SearchType.SUBTITLE_FUZZ] = ["Query"];


const TabContent = ({content, updateContent, tab}) => {
	const {searchServer, addNewTab} = useAppContext();

	const searchMethod = content["SearchMethod"];
	const queryResult = content["Result"];

	const [viewer, setViewer] = useState();

	const updateValue = (name, value) => {
		content[name] = value;
		updateContent(content);
	}

	const doValidation = (type) => {
		const req = [];
		
		if (!(type in SearchArguments))
			return false;

		const sArgs = SearchArguments[type];

		for (let i = 0; i < sArgs.length; i++) {
			if (!(sArgs[i] in content))
				return false;
			const val = content[sArgs[i]];
			if (!val || val == "") {
				return false;
			}
		}
		return true;
	}

	const doSearch = () => {
		if (searchMethod == SearchType.NONE) return;

		if (!doValidation(searchMethod)) {
			toast.error("Input is invalid!", {
				closeOnClick: true,
			});
			return;
		}

		SearchHelper(searchMethod, searchServer, content)
		.then((res) => {
			updateValue("Result", res.data);
			console.log(res);
		})
		.catch((e) => {
			console.error("Failed to search:", e);
			toast.error("Search failled", {
				closeOnClick: true,
			});
		})
	}

	return(
		<>
		{
			viewer && 
			createPortal(
				<VideoViewer viewer={viewer} setViewer={setViewer}
							onClose={() => setViewer(null)}
							onSubmit={() => {}}
							onLocalSearch={() => {
									addNewTab({
										SearchMethod: SearchType.LOCAL_SEARCH,
										Query: content["Query"],
										Video: viewer[0]
									})
									setViewer(null);
								}
							}
				/>,
			document.body)
		}
			<div className="flex flex-col w-full grow overflow-hidden">
				<div className={cn("w-full bg-slate-200 grid grid-cols-12 gap-4 p-4 z-20", queryResult?.length && "shadow-lg")}>
					<div className="col-span-2 flex flex-col justify-start gap-2">
						<div>
							<Select value={content['SearchMethod']}
								onValueChange={(value) => {
									updateValue('SearchMethod', value);
								}}>
								<SelectTrigger className="w-full outline-none p-2 rounded-lg">
									<SelectValue placeholder={
										<SearchTypeRenderer/>
									}/>
								</SelectTrigger>
								<SelectContent className="w-full mt-1 p-2 rounded-lg shadow-lg">
									{
										SearchOptions.map((searchOpts, i) => 
											<SelectGroup key={i}>
												<SelectLabel className="p-2">{searchOpts.name}</SelectLabel>
												{
													searchOpts.options.map((opts, i) => 
														<SelectItem key={i} className="p-2 cursor-pointer hover:bg-slate-200 rounded-lg" value={opts}>
															<SearchTypeRenderer type={opts}/>
														</SelectItem>
													)
												}
											</SelectGroup>
										)
									}
								</SelectContent>
							</Select>
						</div>
						<div className="grid grid-cols-2 gap-2 empty:hidden">
							{ searchMethod in SearchArguments && 
								SearchArguments[searchMethod].filter((n) => n != "Query").map((argName) => 
									<div key={argName} className="flex flex-col gap-2">
										<div className="font-bold">{argName}</div>
										<input type="text" className="min-w-0 p-2 rounded-lg outline-none" value={content[argName]} onChange={(e) => updateValue(argName, e.target.value)} />
									</div>
								)
							}
						</div>
					</div>
					<div className="col-span-9">
						<div className="w-full">
							<TextareaAutosize value={content["Query"]} onChange={(e) => updateValue("Query", e.target.value)} className="w-full p-2 resize-none rounded-lg outline-none" />
						</div>
					</div>
					<div className="col-span-1">
						<div onClick={doSearch} className="flex cursor-pointer place-items-center justify-center gap-2 p-2 rounded-lg bg-green-700 hover:bg-green-600 text-white">
							<Search className="h-4 w-4" />
							<div>Search</div>
						</div>
					</div>
					

				</div>
				<div className="min-h-0">
					<div className="overflow-y-scroll grid grid-cols-6 gap-2 p-2 h-full no-scrollbar">
						{queryResult.map((r, i) => 
							<Thumbnail key={i} video={r.video} keyframe={r.frameid} onClick={() => setViewer([r.video, r.frameid])}/>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default TabContent;