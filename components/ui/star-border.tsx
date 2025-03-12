import { cn } from "@/lib/utils"
import { ElementType, ComponentPropsWithoutRef } from "react"

interface StarBorderProps<T extends ElementType> {
  as?: T
  color?: string
  className?: string
  children: React.ReactNode
}

export function StarBorder<T extends ElementType = "div">({
  as,
  className,
  color,
  children,
  ...props
}: StarBorderProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof StarBorderProps<T>>) {
  const Component = as || "div"
  const defaultColor = color || "#8A4FFF" // Summit's primary purple

  return (
    <Component 
      className={cn(
        "relative inline-block",
        className
      )} 
      {...props}
    >
      {/* Outer container with glow effect */}
      <div 
        className="p-[3px] rounded-[22px] relative"
        style={{
          background: `linear-gradient(to right, ${defaultColor}, #FF55C6)`,
          boxShadow: `0 0 10px ${defaultColor}`,
        }}
      >
        {/* Star dots */}
        <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-white shadow-[0_0_5px_#fff]"></div>
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white shadow-[0_0_5px_#fff]"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 rounded-full bg-white shadow-[0_0_5px_#fff]"></div>
        <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-white shadow-[0_0_5px_#fff]"></div>
        
        {/* Content container */}
        <div className="bg-background dark:bg-background rounded-[20px] overflow-hidden">
          {children}
        </div>
      </div>
    </Component>
  )
} 