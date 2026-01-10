export const getOption = () => {
  const lossData = [];
  // 模拟损失值：初始范围可能很大(几百)也可能很小(几)，呈下降趋势，前快后慢
  let loss = Math.random() > 0.5 ? Math.random() * 200 + 50 : Math.random() * 10 + 2;

  for (let i = 0; i < 50; i++) {
    // 指数衰减模拟"前快后慢"
    // 衰减系数 0.85 ~ 0.95
    const decay = 0.85 + Math.random() * 0.1;
    loss *= decay;

    // 确保不小于0
    if (loss < 0.001) loss = Math.random() * 0.001;

    lossData.push(parseFloat(loss.toFixed(4)));
  }

  const accuracyData = [];
  // 准确率：0-100 缓慢上升
  let accuracy = Math.random() * 10; // 从低准确率开始

  for (let i = 0; i < 50; i++) {
    // 每次增加一定数值，随着准确率提高，增加幅度变小（模拟收敛）
    const remaining = 100 - accuracy;
    const increase = Math.random() * (remaining * 0.1) + 0.1;
    accuracy += increase;

    if (accuracy > 100) accuracy = 100;
    accuracyData.push(parseFloat(accuracy.toFixed(2)));
  }

  const option = {
    title: {
      text: '模型训练过程可视化',
      left: 'center',
      textStyle: {
        color: '#e2e8f0'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 22, 35, 0.9)',
      borderColor: '#1e293b',
      textStyle: {
        color: '#e2e8f0'
      }
    },
    legend: {
      data: ['训练损失', '模型准确率'],
      bottom: 0,
      textStyle: {
        color: '#94a3b8'
      }
    },
    grid: {
      top: 60,
      left: 60,
      right: 60,
      bottom: 60
    },
    xAxis: {
      type: 'category',
      name: '训练轮次',
      nameTextStyle: {
        color: '#94a3b8'
      },
      data: Array.from({ length: 50 }, (_, i) => `第${i + 1}轮`),
      axisLabel: {
        color: '#94a3b8'
      },
      axisLine: {
        lineStyle: {
          color: '#334155'
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '损失值',
        nameTextStyle: {
          color: '#94a3b8'
        },
        position: 'left',
        min: 0,
        axisLine: { lineStyle: { color: '#e67e22' } },
        axisLabel: { formatter: '{value}', color: '#94a3b8' },
        splitLine: {
          lineStyle: {
            color: '#1e293b'
          }
        }
      },
      {
        type: 'value',
        name: '准确率(%)',
        nameTextStyle: {
          color: '#94a3b8'
        },
        position: 'right',
        min: 0,
        max: 100,
        axisLine: { lineStyle: { color: '#4a6fa5' } },
        axisLabel: { formatter: '{value}%', color: '#94a3b8' },
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: '训练损失',
        type: 'line',
        yAxisIndex: 0, // 使用左边的y轴
        data: lossData,
        smooth: true,
        lineStyle: { color: '#e67e22', width: 3 },
        symbol: 'circle',
        symbolSize: 8,
        areaStyle: {
          color: 'rgba(230, 126, 34, 0.2)'
        }
      },
      {
        name: '模型准确率',
        type: 'line',
        yAxisIndex: 1, // 使用右边的y轴
        data: accuracyData,
        smooth: true,
        lineStyle: { color: '#4a6fa5', width: 3 },
        symbol: 'diamond',
        symbolSize: 8,
        areaStyle: {
          color: 'rgba(74, 111, 165, 0.2)'
        }
      }
    ]
  };

  return option;
}

export const getAccuracy = () => {
  return Math.random() * 10 + 90
}

const generateTrendArray = (length: number, start: number, end: number, isIncreasing: boolean, noise: number = 0.02) => {
  const data: number[] = []
  for (let i = 0; i < length; i++) {
    // 当前进度（0~1）
    const progress = i / (length - 1)
    // 线性插值
    const base = isIncreasing
      ? start + (end - start) * progress
      : start - (start - end) * progress
    // 添加随机波动（正负 noise）
    const value = base + (Math.random() * 2 - 1) * noise
    data.push(parseFloat(value.toFixed(3)))
  }
  return data
}

const baseLineOption = (title: string, data: number[], color: string, maxY: number) => ({
  title: {
    text: title,
    left: 'center',
    textStyle: { color: '#60a5fa', fontSize: 14, fontWeight: 'bold' },
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(15, 22, 35, 0.9)',
    borderColor: '#1e293b',
    borderWidth: 1,
    textStyle: { color: '#e2e8f0' },
  },
  grid: { left: 40, right: 20, top: 40, bottom: 40 },
  xAxis: {
    type: 'category',
    data: Array.from({ length: data.length }, (_, i) => `Epoch ${i + 1}`),
    boundaryGap: false,
    axisLine: { lineStyle: { color: '#334155' } },
    axisLabel: { color: '#94a3b8' },
  },
  yAxis: {
    type: 'value',
    max: maxY,
    axisLine: { lineStyle: { color: '#334155' } },
    splitLine: { lineStyle: { color: '#1e293b' } },
    axisLabel: { color: '#94a3b8' },
  },
  series: [
    {
      data,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { color, width: 3 },
      itemStyle: { color },
      areaStyle: {
        color: `${color}33`, // 半透明填充
      },
    },
  ],
})

export const getTrainLossOption = (count: number = 10) => {
  const data = generateTrendArray(count, 1.0, 0.2, false, 0.03)
  return baseLineOption('训练集损失', data, '#3b82f6', 1.2)
}

export const getTrainAccuracyOption = (count: number = 10) => {
  const data = generateTrendArray(count, 0.6, 0.98, true, 0.02)
  return baseLineOption('训练集准确率', data, '#60a5fa', 1)
}

export const getValLossOption = (count: number = 10) => {
  const data = generateTrendArray(count, 1.2, 0.3, false, 0.05)
  return baseLineOption('验证集损失', data, '#2563eb', 1.5)
}

export const getValAccuracyOption = (count: number = 10) => {
  const data = generateTrendArray(count, 0.55, 0.93, true, 0.03)
  return baseLineOption('验证集准确率', data, '#1d4ed8', 1)
}


export const getTestAccuracyOption = (count: number = 10) => {
  const data = generateTrendArray(count, 0.65, 0.96, true, 0.02)
  return baseLineOption('测试集准确率', data, '#1e40af', 1)
}
