import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tag, Filter as FilterIcon } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';

const categories = [
  { id: 1, name: 'All' },
  { id: 2, name: 'Blockchain' },
  { id: 3, name: 'Finance' },
  { id: 4, name: 'Technology' },
  { id: 5, name: 'Innovation' },
  { id: 6, name: 'Crowdfunding' },
  { id: 7, name: 'Sustainability' },
  { id: 8, name: 'Crypto' },
  { id: 9, name: 'NFT' },
  { id: 10, name: 'DeFi' }
];

function PostFilter({ activeFilter, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (category) => {
    onChange(category);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 lg:px-10">
      <div className="flex items-center gap-2 text-gray-300">
        <FilterIcon className="h-4 w-4 text-[#2FB574]" />
        <span className="text-sm font-medium">Filter:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category.id}
            variant={activeFilter === category.name ? "default" : "outline"}
            className={`
              cursor-pointer px-3 py-1 rounded-full transition-colors
              ${activeFilter === category.name 
                ? 'bg-[#2FB574] hover:bg-[#26925e] text-white border-transparent' 
                : 'bg-transparent border-gray-600 text-gray-300 hover:border-[#2FB574] hover:text-[#2FB574]'}
            `}
            onClick={() => onChange(category.name)}
          >
            {category.id === 1 ? null : <Tag className="h-3 w-3 mr-1" />}
            {category.name}
          </Badge>
        ))}
      </div>
      
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="ml-auto bg-transparent border-gray-600 text-gray-300 hover:border-[#2FB574] hover:text-[#2FB574]"
          >
            <FilterIcon className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-[#13261F] border-gray-700 text-white">
          {categories.slice(6).map((category) => (
            <DropdownMenuItem 
              key={category.id}
              className="cursor-pointer hover:bg-[#1A3A2C] focus:bg-[#1A3A2C]"
              onClick={() => handleSelect(category.name)}
            >
              <Tag className="h-3 w-3 mr-2" />
              {category.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default PostFilter; 