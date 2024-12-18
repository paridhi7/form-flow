import { useFormBuilder } from "@/app/store/form-builder";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FormBlock from "./blocks/FormBlock";

export default function PreviewArea() {
  const blocks = useFormBuilder((state) => state.blocks);
  const selectedBlockId = useFormBuilder((state) => state.selectedBlockId);
  const setSelectedBlock = useFormBuilder((state) => state.setSelectedBlock);

  // Filter out thank you block for counting
  const regularBlocks = blocks.filter(b => b.isSpecial !== 'thankYou');
  const currentBlockIndex = regularBlocks.findIndex(b => b.id === selectedBlockId);
  const currentBlock = blocks.find(b => b.id === selectedBlockId);

  // Calculate current index including thank you block
  const isThankYouSelected = currentBlock?.isSpecial === 'thankYou';

  return (
    <div className="flex-1 bg-gray-50 p-8 relative">
      {/* Dotted border container */}
      <div className="max-w-3xl mx-auto min-h-[calc(100vh-8rem)] border border-dashed border-gray-300 rounded-lg bg-white">
        <div className="flex flex-col items-center justify-center min-h-full p-16">
          {blocks.length === 0 ? (
            <div className="text-center text-gray-500">
              Add blocks from the left sidebar to start building your form
            </div>
          ) : currentBlock ? (
            <div className="w-full max-w-xl">
              <FormBlock block={currentBlock} />
            </div>
          ) : null}
        </div>
      </div>

      {/* Navigation */}
      {blocks.length > 0 && !isThankYouSelected && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm">
          <button
            onClick={() => setSelectedBlock(regularBlocks[currentBlockIndex - 1]?.id)}
            disabled={currentBlockIndex <= 0}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronLeft size={20} />
          </button>
          
          <span className="text-sm text-gray-600">
            {currentBlockIndex + 1} of {regularBlocks.length}
          </span>
          
          <button
            onClick={() => setSelectedBlock(regularBlocks[currentBlockIndex + 1]?.id)}
            disabled={currentBlockIndex >= regularBlocks.length - 1}
            className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}