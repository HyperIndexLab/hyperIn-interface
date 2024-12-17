import React, { useEffect, useState } from 'react'
import './index.css'
import { useTranslation } from 'react-i18next';
import fetchWrapper from '../../utils/fetch';
import { NavLink } from 'react-router-dom'
import Loader from '../../components/Loader'
import { useIsDarkMode } from '../../state/user/hooks';
// import { ethers } from 'ethers';
// import stablePool2Abi from '../../constants/abis/stablePool2.json';

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
	const darkMode = useIsDarkMode()
	
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
		{
			label: t('1h'),
			value: "change1H"
		},
		{
			label: t('1d'),
			value: "change24H"
		},
		{
			label: t('FDV'),
			value: "FDV"
		},{

			label: t('tradeVolume'),
			value: "tradeVolume"
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
			label: t('vol1d'),
			value: "vol1d"
		},
		{
			label: t('vol30d'),
			value: "vol30d"
		},
		{
			label: '',
			value: "control"
		},
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

	// async function fetchPoolTokens(pool: any) {
	// 	try {
	// 		const token0 = await pool.tokens(0);
	// 		// const token1 = await pool.tokens(1);
	// 		// const token2 = await pool.tokens(2);
	// 		console.log('Token0:', token0);
	// 		// console.log('Token1:', token1);
	// 		// console.log('Token2:', token2);
	// 	} catch (error) {
	// 		console.error('Error fetching tokens:', error);
	// 	}
	// }

	// useEffect( () => {
	// 	const initContract = async () => {
  //     const POOL_ADDRESS = '0xB12db72cd9Df2897d07B86A0F32de2045e79C38f';
	// 		const POOL_ABI = stablePool2Abi;
	// 		// 使用 Web3Provider 连接到浏览器钱包（MetaMask）
  //     const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      
  //     // 使用自定义的 RPC 连接
  //     new ethers.providers.JsonRpcProvider('https://hashkeychain-testnet.alt.technology');
      
  //     // 请求用户的账户连接
  //     await (window.ethereum as any).request({ method: 'eth_requestAccounts' });

  //     // 使用 MetaMask 的 signer 来与合约交互
  //     const signer = provider.getSigner();
	// 		console.log(provider, 'provider====')
	// 		console.log(signer, 'signer====')	
	// 		const pool = new ethers.Contract(POOL_ADDRESS, POOL_ABI, signer);
	// 		console.log(pool, 'pool====')
	// 		fetchPoolTokens(pool)
  //   };

  //   initContract();
	// }, [])

  return (
		<div className={`table-container ${darkMode ? 'darkMode' : 'whiteMode'}`}>
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
						<div className={`table-cell ${item.value === 'change1H' || item.value === 'change24H' ? 'change' : ''} ${item.value === 'control' ? 'control' : ''}`} onClick={() => handleSort(item.value)} key={item.value}>
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
								<div className={`table-cell change ${row.change1H >= 0 ? 'green' : 'red'}`}>
									<div className="triangle"></div>
									{formatNumber(row.change1H, 2)}%
								</div>
								<div className={`table-cell change ${row.change24H >= 0 ? 'green' : 'red'}`}>
									<div className="triangle"></div>
									{formatNumber(row.change24H, 2)}%
								</div>
								<div className="table-cell">{formatNumber(row.FDV, 2)} USDT</div>
								<div className="table-cell">{formatNumber(row.tradingVolume, 2)} USDT</div>
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
								<div className="table-cell">{formatNumber(row.tradingVolume1D, 2)} USDT</div>
								<div className="table-cell">{formatNumber(row.tradingVolume30D, 2)} USDT</div>
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
