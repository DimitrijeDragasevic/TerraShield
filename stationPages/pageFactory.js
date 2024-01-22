import { HomePage } from './homePage';
import {NewWalletPage} from './newWalletPage';
import {SeedPage} from './seedPage';
import { MultiSigPage } from './multiSigPage';
import { LedgerPage } from './ledgerPage';
import { PrivateKeyPage } from './privateKeyPage';



export class PageFactory {
  constructor(browserContext) {
    this.browserContext = browserContext;
    this.pageRegistry = {}; // Cache of created pages
  }

  async createPage(type) {
    // Check if the page is already in the registry and if it's still opened.
    if (this.pageRegistry[type] && !this.pageRegistry[type].page.isClosed()) {
      return this.pageRegistry[type];
    }

    let pageInstance;
    switch (type) {
      case 'newWallet':
        pageInstance = new NewWalletPage(this.browserContext);
        break;
      case 'seed':
        pageInstance = new SeedPage(this.browserContext);
        break;
      case 'multi':
        pageInstance = new MultiSigPage(this.browserContext);
        break;
      case 'ledger':
        pageInstance = new LedgerPage(this.browserContext);
        break;
      case 'home':
        pageInstance = new HomePage(this.browserContext);
        break;
      case 'privateKey':
        pageInstance = new PrivateKeyPage(this.browserContext);
        break;
      default:
        throw new Error('Invalid page type');
    }
    await pageInstance.initialize();
    this.pageRegistry[type] = pageInstance; // Cache the created page
    return pageInstance;
  }
}

// module.exports = PageFactory;
