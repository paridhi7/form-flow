import { useFormBuilder } from "@/app/store/form-builder";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, GripVertical, MoreVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import BlockSelectionModal from "./blocks/BlockSelectionModal";

interface SortableBlockItemProps {
  id: string;
  index: number;
  question: string;
  isSelected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  isDeletable: boolean;
}

function SortableBlockItem({
  id,
  index,
  question,
  isSelected,
  onSelect,
  onDuplicate,
  onDelete,
  isDeletable,
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 rounded-lg cursor-pointer group ${
        isSelected
          ? 'bg-blue-50 border-blue-500 border'
          : 'hover:bg-gray-50 border border-gray-200'
      } ${isDragging ? 'opacity-50' : ''}`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <button
            className="touch-none opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded cursor-grab"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={16} />
          </button>
          <span className="text-sm text-gray-500">{index + 1}.</span>
          <span className="truncate">{question || ''}</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              className="gap-2"
            >
              <Copy size={16} />
              <span>Duplicate</span>
            </DropdownMenuItem>
            {isDeletable && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="gap-2 text-red-600 focus:text-red-600"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function LeftSidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    blocks,
    addBlock,
    selectedBlockId,
    setSelectedBlock,
    deleteBlock,
    duplicateBlock,
    reorderBlocks,
  } = useFormBuilder();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      reorderBlocks(active.id as string, over.id as string);
    }
  };

  // Get non-thank you blocks for the sortable context
  const regularBlocks = blocks.filter(b => b.isSpecial !== 'thankYou');
  const thankYouBlock = blocks.find(b => b.isSpecial === 'thankYou');

  return (
    <>
      <div className="w-64 border-r h-full p-4 flex flex-col">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full mb-4 bg-blue-500 text-white rounded-lg p-2 flex items-center justify-center gap-2 hover:bg-blue-600"
        >
          <Plus size={20} />
          Add new block
        </button>

        <div className="flex-1 flex flex-col">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={regularBlocks.map(block => block.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {regularBlocks.map((block, index) => (
                  <SortableBlockItem
                    key={block.id}
                    id={block.id}
                    index={index}
                    question={block.question}
                    isSelected={selectedBlockId === block.id}
                    onSelect={() => setSelectedBlock(block.id)}
                    onDuplicate={() => duplicateBlock(block.id)}
                    onDelete={() => deleteBlock(block.id)}
                    isDeletable={true} 
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Thank you block with consistent gap */}
          {thankYouBlock && (
            <div className="mt-20 border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Thank you page</h3>
              <div
                className={`p-3 rounded-lg cursor-pointer ${
                  selectedBlockId === thankYouBlock.id
                    ? 'bg-blue-50 border-blue-500 border'
                    : 'hover:bg-gray-50 border border-gray-200'
                }`}
                onClick={() => setSelectedBlock(thankYouBlock.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="truncate">{thankYouBlock.question}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <BlockSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectBlock={addBlock}
      />
    </>
  );
}