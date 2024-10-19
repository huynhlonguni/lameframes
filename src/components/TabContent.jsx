import { useAppContext } from "../Context";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectLabel,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Search, Ban, ChevronsUpDown, CornerLeftUp } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import TextareaAutosize from 'react-textarea-autosize';
import { SearchType, SearchTypeRenderer, SearchArguments } from "../SearchType";
import { SearchHelper } from "../API";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import VideoViewer from "./VideoViewer";
import QueryResult from "./QueryResult";
import ArgumentField from "./ArgumentField";
import { SubmissionSubmitKIS, SubmissionSubmitQA } from "../SubmissionAPI";
import Thumbnail from "./Thumbnail";
import TranslatedQueryRenderer from "./TranslatedQueryRenderer";

const SearchOptions = [
	{name: "Query Search", options: [
		SearchType.SINGLE_SEARCH,
		SearchType.FUSION_SEARCH,
		SearchType.LOCAL_SEARCH,
		SearchType.GROUP_SEARCH,
		SearchType.HIERARCHY_SEARCH,
	]},
	{name: "Text Search", options: [
		SearchType.SUBTITLE_MATCH,
		SearchType.OCR_MATCH,
	]},
	{name: "Image Search", options: [
		// SearchType.IMAGE_RELATED_SEARCH,
		// SearchType.FRAME_RELATED_SEARCH,
	]}
]

