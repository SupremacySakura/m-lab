export const getOption = () => {
    // 生成稳步下降的训练损失值
    const lossData = [];
    let loss = 0.8;  // 从0.8开始
    for (let i = 0; i < 7; i++) {
        loss -= parseFloat((Math.random() * 0.1).toFixed(2));  // 每次减少一个0.1内的随机数
        if (loss < 0.2) loss = 0.2;  // 确保损失值不小于0.2
        lossData.push(parseFloat(loss.toFixed(2)));
    }

    // 生成稳步上升的准确率值
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