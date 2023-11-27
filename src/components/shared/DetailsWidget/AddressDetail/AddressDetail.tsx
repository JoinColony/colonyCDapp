import React from 'react';

import Address from '~shared/Address';

import styles from '../DetailsWidget.css';

const displayName = 'DetailsWidget.AddressDetail';

interface Props {
  address: string;
}

const AddressDetail = ({ address }: Props) => {
  return (
    <div className={styles.value}>
      <Address address={address} maskedAddressStyles={styles.address} />
    </div>
  );
};

AddressDetail.displayName = displayName;

export default AddressDetail;
