import YouTube from "react-youtube";
import Thumbnail from "./Thumbnail";
import GetVideoID from "../utils/video_lookup";
import { GetKeyframeInfo, GetNearestKeyframes } from "../utils/keyframe_lookup";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { SearchType, SearchTypeRenderer } from "../SearchType";
import { ArrowUpFromLine, FileVideo, Timer } from "lucide-react";

import { Input } from "@/components/ui/input";
  

let ytbPlayer = null;

const VideoViewer = ({viewer, onClose, submit, onLocalSearch, onFrameSearch}) => {


	const [qa, setQA] = useState('');

	const video = viewer[0];
	const keyframe = viewer[1];
	
	const video_id = GetVideoID(video);
	const info = GetKeyframeInfo(video, keyframe);
	const second = info[0];
	const frame = info[1];
	const fps = info[2] ?? GetKeyframeInfo(video, 1)[2] ?? 25.0;

	const [currFrame, setCurrFrame] = useState(frame);


	const nearest_keyframes = GetNearestKeyframes(video, currFrame);

	const currentFrameMS = Math.round(currFrame / fps * 1000);

	const getCurrentFrame = () => {
		if (!ytbPlayer) return;
		const currentTime = ytbPlayer.getCurrentTime();
		const currentFrame = Math.round(currentTime * fps);
		setCurrFrame(currentFrame);
	}

	const storePlayer = (event) => {
		ytbPlayer = event.target;
	}

	const seekTo = (second) => {
		if (ytbPlayer)
			ytbPlayer.seekTo(second);
	}

	useEffect(() => {
		const interval = setInterval(() => getCurrentFrame(), 1000 / fps);
		return () => {
			clearInterval(interval);
			ytbPlayer = null;
		};
	}, [video_id]);

	return(
		<>
			<div onClick={onClose}
				className="h-dvh w-full absolute top-0 left-0 bg-[#00000077] z-50 flex justify-center place-items-center">
				<div className="bg-white rounded-lg h-5/6 w-5/6 absolute" onClick={(e) => {e.stopPropagation();}}>
					<div className="flex flex-col place-items-center p-4 h-full">
						<div className="flex gap-2">
							<div className="flex gap-1">
								<div className="font-bold">Video</div>
								<div>{video}</div>
							</div>
							<div className="flex gap-1">
								<div className="font-bold">Current Frame</div>
								<div>{currFrame}</div>
							</div>
						</div>
						<div className="grow w-full">
						{
							video && video_id ? 
							<YouTube videoId={video_id}
									className="p-4 rounded-lg w-full h-full"
									iframeClassName="w-full h-full rounded-lg outline-none"
									onReady={storePlayer}
									opts={{playerVars: {
										start: Math.floor(second)
									}}}
									onPause={storePlayer}
									onPlay={storePlayer}
							/>
							:
							<div className="w-full h-full rounded-lg bg-slate-400 flex justify-center font-bold text-2xl text-slate-700 place-items-center">
							{
								!video ? 'Waiting for input'
								: !video_id ? 'Video not found' : ''   
							}
							</div>
						}
						</div>
						<div className="grid grid-cols-7 w-full px-4 gap-4">
							<div className="grid grid-rows-2 grid-cols-2 gap-2">
								<div onClick={() => {
									navigator.clipboard.writeText(video);
									toast(<div className="flex gap-1">
											Copied<div className="font-bold">{video}</div>
										</div>);
								}} 
									className="p-4 w-full h-full bg-slate-200 hover:bg-slate-300 cursor-pointer rounded-lg"
								>
									<div className="flex place-items-center justify-center gap-2 h-full">
										<FileVideo className="size-5"/>  
										{/* <div className="font-bold">{video}</div> */}
									</div>
								</div>
								<div onClick={() => {
									navigator.clipboard.writeText(currentFrameMS);
									toast(<div className="flex gap-1">
											Copied<div className="font-bold">{currentFrameMS}</div>
										</div>);
								}} 
									className="p-4 w-full h-full bg-slate-200 hover:bg-slate-300 cursor-pointer rounded-lg"
								>
									<div className="flex place-items-center justify-center gap-2 h-full">
										<Timer className="size-5"/>  
										{/* <div className="font-bold">{currentFrameMS}</div> */}
									</div>
								</div>
								<div onClick={onLocalSearch} className="col-span-2 p-4 w-full h-full bg-slate-200 hover:bg-slate-300 cursor-pointer rounded-lg">
									<SearchTypeRenderer className="font-bold" type={SearchType.LOCAL_SEARCH} />
								</div>
							</div>
							<div className="grid col-span-5 grid-cols-5 gap-2">
								{nearest_keyframes.map((kf, i) => 
									<Thumbnail onFrameSearch={onFrameSearch} key={i} video={video} keyframe={kf[0]} onClick={() => seekTo(kf[2])}/>
								)}
							</div>
							<div className="grid grid-rows-2 gap-2">
								<div className="flex bg-slate-200 rounded-lg outline-none">
									<div className="font-bold flex place-items-center px-4 select-none">
										QA
									</div>
									<Input type="number" id="image_server" className='p-2 min-w-0 h-full rounded-l-lg border-[3px] outline-none'
										value={qa} onChange={(e) => setQA(e.target.value)}/>
								</div>
								<div onClick={(e) => submit(video, currentFrameMS, qa)} className="p-4 w-full h-full text-white bg-cyan-600 hover:bg-cyan-700 cursor-pointer rounded-lg">
									<div className="flex place-items-center gap-2 h-full">
										<ArrowUpFromLine className="size-5"/>  
										<div className="font-bold select-none">Submit</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default VideoViewer;