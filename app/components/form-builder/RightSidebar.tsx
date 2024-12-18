import { FormBlock, useFormBuilder } from "@/app/store/form-builder";

function TextInputSettings({ block }: { block: FormBlock }) {
  const updateBlock = useFormBuilder(state => state.updateBlock);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium block mb-1">Placeholder Text</label>
        <input
          type="text"
          value={block.placeholder || ''}
          onChange={(e) => updateBlock(block.id, { placeholder: e.target.value })}
          className="w-full p-2 border rounded-md"
          placeholder="Enter placeholder text"
        />
      </div>
      
      {block.type === 'shortText' || block.type === 'longText' ? (
        <div>
          <label className="text-sm font-medium block mb-1">Maximum Length</label>
          <input
            type="number"
            value={block.maxLength || ''}
            onChange={(e) => updateBlock(block.id, { maxLength: parseInt(e.target.value) || undefined })}
            className="w-full p-2 border rounded-md"
            placeholder="Leave empty for no limit"
          />
        </div>
      ) : null}
    </div>
  );
}

function NumberInputSettings({ block }: { block: FormBlock }) {
  const updateBlock = useFormBuilder(state => state.updateBlock);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium block mb-1">Placeholder Text</label>
        <input
          type="text"
          value={block.placeholder || ''}
          onChange={(e) => updateBlock(block.id, { placeholder: e.target.value })}
          className="w-full p-2 border rounded-md"
          placeholder="Enter placeholder text"
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Minimum Value</label>
        <input
          type="number"
          value={block.minValue || ''}
          onChange={(e) => updateBlock(block.id, { minValue: parseInt(e.target.value) || undefined })}
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Maximum Value</label>
        <input
          type="number"
          value={block.maxValue || ''}
          onChange={(e) => updateBlock(block.id, { maxValue: parseInt(e.target.value) || undefined })}
          className="w-full p-2 border rounded-md"
        />
      </div>
    </div>
  );
}

function FileUploadSettings({ block }: { block: FormBlock }) {
  const updateBlock = useFormBuilder(state => state.updateBlock);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium block mb-1">Allowed File Types</label>
        <select
          multiple
          value={block.allowedFileTypes || []}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
            updateBlock(block.id, { allowedFileTypes: selected });
          }}
          className="w-full p-2 border rounded-md"
        >
          <option value="image/*">Images</option>
          <option value="application/pdf">PDF</option>
          <option value="application/msword">Word Documents</option>
          <option value="text/plain">Text Files</option>
          <option value="application/vnd.ms-excel">Excel Files</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium block mb-1">Maximum File Size (MB)</label>
        <input
          type="number"
          value={(block.maxFileSize || 0) / (1024 * 1024)}
          onChange={(e) => updateBlock(block.id, { 
            maxFileSize: Math.max(0, parseInt(e.target.value) || 0) * 1024 * 1024 
          })}
          className="w-full p-2 border rounded-md"
          min="0"
        />
      </div>
    </div>
  );
}

function SelectionSettings({ block }: { block: FormBlock }) {
  const updateBlock = useFormBuilder(state => state.updateBlock);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium block mb-1">Options</label>
        <div className="space-y-2">
          {block.options?.map((option, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...(block.options || [])];
                  newOptions[index] = e.target.value;
                  updateBlock(block.id, { options: newOptions });
                }}
                className="flex-1 p-2 border rounded-md"
                placeholder={`Option ${index + 1}`}
              />
              <button
                onClick={() => {
                  const newOptions = block.options?.filter((_, i) => i !== index);
                  updateBlock(block.id, { options: newOptions });
                }}
                className="p-2 text-red-500 hover:text-red-600"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() => updateBlock(block.id, { 
              options: [...(block.options || []), `Option ${(block.options?.length || 0) + 1}`] 
            })}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            Add Option
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RightSidebar() {
  //const selectedBlockId = useFormBuilder(state => state.selectedBlockId);
  const block = useFormBuilder(state => 
    state.blocks.find(b => b.id === state.selectedBlockId)
  );

  if (!block) {
    return (
      <div className="w-80 border-l h-full p-4">
        <div className="text-sm text-gray-500">
          Select a block to configure its settings
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-l h-full p-4 overflow-y-auto">
      <h3 className="font-medium mb-4">Block Settings</h3>
      
      {/* Common Settings */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="text-sm font-medium block mb-1">Question Text</label>
          <input
            type="text"
            value={block.question}
            onChange={(e) => useFormBuilder.getState().updateBlock(block.id, { 
              question: e.target.value 
            })}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Description</label>
          <textarea
            value={block.description || ''}
            onChange={(e) => useFormBuilder.getState().updateBlock(block.id, { 
              description: e.target.value 
            })}
            className="w-full p-2 border rounded-md"
            placeholder="Add a description (optional)"
            rows={3}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium block mb-1">Button Text</label>
          <input
            type="text"
            value={block.buttonText ?? ''}
            onChange={(e) => useFormBuilder.getState().updateBlock(block.id, { 
              buttonText: e.target.value || undefined
            })}
            className="w-full p-2 border rounded-md"
            placeholder="Add button text (optional)"
          />
        </div>

        {block.isSpecial === 'thankYou' && (
          <div>
            <label className="text-sm font-medium block mb-1">Button URL</label>
            <input
              type="url"
              value={block.buttonUrl ?? 'formsunlimited.com'}
              onChange={(e) => useFormBuilder.getState().updateBlock(block.id, { 
                buttonUrl: e.target.value || 'formsunlimited.com'
              })}
              className="w-full p-2 border rounded-md"
              placeholder="Enter button URL"
            />
          </div>
        )}
        
        {!block.isSpecial && block.type !== 'statement' && (
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={block.required}
                onChange={(e) => useFormBuilder.getState().updateBlock(block.id, { 
                  required: e.target.checked 
                })}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium">Required field</span>
            </label>
          </div>
        )}
      </div>

      {/* Block-specific Settings */}
      {(['shortText', 'longText', 'email', 'phone', 'url'].includes(block.type)) && (
        <TextInputSettings block={block} />
      )}
      
      {block.type === 'number' && (
        <NumberInputSettings block={block} />
      )}
      
      {(['singleSelect', 'multiSelect', 'dropdown'].includes(block.type)) && (
        <SelectionSettings block={block} />
      )}
      
      {block.type === 'fileUpload' && (
        <FileUploadSettings block={block} />
      )}
    </div>
  );
}