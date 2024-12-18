import { Link2, Send } from "lucide-react";

export default function FormBuilderHeader({ formId }: { formId: string }) {
  return (
    <div className="h-14 border-b flex items-center px-4 justify-between">
      <div className="flex items-center gap-8">
        <h1 className="font-semibold">Untitled Form</h1>
        
        <div className="flex items-center gap-1">
          <button className="px-3 py-1 rounded hover:bg-gray-100">Build</button>
          <button className="px-3 py-1 rounded hover:bg-gray-100 text-gray-500">Design</button>
        </div>
        <div className="hidden">{formId}</div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Link2 size={20} />
        </button>
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800">
          <Send size={16} />
          Publish
        </button>
      </div>
    </div>
  );
}