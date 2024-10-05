import * as vue from 'vue';
import { Component, InjectionKey, Ref, App, AsyncComponentLoader } from 'vue';
import { UseDarkOptions } from '@vueuse/core';

// types shared between server and client


type Awaitable<T> = T | PromiseLike<T>

interface PageData {
  relativePath: string
  /**
   * differs from relativePath in case of path rewrites
   * empty string if the page is virtual (e.g. 404 page)
   */
  filePath: string
  title: string
  titleTemplate?: string | boolean
  description: string
  headers: Header[]
  frontmatter: Record<string, any>
  params?: Record<string, any>
  isNotFound?: boolean
  lastUpdated?: number
}

interface Header {
  /**
   * The level of the header
   *
   * `1` to `6` for `<h1>` to `<h6>`
   */
  level: number
  /**
   * The title of the header
   */
  title: string
  /**
   * The slug of the header
   *
   * Typically the `id` attr of the header anchor
   */
  slug: string
  /**
   * Link of the header
   *
   * Typically using `#${slug}` as the anchor hash
   */
  link: string
  /**
   * The children of the header
   */
  children: Header[]
}

interface SiteData<ThemeConfig = any> {
  base: string
  cleanUrls?: boolean
  lang: string
  dir: string
  title: string
  titleTemplate?: string | boolean
  description: string
  head: HeadConfig[]
  appearance:
    | boolean
    | 'dark'
    | 'force-dark'
    | 'force-auto'
    | (Omit<UseDarkOptions, 'initialValue'> & { initialValue?: 'dark' })
  themeConfig: ThemeConfig
  scrollOffset:
    | number
    | string
    | string[]
    | { selector: string | string[]; padding: number }
  locales: LocaleConfig<ThemeConfig>
  localeIndex?: string
  contentProps?: Record<string, any>
  router: {
    prefetchLinks: boolean
  }
}

type HeadConfig =
  | [string, Record<string, string>]
  | [string, Record<string, string>, string]

interface LocaleSpecificConfig<ThemeConfig = any> {
  lang?: string
  dir?: string
  title?: string
  titleTemplate?: string | boolean
  description?: string
  head?: HeadConfig[]
  themeConfig?: ThemeConfig
}

type LocaleConfig<ThemeConfig = any> = Record<
  string,
  LocaleSpecificConfig<ThemeConfig> & { label: string; link?: string }
>

declare const inBrowser: boolean;
/**
 * @internal
 */
declare function escapeHtml(str: string): string;

interface Route {
    path: string;
    data: PageData;
    component: Component | null;
}
interface Router {
    /**
     * Current route.
     */
    route: Route;
    /**
     * Navigate to a new URL.
     */
    go: (to?: string) => Promise<void>;
    /**
     * Called before the route changes. Return `false` to cancel the navigation.
     */
    onBeforeRouteChange?: (to: string) => Awaitable<void | boolean>;
    /**
     * Called before the page component is loaded (after the history state is
     * updated). Return `false` to cancel the navigation.
     */
    onBeforePageLoad?: (to: string) => Awaitable<void | boolean>;
    /**
     * Called after the page component is loaded (before the page component is updated).
     */
    onAfterPageLoad?: (to: string) => Awaitable<void>;
    /**
     * Called after the route changes.
     */
    onAfterRouteChanged?: (to: string) => Awaitable<void>;
}
declare function useRouter(): Router;
declare function useRoute(): Route;

declare const dataSymbol: InjectionKey<DappLinkData>;
interface DappLinkData<T = any> {
    /**
     * Site-level metadata
     */
    site: Ref<SiteData<T>>;
    /**
     * themeConfig from .dapplink-docs/config.js
     */
    theme: Ref<T>;
    /**
     * Page-level metadata
     */
    page: Ref<PageData>;
    /**
     * page frontmatter data
     */
    frontmatter: Ref<PageData['frontmatter']>;
    /**
     * dynamic route params
     */
    params: Ref<PageData['params']>;
    title: Ref<string>;
    description: Ref<string>;
    lang: Ref<string>;
    dir: Ref<string>;
    localeIndex: Ref<string>;
    isDark: Ref<boolean>;
    /**
     * Current location hash
     */
    hash: Ref<string>;
}
declare function useData<T = any>(): DappLinkData<T>;

interface EnhanceAppContext {
    app: App;
    router: Router;
    siteData: Ref<SiteData>;
}
interface Theme {
    Layout?: Component;
    enhanceApp?: (ctx: EnhanceAppContext) => Awaitable<void>;
    extends?: Theme;
    /**
     * @deprecated can be replaced by wrapping layout component
     */
    setup?: () => void;
    /**
     * @deprecated Render not found page by checking `useData().page.value.isNotFound` in Layout instead.
     */
    NotFound?: Component;
}

/**
 * Append base to internal (non-relative) urls
 */
declare function withBase(path: string): string;
/**
 * Register callback that is called every time the markdown content is updated
 * in the DOM.
 */
declare function onContentUpdated(fn: () => any): void;
declare function defineClientComponent(loader: AsyncComponentLoader, args?: any[], cb?: () => Awaitable<void>): {
    setup(): () => vue.VNode<vue.RendererNode, vue.RendererElement, {
        [key: string]: any;
    }> | null;
};
declare function getScrollOffset(): number;

declare const Content: vue.DefineComponent<{
    as: {
        type: (ObjectConstructor | StringConstructor)[];
        default: string;
    };
}, () => vue.VNode<vue.RendererNode, vue.RendererElement, {
    [key: string]: any;
}>, unknown, {}, {}, vue.ComponentOptionsMixin, vue.ComponentOptionsMixin, {}, string, vue.PublicProps, Readonly<vue.ExtractPropTypes<{
    as: {
        type: (ObjectConstructor | StringConstructor)[];
        default: string;
    };
}>>, {
    as: string | Record<string, any>;
}, {}>;

export { Content, type DappLinkData, type EnhanceAppContext, type HeadConfig, type Header, type PageData, type Route, type Router, type SiteData, type Theme, escapeHtml as _escapeHtml, dataSymbol, defineClientComponent, getScrollOffset, inBrowser, onContentUpdated, useData, useRoute, useRouter, withBase };
