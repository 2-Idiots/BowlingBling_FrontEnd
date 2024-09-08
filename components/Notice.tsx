export default function Notice() {
  return (
    <div className="bg-yellow-400 rounded-xl p-6 mb-8 relative overflow-hidden">
      <div className="bg-yellow-500 font-semibold px-4 py-1 rounded-full inline-block mb-2">
        Notice
      </div>
      <div className="pr-32">
        {' '}
        {/* 오른쪽 여백 추가 */}
        <h2 className="text-2xl font-bold mb-2">Bowling Bling ! OPEN !</h2>
        <p className="font-semibold mb-1">
          볼링의 관한 모든 것을 찾는 가장 쉬운 방법
        </p>
        <p className="font-semibold">
          검증된 프로부터, 속편한 지공사까지 다양한 정보들을 볼링블링에서
          만나보세요.
        </p>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
        <svg
          width="128"
          height="128"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="32" cy="32" r="32" fill="white" />
          <path
            d="M32 48C32 48 16 38.39 16 27.55C16 22.37 20.03 18.2 25.04 18.2C28.37 18.2 31.27 20.13 32 22.81C32.73 20.13 35.63 18.2 38.96 18.2C43.97 18.2 48 22.37 48 27.55C48 38.39 32 48 32 48Z"
            fill="#EF4444"
          />
        </svg>
      </div>
    </div>
  )
}
