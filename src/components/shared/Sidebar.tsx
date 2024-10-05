function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">DevOps Monitor</h1>
      </div>
      <nav className="mt-4">
        <a
          href="/dashboard"
          className="block py-2 px-4 text-gray-700 bg-gray-200 hover:bg-gray-300">
          Dashboard
        </a>
        <a
          href="/overview"
          className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
          Pipeline Overview
        </a>
        <a
          href="/insights"
          className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
          Insights
        </a>
        <a
          href="/logs"
          className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
          Logs
        </a>
      </nav>
    </div>
  );
}

export default Sidebar;
