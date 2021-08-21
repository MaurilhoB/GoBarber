import EtherealMailProvider from './implementations/EtherealMailProvider';
import SESMailProvider from './implementations/SESMailProvider';

export default {
  ethereal: EtherealMailProvider,
  ses: SESMailProvider,
};
