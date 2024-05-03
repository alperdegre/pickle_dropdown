"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import React, { useEffect, useRef, useState } from "react";
import { Character } from "../types/types";
import { ChevronDown } from "./icons";
import SelectedItem from "./selectedItem";
import DropdownItem from "./dropdownItem";

function Dropdown() {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<Character[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  const debouncedInput = useDebounce(input, 100);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    handleInvalidate();
  }, [debouncedInput]);

  const { status, data, error } = useQuery({
    queryKey: ["characters"],
    queryFn: async () => {
      const request = await fetch(
        `https://rickandmortyapi.com/api/character?name=${input}`,
        {
          method: "GET",
        }
      );
      return await request.json();
    },
  });

  const handleToggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    if (e.target.value.length > 0) {
      setDropdownOpen(true);
    } else {
      setDropdownOpen(false);
    }
  };

  const handleInvalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["characters"] });
  };

  const handleSelected = (
    e: React.MouseEvent<HTMLInputElement>,
    character: Character
  ) => {
    if (!e.currentTarget.checked) {
      handleRemoveSelected(character.id);
    } else {
      setSelected((prev) => [...prev, character]);
    }
  };

  const handleRemoveSelected = (id: number) => {
    setSelected((prev) => prev.filter((char) => char.id !== id));
  };

  const checkCheckedStatus = (characterId: number) => {
    if (selected.find((character) => character.id === characterId)) {
      return true;
    } else {
      return false;
    }
  };

  if (error) {
    return (
      <div className="flex flex-col gap-4 items-center">
        <p className="text-red-500">
          There was an error while fetching Rick and Morty API
        </p>
        <button
          className="bg-black text-white hover:bg-black/80 rounded-lg w-min py-1 px-2"
          onClick={() => handleInvalidate()}
        >
          RETRY
        </button>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div role="status" className="py-5">
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin dark:text-white fill-gray-700"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative mx-auto md:w-min w-full">
      <div className="flex w-full md:w-[500px] relative bg-white rounded-xl border-2 border-gray-400 p-2 shadow-md">
        <div className="flex flex-1 flex-wrap gap-2">
          {selected.map((selectedCharacter: Character) => {
            return (
              <SelectedItem
                key={selectedCharacter.id}
                name={selectedCharacter.name}
                id={selectedCharacter.id}
                onRemove={handleRemoveSelected}
              />
            );
          })}
          <input
            value={input}
            onChange={handleSearchInput}
            onFocus={(e) => setDropdownOpen(true)}
            placeholder="Enter a character name"
            className="bg-transparent p-1 flex-1 min-w-[170px]"
          />
        </div>
        <button
          className={`flex items-center justify-center px-1 ${
            dropdownOpen && "rotate-180"
          } transition`}
          ref={buttonRef}
          onClick={handleToggleDropdown}
        >
          <ChevronDown />
        </button>
      </div>
      {dropdownOpen && (
        <div
          className="absolute mt-2 left-0 w-full md:w-[500px] bg-white rounded-xl border-2 border-gray-400 shadow-md divide-y divide-gray-400 max-h-[500px] overflow-y-auto"
          ref={dropdownRef}
        >
          {data.results ? (
            data.results.map((character: Character) => {
              return (
                <DropdownItem
                  character={character}
                  onSelected={handleSelected}
                  checked={checkCheckedStatus(character.id)}
                  input={input}
                />
              );
            })
          ) : (
            <div className="p-2 py-4 flex gap-2 items-center text-gray-600 text-sm flex items-center justify-center">
              No character found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
