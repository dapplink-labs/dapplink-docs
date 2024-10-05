/// <reference types="node" />
import * as vite from 'vite';
import { BuildOptions, Logger, UserConfig as UserConfig$1, ConfigEnv, ServerOptions } from 'vite';
export { Plugin, loadEnv } from 'vite';
import { UseDarkOptions } from '@vueuse/core';
import { Options as Options$5 } from '@vitejs/plugin-vue';
import { TransformOptions } from 'stream';
import { ThemeRegistrationAny, BuiltinTheme, LanguageInput, ShikiTransformer, Highlighter } from 'shiki';
import { Options as Options$4 } from 'minisearch';
import { Ref, ComputedRef, ShallowRef } from 'vue';
import { Root } from 'postcss';
import { IncomingMessage, ServerResponse } from 'http';
import { Server, ListenOptions } from 'net';

declare function build(root?: string, buildOptions?: BuildOptions & {
    base?: string;
    mpa?: string;
}): Promise<void>;

type SSRContext = {
    [key: string]: any;
    teleports?: Record<string, string>;
};

type Validate = (text: string, pos: number, self: LinkifyIt) => number | boolean;

interface FullRule {
    validate: string | RegExp | Validate;
    normalize?: ((match: Match) => void) | undefined;
}

type Rule = string | FullRule;

/**
 * An object, where each key/value describes protocol/rule:
 *
 * - __key__ - link prefix (usually, protocol name with `:` at the end, `skype:`
 *   for example). `linkify-it` makes sure that prefix is not preceded with
 *   alphanumeric char and symbols. Only whitespaces and punctuation allowed.
 * - __value__ - rule to check tail after link prefix
 *   - _String_ - just alias to existing rule
 *   - _Object_
 *     - _validate_ - validator function (should return matched length on success),
 *       or `RegExp`.
 *     - _normalize_ - optional function to normalize text & url of matched result
 *       (for example, for `@twitter` mentions).
 */
interface SchemaRules {
    [schema: string]: Rule;
}

interface Options$3 {
    /**
     * recognize URL-s without `http(s):` prefix. Default `true`.
     */
    fuzzyLink?: boolean | undefined;
    /**
     *  allow IPs in fuzzy links above. Can conflict with some texts
     *  like version numbers. Default `false`.
     */
    fuzzyIP?: boolean | undefined;
    /**
     * recognize emails without `mailto:` prefix. Default `true`.
     */
    fuzzyEmail?: boolean | undefined;
}

/**
 * Match result. Single element of array, returned by {@link LinkifyIt#match}.
 */
declare class Match {
    constructor(self: LinkifyIt, shift: number);

    /**
     * First position of matched string.
     */
    index: number;
    /**
     * Next position after matched string.
     */
    lastIndex: number;
    /**
     * Matched string.
     */
    raw: string;
    /**
     * Prefix (protocol) for matched string.
     */
    schema: string;
    /**
     * Normalized text of matched string.
     */
    text: string;
    /**
     * Normalized url of matched string.
     */
    url: string;
}


declare class LinkifyIt {
    /**
     * new LinkifyIt(schemas, options)
     * - schemas (Object): Optional. Additional schemas to validate (prefix/validator)
     * - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
     *
     * Creates new linkifier instance with optional additional schemas.
     * Can be called without `new` keyword for convenience.
     *
     * By default understands:
     *
     * - `http(s)://...` , `ftp://...`, `mailto:...` & `//...` links
     * - "fuzzy" links and emails (example.com, foo@bar.com).
     */
    constructor(schemas?: SchemaRules | Options$3, options?: Options$3);

    // Use overloads to provide contextual typing to `FullRule.normalize`, which is ambiguous with string.normalize
    /**
     * Add new rule definition. See constructor description for details.
     *
     * @param schema rule name (fixed pattern prefix)
     * @param definition schema definition
     */
    add(schema: string, definition: string): this;
    add(schema: string, definition: FullRule | null): this;

    /**
     * Set recognition options for links without schema.
     */
    set(options: Options$3): this;

    /**
     * Searches linkifiable pattern and returns `true` on success or `false` on fail.
     */
    test(text: string): boolean;

    /**
     * Very quick check, that can give false positives. Returns true if link MAY BE
     * can exists. Can be used for speed optimization, when you need to check that
     * link NOT exists.
     */
    pretest(text: string): boolean;

    /**
     * Similar to {@link LinkifyIt#test} but checks only specific protocol tail exactly
     * at given position. Returns length of found pattern (0 on fail).
     *
     * @param text text to scan
     * @param schema rule (schema) name
     * @param pos text offset to check from
     */
    testSchemaAt(text: string, schema: string, pos: number): number;

    /**
     * Returns array of found link descriptions or `null` on fail. We strongly
     * recommend to use {@link LinkifyIt#test} first, for best speed.
     */
    match(text: string): Match[] | null;

    /**
     * Returns fully-formed (not fuzzy) link if it starts at the beginning
     * of the string, and null otherwise.
     */
    matchAtStart(text: string): Match | null;

    /**
     * Load (or merge) new tlds list. Those are user for fuzzy links (without prefix)
     * to avoid false positives. By default this algorythm used:
     *
     * - hostname with any 2-letter root zones are ok.
     * - biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф
     *   are ok.
     * - encoded (`xn--...`) root zones are ok.
     *
     * If list is replaced, then exact match for 2-chars root zones will be checked.
     *
     * @param list list of tlds
     * @param keepOld merge with current list if `true` (`false` by default)
     */
    tlds(list: string | string[], keepOld?: boolean): this;

    /**
     * Default normalizer (if schema does not define it's own).
     */
    normalize(match: Match): void;

    /**
     * Override to modify basic RegExp-s.
     */
    onCompile(): void;

    re: {
        [key: string]: RegExp;
    };
}

declare const decode: {
    defaultChars: string;
    componentChars: string;
    /**
     * Decode percent-encoded string.
     */
    (str: string, exclude?: string): string;
};

declare const encode: {
    defaultChars: string;
    componentChars: string;
    /**
     * Encode unsafe characters with percent-encoding, skipping already
     * encoded sequences.
     *
     * @param str string to encode
     * @param exclude list of characters to ignore (in addition to a-zA-Z0-9)
     * @param keepEscaped don't encode '%' in a correct escape sequence (default: true)
     */
    (str: string, exclude?: string, keepEscaped?: boolean): string;
};

declare class _Url {
    protocol: string;
    slashes: string;
    auth: string;
    port: string;
    hostname: string;
    hash: string;
    search: string;
    pathname: string;

    constructor();

    parse(url: string, slashesDenoteHost?: boolean): this;
    parseHost(host: string): void;
}

type Url = _Url;

declare function parse(url: string | Url, slashesDenoteHost?: boolean): Url;

declare function format(url: Omit<Url, "parse" | "parseHost">): string;

type mdurl_Url = Url;
declare const mdurl_decode: typeof decode;
declare const mdurl_encode: typeof encode;
declare const mdurl_format: typeof format;
declare const mdurl_parse: typeof parse;
declare namespace mdurl {
  export { type mdurl_Url as Url, mdurl_decode as decode, mdurl_encode as encode, mdurl_format as format, mdurl_parse as parse };
}

// import * as ucmicro from "uc.micro";

declare const lib: {
    mdurl: typeof mdurl;
    ucmicro: any;
};

/**
 * Merge objects
 */
declare function assign(obj: any, ...from: any[]): any;

declare function isString(obj: any): obj is string;

declare function has(obj: any, key: keyof any): boolean;

declare function unescapeMd(str: string): string;

declare function unescapeAll(str: string): string;

declare function isValidEntityCode(c: number): boolean;

declare function fromCodePoint(c: number): string;

declare function escapeHtml(str: string): string;

/**
 * Remove element from array and put another array at those position.
 * Useful for some operations with tokens
 */
declare function arrayReplaceAt<T>(src: T[], pos: number, newElements: T[]): T[];

declare function isSpace(code: number): boolean;

/**
 * Zs (unicode class) || [\t\f\v\r\n]
 */
declare function isWhiteSpace(code: number): boolean;

/**
 * Markdown ASCII punctuation characters.
 *
 * !, ", #, $, %, &, ', (, ), *, +, ,, -, ., /, :, ;, <, =, >, ?, @, [, \, ], ^, _, `, {, |, }, or ~
 *
 * Don't confuse with unicode punctuation !!! It lacks some chars in ascii range.
 *
 * @see http://spec.commonmark.org/0.15/#ascii-punctuation-character
 */
declare function isMdAsciiPunct(code: number): boolean;

/**
 * Currently without astral characters support.
 */
declare function isPunctChar(ch: string): boolean;

declare function escapeRE(str: string): string;

/**
 * Helper to unify [reference labels].
 */
declare function normalizeReference(str: string): string;

declare const utils_arrayReplaceAt: typeof arrayReplaceAt;
declare const utils_assign: typeof assign;
declare const utils_escapeHtml: typeof escapeHtml;
declare const utils_escapeRE: typeof escapeRE;
declare const utils_fromCodePoint: typeof fromCodePoint;
declare const utils_has: typeof has;
declare const utils_isMdAsciiPunct: typeof isMdAsciiPunct;
declare const utils_isPunctChar: typeof isPunctChar;
declare const utils_isSpace: typeof isSpace;
declare const utils_isString: typeof isString;
declare const utils_isValidEntityCode: typeof isValidEntityCode;
declare const utils_isWhiteSpace: typeof isWhiteSpace;
declare const utils_lib: typeof lib;
declare const utils_normalizeReference: typeof normalizeReference;
declare const utils_unescapeAll: typeof unescapeAll;
declare const utils_unescapeMd: typeof unescapeMd;
declare namespace utils {
  export { utils_arrayReplaceAt as arrayReplaceAt, utils_assign as assign, utils_escapeHtml as escapeHtml, utils_escapeRE as escapeRE, utils_fromCodePoint as fromCodePoint, utils_has as has, utils_isMdAsciiPunct as isMdAsciiPunct, utils_isPunctChar as isPunctChar, utils_isSpace as isSpace, utils_isString as isString, utils_isValidEntityCode as isValidEntityCode, utils_isWhiteSpace as isWhiteSpace, utils_lib as lib, utils_normalizeReference as normalizeReference, utils_unescapeAll as unescapeAll, utils_unescapeMd as unescapeMd };
}

interface ParseLinkDestinationResult {
    ok: boolean;
    pos: number;
    str: string;
}

declare function parseLinkDestination(str: string, start: number, max: number): ParseLinkDestinationResult;

type Nesting = 1 | 0 | -1;

declare class Token {
    /**
     * Create new token and fill passed properties.
     */
    constructor(type: string, tag: string, nesting: Nesting);

    /**
     * Type of the token, e.g. "paragraph_open"
     */
    type: string;

    /**
     * HTML tag name, e.g. "p"
     */
    tag: string;

    /**
     * HTML attributes. Format: `[ [ name1, value1 ], [ name2, value2 ] ]`
     */
    attrs: Array<[string, string]> | null;

    /**
     * Source map info. Format: `[ line_begin, line_end ]`
     */
    map: [number, number] | null;

    /**
     * Level change (number in {-1, 0, 1} set), where:
     *
     * -  `1` means the tag is opening
     * -  `0` means the tag is self-closing
     * - `-1` means the tag is closing
     */
    nesting: Nesting;

    /**
     * Nesting level, the same as `state.level`
     */
    level: number;

    /**
     * An array of child nodes (inline and img tokens)
     */
    children: Token[] | null;

    /**
     * In a case of self-closing tag (code, html, fence, etc.),
     * it has contents of this tag.
     */
    content: string;

    /**
     * '*' or '_' for emphasis, fence string for fence, etc.
     */
    markup: string;

