import OpenAI from "openai"
const openai_tongyi_qwen_plus = new OpenAI(
    {
        apiKey: process.env.TONGYI_API_KEY,
        baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
    }
)

export const recognition = async (image: string) => {
    const completion = await openai_tongyi_qwen_plus.chat.completions.create({
        model: 'qwen3-vl-flash',

        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `
请识别图中菜品，并以JSON格式返回以下内容：
{
  "dishType": "菜品类型，例如：宫保鸡丁",
  "isFood":"图片内容是否为菜品,如果为菜品返回true,不为菜品返回false"
}

请务必直接返回合法的JSON字符串，不要包含多余的解释或Markdown。
`
                    },
                    {
                        type: "image_url",
                        image_url: { url: image }
                    }
                ]
            }
        ]

    })
    const error = {
        dishType: '识别出错',
        accuracy: 0
    }
    console.log(completion.choices[0].message)
    if (typeof completion.choices[0].message.content === 'string') {
        try {
            const data = JSON.parse(completion.choices[0].message.content)
            if (data.isFood) {
                return data
            }
            return error
        } catch (e) {
            return error
        }
    }
    return error

}
