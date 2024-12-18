import { useFormBuilder } from "@/app/store/form-builder";
import { Link2, Send } from "lucide-react";
import { useState } from "react";

export default function FormBuilderHeader({ formId }: { formId: string }) {
  const { formTitle, setFormTitle } = useFormBuilder();
  const [isEditing, setIsEditing] = useState(false);
  const [editableTitle, setEditableTitle] = useState(formTitle);

  const handleTitleSubmit = () => {
    setFormTitle(editableTitle.trim() || 'Untitled Form');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setEditableTitle(formTitle);
      setIsEditing(false);
    }
  };

  return (
    <div className="h-14 border-b flex items-center px-4 justify-between">
      <div className="flex items-center gap-8">
        {isEditing ? (
          <input
            type="text"
            value={editableTitle}
            onChange={(e) => setEditableTitle(e.target.value)}
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
              setEditableTitle(formTitle);
            }}
          >
            {formTitle}
          </h1>
        )}
        
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