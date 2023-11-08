import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchOrder() {
  const [query, setQuery] = useState();
  const navigate = useNavigate();

  function handleSunmit(e) {
    e.preventDefault();
    if (!query) return;
    navigate(`/order/${query}`);
    setQuery("");
  }
  return (
    <form onSubmit={handleSunmit}>
      <input
        placeholder="Search order #"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="focus:w-32 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-yellow-500 transition-all duration-300  rounded-full w-28 px-4 py-2 text-sm bg-yellow-100 placeholder:text-stone-400 sm:focus:w-72  sm:w-64 "
      />
    </form>
  );
}

export default SearchOrder;
