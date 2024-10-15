import { useEffect, useState } from 'react'
import useLocalStorage from 'use-local-storage';
import TabContent from './TabContent';
import TabBar from './TabBar'
import { CheckSearchServer, CheckImageServer } from './API';
import { AppContext } from './Context';
import { SearchType } from './SearchType';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultTab = {
	SearchMethod: SearchType.SINGLE_SEARCH,
	Query: '',
	K: 30,
	K1: 15,
	K2: 5,
	Step: 2,
	Video: 'L01_V001',
	Result: []
}

function App() {
	const [tab, setTab] = useLocalStorage("tab", 0);

	const [tabContent, setTabContent] = useLocalStorage("tab_content", [structuredClone(defaultTab)]);

	const [searchServer, setSearchServer] = useLocalStorage("search_server", "http://localhost:5001");
	const [searchServerOkay, setSearchServerOkay] = useState(null);
	const [imageServer, setImageServer] = useLocalStorage("image_server", "https://aicf2.vercel.app");
	const [imageServerOkay, setImageServerOkay] = useState(null);

	useEffect(() => {
		setSearchServerOkay(false);
		CheckSearchServer(searchServer).then((res) => {
			setSearchServerOkay(true);
		}).catch((e) => {
			console.error(`Failed to connect to search server at ${searchServer}`);
			setSearchServerOkay(false);
		}) 
	}, [searchServer]);

	useEffect(() => {
		setImageServerOkay(false);
		CheckImageServer(imageServer).then((res) => {
			setImageServerOkay(true);
		}).catch((e) => {
			console.warn(`Failed to connect to image server at ${imageServer}`);
			setImageServerOkay(false);
		}) 
	}, [imageServer]);

	const getNewTab = (overrides) => {
		const newTab = {...defaultTab, ...overrides};
		return newTab;
	}

	const updateTabContent = (i, data) => {
		const newTabContent = [...tabContent];
		newTabContent[i] = data;
		setTabContent(newTabContent);
	}

	const addNewTab = (overrides = {}) => {
		const newTabContent = [...tabContent, getNewTab(overrides)];
		const oldLastTab = tabContent.length - 1;
		setTabContent(newTabContent);
		setTab(oldLastTab + 1);
	}

	const duplicateTab = (i) => {
		const newTabContent = tabContent.toSpliced(i + 1, 0, getNewTab(tabContent[i]));
		setTabContent(newTabContent);
		setTab(i + 1);
	}

	const closeTab = (i) => {
		if (tabContent.length == 1) {
			setTabContent([getNewTab()]);
			setTab(0);
			return;
		}
		const newTabContent = tabContent.toSpliced(i, 1);
		setTabContent(newTabContent);
		if (tab > i) setTab(tab - 1);
		else if (tab == i && tab == tabContent.length - 1) setTab(tab - 1);
	}

	return (
		<AppContext.Provider value={{
			searchServer, setSearchServer, imageServer, setImageServer,
			searchServerOkay, imageServerOkay, addNewTab
		}}>
			<ToastContainer/>
			<div className='w-full h-dvh flex flex-col'>
				<TabBar tab={tab} setTab={(tab) => setTab(tab)} tabList={tabContent} onAdd={() => addNewTab()} onDuplicate={duplicateTab} onClose={closeTab}/>
				<TabContent content={tabContent[tab]} updateContent={(data) => updateTabContent(tab, data)}/>
			</div>
		</AppContext.Provider>
	)
}

export default App;
