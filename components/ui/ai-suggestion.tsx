import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface AISuggestionProps {
  suggestions: string[]
  onSuggestionClick: (suggestion: string) => void
  className?: string
}

export function AISuggestion({ 
  suggestions, 
  onSuggestionClick, 
  className 
}: AISuggestionProps) {
  if (!suggestions || suggestions.length === 0) {
    return null
  }

  return (
    <div className={cn("flex flex-wrap gap-2 p-2", className)}>
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSuggestionClick(suggestion)}
          className="text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          {suggestion}
        </Button>
      ))}
    </div>
  )
}