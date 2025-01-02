import { FormBlock } from "@/app/store/form-builder";
import { Link2, Send } from "lucide-react";
import { useEffect, useState } from "react";

interface FormBuilderHeaderProps {
  formId: string;
  saveStatus: 'saved' | 'saving' | 'error' | 'idle';
  onSave: (data: { title: string; blocks: FormBlock[] }) => Promise<void>;
  initialTitle: string;
}

export default function FormBuilderHeader({ saveStatus, onSave, initialTitle }: FormBuilderHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  // Update title when initialTitle changes
  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const handleTitleSubmit = async () => {
    const newTitle = title.trim() || 'My Form';
    setTitle(newTitle);
    setIsEditing(false);
    
    await onSave({
      title: newTitle,
      blocks: []  // This will be filled in by the parent component
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitle(initialTitle);
      setIsEditing(false);
    }
  };

  return (
    <div className="h-14 border-b flex items-center px-4 justify-between">
      <div className="flex items-center gap-8">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={handleKeyDown}
            className="font-semibold bg-transparent border-b border-gray-300 focus:border-gray-500 outline-none px-0"
            autoFocus
          />
        ) : (
          <h1 
            className="font-semibold cursor-pointer hover:text-gray-600"
            onClick={() => {
              setIsEditing(true);
              setTitle(initialTitle);
            }}
          >
            {title}
          </h1>
        )}
        
        <div className="flex items-center gap-1">
          <button className="px-3 py-1 rounded hover:bg-gray-100">Build</button>
          <button className="px-3 py-1 rounded hover:bg-gray-100 text-gray-500">Design</button>
        </div>

        {/* Save status indicator */}
        <div className="text-sm">
          {saveStatus === 'saving' && <span className="text-gray-500">Saving...</span>}
          {saveStatus === 'saved' && <span className="text-green-600">Saved</span>}
          {saveStatus === 'error' && <span className="text-red-600">Save failed</span>}
        </div>
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