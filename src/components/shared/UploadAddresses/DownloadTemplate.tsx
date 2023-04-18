import React, { useMemo } from 'react';

import ExternalLink from '~shared/ExternalLink';

import styles from './DownloadTemplate.css';

const DownloadTemplate = () => {
  const fileDownloadUrl = useMemo(() => {
    const blob = new Blob(['Whitelist Address']);
    return URL.createObjectURL(blob);
  }, []);

  return (
    <ExternalLink href={fileDownloadUrl} download="template.csv" className={styles.link}>
      Download template
    </ExternalLink>
  );
};

DownloadTemplate.displayName = 'UploadAddresses.DownloadTemplate';

export default DownloadTemplate;
