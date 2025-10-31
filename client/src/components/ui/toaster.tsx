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
        return <CircleCheckIcon className="me-3 -mt-0.5 inline-flex text-emerald-500 shrink-0" size={16} aria-hidden="true" />
      case "destructive":
        return <CircleXIcon className="me-3 -mt-0.5 inline-flex text-red-500 shrink-0" size={16} aria-hidden="true" />
      case "warning":
        return <TriangleAlert className="me-3 -mt-0.5 inline-flex text-amber-500 shrink-0" size={16} aria-hidden="true" />
      case "info":
        return <InfoIcon className="me-3 -mt-0.5 inline-flex text-blue-500 shrink-0" size={16} aria-hidden="true" />
      default:
        return <InfoIcon className="me-3 -mt-0.5 inline-flex text-blue-500 shrink-0" size={16} aria-hidden="true" />
    }
  }

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex gap-2 w-full">
              <p className="grow text-sm flex items-start">
                {getIcon(variant)}
                <span className="flex flex-col gap-1">
                  {title && <span className="font-semibold">{title}</span>}
                  {description && <span className="opacity-90">{description}</span>}
                </span>
              </p>
              {action}
            </div>
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
