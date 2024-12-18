import { FormBlock } from "@/app/store/form-builder";
import { Calendar, ChevronDown } from "lucide-react";
import StatementBlock from "./StatementBlock";

export default function BlockContent({ block }: { block: FormBlock }) {
  if (block.type === 'statement') {
    return <StatementBlock block={block} />;
  }

  switch (block.type) {
    case 'shortText':
      return (
        <input
          type="text"
          placeholder={block.placeholder || 'Short answer text'} 
          className="w-full p-2 border rounded-md bg-gray-50"
          disabled
        />
      );

    case 'longText':
      return (
        <textarea
          placeholder={block.placeholder || 'Long answer text'} 
          className="w-full p-2 border rounded-md bg-gray-50 min-h-[100px]"
          disabled
        />
      );

    case 'email':
      return (
        <input
          type="email"
          placeholder={block.placeholder || "email@example.com"}
          className="w-full p-2 border rounded-md bg-gray-50"
          disabled
        />
      );

    case 'phone':
      return (
        <div className="flex gap-2 items-center">
          <select className="p-2 border rounded-md bg-gray-50 w-[100px]" disabled>
            <option>🇮🇳 +91</option>
          </select>
          <input
            type="tel"
            placeholder={block.placeholder || "Phone number"}
            className="w-full p-2 border rounded-md bg-gray-50"
            disabled
          />
        </div>
      );

    case 'number':
      return (
        <input
          type="number"
          placeholder={block.placeholder || "0"}
          className="w-full p-2 border rounded-md bg-gray-50"
          disabled
        />
      );

    case 'url':
      return (
        <input
          type="url"
          placeholder={block.placeholder || "https://example.com"}
          className="w-full p-2 border rounded-md bg-gray-50"
          disabled
        />
      );

    case 'singleSelect':
      return (
        <div className="space-y-2">
          {(block.options || ['Option 1']).map((option, index) => (
            <label key={index} className="flex items-center gap-2">
              <input
                type="radio"
                name={`radio-${block.id}`}
                className="w-4 h-4"
                disabled
              />
              <span className="text-gray-600">{option}</span>
            </label>
          ))}
        </div>
      );

    case 'multiSelect':
      return (
        <div className="space-y-2">
          {(block.options || ['Option 1']).map((option, index) => (
            <label key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded"
                disabled
              />
              <span className="text-gray-600">{option}</span>
            </label>
          ))}
        </div>
      );

    case 'dropdown':
      return (
        <div className="relative">
          <select className="w-full p-2 pr-8 border rounded-md bg-gray-50 appearance-none" disabled>
            <option>Select an option</option>
            {(block.options || ['Option 1']).map((option, index) => (
              <option key={index}>{option}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
        </div>
      );

    case 'date':
      return (
        <div className="relative">
          <input
            type="text"
            placeholder="Select a date"
            className="w-full p-2 pr-8 border rounded-md bg-gray-50"
            disabled
          />
          <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
        </div>
      );

    case 'fileUpload':
      return (
        <div className="border-2 border-dashed rounded-lg p-6 text-center bg-gray-50">
          <p className="text-gray-500">Drag and drop a file here, or click to select</p>
          <p className="text-sm text-gray-400 mt-1">Maximum file size: 5MB</p>
        </div>
      );

    default:
      return null;
  }
} 