    /**
     * - Info string for "fence" tokens
     * - The value "auto" for autolink "link_open" and "link_close" tokens
     * - The string value of the item marker for ordered-list "list_item_open" tokens
     */
    info: string;

    /**
     * A place for plugins to store an arbitrary data
     */
    meta: any;

    /**
     * True for block-level tokens, false for inline tokens.
     * Used in renderer to calculate line breaks
     */
    block: boolean;

    /**
     * If it's true, ignore this element when rendering. Used for tight lists
     * to hide paragraphs.
     */
    hidden: boolean;

    /**
     * Search attribute index by name.
     */
    attrIndex(name: string): number;

    /**
     * Add `[ name, value ]` attribute to list. Init attrs if necessary
     */
    attrPush(attrData: [string, string]): void;

    /**
     * Set `name` attribute to `value`. Override old value if exists.
     */
    attrSet(name: string, value: string): void;

    /**
     * Get the value of attribute `name`, or null if it does not exist.
     */
    attrGet(name: string): string | null;

    /**
     * Join value to existing attribute via space. Or create new attribute if not
     * exists. Useful to operate with token classes.
     */
    attrJoin(name: string, value: string): void;
}

interface Scanned {
    can_open: boolean;
    can_close: boolean;
    length: number;
}

interface Delimiter {
    marker: number;
    length: number;
    token: number;
    end: number;
    open: boolean;
    close: boolean;
}

interface TokenMeta {
    delimiters: Delimiter[];
}

declare class StateInline {
    constructor(src: string, md: MarkdownIt, env: any, outTokens: Token[]);

    src: string;
    env: any;
    md: MarkdownIt;
    tokens: Token[];
    tokens_meta: Array<TokenMeta | null>;

    pos: number;
    posMax: number;
    level: number;
    pending: string;
    pendingLevel: number;

    /**
     * Stores { start: end } pairs. Useful for backtrack
     * optimization of pairs parse (emphasis, strikes).
     */
    cache: any;

    /**
     * List of emphasis-like delimiters for current tag
     */
    delimiters: Delimiter[];

    // Stack of delimiter lists for upper level tags
    // _prev_delimiters: StateInline.Delimiter[][];

    /**
     * Flush pending text
     */
    pushPending(): Token;

    /**
     * Push new token to "stream".
     * If pending text exists - flush it as text token
     */
    push(type: string, tag: string, nesting: Nesting): Token;

    /**
     * Scan a sequence of emphasis-like markers, and determine whether
     * it can start an emphasis sequence or end an emphasis sequence.
     *
     * @param start position to scan from (it should point at a valid marker)
     * @param canSplitWord determine if these markers can be found inside a word
     */
    scanDelims(start: number, canSplitWord: boolean): Scanned;

    Token: typeof Token;
}

declare function parseLinkLabel(state: StateInline, start: number, disableNested?: boolean): number;

interface ParseLinkTitleResult {
    /**
     * if `true`, this is a valid link title
     */
    ok: boolean;
    /**
     * if `true`, this link can be continued on the next line
     */
    can_continue: boolean;
    /**
     * if `ok`, it's the position of the first character after the closing marker
     */
    pos: number;
    /**
     * if `ok`, it's the unescaped title
     */
    str: string;
    /**
     * expected closing marker character code
     */
    marker: number;
}

declare function parseLinkTitle(
    str: string,
    start: number,
    max: number,
    prev_state?: ParseLinkTitleResult,
): ParseLinkTitleResult;

declare const helpers_parseLinkDestination: typeof parseLinkDestination;
declare const helpers_parseLinkLabel: typeof parseLinkLabel;
declare const helpers_parseLinkTitle: typeof parseLinkTitle;
declare namespace helpers {
  export { helpers_parseLinkDestination as parseLinkDestination, helpers_parseLinkLabel as parseLinkLabel, helpers_parseLinkTitle as parseLinkTitle };
}

interface RuleOptions {
    /**
     * array with names of "alternate" chains.
     */
    alt: string[];
}

/**
 * Helper class, used by {@link MarkdownIt#core}, {@link MarkdownIt#block} and
 * {@link MarkdownIt#inline} to manage sequences of functions (rules):
 *
 * - keep rules in defined order
 * - assign the name to each rule
 * - enable/disable rules
 * - add/replace rules
 * - allow assign rules to additional named chains (in the same)
 * - caching lists of active rules
 *
 * You will not need use this class directly until write plugins. For simple
 * rules control use {@link MarkdownIt.disable}, {@link MarkdownIt.enable} and
 * {@link MarkdownIt.use}.
 */
declare class Ruler<T> {
    constructor();

    /**
     * Replace rule by name with new function & options. Throws error if name not
     * found.
     *
     * ##### Example
     *
     * Replace existing typographer replacement rule with new one:
     *
     * ```javascript
     * var md = require('markdown-it')();
     *
     * md.core.ruler.at('replacements', function replace(state) {
     *   //...
     * });
     * ```
     *
     * @param name rule name to replace.
     * @param fn new rule function.
     * @param options new rule options (not mandatory).
     */
    at(name: string, fn: T, options?: RuleOptions): void;

    /**
     * Add new rule to chain before one with given name.
     *
     * ##### Example
     *
     * ```javascript
     * var md = require('markdown-it')();
     *
     * md.block.ruler.before('paragraph', 'my_rule', function replace(state) {
     *   //...
     * });
     * ```
     *
     * @see {@link Ruler.after}, {@link Ruler.push}
     *
     * @param beforeName new rule will be added before this one.
     * @param ruleName name of added rule.
     * @param fn rule function.
     * @param options rule options (not mandatory).
     */
    before(beforeName: string, ruleName: string, fn: T, options?: RuleOptions): void;

    /**
     * Add new rule to chain after one with given name.
     *
     * ##### Example
     *
     * ```javascript
     * var md = require('markdown-it')();
     *
     * md.inline.ruler.after('text', 'my_rule', function replace(state) {
     *   //...
     * });
     * ```
     *
     * @see {@link Ruler.before}, {@link Ruler.push}
     *
     * @param afterName new rule will be added after this one.
     * @param ruleName name of added rule.
     * @param fn rule function.
     * @param options rule options (not mandatory).
     */
    after(afterName: string, ruleName: string, fn: T, options?: RuleOptions): void;

    /**
     * Push new rule to the end of chain.
     *
     * ##### Example
     *
     * ```javascript
     * var md = require('markdown-it')();
     *
     * md.core.ruler.push('my_rule', function replace(state) {
     *   //...
     * });
     * ```
     *
     * @see {@link Ruler.before}, {@link Ruler.after}
     *
     * @param ruleName name of added rule.
     * @param fn rule function.
     * @param options rule options (not mandatory).
     */
    push(ruleName: string, fn: T, options?: RuleOptions): void;

    /**
     * Enable rules with given names. If any rule name not found - throw Error.
     * Errors can be disabled by second param.
     *
     * Returns list of found rule names (if no exception happened).
     *
     * @see {@link Ruler.disable}, {@link Ruler.enableOnly}
     *
     * @param list list of rule names to enable.
     * @param ignoreInvalid set `true` to ignore errors when rule not found.
     */
    enable(list: string | string[], ignoreInvalid?: boolean): string[];

    /**
     * Enable rules with given names, and disable everything else. If any rule name
     * not found - throw Error. Errors can be disabled by second param.
     *
     * @see {@link Ruler.disable}, {@link Ruler.enable}
     *
     * @param list list of rule names to enable (whitelist).
     * @param ignoreInvalid set `true` to ignore errors when rule not found.
     */
    enableOnly(list: string | string[], ignoreInvalid?: boolean): void;

    /**
     * Disable rules with given names. If any rule name not found - throw Error.
     * Errors can be disabled by second param.
     *
     * Returns list of found rule names (if no exception happened).
     *
     * @see {@link Ruler.enable}, {@link Ruler.enableOnly}
     *
     * @param list list of rule names to disable.
     * @param ignoreInvalid set `true` to ignore errors when rule not found.
     */
    disable(list: string | string[], ignoreInvalid?: boolean): string[];

    /**
     * Return array of active functions (rules) for given chain name. It analyzes
     * rules configuration, compiles caches if not exists and returns result.
     *
     * Default chain name is `''` (empty string). It can't be skipped. That's
     * done intentionally, to keep signature monomorphic for high speed.
     */
    getRules(chainName: string): T[];
}

type ParentType = "blockquote" | "list" | "root" | "paragraph" | "reference";

declare class StateBlock {
    constructor(src: string, md: MarkdownIt, env: any, tokens: Token[]);

    src: string;

    /**
     * link to parser instance
     */
    md: MarkdownIt;

    env: any;

    //
    // Internal state vartiables
    //

    tokens: Token[];

    /**
     * line begin offsets for fast jumps
     */
    bMarks: number[];
    /**
     * line end offsets for fast jumps
     */
    eMarks: number[];
    /**
     * offsets of the first non-space characters (tabs not expanded)
     */
    tShift: number[];
    /**
     * indents for each line (tabs expanded)
     */
    sCount: number[];

    /**
     * An amount of virtual spaces (tabs expanded) between beginning
     * of each line (bMarks) and real beginning of that line.
     *
     * It exists only as a hack because blockquotes override bMarks
     * losing information in the process.
     *
     * It's used only when expanding tabs, you can think about it as
     * an initial tab length, e.g. bsCount=21 applied to string `\t123`
     * means first tab should be expanded to 4-21%4 === 3 spaces.
     */
    bsCount: number[];

    // block parser variables

    /**
     * required block content indent (for example, if we are
     * inside a list, it would be positioned after list marker)
     */
    blkIndent: number;
    /**
     * line index in src
     */
    line: number;
    /**
     * lines count
     */
    lineMax: number;
    /**
     * loose/tight mode for lists
     */
    tight: boolean;
    /**
     * indent of the current dd block (-1 if there isn't any)
     */
    ddIndent: number;
    /**
     * indent of the current list block (-1 if there isn't any)
     */
    listIndent: number;

    /**
     * used in lists to determine if they interrupt a paragraph
     */
    parentType: ParentType;

    level: number;

    /**
     * Push new token to "stream".
     */
    push(type: string, tag: string, nesting: Nesting): Token;

    isEmpty(line: number): boolean;

    skipEmptyLines(from: number): number;

    /**
     * Skip spaces from given position.
     */
    skipSpaces(pos: number): number;

    /**
     * Skip spaces from given position in reverse.
     */
    skipSpacesBack(pos: number, min: number): number;

    /**
     * Skip char codes from given position
     */
    skipChars(pos: number, code: number): number;

    /**
     * Skip char codes reverse from given position - 1
     */
    skipCharsBack(pos: number, code: number, min: number): number;

    /**
     * cut lines range from source.
     */
    getLines(begin: number, end: number, indent: number, keepLastLF: boolean): string;

    Token: typeof Token;
}

type RuleBlock = (state: StateBlock, startLine: number, endLine: number, silent: boolean) => boolean;

declare class ParserBlock {
    /**
     * {@link Ruler} instance. Keep configuration of block rules.
     */
    ruler: Ruler<RuleBlock>;

    /**
     * Generate tokens for input range
     */
    tokenize(state: StateBlock, startLine: number, endLine: number): void;

    /**
     * Process input string and push block tokens into `outTokens`
     */
    parse(str: string, md: MarkdownIt, env: any, outTokens: Token[]): void;

    State: typeof StateBlock;
}

declare class StateCore {
    constructor(src: string, md: MarkdownIt, env: any);

    src: string;
    env: any;
    tokens: Token[];
    inlineMode: boolean;

    /**
     * link to parser instance
     */
    md: MarkdownIt;

    Token: typeof Token;
}

