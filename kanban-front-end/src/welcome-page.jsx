import "./output.css";
export default function Welcome() {
  function handleClick() {
    window.location.href = "./signin";
  }
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-cyan-500 to-indigo-500 flex flex-col items-center justify-center text-white">
        <div className="bg-zinc-900 bg-opacity-50 p-24 rounded-lg shadow-lg flex flex-col items-center">
          <div><h1 className="text-5xl font-bold">MY KANBAN</h1></div>
          <div><p className="mt-4 text-3xl">Web Homework Project</p></div>
          <div><button className="mt-6 text-3xl bg-blue-500 text-white py-2 px-20 rounded-full hover:bg-blue-700 static left-2" onSubmit={e => {
                e.preventDefault();}} onClick={handleClick}>
              ENTER
          </button></div>
        </div>
      </div>
    </>
  );
}