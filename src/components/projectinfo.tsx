import Link from "next/link";
import React from "react";

function ProjectInfo() {
  return (
    <div className="md:absolute block md:bottom-5 md:left-5 text-sm text-gray-600 flex flex-col md:items-start">
      <h2 className="text-xl font-semibold py-2 md:hidden">Project Info</h2>
      <p>
        Done by{" "}
        <Link href={"https://github.com/alperdegre"} className="font-semibold">
          alperdegre
        </Link>{" "}
        in exactly{" "}
        <Link href={"/time.jpg"} className="font-semibold">
          1:58:18,61
        </Link>{" "}
        - plus a couple more for fixes - as a challenge
      </p>
      <p>Uses Tanstack React Query for easier invalidation</p>
      <p>Uses useDebounce to not refetch with every keystroke</p>
      <p>Tailwind for styling</p>
      <p>
        Unfortunately it is not a reusable component, doing it with generics
        would add another couple of hours to development time
      </p>
    </div>
  );
}

export default ProjectInfo;
