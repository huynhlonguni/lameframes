import { useState } from 'react'
import useLocalStorage from 'use-local-storage';
import TabContent from './components/TabContent';
import TabBar from './components/TabBar'
import { AppContext } from './Context';
import { SearchType } from './SearchType';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultTab = {
	SearchMethod: SearchType.SINGLE_SEARCH,
	Queries: [''],
	QueriesTranslated: [''],
	Weights: [1],
	Translate: true,
	K: 30,
	K1: 15,
	K2: 5,
	Step: 2,
	Video: 'L01_V001',
	Frame: 123,
	Sort: 'max',
	Limit: 100,
	Blacklist: [],
	Result: {},
	ResultMethod: SearchType.NONE,
}

function App() {
	const [tab, setTab] = useLocalStorage("tab", 0);

	const [tabContent, setTabContent] = useLocalStorage("tab_content", [structuredClone(defaultTab)]);

	const [qa, setQA] = useState('');

	const [searchServerProtocol, setSearchServerProtocol] = useLocalStorage("search_server_protocol", "http");
	const [imageServerProtocol, setImageServerProtocol] = useLocalStorage("image_server_protocol", "https");
	const [searchServerHost, setSearchServerHost] = useLocalStorage("search_server_host", "34.29.129.102");
	const [imageServerHost, setImageServerHost] = useLocalStorage("image_server_host", "danjams.github.io");
	const [searchServerPort, setSearchServerPort] = useLocalStorage("search_server_port", "5001");
	const [imageServerPort, setImageServerPort] = useLocalStorage("image_server_port", "443");

	const searchServerUrl = `${searchServerProtocol}://${searchServerHost}:${searchServerPort}`;
	const imageServerUrl = `${imageServerProtocol}://${imageServerHost}:${imageServerPort}`

	const [username, setUsername] = useLocalStorage("username", "team41");
	const [password, setPassword] = useLocalStorage("password", "");
	const [userId, setUserId] = useLocalStorage("user_id", "");
	const [sessionId, setSessionId] = useLocalStorage("session_id", "");
	const [evaluations, setEvaluations] = useLocalStorage("evaluations", []);
	const [evaluationId, setEvaluationId] = useLocalStorage("evaluation_id", "");

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
			searchServerProtocol, setSearchServerProtocol,
			imageServerProtocol, setImageServerProtocol,
			searchServerHost, setSearchServerHost,
			imageServerHost, setImageServerHost,
			searchServerPort, setSearchServerPort,
			imageServerPort, setImageServerPort,
			searchServerUrl, imageServerUrl,
			username, setUsername, password, setPassword,
			addNewTab,
			userId, setUserId,
			sessionId, setSessionId,
			evaluations, setEvaluations,
			evaluationId, setEvaluationId,
			qa, setQA
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
