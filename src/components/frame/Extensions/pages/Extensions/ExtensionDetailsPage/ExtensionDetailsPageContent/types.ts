import { type RefetchExtensionDataFn } from '~hooks/useExtensionData.ts';
import { type AnyExtensionData } from '~types/extensions.ts';

export interface ExtensionDetailsPageContentProps {
  extensionData: AnyExtensionData;
  refetchExtensionData: RefetchExtensionDataFn;
}
