export const getOption = () => {
  const lossData = [];
  let loss = 0.8;  // 从0.8开始
  for (let i = 0; i < 7; i++) {
    loss -= parseFloat((Math.random() * 0.1).toFixed(2));  // 每次减少一个0.1内的随机数
    if (loss < 0.2) loss = 0.2;  // 确保损失值不小于0.2
    lossData.push(parseFloat(loss.toFixed(2)));
  }
  const accuracyData = [];
  let accuracy = 60;  // 从60开始
  for (let i = 0; i < 7; i++) {
    accuracy += Math.floor(Math.random() * 5);  // 每次增加0到5之间的随机数
    if (accuracy > 100) accuracy = 100;  // 确保准确率不超过100%
    accuracyData.push(accuracy);
  }

  const option = {
    title: {
      text: '模型训练过程可视化',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['训练损失', '模型准确率'],
      bottom: 0
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
      data: ['第1轮', '第2轮', '第3轮', '第4轮', '第5轮', '第6轮', '第7轮']
    },
    yAxis: [
      {
        type: 'value',
        name: '损失值',
        position: 'left',
        min: 0,
        max: 1,
        axisLine: { lineStyle: { color: '#e67e22' } },
        axisLabel: { formatter: '{value}' }
      },
      {
        type: 'value',
        name: '准确率(%)',
        position: 'right',
        min: 0,
        max: 100,
        axisLine: { lineStyle: { color: '#4a6fa5' } },
        axisLabel: { formatter: '{value}%' }
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
    textStyle: { color: '#2563eb', fontSize: 14, fontWeight: 'bold' },
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderColor: '#93c5fd',
    borderWidth: 1,
    textStyle: { color: '#1e3a8a' },
  },
  grid: { left: 40, right: 20, top: 40, bottom: 40 },
  xAxis: {
    type: 'category',
    data: Array.from({ length: data.length }, (_, i) => `Epoch ${i + 1}`),
    boundaryGap: false,
    axisLine: { lineStyle: { color: '#93c5fd' } },
    axisLabel: { color: '#1e3a8a' },
  },
  yAxis: {
    type: 'value',
    max: maxY,
    axisLine: { lineStyle: { color: '#93c5fd' } },
    splitLine: { lineStyle: { color: '#e5e7eb' } },
    axisLabel: { color: '#1e3a8a' },
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

export const getTestLossOption = (count: number = 10) => {
  const data = generateTrendArray(count, 0.9, 0.25, false, 0.04)
  return baseLineOption('测试集损失', data, '#3b82f6', 1.2)
}

export const getTestAccuracyOption = (count: number = 10) => {
  const data = generateTrendArray(count, 0.65, 0.96, true, 0.02)
  return baseLineOption('测试集准确率', data, '#1e40af', 1)
}