type RuleCore = (state: StateCore) => void;

declare class Core {
    /**
     * {@link Ruler} instance. Keep configuration of core rules.
     */
    ruler: Ruler<RuleCore>;

    /**
     * Executes core chain rules.
     */
    process(state: StateCore): void;

    State: typeof StateCore;
}

type RuleInline = (state: StateInline, silent: boolean) => boolean;
type RuleInline2 = (state: StateInline) => boolean;

declare class ParserInline {
    /**
     * {@link Ruler} instance. Keep configuration of inline rules.
     */
    ruler: Ruler<RuleInline>;

    /**
     * {@link Ruler} instance. Second ruler used for post-processing
     * (e.g. in emphasis-like rules).
     */
    ruler2: Ruler<RuleInline2>;

    /**
     * Skip single token by running all rules in validation mode;
     * returns `true` if any rule reported success
     */
    skipToken(state: StateInline): void;

    /**
     * Generate tokens for input range
     */
    tokenize(state: StateInline): void;

    /**
     * Process input string and push inline tokens into `outTokens`
     */
    parse(str: string, md: MarkdownIt, env: any, outTokens: Token[]): void;

    State: typeof StateInline;
}

type RenderRule = (tokens: Token[], idx: number, options: Options$2, env: any, self: Renderer) => string;

interface RenderRuleRecord {
    [type: string]: RenderRule | undefined;
    code_inline?: RenderRule | undefined;
    code_block?: RenderRule | undefined;
    fence?: RenderRule | undefined;
    image?: RenderRule | undefined;
    hardbreak?: RenderRule | undefined;
    softbreak?: RenderRule | undefined;
    text?: RenderRule | undefined;
    html_block?: RenderRule | undefined;
    html_inline?: RenderRule | undefined;
}

declare class Renderer {
    /**
     * Creates new {@link Renderer} instance and fill {@link Renderer#rules} with defaults.
     */
    constructor();

    /**
     * Contains render rules for tokens. Can be updated and extended.
     *
     * ##### Example
     *
     * ```javascript
     * var md = require('markdown-it')();
     *
     * md.renderer.rules.strong_open  = function () { return '<b>'; };
     * md.renderer.rules.strong_close = function () { return '</b>'; };
     *
     * var result = md.renderInline(...);
     * ```
     *
     * Each rule is called as independent static function with fixed signature:
     *
     * ```javascript
     * function my_token_render(tokens, idx, options, env, renderer) {
     *   // ...
     *   return renderedHTML;
     * }
     * ```
     *
     * @see https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.mjs
     */
    rules: RenderRuleRecord;

    /**
     * Render token attributes to string.
     */
    renderAttrs(token: Token): string;

    /**
     * Default token renderer. Can be overriden by custom function
     * in {@link Renderer#rules}.
     *
     * @param tokens list of tokens
     * @param idx token index to render
     * @param options params of parser instance
     */
    renderToken(tokens: Token[], idx: number, options: Options$2): string;

    /**
     * The same as {@link Renderer.render}, but for single token of `inline` type.
     *
     * @param tokens list of block tokens to render
     * @param options params of parser instance
     * @param env additional data from parsed input (references, for example)
     */
    renderInline(tokens: Token[], options: Options$2, env: any): string;

    /**
     * Special kludge for image `alt` attributes to conform CommonMark spec.
     * Don't try to use it! Spec requires to show `alt` content with stripped markup,
     * instead of simple escaping.
     *
     * @param tokens list of block tokens to render
     * @param options params of parser instance
     * @param env additional data from parsed input (references, for example)
     */
    renderInlineAsText(tokens: Token[], options: Options$2, env: any): string;

    /**
     * Takes token stream and generates HTML. Probably, you will never need to call
     * this method directly.
     *
     * @param tokens list of block tokens to render
     * @param options params of parser instance
     * @param env additional data from parsed input (references, for example)
     */
    render(tokens: Token[], options: Options$2, env: any): string;
}

/**
 * MarkdownIt provides named presets as a convenience to quickly
 * enable/disable active syntax rules and options for common use cases.
 *
 * - ["commonmark"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/commonmark.js) -
 *   configures parser to strict [CommonMark](http://commonmark.org/) mode.
 * - [default](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/default.js) -
 *   similar to GFM, used when no preset name given. Enables all available rules,
 *   but still without html, typographer & autolinker.
 * - ["zero"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/zero.js) -
 *   all rules disabled. Useful to quickly setup your config via `.enable()`.
 *   For example, when you need only `bold` and `italic` markup and nothing else.
 */
type PresetName = "default" | "zero" | "commonmark";

interface Options$2 {
    /**
     * Set `true` to enable HTML tags in source. Be careful!
     * That's not safe! You may need external sanitizer to protect output from XSS.
     * It's better to extend features via plugins, instead of enabling HTML.
     * @default false
     */
    html?: boolean | undefined;

    /**
     * Set `true` to add '/' when closing single tags
     * (`<br />`). This is needed only for full CommonMark compatibility. In real
     * world you will need HTML output.
     * @default false
     */
    xhtmlOut?: boolean | undefined;

    /**
     * Set `true` to convert `\n` in paragraphs into `<br>`.
     * @default false
     */
    breaks?: boolean | undefined;

    /**
     * CSS language class prefix for fenced blocks.
     * Can be useful for external highlighters.
     * @default 'language-'
     */
    langPrefix?: string | undefined;

    /**
     * Set `true` to autoconvert URL-like text to links.
     * @default false
     */
    linkify?: boolean | undefined;

    /**
     * Set `true` to enable [some language-neutral replacement](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js) +
     * quotes beautification (smartquotes).
     * @default false
     */
    typographer?: boolean | undefined;

    /**
     * Double + single quotes replacement
     * pairs, when typographer enabled and smartquotes on. For example, you can
     * use `'«»„“'` for Russian, `'„“‚‘'` for German, and
     * `['«\xA0', '\xA0»', '‹\xA0', '\xA0›']` for French (including nbsp).
     * @default '“”‘’'
     */
    quotes?: string | string[];

    /**
     * Highlighter function for fenced code blocks.
     * Highlighter `function (str, lang, attrs)` should return escaped HTML. It can
     * also return empty string if the source was not changed and should be escaped
     * externally. If result starts with <pre... internal wrapper is skipped.
     * @default null
     */
    highlight?: ((str: string, lang: string, attrs: string) => string) | null | undefined;
}

type PluginSimple = (md: MarkdownIt) => void;
type PluginWithOptions<T = any> = (md: MarkdownIt, options?: T) => void;
type PluginWithParams = (md: MarkdownIt, ...params: any[]) => void;

interface MarkdownItConstructor {
    new(): MarkdownIt;
    new(presetName: PresetName, options?: Options$2): MarkdownIt;
    new(options: Options$2): MarkdownIt;
    (): MarkdownIt;
    (presetName: PresetName, options?: Options$2): MarkdownIt;
    (options: Options$2): MarkdownIt;
}

interface MarkdownIt {
    /**
     * Instance of {@link ParserInline}. You may need it to add new rules when
     * writing plugins. For simple rules control use {@link MarkdownIt.disable} and
     * {@link MarkdownIt.enable}.
     */
    readonly inline: ParserInline;

    /**
     * Instance of {@link ParserBlock}. You may need it to add new rules when
     * writing plugins. For simple rules control use {@link MarkdownIt.disable} and
     * {@link MarkdownIt.enable}.
     */
    readonly block: ParserBlock;

    /**
     * Instance of {@link Core} chain executor. You may need it to add new rules when
     * writing plugins. For simple rules control use {@link MarkdownIt.disable} and
     * {@link MarkdownIt.enable}.
     */
    readonly core: Core;

    /**
     * Instance of {@link Renderer}. Use it to modify output look. Or to add rendering
     * rules for new token types, generated by plugins.
     *
     * ##### Example
     *
     * ```javascript
     * var md = require('markdown-it')();
     *
     * function myToken(tokens, idx, options, env, self) {
     *   //...
     *   return result;
     * };
     *
     * md.renderer.rules['my_token'] = myToken
     * ```
     *
     * See {@link Renderer} docs and [source code](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.js).
     */
    readonly renderer: Renderer;

    /**
     * [linkify-it](https://github.com/markdown-it/linkify-it) instance.
     * Used by [linkify](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/linkify.js)
     * rule.
     */
    readonly linkify: LinkifyIt;

    /**
     * Link validation function. CommonMark allows too much in links. By default
     * we disable `javascript:`, `vbscript:`, `file:` schemas, and almost all `data:...` schemas
     * except some embedded image types.
     *
     * You can change this behaviour:
     *
     * ```javascript
     * var md = require('markdown-it')();
     * // enable everything
     * md.validateLink = function () { return true; }
     * ```
     */
    validateLink(url: string): boolean;

    /**
     * Function used to encode link url to a machine-readable format,
     * which includes url-encoding, punycode, etc.
     */
    normalizeLink(url: string): string;

    /**
     * Function used to decode link url to a human-readable format`
     */
    normalizeLinkText(url: string): string;

    readonly utils: typeof utils;

    readonly helpers: typeof helpers;

    readonly options: Options$2;

    /**
     * *chainable*
     *
     * Set parser options (in the same format as in constructor). Probably, you
     * will never need it, but you can change options after constructor call.
     *
     * ##### Example
     *
     * ```javascript
     * var md = require('markdown-it')()
     *             .set({ html: true, breaks: true })
     *             .set({ typographer: true });
     * ```
     *
     * __Note:__ To achieve the best possible performance, don't modify a
     * `markdown-it` instance options on the fly. If you need multiple configurations
     * it's best to create multiple instances and initialize each with separate
     * config.
     */
    set(options: Options$2): this;

    /**
     * *chainable*, *internal*
     *
     * Batch load of all options and compenent settings. This is internal method,
     * and you probably will not need it. But if you with - see available presets
     * and data structure [here](https://github.com/markdown-it/markdown-it/tree/master/lib/presets)
     *
     * We strongly recommend to use presets instead of direct config loads. That
     * will give better compatibility with next versions.
     */
    configure(presets: PresetName): this;

    /**
     * *chainable*
     *
     * Enable list or rules. It will automatically find appropriate components,
     * containing rules with given names. If rule not found, and `ignoreInvalid`
     * not set - throws exception.
     *
     * ##### Example
     *
     * ```javascript
     * var md = require('markdown-it')()
     *             .enable(['sub', 'sup'])
     *             .disable('smartquotes');
     * ```
     *
     * @param list rule name or list of rule names to enable
     * @param ignoreInvalid set `true` to ignore errors when rule not found.
     */
    enable(list: string | string[], ignoreInvalid?: boolean): this;

    /**
     * *chainable*
     *
     * The same as {@link MarkdownIt.enable}, but turn specified rules off.
     *
     * @param list rule name or list of rule names to disable.
     * @param ignoreInvalid set `true` to ignore errors when rule not found.
     */
    disable(list: string | string[], ignoreInvalid?: boolean): this;

    /**
     * *chainable*
     *
     * Load specified plugin with given params into current parser instance.
     * It's just a sugar to call `plugin(md, params)` with curring.
     *
     * ##### Example
     *
     * ```javascript
     * var iterator = require('markdown-it-for-inline');
     * var md = require('markdown-it')()
     *             .use(iterator, 'foo_replace', 'text', function (tokens, idx) {
     *               tokens[idx].content = tokens[idx].content.replace(/foo/g, 'bar');
     *             });
     * ```
     */
    use(plugin: PluginSimple): this;
    use<T = any>(plugin: PluginWithOptions<T>, options?: T): this;
    use(plugin: PluginWithParams, ...params: any[]): this;

