'use client';

interface ModeToggleProps {
  mode: 'audit' | 'create';
  onModeChange: (mode: 'audit' | 'create') => void;
}

export default function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-[#0B0B0C] border border-white/10 rounded-full p-1 flex">
        <button
          onClick={() => onModeChange('audit')}
          className={`px-4 py-3 md:px-6 rounded-full font-medium transition-all duration-200 text-sm md:text-base ${
            mode === 'audit'
              ? 'bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] text-white shadow-sm'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <span>Audit Existing Amazon Listing</span>
        </button>
        <button
          onClick={() => onModeChange('create')}
          className={`px-4 py-3 md:px-6 rounded-full font-medium transition-all duration-200 text-sm md:text-base ${
            mode === 'create'
              ? 'bg-gradient-to-r from-[#296AFF] to-[#FF7D2B] text-white shadow-sm'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <span>Create New Amazon Listing</span>
        </button>
      </div>
    </div>
  );
}
