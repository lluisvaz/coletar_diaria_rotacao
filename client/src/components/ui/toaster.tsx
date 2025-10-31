import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CircleCheckIcon, CircleXIcon, TriangleAlert, InfoIcon } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  const getIcon = (variant?: string | null) => {
    switch (variant) {
      case "success":
        return <CircleCheckIcon className="shrink-0 text-emerald-500" size={18} aria-hidden="true" />
      case "destructive":
        return <CircleXIcon className="shrink-0 text-red-500" size={18} aria-hidden="true" />
      case "warning":
        return <TriangleAlert className="shrink-0 text-amber-500" size={18} aria-hidden="true" />
      case "info":
        return <InfoIcon className="shrink-0 text-blue-500" size={18} aria-hidden="true" />
      default:
        return <InfoIcon className="shrink-0 text-blue-500" size={18} aria-hidden="true" />
    }
  }

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex gap-3 w-full items-start">
              <div className="flex items-start pt-0.5">
                {getIcon(variant)}
              </div>
              <div className="flex-1 flex flex-col gap-1">
                {title && <p className="text-sm font-semibold leading-tight">{title}</p>}
                {description && <p className="text-sm opacity-90 leading-tight">{description}</p>}
              </div>
              {action && <div className="flex items-start">{action}</div>}
            </div>
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
