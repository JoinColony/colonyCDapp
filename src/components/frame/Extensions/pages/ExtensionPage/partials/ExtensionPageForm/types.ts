import { type RefetchExtensionDataFn } from '~hooks/useExtensionData.ts';
import { type AnyExtensionData } from '~types/extensions.ts';

export interface ExtensionPageFormProps {
  extensionData: AnyExtensionData;
  refetchExtensionData: RefetchExtensionDataFn;
}
