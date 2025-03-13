import { Loader2, RefreshCw } from "lucide-react"

export function RefreshSpin({ isLoading }: { isLoading: boolean }) {
  return isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />
}

