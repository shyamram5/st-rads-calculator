import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

export default function MobileSelect({ value, onValueChange, placeholder, options, label, children, ...props }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (!isMobile) {
    // Desktop: render standard Select
    if (children) {
      return (
        <Select value={value} onValueChange={onValueChange} {...props}>
          {children}
        </Select>
      );
    }
    return (
      <Select value={value} onValueChange={onValueChange} {...props}>
        <SelectTrigger className="min-h-[44px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options?.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Mobile: render Drawer bottom sheet
  const selectedLabel = options?.find(o => o.value === value)?.label || placeholder || "Select...";

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
        className="w-full justify-between min-h-[44px] font-normal text-left"
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value ? selectedLabel : (placeholder || "Select...")}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" className="opacity-50 ml-2 flex-shrink-0">
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{label || placeholder || "Select"}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 max-h-[60vh] overflow-y-auto">
            <div className="space-y-1">
              {options?.map((opt) => (
                <DrawerClose key={opt.value} asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between min-h-[48px] text-base"
                    onClick={() => {
                      onValueChange(opt.value);
                      setOpen(false);
                    }}
                  >
                    {opt.label}
                    {value === opt.value && <Check className="w-5 h-5 text-blue-600" />}
                  </Button>
                </DrawerClose>
              ))}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export { useIsMobile };