    /**
     * *internal*
     *
     * Parse input string and returns list of block tokens (special token type
     * "inline" will contain list of inline tokens). You should not call this
     * method directly, until you write custom renderer (for example, to produce
     * AST).
     *
     * `env` is used to pass data between "distributed" rules and return additional
     * metadata like reference info, needed for the renderer. It also can be used to
     * inject data in specific cases. Usually, you will be ok to pass `{}`,
     * and then pass updated object to renderer.
     *
     * @param src source string
     * @param env environment sandbox
     */
    parse(src: string, env: any): Token[];

    /**
     * Render markdown string into html. It does all magic for you :).
     *
     * `env` can be used to inject additional metadata (`{}` by default).
     * But you will not need it with high probability. See also comment
     * in {@link MarkdownIt.parse}.
     *
     * @param src source string
     * @param env environment sandbox
     */
    render(src: string, env?: any): string;

    /**
     * *internal*
     *
     * The same as {@link MarkdownIt.parse} but skip all block rules. It returns the
     * block tokens list with the single `inline` element, containing parsed inline
     * tokens in `children` property. Also updates `env` object.
     *
     * @param src source string
     * @param env environment sandbox
     */
    parseInline(src: string, env: any): Token[];

    /**
     * Similar to {@link MarkdownIt.render} but for single paragraph content. Result
     * will NOT be wrapped into `<p>` tags.
     *
     * @param src source string
     * @param env environment sandbox
     */
    renderInline(src: string, env?: any): string;
}

/**
 * Main parser/renderer class.
 *
 * ##### Usage
 *
 * ```javascript
 * // node.js, "classic" way:
 * var MarkdownIt = require('markdown-it'),
 *     md = new MarkdownIt();
 * var result = md.render('# markdown-it rulezz!');
 *
 * // node.js, the same, but with sugar:
 * var md = require('markdown-it')();
 * var result = md.render('# markdown-it rulezz!');
 *
 * // browser without AMD, added to "window" on script load
 * // Note, there are no dash.
 * var md = window.markdownit();
 * var result = md.render('# markdown-it rulezz!');
 * ```
 *
 * Single line rendering, without paragraph wrap:
 *
 * ```javascript
 * var md = require('markdown-it')();
 * var result = md.renderInline('__markdown-it__ rulezz!');
 * ```
 *
 * ##### Example
 *
 * ```javascript
 * // commonmark mode
 * var md = require('markdown-it')('commonmark');
 *
 * // default mode
 * var md = require('markdown-it')();
 *
 * // enable everything
 * var md = require('markdown-it')({
 *   html: true,
 *   linkify: true,
 *   typographer: true
 * });
 * ```
 *
 * ##### Syntax highlighting
 *
 * ```js
 * var hljs = require('highlight.js') // https://highlightjs.org/
 *
 * var md = require('markdown-it')({
 *   highlight: function (str, lang) {
 *     if (lang && hljs.getLanguage(lang)) {
 *       try {
 *         return hljs.highlight(lang, str, true).value;
 *       } catch (__) {}
 *     }
 *
 *     return ''; // use external default escaping
 *   }
 * });
 * ```
 *
 * Or with full wrapper override (if you need assign class to `<pre>`):
 *
 * ```javascript
 * var hljs = require('highlight.js') // https://highlightjs.org/
 *
 * // Actual default values
 * var md = require('markdown-it')({
 *   highlight: function (str, lang) {
 *     if (lang && hljs.getLanguage(lang)) {
 *       try {
 *         return '<pre class="hljs"><code>' +
 *                hljs.highlight(lang, str, true).value +
 *                '</code></pre>';
 *       } catch (__) {}
 *     }
 *
 *     return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
 *   }
 * });
 * ```
 */
declare const MarkdownIt: MarkdownItConstructor;

interface DocSearchProps {
  appId: string
  apiKey: string
  indexName: string
  placeholder?: string
  searchParameters?: SearchOptions
  disableUserPersonalization?: boolean
  initialQuery?: string
  insights?: boolean
  translations?: DocSearchTranslations
}

interface SearchOptions {
  query?: string
  similarQuery?: string
  facetFilters?: string | string[]
  optionalFilters?: string | string[]
  numericFilters?: string | string[]
  tagFilters?: string | string[]
  sumOrFiltersScores?: boolean
  filters?: string
  page?: number
  hitsPerPage?: number
  offset?: number
  length?: number
  attributesToHighlight?: string[]
  attributesToSnippet?: string[]
  attributesToRetrieve?: string[]
  highlightPreTag?: string
  highlightPostTag?: string
  snippetEllipsisText?: string
  restrictHighlightAndSnippetArrays?: boolean
  facets?: string[]
  maxValuesPerFacet?: number
  facetingAfterDistinct?: boolean
  minWordSizefor1Typo?: number
  minWordSizefor2Typos?: number
  allowTyposOnNumericTokens?: boolean
  disableTypoToleranceOnAttributes?: string[]
  queryType?: 'prefixLast' | 'prefixAll' | 'prefixNone'
  removeWordsIfNoResults?: 'none' | 'lastWords' | 'firstWords' | 'allOptional'
  advancedSyntax?: boolean
  advancedSyntaxFeatures?: ('exactPhrase' | 'excludeWords')[]
  optionalWords?: string | string[]
  disableExactOnAttributes?: string[]
  exactOnSingleWordQuery?: 'attribute' | 'none' | 'word'
  alternativesAsExact?: (
    | 'ignorePlurals'
    | 'singleWordSynonym'
    | 'multiWordsSynonym'
  )[]
  enableRules?: boolean
  ruleContexts?: string[]
  distinct?: boolean | number
  analytics?: boolean
  analyticsTags?: string[]
  synonyms?: boolean
  replaceSynonymsInHighlight?: boolean
  minProximity?: number
  responseFields?: string[]
  maxFacetHits?: number
  percentileComputation?: boolean
  clickAnalytics?: boolean
  personalizationImpact?: number
  enablePersonalization?: boolean
  restrictSearchableAttributes?: string[]
  sortFacetValuesBy?: 'count' | 'alpha'
  typoTolerance?: boolean | 'min' | 'strict'
  aroundLatLng?: string
  aroundLatLngViaIP?: boolean
  aroundRadius?: number | 'all'
  aroundPrecision?: number | { from: number; value: number }[]
  minimumAroundRadius?: number
  insideBoundingBox?: number[][]
  insidePolygon?: number[][]
  ignorePlurals?: boolean | string[]
  removeStopWords?: boolean | string[]
  naturalLanguages?: string[]
  getRankingInfo?: boolean
  userToken?: string
  enableABTest?: boolean
  decompoundQuery?: boolean
  relevancyStrictness?: number
}

interface DocSearchTranslations {
  button?: ButtonTranslations$1
  modal?: ModalTranslations$1
}

interface ButtonTranslations$1 {
  buttonText?: string
  buttonAriaLabel?: string
}

interface ModalTranslations$1 extends ScreenStateTranslations {
  searchBox?: SearchBoxTranslations
  footer?: FooterTranslations$1
}

interface ScreenStateTranslations {
  errorScreen?: ErrorScreenTranslations
  startScreen?: StartScreenTranslations
  noResultsScreen?: NoResultsScreenTranslations
}

interface SearchBoxTranslations {
  resetButtonTitle?: string
  resetButtonAriaLabel?: string
  cancelButtonText?: string
  cancelButtonAriaLabel?: string
}

interface FooterTranslations$1 {
  selectText?: string
  selectKeyAriaLabel?: string
  navigateText?: string
  navigateUpKeyAriaLabel?: string
  navigateDownKeyAriaLabel?: string
  closeText?: string
  closeKeyAriaLabel?: string
  searchByText?: string
}

interface ErrorScreenTranslations {
  titleText?: string
  helpText?: string
}

interface StartScreenTranslations {
  recentSearchesTitle?: string
  noRecentSearchesText?: string
  saveRecentSearchButtonTitle?: string
  removeRecentSearchButtonTitle?: string
  favoriteSearchesTitle?: string
  removeFavoriteSearchButtonTitle?: string
}

interface NoResultsScreenTranslations {
  noResultsText?: string
  suggestedQueryText?: string
  reportMissingResultsText?: string
  reportMissingResultsLinkText?: string
}

interface LocalSearchTranslations {
  button?: ButtonTranslations
  modal?: ModalTranslations
}

interface ButtonTranslations {
  buttonText?: string
  buttonAriaLabel?: string
}

interface ModalTranslations {
  displayDetails?: string
  resetButtonTitle?: string
  backButtonTitle?: string
  noResultsText?: string
  footer?: FooterTranslations
}

interface FooterTranslations {
  selectText?: string
  selectKeyAriaLabel?: string
  navigateText?: string
  navigateUpKeyAriaLabel?: string
  navigateDownKeyAriaLabel?: string
  closeText?: string
  closeKeyAriaLabel?: string
}

interface PageSplitSection {
  anchor?: string
  titles: string[]
  text: string
}

declare namespace DefaultTheme {
  export interface Config {
    /**
     * The logo file of the site.
     *
     * @example '/logo.svg'
     */
    logo?: ThemeableImage

    /**
     * Overrides the link of the site logo.
     */
    logoLink?: string | { link?: string; rel?: string; target?: string }

    /**
     * Custom site title in navbar. If the value is undefined,
     * `config.title` will be used.
     */
    siteTitle?: string | false

    /**
     * Custom header levels of outline in the aside component.
     *
     * @default 2
     */
    outline?: Outline | Outline['level'] | false

    /**
     * @deprecated Use `outline.label` instead.
     *
     * @default 'On this page'
     */
    outlineTitle?: string

    /**
     * The nav items.
     */
    nav?: NavItem[]

    /**
     * The sidebar items.
     */
    sidebar?: Sidebar

    /**
     * Set to `false` to prevent rendering of aside container.
     * Set to `true` to render the aside to the right.
     * Set to `left` to render the aside to the left.
     *
     * @default true
     */
    aside?: boolean | 'left'

    /**
     * Info for the edit link. If it's undefined, the edit link feature will
     * be disabled.
     */
    editLink?: EditLink

    /**
     * @deprecated Use `lastUpdated.text` instead.
     *
     * Set custom last updated text.
     *
     * @default 'Last updated'
     */
    lastUpdatedText?: string

    lastUpdated?: LastUpdatedOptions

    /**
     * Set custom prev/next labels.
     */
    docFooter?: DocFooter

    /**
     * The social links to be displayed at the end of the nav bar. Perfect for
     * placing links to social services such as GitHub, Twitter, Facebook, etc.
     */
    socialLinks?: SocialLink[]

    /**
     * The footer configuration.
     */
    footer?: Footer

    /**
     * @default 'Appearance'
     */
    darkModeSwitchLabel?: string

    /**
     * @default 'Switch to light theme'
     */
    lightModeSwitchTitle?: string

    /**
     * @default 'Switch to dark theme'
     */
    darkModeSwitchTitle?: string

    /**
     * @default 'Menu'
     */
    sidebarMenuLabel?: string

    /**
     * @default 'Return to top'
     */
    returnToTopLabel?: string

    /**
     * Set custom `aria-label` for language menu button.
     *
     * @default 'Change language'
     */
    langMenuLabel?: string

    search?:
      | { provider: 'local'; options?: LocalSearchOptions }
      | { provider: 'algolia'; options: AlgoliaSearchOptions }

    /**
     * @deprecated Use `search` instead.
     */
    algolia?: AlgoliaSearchOptions

    /**
     * The carbon ads options. Leave it undefined to disable the ads feature.
     */
    carbonAds?: CarbonAdsOptions

    /**
     * Changing locale when current url is `/foo` will redirect to `/locale/foo`.
     *
     * @default true
     */
    i18nRouting?: boolean

