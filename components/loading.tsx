export function Loading(){
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-bounce"></div>
                <div className="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-bounce [animation-delay:0.2s]"></div>
                <div className="h-2 w-2 rounded-full bg-purple-600 dark:bg-purple-400 animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
  )
}