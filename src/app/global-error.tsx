'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              应用出现严重错误
            </h2>
            <p className="text-gray-600 mb-6">
              抱歉，应用遇到了严重问题。请尝试刷新页面。
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      </body>
    </html>
  )
} 