import { connect } from 'react-redux';

import { RootStateRecord } from '~redux/state';
import { groupedTransactionsAndMessages } from '~redux/selectors';
import GasStationContent from './GasStationContent';

export default connect((state: RootStateRecord) => ({
  transactionGroups: groupedTransactionsAndMessages(state).toJS(),
}))(GasStationContent);