    /**
     * Show external link icon in Markdown links.
     *
     * @default false
     */
    externalLinkIcon?: boolean

    /**
     * Customize text of 404 page.
     */
    notFound?: NotFoundOptions
  }

  // nav -----------------------------------------------------------------------

  export type NavItem = NavItemComponent | NavItemWithLink | NavItemWithChildren

  export interface NavItemComponent {
    component: string
    props?: Record<string, any>
  }

  export interface NavItemWithLink {
    text: string
    link: string
    items?: never

    /**
     * `activeMatch` is expected to be a regex string. We can't use actual
     * RegExp object here because it isn't serializable
     */
    activeMatch?: string
    rel?: string
    target?: string
    noIcon?: boolean
  }

  export interface NavItemChildren {
    text?: string
    items: NavItemWithLink[]
  }

  export interface NavItemWithChildren {
    text?: string
    items: (NavItemComponent | NavItemChildren | NavItemWithLink)[]

    /**
     * `activeMatch` is expected to be a regex string. We can't use actual
     * RegExp object here because it isn't serializable
     */
    activeMatch?: string
  }

  // image ---------------------------------------------------------------------

  export type ThemeableImage =
    | string
    | { src: string; alt?: string; [prop: string]: any }
    | { light: string; dark: string; alt?: string; [prop: string]: any }

  export type FeatureIcon =
    | string
    | {
        src: string
        alt?: string
        width?: string
        height?: string
        wrap?: boolean
      }
    | {
        light: string
        dark: string
        alt?: string
        width?: string
        height?: string
        wrap?: boolean
      }

  // sidebar -------------------------------------------------------------------

  export type Sidebar = SidebarItem[] | SidebarMulti

  export interface SidebarMulti {
    [path: string]: SidebarItem[] | { items: SidebarItem[]; base: string }
  }

  export type SidebarItem = {
    /**
     * The text label of the item.
     */
    text?: string

    /**
     * The link of the item.
     */
    link?: string

    /**
     * The children of the item.
     */
    items?: SidebarItem[]

    /**
     * If not specified, group is not collapsible.
     *
     * If `true`, group is collapsible and collapsed by default
     *
     * If `false`, group is collapsible but expanded by default
     */
    collapsed?: boolean

    /**
     * Base path for the children items.
     */
    base?: string

    /**
     * Customize text that appears on the footer of previous/next page.
     */
    docFooterText?: string

    rel?: string
    target?: string
  }

  /**
   * ReturnType of `useSidebar`
   */
  export interface DocSidebar {
    isOpen: Ref<boolean>
    sidebar: ComputedRef<SidebarItem[]>
    sidebarGroups: ComputedRef<SidebarItem[]>
    hasSidebar: ComputedRef<boolean>
    hasAside: ComputedRef<boolean>
    leftAside: ComputedRef<boolean>
    isSidebarEnabled: ComputedRef<boolean>
    open: () => void
    close: () => void
    toggle: () => void
  }

  // edit link -----------------------------------------------------------------

  export interface EditLink {
    /**
     * Pattern for edit link.
     *
     * @example 'https://github.com/vuejs/vitepress/edit/main/docs/:path'
     * @example ({ filePath }) => { ... }
     */
    pattern: string | ((payload: PageData) => string)

    /**
     * Custom text for edit link.
     *
     * @default 'Edit this page'
     */
    text?: string
  }

  // prev-next -----------------------------------------------------------------

  export interface DocFooter {
    /**
     * Custom label for previous page button. Can be set to `false` to disable.
     *
     * @default 'Previous page'
     */
    prev?: string | boolean

    /**
     * Custom label for next page button. Can be set to `false` to disable.
     *
     * @default 'Next page'
     */
    next?: string | boolean
  }

  // social link ---------------------------------------------------------------

  export interface SocialLink {
    icon: SocialLinkIcon
    link: string
    ariaLabel?: string
  }

  export type SocialLinkIcon =
    | 'discord'
    | 'facebook'
    | 'github'
    | 'instagram'
    | 'linkedin'
    | 'mastodon'
    | 'npm'
    | 'slack'
    | 'twitter'
    | 'x'
    | 'youtube'
    | { svg: string }

  // footer --------------------------------------------------------------------

  export interface Footer {
    message?: string
    copyright?: string
  }

  // team ----------------------------------------------------------------------

  export interface TeamMember {
    avatar: string
    name: string
    title?: string
    org?: string
    orgLink?: string
    desc?: string
    links?: SocialLink[]
    sponsor?: string
    actionText?: string
  }

  // local nav -----------------------------------------------------------------

  /**
   * ReturnType of `useLocalNav`.
   */
  export interface DocLocalNav {
    /**
     * The outline headers of the current page.
     */
    headers: ShallowRef<any>

    /**
     * Whether the current page has a local nav. Local nav is shown when the
     * "outline" is present in the page. However, note that the actual
     * local nav visibility depends on the screen width as well.
     */
    hasLocalNav: ComputedRef<boolean>
  }

  // outline -------------------------------------------------------------------

  export interface Outline {
    level?: number | [number, number] | 'deep'
    label?: string
  }

  // local search --------------------------------------------------------------

  export interface LocalSearchOptions {
    /**
     * @default false
     * @deprecated Use `detailedView: false` instead.
     */
    disableDetailedView?: boolean

    /**
     * If `true`, the detailed view will be enabled by default.
     * If `false`, the detailed view will be disabled.
     * If `'auto'`, the detailed view will be disabled by default, but can be enabled by the user.
     *
     * @default 'auto'
     */
    detailedView?: boolean | 'auto'

    /**
     * @default false
     */
    disableQueryPersistence?: boolean

    translations?: LocalSearchTranslations
    locales?: Record<string, Partial<Omit<LocalSearchOptions, 'locales'>>>

    miniSearch?: {
      /**
       * @see https://lucaong.github.io/minisearch/types/MiniSearch.Options.html
       */
      options?: Pick<
        Options$4,
        'extractField' | 'tokenize' | 'processTerm'
      >
      /**
       * @see https://lucaong.github.io/minisearch/types/MiniSearch.SearchOptions.html
       */
      searchOptions?: Options$4['searchOptions']

      /**
       * Overrides the default regex based page splitter.
       * Supports async generator, making it possible to run in true parallel
       * (when used along with `node:child_process` or `worker_threads`)
       * ---
       * This should be especially useful for scalability reasons.
       * ---
       * @param {string} path - absolute path to the markdown source file
       * @param {string} html - document page rendered as html
       */
      _splitIntoSections?: (
        path: string,
        html: string
      ) =>
        | AsyncGenerator<PageSplitSection>
        | Generator<PageSplitSection>
        | Awaitable<PageSplitSection[]>
    }
    /**
     * Allows transformation of content before indexing (node only)
     * Return empty string to skip indexing
     */
    _render?: (
      src: string,
      env: MarkdownEnv,
      md: MarkdownIt
    ) => Awaitable<string>
  }

  // algolia -------------------------------------------------------------------

  /**
   * Algolia search options. Partially copied from
   * `@docsearch/react/dist/esm/DocSearch.d.ts`
   */
  export interface AlgoliaSearchOptions extends DocSearchProps {
    locales?: Record<string, Partial<DocSearchProps>>
  }

  // carbon ads ----------------------------------------------------------------

  export interface CarbonAdsOptions {
    code: string
    placement: string
  }

  // last updated --------------------------------------------------------------

  export interface LastUpdatedOptions {
    /**
     * Set custom last updated text.
     *
     * @default 'Last updated'
     */
    text?: string

    /**
     * Set options for last updated time formatting.
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
     *
     * @default
     * { dateStyle: 'short', timeStyle: 'short' }
     */
    formatOptions?: Intl.DateTimeFormatOptions & { forceLocale?: boolean }
  }

  // not found -----------------------------------------------------------------

  export interface NotFoundOptions {
    /**
     * Set custom not found message.
     *
     * @default 'PAGE NOT FOUND'
     */
    title?: string

    /**
     * Set custom not found description.
     *
     * @default "But if you don't change your direction, and if you keep looking, you may end up where you are heading."
     */
    quote?: string

    /**
     * Set aria label for home link.
     *
     * @default 'go to home'
     */
    linkLabel?: string

    /**
     * Set custom home link text.
     *
     * @default 'Take me home'
     */
    linkText?: string

    /**
     * @default '404'
     */
    code?: string
  }
}

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

/**
 * SFC block extracted from markdown
 */
interface SfcBlock$1 {
  /**
   * The type of the block
   */
  type: string
  /**
   * The content, including open-tag and close-tag
   */
  content: string
  /**
   * The content that stripped open-tag and close-tag off
   */
  contentStripped: string
  /**
   * The open-tag
   */
  tagOpen: string
  /**
   * The close-tag
   */
  tagClose: string
}