const TabContent = ({content, updateContent, tab}) => {
	const {searchServerUrl, addNewTab} = useAppContext();

	const [isSearching, setIsSearching] = useState(false);

	const {sessionId, evaluationId} = useAppContext();

	const searchMethod = content["SearchMethod"];
	const queryResult = content["Result"];
	const queryEmpty = Object.keys(queryResult).length === 0;

	const [viewer, setViewer] = useState();

	const updateValue = (name, value) => {
		content[name] = value;
		updateContent(content);
	}

	const doValidation = (type) => {
		if (!(type in SearchArguments))
			return false;

		const sArgs = SearchArguments[type].args;

		for (const [key, value] of Object.entries(sArgs)) {
			// if (!(key in content))
			// 	return false;
			// const val = content[key];
			// // if (val == null || val == "") {
			// // 	return false;
			// // }
		}
		return true;
	}

	const doSearch = () => {
		if (searchMethod == SearchType.NONE || !doValidation(searchMethod)) {
			toast.error("Input is invalid!", {
				closeOnClick: true,
			});
			return;
		}

		if (isSearching) {
			toast.warn("Another search is in process!", {
				closeOnClick: true,
			})
			return;
		}

		setIsSearching(true);

		SearchHelper(searchMethod, searchServerUrl, content)
		.then((res) => {
			updateValue("Result", res.data);
			updateValue("ResultMethod", searchMethod);
			setIsSearching(false);
			console.log(res);
		})
		.catch((e) => {
			console.error("Failed to search:", e);
			toast.error(`Search failed: ${e.message}`, {
				closeOnClick: true,
			});
			setIsSearching(false);
		})
	}

	const textAreaKeydown = (e) => {
		if (e.keyCode == 13 && !e.shiftKey) {
			e.preventDefault();
			doSearch();
		}
	}

	const submit = (video, frameMS, qa) => {
		if (!qa || qa == '') {
			SubmissionSubmitKIS(sessionId, evaluationId, video, frameMS)
			.then((res) => {
				if (res.data.submission != "CORRECT") {
					toast.error(`Submission wrong`, {
						closeOnClick: true
					})
					return;
				}
				toast(`Submit successful!`, {
					closeOnClick: true
				})
			})
			.catch((err) => {
				console.log(err);
				toast.error(`Submit failed: ${err.response.data.description}`, {
					closeOnClick: true
				})
			})
			return;
		}

		SubmissionSubmitQA(sessionId, evaluationId, qa, video, frameMS)
		.then((res) => {
			if (res.data.submission != "CORRECT") {
				toast.error(`Submission wrong`, {
					closeOnClick: true
				})
				return;
			}
			toast(`Submit successful!`, {
				closeOnClick: true
			})
		})
		.catch((err) => {
			console.log(err);
			toast.error(`Submit failed: ${err.response.data.description}`, {
				closeOnClick: true
			})
		})
		return;
	}

	const onLocalSearch = () => {
		addNewTab({
			SearchMethod: SearchType.LOCAL_SEARCH,
			Query: content["Query"],
			Video: viewer[0]
		})
		setViewer(null);
	}

	const removeFromBlacklist = (vid) => {
		const bl = content["Blacklist"];

		const index = bl.indexOf(vid);
		if (index > -1) {
			bl.splice(index, 1);
		}
		
		updateValue("Blacklist", bl);
	}

	const addBlacklist = () => {
		const bl = content["Blacklist"];

		const resultMethod = content["ResultMethod"];

		if (resultMethod == SearchType.SINGLE_SEARCH) {
			queryResult.result.map((q, i) => {
				const vid = q.video;
				if (bl.indexOf(vid) === -1) {
					bl.push(vid);
				}
			});
		}
		else if (resultMethod == SearchType.GROUP_SEARCH) {
			queryResult.result.map((vg, i) => {
				const vid = vg['video group'];
				if (bl.indexOf(vid) === -1) {
					bl.push(vid);
				}
			});
		}
		
		updateValue("Blacklist", bl);
		doSearch();
	}

	return(
		<>
		{
			viewer && 
			createPortal(
				<VideoViewer viewer={viewer} setViewer={setViewer}
							onClose={() => setViewer(null)}
							submit={submit}
							onLocalSearch={onLocalSearch}
				/>,
			document.body)
		}
			<div className="flex flex-col w-full grow overflow-hidden">
				<div className={cn("group w-full bg-slate-200 grid grid-cols-12 gap-4 p-4 z-20", !queryEmpty && "shadow-lg")}>
					<div className="col-span-2 flex flex-col justify-start gap-2">
						<div>
							<Select value={content['SearchMethod']}
								onValueChange={(value) => {
									updateValue('SearchMethod', value);
								}}>
								<SelectTrigger className="w-full p-2 rounded-lg">
									<SelectValue placeholder={
										<SearchTypeRenderer/>
									}/>
								</SelectTrigger>
								<SelectContent className="w-full mt-1 rounded-lg shadow-lg max-h-max">
									{
										SearchOptions.map((searchOpts, i) => 
											<SelectGroup key={i}>
												<SelectLabel className="p-2">{searchOpts.name}</SelectLabel>
												{
													searchOpts.options.map((opts, i) => 
														<SelectItem key={i} className="py-2 cursor-pointer hover:bg-slate-200 rounded-lg" value={opts}>
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
						<div className="flex flex-wrap justify-between gap-2 empty:hidden">
							{ searchMethod in SearchArguments && 
								SearchArguments[searchMethod].args.map((arg, i) => 
									<div key={i} className="flex flex-col gap-2 justify-center">
										<ArgumentField arg={arg} value={content[arg.name]} setValue={(newVal) => updateValue(arg.name, newVal)}/>
									</div>
								)
							}
						</div>
					</div>
					<div className="col-span-9">
						<div className="w-full rounded-lg bg-white">
							<TextareaAutosize autoCorrect="off" autoCapitalize="off" spellCheck="false"
												value={content["Query"]}
												onChange={(e) => updateValue("Query", e.target.value)}
												onKeyDown={textAreaKeydown}
												className="w-full p-2 rounded-lg resize-none outline-none" />
							{
								!queryEmpty && queryResult.query &&
								<div className="flex gap-1 place-items-start p-2 text-slate-500 border-t border-slate-300">
									<CornerLeftUp onClick={() => 
										updateValue("Query", content["ResultMethod"] == SearchType.FUSION_SEARCH ? Object.keys(queryResult?.query)[0] : (content["ResultMethod"] == SearchType.GROUP_SEARCH ? (queryResult?.query)[0] : queryResult?.query))} className="size-6 min-w-6 min-h-6 p-1 rounded-lg cursor-pointer hover:bg-slate-200"/>
									<TranslatedQueryRenderer className="" type={content["ResultMethod"]} data={queryResult} />
								</div>
							}
						</div>
						
					</div>
					<div className="col-span-1 space-y-2">
						<div onClick={doSearch} className="flex cursor-pointer place-items-center justify-center gap-2 p-2 rounded-lg bg-green-700 hover:bg-green-600 text-white">
							<Search className="size-4 min-w-4 min-h-4" />
							<div className="hidden xl:block">Search</div>
						</div>
						{ searchMethod in SearchArguments && SearchArguments[searchMethod].blacklist &&
							<div onClick={addBlacklist} className={cn("flex w-full place-items-center justify-center gap-2 p-2 rounded-lg cursor-pointer bg-red-600 hover:bg-red-500 text-white", queryEmpty && 'cursor-not-allowed bg-slate-400')}>
								<Ban className="size-4 min-w-4 min-h-4" />
								<div className="hidden xl:block">Blacklist</div>
							</div>
						}
					</div>
					{
						searchMethod in SearchArguments &&  
						SearchArguments[searchMethod].blacklist && 
						content["Blacklist"].length != 0 && 
						<div className="col-span-full">
							<Collapsible defaultOpen={false} className="">
								<CollapsibleTrigger className="w-full">
									<div className="flex gap-2 font-bold place-items-center">
										<ChevronsUpDown className="size-3"/>
										<div>Blacklist</div>
									</div>
								</CollapsibleTrigger>
								<CollapsibleContent className="flex gap-1 flex-wrap p-1">
								{
									content["Blacklist"].map((vid) =>
										<Thumbnail video={vid} onClick={() => setViewer([vid, 1])} onClose={() => {removeFromBlacklist(vid)}} className="bg-slate-300 max-w-max text-sm"/>
									)
								}
								</CollapsibleContent>
							</Collapsible>
						</div>
					}

				</div>
				
				<div className="min-h-0 relative grow">
					<div className="overflow-y-scroll h-full">
						<div className="">
							<QueryResult result={queryResult} type={content["ResultMethod"]} setViewer={setViewer}/>
						</div>
					</div>
					{isSearching &&
						<div className="absolute top-0 bg-black w-full h-full backdrop-blur-sm bg-opacity-30 flex place-items-center justify-center ">
							<div className="select-none font-bold text-2xl text-white">
								Searching...
							</div>
						</div>
					}
				</div>
			</div>
		</>
	)
}

export default TabContent;