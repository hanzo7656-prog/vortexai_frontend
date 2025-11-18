// pages/coins.js
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { coinsAPI } from '../lib/api'

export default function CoinsPage() {
  const [coins, setCoins] = useState([])
  const [filteredCoins, setFilteredCoins] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('rank')
  const [currency, setCurrency] = useState('USD')

  useEffect(() => {
    loadCoins()
  }, [currency])

  useEffect(() => {
    filterAndSortCoins()
  }, [coins, searchTerm, sortBy])

  const loadCoins = async () => {
    try {
      setIsLoading(true)
      const data = await coinsAPI.getCoinsList({ 
        limit: 100, 
        currency: currency,
        sort_by: sortBy 
      })
      setCoins(data.data || [])
    } catch (error) {
      console.error('Error loading coins:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortCoins = () => {
    let filtered = coins
    
    // فیلتر بر اساس جستجو
    if (searchTerm) {
      filtered = coins.filter(coin => 
        coin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // مرتب‌سازی
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return (b.price || 0) - (a.price || 0)
        case 'volume':
          return (b.volume_24h || 0) - (a.volume_24h || 0)
        case 'market_cap':
          return (b.market_cap || 0) - (a.market_cap || 0)
        case 'change':
          return (b.price_change_24h || 0) - (a.price_change_24h || 0)
        default: // rank
          return (a.rank || 999) - (b.rank || 999)
      }
    })
    
    setFilteredCoins(filtered)
  }

  const formatNumber = (num) => {
    if (!num) return '0'
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  return (
    <div className="page-container">
      <Head>
        <title>نمادهای ارز دیجیتال - VortexAI</title>
        <meta name="description" content="لیست کامل نمادهای ارز دیجیتال با قیمت، حجم و تغییرات بازار" />
      </Head>

      <header className="page-header">
        <div className="header-content">
          <h1>💰 نمادهای ارز دیجیتال</h1>
          <p>بررسی قیمت، حجم معاملات و تغییرات بازار</p>
        </div>
        
        <div className="controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="جستجو نام یا نماد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="select-control"
          >
            <option value="rank">رتبه</option>
            <option value="price">قیمت</option>
            <option value="market_cap">ارزش بازار</option>
            <option value="volume">حجم</option>
            <option value="change">تغییرات</option>
          </select>
          
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            className="select-control"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
          
          <button onClick={loadCoins} className="refresh-btn">
            🔄
          </button>
        </div>
      </header>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner">🌀</div>
          <p>در حال بارگذاری نمادها...</p>
        </div>
      ) : (
        <>
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-label">تعداد نمادها:</span>
              <span className="stat-value">{filteredCoins.length}</span>
            </div>
            <div className="stat">
              <span className="stat-label">ارزش کل بازار:</span>
              <span className="stat-value">
                {formatNumber(coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0))}
              </span>
            </div>
          </div>

          <div className="coins-grid">
            {filteredCoins.map(coin => (
              <div key={coin.id} className="coin-card">
                <div className="coin-header">
                  <div className="coin-info">
                    <h3 className="coin-name">{coin.name}</h3>
                    <span className="coin-symbol">{coin.symbol}</span>
                  </div>
                  <div className="coin-rank">#{coin.rank}</div>
                </div>
                
                <div className="coin-price">
                  ${coin.price?.toLocaleString('en-US', { maximumFractionDigits: 6 })}
                </div>
                
                <div className={`coin-change ${coin.price_change_24h >= 0 ? 'positive' : 'negative'}`}>
                  {coin.price_change_24h >= 0 ? '📈' : '📉'} 
                  {Math.abs(coin.price_change_24h || 0).toFixed(2)}%
                </div>
                
                <div className="coin-stats">
                  <div className="stat-row">
                    <span>ارزش بازار:</span>
                    <span>{formatNumber(coin.market_cap)}</span>
                  </div>
                  <div className="stat-row">
                    <span>حجم 24h:</span>
                    <span>{formatNumber(coin.volume_24h)}</span>
                  </div>
                  {coin.price_change_1h && (
                    <div className="stat-row">
                      <span>1h:</span>
                      <span className={coin.price_change_1h >= 0 ? 'positive' : 'negative'}>
                        {coin.price_change_1h.toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="coin-actions">
                  <button className="btn-outline">مشاهده جزئیات</button>
                  <button className="btn-primary">افزودن به دیده‌بان</button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredCoins.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>نمادی یافت نشد</h3>
              <p>لطفاً عبارت جستجو را تغییر دهید</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
