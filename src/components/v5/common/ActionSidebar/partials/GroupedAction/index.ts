import { GroupedActionItem } from './GroupedActionItem.tsx';
import { GroupedActionList } from './GroupedActionList.tsx';

const displayName = 'GroupedAction';
GroupedActionItem.displayName = `${displayName}.Item`;
GroupedActionList.displayName = `${displayName}.List`;

const GroupedAction = { Item: GroupedActionItem, List: GroupedActionList };

export default GroupedAction;
