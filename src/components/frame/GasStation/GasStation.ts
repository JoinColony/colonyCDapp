import { connect } from 'react-redux';

import { groupedTransactionsAndMessages } from '~redux/selectors';
import { RootStateRecord } from '~redux/state';

import GasStationContent from './GasStationContent';

export default connect((state: RootStateRecord) => ({
  transactionGroups: groupedTransactionsAndMessages(state).toJS(),
}))(GasStationContent);
