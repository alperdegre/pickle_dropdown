"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

function Dropdown() {
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  const debouncedInput = useDebounce(input, 200);

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
    queryClient.invalidateQueries({ queryKey: ["characters"] });
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

  const handleSelected = (character: any) => {
    setSelected((prev) => [...prev, character]);
  };

  const handleRemoveSelected = (id: number) => {
    setSelected((prev) => prev.filter((char) => char.id !== id));
  };

  const renderNameHighlight = (name: string) => {
    if (input.length === 0) return name;

    const parts = name.split(new RegExp(`(${input})`, "gi"));

    return parts.map((part, index) => {
        if(part.toLocaleLowerCase() === input.toLocaleLowerCase()) {
            return <strong>{part}</strong>
        } else {
            return part
        }
    })
  };

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative">
      <div className="flex w-[500px] relative bg-white rounded-xl border-2 border-gray-400 p-2 shadow-md">
        <div className="flex flex-1 flex-wrap gap-2">
          {selected.map((selectedCharacter) => {
            return (
              <div
                className="flex items-center w-max"
                key={selectedCharacter.id}
              >
                <div className="bg-gray-300 px-2 py-1 rounded-lg flex items-center gap-2 w-max">
                  {selectedCharacter.name}
                  <button
                    className="bg-gray-500 hover:bg-gray-500/80 h-5 w-5 text-white rounded-md text-xs flex items-center justify-center"
                    onClick={() => handleRemoveSelected(selectedCharacter.id)}
                  >
                    <ClearIcon />
                  </button>
                </div>
              </div>
            );
          })}
          <input
            value={input}
            onChange={handleSearchInput}
            onFocus={(e) => setDropdownOpen(true)}
            placeholder="Enter a character name"
            className="bg-transparent outline-none p-1 flex-1 min-w-[170px]"
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
          className="absolute mt-2 left-0 w-[500px] bg-white rounded-xl border-2 border-gray-400 shadow-md divide-y divide-gray-400 max-h-[500px] overflow-y-auto"
          ref={dropdownRef}
        >
          {data.results ? (
            data.results.map((character: any) => {
              console.log(character);
              return (
                <div className="p-2 flex gap-2 items-center">
                  <input
                    type="checkbox"
                    className="rounded-md"
                    onClick={() => handleSelected(character)}
                  />
                  <Image
                    src={character.image}
                    alt={`${character.name} portrait image`}
                    width={40}
                    height={40}
                    className="rounded-md w-10 h-10"
                  />
                  <div>
                    <p className="text-gray-600 text-sm">
                      {renderNameHighlight(character.name)}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {character.episode.length}{" "}
                      {character.episode.length <= 1 ? `Episode` : `Episodes`}
                    </p>
                  </div>
                </div>
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

const ChevronDown = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-chevron-down"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
};

const ClearIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-x h-5 w-5"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
};