interface MarkdownSfcBlocks$1 {
  /**
   * The `<template>` block
   */
  template: SfcBlock$1 | null
  /**
   * The common `<script>` block
   */
  script: SfcBlock$1 | null
  /**
   * The `<script setup>` block
   */
  scriptSetup: SfcBlock$1 | null
  /**
   * All `<script>` blocks.
   *
   * By default, SFC only allows one `<script>` block and one `<script setup>` block.
   * However, some tools may support different types of `<script>`s, so we keep all of them here.
   */
  scripts: SfcBlock$1[]
  /**
   * All `<style>` blocks.
   */
  styles: SfcBlock$1[]
  /**
   * All custom blocks.
   */
  customBlocks: SfcBlock$1[]
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

interface SSGContext extends SSRContext {
  content: string
}

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

// Manually declaring all properties as rollup-plugin-dts
// is unable to merge augmented module declarations

interface MarkdownEnv {
  /**
   * The raw Markdown content without frontmatter
   */
  content?: string
  /**
   * The excerpt that extracted by `@mdit-vue/plugin-frontmatter`
   *
   * - Would be the rendered HTML when `renderExcerpt` is enabled
   * - Would be the raw Markdown when `renderExcerpt` is disabled
   */
  excerpt?: string
  /**
   * The frontmatter that extracted by `@mdit-vue/plugin-frontmatter`
   */
  frontmatter?: Record<string, unknown>
  /**
   * The headers that extracted by `@mdit-vue/plugin-headers`
   */
  headers?: Header[]
  /**
   * SFC blocks that extracted by `@mdit-vue/plugin-sfc`
   */
  sfcBlocks?: MarkdownSfcBlocks$1
  /**
   * The title that extracted by `@mdit-vue/plugin-title`
   */
  title?: string
  path: string
  relativePath: string
  cleanUrls: boolean
  links?: string[]
  includes?: string[]
  realPath?: string
  localeIndex?: string
}

/**
 * How frequently the page is likely to change. This value provides general
 * information to search engines and may not correlate exactly to how often they crawl the page. Please note that the
 * value of this tag is considered a hint and not a command. See
 * <https://www.sitemaps.org/protocol.html#xmlTagDefinitions> for the acceptable
 * values
 */
declare enum EnumChangefreq {
    DAILY = "daily",
    MONTHLY = "monthly",
    ALWAYS = "always",
    HOURLY = "hourly",
    WEEKLY = "weekly",
    YEARLY = "yearly",
    NEVER = "never"
}
/**
 * https://support.google.com/webmasters/answer/74288?hl=en&ref_topic=4581190
 */
interface NewsItem {
    access?: 'Registration' | 'Subscription';
    publication: {
        name: string;
        /**
         * The `<language>` is the language of your publication. Use an ISO 639
         * language code (2 or 3 letters).
         */
        language: string;
    };
    /**
     * @example 'PressRelease, Blog'
     */
    genres?: string;
    /**
     * Article publication date in W3C format, using either the "complete date" (YYYY-MM-DD) format or the "complete date
     * plus hours, minutes, and seconds"
     */
    publication_date: string;
    /**
     * The title of the news article
     * @example 'Companies A, B in Merger Talks'
     */
    title: string;
    /**
     * @example 'business, merger, acquisition'
     */
    keywords?: string;
    /**
     * @example 'NASDAQ:A, NASDAQ:B'
     */
    stock_tickers?: string;
}
/**
 * Sitemap Image
 * https://support.google.com/webmasters/answer/178636?hl=en&ref_topic=4581190
 */
interface Img {
    /**
     * The URL of the image
     * @example 'https://example.com/image.jpg'
     */
    url: string;
    /**
     * The caption of the image
     * @example 'Thanksgiving dinner'
     */
    caption?: string;
    /**
     * The title of the image
     * @example 'Star Wars EP IV'
     */
    title?: string;
    /**
     * The geographic location of the image.
     * @example 'Limerick, Ireland'
     */
    geoLocation?: string;
    /**
     * A URL to the license of the image.
     * @example 'https://example.com/license.txt'
     */
    license?: string;
}
/**
 * https://support.google.com/webmasters/answer/189077
 */
interface LinkItem {
    /**
     * @example 'en'
     */
    lang: string;
    /**
     * @example 'en-us'
     */
    hreflang?: string;
    url: string;
}
/**
 * How to handle errors in passed in urls
 */
declare enum ErrorLevel {
    /**
     * Validation will be skipped and nothing logged or thrown.
     */
    SILENT = "silent",
    /**
     * If an invalid value is encountered, a console.warn will be called with details
     */
    WARN = "warn",
    /**
     * An Error will be thrown on encountering invalid data.
     */
    THROW = "throw"
}
declare type ErrorHandler$1 = (error: Error, level: ErrorLevel) => void;

interface NSArgs {
    news: boolean;
    video: boolean;
    xhtml: boolean;
    image: boolean;
    custom?: string[];
}
interface SitemapStreamOptions extends TransformOptions {
    hostname?: string;
    level?: ErrorLevel;
    lastmodDateOnly?: boolean;
    xmlns?: NSArgs;
    xslUrl?: string;
    errorHandler?: ErrorHandler$1;
}

interface SitemapItem {
    lastmod?: string | number | Date;
    changefreq?: `${EnumChangefreq}`;
    fullPrecisionPriority?: boolean;
    priority?: number;
    news?: NewsItem;
    expires?: string;
    androidLink?: string;
    ampLink?: string;
    url: string;
    video?: any;
    img?: string | Img | (string | Img)[];
    links?: LinkItem[];
    lastmodfile?: string | Buffer | URL;
    lastmodISO?: string;
    lastmodrealtime?: boolean;
}

/**
 * Options of @mdit-vue/plugin-component
 */
interface ComponentPluginOptions {
    /**
     * Extra tags to be treated as block tags.
     *
     * @default []
     */
    blockTags?: string[];
    /**
     * Extra tags to be treated as inline tags.
     *
     * @default []
     */
    inlineTags?: string[];
}

/**
 * Takes a string or object with `content` property, extracts
 * and parses front-matter from the string, then returns an object
 * with `data`, `content` and other [useful properties](#returned-object).
 *
 * ```js
 * var matter = require('gray-matter');
 * console.log(matter('---\ntitle: Home\n---\nOther stuff'));
 * //=> { data: { title: 'Home'}, content: 'Other stuff' }
 * ```
 * @param {Object|String} `input` String, or object with `content` string
 * @param {Object} `options`
 * @return {Object}
 * @api public
 */
declare function matter<
  I extends matter.Input,
  O extends matter.GrayMatterOption<I, O>
>(input: I | { content: I }, options?: O): matter.GrayMatterFile<I>

declare namespace matter {
  type Input = string | Buffer
  interface GrayMatterOption<
    I extends Input,
    O extends GrayMatterOption<I, O>
  > {
    parser?: () => void
    eval?: boolean
    excerpt?: boolean | ((input: I, options: O) => string)
    excerpt_separator?: string
    engines?: {
      [index: string]:
        | ((input: string) => object)
        | { parse: (input: string) => object; stringify?: (data: object) => string }
    }
    language?: string
    delimiters?: string | [string, string]
  }
  interface GrayMatterFile<I extends Input> {
    data: { [key: string]: any }
    content: string
    excerpt?: string
    orig: Buffer | I
    language: string
    matter: string
    stringify(lang: string): string
  }
  
  /**
   * Stringify an object to YAML or the specified language, and
   * append it to the given string. By default, only YAML and JSON
   * can be stringified. See the [engines](#engines) section to learn
   * how to stringify other languages.
   *
   * ```js
   * console.log(matter.stringify('foo bar baz', {title: 'Home'}));
   * // results in:
   * // ---
   * // title: Home
   * // ---
   * // foo bar baz
   * ```
   * @param {String|Object} `file` The content string to append to stringified front-matter, or a file object with `file.content` string.
   * @param {Object} `data` Front matter to stringify.
   * @param {Object} `options` [Options](#options) to pass to gray-matter and [js-yaml].
   * @return {String} Returns a string created by wrapping stringified yaml with delimiters, and appending that to the given string.
   */
  export function stringify<O extends GrayMatterOption<string, O>>(
    file: string | { content: string },
    data: object,
    options?: GrayMatterOption<string, O>
  ): string

  /**
   * Synchronously read a file from the file system and parse
   * front matter. Returns the same object as the [main function](#matter).
   *
   * ```js
   * var file = matter.read('./content/blog-post.md');
   * ```
   * @param {String} `filepath` file path of the file to read.
   * @param {Object} `options` [Options](#options) to pass to gray-matter.
   * @return {Object} Returns [an object](#returned-object) with `data` and `content`
   */
  export function read<O extends GrayMatterOption<string, O>>(
    fp: string,
    options?: GrayMatterOption<string, O>
  ): matter.GrayMatterFile<string>

  /**
   * Returns true if the given `string` has front matter.
   * @param  {String} `string`
   * @param  {Object} `options`
   * @return {Boolean} True if front matter exists.
   */
  export function test<O extends matter.GrayMatterOption<string, O>>(
    str: string,
    options?: GrayMatterOption<string, O>
  ): boolean

  /**
   * Detect the language to use, if one is defined after the
   * first front-matter delimiter.
   * @param  {String} `string`
   * @param  {Object} `options`
   * @return {Object} Object with `raw` (actual language string), and `name`, the language with whitespace trimmed
   */
  export function language<O extends matter.GrayMatterOption<string, O>>(
    str: string,
    options?: GrayMatterOption<string, O>
  ): { name: string; raw: string }
}

type GrayMatterOptions = matter.GrayMatterOption<string, GrayMatterOptions>;
/**
 * Options of @mdit-vue/plugin-frontmatter
 */
interface FrontmatterPluginOptions {
    /**
     * Options of gray-matter
     *
     * @see https://github.com/jonschlinkert/gray-matter#options
     */
    grayMatterOptions?: GrayMatterOptions;
    /**
     * Render the excerpt or not
     *
     * @default true
     */
    renderExcerpt?: boolean;
}
declare module '@mdit-vue/types' {
    interface MarkdownItEnv {
        /**
         * The raw Markdown content without frontmatter
         */
        content?: string;
        /**
         * The excerpt that extracted by `@mdit-vue/plugin-frontmatter`
         *
         * - Would be the rendered HTML when `renderExcerpt` is enabled
         * - Would be the raw Markdown when `renderExcerpt` is disabled
         */
        excerpt?: string;
        /**
         * The frontmatter that extracted by `@mdit-vue/plugin-frontmatter`
         */
        frontmatter?: Record<string, unknown>;
    }
}

interface MarkdownItHeader {
    /**
     * The level of the header
     *
     * `1` to `6` for `<h1>` to `<h6>`
     */
    level: number;
    /**
     * The title of the header
     */
    title: string;
    /**
     * The slug of the header
     *
     * Typically the `id` attr of the header anchor
     */
    slug: string;
    /**
     * Link of the header
     *
     * Typically using `#${slug}` as the anchor hash
     */
    link: string;
    /**
     * The children of the header
     */
    children: MarkdownItHeader[];
}

/**
 * Options of @mdit-vue/plugin-headers
 */
interface HeadersPluginOptions {
    /**
     * A custom slugification function
     *
     * Should use the same slugify function with markdown-it-anchor
     * to ensure the link is matched
     */
    slugify?: (str: string) => string;
    /**
     * A function for formatting header title
     */
    format?: (str: string) => string;
    /**
     * Heading level that going to be extracted
     *
     * Should be a subset of markdown-it-anchor's `level` option
     * to ensure the slug is existed
     *
     * @default [2,3]
     */
    level?: number[];
    /**
     * Should allow headers inside nested blocks or not
     *
     * If set to `true`, headers inside blockquote, list, etc. would also be extracted.
     *
     * @default false
     */
    shouldAllowNested?: boolean;
}
declare module '@mdit-vue/types' {
    interface MarkdownItEnv {
        /**
         * The headers that extracted by `@mdit-vue/plugin-headers`
         */
        headers?: MarkdownItHeader[];
    }
}

/**
 * Options of @mdit-vue/plugin-sfc
 */
interface SfcPluginOptions {
    /**
     * Custom blocks to be extracted
     *
     * @default []
     */
    customBlocks?: string[];
}
/**
 * SFC block that extracted from markdown
 */
interface SfcBlock {
    /**
     * The type of the block
     */
    type: string;
    /**
     * The content, including open-tag and close-tag
     */
    content: string;
    /**
     * The content that stripped open-tag and close-tag off
     */
    contentStripped: string;
    /**
     * The open-tag
     */
    tagOpen: string;
    /**
     * The close-tag
     */
    tagClose: string;
}
interface MarkdownSfcBlocks {
    /**
     * The `<template>` block
     */
    template: SfcBlock | null;
    /**
     * The common `<script>` block
     */
    script: SfcBlock | null;
    /**
     * The `<script setup>` block
     */
    scriptSetup: SfcBlock | null;
    /**
     * All `<script>` blocks.
     *
     * By default, SFC only allows one `<script>` block and one `<script setup>` block.
     * However, some tools may support different types of `<script>`s, so we keep all of them here.
     */
    scripts: SfcBlock[];
    /**
     * All `<style>` blocks.
     */
    styles: SfcBlock[];
    /**
     * All custom blocks.
     */
    customBlocks: SfcBlock[];
}
declare module '@mdit-vue/types' {
    interface MarkdownItEnv {
        /**
         * SFC blocks that extracted by `@mdit-vue/plugin-sfc`
         */
        sfcBlocks?: MarkdownSfcBlocks;
    }
}

/**
 * Options of @mdit-vue/plugin-toc
 */
interface TocPluginOptions {
    /**
     * The pattern serving as the TOC placeholder in your markdown
     *
     * @default /^\[\[toc\]\]$/i
     */
    pattern?: RegExp;
    /**
     * A custom slugification function
     *
     * Should use the same slugify function with markdown-it-anchor
     * to ensure the link is matched
     */
    slugify?: (str: string) => string;
    /**
     * A function for formatting headings
     */
    format?: (str: string) => string;
    /**
     * Heading level that going to be included in the TOC
     *
     * Should be a subset of markdown-it-anchor's `level` option
     * to ensure the link is existed
     *
     * @default [2,3]
     */
    level?: number[];
    /**
     * Should allow headers inside nested blocks or not
     *
     * If set to `true`, headers inside blockquote, list, etc. would also be included.
     *
     * @default false
     */
    shouldAllowNested?: boolean;
    /**
     * HTML tag of the TOC container
     *
     * @default 'nav'
     */
    containerTag?: string;
    /**
     * The class for the TOC container
     *
     * @default 'table-of-contents'
     */
    containerClass?: string;
    /**
     * HTML tag of the TOC list
     *
     * @default 'ul'
     */
    listTag?: 'ol' | 'ul';
    /**
     * The class for the TOC list
     *
     * @default ''
     */
    listClass?: string;
    /**
     * The class for the `<li>` tag
     *
     * @default ''
     */
    itemClass?: string;
    /**
     * The tag of the link inside `<li>` tag
     *
     * @default 'a'
     */
    linkTag?: 'a' | 'router-link';
    /**
     * The class for the link inside the `<li>` tag
     *
     * @default ''
     */
    linkClass?: string;
}

declare namespace anchor {
  export type RenderHref = (slug: string, state: StateCore) => string;
  export type RenderAttrs = (slug: string, state: StateCore) => Record<string, string | number>;

