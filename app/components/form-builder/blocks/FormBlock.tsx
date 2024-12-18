import { BlockType, FormBlock as IFormBlock, useFormBuilder } from "@/app/store/form-builder";
import { ArrowRight } from "lucide-react";
import BlockContent from "./BlockContent";

export default function FormBlock({ block }: { block: IFormBlock }) {
  const { updateBlock } = useFormBuilder();

  if (block.type === 'statement') {
    return <BlockContent block={block} />;
  }

  const getPlaceholder = (type: BlockType) => {
    switch (type) {
      case 'shortText':
      case 'longText':
        return 'Your question here...';
      case 'statement':
        return 'Your title here...';
      default:
        return 'Your question here...';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <input
          type="text"
          value={block.question}
          onChange={(e) => updateBlock(block.id, { question: e.target.value })}
          className="w-full text-3xl font-normal outline-none border-none bg-transparent text-gray-600 placeholder-gray-400"
          placeholder={getPlaceholder(block.type)}
        />
        {block.description && (
          <div className="mt-2 text-gray-500">
            {block.description}
          </div>
        )}
      </div>

      <div className="mb-8">
        <BlockContent block={block} />
      </div>

      <button
        className="px-6 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
      >
        {block.buttonText && <span>{block.buttonText}</span>}
        <ArrowRight size={18} />
      </button>

      <div className="mt-4">
        <label className="flex items-center gap-2 text-sm text-gray-500">
          <input
            type="checkbox"
            checked={block.required}
            onChange={(e) => updateBlock(block.id, { required: e.target.checked })}
            className="rounded border-gray-300"
          />
          Required
        </label>
      </div>
    </div>
  );
}
