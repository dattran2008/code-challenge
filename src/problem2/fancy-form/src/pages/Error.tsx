const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-slate-400 mb-6">
        Oops! The page you are looking for does not exist.
      </p>
    </div>
  );
};

export default ErrorPage;
