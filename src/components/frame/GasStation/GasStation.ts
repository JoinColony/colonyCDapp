import { connect } from 'react-redux';

import { RootStateRecord } from '~redux/state';
import { groupedTransactions } from '~redux/selectors';
import GasStationContent from './GasStationContent';

export default connect((state: RootStateRecord) => ({
  transactionGroups: groupedTransactions(state).toJS(),
}))(GasStationContent);
