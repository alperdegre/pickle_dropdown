import { Character } from "@/types/types";
import React from "react";
import Image from "next/image";

interface Props {
  input: string;
  checked: boolean;
  character: Character;
  onSelected: (
    e: React.MouseEvent<HTMLInputElement>,
    character: Character
  ) => void;
}

function DropdownItem({ input, character, checked, onSelected }: Props) {
  const renderNameHighlight = (input: string, name: string) => {
    if (input.length === 0) return name;

    const parts = name.split(new RegExp(`(${input})`, "gi"));

    return parts.map((part, index) => {
      if (part.toLocaleLowerCase() === input.toLocaleLowerCase()) {
        return <strong key={index}>{part}</strong>;
      } else {
        return part;
      }
    });
  };

  return (
    <div className="p-2 flex gap-2 items-center">
      <input
        type="checkbox"
        className="rounded-md"
        checked={checked}
        onClick={(e) => onSelected(e, character)}
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
          {renderNameHighlight(input, character.name)}
        </p>
        <p className="text-gray-600 text-xs">
          {character.episode.length}{" "}
          {character.episode.length <= 1 ? `Episode` : `Episodes`}
        </p>
      </div>
    </div>
  );
}

export default DropdownItem;
