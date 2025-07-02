"use client";

import { useState } from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Category } from "../../sanity.types";
import { useRouter } from "next/navigation";

const CategorySelector = ({ categories }: { categories: Category[] }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const router = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full max-w-ful relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 hover:text-white text-white font bold py-2 px-4 rounded"
        >
          {value
            ? categories.find((category) => category._id === value)?.title
            : "Select Category"}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const selectedCategory = categories.find((category) =>
                  category.title
                    ?.toLowerCase()
                    .includes(e.currentTarget.value.toLowerCase())
                );
                if (selectedCategory?.slug?.current) {
                  setValue(selectedCategory._id);
                  setOpen(false);
                  router.push(`/category/${selectedCategory.slug.current}`);
                } else {
                  setValue("");
                }
              }
            }}
            placeholder="Search category..."
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories.map((category) => (
                <CommandItem
                  key={category._id}
                  value={category.title}
                  onSelect={() => {
                    setValue(value === category._id ? "" : category._id);
                    router.push(`/categories/${category.slug?.current}`);
                    setOpen(false);
                  }}
                >
                  {category.title}
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category._id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategorySelector;
