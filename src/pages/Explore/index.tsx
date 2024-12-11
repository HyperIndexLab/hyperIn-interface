import React, { useEffect, useState } from 'react'
import './index.css'
import { useTranslation } from 'react-i18next';
import fetchWrapper from '../../utils/fetch';
import { NavLink } from 'react-router-dom'
import Loader from '../../components/Loader'
// import { ethers } from 'ethers';
// import uniswapV2PairAbi from '../../constants/abis/uniswapV2Pair.json';


export const formatNumber = (
  value: number | string,
  decimals: number = 2
): string => {
  if (isNaN(Number(value))) {
    throw new Error('Input value must be a valid number');
  }
  const fixedValue = Number(value).toFixed(decimals);

  return fixedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};


export default function Explore() {
  // const theme = useContext(ThemeContext)
  // const { account } = useActiveWeb3React()
	const [activeTab, setActiveTab] = useState(1);
	const [tableTitleData, setTableTitleData]: any = useState([])
	const [loading, setLoading] = useState(true)
	const { t } = useTranslation()

	const [tokenData, setTokenData] = useState<any[]>([])
	const [poolData, setPoolData] = useState<any[]>([])
	
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
		// {
		// 	label: t('1h'),
		// 	value: "1h"
		// },
		// {
		// 	label: t('1d'),
		// 	value: "24h"
		// },
		{
			label: t('FDV'),
			value: "FDV"
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
			value: "apy"
		},
		{
			label: '',
			value: ""
		},

		// {
		// 	label: t('vol1d'),
		// 	value: "vol1d"
		// },
		// {
		// 	label: t('vol30d'),
		// 	value: "vol30d"
		// }
		],
	}
		


	const tabs = [
		{ id: 1, label: t('token') },
		{ id: 2, label: t('pool') },
		// { id: 3, label: t('trade') },
	]

	useEffect(() => {
		setTableTitleData(TABLE_TITLE[activeTab as keyof typeof TABLE_TITLE] || [])
		// setTableData([])
	}, [activeTab])


	const fetchTokens = async () => {
		setLoading(true)
		try {
			const tokens = await fetchWrapper('/api/explore/tokens');
			setTokenData(tokens)
		} catch (error) {
			console.error('Failed to fetch token list:', error);
		} finally {
			setLoading(false)
		}
	};

	const fetchPools = async () => {
		setLoading(true)
		try {
			const pools = await fetchWrapper('/api/explore/pools');
			const tokens = await fetchWrapper('/api/explore/tokens');

			// pools 拆分 pairsName: "HUSDT/WHSK"， 匹配 tokens的 symbol，添加token address， token0，token1
			pools.map((pool: any) => {
				const pairs = pool.pairsName.split('/')
				pairs.map((pair: any) => {
					const token = tokens.find((token: any) => token.symbol === pair)
					pool.tokenAddress = token.address
					pool.token0 = token.address
					pool.token1 = token.address
				})
			})
			setPoolData(pools)
		} catch (error) {
			console.error('Failed to fetch pool list:', error);
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (activeTab === 1 && tokenData.length === 0) {
			fetchTokens()
		} else if (activeTab === 2 && poolData.length === 0) {
			fetchPools()
		}
	}, [activeTab])

	// 处理排序点击
  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

	// useEffect(() => {
	// 	const provider = new ethers.providers.JsonRpcProvider('https://hashkeychain-testnet.alt.technology');

		
	// 	const contractAddress = "0xCDF5BbeBcFaf0f0A05aB8D9B73DB1468a64652c3"; 
	// 	const contractAbi = uniswapV2PairAbi

	// 	const contract = new ethers.Contract(contractAddress, contractAbi, provider);

	// 	// 获取 Swap 事件日志
	// 	const getSwapEvents = async (fromBlock: number, toBlock: string) => {
	// 		try {
	// 			console.log('Swap Event: fromBlock', fromBlock, toBlock);
	// 			// 使用 queryFilter 获取 Swap 事件的日志
	// 			const events = await contract.queryFilter(
	// 				contract, 
	// 				fromBlock, 
	// 				toBlock
	// 			);

	// 			console.log('Swap Event: events',contract.filters, events);

	// 			events.forEach((event) => {
	// 				console.log('Swap Event:');
	// 				console.log(`Sender: ${event.args?.sender}`);
	// 				console.log(`Amount0In: ${event.args?.amount0In.toString()}`);
	// 				console.log(`Amount1In: ${event.args?.amount1In.toString()}`);
	// 				console.log(`Amount0Out: ${event.args?.amount0Out.toString()}`);
	// 				console.log(`Amount1Out: ${event.args?.amount1Out.toString()}`);
	// 				console.log(`To: ${event.args?.to}`);
	// 			});
	// 		} catch (error) {
	// 			console.error('Error fetching events:', error);
	// 		}
	// 	};

	// 	getSwapEvents(0, "latest");
		
	// }, [tokenData, poolData])

  return (
		<div className="table-container">
			<div className="tabs">
				{tabs.map((tab) => (
					<div
						key={tab.id}
						className={`tab ${activeTab === tab.id ? "active" : ""}`}
						onClick={() => {
							loading || setActiveTab(tab.id)
						}}
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
				
				{tokenData.length > 0 && activeTab === 1 ? 
				 	tokenData.map((row) => (
						<NavLink to={`/swap/${row.address}`} key={row.id} style={{ textDecoration: 'none' }}>
							<div className="table-row body" key={row.id}>
								<div className="table-cell">{row.id}</div>
								<div className="table-cell">{row.name}</div>
								<div className="table-cell">{formatNumber(row.price, 8)} USDT</div>
								<div className="table-cell">{formatNumber(row.FDV, 2)} USDT</div>
							</div>
						</NavLink>
					)
				) : <></>}

				{poolData.length > 0 && activeTab === 2 ? 
					 poolData.map((row) => (
							<div className="table-row body" key={row.id}>
								<div className="table-cell">{row.id}</div>
								<div className="table-cell">{row.pairsName}</div>
								<div className="table-cell">{formatNumber(row.TVL, 1)} USDT</div>
								<div className="table-cell">{formatNumber(row.APY, 3)}%</div>
								<div className="table-cell control">
									<NavLink to={`/swap?inputCurrency=${row.token0}&outputCurrency=${row.token1}`} style={{ textDecoration: 'none' }}>
										<span>{t('swap')}</span>
									</NavLink>
									<NavLink to={`/add/${row.token0}/${row.token1}`} style={{ textDecoration: 'none' }}>
										<span>{t('addLiquidity')}</span>
									</NavLink>
								</div>
							</div>
					)) : <></>
				}

				{
					loading && <div className="table-row body">
						<div className="table-cell loader">
							<Loader />
						</div>
					</div>
				}
			</div>
		</div>
  );
}
