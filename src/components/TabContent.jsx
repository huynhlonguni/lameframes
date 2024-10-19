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
import { Search, Ban, ChevronsUpDown, ArrowUpDown, Trash, X, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import TextareaAutosize from 'react-textarea-autosize';
import { SearchType, SearchTypeRenderer, SearchArguments } from "../SearchType";
import { SearchHelper, SearchResultHelper } from "../API";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import VideoViewer from "./VideoViewer";
import QueryResult from "./QueryResult";
import ArgumentField from "./ArgumentField";
import { SubmissionSubmitKIS, SubmissionSubmitQA } from "../SubmissionAPI";
import TranslatedQueryRenderer from "./TranslatedQueryRenderer";
import ScrollToTop from "./ScrollToTop";
import BlacklistStub from "./BlacklistStub";
import { Input } from "@/components/ui/input";
import Thumbnail from "./Thumbnail";

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
		SearchType.IMAGE_RELATED_SEARCH,
		SearchType.FRAME_RELATED_SEARCH,
	]}
]

const TabContent = ({content, updateContent, tab}) => {
	const {searchServerUrl, addNewTab} = useAppContext();

	const {sessionId, evaluationId} = useAppContext();

	const queries = content["Queries"];
	const searchMethod = content["SearchMethod"];
	const queryResult = content["Result"];
	const queryEmpty = Object.keys(queryResult).length === 0;

	const isSearching = content["IsSearching"];

	const [files, setFiles] = useState();
	const [viewer, setViewer] = useState();

	const updateValue = (name, value) => {
		content[name] = value;
		updateContent(content);
	}

	const onFileChange = (e) => {
		setFiles(e.target.files);
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
			toast.error("Input is invalid!");
			return;
		}

		if (isSearching) {
			toast.warn("Another search is in process!")
			return;
		}

		updateValue("IsSearching", true);

		SearchHelper(searchMethod, searchServerUrl, content, files)
		.then((res) => {
			res = SearchResultHelper(searchMethod, res.data);
			updateValue("Result", res);
			updateValue("ResultMethod", searchMethod);

			if (searchMethod == SearchType.FUSION_SEARCH) {
				const qT = [];
				queries.map((q) => {
					qT.push(res.query[q]);
				})
				updateValue("QueriesTranslated", qT);
			}
			else 
				updateValue("QueriesTranslated", res.query);

			updateValue("IsSearching", false);
		})
		.catch((e) => {
			console.error("Failed to search:", e);
			toast.error(`Search failed: ${e.message}`);
			updateValue("IsSearching", false);
		})
	}

	const textAreaKeydown = (e) => {
		if (e.keyCode == 13 && !e.shiftKey) {
			e.preventDefault();
			doSearch();
		}
	}

	const onEnterKeydown = (e) => {
		if (e.keyCode == 13) {
			e.preventDefault();
			doSearch();
		}
	}

	const submit = (video, frameMS, qa) => {
		if (!qa || qa == '') {
			SubmissionSubmitKIS(sessionId, evaluationId, video, frameMS)
			.then((res) => {
				if (res.data.submission != "CORRECT") {
					toast.error(`Submission is wrong`)
					return;
				}
				toast(`Submit successful!`)
			})
			.catch((err) => {
				console.log(err);
				toast.error(`Submit failed: ${err.response.data.description}`, {
					autoClose: 5000,
					pauseOnHover: true
				})
			})
			return;
		}

		SubmissionSubmitQA(sessionId, evaluationId, qa, video, frameMS)
		.then((res) => {
			if (res.data.submission != "CORRECT") {
				toast.error(`Submission is wrong`)
				return;
			}
			toast(`Submit successful!`)
		})
		.catch((err) => {
			console.log(err);
			toast.error(`Submit failed: ${err.response.data.description}`, {
				autoClose: 5000,
				pauseOnHover: true
			})
		})
		return;
	}

	const onLocalSearch = () => {
		addNewTab({
			SearchMethod: SearchType.LOCAL_SEARCH,
			Queries: [content["Queries"][0]],
			Video: viewer[0],
			Translate: content["Translate"],
			K: 30,
			SearchOnInit: true,
		})
		setViewer(null);
	}

	const onFrameSearch = (video, frame) => {
		addNewTab({
			SearchMethod: SearchType.FRAME_RELATED_SEARCH,
			Queries: [content["Queries"][0]],
			Video: video,
			Frame: frame,
			Translate: content["Translate"],
			K: 30,
			SearchOnInit: true,
		})
		setViewer(null);
	}

	useEffect(() => {
		if (content["SearchOnInit"]) {
			doSearch();
			updateValue("SearchOnInit", false);
		}
	}, [content]);

	const removeFromBlacklist = (vid) => {
		const bl = content["Blacklist"];

		const index = bl.indexOf(vid);
		if (index > -1) {
			bl.splice(index, 1);
		}
		
		updateValue("Blacklist", bl);
	}

	const removeAllBlacklist = () => {
		updateValue("Blacklist", []);
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

	const switchTranslation = (i) => {
		const q = structuredClone(content["Queries"]);
		const qT = structuredClone(content["QueriesTranslated"]);
		q[i] = content["QueriesTranslated"][i];
		qT[i] = content["Queries"][i];
		updateValue("Queries", q);
		updateValue("QueriesTranslated", qT);
	}

	const changeQueries = (i, v) => {
		const q = structuredClone(queries);
		q[i] = v;
		updateValue("Queries", q);
	}

	const deleteQueries = (i) => {
		const q = structuredClone(queries);
		q.splice(i, 1);
		if (!q.length) q.push('');
		updateValue("Queries", q);

		const qT = structuredClone(content["QueriesTranslated"]);
		qT.splice(i, 1);
		updateValue("QueriesTranslated", qT);

		const w = structuredClone(content["Weights"]);
		w.splice(i, 1);
		if (!w.length) w.push(1);
		updateValue("Weights", w);
	}

	const addNewQueries = () => {
		const q = structuredClone(queries);
		q.push('');
		updateValue("Queries", q);

		const w = structuredClone(content["Weights"]);
		w.push(1);
		updateValue("Weights", w);
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
							onFrameSearch={onFrameSearch}
				/>, document.body)
			}
			<div className="flex flex-col w-full grow overflow-hidden">
				<div className={cn("group/search w-full bg-slate-200 grid grid-cols-12 gap-4 p-4 z-20", !queryEmpty && "shadow-lg")}>
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
						<div className={cn("flex-wrap justify-between gap-2 empty:hidden flex",
							!queryEmpty && "hidden group-hover/search:flex group-focus/search:flex"
						)}>
							{ searchMethod in SearchArguments && 
								SearchArguments[searchMethod].args.map((arg, i) => 
									<div key={i} className="flex flex-col gap-2 justify-center">
										<ArgumentField onKeyDown={onEnterKeydown} arg={arg} value={content[arg.name]} setValue={(newVal) => updateValue(arg.name, newVal)}/>
									</div>
								)
							}
						</div>
					</div>
					<div className="col-span-9 space-y-2">
						{searchMethod in SearchArguments &&
							queries
							.filter((q, i) => SearchArguments[searchMethod].query == 'one' || SearchArguments[searchMethod].query == 'multiple')
							.filter((q, i) => SearchArguments[searchMethod].query == 'multiple' || i == 0)
							.map((q, i) => 
								<div key={i} className="flex gap-2 place-items-start">
									<div className="w-full rounded-lg bg-white place-items-center">
										<TextareaAutosize autoCorrect="off" autoCapitalize="off" spellCheck="false"
													value={q}
													onChange={(e) => {
														changeQueries(i, e.target.value);
													}}
													onKeyDown={textAreaKeydown}
													className="w-full p-2 rounded-lg resize-none outline-none" />
										{
											!queryEmpty && content["QueriesTranslated"] && content["QueriesTranslated"][i] &&
											<div className={cn("flex gap-1 place-items-start p-2 text-slate-500 border-t border-slate-300",
																!queryEmpty &&  "hidden group-hover/search:flex group-focus/search:flex")}>
												<ArrowUpDown onClick={() => switchTranslation(i)} className="size-6 min-w-6 min-h-6 p-1 rounded-lg cursor-pointer hover:bg-slate-200"/>
												<div>{content["QueriesTranslated"][i]}</div>
												{/* <TranslatedQueryRenderer className="" type={content["ResultMethod"]} data={queryResult} /> */}
											</div>
										}
									</div>
									{
										SearchArguments[searchMethod].weight &&
										<Input onKeyDown={onEnterKeydown} type="number" className="outline-none max-w-20" value={content["Weights"][i]} onChange={(e) => {
											const w = structuredClone(content["Weights"]);
											w[i] = e.target.value;
											updateValue("Weights", w);
										} }/>
									}
									{
										SearchArguments[searchMethod].query == 'multiple' &&
										<div onClick={() => deleteQueries(i)} className="cursor-pointer p-2 bg-white rounded-lg">
											<X className="text-slate-400 hover:text-slate-500" />
										</div>
									}
								</div>
							)
						}
						{
							SearchArguments[searchMethod].query == 'multiple' &&
							<div className={cn("w-full flex place-items-center justify-center", !queryEmpty &&  "hidden group-hover/search:flex group-focus/search:flex")}>
								<div onClick={addNewQueries} className="bg-white rounded-lg p-2 cursor-pointer">
									<Plus className="size-4 text-slate-400 hover:text-slate-500" />
								</div>
							</div>
						}
						{
							SearchArguments[searchMethod].query == 'preview' && 

							<Thumbnail video={content["Video"]} keyframe={content["Frame"]} className={"min-h-0 min-w-0"} hideText={true}/>
							// <div className={cn("w-full flex place-items-center justify-center", !queryEmpty &&  "hidden group-hover/search:flex group-focus/search:flex")}>
							// 	<div onClick={addNewQueries} className="bg-white rounded-lg p-2 cursor-pointer">
							// 		<Plus className="size-4 text-slate-400 hover:text-slate-500" />
							// 	</div>
							// </div>
						}
						{
							SearchArguments[searchMethod].query == 'file' && 

							<Input type="file" onChange={onFileChange} className="file:bg-slate-300 file:rounded-md file:px-2 file:hover:bg-slate-200 file:border-0 file:cursor-pointer"/>
						}
					</div>
					<div className="col-span-1 space-y-2">
						<div onClick={doSearch} className="flex cursor-pointer place-items-center justify-center gap-2 p-2 rounded-lg bg-green-700 hover:bg-green-600 text-white">
							<Search className="size-4 min-w-4 min-h-4" />
							<div className="hidden xl:block">Search</div>
						</div>
						{ searchMethod in SearchArguments && SearchArguments[searchMethod].blacklist &&
							<div onClick={addBlacklist}
								className={cn("flex w-full place-items-center justify-center gap-2 p-2 rounded-lg cursor-pointer bg-red-600 hover:bg-red-500 text-white",
												queryEmpty && 'cursor-not-allowed bg-slate-400',
												!queryEmpty && "hidden group-hover/search:flex group-focus/search:flex")}>
								<Ban className="size-4 min-w-4 min-h-4" />
								<div className="hidden xl:block">Blacklist</div>
							</div>
						}
					</div>
					{
						searchMethod in SearchArguments &&  
						SearchArguments[searchMethod].blacklist && 
						content["Blacklist"].length != 0 && 
						<div className={cn("col-span-full", !queryEmpty && "hidden group-hover/search:block group-focus/search:block")}>
							<Collapsible defaultOpen={true} className="">
								<CollapsibleTrigger className="w-full">
									<div className="flex gap-2 font-bold place-items-center">
										<ChevronsUpDown className="size-3"/>
										<div>Blacklist</div>
										<BlacklistStub onClose={removeAllBlacklist} className="bg-slate-300 max-w-max text-sm p-0"/>
									</div>
								</CollapsibleTrigger>
								<CollapsibleContent className="flex gap-1 flex-wrap p-1">
									{
										content["Blacklist"].map((vid) =>
											<BlacklistStub video={vid} onClick={() => setViewer([vid, 1])} onClose={() => {removeFromBlacklist(vid)}} className="bg-slate-300 max-w-max text-sm"/>
										)
									}
								</CollapsibleContent>
							</Collapsible>
						</div>
					}

				</div>
				
				<div className="min-h-0 relative grow">
					<ScrollToTop className="overflow-y-scroll h-full">
						<QueryResult result={queryResult} type={content["ResultMethod"]} onFrameSearch={onFrameSearch} setViewer={setViewer}/>
					</ScrollToTop>
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