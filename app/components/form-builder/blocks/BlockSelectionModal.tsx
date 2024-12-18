import { BlockType } from "@/app/store/form-builder";
import { AlignLeft, Calendar, CheckSquare, ChevronDown, Hash, Link2, List, Mail, Phone, TextQuote, Type, Upload, X } from "lucide-react";
import { useState } from "react";

const BLOCK_TYPES: { 
  type: BlockType; 
  icon: React.ReactNode; 
  label: string;
  description: string;
  preview: React.ReactNode;
}[] = [
  { 
    type: 'shortText', 
    icon: <Type size={20} />, 
    label: 'Short Text',
    description: 'Use this for short answers, such as Name, Email Address, or any other short text answer.',
    preview: (
      <div className="p-4 bg-white rounded-lg border">
        <h3 className="mb-2">What is your name?</h3>
        <input 
          type="text" 
          className="w-full p-2 border rounded" 
          placeholder="Your answer here..."
          disabled
        />
      </div>
    )
  },
  {
    type: 'longText',
    icon: <AlignLeft size={20} />,
    label: 'Long Text',
    description: 'Use this for longer responses like comments, feedback, or detailed explanations.',
    preview: (
      <div className="p-4 bg-white rounded-lg border">
        <h3 className="mb-2">Tell us about yourself</h3>
        <textarea 
          className="w-full p-2 border rounded" 
          placeholder="Your answer here..."
          rows={3}
          disabled
        />
      </div>
    )
  },
  {
    type: 'email',
    icon: <Mail size={20} />,
    label: 'Email',
    description: 'Collect email addresses with automatic email format validation.',
    preview: (
      <div className="p-4 bg-white rounded-lg border">
        <h3 className="mb-2">What&apos;s your email address?</h3>
        <input 
          type="email" 
          className="w-full p-2 border rounded" 
          placeholder="name@example.com"
          disabled
        />
      </div>
    )
  },
  {
    type: 'phone',
    icon: <Phone size={20} />,
    label: 'Phone Number',
    description: 'Collect phone numbers with optional format validation.',
    preview: (
      <div className="p-4 bg-white rounded-lg border">
        <h3 className="mb-2">What&apos;s your phone number?</h3>
        <input 
          type="tel" 
          className="w-full p-2 border rounded" 
          placeholder="+1 (555) 000-0000"
          disabled
        />
      </div>
    )
  },
  {
    type: 'number',
    icon: <Hash size={20} />,
    label: 'Number',
    description: 'Collect numerical responses with optional min/max values.',
    preview: (
      <div className="p-4 bg-white rounded-lg border">
        <h3 className="mb-2">How many years of experience do you have?</h3>
        <input 
          type="number" 
          className="w-full p-2 border rounded" 
          placeholder="0"
          disabled
        />
      </div>
    )
  },
  {
    type: 'url',
    icon: <Link2 size={20} />,
    label: 'URL',
    description: 'Collect website URLs with automatic format validation.',
    preview: (
      <div className="p-4 bg-white rounded-lg border">
        <h3 className="mb-2">What&apos;s your website URL?</h3>
        <input 
          type="url" 
          className="w-full p-2 border rounded" 
          placeholder="https://example.com"
          disabled
        />
      </div>
    )
  },
  {
    type: 'singleSelect',
    icon: <List size={20} />,
    label: 'Single Select',
    description: 'Allow users to select one option from a list of choices.',
    preview: (
      <div className="p-4 bg-white rounded-lg border">
        <h3 className="mb-2">What&apos;s your preferred contact method?</h3>
        <div className="space-y-2">
          {['Email', 'Phone', 'Text'].map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input type="radio" name="contact" disabled />
              {option}
            </label>
          ))}
        </div>
      </div>
    )
  },
  {
    type: 'multiSelect',
    icon: <CheckSquare size={20} />,
    label: 'Multi Select',
    description: 'Allow users to select multiple options from a list of choices.',
    preview: (
      <div className="p-4 bg-white rounded-lg border">
        <h3 className="mb-2">Which programming languages do you know?</h3>
        <div className="space-y-2">
          {['JavaScript', 'Python', 'Java'].map((option) => (
            <label key={option} className="flex items-center gap-2">
              <input type="checkbox" disabled />
              {option}
            </label>
          ))}
        </div>
      </div>
    )
  },
  {
    type: 'dropdown',
    icon: <ChevronDown size={20} />,
    label: 'Dropdown',
    description: 'Allow users to select one option from a dropdown menu.',
    preview: (
      <div className="p-4 bg-white rounded-lg border">
        <h3 className="mb-2">Select your country</h3>
        <select className="w-full p-2 border rounded" disabled>
          <option>United States</option>
          <option>Canada</option>
          <option>United Kingdom</option>
        </select>
      </div>
    )
  },
  {
    type: 'date',
    icon: <Calendar size={20} />,
    label: 'Date',
    description: 'Collect date inputs with a date picker.',
    preview: (
      <div className="p-4 bg-white rounded-lg border">
        <h3 className="mb-2">When did you start your current role?</h3>
        <input 
          type="date" 
          className="w-full p-2 border rounded"
          disabled
        />
      </div>
    )
  },
  {
    type: 'fileUpload',
    icon: <Upload size={20} />,
    label: 'File Upload',
    description: 'Allow users to upload files with optional type and size restrictions.',
    preview: (
      <div className="p-4 bg-white rounded-lg border">
        <h3 className="mb-2">Upload your resume</h3>
        <div className="border-2 border-dashed rounded-lg p-4 text-center text-gray-500">
          <Upload size={24} className="mx-auto mb-2" />
          <p>Click or drag files to upload</p>
          <p className="text-xs mt-1">Max file size: 5MB</p>
        </div>
      </div>
    )
  },
  {
    type: 'statement',
    icon: <TextQuote size={20} />,
    label: 'Statement',
    description: 'Add a message or information without requiring any input',
    preview: (
      <div className="p-4 bg-white rounded-lg border">
        <h3 className="text-xl mb-2">Welcome! 👋</h3>
        <p className="text-gray-600 text-sm">This is a sample statement block.</p>
      </div>
    )
  }
];

interface BlockSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBlock: (type: BlockType) => void;
}

export default function BlockSelectionModal({ 
  isOpen, 
  onClose, 
  onSelectBlock 
}: BlockSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredBlocks = BLOCK_TYPES.filter(block => {
    const searchLower = searchQuery.toLowerCase();
    return (
      block.label.toLowerCase().includes(searchLower) ||
      block.description.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[800px] max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center shrink-0">
          <h2 className="text-xl font-semibold">Choose your block</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-lg mb-4 sticky top-0 bg-white"
            autoFocus
          />

          {filteredBlocks.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No blocks match your search
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredBlocks.map(({ type, icon, label, description, preview }) => (
                <div 
                  key={type}
                  className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer hover:shadow-sm transition-all"
                  onClick={() => {
                    onSelectBlock(type);
                    setSearchQuery(""); // Reset search when block is selected
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {icon}
                    <h3 className="font-medium">{label}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{description}</p>
                  {preview}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
