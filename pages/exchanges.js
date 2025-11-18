// pages/exchanges.js
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { exchangesAPI } from '../lib/api'

export default function ExchangesPage() {
  const [exchanges, setExchanges] = useState([])
  const [filteredExchanges, setFilteredExchanges] = useState([])
  const [markets, setMarkets] = useState([])
  const [fiats, setFiats] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('exchanges')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('rank')

  useEffect(() => {
    loadExchangesData()
  }, [])

  useEffect(() => {
    filterExchanges()
  }, [exchanges, searchTerm, sortBy])

  const loadExchangesData = async () => {
    try {
      setIsLoading(true)
      const [exchangesData, marketsData, fiatsData] = await Promise.all([
        exchangesAPI.getExchangesList(),
        exchangesAPI.getMarkets(),
        exchangesAPI.getFiats()
      ])
      
      setExchanges(exchangesData.data || [])
      setMarkets(marketsData.data || [])
      setFiats(fiatsData.data || [])
    } catch (error) {
      console.error('Error loading exchanges data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterExchanges = () => {
    let filtered = exchanges
    
    // فیلتر بر اساس جستجو
    if (searchTerm) {
      filtered = exchanges.filter(exchange => 
        exchange.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exchange.id?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // مرتب‌سازی
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'volume':
          return (b.volumeUsd || 0) - (a.volumeUsd || 0)
        case 'name':
          return (a.name || '').localeCompare(b.name || '')
        case 'pairs':
          return (b.tradingPairs || 0) - (a.tradingPairs || 0)
        default: // rank
          return (a.rank || 999) - (b.rank || 999)
      }
    })
    
    setFilteredExchanges(filtered)
  }

  const formatNumber = (num) => {
    if (!num) return '$0'
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num?.toFixed(2) || '0'}`
  }

  const formatPercent = (num) => {
    if (!num) return '0%'
    return `${num}%`
  }

  const getTrustLevel = (exchange) => {
    const volume = exchange.volumeUsd || 0
    const pairs = exchange.tradingPairs || 0
    
    if (volume > 1e9 && pairs > 100) return { level: 'high', label: 'عالی', color: '#10B981' }
    if (volume > 1e8 && pairs > 50) return { level: 'medium', label: 'خوب', color: '#F59E0B' }
    return { level: 'low', label: 'متوسط', color: '#EF4444' }
  }

  const tabs = [
    { id: 'exchanges', name: 'صرافی‌ها', icon: '🏦' },
    { id: 'markets', name: 'مارکت‌ها', icon: '📊' },
    { id: 'fiats', name: 'ارزهای فیات', icon: '💵' },
    { id: 'stats', name: 'آمار', icon: '📈' }
  ]

  return (
    <div className="page-container">
      <Head>
        <title>صرافی‌ها و مارکت‌ها - VortexAI</title>
        <meta name="description" content="لیست صرافی‌های ارز دیجیتال، مارکت‌ها و ارزهای فیات" />
      </Head>

      <header className="page-header">
        <div className="header-content">
          <h1>🏦 صرافی‌ها و مارکت‌ها</h1>
          <p>بررسی صرافی‌های ارز دیجیتال، جفت‌ارزها و ارزهای فیات</p>
        </div>
        
        <div className="controls">
          {activeTab === 'exchanges' && (
            <>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="جستجو صرافی..."
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
                <option value="volume">حجم</option>
                <option value="name">نام</option>
                <option value="pairs">تعداد جفت‌ارز</option>
              </select>
            </>
          )}
          
          <button onClick={loadExchangesData} className="refresh-btn">
            🔄 بروزرسانی
          </button>
        </div>
      </header>

      <nav className="exchanges-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </nav>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner">🌀</div>
          <p>در حال بارگذاری داده‌ها...</p>
        </div>
      ) : (
        <div className="exchanges-content">
          {/* تب صرافی‌ها */}
          {activeTab === 'exchanges' && (
            <>
              <div className="stats-bar">
                <div className="stat">
                  <span className="stat-label">تعداد صرافی‌ها:</span>
                  <span className="stat-value">{filteredExchanges.length}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">حجم کل 24h:</span>
                  <span className="stat-value">
                    {formatNumber(exchanges.reduce((sum, exchange) => sum + (exchange.volumeUsd || 0), 0))}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">میانگین جفت‌ارز:</span>
                  <span className="stat-value">
                    {Math.round(exchanges.reduce((sum, exchange) => sum + (exchange.tradingPairs || 0), 0) / exchanges.length)}
                  </span>
                </div>
              </div>

              <div className="exchanges-grid">
                {filteredExchanges.map(exchange => {
                  const trust = getTrustLevel(exchange)
                  return (
                    <div key={exchange.id} className="exchange-card">
                      <div className="exchange-header">
                        <div className="exchange-info">
                          <h3 className="exchange-name">{exchange.name}</h3>
                          <div className="exchange-rank">#{exchange.rank}</div>
                        </div>
                        <div 
                          className="trust-badge"
                          style={{ backgroundColor: trust.color }}
                        >
                          {trust.label}
                        </div>
                      </div>
                      
                      <div className="exchange-stats">
                        <div className="stat-row">
                          <span className="stat-label">حجم 24h:</span>
                          <span className="stat-value">
                            {formatNumber(exchange.volumeUsd)}
                          </span>
                        </div>
                        
                        <div className="stat-row">
                          <span className="stat-label">سهم بازار:</span>
                          <span className="stat-value">
                            {formatPercent(exchange.percentTotalVolume)}
                          </span>
                        </div>
                        
                        <div className="stat-row">
                          <span className="stat-label">جفت‌ارزها:</span>
                          <span className="stat-value">
                            {exchange.tradingPairs?.toLocaleString() || '0'}
                          </span>
                        </div>
                        
                        {exchange.socket && (
                          <div className="stat-row">
                            <span className="stat-label">WebSocket:</span>
                            <span className="stat-value available">✅ فعال</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="exchange-actions">
                        {exchange.exchangeUrl && (
                          <a 
                            href={exchange.exchangeUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn-primary"
                          >
                            🔗 وبسایت
                          </a>
                        )}
                        <button className="btn-outline">
                          📊 مشاهده مارکت‌ها
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {filteredExchanges.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3>صرافی یافت نشد</h3>
                  <p>لطفاً عبارت جستجو را تغییر دهید</p>
                </div>
              )}
            </>
          )}

          {/* تب مارکت‌ها */}
          {activeTab === 'markets' && (
            <>
              <div className="stats-bar">
                <div className="stat">
                  <span className="stat-label">تعداد مارکت‌ها:</span>
                  <span className="stat-value">{markets.length}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">صرافی‌های فعال:</span>
                  <span className="stat-value">
                    {new Set(markets.map(m => m.exchange)).size}
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">ارزهای پایه:</span>
                  <span className="stat-value">
                    {new Set(markets.map(m => m.base_asset)).size}
                  </span>
                </div>
              </div>

              <div className="markets-table-container">
                <table className="markets-table">
                  <thead>
                    <tr>
                      <th>صرافی</th>
                      <th>جفت‌ارز</th>
                      <th>قیمت</th>
                      <th>حجم 24h</th>
                      <th>حجم جفت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {markets.slice(0, 100).map((market, index) => (
                      <tr key={index}>
                        <td>
                          <div className="exchange-cell">
                            <span className="exchange-name">{market.exchange}</span>
                          </div>
                        </td>
                        <td>
                          <div className="pair-cell">
                            <span className="base-asset">{market.base_asset}</span>
                            <span className="separator">/</span>
                            <span className="quote-asset">{market.quote_asset}</span>
                          </div>
                        </td>
                        <td>
                          <span className="price">
                            ${market.price?.toLocaleString('en-US', { maximumFractionDigits: 6 })}
                          </span>
                        </td>
                        <td>
                          <span className="volume">
                            {formatNumber(market.volume_24h)}
                          </span>
                        </td>
                        <td>
                          <span className="pair-volume">
                            {market.pair_volume?.toLocaleString() || '0'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {markets.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <h3>مارکتی یافت نشد</h3>
                  <p>در حال حاضر داده‌ای موجود نیست</p>
                </div>
              )}
            </>
          )}

          {/* تب ارزهای فیات */}
          {activeTab === 'fiats' && (
            <>
              <div className="stats-bar">
                <div className="stat">
                  <span className="stat-label">تعداد ارزهای فیات:</span>
                  <span className="stat-value">{fiats.length}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">پرکاربردترین:</span>
                  <span className="stat-value">USD, EUR, GBP</span>
                </div>
              </div>

              <div className="fiats-grid">
                {fiats.map(fiat => (
                  <div key={fiat.code} className="fiat-card">
                    <div className="fiat-header">
                      <div className="fiat-symbol">
                        {fiat.symbol_native || fiat.symbol}
                      </div>
                      <h3 className="fiat-name">{fiat.name}</h3>
                    </div>
                    
                    <div className="fiat-details">
                      <div className="detail-item">
                        <span>کد:</span>
                        <span className="fiat-code">{fiat.code}</span>
                      </div>
                      
                      <div className="detail-item">
                        <span>نماد:</span>
                        <span>{fiat.symbol}</span>
                      </div>
                      
                      {fiat.symbol_native && (
                        <div className="detail-item">
                          <span>نماد محلی:</span>
                          <span>{fiat.symbol_native}</span>
                        </div>
                      )}
                      
                      <div className="detail-item">
                        <span>اعشار:</span>
                        <span>{fiat.decimal_digits || 2}</span>
                      </div>
                      
                      {fiat.name_plural && (
                        <div className="detail-item">
                          <span>نام جمع:</span>
                          <span>{fiat.name_plural}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="fiat-usage">
                      <span className="usage-tag">💵 ارز فیات</span>
                      {['USD', 'EUR', 'GBP', 'JPY', 'CAD'].includes(fiat.code) && (
                        <span className="usage-tag popular">⭐ پرکاربرد</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {fiats.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">💵</div>
                  <h3>ارز فیات یافت نشد</h3>
                  <p>در حال حاضر داده‌ای موجود نیست</p>
                </div>
              )}
            </>
          )}

          {/* تب آمار */}
          {activeTab === 'stats' && (
            <div className="stats-content">
              <div className="stats-grid">
                <div className="stat-card large">
                  <h3>📈 آمار کلی صرافی‌ها</h3>
                  
                  <div className="stat-charts">
                    <div className="chart-item">
                      <h4>توزیع حجم معاملات</h4>
                      <div className="volume-bars">
                        {exchanges.slice(0, 10).map(exchange => (
                          <div key={exchange.id} className="volume-bar">
                            <div className="bar-label">
                              <span>{exchange.name}</span>
                              <span>{formatNumber(exchange.volumeUsd)}</span>
                            </div>
                            <div className="bar-container">
                              <div 
                                className="bar-fill"
                                style={{
                                  width: `${(exchange.volumeUsd / exchanges[0]?.volumeUsd) * 100}%`
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <h3>🏆 10 صرافی برتر</h3>
                  <div className="top-exchanges">
                    {exchanges.slice(0, 10).map((exchange, index) => (
                      <div key={exchange.id} className="top-exchange">
                        <div className="rank">#{index + 1}</div>
                        <div className="name">{exchange.name}</div>
                        <div className="volume">{formatNumber(exchange.volumeUsd)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="stat-card">
                  <h3>📊 آمار بازارها</h3>
                  <div className="market-stats">
                    <div className="market-stat">
                      <span>کل مارکت‌ها:</span>
                      <span>{markets.length}</span>
                    </div>
                    <div className="market-stat">
                      <span>صرافی‌های فعال:</span>
                      <span>{new Set(markets.map(m => m.exchange)).size}</span>
                    </div>
                    <div className="market-stat">
                      <span>ارزهای پایه:</span>
                      <span>{new Set(markets.map(m => m.base_asset)).size}</span>
                    </div>
                    <div className="market-stat">
                      <span>ارزهای متقابل:</span>
                      <span>{new Set(markets.map(m => m.quote_asset)).size}</span>
                    </div>
                  </div>
                </div>

                <div className="stat-card">
                  <h3>💵 ارزهای فیات</h3>
                  <div className="fiat-stats">
                    <div className="fiat-stat">
                      <span>تعداد ارزها:</span>
                      <span>{fiats.length}</span>
                    </div>
                    <div className="fiat-stat">
                      <span>پرکاربردترین:</span>
                      <span>USD, EUR, GBP</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
