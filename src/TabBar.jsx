import Tab from './Tab'
import { House, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useEffect, useRef } from 'react';

import QueryNameRenderer from './QueryNameRenderer';
import { useHorizontalScroll } from './useHorizontalScroll';

const DropdownTab = ({className, id, active, onClick, children}) => {
	const tabRef = useRef(null);

	useEffect(() => {
		if (active == id)
			tabRef.current.scrollIntoView();
	}, [active, id]);

	return(
		<DropdownMenuItem value={id} onClick={onClick} ref={tabRef}
				className={cn("cursor-pointer hover:bg-white border-t border-b border-slate-200 rounded-md p-2", id == active && "bg-white", className)}
		>
			{children}
		</DropdownMenuItem>
	)
}

const TabBar = ({tab, setTab, tabList}) => {
	const scrollRef = useHorizontalScroll();

	return(
		<div className="w-full bg-slate-300 flex">
			<Tab id="0" active={tab} onClick={() => setTab(0)} className={cn("p-4", tab != 0 && "border-r-2 border-slate-400 rounded-none")}><House /></Tab>
			<div ref={scrollRef} className='w-full h-full grid grid-flow-col overflow-x-scroll'>
				{
					tabList.map((t, i) =>
						<Tab id={i + 1} active={tab} onClick={() => setTab(i + 1)}>
							<QueryNameRenderer className={""} query={t}/>
						</Tab>
					)
				}
			</div>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger className='outline-none border-l-2 border-slate-400 hover:bg-white'>
					<ChevronDown className='m-4'/>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="min-w-48 bg-slate-200 p-0 rounded-lg">
					<div className="p-2">
						<div className="max-h-96 overflow-y-scroll no-scrollbar">
						{
							tabList.map((t, i) =>
								<DropdownTab id={i + 1} active={tab} onClick={() => setTab(i + 1)}>
									<QueryNameRenderer className={""} query={t} verbose={true}/>
								</DropdownTab>
							)
						}
						</div>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}

export default TabBar;