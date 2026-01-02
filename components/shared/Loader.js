import React from 'react'

export default function Loader() {
  return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
      </div>
  )
}
