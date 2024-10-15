import Tab from './Tab'
import { Plus, ChevronDown, X, Copy, Loader, CircleCheck, CircleX } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SearchTypeRenderer } from './SearchType';
import { useHorizontalScroll } from './useHorizontalScroll';
import { useAppContext } from './Context';
import { cn } from '@/lib/utils';

const TabBar = ({tab, setTab, tabList, onDuplicate, onClose, onAdd}) => {
	const scrollRef = useHorizontalScroll();
	const {searchServer, setSearchServer, imageServer, setImageServer, searchServerOkay, imageServerOkay} = useAppContext();

	return(
		<div className="w-full bg-slate-300 flex">
			<div ref={scrollRef} className='w-full h-full flex overflow-x-scroll no-scrollbar'>
				{
					tabList.map((t, i) =>
						<Tab key={i} id={i} active={tab} onClick={() => setTab(i)}>
							<SearchTypeRenderer type={t.SearchMethod}/>
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
						<Plus />
					</div>
				</div>
			</div>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger className='outline-none border-l-2 border-slate-400 hover:bg-white'>
					<ChevronDown className='size-6 m-4'/>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="min-w-48 m-2 bg-slate-200 rounded-lg p-4 space-y-2 shadow-2xl">
					<div className="flex flex-col gap-1">
						<label className='font-bold px-1'>Search Server</label>
						<div className="flex justify-between place-items-center rounded-lg bg-white">
							<input type="text" id="search_server" className='py-2 pl-2 rounded-lg outline-none'
								value={searchServer} onChange={(e) => setSearchServer(e.target.value)}/>
							{searchServerOkay == null && <Loader className='mx-2 animate-spin'/>}
							{searchServerOkay == false && <CircleX className='mx-2 text-red-400'/>}
							{searchServerOkay == true && <CircleCheck className='mx-2 text-green-600'/>}
							
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<label className='font-bold px-1'>Image Server</label>
						<div className="flex justify-between place-items-center rounded-lg bg-white">
							<input type="text" id="image_server" className='py-2 pl-2 rounded-lg outline-none'
								value={imageServer} onChange={(e) => setImageServer(e.target.value)}/>
							{imageServerOkay == null && <Loader className='mx-2 animate-spin'/>}
							{imageServerOkay == false && <CircleX className='mx-2 text-red-400'/>}
							{imageServerOkay == true && <CircleCheck className='mx-2 text-green-600'/>}
						</div>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export default TabBar;