import { LoadingBars } from "@/shared/ui/LoadingBars";

type Props = {
  visible: boolean;
  label?: string;
};

export function LoadingOverlay({ visible, label }: Props) {
  if (!visible) return null;

  return (
    <LoadingBars
      fullScreen
      label={label || "A preparar o dashboard..."}
    />
  );
}
