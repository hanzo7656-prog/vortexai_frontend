// pages/insights.js
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { insightsAPI } from '../lib/api'

export default function InsightsPage() {
  const [fearGreed, setFearGreed] = useState(null)
  const [btcDominance, setBtcDominance] = useState(null)
  const [marketAnalysis, setMarketAnalysis] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadInsightsData()
  }, [])

  const loadInsightsData = async () => {
    try {
      setIsLoading(true)
      const [fearGreedData, dominanceData, analysisData] = await Promise.all([
        insightsAPI.getFearGreed(),
        insightsAPI.getBTCDominance(),
        insightsAPI.getMarketAnalysis()
      ])
      
      setFearGreed(fearGreedData.data)
      setBtcDominance(dominanceData.data)
      setMarketAnalysis(analysisData.market_analysis)
    } catch (error) {
      console.error('Error loading insights:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getFearGreedColor = (value) => {
    if (value >= 75) return '#f56565' // قرمز - طمع شدید
    if (value >= 55) return '#ed8936' // نارنجی - طمع
    if (value >= 45) return '#ecc94b' // زرد - خنثی
    if (value >= 25) return '#4299e1' // آبی - ترس
    return '#3182ce' // آبی تیره - ترس شدید
  }

  const getFearGreedLabel = (value) => {
    if (value >= 75) return 'طمع شدید'
    if (value >= 55) return 'طمع'
    if (value >= 45) return 'خنثی'
    if (value >= 25) return 'ترس'
    return 'ترس شدید'
  }

  const tabs = [
    { id: 'overview', name: 'نمای کلی', icon: '📊' },
    { id: 'sentiment', name: 'احساسات', icon: '😊' },
    { id: 'dominance', name: 'سلطه', icon: '👑' },
    { id: 'analysis', name: 'تحلیل', icon: '🔍' }
  ]

  return (
    <div className="page-container">
      <Head>
        <title>تحلیل و بینش بازار - VortexAI</title>
        <meta name="description" content="تحلیل‌های پیشرفته بازار ارزهای دیجیتال و شاخص‌های تکنیکال" />
      </Head>

      <header className="page-header">
        <div className="header-content">
          <h1>🔮 تحلیل و بینش بازار</h1>
          <p>شاخص‌های پیشرفته و تحلیل‌های تکنیکال بازار کریپتو</p>
        </div>
        
        <button onClick={loadInsightsData} className="refresh-btn">
          🔄 بروزرسانی
        </button>
      </header>

      <nav className="insights-tabs">
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
          <p>در حال بارگذاری تحلیل‌ها...</p>
        </div>
      ) : (
        <div className="insights-content">
          {/* تب نمای کلی */}
          {activeTab === 'overview' && (
            <div className="overview-grid">
              {/* کارت شاخص ترس و طمع */}
              <div className="insight-card large">
                <div className="card-header">
                  <h3>📊 شاخص ترس و طمع</h3>
                  <span className="card-badge">
                    {fearGreed?.value_classification}
                  </span>
                </div>
                
                {fearGreed && (
                  <div className="fear-greed-content">
                    <div className="gauge-container">
                      <div 
                        className="gauge"
                        style={{
                          '--value': fearGreed.value,
                          '--color': getFearGreedColor(fearGreed.value)
                        }}
                      >
                        <div className="gauge-value">{fearGreed.value}</div>
                      </div>
                    </div>
                    
                    <div className="gauge-labels">
                      <span>ترس شدید</span>
                      <span>خنثی</span>
                      <span>طمع شدید</span>
                    </div>
                    
                    <div className="analysis-section">
                      <h4>تحلیل وضعیت:</h4>
                      <p>{fearGreed.analysis?.market_condition || 'داده‌ای موجود نیست'}</p>
                    </div>
                    
                    <div className="recommendation">
                      <strong>توصیه:</strong> {fearGreed.recommendation}
                    </div>
                  </div>
                )}
              </div>

              {/* کارت دامیننس بیت‌کوین */}
              <div className="insight-card">
                <div className="card-header">
                  <h3>👑 دامیننس بیت‌کوین</h3>
                </div>
                
                {btcDominance && (
                  <div className="dominance-content">
                    <div className="dominance-value">
                      {btcDominance.dominance_percentage?.toFixed(2)}%
                    </div>
                    
                    <div className="dominance-analysis">
                      <div className="analysis-item">
                        <span>فاز بازار:</span>
                        <span className={`badge ${btcDominance.trend}`}>
                          {btcDominance.trend === 'bitcoin_dominant' ? 'سلطه بیت‌کوین' :
                           btcDominance.trend === 'altcoin_season' ? 'فصل آلت‌کوین' : 'متعادل'}
                        </span>
                      </div>
                      
                      <div className="analysis-item">
                        <span>توصیه:</span>
                        <span>{btcDominance.market_implication}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* کارت سلامت بازار */}
              <div className="insight-card">
                <div className="card-header">
                  <h3>❤️ سلامت بازار</h3>
                </div>
                
                {marketAnalysis && (
                  <div className="health-content">
                    <div className="health-score">
                      <div 
                        className="score-circle"
                        style={{
                          '--score': marketAnalysis.market_health_score,
                          '--color': marketAnalysis.market_health_score > 70 ? '#48bb78' : 
                                    marketAnalysis.market_health_score > 40 ? '#ed8936' : '#f56565'
                        }}
                      >
                        {marketAnalysis.market_health_score}%
                      </div>
                    </div>
                    
                    <div className="health-details">
                      <div className="detail-item">
                        <span>روند اصلی:</span>
                        <span>{marketAnalysis.primary_trend}</span>
                      </div>
                      <div className="detail-item">
                        <span>سطح ریسک:</span>
                        <span>{marketAnalysis.risk_assessment}</span>
                      </div>
                      <div className="detail-item">
                        <span>محیط معاملاتی:</span>
                        <span>{marketAnalysis.trading_environment}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* تب احساسات */}
          {activeTab === 'sentiment' && fearGreed && (
            <div className="sentiment-content">
              <div className="sentiment-card">
                <h3>تحلیل دقیق احساسات بازار</h3>
                
                <div className="sentiment-metrics">
                  <div className="metric">
                    <span className="metric-label">مقدار فعلی</span>
                    <span className="metric-value">{fearGreed.value}</span>
                  </div>
                  
                  <div className="metric">
                    <span className="metric-label">طبقه‌بندی</span>
                    <span className="metric-value">{fearGreed.value_classification}</span>
                  </div>
                  
                  <div className="metric">
                    <span className="metric-label">احساسات</span>
                    <span className="metric-value">
                      {fearGreed.analysis?.sentiment || 'نامشخص'}
                    </span>
                  </div>
                </div>

                <div className="zones-info">
                  <h4>مناطق شاخص:</h4>
                  <div className="zones-grid">
                    <div className="zone extreme-fear">
                      <span>0-24: ترس شدید</span>
                      <small>فرصت خرید بالقوه</small>
                    </div>
                    <div className="zone fear">
                      <span>25-44: ترس</span>
                      <small>احتیاط در خرید</small>
                    </div>
                    <div className="zone neutral">
                      <span>45-55: خنثی</span>
                      <small>بازار متعادل</small>
                    </div>
                    <div className="zone greed">
                      <span>56-75: طمع</span>
                      <small>احتیاط در فروش</small>
                    </div>
                    <div className="zone extreme-greed">
                      <span>76-100: طمع شدید</span>
                      <small>خطر اصلاح قیمت</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* تب سلطه */}
          {activeTab === 'dominance' && btcDominance && (
            <div className="dominance-content-full">
              <div className="dominance-card">
                <h3>تحلیل دامیننس بیت‌کوین</h3>
                
                <div className="dominance-explanation">
                  <p>
                    <strong>دامیننس بیت‌کوین</strong> نشان‌دهنده سهم بیت‌کوین از کل ارزش بازار ارزهای دیجیتال است.
                    این شاخص به شناسایی فصل آلت‌کوین‌ها کمک می‌کند.
                  </p>
                </div>

                <div className="dominance-stats">
                  <div className="stat-card">
                    <span className="stat-label">دامیننس فعلی</span>
                    <span className="stat-value">{btcDominance.dominance_percentage}%</span>
                  </div>
                  
                  <div className="stat-card">
                    <span className="stat-label">فاز بازار</span>
                    <span className="stat-value">
                      {btcDominance.trend === 'bitcoin_dominant' ? 'سلطه بیت‌کوین' :
                       btcDominance.trend === 'altcoin_season' ? 'فصل آلت‌کوین' : 'بازار متعادل'}
                    </span>
                  </div>
                </div>

                <div className="market-phases">
                  <h4>فازهای بازار بر اساس دامیننس:</h4>
                  <ul>
                    <li>🔺 <strong>بالای 55%:</strong> سلطه بیت‌کوین - آلت‌کوین‌ها معمولاً ضعیف عمل می‌کنند</li>
                    <li>⚖️ <strong>45-55%:</strong> بازار متعادل - نوبت به نوبت بیت‌کوین و آلت‌کوین‌ها</li>
                    <li>🔻 <strong>زیر 45%:</strong> فصل آلت‌کوین‌ها - آلت‌کوین‌ها outperform می‌کنند</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* تب تحلیل */}
          {activeTab === 'analysis' && marketAnalysis && (
            <div className="analysis-content">
              <div className="analysis-card">
                <h3>تحلیل جامع بازار</h3>
                
                <div className="key-insights">
                  <h4>بینش‌های کلیدی:</h4>
                  {marketAnalysis.key_insights?.map((insight, index) => (
                    <div key={index} className="insight-item">
                      <span className="bullet">•</span>
                      {insight}
                    </div>
                  ))}
                </div>

                <div className="risk-assessment">
                  <h4>ارزیابی ریسک:</h4>
                  <div className="risk-level">
                    <span>سطح ریسک: </span>
                    <span className={`risk-badge ${marketAnalysis.risk_assessment}`}>
                      {marketAnalysis.risk_assessment}
                    </span>
                  </div>
                  
                  <div className="trading-environment">
                    <span>محیط معاملاتی: </span>
                    <span>{marketAnalysis.trading_environment}</span>
                  </div>
                </div>

                <div className="health-metric">
                  <h4>امتیاز سلامت بازار:</h4>
                  <div className="health-bar">
                    <div 
                      className="health-progress"
                      style={{ width: `${marketAnalysis.market_health_score}%` }}
                    ></div>
                  </div>
                  <div className="health-value">{marketAnalysis.market_health_score}%</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
