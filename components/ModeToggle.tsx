'use client';

interface ModeToggleProps {
  mode: 'audit' | 'create';
  onModeChange: (mode: 'audit' | 'create') => void;
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-gray-100 rounded-lg p-1 flex">
        <button
          onClick={() => onModeChange('audit')}
          className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
            mode === 'audit'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
                               <span>Audit Existing Amazon Listing</span>
         </button>
         <button
           onClick={() => onModeChange('create')}
           className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
             mode === 'create'
               ? 'bg-white text-orange-600 shadow-sm'
               : 'text-gray-600 hover:text-gray-900'
           }`}
         >
                     <span>Create New Amazon Listing</span>
        </button>
      </div>
    </div>
  );
}
