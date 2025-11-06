'use client'

import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

export default function LineChart({ option }: { option: any }) {
    const chartRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!chartRef.current) return

        // 初始化 ECharts 实例
        const chart = echarts.init(chartRef.current)

        chart.setOption(option)

        // 响应式尺寸变化
        const resizeObserver = new ResizeObserver(() => chart.resize())
        resizeObserver.observe(chartRef.current)

        // 清理函数
        return () => {
            chart.dispose()
            resizeObserver.disconnect()
        }
    }, [option])

    return <div ref={chartRef} className="w-full h-[400px]" />
}
