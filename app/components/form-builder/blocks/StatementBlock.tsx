import { FormBlock as IFormBlock, useFormBuilder } from "@/app/store/form-builder";
import { ArrowRight } from "lucide-react";

export default function StatementBlock({ block }: { block: IFormBlock }) {
  const { updateBlock } = useFormBuilder();

  return (
    <div className="w-full">
      <div className="mb-8">
        <input
          type="text"
          value={block.question}
          onChange={(e) => updateBlock(block.id, { question: e.target.value })}
          className={`w-full text-3xl font-medium outline-none border-none bg-transparent ${
            block.question ? 'text-gray-800' : 'text-gray-400 placeholder-gray-400'
          }`}
          placeholder="Your title here..."
        />
        {block.description && (
          <div className="mt-4 text-gray-600">
            {block.description}
          </div>
        )}
      </div>

      <button
        className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
      >
        {block.buttonText && <span>{block.buttonText}</span>}
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