  export interface PermalinkOptions {
    class?: string,
    symbol?: string,
    renderHref?: RenderHref,
    renderAttrs?: RenderAttrs
  }

  export interface HeaderLinkPermalinkOptions extends PermalinkOptions {
    safariReaderFix?: boolean;
  }

  export interface LinkAfterHeaderPermalinkOptions extends PermalinkOptions {
    style?: 'visually-hidden' | 'aria-label' | 'aria-describedby' | 'aria-labelledby',
    assistiveText?: (title: string) => string,
    visuallyHiddenClass?: string,
    space?: boolean | string,
    placement?: 'before' | 'after'
    wrapper?: [string, string] | null
  }

  export interface LinkInsideHeaderPermalinkOptions extends PermalinkOptions {
    space?: boolean | string,
    placement?: 'before' | 'after',
    ariaHidden?: boolean
  }

  export interface AriaHiddenPermalinkOptions extends PermalinkOptions {
    space?: boolean | string,
    placement?: 'before' | 'after'
  }

  export type PermalinkGenerator = (slug: string, opts: PermalinkOptions, state: StateCore, index: number) => void;

  export interface AnchorInfo {
    slug: string;
    title: string;
  }

  export interface AnchorOptions {
    level?: number | number[];

    slugify?(str: string): string;
    slugifyWithState?(str: string, state: StateCore): string;
    getTokensText?(tokens: Token[]): string;

    uniqueSlugStartIndex?: number;
    permalink?: PermalinkGenerator;

    callback?(token: Token, anchor_info: AnchorInfo): void;

    tabIndex?: number | false;
  }

