import React from 'react';
import { Contact } from 'src/components/StaticPages/Contact';

const _ContactPage = () => {
  return (
    // <PageLayout>
    <Contact />
    // </PageLayout>
  );
};

const ContactPage = React.memo(_ContactPage);
export default ContactPage;
