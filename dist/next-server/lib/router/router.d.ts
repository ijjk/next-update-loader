/// <reference types="node" />
import { ParsedUrlQuery } from 'querystring';
import { ComponentType } from 'react';
import { UrlObject } from 'url';
import { MittEmitter } from '../mitt';
import { NextPageContext } from '../utils';
export declare function addBasePath(path: string): string;
export declare function delBasePath(path: string): string;
declare type Url = UrlObject | string;
declare type ComponentRes = {
    page: ComponentType;
    mod: any;
};
export declare type BaseRouter = {
    route: string;
    pathname: string;
    query: ParsedUrlQuery;
    asPath: string;
    basePath: string;
};
export declare type NextRouter = BaseRouter & Pick<Router, 'push' | 'replace' | 'reload' | 'back' | 'prefetch' | 'beforePopState' | 'events' | 'isFallback'>;
export declare type PrefetchOptions = {
    priority?: boolean;
};
declare type RouteInfo = {
    Component: ComponentType;
    __N_SSG?: boolean;
    __N_SSP?: boolean;
    props?: any;
    err?: Error;
    error?: any;
};
declare type Subscription = (data: RouteInfo, App?: ComponentType) => Promise<void>;
declare type BeforePopStateCallback = (state: any) => boolean;
declare type ComponentLoadCancel = (() => void) | null;
declare type HistoryMethod = 'replaceState' | 'pushState';
export default class Router implements BaseRouter {
    route: string;
    pathname: string;
    query: ParsedUrlQuery;
    asPath: string;
    basePath: string;
    /**
     * Map of all components loaded in `Router`
     */
    components: {
        [pathname: string]: RouteInfo;
    };
    sdc: {
        [asPath: string]: object;
    };
    sub: Subscription;
    clc: ComponentLoadCancel;
    pageLoader: any;
    _bps: BeforePopStateCallback | undefined;
    events: MittEmitter;
    _wrapApp: (App: ComponentType) => any;
    isSsr: boolean;
    isFallback: boolean;
    static events: MittEmitter;
    constructor(pathname: string, query: ParsedUrlQuery, as: string, { initialProps, pageLoader, App, wrapApp, Component, err, subscription, isFallback, }: {
        subscription: Subscription;
        initialProps: any;
        pageLoader: any;
        Component: ComponentType;
        App: ComponentType;
        wrapApp: (App: ComponentType) => any;
        err?: Error;
        isFallback: boolean;
    });
    static _rewriteUrlForNextExport(url: string): string;
    onPopState: (e: PopStateEvent) => void;
    update(route: string, mod: any): void;
    reload(): void;
    /**
     * Go back in history
     */
    back(): void;
    /**
     * Performs a `pushState` with arguments
     * @param url of the route
     * @param as masks `url` for the browser
     * @param options object you can define `shallow` and other options
     */
    push(url: Url, as?: Url, options?: {}): Promise<boolean>;
    /**
     * Performs a `replaceState` with arguments
     * @param url of the route
     * @param as masks `url` for the browser
     * @param options object you can define `shallow` and other options
     */
    replace(url: Url, as?: Url, options?: {}): Promise<boolean>;
    change(method: HistoryMethod, url: string, as: string, options: any): Promise<boolean>;
    changeState(method: HistoryMethod, url: string, as: string, options?: {}): void;
    getRouteInfo(route: string, pathname: string, query: any, as: string, shallow?: boolean): Promise<RouteInfo>;
    set(route: string, pathname: string, query: any, as: string, data: RouteInfo): Promise<void>;
    /**
     * Callback to execute before replacing router state
     * @param cb callback to be executed
     */
    beforePopState(cb: BeforePopStateCallback): void;
    onlyAHashChange(as: string): boolean;
    scrollToHash(as: string): void;
    urlIsNew(asPath: string): boolean;
    /**
     * Prefetch page code, you may wait for the data during page rendering.
     * This feature only works in production!
     * @param url the href of prefetched page
     * @param asPath the as path of the prefetched page
     */
    prefetch(url: string, asPath?: string, options?: PrefetchOptions): Promise<void>;
    fetchComponent(route: string): Promise<ComponentRes>;
    _getData<T>(fn: () => Promise<T>): Promise<T>;
    _getStaticData: (asPath: string) => Promise<object>;
    _getServerData: (asPath: string) => Promise<object>;
    getInitialProps(Component: ComponentType, ctx: NextPageContext): Promise<any>;
    abortComponentLoad(as: string): void;
    notify(data: RouteInfo): Promise<void>;
}
export {};
