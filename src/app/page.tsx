export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] p-5">
        <div
          className="bg-white rounded-2xl shadow-[0_4px_32px_0_rgba(0,0,0,0.1)] p-10 flex flex-col items-center w-[90%] max-w-[500px] min-w-[300px]
                   animate-[fadeIn_0.5s_ease-out]"
        >
          <h1 className="text-[#4a6fa5] text-3xl font-bold mb-6 tracking-wide text-center">
            欢迎来到主页！
          </h1>
          <p className="text-[#4a4a4a] text-lg text-center leading-relaxed w-full">
            这是一个基于 Next.js 的食堂菜品识别系统与模型管理系统。
          </p>
        </div>
      </div>
    </>
  )
}
