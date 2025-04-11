'use client';

import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Icons} from './icons';
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from '@/components/ui/sheet';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from '@/components/ui/dropdown-menu';

const Sidebar = () => {
  return (
    <aside className="w-64 border-r flex flex-col p-4">
      <div className="mb-4">
        <Avatar className="mx-auto">
          <AvatarImage src="https://picsum.photos/100/100" alt="User Avatar" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <div className="text-center mt-2">
          <p className="font-semibold">User Name</p>
          <p className="text-sm text-muted-foreground">user@example.com</p>
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Button variant="ghost" className="justify-start w-full">
              <Icons.home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="justify-start w-full">
              <Icons.messageSquare className="mr-2 h-4 w-4" />
              Messages
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="justify-start w-full">
              <Icons.settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </li>
        </ul>
      </nav>

      <div className="mt-auto">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <Icons.help className="mr-2 h-4 w-4" />
              Help & Support
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Help & Support</SheetTitle>
              <SheetDescription>
                Contact us for assistance or browse our FAQ.
              </SheetDescription>
            </SheetHeader>
            {/* Add help and support content here */}
          </SheetContent>
        </Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start mt-2">
              <Icons.user className="mr-2 h-4 w-4" />
              Account
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
};

export default Sidebar;
