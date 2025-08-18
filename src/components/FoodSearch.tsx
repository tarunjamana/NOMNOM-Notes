import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import { useGetAutoSuggestionsQuery } from "../store/services/nutritionApi";
import { APIFoodItem } from "../types/health";

type Props = {
  selected: APIFoodItem | null;
  setSelected: (item: APIFoodItem) => void;
  setIsOpen: (isOpen: boolean) => void;
};

const FoodSearch = ({ selected, setSelected, setIsOpen }: Props) => {
  const [input, setInput] = useState("");
  const debouncedSearchTerm = useDebounce(input, 300);
  const { data, isLoading, isError } = useGetAutoSuggestionsQuery(
    debouncedSearchTerm,
    { skip: debouncedSearchTerm.trim() === "" }
  );

  function handleClick(item: APIFoodItem) {
    setSelected(item);
    setIsOpen(true);
    setInput("");
  }

  useEffect(() => {
    if (selected) {
      console.log("updated selected State:", selected);
    }
  }, [selected]);

  return (
    <div className="w-full max-w-md mx-auto relative">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search for food"
        className="w-full p-4 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      {isLoading && <p className="mt-2 text-sm text-gray-500">Loading...</p>}
      {/* {input.trim() !== "" &&
        !isLoading &&
        Array.isArray(data?.common) &&
        data.common.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-2 shadow-md max-h-60 overflow-y-auto">
            {data.common.slice(0, 8).map((item: APIFoodItem) => (
              <li
                key={item.food_name}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                {item.food_name}
              </li>
            ))}
          </ul>
        )} */}
      {input.trim() !== "" && !isLoading && (
        <>
          {Array.isArray(data?.common) && data.common.length > 0 ? (
            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-2 shadow-md max-h-60 overflow-y-auto">
              {data.common.slice(0, 8).map((item: APIFoodItem) => (
                <li
                  key={item.food_name}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => handleClick(item)}
                >
                  {item.food_name}
                </li>
              ))}
            </ul>
          ) : Array.isArray(data?.branded) && data.branded.length > 0 ? (
            <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-2 shadow-md max-h-60 overflow-y-auto">
              {data.branded.slice(0, 8).map((item: APIFoodItem) => (
                <li
                  key={item.food_name}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => handleClick(item)}
                >
                  {item.food_name}
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}
      {isError && (
        <p className="mt-2 text-sm text-red-600">Something went wrong.</p>
      )}

      {/* {selected && (<div>{ cons }</div>)} */}
    </div>
  );
};

export default FoodSearch;
