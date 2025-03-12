'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Edit2, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InlineEditProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  multiline?: boolean
  maxLength?: number
  disabled?: boolean
}

export function InlineEdit({
  value,
  onChange,
  className,
  placeholder = 'Click to edit',
  multiline = false,
  maxLength,
  disabled = false
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleStartEdit = () => {
    if (disabled) return
    setIsEditing(true)
  }

  const handleSave = () => {
    onChange(editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div className={cn('group relative', className)}>
      {isEditing ? (
        <div className="flex items-start gap-2">
          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full min-h-[100px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={placeholder}
              maxLength={maxLength}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={placeholder}
              maxLength={maxLength}
            />
          )}
          <div className="flex flex-col gap-1">
            <button
              onClick={handleSave}
              className="p-1 bg-green-100 rounded-md hover:bg-green-200 text-green-700"
              aria-label="Save"
            >
              <Check size={16} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 bg-red-100 rounded-md hover:bg-red-200 text-red-700"
              aria-label="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleStartEdit}
          className={cn(
            'relative cursor-pointer rounded-md p-2 transition-colors',
            !disabled && 'hover:bg-gray-100',
            disabled && 'cursor-default'
          )}
        >
          {value ? (
            <div className="pr-6">{value}</div>
          ) : (
            <div className="text-gray-400 italic pr-6">{placeholder}</div>
          )}
          {!disabled && (
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit2 size={16} className="text-gray-500" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function InlineEditTitle({
  value,
  onChange,
  className,
  disabled = false
}: InlineEditProps) {
  return (
    <InlineEdit
      value={value}
      onChange={onChange}
      className={cn('text-2xl font-bold', className)}
      placeholder="Enter title"
      disabled={disabled}
    />
  )
}

export function InlineEditDescription({
  value,
  onChange,
  className,
  disabled = false
}: InlineEditProps) {
  return (
    <InlineEdit
      value={value}
      onChange={onChange}
      className={cn('text-gray-600', className)}
      placeholder="Enter description"
      multiline
      disabled={disabled}
    />
  )
} 