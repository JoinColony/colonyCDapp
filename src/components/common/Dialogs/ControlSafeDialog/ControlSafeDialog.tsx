import React /* useState */ from 'react';
/* import { useNavigate } from 'react-router-dom'; */
/* import { InferType } from 'yup'; */

import Dialog, { DialogProps, ActionDialogProps } from '~shared/Dialog';
import { ActionHookForm as Form } from '~shared/Fields';
/* import { GNOSIS_AMB_BRIDGES, SAFE_NAMES_MAP } from '~constants'; */
import { ActionTypes } from '~redux/index';
/* import { pipe, withMeta, mapPayload } from '~utils/actions'; */
import { WizardDialogType } from '~hooks';

/* import ControlSafeForm from './ControlSafeForm';
 * import { getValidationSchema } from './validation';
 * import { getControlSafeDialogPayload, NetworkOption } from './helpers'; */

type Props = Required<DialogProps> &
  WizardDialogType<object> &
  ActionDialogProps;

export const displayName = 'common.ControlSafeDialog';

const ControlSafeDialog = ({
  /* colony: { colonyAddress }, // safes */
  /* colony,
   * callStep,
   * prevStep, */
  cancel,
  close,
}: Props) => {
  /* const navigate = useNavigate();
   * const loadingSafeState = useState<boolean>(false);
   * const loadingModuleState = useState<boolean>(false);
   * const [stepIndex, setStepIndex] = useState<number>(1);
   * const abortControllerState = useState<AbortController | undefined>(undefined); */

  /* const validationSchema = getValidationSchema(
   *   stepIndex,
   *   abortControllerState,
   *   [], // safes,
   *   loadingSafeState,
   *   // loadingModuleState,
   * ); */

  /* type FormValues = InferType<typeof validationSchema>; */
  type FormValues = Record<string, any>;

  // Create array for Network options
  /* const networkOptions: NetworkOption[] = Object.keys(GNOSIS_AMB_BRIDGES).map(
   *   (chainId) => {
   *     return {
   *       label: SAFE_NAMES_MAP[chainId],
   *       value: Number(chainId),
   *     };
   *   },
   * ); */

  /* const transform = pipe(
   *   mapPayload((payload) => getControlSafeDialogPayload(colony, payload)),
   *   withMeta({ navigate }),
   * ); */

  return (
    <Dialog cancel={cancel}>
      <Form<FormValues>
        defaultValues={
          {
            /* chainId: networkOptions[0].value,
          safeName: '',
          contractAddress: '', */
          }
        }
        /* validationSchema={validationSchema} */
        actionType={ActionTypes.ACTION_MANAGE_EXISTING_SAFES}
        /* transform={transform} */
        onSuccess={close}
      >
        <p>test</p>
        {/* <ControlSafeForm
                  networkOptions={networkOptions}
                  colonySafes={[]} // safes
                  back={() => callStep(prevStep)}
                  colonyAddress={colonyAddress}
                  loadingState={[loadingSafeState, loadingModuleState]}
                  stepIndex={stepIndex}
                  setStepIndex={setStepIndex}
              /> */}
      </Form>
    </Dialog>
  );
};

ControlSafeDialog.displayName = displayName;

export default ControlSafeDialog;
