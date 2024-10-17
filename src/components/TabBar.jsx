import Tab from './Tab'
import { Plus, ChevronDown, X, Copy, KeyRound } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { SearchTypeRenderer } from '../SearchType';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';
import { useAppContext } from '../Context';
import { cn } from '@/lib/utils';
import { toast } from 'react-toastify';
import { SubmissionGetEvaluationID, SubmissionLogin } from '../SubmissionAPI';

const TabBar = ({tab, setTab, tabList, onDuplicate, onClose, onAdd}) => {
	const scrollRef = useHorizontalScroll();
	const {searchServer, setSearchServer, imageServer, setImageServer} = useAppContext();
	const {username, setUsername, password, setPassword} = useAppContext();
	const {userId, setUserId, sessionId, setSessionId, evaluationId, setEvaluationId} = useAppContext();

	const login = () => {
		if (!username) {
			toast.error("Username is empty", {
				closeOnClick: true
			});
			return;
		}
		if (!password) {
			toast.error("Password is empty", {
				closeOnClick: true
			});
			return;
		}

		SubmissionLogin(username, password)
		.then((res) => {
			toast("Login successful!", {
				closeOnClick: true
			})
			setUserId(res.data.id);
			setSessionId(res.data.sessionId);
			SubmissionGetEvaluationID(res.data.sessionId)
			.then((res2) => {
				toast("Retrieved Evaluation ID", {
					closeOnClick: true
				})
				console.log(res2.data)
			})
			.catch((err2) => {
				toast.error(`Retrieving Evaluation ID failed: ${err2.message}`, {
					closeOnClick: true
				})
			})
		})
		.catch((err) => {
			toast.error(`Login failed: ${err.message}`, {
				closeOnClick: true
			})
		})
	}

	return(
		<div className="w-full bg-slate-300 flex z-50">
			<div ref={scrollRef} className='w-full h-full flex overflow-x-scroll no-scrollbar'>
				{
					tabList.map((t, i) =>
						<Tab key={i} id={i} active={tab} onClick={() => setTab(i)}>
							<SearchTypeRenderer type={t.SearchMethod} className="text-slate-600"/>
							<div className='flex gap-0.5' onClick={(e) => e.stopPropagation()}>
								<div onClick={() => onDuplicate(i)} className={cn('text-slate-400 cursor-pointer hover:bg-slate-200 p-0.5 m-0.5 rounded-md', tab == i && "hover:bg-slate-300")}>
									<Copy className='size-4' />
								</div>
								<div onClick={() => onClose(i)} className={cn('text-slate-400 cursor-pointer hover:bg-slate-200 p-0.5 m-0.5 rounded-md', tab == i && "hover:bg-slate-300")}>
									<X className='size-4' />
								</div>
							</div>
							
						</Tab>
					)
				}
				<div onClick={onAdd} className="p-3 m-1 min-w-max select-none rounded-lg hover:bg-slate-100 cursor-pointer max-w-max">
					<div className="flex justify-center place-items-center h-full">
						<Plus className='text-slate-500'/>
					</div>
				</div>
			</div>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger className='outline-none border-l-2 border-slate-400 hover:bg-white'>
					<ChevronDown className='size-6 m-4'/>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="min-w-48 m-2 bg-slate-200 rounded-lg p-4 flex flex-col gap-2 shadow-2xl">
					<div className="flex flex-col gap-1">
						<label className='font-bold px-1'>Search Server</label>
						<div className="flex justify-between place-items-center rounded-lg bg-white">
							<input type="text" id="search_server" className='py-2 pl-2 rounded-lg outline-none'
								value={searchServer} onChange={(e) => setSearchServer(e.target.value)}/>
							
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<label className='font-bold px-1'>Image Server</label>
						<div className="flex justify-between place-items-center rounded-lg bg-white">
							<input type="text" id="image_server" className='py-2 pl-2 rounded-lg outline-none'
								value={imageServer} onChange={(e) => setImageServer(e.target.value)}/>
						</div>
					</div>
					<DropdownMenuSeparator className="bg-slate-300 h-[2px] mt-2 rounded-full w-5/6 mx-auto"/>
					<div className="flex flex-col gap-1">
						<label className='font-bold px-1'>Username</label>
						<div className="flex justify-between place-items-center rounded-lg bg-white">
							<input type="text" id="image_server" className='py-2 pl-2 rounded-lg outline-none'
								value={username} onChange={(e) => setUsername(e.target.value)}/>
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<label className='font-bold px-1'>Password</label>
						<div className="flex justify-between place-items-center rounded-lg bg-white">
							<input type="password" id="image_server" className='py-2 pl-2 rounded-lg outline-none'
								value={password} onChange={(e) => setPassword(e.target.value)}/>
						</div>
					</div>
					<div onClick={login} className='cursor-pointer select-none flex gap-2 p-2 place-items-center justify-center w-full rounded-lg bg-cyan-600 font-bold text-white'>
						<KeyRound className='size-4'/>
						<div className=''>Login</div>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export default TabBar;