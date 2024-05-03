import React from "react";

function KeyboardInfo() {
  return (
    <div className="md:absolute block md:top-5 md:right-5 text-sm text-gray-600 flex flex-col md:items-end">
      <h2 className="text-xl font-semibold py-2 md:hidden">Keyboard Info</h2>
      <p>{"You can navigate forward through components with <Tab>"}</p>
      <p>{"<Shift-Tab> to navigate backwards"}</p>
      <p>{"Press <Enter> when chevron is selected to open the dropdown"}</p>
      <p>{"<Tab> and <Shift-Tab> to move between items"}</p>
      <p>{"<Space> to check / uncheck an item"}</p>
    </div>
  );
}

export default KeyboardInfo;
