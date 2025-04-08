import { createRequire } from 'module'
import { defineConfig, type DefaultTheme } from 'dapplink-docs'

const require = createRequire(import.meta.url)
const pkg = require('dapplink-docs/package.json')

export const zh = defineConfig({
  lang: 'zh-Hans',
  description: 'DappLink 技术文档',

  themeConfig: {
    nav: nav(),

    sidebar: {
      '/zh/dapplink/': { base: '/zh/dapplink/', items: sidebarDappLink() },
      '/zh/wallet/': { base: '/zh/wallet/', items: sidebarWallet() },
      '/zh/chain/': { base: '/zh/chain/', items: sidebarChain() },
      '/zh/dapps/': { base: '/zh/dapps/', items: sidebarDapp() }
    },

    editLink: {
      pattern:
        'https://github.com/dapplink-labs/dapplink-docs/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },

    footer: {
      message: 'DappLink 开发者',
      copyright: `版权所有 © 2024-${new Date().getFullYear()} DappLink`
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    outline: {
      label: '页面导航'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    langMenuLabel: '多语言',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  }
})

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'DappLink',
      link: '/zh/dapplink/what-is-dapplink',
      activeMatch: '/zh/dapplink/'
    },
    {
      text: '钱包',
      link: '/zh/wallet/overview',
      activeMatch: '/zh/wallet/'
    },
    {
      text: '链抽象',
      link: '/zh/chain/overview',
      activeMatch: '/zh/chain/'
    },
    {
      text: '去中心化应用',
      link: '/zh/dapps/overview',
      activeMatch: '/zh/dapps/'
    },
    {
      text: pkg.version,
      items: [
        {
          text: '更新日志',
          link: 'https://github.com/dapplink-labs/dapplink-docs/blob/main/CHANGELOG.md'
        },
        {
          text: '参与贡献',
          link: 'https://github.com/dapplink-labs/dapplink-docs/blob/main/.github/contributing.md'
        }
      ]
    }
  ]
}

function sidebarDappLink(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '简介',
      collapsed: false,
      items: [
        { text: 'DappLink 是什么', link: 'what-is-dapplink' },
        { text: 'DappLink 核心业务', link: 'core-business' },
        { text: '为什么选择 DappLink', link: 'why-is-dapplink' }
      ]
    },
    {
      text: '一键发钱包',
      collapsed: false,
      items: [{ text: '什么是一键发钱包', link: 'what-is-dapplink-wallet' }]
    },
    {
      text: '一键发公链',
      collapsed: false,
      items: [{ text: '什么是一键发链', link: 'what-is-dapplink-chain' }]
    },
    {
      text: '一键发去中心化组合应用',
      collapsed: false,
      items: [
        { text: '什么是一键发去中心化组合应用', link: 'what-is-dapplink-dapps' }
      ]
    },
    {
      text: 'DappLink Layer3',
      collapsed: false,
      items: [
        { text: 'DappLink Layer3 是什么', link: 'what-is-dapplink-layer3' }
      ]
    }
  ]
}

