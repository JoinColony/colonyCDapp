import { useFormContext } from 'react-hook-form';

const displayName = 'Extensions.Accordion.partials.ConnectForm';

const ConnectForm = ({ children }) => {
  const methods = useFormContext();

  return children({ ...methods });
};

ConnectForm.displayName = displayName;

export default ConnectForm;
