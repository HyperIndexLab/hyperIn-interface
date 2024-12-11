import React, { useEffect, useState } from 'react'
import './index.css'
import { useTranslation } from 'react-i18next';
export default function Explore() {
  // const theme = useContext(ThemeContext)
  // const { account } = useActiveWeb3React()
	const [activeTab, setActiveTab] = useState(1);
	const [tableTitleData, setTableTitleData]: any = useState([])

	const { t } = useTranslation()

	const [tableData, setTableData] = useState([{
		id: 1,
		name: "WBTC/USDC",
		age: 25,
		rate: 10,
		vol1d: 1000,
		vol30d: 10000,
	}])
	
  const [, setSortConfig] = useState({ key: "", direction: "" });

	const TABLE_TITLE = {
		1: [{
			label: "#",
			value: "id"
		},
		{
			label: t('tokenName'),
			value: "name"
		},
		{
			label: t('price'),
			value: "price"
		},
		{
			label: t('1h'),
			value: "1h"
		},
		{
			label: t('1d'),
			value: "24h"
		},
		{
			label: t('vol'),
			value: "vol"
		}],
		2: [{
			label: "#",
			value: "id"
		},
		{
			label: t('pool'),
			value: "pool"
		},
		{
			label: t('tvl'),
			value: "tvl"
		},
		{
			label: t('apy'),
			value: "rate"
		},
		{
			label: t('vol1d'),
			value: "vol1d"
		},
		{
			label: t('vol30d'),
			value: "vol30d"
		}],
	}
		


	const tabs = [
		{ id: 1, label: t('token') },
		{ id: 2, label: t('pool') },
		{ id: 3, label: t('trade') },
	]

	useEffect(() => {
		setTableTitleData(TABLE_TITLE[activeTab as keyof typeof TABLE_TITLE] || [])
		setTableData([])
	}, [activeTab])

	// 处理排序点击
  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  return (
		<div className="table-container">
			<div className="tabs">
				{tabs.map((tab) => (
					<div
						key={tab.id}
						className={`tab ${activeTab === tab.id ? "active" : ""}`}
						onClick={() => setActiveTab(tab.id)}
					>
						{tab.label}
					</div>
				))}
			</div>
			<div className="table">
				{/* 表头 */}
				<div className="table-row header">
					{tableTitleData.map((item: any) => (
						<div className="table-cell" onClick={() => handleSort(item.value)} key={item.value}>
							{item.label}
						</div>
					))}
				</div>
				{/* 表体 */}
				{tableData.length > 0 ? (
					tableData.map((row) => (
						<div className="table-row body" key={row.id}>
							<div className="table-cell">{row.id}</div>
							<div className="table-cell">{row.name}</div>
							<div className="table-cell">{row.age}</div>
							<div className="table-cell">{row.rate}</div>
							<div className="table-cell">{row.vol1d}</div>
							<div className="table-cell">{row.vol30d}</div>
						</div>
					))
				) : (
					<div className="table-row">
						<div className="table-cell">No data found</div>
					</div>
				)}
			</div>
		</div>
  );
}
