import { useState } from 'react'
import './App.css'

import TabBar from './TabBar'

function App() {
  const [tab, setTab] = useState(0);

  const tabList = [
    {name: "Query 1", type: "qa", owner: "Long", state: "none"},
    {name: "Query 2", type: "qa", owner: "Thuỳ", state: "done"},
    {name: "Query 3", type: "qa", owner: "Chấn", state: "unsure"},
    {name: "Query 4", type: "kis", owner: "Hưng", state: "checked", checkers:['C', 'T']},
    {name: "Query 5", type: "kis", owner: "L", state: "done"},
    {name: "Query 6", type: "kis", owner: "L", state: "unsure"},
    {name: "Query 7", type: "kis", owner: "L", state: "done"},
    {name: "Query 8", type: "kis", owner: "Duy", state: "checked", checkers:['L', 'T']},
    {name: "Query 9", type: "kis", owner: "Hưng", state: "unsure"},
    {name: "Query 10", type: "qa", owner: "L", state: "checked", checkers:['L', 'D']},
    {name: "Query 11", type: "qa", owner: "L", state: "done"},
    {name: "Query 12", type: "qa", owner: "L", state: "unsure"},
    {name: "Query 13", type: "qa", owner: "Chấn", state: "checked", checkers:['H', 'T']},
  ]

  return (
    <div className='w-full'>
      <TabBar tab={tab} setTab={(tab) => setTab(tab)} tabList={tabList}/>
    </div>
  )
}

export default App
