import React from 'react';
import { useIntl } from 'react-intl';
import { LAZY_CONSENSUS, PAYMENTS, MOTIONS_AND_DISPUTES } from '~constants';
// import FileText from '~images/FileText.svg';
import DocumentHeader from './DocumentHeader';
import LinkWrapper from './LinkWrapper';

const displayName = 'SupportingDocuments';

const SupportingDocuments = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="min-w-[]">
      <div className="pb-5">
        <DocumentHeader />
        {/* <FileText /> */}
        <LinkWrapper url={LAZY_CONSENSUS} text={formatMessage({ id: 'supporting.documents.link1' })} />
      </div>
      <div className="pb-5">
        <DocumentHeader />
        <div className="pb-2">
          {/* <FileText /> */}
          <LinkWrapper url={PAYMENTS} text={formatMessage({ id: 'supporting.documents.link2' })} />
        </div>
        <div>
          <LinkWrapper url={MOTIONS_AND_DISPUTES} text="How Motions and Disputes work" />
        </div>
      </div>
    </div>
  );
};

SupportingDocuments.displayName = displayName;

export default SupportingDocuments;