function sidebarWallet(): DefaultTheme.SidebarItem[] {
  return [
    {
      items: [
        {
          text: '项目介绍',
          base: '/zh/wallet/',
          collapsed: false,
          items: [
            { text: '概述', link: 'overview' },
            { text: '核心功能', link: 'core-function' }
          ]
        },
        {
          text: '项目核心功能模块',
          base: '/zh/wallet/',
          collapsed: false,
          items: [
            { text: '统一签名服务业务流程', link: 'signature' },
            { text: '中心化钱包业务流程', link: 'centralized-wallet' },
            { text: '去中心化钱包业务', link: 'decentralized-wallet' },
            { text: 'MPC 网络', link: 'tss' }
          ]
        },
        {
          text: '交易所钱包业务流详细介绍',
          base: '/zh/wallet/centralized/',
          collapsed: false,
          items: [
            { text: '商户信息提交', link: 'business-submit' },
            { text: '商户 ID 配置', link: 'business-id-config' },
            { text: '业务方配置 Token', link: 'set-chain-token' },
            { text: '批量地址生成', link: 'batch-generate-address' },
            { text: '充值业务', link: 'deposit-flow' },
            { text: '提现业务', link: 'withdraw-flow' },
            { text: '归集业务', link: 'collection-flow' },
            { text: '热转冷', link: 'hot-to-cold' },
            { text: '冷转热', link: 'cold-to-hot' },
            { text: '回滚业务', link: 'fallback' },
            { text: '服务部署方式', link: 'service-deploy' }
          ]
        },
        {
          text: '去中心化钱包业务流详细介绍',
          base: '/zh/wallet/decentralized/',
          collapsed: false,
          items: [
            { text: '钱包地址生成', link: 'wallet-address-gen' },
            { text: '助记词导出', link: 'mnemonic-export' },
            { text: '助记词导入', link: 'mnemonic-import' },
            { text: '私钥导出', link: 'private-export' },
            { text: '私钥导入', link: 'private-import' },
            { text: '收款', link: 'deposit' },
            { text: '转帐', link: 'transform' },
            { text: '钱包余额获取', link: 'get-wallet-balance' },
            { text: '交易记录', link: 'transaction-record' },
            { text: '代币发现功能', link: 'token-find' },
            { text: '行情业务模块', link: 'market-data-module' },
            { text: '资产管理模块', link: 'asset-manager-module' },
            { text: '闪兑', link: 'chain-explorer-api' },
            { text: 'Dapp浏览器', link: 'dapp-explorer' }
          ]
        },
        {
          text: 'PayFi 技术解决方案',
          base: '/zh/wallet/payfi/',
          collapsed: false,
          items: [
            { text: '基于 AI 的无助记词钱包方案', link: 'ai-wallet' },
            { text: '高效性和去中心化 PayFi 应用链', link: 'payfi-appchain' },
            { text: 'PayFi 扫码支付', link: 'payfi-scan' },
            { text: 'PayFi 唤起网页来支付', link: 'payfi-link-network' },
            { text: '去中心化 U 卡支付', link: 'u-card-payment' },
            {
              text: '数字货币卡 + POS 机支付',
              link: 'digital-currency-card-payment'
            },
            { text: '二维码 + POS 机支付', link: 'scan-qr-code-payment' }
          ]
        },
        {
          text: '本地运行测试',
          base: '/zh/wallet/',
          collapsed: false,
          items: [{ text: '本地启动网络', link: 'start-test' }]
        },
        {
          text: '使用 DappLink 测试网络测试',
          base: '/zh/wallet/',
          collapsed: false,
          items: [{ text: '测试网络介绍', link: 'dapplink-testnet' }]
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
          text: '项目介绍',
          base: '/zh/chain/',
          collapsed: false,
          items: [
            { text: '概述', link: 'overview' },
            { text: '功能模块', link: 'core-module' }
          ]
        },
        {
          text: '功能模块详细',
          base: '/zh/chain/',
          collapsed: false,
          items: [
            {
              text: 'RollUp 和证明系统抽象',
              link: 'rollup-and-proof-system-abstraction'
            },
            { text: '跨链抽象', link: 'cross-chain-abstraction' },
            { text: '多重质押协议', link: 'multi-staking-protocol' },
            { text: '快速验证网络抽象', link: 'fast-finality' },
            { text: '模块化可组合 Layer3', link: 'layer3-app-chain' }
          ]
        },
        {
          text: '本地运行测试',
          base: '/zh/chain/',
          collapsed: false,
          items: [
            { text: '本地启动网络', link: 'chain-setup' },
            { text: '开始使用', link: 'start-test' }
          ]
        },
        {
          text: 'DappLink 测试网络测试',
          base: '/zh/chain/',
          collapsed: false,
          items: [
            { text: '测试网络介绍', link: 'dapplink-testnet' },
            { text: 'RPC 链接', link: 'rpc-url' },
            { text: '链接钱包', link: 'connect-wallet' },
            { text: '部署项目', link: 'deploy-project' }
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
          text: '项目介绍',
          base: '/zh/dapps/',
          collapsed: false,
          items: [
            { text: '概述', link: 'overview' },
            { text: '功能模块', link: 'core-module' }
          ]
        },
        {
          text: '功能模块详细',
          base: '/zh/dapps/',
          collapsed: false,
          items: [
            { text: '去中心化交易所', link: 'dex-spot' },
            { text: '去中心化衍生品', link: 'dex-derivatives' },
            { text: '质押借贷协议', link: 'staking-protocol' },
            { text: 'LSP 和重新质押协议', link: 'lsp-restaking' },
            { text: '链上保险', link: 'onchain-insurance' },
            { text: 'PayFi 和 RWA', link: 'payfi-rwa' }
          ]
        },
        {
          text: 'EventFi 案例',
          base: '/zh/dapps/case/',
          collapsed: false,
          items: [
            { text: '本地启动网络', link: 'chain-setup' },
            { text: '开始使用', link: 'start-test' }
          ]
        }
      ]
    }
  ]
}

export const search: DefaultTheme.AlgoliaSearchOptions['locales'] = {
  zh: {
    placeholder: '搜索文档',
    translations: {
      button: {
        buttonText: '搜索文档',
        buttonAriaLabel: '搜索文档'
      },
      modal: {
        searchBox: {
          resetButtonTitle: '清除查询条件',
          resetButtonAriaLabel: '清除查询条件',
          cancelButtonText: '取消',
          cancelButtonAriaLabel: '取消'
        },
        startScreen: {
          recentSearchesTitle: '搜索历史',
          noRecentSearchesText: '没有搜索历史',
          saveRecentSearchButtonTitle: '保存至搜索历史',
          removeRecentSearchButtonTitle: '从搜索历史中移除',
          favoriteSearchesTitle: '收藏',
          removeFavoriteSearchButtonTitle: '从收藏中移除'
        },
        errorScreen: {
          titleText: '无法获取结果',
          helpText: '你可能需要检查你的网络连接'
        },
        footer: {
          selectText: '选择',
          navigateText: '切换',
          closeText: '关闭',
          searchByText: '搜索提供者'
        },
        noResultsScreen: {
          noResultsText: '无法找到相关结果',
          suggestedQueryText: '你可以尝试查询',
          reportMissingResultsText: '你认为该查询应该有结果？',
          reportMissingResultsLinkText: '点击反馈'
        }
      }
    }
  }
}
