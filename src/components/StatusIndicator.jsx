import React from 'react'

const StatusIndicator = ({ status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return {
          color: 'var(--primary-color)',
          text: 'متصل',
          animation: ''
        }
      case 'disconnected':
        return {
          color: 'var(--error-color)',
          text: 'قطع',
          animation: 'pulse'
        }
      case 'checking':
        return {
          color: 'var(--warning-color)',
          text: 'در حال بررسی...',
          animation: 'pulse'
        }
      default:
        return {
          color: 'var(--warning-color)',
          text: 'نامشخص',
          animation: 'pulse'
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className="status-indicator">
      <div 
        className={`status-light ${statusInfo.animation}`}
        style={{ backgroundColor: statusInfo.color }}
      />
      <span className="status-text">{statusInfo.text}</span>
    </div>
  )
}

export default StatusIndicator
