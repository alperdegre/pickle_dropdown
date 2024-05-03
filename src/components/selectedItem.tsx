import React from "react";
import { ClearIcon } from "./icons";

interface Props {
  name: string;
  id: number;
  onRemove: (id: number) => void;
}

function SelectedItem({ id, name, onRemove }: Props) {
  return (
    <div className="flex items-center w-max" key={id}>
      <div className="bg-gray-300 px-2 py-1 rounded-lg flex items-center gap-2 w-max">
        {name}
        <button
          className="bg-gray-500 hover:bg-gray-500/80 h-5 w-5 text-white rounded-md text-xs flex items-center justify-center"
          onClick={() => onRemove(id)}
        >
          <ClearIcon />
        </button>
      </div>
    </div>
  );
}

export default SelectedItem;
