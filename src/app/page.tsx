import KeyboardInfo from "@/components/keyboardinfo";
import Dropdown from "../components/dropdown";
import ProjectInfo from "@/components/projectinfo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-10 md:p-24 gap-4 relative">
      <h1 className="text-2xl tracking-wider">Rick & Morty Dropdown</h1>
      <Dropdown />
      <div className="flex flex-col gap-4 py-10">
        <KeyboardInfo />
        <ProjectInfo />
      </div>
    </main>
  );
}
