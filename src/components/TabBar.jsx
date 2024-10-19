import Tab from './Tab'
import { Plus, ChevronDown, X, Copy, KeyRound, UserRound, IdCard, Check } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
  } from "@/components/ui/select"
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"

  
import { SearchTypeRenderer } from '../SearchType';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';
import { useAppContext } from '../Context';
import { cn } from '@/lib/utils';
import { toast } from 'react-toastify';
import { SubmissionGetEvaluationID, SubmissionLogin } from '../SubmissionAPI';

const TabBar = ({tab, setTab, tabList, onDuplicate, onClose, onAdd}) => {
	const scrollRef = useHorizontalScroll();
	const {searchServerProtocol, setSearchServerProtocol, imageServerProtocol, setImageServerProtocol} = useAppContext();
	const {searchServerHost, setSearchServerHost, imageServerHost, setImageServerHost} = useAppContext();
	const {searchServerPort, setSearchServerPort,imageServerPort, setImageServerPort} = useAppContext();
	const {username, setUsername, password, setPassword} = useAppContext();
	const {setUserId, sessionId, setSessionId, evaluationId, setEvaluationId, evaluations, setEvaluations} = useAppContext();

	const login = () => {
		if (!username) {
			toast.error("Username is empty");
			return;
		}
		if (!password) {
			toast.error("Password is empty");
			return;
		}

		SubmissionLogin(username, password)
		.then((res) => {
			toast("Login successful!")
			setUserId(res.data.id);
			setSessionId(res.data.sessionId);
			getIds(res.data.sessionId);
		})
		.catch((err) => {
			toast.error(`Login failed: ${err.message}`)
		})
	}

	const getIds = (sessionId) => {
		if (!sessionId) {
			toast.error("Log in first!");
			return;
		}

		SubmissionGetEvaluationID(sessionId)
		.then((res) => {
			toast("Retrieved Evaluations")
			setEvaluations(res.data);
			console.log(res.data);
		})
		.catch((err) => {
			toast.error(`Retrieving Evaluations failed: ${err.message}`)
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
					<div className="flex w-min flex-col gap-1">
						<label className='font-bold px-1'>Search Server</label>
						<div className="flex w-min justify-between gap-2 place-items-center rounded-lg">
							<Select value={searchServerProtocol}
								onValueChange={(value) => {
									setSearchServerProtocol(value);
								}}>
								<SelectTrigger className="w-24 rounded-lg">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="w-24 min-w-0">
									<SelectItem value="http">http</SelectItem>
									<SelectItem value="https">https</SelectItem>
								</SelectContent>
							</Select>
							<input type="text" className='min-w-0 py-2 pl-2 rounded-lg outline-none'
								value={searchServerHost} onChange={(e) => setSearchServerHost(e.target.value)}/>
							<input type="text" className='min-w-0 max-w-14 py-2 pl-2 rounded-lg outline-none'
								value={searchServerPort} onChange={(e) => setSearchServerPort(e.target.value)}/>
							
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<label className='font-bold px-1'>Image Server</label>
						<div className="flex justify-between gap-2 place-items-center rounded-lg">
							<Select value={imageServerProtocol} className=" max-w-16"
								onValueChange={(value) => {
									setImageServerProtocol(value);
								}}>
								<SelectTrigger className="w-24 rounded-lg">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="w-24 min-w-0">
									<SelectItem value="http">http</SelectItem>
									<SelectItem value="https">https</SelectItem>
								</SelectContent>
							</Select>
							<input type="text" className='min-w-0 py-2 pl-2 rounded-lg outline-none'
								value={imageServerHost} onChange={(e) => setImageServerHost(e.target.value)}/>
							<input type="text" className='min-w-0 max-w-14 py-2 pl-2 rounded-lg outline-none'
								value={imageServerPort} onChange={(e) => setImageServerPort(e.target.value)}/>
						</div>
					</div>
					<DropdownMenuSeparator className="bg-slate-300 h-[2px] mt-2 rounded-full w-5/6 mx-auto"/>
					<Dialog>
						<DialogTrigger>
							<div className='cursor-pointer select-none flex gap-2 p-2 place-items-center justify-center w-full rounded-lg bg-cyan-600 hover:bg-cyan-500 font-bold text-white'>
								<UserRound className='size-4'/>
								<div className=''>Account Management</div>
							</div>
						</DialogTrigger>
						<DialogContent className="bg-slate-200 grid grid-cols-3 min-w-[75%]">
							<DialogTitle className="hidden">Accounts</DialogTitle>
							<div className='grid col-span-1 gap-4'>
								<div className="flex flex-col gap-1">
									<label className='font-bold px-1'>Username</label>
									<Input type="text" className='min-w-0 py-2 pl-2 rounded-lg outline-none'
											value={username} onChange={(e) => setUsername(e.target.value)}/>
								</div>
								<div className="flex flex-col gap-1">
									<label className='font-bold px-1'>Password</label>
									<Input type="password" className='min-w-0 py-2 pl-2 rounded-lg outline-none'
											value={password} onChange={(e) => setPassword(e.target.value)}/>
								</div>
								<div className='grid grid-cols-2 gap-2'>
									<div onClick={login} className='cursor-pointer select-none flex gap-2 p-2 place-items-center justify-center w-full rounded-lg bg-cyan-600 hover:bg-cyan-500 font-bold text-white'>
										<KeyRound className='size-4'/>
										<div className=''>Login</div>
									</div>
									<div onClick={() => getIds(sessionId)} className='cursor-pointer select-none flex gap-2 p-2 place-items-center justify-center w-full rounded-lg bg-green-600 hover:bg-green-500 border font-bold text-white'>
										<IdCard className='size-4'/>
										<div className=''>Get IDs</div>
									</div>
								</div>
							</div>
							<div className='col-span-2 flex flex-wrap gap-8'>
								{
									evaluations.map((e, i) =>
									<div key={i} className='flex flex-col gap-1'>
										<div className='flex gap-2 text-lg'>
											<div className='font-bold'>
												{e.name}
											</div>
											<div className='font-semibold text-slate-600'>
												{e.status}
											</div>
										</div>
										<div className='flex gap-4'>
											<div className='flex flex-col gap-4'>
												<div className=''>
													<div className="font-semibold">Description</div>
													<div>{e.templateDescription}</div>
												</div>
												<div onClick={() => {setEvaluationId(e.id)}} className={cn('flex gap-2 place-items-center px-2 py-1 select-none cursor-pointer max-w-max bg-slate-500 hover:bg-slate-400 rounded-md text-white', e.id == evaluationId && 'bg-green-600 hover:bg-green-600 cursor-default')}>
													{e.id == evaluationId ? 
													<>
														<Check className='size-4'/>
														<div>Selected</div>
													</> : 'Select'
													}
												</div>
												<div className={cn('-mt-10 flex gap-2 place-items-center px-2 py-1 select-none cursor-pointer max-w-max bg-slate-500 rounded-md text-white invisible')}>
													<Check className='size-4'/>
													<div>Selected</div>
												</div>
											</div>
											<div className=''>
												<div className="font-semibold">Tasks</div>
												<div>
													{
														e.taskTemplates.map((t, i) =>
															<div key={i} className='flex gap-1'>
																<div className="font-bold">#{i + 1}</div>
																<div className="">{t.taskGroup}</div>
															</div>
														)
													}
												</div>
											</div>
										</div>
									</div>
									)
								}
							</div>
						</DialogContent>
					</Dialog>

					
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export default TabBar;