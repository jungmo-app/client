'use client';

const GlobalError = () => {
  console.log('@@ global error');

  return (
    <html>
      <body>
        <div className="flex items-center justify-center pt-40">
          <div className="rounded-lg bg-white p-8 text-center shadow-md">
            <strong className="mb-4 block text-2xl font-bold">문제가 발생했어요</strong>
            <p className="mb-6 text-gray-700">요청을 처리하는 중 오류가 발생했어요</p>
          </div>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