  export const permalink: {
    headerLink: (opts?: HeaderLinkPermalinkOptions) => PermalinkGenerator
    linkAfterHeader: (opts?: LinkAfterHeaderPermalinkOptions) => PermalinkGenerator
    linkInsideHeader: (opts?: LinkInsideHeaderPermalinkOptions) => PermalinkGenerator
    ariaHidden: (opts?: AriaHiddenPermalinkOptions) => PermalinkGenerator
  };
}

declare function anchor(md: MarkdownIt, opts?: anchor.AnchorOptions): void;

interface ContainerOptions {
    infoLabel?: string;
    noteLabel?: string;
    tipLabel?: string;
    warningLabel?: string;
    dangerLabel?: string;
    detailsLabel?: string;
    importantLabel?: string;
    cautionLabel?: string;
}

interface Options$1 {
    /**
     * Support native lazy loading for the `<img>` tag.
     * @default false
     */
    lazyLoading?: boolean;
}

type ThemeOptions = ThemeRegistrationAny | BuiltinTheme | {
    light: ThemeRegistrationAny | BuiltinTheme;
    dark: ThemeRegistrationAny | BuiltinTheme;
};
interface MarkdownOptions extends Options$2 {
    /**
     * Setup markdown-it instance before applying plugins
     */
    preConfig?: (md: MarkdownIt) => void;
    /**
     * Setup markdown-it instance
     */
    config?: (md: MarkdownIt) => void;
    /**
     * Disable cache (experimental)
     */
    cache?: boolean;
    externalLinks?: Record<string, string>;
    /**
     * Custom theme for syntax highlighting.
     *
     * You can also pass an object with `light` and `dark` themes to support dual themes.
     *
     * @example { theme: 'github-dark' }
     * @example { theme: { light: 'github-light', dark: 'github-dark' } }
     *
     * You can use an existing theme.
     * @see https://shiki.style/themes
     * Or add your own theme.
     * @see https://shiki.style/guide/load-theme
     */
    theme?: ThemeOptions;
    /**
     * Languages for syntax highlighting.
     * @see https://shiki.style/languages
     */
    languages?: LanguageInput[];
    /**
     * Custom language aliases.
     *
     * @example { 'my-lang': 'js' }
     * @see https://shiki.style/guide/load-lang#custom-language-aliases
     */
    languageAlias?: Record<string, string>;
    /**
     * Show line numbers in code blocks
     * @default false
     */
    lineNumbers?: boolean;
    /**
     * Fallback language when the specified language is not available.
     */
    defaultHighlightLang?: string;
    /**
     * Transformers applied to code blocks
     * @see https://shiki.style/guide/transformers
     */
    codeTransformers?: ShikiTransformer[];
    /**
     * Setup Shiki instance
     */
    shikiSetup?: (shiki: Highlighter) => void | Promise<void>;
    /**
     * The tooltip text for the copy button in code blocks
     * @default 'Copy Code'
     */
    codeCopyButtonTitle?: string;
    /**
     * Options for `markdown-it-anchor`
     * @see https://github.com/valeriangalliat/markdown-it-anchor
     */
    anchor?: anchor.AnchorOptions;
    /**
     * Options for `markdown-it-attrs`
     * @see https://github.com/arve0/markdown-it-attrs
     */
    attrs?: {
        leftDelimiter?: string;
        rightDelimiter?: string;
        allowedAttributes?: Array<string | RegExp>;
        disable?: boolean;
    };
    /**
     * Options for `markdown-it-emoji`
     * @see https://github.com/markdown-it/markdown-it-emoji
     */
    emoji?: {
        defs?: Record<string, string>;
        enabled?: string[];
        shortcuts?: Record<string, string | string[]>;
    };
    /**
     * Options for `@mdit-vue/plugin-frontmatter`
     * @see https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-frontmatter
     */
    frontmatter?: FrontmatterPluginOptions;
    /**
     * Options for `@mdit-vue/plugin-headers`
     * @see https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-headers
     */
    headers?: HeadersPluginOptions | boolean;
    /**
     * Options for `@mdit-vue/plugin-sfc`
     * @see https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-sfc
     */
    sfc?: SfcPluginOptions;
    /**
     * Options for `@mdit-vue/plugin-toc`
     * @see https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-toc
     */
    toc?: TocPluginOptions;
    /**
     * Options for `@mdit-vue/plugin-component`
     * @see https://github.com/mdit-vue/mdit-vue/tree/main/packages/plugin-component
     */
    component?: ComponentPluginOptions;
    /**
     * Options for `markdown-it-container`
     * @see https://github.com/markdown-it/markdown-it-container
     */
    container?: ContainerOptions;
    /**
     * Math support (experimental)
     *
     * You need to install `markdown-it-mathjax3` and set `math` to `true` to enable it.
     * You can also pass options to `markdown-it-mathjax3` here.
     * @default false
     * @see https://vitepress.dev/guide/markdown#math-equations
     */
    math?: boolean | any;
    image?: Options$1;
    /**
     * Allows disabling the github alerts plugin
     * @default true
     * @see https://vitepress.dev/guide/markdown#github-flavored-alerts
     */
    gfmAlerts?: boolean;
}
type MarkdownRenderer = MarkdownIt;
declare const createMarkdownRenderer: (srcDir: string, options?: MarkdownOptions, base?: string, logger?: Pick<Logger, "warn">) => Promise<MarkdownRenderer>;

type RawConfigExports<ThemeConfig = any> = Awaitable<UserConfig<ThemeConfig>> | (() => Awaitable<UserConfig<ThemeConfig>>);
interface TransformContext {
    page: string;
    siteConfig: SiteConfig;
    siteData: SiteData;
    pageData: PageData;
    title: string;
    description: string;
    head: HeadConfig[];
    content: string;
    assets: string[];
}
interface UserRouteConfig {
    params: Record<string, string>;
    content?: string;
}
type ResolvedRouteConfig = UserRouteConfig & {
    /**
     * the raw route (relative to src root), e.g. foo/[bar].md
     */
    route: string;
    /**
     * the actual path with params resolved (relative to src root), e.g. foo/1.md
     */
    path: string;
    /**
     * absolute fs path
     */
    fullPath: string;
};
interface TransformPageContext {
    siteConfig: SiteConfig;
}
interface UserConfig<ThemeConfig = any> extends LocaleSpecificConfig<ThemeConfig> {
    extends?: RawConfigExports<ThemeConfig>;
    base?: string;
    srcDir?: string;
    srcExclude?: string[];
    outDir?: string;
    assetsDir?: string;
    cacheDir?: string;
    shouldPreload?: (link: string, page: string) => boolean;
    locales?: LocaleConfig<ThemeConfig>;
    router?: {
        prefetchLinks?: boolean;
    };
    appearance?: boolean | 'dark' | 'force-dark' | 'force-auto' | (Omit<UseDarkOptions, 'initialValue'> & {
        initialValue?: 'dark';
    });
    lastUpdated?: boolean;
    contentProps?: Record<string, any>;
    /**
     * MarkdownIt options
     */
    markdown?: MarkdownOptions;
    /**
     * Options to pass on to `@vitejs/plugin-vue`
     */
    vue?: Options$5;
    /**
     * Vite config
     */
    vite?: UserConfig$1 & {
        configFile?: string | false;
    };
    /**
     * Configure the scroll offset when the theme has a sticky header.
     * Can be a number or a selector element to get the offset from.
     * Can also be an array of selectors in case some elements will be
     * invisible due to responsive layout. DappLink will fallback to the next
     * selector if a selector fails to match, or the matched element is not
     * currently visible in viewport.
     */
    scrollOffset?: number | string | string[] | {
        selector: string | string[];
        padding: number;
    };
    /**
     * Enable MPA / zero-JS mode.
     * @experimental
     */
    mpa?: boolean;
    /**
     * Extracts metadata to a separate chunk.
     * @experimental
     */
    metaChunk?: boolean;
    /**
     * Don't fail builds due to dead links.
     *
     * @default false
     */
    ignoreDeadLinks?: boolean | 'localhostLinks' | (string | RegExp | ((link: string) => boolean))[];
    /**
     * Don't force `.html` on URLs.
     *
     * @default false
     */
    cleanUrls?: boolean;
    /**
     * Use web fonts instead of emitting font files to dist.
     * The used theme should import a file named `fonts.(s)css` for this to work.
     * If you are a theme author, to support this, place your web font import
     * between `webfont-marker-begin` and `webfont-marker-end` comments.
     *
     * @default true in webcontainers, else false
     */
    useWebFonts?: boolean;
    /**
     * This option allows you to configure the concurrency of the build.
     * A lower number will reduce the memory usage but will increase the build time.
     *
     * @experimental
     * @default 64
     */
    buildConcurrency?: number;
    /**
     * @experimental
     *
     * source -> destination
     */
    rewrites?: Record<string, string>;
    /**
     * @experimental
     */
    sitemap?: SitemapStreamOptions & {
        hostname: string;
        transformItems?: (items: SitemapItem[]) => Awaitable<SitemapItem[]>;
    };
    /**
     * Build end hook: called when SSG finish.
     * @param siteConfig The resolved configuration.
     */
    buildEnd?: (siteConfig: SiteConfig) => Awaitable<void>;
    /**
     * Render end hook: called when SSR rendering is done.
     */
    postRender?: (context: SSGContext) => Awaitable<SSGContext | void>;
    /**
     * Head transform hook: runs before writing HTML to dist.
     *
     * This build hook will allow you to modify the head adding new entries that cannot be statically added.
     */
    transformHead?: (context: TransformContext) => Awaitable<HeadConfig[] | void>;
    /**
     * HTML transform hook: runs before writing HTML to dist.
     */
    transformHtml?: (code: string, id: string, ctx: TransformContext) => Awaitable<string | void>;
    /**
     * PageData transform hook: runs when rendering markdown to vue
     */
    transformPageData?: (pageData: PageData, ctx: TransformPageContext) => Awaitable<Partial<PageData> | {
        [key: string]: any;
    } | void>;
}
interface SiteConfig<ThemeConfig = any> extends Pick<UserConfig, 'markdown' | 'vue' | 'vite' | 'shouldPreload' | 'router' | 'mpa' | 'metaChunk' | 'lastUpdated' | 'ignoreDeadLinks' | 'cleanUrls' | 'useWebFonts' | 'postRender' | 'buildEnd' | 'transformHead' | 'transformHtml' | 'transformPageData' | 'sitemap'> {
    root: string;
    srcDir: string;
    site: SiteData<ThemeConfig>;
    configPath: string | undefined;
    configDeps: string[];
    themeDir: string;
    outDir: string;
    assetsDir: string;
    cacheDir: string;
    tempDir: string;
    pages: string[];
    dynamicRoutes: {
        routes: ResolvedRouteConfig[];
        fileToModulesMap: Record<string, Set<string>>;
    };
    rewrites: {
        map: Record<string, string | undefined>;
        inv: Record<string, string | undefined>;
    };
    logger: Logger;
    userConfig: UserConfig;
    buildConcurrency: number;
}

declare function resolvePages(srcDir: string, userConfig: UserConfig, logger: Logger): Promise<{
    pages: string[];
    dynamicRoutes: {
        routes: ResolvedRouteConfig[];
        fileToModulesMap: Record<string, Set<string>>;
    };
    rewrites: {
        map: Record<string, string>;
        inv: Record<string, string>;
    };
}>;

type UserConfigFn<ThemeConfig> = (env: ConfigEnv) => UserConfig<ThemeConfig> | Promise<UserConfig<ThemeConfig>>;
type UserConfigExport<ThemeConfig> = UserConfig<ThemeConfig> | Promise<UserConfig<ThemeConfig>> | UserConfigFn<ThemeConfig>;
/**
 * Type config helper
 */
declare function defineConfig(config: UserConfig<DefaultTheme.Config>): UserConfig<DefaultTheme.Config>;
/**
 * Type config helper for custom theme config
 */
declare function defineConfigWithTheme<ThemeConfig>(config: UserConfig<ThemeConfig>): UserConfig<ThemeConfig>;
declare function resolveConfig(root?: string, command?: 'serve' | 'build', mode?: string): Promise<SiteConfig>;
declare function resolveUserConfig(root: string, command: 'serve' | 'build', mode: string): Promise<[UserConfig, string | undefined, string[]]>;
declare function mergeConfig(a: UserConfig, b: UserConfig, isRoot?: boolean): Record<string, any>;
declare function resolveSiteData(root: string, userConfig?: UserConfig, command?: 'serve' | 'build', mode?: string): Promise<SiteData>;

interface GlobOptions {
    absolute?: boolean;
    cwd?: string;
    patterns?: string[];
    ignore?: string[];
    dot?: boolean;
    deep?: number;
    expandDirectories?: boolean;
    onlyDirectories?: boolean;
    onlyFiles?: boolean;
}

interface ContentOptions<T = ContentData[]> {
    /**
     * Include src?
     * @default false
     */
    includeSrc?: boolean;
    /**
     * Render src to HTML and include in data?
     * @default false
     */
    render?: boolean;
    /**
     * If `boolean`, whether to parse and include excerpt? (rendered as HTML)
     *
     * If `function`, control how the excerpt is extracted from the content.
     *
     * If `string`, define a custom separator to be used for extracting the
     * excerpt. Default separator is `---` if `excerpt` is `true`.
     *
     * @see https://github.com/jonschlinkert/gray-matter#optionsexcerpt
     * @see https://github.com/jonschlinkert/gray-matter#optionsexcerpt_separator
     *
     * @default false
     */
    excerpt?: boolean | ((file: {
        data: {
            [key: string]: any;
        };
        content: string;
        excerpt?: string;
    }, options?: any) => void) | string;
    /**
     * Transform the data. Note the data will be inlined as JSON in the client
     * bundle if imported from components or markdown files.
     */
    transform?: (data: ContentData[]) => T | Promise<T>;
    /**
     * Options to pass to `tinyglobby`.
     * You'll need to manually specify `node_modules` and `dist` in
     * `globOptions.ignore` if you've overridden it.
     */
    globOptions?: GlobOptions;
}
interface ContentData {
    url: string;
    src: string | undefined;
    html: string | undefined;
    frontmatter: Record<string, any>;
    excerpt: string | undefined;
}
/**
 * Create a loader object that can be directly used as the default export
 * of a data loader file.
 */
declare function createContentLoader<T = ContentData[]>(
/**
 * files to glob / watch - relative to srcDir
 */
pattern: string | string[], { includeSrc, render, excerpt: renderExcerpt, transform, globOptions }?: ContentOptions<T>): {
    watch: string | string[];
    load: () => Promise<T>;
};

declare enum ScaffoldThemeType {
    Default = "default theme",
    DefaultCustom = "default theme + customization",
    Custom = "custom theme"
}
interface ScaffoldOptions {
    root: string;
    title?: string;
    description?: string;
    theme: ScaffoldThemeType;
    useTs: boolean;
    injectNpmScripts: boolean;
}
declare function init(root: string | undefined): Promise<void>;
declare function scaffold({ root, title, description, theme, useTs, injectNpmScripts }: ScaffoldOptions): string;

interface LoaderModule {
    watch?: string[] | string;
    load: (watchedFiles: string[]) => any;
}
/**
 * Helper for defining loaders with type inference
 */
declare function defineLoader(loader: LoaderModule): LoaderModule;

interface Options {
    prefix?: string | undefined;
    exclude?: ReadonlyArray<string | RegExp> | undefined;
    ignoreFiles?: ReadonlyArray<string | RegExp> | undefined;
    includeFiles?: ReadonlyArray<string | RegExp> | undefined;
    transform?:
        | ((
            prefix: Readonly<string>,
            selector: Readonly<string>,
            prefixedSelector: Readonly<string>,
            file: Readonly<string>,
        ) => string)
        | undefined;
}

declare function postcssPrefixSelector(options: Readonly<Options>): (root: Root) => void;

declare function postcssIsolateStyles(options?: Parameters<typeof postcssPrefixSelector>[0]): ReturnType<typeof postcssPrefixSelector>;

interface ParsedURL {
	pathname: string;
	search: string;
	query: Record<string, string | string[]> | void;
	raw: string;
}

// Thank you: @fwilkerson, @stahlstift
// ---

/** @type {import('http').METHODS} */
type Methods = 'ACL' | 'BIND' | 'CHECKOUT' | 'CONNECT' | 'COPY' | 'DELETE' | 'GET' | 'HEAD' | 'LINK' | 'LOCK' |'M-SEARCH' | 'MERGE' | 'MKACTIVITY' |'MKCALENDAR' | 'MKCOL' | 'MOVE' |'NOTIFY' | 'OPTIONS' | 'PATCH' | 'POST' | 'PRI' | 'PROPFIND' |  'PROPPATCH' |  'PURGE' | 'PUT' | 'REBIND' | 'REPORT' | 'SEARCH' | 'SOURCE' | 'SUBSCRIBE' | 'TRACE' | 'UNBIND' | 'UNLINK' | 'UNLOCK' | 'UNSUBSCRIBE';

type Pattern = RegExp | string;

declare class Trouter<T = Function> {
	find(method: Methods, url: string): {
		params: Record<string, string>;
		handlers: T[];
	};
	add(method: Methods, pattern: Pattern, ...handlers: T[]): this;
	use(pattern: Pattern, ...handlers: T[]): this;
	all(pattern: Pattern, ...handlers: T[]): this;
	get(pattern: Pattern, ...handlers: T[]): this;
	head(pattern: Pattern, ...handlers: T[]): this;
	patch(pattern: Pattern, ...handlers: T[]): this;
	options(pattern: Pattern, ...handlers: T[]): this;
	connect(pattern: Pattern, ...handlers: T[]): this;
	delete(pattern: Pattern, ...handlers: T[]): this;
	trace(pattern: Pattern, ...handlers: T[]): this;
	post(pattern: Pattern, ...handlers: T[]): this;
	put(pattern: Pattern, ...handlers: T[]): this;
}

type Promisable<T> = Promise<T> | T;
type ListenCallback = () => Promisable<void>;

interface IError extends Error {
	code?: number;
	status?: number;
	details?: any;
}

type NextHandler = (err?: string | IError) => Promisable<void>;
type ErrorHandler<T extends Request = Request> = (err: string | IError, req: T, res: Response, next: NextHandler) => Promisable<void>;
type Middleware<T extends IncomingMessage = Request> = (req: T & Request, res: Response, next: NextHandler) => Promisable<void>;

type Response = ServerResponse;

interface Request extends IncomingMessage {
	url: string;
	method: string;
	originalUrl: string;
	params: Record<string, string>;
	path: string;
	search: string;
	query: Record<string,string>;
	body?: any;
	_decoded?: true;
	_parsedUrl: ParsedURL;
}

interface Polka<T extends Request = Request> extends Trouter<Middleware<T>> {
	readonly server: Server;
	readonly wares: Middleware<T>[];

	readonly onError: ErrorHandler<T>;
	readonly onNoMatch: Middleware<T>;

	readonly handler: Middleware<T>;
	parse: (req: IncomingMessage) => ParsedURL;

	use(pattern: RegExp|string, ...handlers: (Polka<T> | Middleware<T>)[]): this;
	use(...handlers: (Polka<T> | Middleware<T>)[]): this;

	listen(port?: number, hostname?: string, backlog?: number, callback?: ListenCallback): this;
	listen(port?: number, hostname?: string, callback?: ListenCallback): this;
	listen(port?: number, backlog?: number, callback?: ListenCallback): this;
	listen(port?: number, callback?: ListenCallback): this;
	listen(path: string, backlog?: number, callback?: ListenCallback): this;
	listen(path: string, callback?: ListenCallback): this;
	listen(options: ListenOptions, callback?: ListenCallback): this;
	listen(handle: any, backlog?: number, callback?: ListenCallback): this;
	listen(handle: any, callback?: ListenCallback): this;
}

interface ServeOptions {
    base?: string;
    root?: string;
    port?: number;
}
declare function serve(options?: ServeOptions): Promise<Polka<Request>>;

declare function createServer(root?: string, serverOptions?: ServerOptions & {
    base?: string;
}, recreateServer?: () => Promise<void>): Promise<vite.ViteDevServer>;

export { type ContentData, type ContentOptions, DefaultTheme, type HeadConfig, type Header, type LoaderModule, type MarkdownOptions, type MarkdownRenderer, type RawConfigExports, type ResolvedRouteConfig, type ScaffoldOptions, ScaffoldThemeType, type ServeOptions, type SiteConfig, type SiteData, type ThemeOptions, type TransformContext, type TransformPageContext, type UserConfig, type UserConfigExport, type UserConfigFn, build, createContentLoader, createMarkdownRenderer, createServer, defineConfig, defineConfigWithTheme, defineLoader, init, mergeConfig, postcssIsolateStyles, resolveConfig, resolvePages, resolveSiteData, resolveUserConfig, scaffold, serve };
