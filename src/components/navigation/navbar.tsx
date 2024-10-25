"use client";
import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { type User } from "@supabase/supabase-js";
import { CircleUser, LinkIcon, Menu, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

const navItems = [
  { label: "Home", href: "/home" },
  { label: "Surveys", href: "/survey" },
  { label: "Settings", href: "/settings" },
] as const;

type NavbarProps = {
  user: User;
};

const Navbar = ({ user }: NavbarProps) => {
  const { toast } = useToast();

  const NavLinks = navItems.map((navItem) => (
    <Link
      key={navItem.label}
      href={navItem.href}
      className="text-muted-foreground transition-colors hover:text-foreground"
    >
      {navItem.label}
    </Link>
  ));
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/home"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Image src="/obvious-logo.svg" alt="logo" width={150} height={150} />
        </Link>
        {NavLinks}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/home"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Image
                src="/obvious-logo.svg"
                alt="logo"
                width={85}
                height={85}
              />
            </Link>
            {NavLinks}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search surveys..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My account</DropdownMenuLabel>
              <DropdownMenuItem>{user.email}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>

              <DialogTrigger asChild>
                <DropdownMenuItem>Contact</DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Contact</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-3 text-center">
              <p className="text-center text-gray-500">Contact us here</p>
              <a href="mailto:info@obvious.earth">info@obvious.earth</a>
              <DialogClose asChild>
                <Button
                  variant="default"
                  className="gap-2"
                  type="submit"
                  onClick={async () => {
                    await navigator.clipboard.writeText("info@obvious.earth");
                    toast({
                      title: "Copied email to clipboard",
                      duration: 2000,
                    });
                  }}
                >
                  Copy email
                  <LinkIcon className="size-4" />
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};

export default Navbar;
