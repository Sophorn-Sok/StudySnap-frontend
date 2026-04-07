'use client';

import { Search, Bell } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from '@/components/ui/menubar';
import { AvatarDropdown } from '@/components/dashboard/AvatarDropdown';

export const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="h-[60px] px-6 flex items-center justify-between">

        {/* Left: Search */}
        <div className="w-72">
          <InputGroup className="h-9 w-full border-gray-200 bg-gray-50">
            <InputGroupAddon>
              <Search className="w-4 h-4 text-gray-400" />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              placeholder="Search notes, flashcards..."
              className="h-9 placeholder:text-gray-400"
            />
          </InputGroup>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Menubar className="border-none bg-transparent p-0 h-auto gap-0">
            <MenubarMenu>
              <MenubarTrigger className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-150">
                Create
              </MenubarTrigger>
              <MenubarContent align="end" className="w-48">
                <MenubarItem className="cursor-pointer">
                  New Note
                </MenubarItem>
                <MenubarItem className="cursor-pointer">
                  New Deck
                </MenubarItem>
                <MenubarItem className="cursor-pointer">
                  Start Meeting
                </MenubarItem>
                <MenubarItem className="cursor-pointer">
                  Upload Recording
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>

          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-150">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <AvatarDropdown />
        </div>
      </div>
    </nav>
  );
};
