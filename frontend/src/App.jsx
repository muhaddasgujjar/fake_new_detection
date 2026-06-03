import { useState, useEffect } from 'react'
import './App.css'

const API_URL = 'http://localhost:8000'

function App() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [modelInfo, setModelInfo] = useState(null)
  const [datasetStats, setDatasetStats] = useState(null)
  const [health, setHealth] = useState(null)
  const [activeTab, setActiveTab] = useState('predict')

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then(res => res.json())
      .then(setHealth)
      .catch(() => setHealth(null))
  }, [])

  const handlePredict = async () => {
    if (text.trim().length < 10) {
      setError('Please enter at least 10 characters.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Prediction failed')
      }

      setResult(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const loadModelInfo = async () => {
    try {
      const res = await fetch(`${API_URL}/model-info`)
      setModelInfo(await res.json())
    } catch {
      setError('Failed to load model info')
    }
  }

  const loadDatasetStats = async () => {
    try {
      const res = await fetch(`${API_URL}/dataset-stats`)
      setDatasetStats(await res.json())
    } catch {
      setError('Failed to load dataset stats')
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'model' && !modelInfo) loadModelInfo()
    if (tab === 'dataset' && !datasetStats) loadDatasetStats()
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Fake News Detector</h1>
        <p className="subtitle">Powered by LSTM Deep Learning</p>
        {health && (
          <span className={`status ${health.model_loaded ? 'online' : 'offline'}`}>
            {health.model_loaded ? 'Model Ready' : 'Model Loading...'}
          </span>
        )}
      </header>

      <nav className="tabs">
        <button
          className={activeTab === 'predict' ? 'active' : ''}
          onClick={() => handleTabChange('predict')}
        >
          Predict
        </button>
        <button
          className={activeTab === 'model' ? 'active' : ''}
          onClick={() => handleTabChange('model')}
        >
          Model Info
        </button>
        <button
          className={activeTab === 'dataset' ? 'active' : ''}
          onClick={() => handleTabChange('dataset')}
        >
          Dataset
        </button>
      </nav>

      <main className="content">
        {activeTab === 'predict' && (
          <div className="predict-section">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste a news article here to check if it's fake or real..."
              rows={8}
            />
            <div className="input-meta">
              <span>{text.length} characters</span>
              <span>{text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
            </div>
            <button
              className="predict-btn"
              onClick={handlePredict}
              disabled={loading || text.trim().length < 10}
            >
              {loading ? 'Analyzing...' : 'Analyze Article'}
            </button>

            {error && <div className="error">{error}</div>}

            {result && (
              <div className={`result ${result.prediction.toLowerCase()}`}>
                <div className="verdict">
                  <span className="label">{result.prediction}</span>
                  <span className="confidence">{(result.confidence * 100).toFixed(1)}% confidence</span>
                </div>
                <div className="probabilities">
                  <div className="prob-bar">
                    <div className="prob-label">
                      <span>Real</span>
                      <span>{(result.real_probability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="bar">
                      <div className="fill real" style={{ width: `${result.real_probability * 100}%` }} />
                    </div>
                  </div>
                  <div className="prob-bar">
                    <div className="prob-label">
                      <span>Fake</span>
                      <span>{(result.fake_probability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="bar">
                      <div className="fill fake" style={{ width: `${result.fake_probability * 100}%` }} />
                    </div>
                  </div>
                </div>
                <div className="meta">
                  <span>Inference: {result.inference_time_ms}ms</span>
                  <span>{result.word_count} words analyzed</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'model' && (
          <div className="info-section">
            {modelInfo ? (
              <>
                <div className="info-grid">
                  <div className="info-card">
                    <h3>Architecture</h3>
                    <p>{modelInfo.model_type}</p>
                  </div>
                  <div className="info-card">
                    <h3>Parameters</h3>
                    <p>{modelInfo.total_params.toLocaleString()}</p>
                  </div>
                  <div className="info-card">
                    <h3>Trainable</h3>
                    <p>{modelInfo.trainable_params.toLocaleString()}</p>
                  </div>
                  <div className="info-card">
                    <h3>Vocab Size</h3>
                    <p>{modelInfo.vocab_size.toLocaleString()}</p>
                  </div>
                  <div className="info-card">
                    <h3>Max Sequence</h3>
                    <p>{modelInfo.max_sequence_length}</p>
                  </div>
                  <div className="info-card">
                    <h3>Input Shape</h3>
                    <p>{modelInfo.input_shape}</p>
                  </div>
                </div>
                <h3>Layers</h3>
                <table className="layers-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Output Shape</th>
                      <th>Params</th>
                    </tr>
                  </thead>
                  <tbody>
                    {modelInfo.layers.map((layer, i) => (
                      <tr key={i}>
                        <td>{layer.name}</td>
                        <td>{layer.type}</td>
                        <td><code>{layer.output_shape}</code></td>
                        <td>{layer.params.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <p className="loading-text">Loading model info...</p>
            )}
          </div>
        )}

        {activeTab === 'dataset' && (
          <div className="info-section">
            {datasetStats ? (
              <div className="info-grid">
                <div className="info-card">
                  <h3>Total Samples</h3>
                  <p>{datasetStats.total_samples.toLocaleString()}</p>
                </div>
                <div className="info-card">
                  <h3>Fake Articles</h3>
                  <p>{datasetStats.fake_count.toLocaleString()}</p>
                </div>
                <div className="info-card">
                  <h3>Real Articles</h3>
                  <p>{datasetStats.real_count.toLocaleString()}</p>
                </div>
                <div className="info-card">
                  <h3>Avg Text Length</h3>
                  <p>{datasetStats.avg_text_length.toLocaleString()} chars</p>
                </div>
                <div className="info-card">
                  <h3>Max Text Length</h3>
                  <p>{datasetStats.max_text_length.toLocaleString()} chars</p>
                </div>
                <div className="info-card">
                  <h3>Min Text Length</h3>
                  <p>{datasetStats.min_text_length.toLocaleString()} chars</p>
                </div>
              </div>
            ) : (
              <p className="loading-text">Loading dataset stats...</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
