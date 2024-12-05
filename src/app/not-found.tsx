const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-grow items-center justify-center">
      <div className="rounded-lg bg-white p-8 text-center shadow-xl">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="text-slate-600">페이지를 찾을 수 없습니다. 요청하신 페이지가 존재하지 않습니다.</p>
        <a
          href="/"
          className="mt-4 inline-block rounded bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-blue-600"
        >
          {' '}
          홈페이지로 이동{' '}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
