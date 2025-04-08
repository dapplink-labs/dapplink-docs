import { createRequire } from 'module'
import { defineConfig, type DefaultTheme } from 'dapplink-docs'

const require = createRequire(import.meta.url)
const pkg = require('dapplink-docs/package.json')

export const en = defineConfig({
  lang: 'en-US',
  description: 'DappLink Tech Docs',

  themeConfig: {
    nav: nav(),

    sidebar: {
      '/dapplink/': { base: '/dapplink/', items: sidebarDappLink() },
      '/wallet/': { base: '/wallet/', items: sidebarWallet() },
      '/chain/': { base: '/chain/', items: sidebarChain() },
      '/dapps/': { base: '/chain/', items: sidebarDapp() }
    },

    editLink: {
      pattern:
        'https://github.com/dapplink-labs/dapplink-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    footer: {
      message: 'DappLink Developer Docs.',
      copyright: 'Copyright © 2024-present DappLink'
    }
  }
})

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'DappLink',
      link: '/dapplink/what-is-dapplink',
      activeMatch: '/dapplink/'
    },
    {
      text: 'Wallet',
      link: '/wallet/overview',
      activeMatch: '/wallet/'
    },
    {
      text: 'Chain Abstract',
      link: '/chain/overview',
      activeMatch: '/chain/'
    },
    {
      text: 'Dapps',
      link: '/dapps/overview',
      activeMatch: '/dapps/'
    },
    {
      text: pkg.version,
      items: [
        {
          text: 'Changelog',
          link: 'https://github.com/dapplink-labs/dapplink-docs/blob/main/CHANGELOG.md'
        },
        {
          text: 'Contributing',
          link: 'https://github.com/dapplink-labs/dapplink-docs/blob/main/.github/contributing.md'
        }
      ]
    }
  ]
}

function sidebarDappLink(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Introduction',
      collapsed: false,
      items: [
        { text: 'What is DappLink ？', link: 'what-is-dapplink' },
        { text: 'DappLink Core Business', link: 'core-business' },
        { text: 'Why Choose DappLink', link: 'why-is-dapplink' }
      ]
    },
    {
      text: 'One-Click Wallet Deployment',
      collapsed: false,
      items: [
        {
          text: 'What is One-Click Wallet Deployment ？',
          link: 'what-is-dapplink-wallet'
        }
      ]
    },
    {
      text: 'One-Click Chain Deployment',
      collapsed: false,
      items: [
        {
          text: 'What is One-Click L2&L3 Deployment ？',
          link: 'what-is-dapplink-chain'
        }
      ]
    },
    {
      text: 'One-Click Deployment of Decentralized Composite Applications',
      collapsed: false,
      items: [
        {
          text: 'What are Decentralized Composite Applications ？',
          link: 'what-is-dapplink-dapps'
        }
      ]
    },
    {
      text: 'DappLink Layer3',
      collapsed: false,
      items: [
        { text: 'What is DappLink Layer3 ？', link: 'what-is-dapplink-layer3' }
      ]
    }
  ]
}

