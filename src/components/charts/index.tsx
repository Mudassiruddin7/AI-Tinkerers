/**
 * Simple chart components for analytics
 * Using pure CSS/SVG for lightweight implementation
 */

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

// ============================================
// Bar Chart
// ============================================

interface BarChartData {
  label: string
  value: number
  color?: string
}

interface BarChartProps {
  data: BarChartData[]
  height?: number
  showValues?: boolean
  animate?: boolean
  className?: string
}

export function BarChart({
  data,
  height = 200,
  showValues = true,
  animate = true,
  className,
}: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value))
  const defaultColors = [
    'bg-primary-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
  ]

  return (
    <div className={cn('w-full', className)}>
      <div
        className="flex items-end justify-between gap-2"
        style={{ height }}
      >
        {data.map((item, index) => {
          const heightPercent = (item.value / maxValue) * 100
          const color = item.color || defaultColors[index % defaultColors.length]

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              {showValues && (
                <span className="text-xs font-medium text-gray-600">
                  {item.value}
                </span>
              )}
              <motion.div
                className={cn('w-full rounded-t-md', color)}
                initial={animate ? { height: 0 } : { height: `${heightPercent}%` }}
                animate={{ height: `${heightPercent}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            </div>
          )
        })}
      </div>
      <div className="flex items-center justify-between mt-2 border-t border-gray-200 pt-2">
        {data.map((item, index) => (
          <span
            key={index}
            className="flex-1 text-xs text-gray-500 text-center truncate px-1"
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Line Chart
// ============================================

interface LineChartData {
  label: string
  value: number
}

interface LineChartProps {
  data: LineChartData[]
  height?: number
  color?: string
  showDots?: boolean
  showArea?: boolean
  className?: string
}

export function LineChart({
  data,
  height = 200,
  color = '#3b82f6',
  showDots = true,
  showArea = true,
  className,
}: LineChartProps) {
  if (data.length < 2) return null

  const maxValue = Math.max(...data.map((d) => d.value))
  const minValue = Math.min(...data.map((d) => d.value))
  const range = maxValue - minValue || 1
  const padding = 20

  const width = 100
  const chartHeight = 100

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * (width - padding * 2) + padding
    const y = chartHeight - ((item.value - minValue) / range) * (chartHeight - padding * 2) - padding
    return { x, y, value: item.value }
  })

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  const areaD =
    pathD +
    ` L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`

  return (
    <div className={cn('w-full', className)}>
      <svg
        viewBox={`0 0 ${width} ${chartHeight}`}
        style={{ height }}
        className="w-full"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((percent) => (
          <line
            key={percent}
            x1={padding}
            y1={chartHeight - (percent / 100) * (chartHeight - padding * 2) - padding}
            x2={width - padding}
            y2={chartHeight - (percent / 100) * (chartHeight - padding * 2) - padding}
            stroke="#e5e7eb"
            strokeWidth="0.5"
          />
        ))}

        {/* Area fill */}
        {showArea && (
          <motion.path
            d={areaD}
            fill={color}
            fillOpacity={0.1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Dots */}
        {showDots &&
          points.map((point, index) => (
            <motion.circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="3"
              fill="white"
              stroke={color}
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            />
          ))}
      </svg>
      <div className="flex items-center justify-between mt-2 border-t border-gray-200 pt-2">
        {data.map((item, index) => (
          <span
            key={index}
            className="text-xs text-gray-500 text-center"
            style={{ width: `${100 / data.length}%` }}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Donut Chart
// ============================================

interface DonutChartData {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  data: DonutChartData[]
  size?: number
  strokeWidth?: number
  centerLabel?: string
  centerValue?: string | number
  className?: string
}

export function DonutChart({
  data,
  size = 200,
  strokeWidth = 24,
  centerLabel,
  centerValue,
  className,
}: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI

  let currentOffset = 0

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {data.map((item, index) => {
          const percentage = item.value / total
          const strokeDasharray = `${circumference * percentage} ${circumference * (1 - percentage)}`
          const offset = currentOffset
          currentOffset += percentage * circumference

          return (
            <motion.circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={-offset}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
          )
        })}
      </svg>
      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerValue && (
            <span className="text-2xl font-bold text-gray-900">{centerValue}</span>
          )}
          {centerLabel && (
            <span className="text-sm text-gray-500">{centerLabel}</span>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// Sparkline
// ============================================

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  className?: string
}

export function Sparkline({
  data,
  width = 100,
  height = 32,
  color = '#3b82f6',
  className,
}: SparklineProps) {
  if (data.length < 2) return null

  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - minValue) / range) * height
    return `${x},${y}`
  })

  return (
    <svg
      width={width}
      height={height}
      className={cn('overflow-visible', className)}
    >
      <motion.polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
    </svg>
  )
}

// ============================================
// Stats Card
// ============================================

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    label?: string
  }
  icon?: React.ReactNode
  sparklineData?: number[]
  className?: string
}

export function StatsCard({
  title,
  value,
  change,
  icon,
  sparklineData,
  className,
}: StatsCardProps) {
  const isPositive = change && change.value >= 0

  return (
    <div className={cn('bg-white rounded-xl p-6 shadow-sm border border-gray-100', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={cn(
                  'text-sm font-medium',
                  isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {isPositive ? '+' : ''}
                {change.value}%
              </span>
              {change.label && (
                <span className="text-xs text-gray-500">{change.label}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-primary-50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
      {sparklineData && (
        <div className="mt-4">
          <Sparkline data={sparklineData} width={200} height={40} />
        </div>
      )}
    </div>
  )
}
