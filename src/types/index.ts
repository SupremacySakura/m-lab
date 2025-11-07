export interface IProject {
    id: string
    name: string
    description: string
    createdAt: string
    trainingSet?: string
    validationSet?: string
    testSet?: string
    experiments: IExperiment[]
}

export interface IExperiment {
    id: string
    name: string
    optimizer: string  // 优化器
    learningRate: number  // 学习率
    batchSize: number
    epoch: number
    setUrl: string  // 数据集路径
    multithreading: number  // 多线程加载
    weightInit: string  // 权重初始化
    saveFormat: string  // 文件保存格式
    accelerationMethod: string  // 加速方式
    computingResource: string[]  // 计算资源
    description: string  // 实验描述
    model: IModel  // 模型
    createdAt:string
}

export interface ILayer {
    id: string;
    type: string;
    parameters: Record<string, unknown>;
}

export interface IModel {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    layers: ILayer[];
}