function sidebarWallet(): DefaultTheme.SidebarItem[] {
  return [
    {
      items: [
        {
          text: 'Introduction',
          base: '/en/wallet/',
          collapsed: false,
          items: [
            { text: 'Overview', link: 'overview' },
            { text: 'Functional Modules', link: 'core-function' }
          ]
        },
        {
          text: 'Core Functional Modules',
          base: '/en/wallet/',
          collapsed: false,
          items: [
            { text: 'Unified Signature Service Workflow', link: 'signature' },
            { text: 'Centralized Wallet Workflow', link: 'centralized-wallet' },
            {
              text: 'Decentralized Wallet Workflow',
              link: 'decentralized-wallet'
            },
            { text: 'MPC Network', link: 'tss' }
          ]
        },
        {
          text: 'Detailed Overview of Exchange Wallet Business Flow',
          base: '/en/wallet/centralized/',
          collapsed: false,
          items: [
            {
              text: 'Merchant Information Submission',
              link: 'business-submit'
            },
            { text: 'Merchant ID Configuration', link: 'business-id-config' },
            {
              text: 'Token Configuration by Business Party',
              link: 'set-chain-token'
            },
            {
              text: 'Batch Address Generation',
              link: 'batch-generate-address'
            },
            { text: 'Deposit Operation', link: 'deposit-flow' },
            { text: 'Withdrawal Operation', link: 'withdraw-flow' },
            { text: 'Fund Consolidation Operation', link: 'collection-flow' },
            { text: 'Hot-to-Cold Transfer', link: 'hot-to-cold' },
            { text: 'Cold-to-Hot Transfer', link: 'cold-to-hot' },
            { text: 'Rollback Operation', link: 'fallback' },
            { text: 'Service Deployment Method', link: 'service-deploy' }
          ]
        },
        {
          text: 'Detailed Overview of Decentralized Wallet Business Flow',
          base: '/en/wallet/decentralized/',
          collapsed: false,
          items: [
            { text: 'Wallet Address Generation', link: 'wallet-address-gen' },
            { text: 'Mnemonic Export', link: 'mnemonic-export' },
            { text: 'Mnemonic Import', link: 'mnemonic-import' },
            { text: 'Private Key Export', link: 'private-export' },
            { text: 'Private Key Import', link: 'private-import' },
            { text: 'Receive Funds', link: 'deposit' },
            { text: 'Transfer Funds', link: 'transform' },
            { text: 'Fetch Wallet Balance', link: 'get-wallet-balance' },
            { text: 'Transaction History', link: 'transaction-record' },
            { text: 'Token Discovery', link: 'token-find' },
            { text: 'Market Data Module', link: 'market-data-module' },
            { text: 'Asset Management Module', link: 'asset-manager-module' },
            { text: 'Quick Exchange', link: 'quick-exchange' },
            { text: 'DApp Browser', link: 'dapp-explorer' }
          ]
        },
        {
          text: 'PayFi Technical Solution',
          base: '/en/wallet/payfi/',
          collapsed: false,
          items: [
            {
              text: 'AI-Based Mnemonic-Free Wallet Solution',
              link: 'ai-wallet'
            },
            {
              text: 'High-Performance and Decentralized PayFi Application Chain',
              link: 'payfi-appchain'
            },
            { text: 'PayFi QR Code Payment', link: 'payfi-scan' },
            { text: 'PayFi Web-Initiated Payment', link: 'payfi-link-network' },
            { text: 'Decentralized U-Card Payment', link: 'u-card-payment' },
            {
              text: 'Crypto Card + POS Terminal Payment',
              link: 'digital-currency-card-payment'
            },
            {
              text: 'QR Code + POS Terminal Payment',
              link: 'scan-qr-code-payment'
            }
          ]
        },
        {
          text: 'Local Test Run',
          base: '/en/wallet/',
          collapsed: false,
          items: [{ text: 'Local Startup Network', link: 'chain-setup' }]
        },
        {
          text: 'DappLink TestNet',
          base: '/en/wallet/',
          collapsed: false,
          items: [{ text: 'Introduction', link: 'dapplink-testnet' }]
        }
      ]
    }
  ]
}

function sidebarChain(): DefaultTheme.SidebarItem[] {
  return [
    {
      items: [
        {
          text: 'Introduction',
          base: '/en/chain/',
          collapsed: false,
          items: [
            { text: 'Overview', link: 'overview' },
            { text: 'Functional Modules', link: 'core-module' }
          ]
        },
        {
          text: 'Functional Modules Detail',
          base: '/en/chain/',
          collapsed: false,
          items: [
            {
              text: 'RollUp and Proof System Layer',
              link: 'rollup-and-proof-system-abstraction'
            },
            { text: 'Cross-Chain', link: 'cross-chain-abstraction' },
            { text: 'Multi-Staking Protocol', link: 'multi-staking-protocol' },
            { text: 'Fast Finality Network', link: 'fast-finality' },
            { text: 'Modular and Composable Layer3', link: 'layer3-app-chain' }
          ]
        },
        {
          text: 'Local Test Run',
          base: '/en/chain/',
          collapsed: false,
          items: [
            { text: 'Local Startup Network', link: 'chain-setup' },
            { text: 'Quick Start', link: 'start-test' }
          ]
        },
        {
          text: 'DappLink TestNet',
          base: '/en/chain/',
          collapsed: false,
          items: [
            { text: 'Introduction', link: 'dapplink-testnet' },
            { text: 'RPC', link: 'rpc-url' },
            { text: 'Connect Wallet', link: 'connect-wallet' },
            { text: 'Deploy Project', link: 'deploy-project' }
          ]
        }
      ]
    }
  ]
}

function sidebarDapp(): DefaultTheme.SidebarItem[] {
  return [
    {
      items: [
        {
          text: 'Introduction',
          base: '/en/dapps/',
          collapsed: false,
          items: [
            { text: 'Overview', link: 'overview' },
            { text: 'Function Module', link: 'core-module' }
          ]
        },
        {
          text: 'Function Module Detailed',
          base: '/en/dapps/',
          collapsed: false,
          items: [
            { text: 'Dex', link: 'dex-spot' },
            { text: 'Dex Derivatives', link: 'dex-derivatives' },
            { text: 'Staking And Lending', link: 'staking-protocol' },
            { text: 'LSP And ReStaking', link: 'lsp-restaking' },
            { text: 'On Chain Insurance', link: 'onchain-insurance' },
            { text: 'PayFi And RWA', link: 'payfi-rwa' }
          ]
        },
        {
          text: 'EventFi Case',
          base: '/en/dapps/case/',
          collapsed: false,
          items: [
            { text: 'Local network', link: 'chain-setup' },
            { text: 'Start', link: 'start-test' }
          ]
        }
      ]
    }
  ]
}
